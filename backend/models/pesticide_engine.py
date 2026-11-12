"""
Indian CIBRC (Central Insecticides Board & Registration Committee) and
ICAR (Indian Council of Agricultural Research) compliant pesticide & fertilizer recommendation database.
Contains authentic registered formulations, active ingredients, label dilution rates,
and statutory safety advisories.
"""
from typing import Dict, List, Any, Optional

PESTICIDE_REGISTRY = {
    "blast_and_blight": [
        {
            "trade_name": "Beam / Baan / Tricyclazole 75% WP",
            "active_ingredient": "Tricyclazole 75% WP",
            "category": "Systemic Fungicide (Melanin Biosynthesis Inhibitor)",
            "target_diseases": ["Rice Blast (Leaf, Neck, and Node blast)"],
            "recommended_dilution": "0.6 g per Litre of water (9 - 10 g per 15L knapsack sprayer)",
            "application_guidance": "Spray proactively at first sign of spindle spots or at boot leaf emergence stage.",
            "waiting_period_phi": "30 days before harvest",
            "safety_precautions": "Wear mask, wash hands with soap, avoid spraying against wind direction.",
            "regulatory_body": "CIB&RC Registered Formulation"
        },
        {
            "trade_name": "Dithane M-45 / Indofil M-45 (Mancozeb 75% WP)",
            "active_ingredient": "Mancozeb 75% WP (Dithiocarbamate group)",
            "category": "Broad Spectrum Contact Protective Fungicide",
            "target_diseases": ["Tomato Early Blight", "Potato Late Blight", "Chilli Fruit Rot / Dieback", "Leaf Spots"],
            "recommended_dilution": "2.0 - 2.5 g per Litre of water (30 - 35 g per 15L sprayer)",
            "application_guidance": "Ensure thorough coverage of both upper and lower leaf surfaces. Re-spray after heavy rain.",
            "waiting_period_phi": "7 days for vegetables",
            "safety_precautions": "Keep away from aquatic bodies (toxic to fish). Use protective eye shield.",
            "regulatory_body": "CIB&RC Registered Formulation"
        },
        {
            "trade_name": "Amistar Top / Azoxystrobin + Difenoconazole",
            "active_ingredient": "Azoxystrobin 18.2% + Difenoconazole 11.4% SC",
            "category": "Dual Systemic Fungicide (Strobilurin + Triazole)",
            "target_diseases": ["Sheath Blight", "Powdery Mildew", "Anthracnose", "Rust", "Alternaria Blight"],
            "recommended_dilution": "1.0 ml per Litre of water (15 ml per 15L knapsack sprayer)",
            "application_guidance": "Dual action provides preventive protection and curative systemic stoppage of mycelium.",
            "waiting_period_phi": "10 - 14 days",
            "safety_precautions": "Do not exceed recommended dose. Do not spray during peak pollination hours (9 AM - 12 PM).",
            "regulatory_body": "CIB&RC Registered Formulation"
        }
    ],
    "bacterial_diseases": [
        {
            "trade_name": "Blitox 50 / Blue Copper (Copper Oxychloride 50% WP)",
            "active_ingredient": "Copper Oxychloride 50% WP",
            "category": "Contact Bactericide and Fungicide",
            "target_diseases": ["Bacterial Blight of Cotton", "Bacterial Leaf Spot of Chilli", "Citrus Canker", "Late Blight"],
            "recommended_dilution": "2.5 - 3.0 g per Litre of water (40 g per 15L sprayer)",
            "application_guidance": "Forms a persistent copper ion layer on foliage that prevents bacterial multiplication.",
            "waiting_period_phi": "5 - 7 days",
            "safety_precautions": "Do not mix with acidic chemicals, lime sulfur, or organophosphates.",
            "regulatory_body": "CIB&RC Registered Formulation"
        },
        {
            "trade_name": "Streptocycline (Agricultural Grade)",
            "active_ingredient": "Streptomycin Sulphate 90% + Tetracycline Hydrochloride 10% SP",
            "category": "Agricultural Antibiotic / Bactericide",
            "target_diseases": ["Bacterial Leaf Blight in Paddy", "Blackarm in Cotton", "Bacterial Canker in Tomato"],
            "recommended_dilution": "1.0 g per 10 Litres of water (1 packet of 6g per 60L water)",
            "application_guidance": "Always combine with Copper Oxychloride (25g/10L) for synergistic control and to prevent bacterial resistance.",
            "waiting_period_phi": "14 days",
            "safety_precautions": "Use strictly according to registered crop guidelines. Avoid dermal contact.",
            "regulatory_body": "CIB&RC Registered Formulation"
        }
    ],
    "sucking_pests_and_vectors": [
        {
            "trade_name": "Confidor / Imidacloprid 17.8% SL",
            "active_ingredient": "Imidacloprid 17.8% SL (Neonicotinoid)",
            "category": "Systemic Insecticide",
            "target_diseases": ["Vectors of Leaf Curl Virus (Whiteflies, Jassids, Aphids, Thrips)"],
            "recommended_dilution": "0.3 - 0.5 ml per Litre of water (5 - 7 ml per 15L sprayer)",
            "application_guidance": "Absorbed rapidly into plant vascular system. Effective against hidden nymphs under leaves.",
            "waiting_period_phi": "21 days on cotton, 7 days on chilli",
            "safety_precautions": "Extremely toxic to honeybees. NEVER spray during crop flowering when bees are active.",
            "regulatory_body": "CIB&RC Registered Formulation"
        },
        {
            "trade_name": "Neem Oil 10,000 PPM (Azadirachtin 1% EC)",
            "active_ingredient": "Azadirachtin 10,000 PPM",
            "category": "Botanical / Organic Bio-Pesticide",
            "target_diseases": ["Whiteflies, Thrips, Mites, Early Leaf Spot, Mildew"],
            "recommended_dilution": "2.0 - 3.0 ml per Litre of water + 0.5 ml mild detergent / sticker",
            "application_guidance": "Repellent, anti-feedant, and oviposition deterrent. Harmless to beneficial pollinators.",
            "waiting_period_phi": "0 days (Eco-friendly, residue free)",
            "safety_precautions": "Safe for humans, spray during cool evening hours to prevent photo-degradation.",
            "regulatory_body": "Certified Organic / CIB&RC Schedule II"
        }
    ],
    "bio_fungicides": [
        {
            "trade_name": "Bio-Shield / Trichoderma viride 1.5% WP",
            "active_ingredient": "Trichoderma viride (CFU 2 x 10^8/g)",
            "category": "Antagonistic Bio-Fungicide",
            "target_diseases": ["Root rot, Fusarium wilt, Collar rot, Damping off, Early leaf spots"],
            "recommended_dilution": "5.0 g per Litre of water for foliar spray, or 2 kg mixed in 100 kg FYM per acre for soil",
            "application_guidance": "Colonizes plant rhizosphere and leaf surface, destroying pathogenic fungal cell walls.",
            "waiting_period_phi": "0 days",
            "safety_precautions": "Do not mix with synthetic chemical fungicides. Maintain sufficient soil moisture.",
            "regulatory_body": "CIB&RC Bio-control formulation"
        }
    ]
}

