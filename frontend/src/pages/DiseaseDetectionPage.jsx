import React, { useState } from 'react';
import { 
  Activity, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  ShieldAlert, 
  Pill, 
  Leaf, 
  Sparkles, 
  RefreshCw, 
  Info,
  Phone,
  ArrowRight
} from 'lucide-react';
import { detectDisease } from '../services/api';
import { generateSampleLeafBlob } from '../utils/sampleImages';

export default function DiseaseDetectionPage({ setActivePage, language }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cropHint, setCropHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const isTe = language === 'te';

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleSampleSelect = async (sampleType, hint = '') => {
    setLoading(true);
    setError(null);
    setCropHint(hint);
    try {
      const file = await generateSampleLeafBlob(sampleType);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      const res = await detectDisease(file, hint);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Disease detection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    try {
      const res = await detectDisease(selectedFile, cropHint);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Failed to detect plant disease');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5" />
          <span>{isTe ? 'కంప్యూటర్ విజన్ ఆకు తెగుళ్ళ నిర్ధారణ' : 'AI Plant Disease Detection'}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          {isTe ? 'పంట ఆకు ఫోటో తీసి తెగుళ్ళను నిర్ధారించండి' : 'Upload Crop Leaf for Disease Diagnosis'}
        </h1>
        <p className="text-stone-600 text-sm">
          {isTe
            ? 'టమాటా, వరి, ప్రత్తి, బంగాళాదుంప, మిరప ఆకులపై మచ్చలు, కర్ల్ లేదా తెగుళ్ళ లక్షణాలను గుర్తించి అధికారిక CIB&RC మరియు సేంద్రీయ పరిష్కారాలను పొందండి.'
            : 'Pretrained PlantVillage deep vision architecture screens foliar lesions, chlorosis, and rust with ICAR-approved organic and chemical prescriptions.'}
        </p>
      </div>

      {/* Upload & Hint Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Optional Crop Hint */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              {isTe ? 'పంట రకం (ఐచ్ఛికం - ఖచ్చితత్వం మెరుగవుతుంది):' : 'Select Crop (Optional - Enhances Diagnostic Focus):'}
            </label>
            <select
              value={cropHint}
              onChange={(e) => setCropHint(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-agri-500"
            >
              <option value="">{isTe ? 'ఆటో-డిటెక్ట్ (అన్ని పంటలు)' : 'Auto-Detect (Any Indian Crop)'}</option>
              <option value="tomato">Tomato (టమాటా)</option>
              <option value="rice">Paddy / Rice (వరి)</option>
              <option value="cotton">Cotton (ప్రత్తి)</option>
              <option value="potato">Potato (బంగాళాదుంప)</option>
              <option value="chilli">Chilli / Pepper (మిరప)</option>
              <option value="corn">Maize / Corn (మొక్కజొన్న)</option>
            </select>
          </div>

          {/* Drag & drop upload area */}
          <div className="relative border-2 border-dashed border-stone-300 hover:border-amber-500 rounded-2xl p-6 text-center transition-colors bg-stone-50/50">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {previewUrl ? (
              <div className="space-y-3">
                <img
                  src={previewUrl}
                  alt="Leaf preview"
                  className="max-h-64 mx-auto rounded-xl shadow-xs object-contain border border-stone-200"
                />
                <p className="text-xs text-stone-500">
                  {selectedFile ? `${selectedFile.name} (${Math.round(selectedFile.size / 1024)} KB)` : ''}
                </p>
                <p className="text-xs text-agri-700 font-semibold underline">
                  {isTe ? 'మరొక ఆకు ఫోటో ఎంచుకోండి' : 'Click to select a different leaf photo'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 py-6">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-800">
                    {isTe ? 'ఇక్కడ ఆకు ఫోటోను డ్రాప్ చేయండి లేదా ఎంచుకోండి' : 'Drag & drop a close-up photo of single leaf'}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">Capture leaf in good daylight with spots clearly visible</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Demo Test Samples */}
          <div>
            <p className="text-xs font-semibold text-stone-600 mb-2">
              {isTe ? 'లేదా పరీక్ష కోసం శాంపిల్ ఆకులను క్లిక్ చేయండి:' : 'Or test with a sample diseased / healthy leaf:'}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleSampleSelect('tomato_blight', 'tomato')}
                className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-stone-700 text-xs font-medium transition"
              >
                🍂 {isTe ? 'టమాటా ముందస్తు తెగులు (Early Blight)' : 'Tomato Early Blight'}
              </button>
              <button
                type="button"
                onClick={() => handleSampleSelect('rice_blast', 'rice')}
                className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-stone-700 text-xs font-medium transition"
              >
                🌾 {isTe ? 'వరి అగ్గితెగులు (Rice Blast)' : 'Rice Blast Lesion'}
              </button>
              <button
                type="button"
                onClick={() => handleSampleSelect('healthy_leaf', 'tomato')}
                className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 text-stone-700 text-xs font-medium transition"
              >
                🌿 {isTe ? 'ఆరోగ్యకరమైన ఆకు (Healthy Leaf)' : 'Healthy Green Leaf'}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={!selectedFile || loading}
            className={`w-full py-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
              !selectedFile || loading
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-amber-700 hover:bg-amber-800 text-white hover:shadow-lg'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{isTe ? 'తెగుళ్ళ విశ్లేషణ జరుగుతోంది...' : 'Analyzing Foliar Pathogen Patterns...'}</span>
              </>
            ) : (
              <>
                <Activity className="w-5 h-5" />
                <span>{isTe ? 'తెగులును నిర్ధారించండి (Detect Disease)' : 'Diagnose Leaf Disease'}</span>
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Results Card */}
      {result && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-6 animate-in fade-in-50 duration-300">
          {/* Header Row: Healthy vs Diseased Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {result.is_healthy ? (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isTe ? 'ఆరోగ్యకరమైన పంట (Healthy Crop)' : 'Healthy Vigorous Crop'}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-rose-800 bg-rose-100 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {isTe ? 'తెగులు గుర్తించబడింది (Infected)' : 'Foliar Disease Detected'}
                  </span>
                )}
                <span className="text-xs text-stone-500 font-medium">• {result.crop}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
                {result.disease_name}
              </h2>
              <p className="text-xs font-serif italic text-stone-500 mt-0.5">
                Pathogen: {result.pathogen}
              </p>
            </div>

            <div className="text-right bg-stone-50 px-5 py-3 rounded-2xl border border-stone-200">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                {isTe ? 'ఖచ్చితత్వ శాతం' : 'Confidence'}
              </span>
              <span className={`text-3xl font-black ${result.confidence >= 70 ? 'text-emerald-700' : 'text-amber-600'}`}>
                {result.confidence}%
              </span>
            </div>
          </div>

          {/* Low Confidence Warning (Requirement B: If confidence is low, request another image or recommend expert verification) */}
          {result.low_confidence_warning && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-1">
                  {isTe ? 'తక్కువ ఖచ్చితత్వ హెచ్చరిక (Low Confidence Scan):' : 'Low Confidence Scan Warning:'}
                </strong>
                <p className="leading-relaxed">
                  {result.warning_message ||
                    (isTe
                      ? 'ఈ ఫోటోలో ఆకు స్పష్టంగా లేదా వెలుతురు సరిగా లేదు. దయచేసి పగటి వెలుతురులో ఒకే ఆకు దగ్గరగా ఫోటో తీసి మళ్ళీ అప్‌లోడ్ చేయండి లేదా మీ సమీప కృషి విజ్ఞాన కేంద్రం (KVK) అధికారిని సంప్రదించండి.'
                      : 'The image may be blurry, dimly lit, or captured from too far. For verified results, retake a close-up photo in bright daylight, or consult a local Krishi Vigyan Kendra (KVK) agricultural officer.')}
                </p>
              </div>
            </div>
          )}

          {/* Visual Color-Space Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center">
              <span className="text-[10px] text-stone-500 uppercase font-semibold block">{isTe ? 'పచ్చదనం (క్లోరోఫిల్)' : 'Green Chlorophyll'}</span>
              <span className="text-base font-bold text-emerald-700">{result.visual_metrics.green_tissue_percentage}%</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center">
              <span className="text-[10px] text-stone-500 uppercase font-semibold block">{isTe ? 'నెక్రోటిక్ నల్ల మచ్చలు' : 'Necrotic Lesions'}</span>
              <span className="text-base font-bold text-amber-700">{result.visual_metrics.necrotic_lesion_percentage}%</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center">
              <span className="text-[10px] text-stone-500 uppercase font-semibold block">{isTe ? 'పసుపుబారిన శాతం' : 'Yellowing Chlorosis'}</span>
              <span className="text-base font-bold text-yellow-600">{result.visual_metrics.chlorosis_yellowing_percentage}%</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-center">
              <span className="text-[10px] text-stone-500 uppercase font-semibold block">{isTe ? 'తెగులు తీవ్రత' : 'Estimated Severity'}</span>
              <span className="text-base font-bold text-rose-700">{result.visual_metrics.estimated_severity}%</span>
            </div>
          </div>

          {/* Symptoms & Causes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-agri-600" />
                <span>{isTe ? 'ప్రధాన లక్షణాలు' : 'Key Symptoms Observed'}</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-stone-700">
                {result.symptoms.map((sym, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-agri-600 font-bold">•</span>
                    <span>{sym}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                <span>{isTe ? 'తెగులు వ్యాప్తికి కారణాలు' : 'Environmental Causes & Triggers'}</span>
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed">
                {result.causes}
              </p>
            </div>
          </div>

          {/* Preventive Measures: Organic vs Chemical */}
          <div className="space-y-4 pt-2">
            <h3 className="text-base font-bold text-stone-900">
              🛡️ {isTe ? 'నివారణ మరియు చికిత్స మార్గదర్శకాలు' : 'Integrated Disease Management & CIBRC Treatment'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Organic & Biological Solutions */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-center gap-2 mb-3">
                  <Leaf className="w-4 h-4 text-emerald-700" />
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    {isTe ? 'సేంద్రీయ & జీవ నియంత్రణ చర్యలు' : 'Organic & Bio-Control Measures'}
                  </h4>
                </div>
                <ul className="space-y-2 text-xs text-emerald-950">
                  {result.preventive_measures.organic_biological.map((org, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{org}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chemical CIBRC Approved Treatments */}
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200">
                <div className="flex items-center gap-2 mb-3">
                  <Pill className="w-4 h-4 text-amber-700" />
                  <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                    {isTe ? 'CIB&RC అనుమతించిన రసాయన మందులు' : 'Registered CIB&RC Chemical Formulations'}
                  </h4>
                </div>
                <ul className="space-y-2 text-xs text-amber-950">
                  {result.preventive_measures.chemical_treatments.map((chem, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-700 font-bold">›</span>
                      <span>{chem}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Safety Disclaimer Banner */}
            <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-600 flex items-start gap-2">
              <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
              <span>
                <strong>{isTe ? 'ముఖ్య భద్రతా సూచన:' : 'Statutory Safety Advisory:'} </strong>
                {result.preventive_measures.safety_precautions ||
                  'Always follow approved product container labels. Use personal protective equipment (mask, gloves) when handling sprayers.'}
              </span>
            </div>
          </div>

          {/* Jump to Recommendations Catalog */}
          <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-stone-600">
              {isTe ? 'ఈ తెగులుకు సంబంధించిన పూర్తి పురుగు మందుల సూచికను చూడండి:' : 'Explore detailed dilution and waiting period tables:'}
            </span>
            <button
              onClick={() => setActivePage('recommendations')}
              className="px-4 py-2 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <Pill className="w-3.5 h-3.5" />
              <span>{isTe ? 'పురుగు మందుల వివరాలు' : 'Open Pesticide Catalog'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
