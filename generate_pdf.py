import os
from fpdf import FPDF

class AgriSmartPDF(FPDF):
    def header(self):
        self.set_fill_color(27, 94, 32) # Dark Green
        self.rect(0, 0, 210, 16, 'F')
        self.set_xy(10, 4)
        self.set_font('Helvetica', 'B', 12)
        self.set_text_color(255, 255, 255)
        self.cell(0, 8, 'AgriSmart AI - Executive & Technical Summary')
        self.ln(15)

    def footer(self):
        self.set_y(-12)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 8, f'Page {self.page_no()} | AgriSmart AI Platform | Kisan Helpline: 1800-180-1551', align='C')

def generate_summary_pdf(output_path="AgriSmart_AI_Summary.pdf"):
    pdf = AgriSmartPDF(orientation='P', unit='mm', format='A4')
    pdf.set_auto_page_break(auto=True, margin=14)
    pdf.add_page()
    
    # Title & Subtitle
    pdf.set_font('Helvetica', 'B', 14)
    pdf.set_text_color(27, 94, 32)
    pdf.cell(0, 6, 'AI-Powered Smart Agriculture Platform (AgriSmart AI)')
    pdf.ln(6)
    
    pdf.set_font('Helvetica', 'I', 8.5)
    pdf.set_text_color(80, 80, 80)
    pdf.cell(0, 5, 'Designed for Indian Farmers | Aligned with ICAR & CIBRC Standards')
    pdf.ln(7)

    # Overview Box
    pdf.set_fill_color(240, 248, 240)
    pdf.set_draw_color(200, 225, 200)
    pdf.set_font('Helvetica', '', 8)
    pdf.set_text_color(40, 40, 40)
    overview_text = (
        "Overview: AgriSmart AI delivers real-time computer vision crop identification, plant leaf disease "
        "detection with quantitative chlorophyll/lesion metrics, laboratory soil health card calculations (ICAR NPK dosages), "
        "live agro-weather spray windows via Open-Meteo, CIB&RC-registered pesticide recommendations, and a bilingual "
        "(English & Telugu) AI assistant."
    )
    pdf.multi_cell(0, 4.2, overview_text, border=1, fill=True)
    pdf.ln(4)

    # Section 1: Tech Stack
    pdf.set_font('Helvetica', 'B', 10.5)
    pdf.set_text_color(27, 94, 32)
    pdf.cell(0, 5.5, '1. Technology Stack & Multi-Channel Deployment')
    pdf.ln(6)

    pdf.set_font('Helvetica', 'B', 8)
    pdf.set_fill_color(46, 125, 50)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(35, 5, ' Layer', border=1, fill=True)
    pdf.cell(65, 5, ' Technology Used', border=1, fill=True)
    pdf.cell(90, 5, ' Role in Platform', border=1, fill=True)
    pdf.ln(5)

    tech_rows = [
        ('Frontend (Web)', 'React 18, Vite, Tailwind CSS, Recharts', 'Responsive cards, charts, Leaflet farm mapping'),
        ('Backend (API)', 'Python FastAPI, Uvicorn, SQLite3', 'REST endpoints, SQLite persistence, schema validation'),
        ('AI / Computer Vision', 'PyTorch 2.8, Torchvision, Pillow, NumPy', 'MobileNetV2 crop classifier & PlantVillage leaf CNN'),
        ('Cloud App (1-Click)', 'Streamlit 1.50, Pandas, Altair', 'Streamlit Cloud public app for mobile & web'),
        ('Meteorology API', 'Open-Meteo Live API (Free & Keyless)', 'Real-time weather, humidity, and safe spray alerts')
    ]

    pdf.set_font('Helvetica', '', 7.5)
    pdf.set_text_color(40, 40, 40)
    for layer, tech, role in tech_rows:
        pdf.cell(35, 4.5, f' {layer}', border=1)
        pdf.cell(65, 4.5, f' {tech}', border=1)
        pdf.cell(90, 4.5, f' {role}', border=1)
        pdf.ln(4.5)
    pdf.ln(4)

    # Section 2: Core Agricultural Features
    pdf.set_font('Helvetica', 'B', 10.5)
    pdf.set_text_color(27, 94, 32)
    pdf.cell(0, 5.5, '2. Core Agricultural Capabilities')
    pdf.ln(6)

    features = [
        ("AI Crop Identification", "Classifies 10 major Indian crops (Rice, Wheat, Cotton, Maize, Tomato, Potato, Chilli, Groundnut, Sugarcane, Soybean) with season, duration, temperature, water requirements, and ICAR cultivation best practices."),
        ("Plant Disease Detection", "Detects Early/Late Blights, Rust, Rice Blast, and Leaf Curl Virus. Accurately flags healthy vs infected tissue with quantitative visual metrics (% chlorophyll, % lesions, severity). Warns if confidence < 70%."),
        ("Soil Analysis & Nutrients", "Separates visual image observations from laboratory soil test card numbers. Calculates Soil Health Score (0-100) and exact ICAR fertilizer prescriptions: Urea in 3 split doses, DAP/SSP, MOP, and Gypsum/Lime."),
        ("Location-Based Agro-Weather", "Interactive Leaflet OpenStreetMap with GPS pin & Indian village geocoding. Real-time Open-Meteo weather with actionable Spray Window Alerts (warns against spraying before rain or high wind)."),
        ("CIB&RC Pesticide Advisory", "Official Indian Central Insecticides Board approved active ingredients (Mancozeb 75 WP, Tricyclazole, Imidacloprid, Neem Oil, Trichoderma) with exact 15L knapsack dilution and Pre-Harvest Intervals (PHI)."),
        ("Bilingual AI Assistant", "Chatbot in simple English and Telugu answering common questions on leaf yellowing (chlorosis vs nitrogen deficiency), crop suitability, fertilizer scheduling, and irrigation with Web Speech TTS audio."),
        ("Farmer Dashboard & My Farm", "KPI cards, Recharts NPK balance chart, farmstead land acreage editor, and SQLite persistent historical diagnostic logs.")
    ]

    for title, desc in features:
        pdf.set_font('Helvetica', 'B', 8)
        pdf.set_text_color(27, 94, 32)
        bullet_header = f"  * {title}: "
        pdf.write(4.2, bullet_header)
        pdf.set_font('Helvetica', '', 7.8)
        pdf.set_text_color(45, 45, 45)
        pdf.write(4.2, desc + "\n")
        pdf.ln(1)

    pdf.ln(3)

    # Section 3: Deployment & Access Links
    pdf.set_font('Helvetica', 'B', 10.5)
    pdf.set_text_color(27, 94, 32)
    pdf.cell(0, 5.5, '3. Deployment Links & Access Commands')
    pdf.ln(6)

    pdf.set_font('Helvetica', 'B', 8)
    pdf.set_fill_color(27, 94, 32)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(45, 5, ' Environment / Target', border=1, fill=True)
    pdf.cell(90, 5, ' URL / Repository Location', border=1, fill=True)
    pdf.cell(55, 5, ' Access Command', border=1, fill=True)
    pdf.ln(5)

    links_rows = [
        ('GitHub Repository', 'https://github.com/shaikmohammedshoaib666/AI', 'git push origin main'),
        ('Streamlit Cloud App', 'share.streamlit.io (Auto-detects streamlit_app.py)', '1-Click deploy from GitHub'),
        ('FastAPI Backend (Local)', 'http://localhost:8000 (Swagger: /docs)', 'uvicorn main:app --port 8000'),
        ('React Frontend (Local)', 'http://localhost:5173', 'npm run dev'),
        ('Streamlit App (Local)', 'http://localhost:8501', 'streamlit run streamlit_app.py')
    ]

    pdf.set_font('Helvetica', '', 7.5)
    pdf.set_text_color(40, 40, 40)
    for env, url, cmd in links_rows:
        pdf.cell(45, 4.5, f' {env}', border=1)
        pdf.cell(90, 4.5, f' {url}', border=1)
        pdf.cell(55, 4.5, f' {cmd}', border=1)
        pdf.ln(4.5)

    pdf.ln(4)

    # Disclaimer Note
    pdf.set_font('Helvetica', 'I', 7.2)
    pdf.set_text_color(100, 100, 100)
    disclaimer = (
        "Statutory Notice: All chemical formulations comply with CIB&RC registers. Always read product container "
        "labels before application. Kisan Call Centre Toll-Free: 1800-180-1551 (Available in 22 Indian languages)."
    )
    pdf.multi_cell(0, 3.6, disclaimer)

    pdf.output(output_path)
    file_size_kb = round(os.path.getsize(output_path) / 1024, 1)
    print(f"PDF successfully generated: {output_path} ({file_size_kb} KB)")

if __name__ == '__main__':
    generate_summary_pdf()