def get_recommendations_for_disease(disease_name: str, crop_name: Optional[str] = None) -> Dict[str, Any]:
    """
    Returns authentic pesticide suggestions, active ingredients, dosage per 15L knapsack sprayer,
    and statutory advisories tailored to the disease.
    """
    d_lower = (disease_name or "").lower()
    
    selected_pesticides = []
    bio_control = PESTICIDE_REGISTRY["bio_fungicides"]

    if "bacterial" in d_lower or "blackarm" in d_lower:
        selected_pesticides.extend(PESTICIDE_REGISTRY["bacterial_diseases"])
    elif "curl" in d_lower or "virus" in d_lower or "thrip" in d_lower:
        selected_pesticides.extend(PESTICIDE_REGISTRY["sucking_pests_and_vectors"])
    else:
        selected_pesticides.extend(PESTICIDE_REGISTRY["blast_and_blight"])
        # Add botanical option
        selected_pesticides.append(PESTICIDE_REGISTRY["sucking_pests_and_vectors"][1])

    return {
        "disease_query": disease_name,
        "crop_context": crop_name,
        "recommended_pesticides": selected_pesticides,
        "biological_alternatives": bio_control,
        "general_spraying_advisory": [
            "Check local weather: Never spray if rain is forecast within 6 hours or wind speed exceeds 15 km/h.",
            "Calibrate your sprayer: Use a flat fan or hollow cone nozzle with clean water without suspended silt.",
            "Always wear Personal Protective Equipment (PPE): Rubber gloves, face mask, eye goggles, and rubber boots.",
            "Observe Pre-Harvest Interval (PHI) strictly before picking produce for market.",
            "Dispose of empty pesticide containers safely as per CIB&RC rules: puncture and bury away from water sources."
        ],
        "statutory_disclaimer": "All pesticide recommendations are compiled in compliance with the Central Insecticides Board & Registration Committee (CIB&RC) and ICAR guidelines. Always read the approved container label before application."
    }

def get_all_pesticide_catalog() -> List[Dict[str, Any]]:
    all_items = []
    for cat_name, items in PESTICIDE_REGISTRY.items():
        for item in items:
            item_copy = dict(item)
            item_copy["category_group"] = cat_name
            all_items.append(item_copy)
    return all_items
