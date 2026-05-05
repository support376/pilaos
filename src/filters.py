from __future__ import annotations

import re

# 상호·카테고리에 "필라테스"가 있어도 스튜디오가 아닌 케이스
NAME_BLACKLIST = (
    "필라테스장비",
    "필라테스 장비",
    "필라테스용품",
    "필라테스 용품",
    "필라테스자격증",
    "필라테스 자격증",
    "필라테스 강사자격",
    "필라테스협회",
    "필라테스학원교재",
)

# 카테고리가 이쪽이면 스튜디오 가능성 높음
POSITIVE_CATEGORY_HINTS = (
    "필라테스",
    "요가,필라테스",
    "운동,레포츠시설",
    "스포츠",
)

# 카테고리/이름이 이쪽이면 거의 확실히 아님
NEGATIVE_CATEGORY_HINTS = (
    "학원 > 취미",
    "도매",
    "소매",
    "쇼핑",
    "가구",
    "제조",
    "사무용품",
)


def classify_pilates(doc: dict) -> tuple[int, str]:
    """하위 호환 wrapper — is_pilates는 1 if industry in (pilates|yoga|both)."""
    industry, reason = classify_industry(doc)
    return (1 if industry in ("pilates", "yoga", "both") else 0), reason


def classify_industry(doc: dict) -> tuple[str, str]:
    """
    returns (industry, reason)
    industry: 'pilates' | 'yoga' | 'both' | 'none'

    이름·카테고리에 두 키워드가 모두 있으면 'both'.
    """
    name = (doc.get("place_name") or "").strip()
    category = (doc.get("category_name") or "").strip()

    if not name:
        return "none", "empty_name"

    for bl in NAME_BLACKLIST:
        if bl in name:
            return "none", f"name_blacklist:{bl}"

    for neg in NEGATIVE_CATEGORY_HINTS:
        if neg in category:
            return "none", f"category_negative:{neg}"

    text = f"{name} {category}".lower()
    has_pilates = ("필라테스" in text) or ("pilates" in text) or ("리포머" in text)
    has_yoga = (
        ("요가" in text) or ("yoga" in text)
        or ("빈야사" in text) or ("아쉬탕가" in text)
        or ("하타" in text) or ("핫요가" in text)
        or ("vinyasa" in text) or ("ashtanga" in text)
    )

    if has_pilates and has_yoga:
        return "both", "name_or_cat:both"
    if has_pilates:
        return "pilates", "name_or_cat:pilates"
    if has_yoga:
        return "yoga", "name_or_cat:yoga"

    # 카테고리만 "요가,필라테스" 류이면 pilates 기본 (DB 호환)
    if any(h in category for h in POSITIVE_CATEGORY_HINTS):
        return "pilates", "category_fallback"

    return "none", "no_signal"


_PUNC_RE = re.compile(r"[\s\-_.,·•&()\[\]<>{}!?'\"/\\]+")
_SUFFIX_RE = re.compile(
    r"(점|지점|센터|스튜디오|스튜디우|아카데미|필라테스)+$"
)


def normalize_name(name: str) -> str:
    """
    '필덱스 강남점 필라테스' → '필덱스강남' 같은 식으로 핵심 토큰만 남김
    매칭 키 생성용. 원본은 보존.
    """
    if not name:
        return ""
    s = name.lower()
    s = _PUNC_RE.sub("", s)
    s = _SUFFIX_RE.sub("", s)
    return s.strip()


_SIDO_ALIASES = {
    "서울특별시": "서울", "서울시": "서울", "서울": "서울",
    "부산광역시": "부산", "부산시": "부산", "부산": "부산",
    "대구광역시": "대구", "대구시": "대구", "대구": "대구",
    "인천광역시": "인천", "인천시": "인천", "인천": "인천",
    "광주광역시": "광주", "광주시": "광주", "광주": "광주",
    "대전광역시": "대전", "대전시": "대전", "대전": "대전",
    "울산광역시": "울산", "울산시": "울산", "울산": "울산",
    "세종특별자치시": "세종", "세종시": "세종", "세종": "세종",
    "경기도": "경기", "경기": "경기",
    "강원특별자치도": "강원", "강원도": "강원", "강원": "강원",
    "충청북도": "충북", "충북": "충북",
    "충청남도": "충남", "충남": "충남",
    "전라북도": "전북",
    "전북특별자치도": "전북", "전북": "전북",
    "전라남도": "전남", "전남": "전남",
    "경상북도": "경북", "경북": "경북",
    "경상남도": "경남", "경남": "경남",
    "제주특별자치도": "제주", "제주도": "제주", "제주": "제주",
}


def parse_sido_sigungu(address: str) -> tuple[str | None, str | None]:
    if not address:
        return None, None
    tokens = address.strip().split()
    if not tokens:
        return None, None
    sido = _SIDO_ALIASES.get(tokens[0])
    sigungu = tokens[1] if len(tokens) > 1 else None
    return sido, sigungu
