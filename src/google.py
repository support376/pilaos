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

SEARCH_URL = "https://places.googleapis.com/v1/places:searchText"

DEFAULT_FIELD_MASK = ",".join(
    [
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.location",
        "places.rating",
        "places.userRatingCount",
        "places.websiteUri",
        "places.nationalPhoneNumber",
        "places.primaryType",
        "places.businessStatus",
    ]
)


class GoogleAuthError(Exception):
    pass


class GoogleRateLimitError(Exception):
    pass


@dataclass
class GoogleItem:
    place_id: str
    name: str
    address: str
    lng: float | None
    lat: float | None
    rating: float | None
    review_count: int | None
    website: str | None
    phone: str | None
    primary_type: str | None
    status: str | None


def parse_place(p: dict[str, Any]) -> GoogleItem:
    loc = p.get("location") or {}
    display = p.get("displayName") or {}
    return GoogleItem(
        place_id=p.get("id", ""),
        name=(display.get("text") if isinstance(display, dict) else str(display)) or "",
        address=p.get("formattedAddress") or "",
        lng=loc.get("longitude"),
        lat=loc.get("latitude"),
        rating=p.get("rating"),
        review_count=p.get("userRatingCount"),
        website=p.get("websiteUri"),
        phone=p.get("nationalPhoneNumber"),
        primary_type=p.get("primaryType"),
        status=p.get("businessStatus"),
    )


class GoogleClient:
    def __init__(
        self,
        api_key: str,
        *,
        rps: int = 8,
        timeout: float = 10.0,
        field_mask: str = DEFAULT_FIELD_MASK,
    ) -> None:
        if not api_key:
            raise ValueError("GOOGLE_MAPS_API_KEY is empty")
        self._headers = {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": api_key,
            "X-Goog-FieldMask": field_mask,
        }
        self._client = httpx.AsyncClient(timeout=timeout, headers=self._headers)
        self._interval = 1.0 / max(rps, 1)
        self._last = 0.0
        self._lock = asyncio.Lock()

    async def close(self) -> None:
        await self._client.aclose()

    async def __aenter__(self) -> "GoogleClient":
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

    async def search_text(
        self,
        query: str,
        *,
        lng: float | None = None,
        lat: float | None = None,
        radius_m: float = 1500,
        max_results: int = 5,
        language: str = "ko",
        region: str = "KR",
    ) -> list[GoogleItem]:
        await self._acquire()
        body: dict[str, Any] = {
            "textQuery": query,
            "languageCode": language,
            "regionCode": region,
            "maxResultCount": max_results,
        }
        if lng is not None and lat is not None:
            body["locationBias"] = {
                "circle": {
                    "center": {"latitude": lat, "longitude": lng},
                    "radius": radius_m,
                }
            }

        async for attempt in AsyncRetrying(
            stop=stop_after_attempt(4),
            wait=wait_exponential(multiplier=1, min=1, max=8),
            retry=retry_if_exception_type(
                (httpx.TransportError, httpx.HTTPStatusError, GoogleRateLimitError)
            ),
            reraise=True,
        ):
            with attempt:
                resp = await self._client.post(SEARCH_URL, json=body)
                if resp.status_code in (401, 403):
                    raise GoogleAuthError(
                        f"auth failed: {resp.status_code} {resp.text[:200]}"
                    )
                if resp.status_code == 429:
                    await asyncio.sleep(2.0)
                    raise GoogleRateLimitError("429 throttled")
                resp.raise_for_status()
                data = resp.json()
        return [parse_place(p) for p in (data.get("places") or [])]
