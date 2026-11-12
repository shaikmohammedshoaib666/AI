# AgriSmart AI – AI-Powered Smart Agriculture Platform (భారతీయ రైతుల కోసం స్మార్ట్ వ్యవసాయం)

[![Open in Streamlit](https://static.streamlit.io/badges/streamlit_badge_black_white.svg)](https://share.streamlit.io/deploy?repository=shaikmohammedshoaib666/AI&branch=main&mainModule=streamlit_app.py)

An AI-powered agriculture assistance platform primarily designed for Indian farmers. AgriSmart AI helps farmers identify crops, detect plant diseases from leaf photographs using deep computer vision, perform visual and laboratory soil nutrient diagnostics (ICAR benchmarks), receive CIBRC-registered pesticide/fertilizer recommendations, check live agro-weather spray windows, and converse with a bilingual (English & Telugu) AI agricultural assistant.

---

## 🌟 Key Features

### 1. 🌾 AI Crop Identification
- Upload photos of crops or plants taken in the field.
- MobileNetV2 transfer-learned deep feature extraction models crop taxonomy.
- Displays botanical name, confidence percentage, Kharif/Rabi/Zaid seasonality, growth period, optimal temperature & rainfall requirements, and ICAR key cultivation practices.
- Identifies major Indian crops: Paddy/Rice, Wheat, Cotton, Maize, Tomato, Potato, Chilli, Groundnut, Sugarcane, Soybean.

### 2. 🍂 Plant Disease Detection
- Screen leaf images using a pretrained PlantVillage deep convolutional neural network + RGB/HSV color-space segmentation.
- Diagnoses Early Blight, Late Blight, Leaf Curl Virus, Rice Blast, Brown Spot, Bacterial Blight, and Common Rust.
- Distinguishes healthy leaves from infected leaves with quantitative metrics (chlorophyll green %, necrotic lesion %, chlorosis yellowing %, estimated severity %).
- **Low Confidence Warning**: Flags images with confidence below 70% or non-vegetation photos with guidance to capture clearer close-ups or consult local Krishi Vigyan Kendra (KVK) experts.
- Provides scientific pathogen etiology, organic/bio-control solutions (Trichoderma, Neem oil, Pseudomonas), and approved CIB&RC chemical formulations.

### 3. 🧪 Soil Analysis & Nutrient Balancing
- **Visual Preliminary Observation**: Analyzes surface texture, clod roughness, Munsell-approximate color spectrum, and surface moisture sheen.
- **Laboratory Soil Health Card Evaluation**: Enter measured values for Nitrogen ($N$), Phosphorus ($P$), Potassium ($K$), pH, moisture $\%$, and temperature.
- **Scientific Transparency**: Strictly and visually separates preliminary image estimates from laboratory-tested measured values.
- Calculates official Soil Health Index ($0-100$), nutrient adequacy classifications (Deficient, Medium, High), and calculates exact ICAR fertilizer dosages (e.g. Urea 46% N kg/acre in 3 splits, DAP / SSP, MOP 60% K2O, Agricultural Gypsum / Lime for sodic/acidic pH correction).

### 4. 🌦️ Location-Based Farming & Live Agro-Weather
- Interactive Leaflet / OpenStreetMap mapping with GPS auto-detection or search by Indian village/district/state.
- Real-time weather and 7-day agronomic forecast via Open-Meteo live meteorological API.
- **Actionable Spray Windows**: Advises when conditions are favorable for spraying or flags rain/high wind alerts to avoid chemical wash-off and drift.

### 5. 🛡️ Official Pesticide & Fertilizer Guide (CIB&RC Aligned)
- Curated database of Central Insecticides Board & Registration Committee (CIB&RC) and ICAR registered formulations.
- Displays active ingredients, commercial trade names, exact dilution rates per 15L knapsack sprayer, Pre-Harvest Intervals (PHI), and safety precautions.
- Never invents dosages or recommends hazardous unauthorized chemicals.

### 6. 🤖 Bilingual AI Farmer Assistant (రైతు ఏఐ మిత్రుడు)
- Interactive chatbot with bilingual support in simple **English** and **Telugu (తెలుగు)**.
- Answers frequent farmer questions:
  - *Which crop is suitable for my soil?* (నా నేలకు ఏ పంట అనుకూలం?)
  - *Why are my leaves turning yellow?* (నా పంట ఆకులు ఎందుకు పసుపుగా మారుతున్నాయి?)
  - *How can I improve soil fertility?* (భూసారాన్ని ఎలా పెంచుకోవాలి?)
  - *Which fertilizer should I use?* (ఏ ఎరువులు ఎంత మోతాదులో వాడాలి?)
  - *When should I irrigate?* (పంటకు నీరు ఎప్పుడు పెట్టాలి?)
  - *How can I prevent crop diseases?* (తెగుళ్ళు రాకుండా ఎలాంటి జాగ్రత్తలు తీసుకోవాలి?)
- Features browser Speech Synthesis (Read-Aloud) for farmer accessibility.

### 7. 📊 Farmer Dashboard & My Farm Log
- Unified dashboard featuring primary crop selection, soil health score gauge, live weather alerts, recent scan history, and seasonal farming tips.
- Persistent SQLite database storage for farmer profiles, location coordinates, soil test records, and diagnostic scans.
- Export / Print farm report feature.

---

## 🛠️ Technology Stack

- **Frontend**: React.js 18, Vite, Tailwind CSS, Lucide React icons, Recharts, Leaflet.
- **Backend**: Python 3.9+, FastAPI, Uvicorn, Pydantic, SQLite3.
- **AI / Computer Vision**: PyTorch, Torchvision (MobileNetV2), Pillow, NumPy.
- **Live APIs**: Open-Meteo meteorological and geocoding services (free, open, no key required).

---

## 📁 Project Structure

```text
agrismart-ai/
├── README.md
├── backend/
│   ├── .env.example
│   ├── agrismart.db             # SQLite persistent database
│   ├── database.py              # SQLite connection, schemas & query helpers
│   ├── main.py                  # FastAPI application & REST endpoints
│   ├── requirements.txt         # Python dependencies
│   ├── sample_data.py           # Database seeder for demo data
│   ├── schemas.py               # Pydantic request/response validation
│   ├── uploads/                 # Uploaded media storage
│   └── models/
│       ├── chatbot.py           # Bilingual English & Telugu agronomy assistant
│       ├── crop_classifier.py   # PyTorch MobileNetV2 agricultural crop classifier
│       ├── disease_detector.py  # PlantVillage CNN + color-space leaf disease model
│       ├── pesticide_engine.py  # Indian CIBRC & ICAR pesticide registry
│       ├── soil_engine.py       # Visual texture + laboratory NPK & pH engine
│       └── weather_service.py   # Open-Meteo live agro-weather integration
└── frontend/
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    ├── vite.config.js
    └── src/
        ├── App.jsx              # Main routing & state container
        ├── index.css            # Tailwind directives & custom scrollbars
        ├── main.jsx             # React entry point
        ├── components/
        │   ├── Footer.jsx       # Govt portals, helplines & safety disclaimers
        │   ├── LeafletMap.jsx   # Interactive farm map with draggable pins
        │   ├── Navbar.jsx       # Navigation bar & language switcher
        │   └── WeatherWidget.jsx# Live temperature, humidity, spray alerts, forecast
        ├── pages/
        │   ├── AssistantPage.jsx       # Bilingual AI chatbot interface
        │   ├── CropDetectionPage.jsx   # Crop photo upload & growing conditions
        │   ├── DashboardPage.jsx       # Farmer dashboard with KPI cards & Recharts
        │   ├── DiseaseDetectionPage.jsx# Leaf disease detection & CIBRC treatments
        │   ├── HomePage.jsx            # Modern landing page & feature showcases
        │   ├── MyFarmPage.jsx          # Farm profile, map & scan history log
        │   ├── RecommendationsPage.jsx # CIBRC pesticide & fertilizer catalog
        │   └── SoilAnalysisPage.jsx    # Visual observation + NPK laboratory sliders
        ├── services/
        │   └── api.js           # Fetch API client for backend endpoints
        └── utils/
            └── sampleImages.js  # 1-click test canvas samples for leaves & soil
```

---

## 🚀 Setup & Execution Guide

### 1. Prerequisites
- **Node.js** (v18 or higher) and `npm`
- **Python** (v3.9 or higher)

### 2. Backend Setup

```bash
cd backend

# Create and activate Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Copy environment template
cp .env.example .env

# Initialize database and seed sample records
python3 sample_data.py

# Launch FastAPI backend server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The backend API will be live at: **`http://localhost:8000`**  
Interactive Swagger docs: **`http://localhost:8000/docs`**

### 3. Frontend Setup

```bash
cd frontend

# Install node dependencies
npm install

# Start Vite development server
npm run dev
```

The frontend will be live at: **`http://localhost:5173`**  
*(Vite proxies all `/api` calls directly to the backend at port 8000).*

---

## 🧪 Verified API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Model status and health check |
| `POST` | `/api/crops/identify` | Multipart image upload for crop identification |
| `POST` | `/api/diseases/detect` | Multipart image upload for leaf disease diagnosis |
| `POST` | `/api/soil/analyze-image` | Soil photograph preliminary visual analysis |
| `POST` | `/api/soil/evaluate-test` | Evaluates NPK, pH, moisture & generates ICAR prescriptions |
| `GET` | `/api/weather` | Live Open-Meteo weather with spray advisories |
| `GET` | `/api/weather/resolve-location` | Indian village/district geocoder |
| `GET` | `/api/pesticides/catalog` | Full CIB&RC registered pesticide catalog |
| `POST` | `/api/pesticides/recommend` | Formulations matching specific crop or disease |
| `POST` | `/api/assistant/chat` | Bilingual English & Telugu AI Assistant |
| `GET` | `/api/dashboard/summary` | Aggregated dashboard KPI data |
| `GET` / `PUT` | `/api/farm/profile` | Read and update farmer profile |
| `GET` | `/api/farm/history` | Historical crop and disease scan logs |

---

## 📜 Statutory Notice
*AgriSmart AI recommendations are designed to assist farmers based on agricultural research and the Central Insecticides Board & Registration Committee (CIB&RC) register. Farmers are always advised to follow container product labels and verify with local Krishi Vigyan Kendra (KVK) officers or the Kisan Call Centre (Toll-Free: 1800-180-1551).*
