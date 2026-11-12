"""
AgriSmart AI Assistant: Bilingual (English & Telugu - తెలుగు)
Specialized agricultural advisory engine answering practical farming questions:
crop suitability, yellow leaves (chlorosis / nitrogen / iron deficiency),
soil fertility improvements, fertilizer dosing, irrigation scheduling, and pest/disease management.
"""
from typing import Dict, Any, List

QA_KNOWLEDGE_BASE = [
    {
        "keywords": ["crop", "suitable", "soil", "grow", "పంట", "నేల", "భూమి", "వేసుకోవచ్చు", "అనుకూలమైన"],
        "en": (
            "🌾 **Crop Suitability Guide for Your Soil:**\n\n"
            "• **Black Clay / Regur Soil:** Best for **Cotton (ప్రత్తి)**, **Chilli (మిరప)**, **Soybean**, **Pigeon Pea (కందులు)**, and **Sunflower** due to superior moisture retention.\n"
            "• **Red Loamy Soil:** Ideal for **Groundnut (వేరుశనగ)**, **Maize (మొక్కజొన్న)**, **Pulses**, **Vegetables (Tomato, Brinjal)**, and **Castor**.\n"
            "• **Alluvial / Loamy Soil:** Highly fertile for **Paddy (వరి)**, **Wheat (గోధుమ)**, **Sugarcane (చెరకు)**, and horticultural crops.\n"
            "• **Sandy / Light Soil:** Good for **Millets (Jowar, Bajra)**, **Watermelon**, and **Groundnut** with drip irrigation.\n\n"
            "💡 *Tip:* Test your soil pH first! Most crops thrive between pH 6.5 and 7.5."
        ),
        "te": (
            "🌾 **మీ నేలకు అనుకూలమైన పంటల సమాచారం:**\n\n"
            "• **నల్లరేగడి నేలలు:** తేమను నిలుపుకునే గుణం ఎక్కువ కాబట్టి **ప్రత్తి (Cotton)**, **మిరప (Chilli)**, **సోయాబీన్**, **కందులు** బాగా పండుతాయి.\n"
            "• **ఎర్ర నేలలు / చెల్కా భూములు:** నీరు త్వరగా ఇంకే స్వభావం కలవి. వీటికి **వేరుశనగ**, **మొక్కజొన్న**, **టమాటా**, మరియు **అపరాలు (పప్పుధాన్యాలు)** అనుకూలం.\n"
            "• **వరి నేలలు / ఒండ్రు మట్టి:** **వరి**, **చెరకు**, **గోధుమ**, కూరగాయలకు ఉత్తమమైనవి.\n"
            "• **తేలికపాటి ఇసుక నేలలు:** **సజ్జలు**, **జొన్నలు**, **పుచ్చకాయ** సాగుకు అనుకూలం.\n\n"
            "💡 *సలహా:* ముందుగా మీ నేల pH పరీక్షించండి (6.5 నుండి 7.5 మధ్య ఉంటే పంటకు మేలు)."
        )
    },
    {
        "keywords": ["yellow", "leaves", "chlorosis", "పసుపు", "ఆకులు", "పాలిపోవడం", "పసుపుపచ్చ", "మచ్చలు"],
        "en": (
            "🍃 **Why Leaves Turn Yellow & How to Fix Them:**\n\n"
            "1. **Nitrogen (N) Deficiency:** Bottom (older) leaves turn pale yellow starting from leaf tips along the midrib, while upper leaves stay green. *Remedy:* Foliar spray of **1% Urea (10g/L)** or 19:19:19 @ 5g/L.\n"
            "2. **Iron (Fe) Chlorosis:** Top (youngest) leaves turn bleached pale yellow/white while veins remain green (interveinal chlorosis), common in alkaline/calcareous soils. *Remedy:* Spray **Ferrous Sulphate (FeSO4) @ 5g/L + 1g Citric acid**.\n"
            "3. **Zinc (Zn) Deficiency:** Mid-leaf whitening (Khaira disease in rice). *Remedy:* Spray **Zinc Sulphate (21% or 33%) @ 2g/L** with lime.\n"
            "4. **Waterlogging / Root Suffocation:** Standing water deprives roots of oxygen, turning all leaves yellow. *Remedy:* Drain excess water immediately and loosen soil surface.\n"
            "5. **Sucking Pests (Thrips / Whiteflies / Mites):** Leaves curl and turn mottled yellow. *Remedy:* Spray **Neem oil 10000 PPM (2ml/L)** or Acetamiprid @ 0.3g/L."
        ),
        "te": (
            "🍃 **ఆకులు పసుపు రంగులోకి మారడానికి కారణాలు & నివారణ:**\n\n"
            "1. **నత్రజని (యూరియా) లోపం:** కింద ఉన్న పాత ఆకులు మొదట పసుపు రంగులోకి మారతాయి. *నివారణ:* **19:19:19 ఎరువును లీటరు నీటికి 5 గ్రాములు** లేదా యూరియా 10 గ్రాములు కలిపి పిచికారీ చేయండి.\n"
            "2. **ఇనుము (ఐరన్) లోపం:** పైనున్న లేత ఆకులు పసుపు లేదా తెల్లగా మారి, ఈనెలు ఆకుపచ్చగా ఉంటాయి (సున్నపు నేలల్లో ఎక్కువ). *నివారణ:* **ఫెర్రస్ సల్ఫేట్ 5 గ్రాములు + నిమ్మప్పు 1 గ్రాము** లీటరు నీటికి కలిపి పిచికారీ చేయాలి.\n"
            "3. **జింక్ లోపం:** ఆకులపై తుప్పు మచ్చలు వచ్చి పసుపుగా మారుతాయి (వరిలో ఖైరా తెగులు). *నివారణ:* **జింక్ సల్ఫేట్ 2 గ్రా/లీ** పిచికారీ చేయండి.\n"
            "4. **నీరు నిలబడటం:** వేర్లకు గాలి ఆడక ఆకులు పసుపుబారతాయి. వెంటనే మురుగునీటిని తీసివేయండి.\n"
            "5. **రసం పీల్చే పురుగులు (తెల్లదోమ/తామర పురుగులు):** ఆకులు ముడుచుకుని పసుపుగా మారతాయి. *నివారణ:* **వేపనూనె 10000 PPM (2 మి.లీ/లీ)** పిచికారీ చేయండి."
        )
    },
    {
        "keywords": ["fertility", "soil", "improve", "carbon", "భూసారం", "సారవంతం", "సారం", "సేంద్రియ"],
        "en": (
            "🌱 **Proven Ways to Rebuild Soil Fertility & Organic Carbon:**\n\n"
            "1. **Green Manuring (పచ్చిరొట్ట ఎరువులు):** Sow **Dhaincha (జీలుగు)** or **Sunn hemp (జనుము)** at 15-20 kg/acre and plow it in situ at flowering stage (45 days) to add 10-15 tonnes of organic biomass.\n"
            "2. **Farmyard Manure (FYM) & Vermicompost:** Apply 3-4 tonnes well-rotted FYM or 1 tonne vermicompost per acre before final plowing.\n"
            "3. **Bio-fertilizers:** Inoculate soil with **Azotobacter / Azospirillum** (fixes nitrogen) and **PSB (Phosphate Solubilizing Bacteria)** @ 2 kg/acre mixed in compost.\n"
            "4. **Crop Rotation with Legumes:** Rotate heavy feeding crops (Cotton/Paddy) with pulses (Green gram, Black gram, Soybean) which naturally fix atmospheric nitrogen.\n"
            "5. **Retain Crop Residue:** Avoid burning stubble! Incorporate stubble with Trichoderma or waste decomposer."
        ),
        "te": (
            "🌱 **భూసారాన్ని మరియు సేంద్రీయ కర్బనాన్ని పెంచే మార్గాలు:**\n\n"
            "1. **పచ్చిరొట్ట పైర్లు:** వర్షాకాలం ప్రారంభంలో **జనుము (Sunn hemp)** లేదా **జీలుగు (Dhaincha)** విత్తి, పూత దశలో (45 రోజులకు) ట్రాక్టర్‌తో కలియదున్నాలి. ఇది ఎకరానికి 10-15 టన్నుల సేంద్రీయ పదార్థాన్ని అందిస్తుంది.\n"
            "2. **పశువుల ఎరువు & వర్మీ కంపోస్ట్:** ఆఖరి దుక్కిలో ఎకరానికి 3-4 ట్రాలీల బాగా చివికిన పశువుల ఎరువు లేదా 1 టన్ను వర్మీ కంపోస్ట్ వేయాలి.\n"
            "3. **జీవన ఎరువులు (Bio-fertilizers):** అజోస్పైరిల్లం, ఫాస్ఫో బ్యాక్టీరియా (PSB) ఎకరానికి 2 కేజీలు పశువుల ఎరువుతో కలిపి నేలలో వేయాలి.\n"
            "4. **పంట మార్పిడి:** పత్తి లేదా వరి తర్వాత పెసర, మినుము, శనగ వంటి పప్పుధాన్యాల పంటలు వేస్తే భూమికి సహజ నత్రజని లభిస్తుంది.\n"
            "5. **మోళ్ళు కాల్చవద్దు:** పంట వ్యర్థాలను తగులబెట్టకుండా రోటవేటర్‌తో భూమిలో కలియదున్ని డీకంపోజర్ వాడండి."
        )
    },
    {
        "keywords": ["fertilizer", "urea", "dap", "potash", "use", "ఎరువు", "ఎరువులు", "యూరియా", "డిఎపి", "పొటాష్"],
        "en": (
            "🧪 **Scientific Fertilizer Application (4R Stewardship):**\n\n"
            "• **Right Source:** Use balanced **NPK (Nitrogen-Phosphorus-Potassium)** based on soil test card.\n"
            "• **Right Time & Splitting:**\n"
            "  - **Phosphorus (DAP / SSP):** Apply **100% as basal** (at planting) deep into root zone; plants cannot absorb top-dressed phosphorus.\n"
            "  - **Nitrogen (Urea):** Apply in **3 splits** (Basal 33%, Tillering/Vegetative 33%, Flowering/Panicle 33%) to prevent leaching losses.\n"
            "  - **Potash (MOP):** Apply in **2 splits** for better grain filling and drought resistance.\n"
            "• **Right Placement:** Place fertilizer 5 cm away from seeds and 5 cm deep. Never broadcast urea onto standing flooded water or scorching dry soil without incorporation.\n"
            "• **Right Dose:** Always balance synthetic fertilizer with organic manure."
        ),
        "te": (
            "🧪 **ఎరువుల సమతుల్య వినియోగ పద్ధతులు:**\n\n"
            "• **సరైన ఎరువుల ఎంపిక:** మట్టి పరీక్ష ఆధారంగా NPK ఎరువులను వాడాలి.\n"
            "• **సమయం & దఫాలుగా వేయడం:**\n"
            "  - **భాస్వరం (DAP / SSP):** మొత్తం మోతాదును విత్తే సమయంలో **ఆఖరి దుక్కిలోనే** వేయాలి (పైపాటుగా వేస్తే ఫలితం ఉండదు).\n"
            "  - **నత్రజని (యూరియా):** ఒకేసారి వేయకుండా **3 సమ భాగాలుగా** (మొదటి దఫా, పిలకలు/శాఖల దశ, పూత దశలో) వేయాలి.\n"
            "  - **పొటాష్ (MOP):** పంటకు రోగనిరోధక శక్తి, గింజ బరువు పెరగడానికి 2 దఫాలుగా వేయడం శ్రేయస్కరం.\n"
            "• **వేసే పద్ధతి:** ఎరువును నేరుగా మొక్క మొదలుకు తగలకుండా 5 సెం.మీ దూరంలో వేసి మట్టి కప్పాలి."
        )
    },
    {
        "keywords": ["irrigate", "irrigation", "water", "schedule", "నీరు", "తడి", "నీటిపారుదల", "ఎప్పుడు", "నీళ్లు"],
        "en": (
            "💧 **Smart Irrigation Scheduling:**\n\n"
            "• **Critical Growth Stages (Never allow moisture stress):**\n"
            "  - **Paddy:** Panicle initiation and flowering stages.\n"
            "  - **Cotton:** Square formation and boll development.\n"
            "  - **Maize:** Knee-high, tasseling, and cob silking stages.\n"
            "  - **Chilli & Tomato:** Flowering and fruit enlargement.\n"
            "• **Best Time of Day:** Irrigate during **early morning or late evening**. Midday watering causes up to 40% loss to solar evaporation and induces root shock.\n"
            "• **Field Test:** Pick soil from 4-6 inches depth and squeeze it in your palm. If it forms a firm ball without releasing excess water, moisture is optimal. If it crumbles, irrigate."
        ),
        "te": (
            "💧 **నీటి యాజమాన్యం మరియు తడుల సమయాలు:**\n\n"
            "• **కీలక దశలు (ఈ దశల్లో నీటి ఎద్దడి ఉండకూడదు):**\n"
            "  - **వరి:** చిరుపొట్ట మరియు ఈనె దశలలో.\n"
            "  - **ప్రత్తి:** పూత, కాత మరియు కాయల ఎదుగుదల దశలలో.\n"
            "  - **మొక్కజొన్న:** మోకాలి ఎత్తు, పూత (కంకి) వచ్చే సమయాలలో.\n"
            "  - **మిరప & టమాటా:** పూత మరియు కాయల పెరుగుదల సమయంలో.\n"
            "• **సరైన సమయం:** ఎండ తీవ్రత ఎక్కువగా ఉండే మధ్యాహ్నం కాకుండా, **ఉదయం లేదా సాయంత్రం వేళల్లో** మాత్రమే నీరు పెట్టాలి.\n"
            "• **డ్రిప్ (బిందు సేద్యం) వాడకం:** సంప్రదాయ పద్ధతి కంటే 40% నీరు ఆదా అవుతుంది, కలుపు సమస్య తగ్గుతుంది."
        )
    },
    {
        "keywords": ["disease", "prevent", "pest", "fungus", "పురుగులు", "తెగుళ్ళు", "రోగం", "నివారణ", "మందులు"],
        "en": (
            "🛡️ **Integrated Pest & Disease Management (IPM):**\n\n"
            "1. **Seed Treatment (First Line of Defense):** Treat seeds with **Trichoderma viride @ 5g/kg** or **Carbendazim @ 2g/kg** before sowing to stop damping off and seed-borne fungi.\n"
            "2. **Pheromone Traps & Sticky Traps:**\n"
            "   - Yellow sticky traps (15/acre) for Whitefly and Aphids.\n"
            "   - Blue sticky traps (15/acre) for Thrips.\n"
            "   - Pheromone traps (5/acre) for Pink Bollworm (Cotton) and Fall Armyworm (Maize).\n"
            "3. **Prophylactic Organic Sprays:** Spray **Neem oil 10,000 PPM (2ml/L)** or 5% NSKE every 15 days to repel insects.\n"
            "4. **Fungicide Rotation:** Avoid using the same chemical mode of action repeatedly to prevent pathogen resistance."
        ),
        "te": (
            "🛡️ **సమగ్ర సస్యరక్షణ & పురుగులు-తెగుళ్ళ నివారణ (IPM):**\n\n"
            "1. **విత్తన శుద్ధి (చాలా ముఖ్యం):** విత్తే ముందు కేజీ విత్తనానికి **ట్రైకోడెర్మా విరిడే 5 గ్రాములు** లేదా కార్బండజిమ్ 2 గ్రాములతో విత్తన శుద్ధి చేయాలి.\n"
            "2. **జిగురు మరియు లింగాకర్షక బుట్టలు:**\n"
            "   - పసుపు రంగు జిగురు అట్టలు (ఎకరానికి 15-20) తెల్లదోమ కోసం.\n"
            "   - నీలి రంగు జిగురు అట్టలు (ఎకరానికి 15-20) తామర పురుగుల (Thrips) కోసం.\n"
            "   - పత్తిలో గులాబీ రంగు పురుగు కోసం లింగాకర్షక బుట్టలు (ఎకరానికి 5) పెట్టాలి.\n"
            "3. **సేంద్రీయ రక్షణ:** ప్రతి 15 రోజులకు ఒకసారి **వేప నూనె (10,000 PPM) 2 మి.లీ/లీ** నీటికి కలిపి పిచికారీ చేయాలి.\n"
            "4. **రసాయన మందులు:** తెగులు తీవ్రత ఎక్కువగా ఉన్నప్పుడు మాత్రమే సిఫార్సు చేసిన మోతాదులో పురుగు మందులు మార్చి మార్చి వాడాలి."
        )
    }
]

