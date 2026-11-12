from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class SoilAnalysisInput(BaseModel):
    nitrogen: float = Field(..., ge=0, le=1000, description="Available Nitrogen in kg/ha")
    phosphorus: float = Field(..., ge=0, le=500, description="Available Phosphorus in kg/ha")
    potassium: float = Field(..., ge=0, le=1500, description="Available Potassium in kg/ha")
    ph: float = Field(..., ge=3.0, le=11.0, description="Soil pH value")
    moisture: float = Field(25.0, ge=0, le=100, description="Soil moisture percentage")
    temperature: float = Field(28.0, ge=-10, le=60, description="Soil / ambient temperature in °C")
    sample_name: Optional[str] = "Main Field Lot 1"

class LocationQuery(BaseModel):
    query: Optional[str] = "Khammam, Telangana"
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class FarmProfileInput(BaseModel):
    farmer_name: str = "Ramesh Patel"
    phone: str = "9876543210"
    village: str = "Khammam Rural"
    district: str = "Khammam"
    state: str = "Telangana"
    latitude: float = 17.2473
    longitude: float = 80.1514
    farm_size_acres: float = 5.5
    primary_crop: str = "Cotton & Chilli"
    soil_type: str = "Black Cotton Soil"
    preferred_language: str = "en"

class ChatQueryInput(BaseModel):
    message: str
    language: Optional[str] = "en"

class PesticideQueryInput(BaseModel):
    disease_name: str
    crop_name: Optional[str] = None
