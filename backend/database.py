import sqlite3
import json
import os
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "agrismart.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # 1. Farm Profiles
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS farm_profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        farmer_name TEXT NOT NULL,
        phone TEXT,
        village TEXT NOT NULL,
        district TEXT NOT NULL,
        state TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        farm_size_acres REAL DEFAULT 5.0,
        primary_crop TEXT DEFAULT 'Paddy (Rice)',
        soil_type TEXT DEFAULT 'Black Clay Soil',
        preferred_language TEXT DEFAULT 'en',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 2. Crop & Disease Scans History
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS analysis_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        analysis_type TEXT NOT NULL, -- 'crop_id', 'disease_detection', 'soil_analysis'
        title TEXT NOT NULL,
        crop_name TEXT,
        disease_name TEXT,
        confidence REAL,
        image_path TEXT,
        details_json TEXT,
        recommendations_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 3. Soil Test Records
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS soil_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sample_name TEXT,
        nitrogen REAL,
        phosphorus REAL,
        potassium REAL,
        ph REAL,
        moisture REAL,
        temperature REAL,
        soil_health_score INTEGER,
        soil_type TEXT,
        recommendations_json TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 4. Chat Logs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender TEXT NOT NULL, -- 'farmer' or 'assistant'
        message TEXT NOT NULL,
        language TEXT DEFAULT 'en',
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    conn.commit()
    conn.close()

# Helper queries
def save_analysis(analysis_type: str, title: str, crop_name: Optional[str], disease_name: Optional[str],
                  confidence: float, image_path: Optional[str], details: Dict[str, Any], recommendations: Dict[str, Any]) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO analysis_history (analysis_type, title, crop_name, disease_name, confidence, image_path, details_json, recommendations_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        analysis_type,
        title,
        crop_name,
        disease_name,
        confidence,
        image_path,
        json.dumps(details),
        json.dumps(recommendations)
    ))
    record_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return record_id

def get_recent_analyses(limit: int = 10) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM analysis_history ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    results = []
    for r in rows:
        results.append({
            "id": r["id"],
            "analysis_type": r["analysis_type"],
            "title": r["title"],
            "crop_name": r["crop_name"],
            "disease_name": r["disease_name"],
            "confidence": r["confidence"],
            "image_path": r["image_path"],
            "details": json.loads(r["details_json"]) if r["details_json"] else {},
            "recommendations": json.loads(r["recommendations_json"]) if r["recommendations_json"] else {},
            "created_at": r["created_at"]
        })
    conn.close()
    return results

def get_farm_profile() -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM farm_profiles ORDER BY id DESC LIMIT 1")
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    return {}

def update_farm_profile(data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM farm_profiles ORDER BY id DESC LIMIT 1")
    row = cursor.fetchone()
    if row:
        cursor.execute("""
        UPDATE farm_profiles
        SET farmer_name = ?, phone = ?, village = ?, district = ?, state = ?,
            latitude = ?, longitude = ?, farm_size_acres = ?, primary_crop = ?,
            soil_type = ?, preferred_language = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        """, (
            data.get("farmer_name", "Ramesh Patel"),
            data.get("phone", "9876543210"),
            data.get("village", "Khammam Rural"),
            data.get("district", "Khammam"),
            data.get("state", "Telangana"),
            data.get("latitude", 17.2473),
            data.get("longitude", 80.1514),
            data.get("farm_size_acres", 5.5),
            data.get("primary_crop", "Cotton & Chilli"),
            data.get("soil_type", "Black Cotton Soil"),
            data.get("preferred_language", "en"),
            row["id"]
        ))
    else:
        cursor.execute("""
        INSERT INTO farm_profiles (farmer_name, phone, village, district, state, latitude, longitude, farm_size_acres, primary_crop, soil_type, preferred_language)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data.get("farmer_name", "Ramesh Patel"),
            data.get("phone", "9876543210"),
            data.get("village", "Khammam Rural"),
            data.get("district", "Khammam"),
            data.get("state", "Telangana"),
            data.get("latitude", 17.2473),
            data.get("longitude", 80.1514),
            data.get("farm_size_acres", 5.5),
            data.get("primary_crop", "Cotton & Chilli"),
            data.get("soil_type", "Black Cotton Soil"),
            data.get("preferred_language", "en")
        ))
    conn.commit()
    conn.close()
    return get_farm_profile()

def save_soil_record(data: Dict[str, Any]) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO soil_records (sample_name, nitrogen, phosphorus, potassium, ph, moisture, temperature, soil_health_score, soil_type, recommendations_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data.get("sample_name", "Field A"),
        data.get("nitrogen", 0.0),
        data.get("phosphorus", 0.0),
        data.get("potassium", 0.0),
        data.get("ph", 7.0),
        data.get("moisture", 25.0),
        data.get("temperature", 28.0),
        data.get("soil_health_score", 75),
        data.get("soil_type", "Loamy Soil"),
        json.dumps(data.get("recommendations", {}))
    ))
    rec_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return rec_id

def get_soil_records(limit: int = 10) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM soil_records ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    results = []
    for r in rows:
        results.append({
            "id": r["id"],
            "sample_name": r["sample_name"],
            "nitrogen": r["nitrogen"],
            "phosphorus": r["phosphorus"],
            "potassium": r["potassium"],
            "ph": r["ph"],
            "moisture": r["moisture"],
            "temperature": r["temperature"],
            "soil_health_score": r["soil_health_score"],
            "soil_type": r["soil_type"],
            "recommendations": json.loads(r["recommendations_json"]) if r["recommendations_json"] else {},
            "created_at": r["created_at"]
        })
    conn.close()
    return results
