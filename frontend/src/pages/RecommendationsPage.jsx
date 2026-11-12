import React, { useState, useEffect } from 'react';
import { 
  Pill, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  Droplets, 
  Clock, 
  FlaskConical, 
  CheckCircle2, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { fetchPesticideCatalog } from '../services/api';

export default function RecommendationsPage({ language }) {
  const isTe = language === 'te';
  const [catalog, setCatalog] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCatalog() {
      try {
        const data = await fetchPesticideCatalog();
        setCatalog(data);
      } catch (err) {
        console.error('Failed to load pesticide catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  const categories = [
    { id: 'all', label: isTe ? 'అన్నీ (All)' : 'All Formulations' },
    { id: 'blast_and_blight', label: isTe ? 'శిలీంధ్ర తెగుళ్ళు (Blights & Blasts)' : 'Fungal Blight & Blast' },
    { id: 'bacterial_diseases', label: isTe ? 'బాక్టీరియల్ తెగుళ్ళు (Bacterial Spots)' : 'Bactericides' },
    { id: 'sucking_pests_and_vectors', label: isTe ? 'రసం పీల్చే పురుగులు (Sucking Vectors)' : 'Vector & Insecticides' },
    { id: 'bio_fungicides', label: isTe ? 'సేంద్రీయ జీవ మందులు (Bio-Pesticides)' : 'Bio-Fungicides & Organic' }
  ];

  const filteredItems = catalog.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category_group === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      item.trade_name.toLowerCase().includes(q) ||
      item.active_ingredient.toLowerCase().includes(q) ||
      item.target_diseases.some(d => d.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold uppercase tracking-wider">
          <Pill className="w-3.5 h-3.5" />
          <span>{isTe ? 'కేంద్ర కీటకనాశినుల బోర్డు రిజిస్ట్రీ' : 'CIB&RC Registered Agro-Chemicals'}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          {isTe ? 'అనుమతించబడిన పురుగు & తెగులు మందుల సూచిక' : 'Official Pesticide & Fertilizer Guide'}
        </h1>
        <p className="text-stone-600 text-sm">
          {isTe
            ? 'భారత ప్రభుత్వ CIB&RC అనుమతించిన రసాయన మరియు సేంద్రీయ మందులు. 15 లీటర్ల స్ప్రేయర్ పంపుకు ఖచ్చితమైన మోతాదు మరియు వేచి ఉండే కాలం (PHI).'
            : 'Authentic Indian agricultural guidelines strictly aligned with Central Insecticides Board (CIB&RC) and ICAR standards.'}
        </p>
      </div>

      {/* Statutory Safety Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="block font-bold mb-0.5">
            {isTe ? 'భారత ప్రభుత్వ చట్టబద్ధమైన హెచ్చరిక:' : 'Statutory Safety & Dosage Precaution:'}
          </strong>
          {isTe
            ? 'రసాయన మందులను ఎట్టి పరిస్థితుల్లోనూ విచక్షణారహితంగా లేదా సిఫార్సు చేసిన మోతాదుకు మించి వాడవద్దు. ఎల్లప్పుడూ మందు డబ్బాపై ముద్రించిన లేబుల్ సూచనలను మరియు రక్షణ కవచాలను (మాస్క్, చేతి తొడుగులు) తప్పనిసరిగా ధరించండి.'
            : 'Never invent pesticide dosages or mix unauthorized chemical combinations. Dosages below are based on official CIB&RC registered labels. Always wear Personal Protective Equipment (PPE) and strictly follow container label guidelines.'}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isTe ? 'మందు పేరు, సాంకేతిక నామం, లేదా తెగులు పేరుతో వెతకండి (ఉదా: Mancozeb, Rice Blast, Thrips)...' : 'Search by trade name, active ingredient, or disease (e.g. Mancozeb, Tricyclazole, Blast)...'}
            className="w-full pl-11 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-agri-700 text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pesticide Catalog Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-3 mb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <h3 className="text-base font-bold text-stone-900 mt-1">
                    {item.trade_name}
                  </h3>
                  <p className="text-xs text-stone-600 font-mono mt-0.5">
                    {item.active_ingredient}
                  </p>
                </div>
                <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-md shrink-0 border border-emerald-100">
                  {item.regulatory_body}
                </span>
              </div>

              {/* Target Diseases */}
              <div className="mb-3">
                <span className="text-[11px] font-semibold text-stone-500 uppercase block mb-1">
                  {isTe ? 'నియంత్రించే తెగుళ్ళు / పురుగులు:' : 'Target Diseases & Pests:'}
                </span>
                <div className="flex flex-wrap gap-1">
                  {item.target_diseases.map((td, i) => (
                    <span key={i} className="text-xs bg-stone-100 text-stone-800 px-2 py-0.5 rounded-md font-medium">
                      {td}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dilution Rate (15L Knapsack Sprayer) */}
              <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/70 mb-3 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold mb-0.5">
                  <Droplets className="w-4 h-4 text-emerald-700" />
                  <span>{isTe ? '15 లీటర్ల పంపుకు సిఫార్సు చేసిన మోతాదు:' : 'Recommended Dilution (per 15L Sprayer):'}</span>
                </div>
                <p className="text-emerald-950 font-semibold text-sm">
                  {item.recommended_dilution}
                </p>
              </div>

              {/* Waiting Period / PHI */}
              <div className="flex items-center gap-2 text-xs text-stone-600 mb-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>{isTe ? 'వేచి ఉండే కాలం (PHI):' : 'Pre-Harvest Interval (PHI):'} </strong>
                  {item.waiting_period_phi}
                </span>
              </div>

              {/* Safety Precautions */}
              <div className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-lg border border-stone-100 leading-relaxed">
                <strong>{isTe ? 'రక్షణ జాగ్రత్తలు:' : 'Precautions:'} </strong>
                {item.safety_precautions}
              </div>
            </div>

            <div className="text-[11px] text-stone-400 border-t border-stone-100 pt-3">
              Application Note: {item.application_guidance}
            </div>
          </div>
        ))}
      </div>

      {/* Helpful Fertilizer Reference Guide */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">
            {isTe ? 'భారతీయ ఎరువుల పోషక విశ్లేషణ పట్టిక' : 'Indian Major Fertilizer Nutrient Benchmark Guide'}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="bg-white/10 p-4 rounded-xl border border-white/10">
            <h4 className="font-bold text-emerald-300 text-sm mb-1">Urea (యూరియా)</h4>
            <p className="text-white/80">Contains <strong>46% Nitrogen (N)</strong>. White prilled form. Best applied in 2-3 splits. Never broadcast on hot dry ground.</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/10">
            <h4 className="font-bold text-amber-300 text-sm mb-1">DAP (డి-అమ్మోనియం ఫాస్ఫేట్)</h4>
            <p className="text-white/80">Contains <strong>18% N & 46% P2O5</strong>. Ideal basal fertilizer. Place 5 cm deep near seeds during sowing.</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/10">
            <h4 className="font-bold text-blue-300 text-sm mb-1">MOP (మ్యూరేట్ ఆఫ్ పొటాష్)</h4>
            <p className="text-white/80">Contains <strong>60% K2O</strong>. Increases grain weight, disease resistance, and drought tolerance.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
