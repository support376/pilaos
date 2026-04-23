from __future__ import annotations

import asyncio
import re
from dataclasses import dataclass, field
from typing import Any

import httpx
from tenacity import (
    AsyncRetrying,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

PANEL3_URL = "https://place-api.map.kakao.com/places/panel3/{pid}"

_KAKAO_CHANNEL_NAME_RE = re.compile(r"plusfriend/home/@([^/?\s]+)")
_INSTAGRAM_RE = re.compile(r"instagram\.com/([A-Za-z0-9_.]+)")
_NAVER_BLOG_RE = re.compile(r"blog\.naver\.com/([A-Za-z0-9_\-]+)")


class KakaoDetailRateLimit(Exception):
    pass


@dataclass
class KakaoDetail:
    place_id: str

    homepages: list[str] = field(default_factory=list)
    related_links: list[str] = field(default_factory=list)
    phone: str | None = None

    kakao_channel_name: str | None = None
    kakao_channel_url: str | None = None

    kakao_review_count: int = 0
    kakao_review_score: float = 0.0
    kakao_photo_count: int = 0

    blog_review_urls: list[str] = field(default_factory=list)
    blog_review_count: int = 0

    menu_count: int = 0
    menu_price_min: int | None = None
    menu_price_max: int | None = None

    has_coupon: bool = False

    open_hours_raw: dict | None = None

    # derived
    homepage_url: str | None = None
    instagram_handle: str | None = None
    naver_blog_handle: str | None = None

    raw: dict | None = None

    def classify_links(self) -> None:
        candidates = list(self.homepages) + list(self.related_links)
        for url in candidates:
            if not url:
                continue
            if not self.instagram_handle:
                m = _INSTAGRAM_RE.search(url)
                if m:
                    self.instagram_handle = m.group(1).strip("/").lower()
                    continue
            if not self.naver_blog_handle:
                m = _NAVER_BLOG_RE.search(url)
                if m:
                    self.naver_blog_handle = m.group(1).strip("/").lower()
                    continue
            if not self.homepage_url and "naver.me" not in url:
                if not any(
                    domain in url
                    for domain in ("instagram.com", "blog.naver.com", "facebook.com", "youtube.com")
                ):
                    self.homepage_url = url


def _extract(data: dict, place_id: str) -> KakaoDetail:
    d = KakaoDetail(place_id=place_id, raw=data)

    summary = data.get("summary") or {}
    d.homepages = list(summary.get("homepages") or [])
    rl = summary.get("related_links") or {}
    primary = rl.get("primary_links") or []
    d.related_links = [x.get("url") for x in primary if isinstance(x, dict) and x.get("url")]
    phones = summary.get("phone_numbers") or []
    if phones and isinstance(phones, list):
        d.phone = (phones[0] or {}).get("tel") or None

    tc = data.get("talk_channel") or {}
    channel_scheme = tc.get("channel_home_scheme_link") or ""
    m = _KAKAO_CHANNEL_NAME_RE.search(channel_scheme)
    if m:
        d.kakao_channel_name = m.group(1)
    d.kakao_channel_url = tc.get("plus_friends_link") or tc.get("channel_home_web_url") or None

    km = (data.get("kakaomap_review") or {}).get("score_set") or {}
    d.kakao_review_count = int(km.get("review_count") or 0)
    d.kakao_review_score = float(km.get("average_score") or 0.0)
    d.kakao_photo_count = int(km.get("photo_count") or 0)

    br = data.get("blog_review") or {}
    reviews = br.get("reviews") or []
    d.blog_review_urls = [r.get("origin_url") for r in reviews if isinstance(r, dict) and r.get("origin_url")]
    d.blog_review_count = int(br.get("total_count") or len(d.blog_review_urls))

    menu = (data.get("menu") or {}).get("menus") or {}
    items = menu.get("items") or []
    d.menu_count = len(items)
    prices = [int(x["price"]) for x in items if isinstance(x, dict) and isinstance(x.get("price"), int)]
    if prices:
        d.menu_price_min = min(prices)
        d.menu_price_max = max(prices)

    benefits = data.get("benefits") or {}
    rep = (benefits.get("representative") or {}).get("coupons") or []
    d.has_coupon = bool(rep)

    d.open_hours_raw = data.get("open_hours") or None

    d.classify_links()
    return d


class KakaoDetailClient:
    def __init__(
        self,
        *,
        rps: int = 6,
        timeout: float = 12.0,
    ) -> None:
        self._client = httpx.AsyncClient(
            timeout=timeout,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
                "Accept": "application/json",
                "Accept-Language": "ko-KR,ko;q=0.9",
                "pf": "web",
                "Origin": "https://place.map.kakao.com",
            },
        )
        self._interval = 1.0 / max(rps, 1)
        self._last = 0.0
        self._lock = asyncio.Lock()

    async def close(self) -> None:
        await self._client.aclose()

    async def __aenter__(self) -> "KakaoDetailClient":
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

    async def fetch(self, place_id: str) -> KakaoDetail | None:
        await self._acquire()
        url = PANEL3_URL.format(pid=place_id)
        referer = f"https://place.map.kakao.com/{place_id}"
        headers = {"Referer": referer}

        async for attempt in AsyncRetrying(
            stop=stop_after_attempt(4),
            wait=wait_exponential(multiplier=1, min=1, max=8),
            retry=retry_if_exception_type(
                (httpx.TransportError, httpx.HTTPStatusError, KakaoDetailRateLimit)
            ),
            reraise=True,
        ):
            with attempt:
                resp = await self._client.get(url, headers=headers)
                if resp.status_code == 404:
                    return None
                if resp.status_code == 429:
                    await asyncio.sleep(2.0)
                    raise KakaoDetailRateLimit("429")
                resp.raise_for_status()
                data = resp.json()
        return _extract(data, place_id)
