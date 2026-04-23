from __future__ import annotations

import math
from dataclasses import dataclass

KOREA_BBOX = {
    "lat_min": 33.0,
    "lat_max": 38.7,
    "lng_min": 124.5,
    "lng_max": 131.2,
}

EARTH_R = 6_371_000.0


@dataclass(frozen=True)
class Cell:
    lng: float
    lat: float
    radius_m: int
    depth: int

    @property
    def key(self) -> str:
        return f"{self.lng:.5f},{self.lat:.5f},{self.radius_m}"


def meters_to_lat_deg(meters: float) -> float:
    return meters / (EARTH_R * math.pi / 180.0)


def meters_to_lng_deg(meters: float, lat: float) -> float:
    return meters / (EARTH_R * math.cos(math.radians(lat)) * math.pi / 180.0)


def generate_initial_grid(
    step_deg: float,
    radius_m: int,
) -> list[Cell]:
    cells: list[Cell] = []
    lat = KOREA_BBOX["lat_min"] + step_deg / 2
    while lat <= KOREA_BBOX["lat_max"]:
        lng = KOREA_BBOX["lng_min"] + step_deg / 2
        while lng <= KOREA_BBOX["lng_max"]:
            cells.append(Cell(lng=lng, lat=lat, radius_m=radius_m, depth=0))
            lng += step_deg
        lat += step_deg
    return cells


def split_cell(parent: Cell) -> list[Cell]:
    new_radius = max(parent.radius_m // 2, 300)
    # 자식 중심점은 부모 반경의 절반만큼 오프셋 (4사분면)
    offset_m = parent.radius_m / 2.0
    dlat = meters_to_lat_deg(offset_m)
    dlng = meters_to_lng_deg(offset_m, parent.lat)

    children: list[Cell] = []
    for sx, sy in ((-1, -1), (-1, 1), (1, -1), (1, 1)):
        children.append(
            Cell(
                lng=parent.lng + sx * dlng,
                lat=parent.lat + sy * dlat,
                radius_m=new_radius,
                depth=parent.depth + 1,
            )
        )
    return children
