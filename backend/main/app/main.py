# app/main.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from .database import SessionLocal, engine, Base
from .models.database import DBLocation, DBImage, DBLocalizedInfo
from .models.schema import Location, LocationResponse, BoundingBox, LocalizedInfo, Image

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"status": "ok"}

@app.get("/api/locations", response_model=LocationResponse)
def get_locations(db: Session = Depends(get_db)):
    locations = db.query(DBLocation).all()
    
    return LocationResponse(
        locations=[
            Location(
                id=loc.id,
                latitude=loc.latitude,
                longitude=loc.longitude,
                rating=loc.rating,
                is_open=loc.is_open,
                images=[
                    Image(
                        id=img.id,
                        url=img.url,
                        created_at=img.created_at
                    ) for img in loc.images
                ],
                ja=LocalizedInfo(
                    name=loc.ja_info[0].name if loc.ja_info else "",
                    description=loc.ja_info[0].description if loc.ja_info else ""
                ) if loc.ja_info else LocalizedInfo(name="", description=""),
                en=LocalizedInfo(
                    name=loc.en_info[0].name if loc.en_info else "",
                    description=loc.en_info[0].description if loc.en_info else ""
                ) if loc.en_info else LocalizedInfo(name="", description="")
            )
            for loc in locations
        ]
    )