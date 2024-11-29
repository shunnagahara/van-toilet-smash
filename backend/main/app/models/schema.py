from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Image(BaseModel):
    id: str
    url: str
    created_at: datetime

    class Config:
        from_attributes = True

class LocalizedInfo(BaseModel):
    name: str
    description: str

    class Config:
        from_attributes = True

class Location(BaseModel):
    id: int
    latitude: float
    longitude: float
    rating: float
    is_open: bool
    images: List[Image]
    ja: LocalizedInfo
    en: LocalizedInfo

    class Config:
        from_attributes = True

class LocationResponse(BaseModel):
    locations: List[Location]

class BoundingBox(BaseModel):
    min_lat: float
    max_lat: float
    min_lng: float
    max_lng: float