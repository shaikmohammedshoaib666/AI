from database import get_farm_profile, update_farm_profile, save_analysis, save_soil_record, get_recent_analyses

def seed_sample_data_if_needed():
    # 1. Seed farm profile
    current_profile = get_farm_profile()
    if not current_profile:
        sample_profile = {
            "farmer_name": "Ramesh Patel (రమేష్ పటేల్)",
            "phone": "+91 98765 43210",
            "village": "Thirumalayapalem",
            "district": "Khammam",
            "state": "Telangana",
            "latitude": 17.2473,
            "longitude": 80.1514,
            "farm_size_acres": 6.5,
            "primary_crop": "Cotton & Chilli",
            "soil_type": "Deep Black Cotton Soil (Regur)",
            "preferred_language": "en"
        }
        update_farm_profile(sample_profile)

    # 2. Seed analysis history
    history = get_recent_analyses(5)
    if len(history) == 0:
        # Sample Disease Scan 1
        save_analysis(
            analysis_type="disease_detection",
            title="Tomato Leaf Early Blight Diagnosis",
            crop_name="Tomato",
            disease_name="Early Blight (Alternaria solani)",
            confidence=89.4,
            image_path=None,
            details={
                "pathogen": "Alternaria solani (Fungus)",
                "symptoms": ["Concentric rings / target board pattern on foliage", "Yellow halo around dark lesions"],
                "severity": 34.5,
                "is_healthy": False
            },
            recommendations={
                "chemical": ["Mancozeb 75% WP @ 2.5 g/L", "Azoxystrobin 23% SC @ 1.0 ml/L"],
                "organic": ["Neem oil 10000 PPM @ 2.5 ml/L", "Trichoderma viride foliar spray"],
                "safety": "Follow 7-day pre-harvest interval strictly."
            }
        )

        # Sample Crop Identification Scan 2
        save_analysis(
            analysis_type="crop_id",
            title="Field Crop Identification - Cotton",
            crop_name="Cotton (Gossypium hirsutum)",
            disease_name=None,
            confidence=95.1,
            image_path=None,
            details={
                "category": "Fiber / Cash Crop",
                "season": "Kharif (June - Jan)",
                "growth_cycle": "150 - 180 days",
                "optimal_soil": "Deep black cotton soil with high moisture retention (pH 6.5 - 8.2)"
            },
            recommendations={
                "advisory": [
                    "Install 5 pheromone traps per acre to monitor Pink Bollworm.",
                    "Spray 2% DAP or 19:19:19 at peak flowering."
                ]
            }
        )

        # Sample Soil Test Record
        save_soil_record({
            "sample_name": "Block 2 - Black Cotton Soil Lot",
            "nitrogen": 220.0,
            "phosphorus": 14.5,
            "potassium": 195.0,
            "ph": 7.4,
            "moisture": 28.0,
            "temperature": 27.5,
            "soil_health_score": 78,
            "soil_type": "Black Cotton Soil",
            "recommendations": {
                "fertilizer": [
                    {"fertilizer": "Urea (46% N)", "recommended_dose": "52 kg / acre in 3 split doses"},
                    {"fertilizer": "Single Super Phosphate (SSP)", "recommended_dose": "45 kg / acre as basal"},
                    {"fertilizer": "Farmyard Manure (FYM)", "recommended_dose": "2.5 tonnes / acre"}
                ]
            }
        })

if __name__ == "__main__":
    from database import init_db
    init_db()
    seed_sample_data_if_needed()
    print("Database initialized and sample data seeded successfully.")
