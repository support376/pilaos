from __future__ import annotations

import asyncio
from dataclasses import dataclass
from typing import Any

import httpx
from tenacity import (
    AsyncRetrying,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

KEYWORD_URL = "https://dapi.kakao.com/v2/local/search/keyword.json"
PAGE_SIZE = 15
MAX_PAGES = 3
MAX_RETURNABLE = PAGE_SIZE * MAX_PAGES  # 45


class KakaoAuthError(Exception):
    pass


class KakaoRateLimitError(Exception):
    pass


@dataclass
class CellResult:
    total_count: int
    pageable_count: int
    documents: list[dict[str, Any]]

    @property
    def is_full(self) -> bool:
        return self.pageable_count >= MAX_RETURNABLE or self.total_count > MAX_RETURNABLE


class RateLimiter:
    def __init__(self, rps: int) -> None:
        self._interval = 1.0 / max(rps, 1)
        self._lock = asyncio.Lock()
        self._last = 0.0

    async def acquire(self) -> None:
        async with self._lock:
            now = asyncio.get_event_loop().time()
            wait = self._interval - (now - self._last)
            if wait > 0:
                await asyncio.sleep(wait)
            self._last = asyncio.get_event_loop().time()


class KakaoClient:
    def __init__(
        self,
        api_key: str,
        *,
        rps: int = 8,
        timeout: float = 10.0,
    ) -> None:
        if not api_key:
            raise ValueError("KAKAO_REST_API_KEY is empty")
        self._headers = {"Authorization": f"KakaoAK {api_key}"}
        self._limiter = RateLimiter(rps)
        self._client = httpx.AsyncClient(timeout=timeout, headers=self._headers)

    async def close(self) -> None:
        await self._client.aclose()

    async def __aenter__(self) -> "KakaoClient":
        return self

    async def __aexit__(self, *exc: Any) -> None:
        await self.close()

    async def _fetch_page(
        self,
        query: str,
        lng: float,
        lat: float,
        radius: int,
        page: int,
    ) -> dict[str, Any]:
        await self._limiter.acquire()
        params = {
            "query": query,
            "x": f"{lng:.6f}",
            "y": f"{lat:.6f}",
            "radius": str(radius),
            "page": str(page),
            "size": str(PAGE_SIZE),
            "sort": "distance",
        }
        async for attempt in AsyncRetrying(
            stop=stop_after_attempt(4),
            wait=wait_exponential(multiplier=1, min=1, max=10),
            retry=retry_if_exception_type(
                (httpx.TransportError, httpx.HTTPStatusError, KakaoRateLimitError)
            ),
            reraise=True,
        ):
            with attempt:
                resp = await self._client.get(KEYWORD_URL, params=params)
                if resp.status_code == 401 or resp.status_code == 403:
                    raise KakaoAuthError(
                        f"auth failed: {resp.status_code} {resp.text[:200]}"
                    )
                if resp.status_code == 429:
                    await asyncio.sleep(2.0)
                    raise KakaoRateLimitError("429 throttled")
                resp.raise_for_status()
                return resp.json()
        return {}

    async def search_cell(
        self,
        query: str,
        lng: float,
        lat: float,
        radius: int,
    ) -> CellResult:
        first = await self._fetch_page(query, lng, lat, radius, page=1)
        meta = first.get("meta", {}) or {}
        total = int(meta.get("total_count", 0) or 0)
        pageable = int(meta.get("pageable_count", 0) or 0)
        docs: list[dict[str, Any]] = list(first.get("documents", []) or [])

        pages_needed = min(MAX_PAGES, (pageable + PAGE_SIZE - 1) // PAGE_SIZE)
        for page in range(2, pages_needed + 1):
            if meta.get("is_end"):
                break
            data = await self._fetch_page(query, lng, lat, radius, page=page)
            meta = data.get("meta", {}) or {}
            docs.extend(data.get("documents", []) or [])
            if meta.get("is_end"):
                break

        return CellResult(total_count=total, pageable_count=pageable, documents=docs)
