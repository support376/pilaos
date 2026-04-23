from __future__ import annotations

import asyncio
import re
from dataclasses import dataclass
from typing import Any

import httpx
from tenacity import (
    AsyncRetrying,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

LOCAL_URL = "https://openapi.naver.com/v1/search/local.json"

_TAG_RE = re.compile(r"<[^>]+>")
_PLACE_ID_PATTERNS = (
    re.compile(r"place\.naver\.com/[^/]+/(\d+)"),
    re.compile(r"place\.naver\.com/(\d+)"),
    re.compile(r"map\.naver\.com/[^?]*place/(\d+)"),
    re.compile(r"/entry/place/(\d+)"),
)


class NaverAuthError(Exception):
    pass


class NaverRateLimitError(Exception):
    pass


@dataclass
class NaverItem:
    title: str
    category: str
    phone: str
    address: str
    road_address: str
    lng: float | None
    lat: float | None
    link: str
    place_id: str | None


def _strip_tags(s: str) -> str:
    return _TAG_RE.sub("", s or "").strip()


def _parse_mapxy(mapx: str | None, mapy: str | None) -> tuple[float | None, float | None]:
    if not mapx or not mapy:
        return None, None
    try:
        x = int(mapx)
        y = int(mapy)
    except ValueError:
        return None, None
    # 네이버는 WGS84 * 10^7 정수로 반환 (현재 API 기본)
    # 값이 너무 크면 분할 적용
    if abs(x) > 1_000_000:
        return x / 1e7, y / 1e7
    # 구형 KATEC 응답 대비: 일단 그대로 반환 (enrichment에서 거리로 필터링)
    return float(x), float(y)


def _extract_place_id(link: str) -> str | None:
    if not link:
        return None
    for pat in _PLACE_ID_PATTERNS:
        m = pat.search(link)
        if m:
            return m.group(1)
    return None


def parse_item(raw: dict[str, Any]) -> NaverItem:
    lng, lat = _parse_mapxy(raw.get("mapx"), raw.get("mapy"))
    link = raw.get("link") or ""
    return NaverItem(
        title=_strip_tags(raw.get("title", "")),
        category=raw.get("category") or "",
        phone=raw.get("telephone") or "",
        address=raw.get("address") or "",
        road_address=raw.get("roadAddress") or "",
        lng=lng,
        lat=lat,
        link=link,
        place_id=_extract_place_id(link),
    )


class NaverClient:
    def __init__(
        self,
        client_id: str,
        client_secret: str,
        *,
        rps: int = 8,
        timeout: float = 10.0,
    ) -> None:
        if not client_id or not client_secret:
            raise ValueError("NAVER_CLIENT_ID/SECRET is empty")
        self._headers = {
            "X-Naver-Client-Id": client_id,
            "X-Naver-Client-Secret": client_secret,
        }
        self._client = httpx.AsyncClient(timeout=timeout, headers=self._headers)
        self._interval = 1.0 / max(rps, 1)
        self._last = 0.0
        self._lock = asyncio.Lock()

    async def close(self) -> None:
        await self._client.aclose()

    async def __aenter__(self) -> "NaverClient":
        return self

    async def __aexit__(self, *exc: Any) -> None:
        await self.close()

    async def _acquire(self) -> None:
        async with self._lock:
            now = asyncio.get_event_loop().time()
            wait = self._interval - (now - self._last)
            if wait > 0:
                await asyncio.sleep(wait)
            self._last = asyncio.get_event_loop().time()

    async def search_local(self, query: str, display: int = 5) -> list[NaverItem]:
        await self._acquire()
        params = {"query": query, "display": max(1, min(5, display)), "sort": "random"}
        async for attempt in AsyncRetrying(
            stop=stop_after_attempt(4),
            wait=wait_exponential(multiplier=1, min=1, max=8),
            retry=retry_if_exception_type(
                (httpx.TransportError, httpx.HTTPStatusError, NaverRateLimitError)
            ),
            reraise=True,
        ):
            with attempt:
                resp = await self._client.get(LOCAL_URL, params=params)
                if resp.status_code in (401, 403):
                    raise NaverAuthError(f"auth failed: {resp.status_code}")
                if resp.status_code == 429:
                    await asyncio.sleep(2.0)
                    raise NaverRateLimitError("429 throttled")
                resp.raise_for_status()
                data = resp.json()
        return [parse_item(x) for x in (data.get("items") or [])]
