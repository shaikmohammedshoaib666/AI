"""
AgriSmart AI – Streamlit Cloud Deployment App
Bilingual Smart Indian Agriculture Assistant (English & Telugu)
"""
import os
import sys
import io
from PIL import Image
import streamlit as st

# Add backend directory to Python path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(CURRENT_DIR, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from models.crop_classifier import crop_classifier
from models.disease_detector import disease_detector
from models.soil_engine import soil_engine
from models.pesticide_engine import get_all_pesticide_catalog, get_recommendations_for_disease
from models.weather_service import weather_service
from models.chatbot import ask_farmer_assistant
from database import init_db, get_farm_profile, update_farm_profile, save_analysis, get_recent_analyses

# Initialize Database
init_db()

# Page Configuration
st.set_page_config(
    page_title="AgriSmart AI – Smart Indian Agriculture Assistant",
    page_icon="🌱",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling
st.markdown("""
<style>
    .main { background-color: #fbfdfa; }
    .stButton>button {
        background-color: #2e7d32;
        color: white;
        border-radius: 10px;
        font-weight: 600;
        padding: 0.5rem 1rem;
        border: none;
    }
    .stButton>button:hover {
        background-color: #1b5e20;
        color: white;
    }
    .metric-card {
        background: white;
        padding: 1.2rem;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .disclaimer-box {
        background: #fefce8;
        border-left: 4px solid #ca8a04;
        padding: 0.8rem 1rem;
        border-radius: 4px;
        font-size: 0.85rem;
        color: #713f12;
        margin-bottom: 1rem;
    }
</style>
""", unsafe_allow_html=True)

# Sidebar Navigation & Settings
with st.sidebar:
    st.image("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80", use_container_width=True)
    st.title("🌱 AgriSmart AI")
    st.caption("AI-Powered Smart Indian Agriculture Platform")

    # Language Selection
    lang_choice = st.radio(
        "Choose Language / భాష ఎంచుకోండి:",
        ("English", "తెలుగు (Telugu)"),
        horizontal=True
    )
    is_te = (lang_choice == "తెలుగు (Telugu)")
    lang_code = "te" if is_te else "en"

    st.markdown("---")
    
    # Navigation
    nav_options = [
        "📊 " + ("డ్యాష్‌బోర్డ్" if is_te else "Farmer Dashboard"),
        "🌾 " + ("పంట గుర్తింపు" if is_te else "AI Crop Identification"),
        "🍂 " + ("ఆకు తెగుళ్ళ నిర్ధారణ" if is_te else "Plant Disease Detection"),
        "🧪 " + ("భూసార & పోషకాల పరీక్ష" if is_te else "Soil Health & Nutrients"),
        "🛡️ " + ("పురుగు మందుల సూచిక (CIB&RC)" if is_te else "Pesticide & Fertilizer Advisory"),
        "🤖 " + ("రైతు ఏఐ మిత్రుడు" if is_te else "AI Farmer Assistant"),
        "🏡 " + ("నా పొలం & వాతావరణం" if is_te else "My Farm & Weather")
    ]
    page = st.selectbox("Navigate / విభాగం:", nav_options)

    st.markdown("---")
    st.info("📞 **Kisan Call Centre:** 1800-180-1551 (Toll-Free, 6 AM - 10 PM)")
    st.caption("ICAR & CIB&RC Aligned • Mobile Friendly")

# ==========================================
# 1. FARMER DASHBOARD
# ==========================================
if "Dashboard" in page or "డ్యాష్‌బోర్డ్" in page:
    st.title("📊 " + ("రైతు డ్యాష్‌బోర్డ్" if is_te else "Farmer Intelligence Dashboard"))
    profile = get_farm_profile()
    if not profile:
        profile = {
            "farmer_name": "Ramesh Patel",
            "village": "Thirumalayapalem",
            "district": "Khammam",
            "state": "Telangana",
            "primary_crop": "Cotton & Chilli",
            "farm_size_acres": 6.5,
            "latitude": 17.2473,
            "longitude": 80.1514
        }

    # Top KPI Metrics
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.metric(
            label="🌾 " + ("ప్రధాన పంట" if is_te else "Primary Crop"),
            value=profile.get("primary_crop", "Cotton & Chilli"),
            delta="Kharif Season"
        )
    with col2:
        st.metric(
            label="🧪 " + ("భూసార స్కోర్" if is_te else "Soil Health Score"),
            value="78 / 100",
            delta="Good Neutral pH"
        )
    with col3:
        st.metric(
            label="🌦️ " + ("పిచికారీ సమయం" if is_te else "Spraying Window"),
            value="Favorable",
            delta="Low Rain Risk"
        )
    with col4:
        st.metric(
            label="📍 " + ("భూమి విస్తీర్ణం" if is_te else "Farm Size"),
            value=f"{profile.get('farm_size_acres', 6.5)} Acres",
            delta=f"{profile.get('district', 'Khammam')}, {profile.get('state', 'Telangana')}"
        )

    st.markdown("---")

    # Live Weather & Alerts
    st.subheader("🌦️ " + ("ప్రత్యక్ష వ్యవసాయ వాతావరణం" if is_te else "Live Agro-Meteorology"))
    try:
        wx = weather_service.get_weather(profile.get("latitude", 17.2473), profile.get("longitude", 80.1514))
        cur = wx.get("current", {})
        wcol1, wcol2, wcol3, wcol4 = st.columns(4)
        wcol1.metric("Temperature", f"{cur.get('temperature', 28)}°C", f"Feels {cur.get('apparent_temperature', 29)}°C")
        wcol2.metric("Relative Humidity", f"{cur.get('humidity', 65)}%")
        wcol3.metric("Rainfall Today", f"{cur.get('precipitation', 0)} mm")
        wcol4.metric("Wind Speed", f"{cur.get('wind_speed', 10)} km/h")

        for alert in wx.get("agricultural_alerts", []):
            if alert["level"] == "success":
                st.success(f"**{alert['title']}**: {alert['message']}")
            else:
                st.warning(f"**{alert['title']}**: {alert['message']}")
    except Exception as e:
        st.info("Weather service offline or connecting.")

    # Recent Scans Table
    st.subheader("📋 " + ("ఇటీవలి పంట & తెగుళ్ళ విశ్లేషణలు" if is_te else "Recent Field Diagnoses"))
    recent = get_recent_analyses(5)
    if recent:
        for r in recent:
            with st.expander(f"🔍 {r['title']} — Confidence: {r['confidence']}% ({r['created_at']})"):
                st.write(f"**Crop:** {r.get('crop_name', 'N/A')}")
                if r.get('disease_name'):
                    st.write(f"**Disease:** {r.get('disease_name')}")
                if r.get('details'):
                    st.json(r['details'])
    else:
        st.info("No field scans recorded yet. Use Crop ID or Disease Detection to begin.")

# ==========================================
# 2. AI CROP IDENTIFICATION
# ==========================================
elif "Crop" in page or "పంట గుర్తింపు" in page:
    st.title("🌾 " + ("కంప్యూటర్ విజన్ పంట గుర్తింపు" if is_te else "AI Crop Identification"))
    st.write("Upload a crop photo or use camera to classify species and get optimal ICAR growing conditions.")

    upload_mode = st.radio("Input Method:", ("Upload Image File", "Use Device Camera"), horizontal=True)
    uploaded_file = None
    if upload_mode == "Upload Image File":
        uploaded_file = st.file_uploader("Choose crop photo (JPG, PNG, WebP):", type=["jpg", "jpeg", "png", "webp"])
    else:
        uploaded_file = st.camera_input("Take crop photo:")

    if uploaded_file is not None:
        image_bytes = uploaded_file.read()
        col_img, col_pred = st.columns([1, 1.2])
        with col_img:
            image = Image.open(io.BytesIO(image_bytes))
            st.image(image, caption="Uploaded Crop Image", use_container_width=True)

        with col_pred:
            with st.spinner("Analyzing botanical features with MobileNetV2..."):
                res = crop_classifier.predict(image_bytes)
                st.success(f"### {res['crop_name']}")
                st.caption(f"Scientific: *{res['scientific_name']}* • Category: {res['category']}")
                st.progress(res['confidence'] / 100.0)
                st.write(f"**Confidence Score:** {res['confidence']}%")

                st.markdown(f"**Season:** {res['season']} ({res['growth_period']})")
                st.markdown(f"**Optimal Temperature:** {res['optimal_conditions']['temperature']}")
                st.markdown(f"**Rainfall:** {res['optimal_conditions']['rainfall']}")
                st.markdown(f"**Soil Requirement:** {res['optimal_conditions']['soil_type']}")

        st.markdown("#### 🌾 Key Cultivation Practices (ICAR Recommended):")
        for p in res.get("best_practices", []):
            st.markdown(f"- ✅ {p}")

        # Save to DB
        save_analysis("crop_id", f"Crop: {res['crop_name']}", res['crop_name'], None, res['confidence'], None, res, {})

# ==========================================
# 3. PLANT DISEASE DETECTION
# ==========================================
elif "Disease" in page or "తెగుళ్ళ" in page:
    st.title("🍂 " + ("ఆకు తెగుళ్ళ నిర్ధారణ" if is_te else "Plant Leaf Disease Detection"))
    st.write("Screen leaves for fungal blights, bacterial spots, and viruses with CIB&RC chemical and organic solutions.")

    crop_hint = st.selectbox(
        "Crop Category (Optional - Enhances Diagnostic Focus):",
        ["Auto-Detect", "Tomato", "Paddy / Rice", "Cotton", "Potato", "Chilli", "Maize"]
    )

    uploaded_leaf = st.file_uploader("Upload Leaf Close-Up Image:", type=["jpg", "jpeg", "png", "webp"])
    if uploaded_leaf is not None:
        leaf_bytes = uploaded_leaf.read()
        col1, col2 = st.columns([1, 1.2])
        with col1:
            leaf_img = Image.open(io.BytesIO(leaf_bytes))
            st.image(leaf_img, caption="Analyzed Leaf", use_container_width=True)

        with col2:
            with st.spinner("Scanning for foliar pathogens..."):
                hint_str = "" if crop_hint == "Auto-Detect" else crop_hint.lower()
                diag = disease_detector.detect(leaf_bytes, user_crop_hint=hint_str)

                if diag["is_healthy"]:
                    st.success(f"### 🌿 {diag['disease_name']}")
                else:
                    st.error(f"### ⚠️ {diag['disease_name']}")

                st.caption(f"Pathogen: {diag['pathogen']} • Crop: {diag['crop']}")
                st.progress(diag['confidence'] / 100.0)
                st.write(f"**Confidence Score:** {diag['confidence']}%")

                if diag["low_confidence_warning"]:
                    st.warning(f"⚠️ **Low Confidence Notice:** {diag['warning_message']}")

        # Visual Metrics
        st.markdown("#### 📊 Color-Space Visual Metrics:")
        vm = diag["visual_metrics"]
        m1, m2, m3, m4 = st.columns(4)
        m1.metric("Green Chlorophyll", f"{vm['green_tissue_percentage']}%")
        m2.metric("Necrotic Lesions", f"{vm['necrotic_lesion_percentage']}%")
        m3.metric("Chlorosis Yellowing", f"{vm['chlorosis_yellowing_percentage']}%")
        m4.metric("Estimated Severity", f"{vm['estimated_severity']}%")

        # Symptoms and Causes
        sc1, sc2 = st.columns(2)
        with sc1:
            st.markdown("#### 🔍 Observed Symptoms:")
            for s in diag["symptoms"]:
                st.markdown(f"- {s}")
        with sc2:
            st.markdown("#### 🌧️ Triggers & Causes:")
            st.write(diag["causes"])

        # Treatments
        t1, t2 = st.columns(2)
        with t1:
            st.markdown("#### 🌿 Organic & Bio-Control:")
            for org in diag["preventive_measures"]["organic_biological"]:
                st.markdown(f"- ✅ {org}")
        with t2:
            st.markdown("#### 🧪 CIB&RC Chemical Formulations:")
            for chem in diag["preventive_measures"]["chemical_treatments"]:
                st.markdown(f"- 💊 {chem}")

        st.caption(f"**Safety Precaution:** {diag['preventive_measures']['safety_precautions']}")

# ==========================================
# 4. SOIL HEALTH & NUTRIENTS
# ==========================================
elif "Soil" in page or "భూసార" in page:
    st.title("🧪 " + ("భూసార పరీక్ష & ఎరువుల సిఫార్సులు" if is_te else "Soil Health & Nutrient Calculator"))
    st.markdown("""
    <div class="disclaimer-box">
    <b>Scientific Notice:</b> Image estimates are preliminary surface observations only. Exact fertilizer prescriptions are computed strictly from your entered laboratory Soil Health Card test values.
    </div>
    """, unsafe_allow_html=True)

    col_in1, col_in2, col_in3 = st.columns(3)
    with col_in1:
        n_val = st.slider("Nitrogen (N) kg/ha:", min_value=50.0, max_value=700.0, value=220.0, step=5.0)
        ph_val = st.slider("Soil pH Level:", min_value=4.5, max_value=9.5, value=7.4, step=0.1)
    with col_in2:
        p_val = st.slider("Phosphorus (P) kg/ha:", min_value=2.0, max_value=60.0, value=12.0, step=0.5)
        moist_val = st.slider("Moisture %:", min_value=5.0, max_value=50.0, value=25.0, step=1.0)
    with col_in3:
        k_val = st.slider("Potassium (K) kg/ha:", min_value=50.0, max_value=450.0, value=180.0, step=5.0)
        temp_val = st.slider("Soil Temp °C:", min_value=10.0, max_value=45.0, value=28.0, step=1.0)

    if st.button("Calculate Soil Health & Fertilizer Prescriptions", use_container_width=True):
        eval_res = soil_engine.evaluate_laboratory_test(n_val, p_val, k_val, ph_val, moist_val, temp_val)
        
        st.success(f"### Soil Health Score: {eval_res['soil_health_score']} / 100 ({eval_res['soil_rating']})")
        st.write(f"**pH Advisory:** {eval_res['ph_amelioration_advice']}")

        st.markdown("#### 🌾 Official ICAR Fertilizer Dosage Prescriptions (Per Acre):")
        for fert in eval_res["fertilizer_prescriptions"]:
            with st.container():
                st.markdown(f"**{fert['fertilizer']}** — *Dose:* `{fert['recommended_dose']}`")
                st.caption(f"Application: {fert['application_method']} • Purpose: {fert['purpose']}")

        st.markdown("#### 🌱 Suitable Crops for this Soil:")
        st.write(", ".join(eval_res["suitable_crops"]))

# ==========================================
# 5. PESTICIDE & FERTILIZER ADVISORY
# ==========================================
elif "Pesticide" in page or "పురుగు మందుల" in page:
    st.title("🛡️ " + ("CIB&RC అనుమతించబడిన పురుగు మందుల సూచిక" if is_te else "CIB&RC Registered Pesticide Guide"))
    st.info("Formulations compiled from official Central Insecticides Board & Registration Committee registers. Never invent dosages or mix unauthorized chemicals.")

    catalog = get_all_pesticide_catalog()
    search_q = st.text_input("Search active ingredients, trade names, or diseases (e.g. Mancozeb, Rice Blast, Thrips):")

    filtered = [
        item for item in catalog
        if search_q.lower() in item["trade_name"].lower()
        or search_q.lower() in item["active_ingredient"].lower()
        or any(search_q.lower() in d.lower() for d in item["target_diseases"])
    ]

    for item in filtered:
        with st.expander(f"💊 {item['trade_name']} ({item['active_ingredient']})"):
            st.write(f"**Category:** {item['category']} • **Agency:** {item['regulatory_body']}")
            st.write(f"**Target Pests / Diseases:** {', '.join(item['target_diseases'])}")
            st.success(f"**15L Knapsack Sprayer Dilution:** {item['recommended_dilution']}")
            st.write(f"**Pre-Harvest Interval (PHI):** {item['waiting_period_phi']}")
            st.warning(f"**Safety Precautions:** {item['safety_precautions']}")
            st.caption(f"Application Guidance: {item['application_guidance']}")

# ==========================================
# 6. AI FARMER ASSISTANT (CHATBOT)
# ==========================================
elif "Assistant" in page or "రైతు ఏఐ మిత్రుడు" in page:
    st.title("🤖 " + ("రైతు ఏఐ మిత్రుడు (ద్విభాషా సహాయకుడు)" if is_te else "Bilingual AI Farmer Assistant"))
    st.caption("Ask questions in English or Telugu (తెలుగు) about crops, yellowing leaves, soil fertility, and pests.")

    if "chat_history" not in st.session_state:
        st.session_state.chat_history = [
            {"sender": "assistant", "text": "నమస్కారం! నేను మీ వ్యవసాయ సహాయకుడిని. మీ ప్రశ్నను అడగండి.\nHello! I am your AI farming assistant. How can I help you today?"}
        ]

    for msg in st.session_state.chat_history:
        if msg["sender"] == "assistant":
            with st.chat_message("assistant", avatar="🌱"):
                st.markdown(msg["text"])
        else:
            with st.chat_message("user", avatar="👨‍🌾"):
                st.markdown(msg["text"])

    user_query = st.chat_input("Type your question here / మీ ప్రశ్నను టైప్ చేయండి:")
    if user_query:
        st.session_state.chat_history.append({"sender": "farmer", "text": user_query})
        with st.chat_message("user", avatar="👨‍🌾"):
            st.markdown(user_query)

        with st.chat_message("assistant", avatar="🌱"):
            resp = ask_farmer_assistant(user_query, language=lang_code)
            st.markdown(resp["reply"])
            st.session_state.chat_history.append({"sender": "assistant", "text": resp["reply"]})

# ==========================================
# 7. MY FARM & WEATHER
# ==========================================
elif "Farm" in page or "నా పొలం" in page:
    st.title("🏡 " + ("నా పొలం & స్థాన సమాచారం" if is_te else "My Farmstead & Geographic Location"))
    prof = get_farm_profile()

    with st.form("farm_form"):
        st.subheader("Edit Farm Profile")
        c1, c2, c3 = st.columns(3)
        with c1:
            fname = st.text_input("Farmer Name:", value=prof.get("farmer_name", "Ramesh Patel"))
            phone = st.text_input("Mobile Phone:", value=prof.get("phone", "9876543210"))
        with c2:
            village = st.text_input("Village:", value=prof.get("village", "Thirumalayapalem"))
            district = st.text_input("District:", value=prof.get("district", "Khammam"))
        with c3:
            state = st.text_input("State:", value=prof.get("state", "Telangana"))
            acres = st.number_input("Acreage:", value=float(prof.get("farm_size_acres", 6.5)))

        c4, c5 = st.columns(2)
        with c4:
            lat = st.number_input("Latitude:", value=float(prof.get("latitude", 17.2473)), format="%.4f")
        with c5:
            lon = st.number_input("Longitude:", value=float(prof.get("longitude", 80.1514)), format="%.4f")

        submitted = st.form_submit_button("Save Farm Changes")
        if submitted:
            update_farm_profile({
                "farmer_name": fname,
                "phone": phone,
                "village": village,
                "district": district,
                "state": state,
                "latitude": lat,
                "longitude": lon,
                "farm_size_acres": acres,
                "primary_crop": prof.get("primary_crop", "Cotton & Chilli"),
                "soil_type": prof.get("soil_type", "Black Cotton Soil"),
                "preferred_language": lang_code
            })
            st.success("Farm profile updated successfully!")

    # Map display
    st.subheader("📍 Farm Geographic Location")
    st.map(data={"lat": [lat], "lon": [lon]}, zoom=12)

st.markdown("---")
st.caption("© 2026 AgriSmart AI • Dedicated to Indian Farmers • CIB&RC & ICAR Aligned")