def ask_farmer_assistant(query: str, language: str = "en") -> Dict[str, Any]:
    """
    Answers farmer's questions in English or Telugu with actionable agricultural guidance.
    """
    q_lower = query.lower()
    
    # Check if query is in Telugu or requested language is Telugu
    is_telugu = (language == "te") or any(char >= '\u0c00' and char <= '\u0c7f' for char in query)
    chosen_lang = "te" if is_telugu else "en"

    matched_entry = None
    best_match_count = 0

    for item in QA_KNOWLEDGE_BASE:
        count = sum(1 for kw in item["keywords"] if kw.lower() in q_lower)
        if count > best_match_count:
            best_match_count = count
            matched_entry = item

    if matched_entry:
        answer_text = matched_entry[chosen_lang]
    else:
        # Fallback comprehensive response
        if chosen_lang == "te":
            answer_text = (
                f"నమస్కారం రైతు సోదరులారా! మీ ప్రశ్నను పరిశీలించాను: '{query}'\n\n"
                "వ్యవసాయ సలహా:\n"
                "• పంటలో సరైన తేమ మరియు సేంద్రీయ ఎరువులను (పశువుల ఎరువు / వర్మీకంపోస్ట్) వాడండి.\n"
                "• ఆకులపై తెగులు లేదా పురుగుల లక్షణాలు కనిపిస్తే వెంటనే ఫోటో తీసి మా 'Disease Detection' విభాగంలో అప్‌లోడ్ చేయండి.\n"
                "• అధిక సమాచారం మరియు స్థానిక సలహా కోసం మీ సమీప కృషి విజ్ఞాన కేంద్రం (KVK) వ్యవసాయ విస్తరణ అధికారిని (AEO) సంప్రదించండి."
            )
        else:
            answer_text = (
                f"Hello Farmer friend! Thank you for asking: '{query}'\n\n"
                "General Agronomic Guidance:\n"
                "• Ensure your crop receives balanced NPK nutrition according to a recent Soil Health Card.\n"
                "• If you notice leaf discoloration, spots, or curling, please upload a clear close-up image to our **Disease Detection** tool for an instant AI diagnosis.\n"
                "• Maintain regular field scouting and install sticky traps for early insect detection.\n"
                "• For district-specific seed varieties and weather advisories, visit your nearest Krishi Vigyan Kendra (KVK) or contact the Kisan Call Centre (Toll-Free: 1800-180-1551)."
            )

    return {
        "query": query,
        "language": chosen_lang,
        "reply": answer_text,
        "suggestions": [
            "Which crop is suitable for my soil?" if chosen_lang == "en" else "నా నేలకు ఏ పంట అనుకూలం?",
            "Why are my leaves turning yellow?" if chosen_lang == "en" else "నా పంట ఆకులు ఎందుకు పసుపుగా మారుతున్నాయి?",
            "How can I improve soil fertility?" if chosen_lang == "en" else "భూసారాన్ని ఎలా పెంచుకోవాలి?",
            "Which fertilizer should I use?" if chosen_lang == "en" else "ఏ ఎరువులు ఎంత మోతాదులో వాడాలి?"
        ]
    }
