# app/models/database.py
from sqlalchemy import Column, Integer, Float, Boolean, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry
from ..database import Base

class DBLocation(Base):
    __tablename__ = "locations"
    
    id = Column(Integer, primary_key=True, index=True)
    latitude = Column(Float)
    longitude = Column(Float)
    rating = Column(Float)
    is_open = Column(Boolean, default=True)
    position = Column(Geometry('POINT', srid=4326))
    
    images = relationship("DBImage", back_populates="location")
    ja_info = relationship("DBLocalizedInfo", 
                          primaryjoin="and_(DBLocation.id==DBLocalizedInfo.location_id, "
                                    "DBLocalizedInfo.language=='ja')",
                          viewonly=True)
    en_info = relationship("DBLocalizedInfo", 
                          primaryjoin="and_(DBLocation.id==DBLocalizedInfo.location_id, "
                                    "DBLocalizedInfo.language=='en')",
                          viewonly=True)

class DBImage(Base):
    __tablename__ = "images"
    
    id = Column(String, primary_key=True)
    url = Column(String)
    created_at = Column(DateTime)
    location_id = Column(Integer, ForeignKey("locations.id"))
    
    location = relationship("DBLocation", back_populates="images")

class DBLocalizedInfo(Base):
    __tablename__ = "localized_info"
    
    id = Column(Integer, primary_key=True, index=True)
    location_id = Column(Integer, ForeignKey("locations.id"))
    language = Column(String)
    name = Column(String)
    description = Column(String)
    
    location = relationship("DBLocation")