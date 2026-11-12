import io
from PIL import Image
import numpy as np
from typing import Dict, Any, Optional

# ICAR (Indian Council of Agricultural Research) Soil Nutrient Critical Ranges
# Units: kg/ha for available N, P, K
NUTRIENT_BENCHMARKS = {
    "nitrogen": {
        "low": 280.0,      # < 280 kg/ha is Low
        "medium": 560.0,   # 280 - 560 kg/ha is Medium
        "unit": "kg/ha"
    },
    "phosphorus": {
        "low": 10.0,       # < 10 kg/ha is Low
        "medium": 25.0,    # 10 - 25 kg/ha is Medium
        "unit": "kg/ha"
    },
    "potassium": {
        "low": 110.0,      # < 110 kg/ha is Low
        "medium": 280.0,   # 110 - 280 kg/ha is Medium
        "unit": "kg/ha"
    },
    "ph": {
        "strongly_acidic": 5.5,
        "moderately_acidic": 6.5,
        "neutral_min": 6.5,
        "neutral_max": 7.5,
        "moderately_alkaline": 8.5
    }
}

class SoilAnalysisEngine:
    """
    Combines computer vision for preliminary visual observations (soil color, moisture darkness, texture roughness)
    with laboratory-grade soil test parameters (N, P, K, pH, moisture, temp).
    Strictly separates visual estimates from actual measured laboratory numbers.
    """

    def analyze_soil_image(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Extracts visual traits from a soil photo:
        - Munsell-approximate color profile (Black, Red, Brown, Sandy yellow)
        - Surface moisture sheen / darkness
        - Granular texture roughness estimate
        """
        try:
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        except Exception as e:
            raise ValueError(f"Invalid soil image file: {str(e)}")

        img_np = np.array(image.resize((150, 150)), dtype=np.float32) / 255.0
        r_mean = float(np.mean(img_np[:, :, 0]))
        g_mean = float(np.mean(img_np[:, :, 1]))
        b_mean = float(np.mean(img_np[:, :, 2]))
        luminance = 0.299 * r_mean + 0.587 * g_mean + 0.114 * b_mean

        # Texture roughness via standard deviation of local gradients
        gray = 0.299 * img_np[:, :, 0] + 0.587 * img_np[:, :, 1] + 0.114 * img_np[:, :, 2]
        std_dev = float(np.std(gray))

        # Classify visual soil appearance
        if luminance < 0.28:
            visual_soil_type = "Deep Black Cotton Soil (Regur / Vertisol)"
            color_desc = "Dark Brown to Jet Black"
            organic_matter_estimate = "Medium to High (High montmorillonite clay content)"
            drainage_estimate = "Slow drainage, very high water retention; cracks when dry"
        elif r_mean > 0.42 and g_mean < 0.35:
            visual_soil_type = "Red Sandy / Laterite Soil (Alfisols)"
            color_desc = "Rusty Red to Light Brick Red (Rich in Iron oxides)"
            organic_matter_estimate = "Low to Medium"
            drainage_estimate = "Rapid drainage, prone to leaching; low water holding capacity"
        elif luminance > 0.50:
            visual_soil_type = "Sandy Loam / Coastal Alluvial"
            color_desc = "Pale Yellowish Brown to Light Grey"
            organic_matter_estimate = "Low"
            drainage_estimate = "Very fast drainage, low nutrient retention"
        else:
            visual_soil_type = "Alluvial Loam / Silty Clay (Inceptisols)"
            color_desc = "Greyish Brown to Dark Loam"
            organic_matter_estimate = "Balanced"
            drainage_estimate = "Well-drained, ideal moisture holding capacity"

        # Texture roughness interpretation
        texture_roughness = "Coarse / Cloddy" if std_dev > 0.16 else ("Medium Granular" if std_dev > 0.08 else "Fine / Silty")
        estimated_surface_moisture = "Moist / Damp" if luminance < 0.35 else ("Moderately Dry" if luminance < 0.52 else "Dry Surface")

        return {
            "source": "visual_image_estimation",
            "is_measured_lab_value": False,
            "disclaimer": "Visual observations are preliminary surface estimates only and CANNOT substitute a laboratory Soil Health Card test.",
            "visual_soil_type": visual_soil_type,
            "color_description": color_desc,
            "surface_roughness": texture_roughness,
            "surface_moisture_estimate": estimated_surface_moisture,
            "estimated_organic_profile": organic_matter_estimate,
            "drainage_profile": drainage_estimate,
            "color_rgb_avg": [round(r_mean, 2), round(g_mean, 2), round(b_mean, 2)]
        }

    def evaluate_laboratory_test(self, n: float, p: float, k: float, ph: float,
                                 moisture: float, temperature: float,
                                 visual_data: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Calculates official soil health score (0-100), nutrient adequacy classifications,
        specific fertilizer application doses (Urea, DAP, MOP, Gypsum/Lime),
        and recommended Indian crops based on ICAR guidelines.
        """
        # 1. Nutrient Level Classifications
        n_status = "Deficient (Low)" if n < 280 else ("Optimal (Medium)" if n <= 560 else "Excessive (High)")
        p_status = "Deficient (Low)" if p < 10 else ("Optimal (Medium)" if p <= 25 else "Excessive (High)")
        k_status = "Deficient (Low)" if k < 110 else ("Optimal (Medium)" if k <= 280 else "Excessive (High)")

        # 2. pH Evaluation
        if ph < 5.5:
            ph_status = "Strongly Acidic (Al-toxicity hazard)"
            ph_fix = "Apply Agricultural Lime (CaCO3) @ 400 - 600 kg/acre to neutralize acidity."
        elif ph < 6.5:
            ph_status = "Slightly Acidic (Good for most crops)"
            ph_fix = "Mild acidity; add well-rotted farmyard manure (FYM)."
        elif ph <= 7.5:
            ph_status = "Ideal Neutral Range (Optimal nutrient uptake)"
            ph_fix = "Maintain current practices; excellent availability of N, P, K and micronutrients."
        elif ph <= 8.5:
            ph_status = "Moderately Alkaline / Calcareous"
            ph_fix = "Apply Agricultural Gypsum (CaSO4.2H2O) @ 250 - 400 kg/acre and sulphur to lower pH."
        else:
            ph_status = "Strongly Alkaline / Sodic"
            ph_fix = "High sodicity. Deep plowing, green manuring (Dhaincha/Sunn hemp), and Gypsum treatment @ 600 kg/acre required."

        # 3. Moisture & Temperature
        if moisture < 15:
            moisture_status = "Critically Dry (Immediate irrigation required)"
        elif moisture <= 35:
            moisture_status = "Optimal Field Capacity (Good for root aeration)"
        else:
            moisture_status = "Waterlogged / Saturated (Risk of root rot)"

        # 4. Calculate Soil Health Index Score (0 - 100)
        score = 100
        # Deduct for NPK deficiencies
        if n < 280: score -= int((280 - n) / 280 * 20)
        elif n > 600: score -= 8
        if p < 10: score -= int((10 - p) / 10 * 18)
        if k < 110: score -= int((110 - k) / 110 * 18)
        # Deduct for extreme pH
        if ph < 6.0: score -= int((6.0 - ph) * 15)
        elif ph > 8.0: score -= int((ph - 8.0) * 15)
        # Deduct for poor moisture
        if moisture < 15 or moisture > 45: score -= 10

        soil_health_score = max(20, min(98, score))

        # 5. Exact Fertilizer Recommendations based on NPK deficiency
        fertilizer_prescriptions = []
        if n < 280:
            deficit_n = 280 - n
            # Urea contains 46% Nitrogen
            urea_dose = round((deficit_n * 0.40) / 0.46, 1) # per acre calculation
            fertilizer_prescriptions.append({
                "fertilizer": "Urea (46% N)",
                "recommended_dose": f"{urea_dose} kg / acre",
                "application_method": "Apply in 2-3 split doses: 50% as basal, 25% at vegetative stage, 25% at flowering.",
                "purpose": "Correct severe nitrogen deficiency and promote green vegetative growth."
            })
        elif n > 560:
            fertilizer_prescriptions.append({
                "fertilizer": "Nitrogen Reduction Advisory",
                "recommended_dose": "Skip or reduce basal Urea by 30%",
                "application_method": "Withhold top-dressing of urea to avoid succulent growth vulnerable to sucking pests.",
                "purpose": "Prevent vegetative lodging and blast/mildew disease outbreaks."
            })

        if p < 10:
            deficit_p = 10 - p
            # DAP contains 46% P2O5 and 18% N
            dap_dose = round((deficit_p * 0.40) / 0.46 * 3.0, 1)
            fertilizer_prescriptions.append({
                "fertilizer": "Di-Ammonium Phosphate (DAP 18:46:0) or SSP",
                "recommended_dose": f"{max(30.0, dap_dose)} kg / acre (or SSP @ {round(dap_dose * 2.8, 1)} kg/acre)",
                "application_method": "Apply as basal placement 5 cm below seed depth during sowing or transplanting.",
                "purpose": "Promote strong root system development and early seedling vigor."
            })

        if k < 110:
            # MOP contains 60% K2O
            mop_dose = round((110 - k) * 0.40 / 0.60 * 0.8, 1)
            fertilizer_prescriptions.append({
                "fertilizer": "Muriate of Potash (MOP 60% K2O)",
                "recommended_dose": f"{max(20.0, mop_dose)} kg / acre",
                "application_method": "Mix with basal dose or top-dress before panicle initiation / flowering.",
                "purpose": "Improve pest resistance, drought tolerance, and grain filling."
            })

        # Organic amendment recommendation
        fertilizer_prescriptions.append({
            "fertilizer": "Well-decomposed Farmyard Manure (FYM) / Vermicompost",
            "recommended_dose": "2 - 3 tonnes / acre (or 1 tonne vermicompost)",
            "application_method": "Incorporate thoroughly into soil during final land preparation 2 weeks before sowing.",
            "purpose": "Boost soil organic carbon (SOC), enhance microbial activity, and improve moisture holding capacity."
        })

        # 6. Suitable Crops for this Soil Condition
        suitable_crops = []
        if 6.0 <= ph <= 7.8 and n > 200:
            suitable_crops.extend(["Paddy / Rice", "Cotton", "Maize", "Chilli", "Tomato", "Sugarcane"])
        elif ph < 6.0:
            suitable_crops.extend(["Tea", "Potato", "Groundnut", "Pineapple", "Maize"])
        elif ph > 7.8:
            suitable_crops.extend(["Cotton", "Wheat", "Barley", "Mustard", "Guava", "Pomegranate"])
        else:
            suitable_crops.extend(["Millets (Jowar, Bajra)", "Pulses (Red gram, Green gram)", "Groundnut"])

        return {
            "soil_health_score": soil_health_score,
            "soil_rating": "Excellent" if soil_health_score >= 80 else ("Moderate / Needs Improvement" if soil_health_score >= 55 else "Poor / Severely Deficient"),
            "measured_lab_values": {
                "nitrogen": {"value": n, "unit": "kg/ha", "status": n_status, "benchmark": "280 - 560 kg/ha"},
                "phosphorus": {"value": p, "unit": "kg/ha", "status": p_status, "benchmark": "10 - 25 kg/ha"},
                "potassium": {"value": k, "unit": "kg/ha", "status": k_status, "benchmark": "110 - 280 kg/ha"},
                "ph": {"value": ph, "unit": "pH scale", "status": ph_status, "benchmark": "6.5 - 7.5"},
                "moisture": {"value": moisture, "unit": "%", "status": moisture_status, "benchmark": "20% - 35%"},
                "temperature": {"value": temperature, "unit": "°C", "benchmark": "20°C - 30°C"}
            },
            "ph_amelioration_advice": ph_fix,
            "fertilizer_prescriptions": fertilizer_prescriptions,
            "suitable_crops": suitable_crops[:6],
            "visual_preliminary_data": visual_data,
            "is_measured_lab_value": True
        }

soil_engine = SoilAnalysisEngine()
