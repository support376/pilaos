from __future__ import annotations

import math
import re
from difflib import SequenceMatcher

from .filters import normalize_name

_PHONE_DIGITS = re.compile(r"\D+")


def name_similarity(a: str, b: str) -> float:
    na, nb = normalize_name(a), normalize_name(b)
    if not na or not nb:
        return 0.0
    if na == nb:
        return 1.0
    if na in nb or nb in na:
        return 0.9
    return SequenceMatcher(None, na, nb).ratio()


def _addr_tokens(addr: str) -> list[str]:
    if not addr:
        return []
    s = re.sub(r"[^\w가-힣\s\-]", " ", addr)
    return [t for t in s.split() if t]


def address_similarity(a: str, b: str) -> float:
    ta, tb = set(_addr_tokens(a)), set(_addr_tokens(b))
    if not ta or not tb:
        return 0.0
    inter = len(ta & tb)
    union = len(ta | tb)
    return inter / union if union else 0.0


def phone_match(a: str, b: str) -> float:
    da = _PHONE_DIGITS.sub("", a or "")
    db = _PHONE_DIGITS.sub("", b or "")
    if not da or not db:
        return 0.0
    if da == db:
        return 1.0
    # 지역번호 차이는 일부 허용
    if da[-8:] == db[-8:] and len(da) >= 8 and len(db) >= 8:
        return 0.9
    return 0.0


def haversine_m(lng1: float, lat1: float, lng2: float, lat2: float) -> float:
    r = 6_371_000.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlmb = math.radians(lng2 - lng1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlmb / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def geo_score(dist_m: float) -> float:
    if dist_m <= 50:
        return 1.0
    if dist_m <= 150:
        return 0.85
    if dist_m <= 300:
        return 0.6
    if dist_m <= 800:
        return 0.3
    return 0.0


def confidence(
    *,
    name_sim: float,
    addr_sim: float,
    phone: float,
    geo: float,
) -> float:
    """
    가중치:
      name 45%, address 20%, phone 20%, geo 15%
    phone이 완전일치면 bonus로 상한 끌어올림
    """
    base = 0.45 * name_sim + 0.20 * addr_sim + 0.20 * phone + 0.15 * geo
    if phone >= 1.0 and name_sim >= 0.5:
        base = max(base, 0.85)
    if name_sim >= 0.95 and geo >= 0.85:
        base = max(base, 0.85)
    return min(base, 1.0)


def best_match(
    *,
    source_name: str,
    source_address: str,
    source_phone: str,
    source_lng: float,
    source_lat: float,
    candidates: list[dict],
) -> tuple[dict | None, float]:
    """
    candidates: [{name, address, phone, lng, lat, ...}, ...]
    returns (best_candidate, confidence)
    """
    best: dict | None = None
    best_score = 0.0
    for c in candidates:
        ns = name_similarity(source_name, c.get("name", ""))
        as_ = address_similarity(source_address, c.get("address", ""))
        ph = phone_match(source_phone, c.get("phone", ""))
        clng, clat = c.get("lng"), c.get("lat")
        if clng is not None and clat is not None:
            dist = haversine_m(source_lng, source_lat, float(clng), float(clat))
            gs = geo_score(dist)
        else:
            gs = 0.0
        conf = confidence(name_sim=ns, addr_sim=as_, phone=ph, geo=gs)
        if conf > best_score:
            best_score = conf
            best = c
    return best, best_score
