import os
import shutil
import uuid
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import (
    init_db, get_farm_profile, update_farm_profile,
    save_analysis, get_recent_analyses, save_soil_record, get_soil_records
)
from sample_data import seed_sample_data_if_needed
from schemas import SoilAnalysisInput, FarmProfileInput, ChatQueryInput, PesticideQueryInput
from models.crop_classifier import crop_classifier
from models.disease_detector import disease_detector
from models.soil_engine import soil_engine
from models.pesticide_engine import get_recommendations_for_disease, get_all_pesticide_catalog
from models.weather_service import weather_service
from models.chatbot import ask_farmer_assistant

# Ensure upload directory exists
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Initialize Database & Seed data
init_db()
seed_sample_data_if_needed()

app = FastAPI(
    title="AgriSmart AI API",
    description="Backend services for AgriSmart AI platform designed for Indian farmers",
    version="1.0.0"
)

# Enable CORS for frontend Vite development server & production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploaded media static route
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "platform": "AgriSmart AI",
        "models": {
            "crop_classifier_loaded": crop_classifier.model_loaded,
            "disease_detector_loaded": disease_detector.model_loaded
        }
    }


# ==========================================
# 1. AI Crop Identification
# ==========================================
@app.post("/api/crops/identify")
async def identify_crop(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image (JPEG, PNG, WebP).")

    # Read image content
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds maximum allowed 10MB.")

    # Save to uploads
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"crop_{uuid.uuid4().hex[:10]}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(contents)

    try:
        prediction = crop_classifier.predict(contents)
        prediction["image_url"] = f"/uploads/{filename}"

        # Persist to database history
        save_analysis(
            analysis_type="crop_id",
            title=f"Crop Identified: {prediction['crop_name'].split(' (')[0]}",
            crop_name=prediction["crop_name"],
            disease_name=None,
            confidence=prediction["confidence"],
            image_path=f"/uploads/{filename}",
            details=prediction,
            recommendations={"best_practices": prediction.get("best_practices", [])}
        )
        return prediction
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")


# ==========================================
# 2. Plant Disease Detection
# ==========================================
@app.post("/api/diseases/detect")
async def detect_plant_disease(
    file: UploadFile = File(...),
    crop_hint: Optional[str] = Form(None)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds maximum allowed 10MB.")

    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"disease_{uuid.uuid4().hex[:10]}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(contents)

    try:
        result = disease_detector.detect(contents, user_crop_hint=crop_hint)
        result["image_url"] = f"/uploads/{filename}"

        # Persist to database history
        save_analysis(
            analysis_type="disease_detection",
            title=f"Disease Scan: {result['disease_name'].split(' (')[0]}",
            crop_name=result["crop"],
            disease_name=result["disease_name"],
            confidence=result["confidence"],
            image_path=f"/uploads/{filename}",
            details={
                "pathogen": result["pathogen"],
                "symptoms": result["symptoms"],
                "causes": result["causes"],
                "visual_metrics": result["visual_metrics"],
                "is_healthy": result["is_healthy"]
            },
            recommendations=result["preventive_measures"]
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Disease detection error: {str(e)}")


# ==========================================
# 3. Soil Analysis
# ==========================================
@app.post("/api/soil/analyze-image")
async def analyze_soil_visual(file: UploadFile = File(...)):
    """
    Visual preliminary estimation from a soil photograph.
    Clearly marks outputs as estimates, distinct from laboratory measurements.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    contents = await file.read()
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"soil_{uuid.uuid4().hex[:10]}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(contents)

    try:
        visual_data = soil_engine.analyze_soil_image(contents)
        visual_data["image_url"] = f"/uploads/{filename}"
        return visual_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Soil image processing error: {str(e)}")


@app.post("/api/soil/evaluate-test")
def evaluate_soil_test(data: SoilAnalysisInput):
    """
    Calculates Soil Health Index, nutrient deficiency status,
    and precise ICAR fertilizer dosages from laboratory soil test values.
    """
    try:
        evaluation = soil_engine.evaluate_laboratory_test(
            n=data.nitrogen,
            p=data.phosphorus,
            k=data.potassium,
            ph=data.ph,
            moisture=data.moisture,
            temperature=data.temperature
        )

        # Save record in database
        save_soil_record({
            "sample_name": data.sample_name,
            "nitrogen": data.nitrogen,
            "phosphorus": data.phosphorus,
            "potassium": data.potassium,
            "ph": data.ph,
            "moisture": data.moisture,
            "temperature": data.temperature,
            "soil_health_score": evaluation["soil_health_score"],
            "soil_type": "Evaluated Soil",
            "recommendations": {
                "fertilizers": evaluation["fertilizer_prescriptions"],
                "ph_advice": evaluation["ph_amelioration_advice"]
            }
        })

        return evaluation
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Soil evaluation error: {str(e)}")


@app.get("/api/soil/records")
def get_soil_test_records(limit: int = 10):
    return get_soil_records(limit)


# ==========================================
# 4. Location & Live Weather
# ==========================================
@app.get("/api/weather")
def get_weather(
    lat: Optional[float] = Query(None),
    lon: Optional[float] = Query(None)
):
    """
    Returns live weather & 7-day forecast with agricultural advisories.
    If lat/lon omitted, defaults to saved farm profile location.
    """
    if lat is None or lon is None:
        profile = get_farm_profile()
        lat = profile.get("latitude", 17.2473)
        lon = profile.get("longitude", 80.1514)

    return weather_service.get_weather(lat=lat, lon=lon)


@app.get("/api/weather/resolve-location")
def resolve_location(query: str = Query(...)):
    return weather_service.resolve_location(query)


# ==========================================
# 5. Pesticides & Fertilizers
# ==========================
@app.post("/api/pesticides/recommend")
def recommend_pesticides(payload: PesticideQueryInput):
    return get_recommendations_for_disease(
        disease_name=payload.disease_name,
        crop_name=payload.crop_name
    )


@app.get("/api/pesticides/catalog")
def get_pesticide_catalog():
    return get_all_pesticide_catalog()


# ==========================================
# 6. AI Farmer Assistant (Chatbot)
# ==========================================
@app.post("/api/assistant/chat")
def chat_with_assistant(query: ChatQueryInput):
    return ask_farmer_assistant(
        query=query.message,
        language=query.language or "en"
    )


# ==========================================
# 7. Farm Profile & History
# ==========================================
@app.get("/api/farm/profile")
def read_farm_profile():
    return get_farm_profile()


@app.put("/api/farm/profile")
def modify_farm_profile(data: FarmProfileInput):
    return update_farm_profile(data.model_dump())


@app.get("/api/farm/history")
def read_analysis_history(limit: int = 20):
    return get_recent_analyses(limit)


# ==========================================
# 8. Dashboard Aggregation Summary
# ==========================================
@app.get("/api/dashboard/summary")
def get_dashboard_summary():
    profile = get_farm_profile()
    history = get_recent_analyses(5)
    soil_records = get_soil_records(3)
    weather = weather_service.get_weather(
        lat=profile.get("latitude", 17.2473),
        lon=profile.get("longitude", 80.1514)
    )

    # Compute key stats
    total_scans = len(get_recent_analyses(100))
    latest_soil_score = soil_records[0]["soil_health_score"] if soil_records else 78

    return {
        "farm_profile": profile,
        "weather": weather,
        "recent_scans": history,
        "latest_soil_record": soil_records[0] if soil_records else None,
        "stats": {
            "total_scans": total_scans,
            "soil_health_score": latest_soil_score,
            "active_alerts_count": len(weather.get("agricultural_alerts", [])),
            "primary_crop": profile.get("primary_crop", "Cotton & Chilli"),
            "farm_size_acres": profile.get("farm_size_acres", 5.5)
        }
    }
