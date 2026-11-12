import React, { useState } from 'react';
import { 
  FlaskConical, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  RefreshCw, 
  Sparkles, 
  Sliders, 
  Pill, 
  Sprout, 
  ShieldCheck, 
  Layers
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { analyzeSoilVisual, evaluateSoilTest } from '../services/api';
import { generateSampleLeafBlob } from '../utils/sampleImages';

export default function SoilAnalysisPage({ setActivePage, language }) {
  const isTe = language === 'te';

  // State for image visual analysis
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [visualData, setVisualData] = useState(null);
  const [visualLoading, setVisualLoading] = useState(false);

  // State for laboratory soil test inputs
  const [soilInputs, setSoilInputs] = useState({
    nitrogen: 240,       // kg/ha (Deficient)
    phosphorus: 12.5,    // kg/ha (Medium)
    potassium: 180,      // kg/ha (Medium)
    ph: 7.2,             // Neutral
    moisture: 26,        // %
    temperature: 28,     // °C
    sample_name: 'Lot A - Black Soil Field'
  });

  const [evaluation, setEvaluation] = useState(null);
  const [evalLoading, setEvalLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle Soil Image Upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      await runVisualAnalysis(file);
    }
  };

  const handleSampleImage = async () => {
    try {
      const file = await generateSampleLeafBlob('soil_black');
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      await runVisualAnalysis(file);
    } catch (err) {
      setError('Could not generate sample soil image');
    }
  };

  const runVisualAnalysis = async (file) => {
    setVisualLoading(true);
    setError(null);
    try {
      const res = await analyzeSoilVisual(file);
      setVisualData(res);
    } catch (err) {
      setError(err.message || 'Visual soil analysis failed');
    } finally {
      setVisualLoading(false);
    }
  };

  // Handle Lab Test Evaluation
  const handleEvaluateSubmit = async (e) => {
    e.preventDefault();
    setEvalLoading(true);
    setError(null);
    try {
      const res = await evaluateSoilTest(soilInputs);
      setEvaluation(res);
    } catch (err) {
      setError(err.message || 'Failed to evaluate soil test numbers');
    } finally {
      setEvalLoading(false);
    }
  };

  // Quick preset buttons for common Indian soil scenarios
  const applyPreset = (type) => {
    if (type === 'telangana_black') {
      setSoilInputs({
        nitrogen: 210,
        phosphorus: 14,
        potassium: 220,
        ph: 7.6,
        moisture: 28,
        temperature: 29,
        sample_name: 'Telangana Black Cotton Soil'
      });
    } else if (type === 'andhra_red') {
      setSoilInputs({
        nitrogen: 180,
        phosphorus: 8,
        potassium: 110,
        ph: 6.2,
        moisture: 18,
        temperature: 31,
        sample_name: 'Rayalaseema Red Sandy Soil'
      });
    } else if (type === 'punjab_alluvial') {
      setSoilInputs({
        nitrogen: 310,
        phosphorus: 22,
        potassium: 260,
        ph: 7.2,
        moisture: 32,
        temperature: 24,
        sample_name: 'Punjab Fertile Alluvial Soil'
      });
    }
  };

  const npkChartData = evaluation ? [
    { name: isTe ? 'నత్రజని (N)' : 'Nitrogen (N)', current: soilInputs.nitrogen, benchmark: 280, unit: 'kg/ha', fill: '#10b981' },
    { name: isTe ? 'భాస్వరం (P)' : 'Phosphorus (P)', current: soilInputs.phosphorus * 10, benchmark: 100, unit: 'x10 kg/ha', fill: '#f59e0b' },
    { name: isTe ? 'పొటాష్ (K)' : 'Potassium (K)', current: soilInputs.potassium, benchmark: 110, unit: 'kg/ha', fill: '#3b82f6' },
  ] : [];

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-earth-100 text-earth-900 text-xs font-bold uppercase tracking-wider">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>{isTe ? 'భూసార & పోషకాల విశ్లేషణ' : 'Comprehensive Soil Diagnostic Engine'}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          {isTe ? 'భూసార పరీక్ష & ఎరువుల సిఫార్సులు' : 'Soil Analysis & Fertilizer Prescription'}
        </h1>
        <p className="text-stone-600 text-sm">
          {isTe
            ? 'ఫోటో ఆధారిత ప్రాథమిక అంచనాలు మరియు ల్యాబ్ పరీక్షల విలువలను స్పష్టంగా వేరు చేస్తూ, ICAR ప్రమాణాల ప్రకారం యూరియా, DAP, MOP మోతాదులను పొందండి.'
            : 'Combines visual computer vision for soil texture with laboratory NPK & pH data to compute exact ICAR fertilizer prescriptions.'}
        </p>
      </div>

      {/* Distinction Disclaimer Banner (Requirement C: Clearly distinguish actual measured values from image-based estimates) */}
      <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="block font-semibold mb-0.5">
            {isTe ? 'ముఖ్య గమనిక: అంచనా vs ల్యాబ్ కొలతలు' : 'Scientific Transparency Notice:'}
          </strong>
          {isTe
            ? 'ఫోటో ఆధారిత పరిశీలనలు కేవలం పైపైన రంగు మరియు తేమను సూచించే ప్రాథమిక అంచనాలు మాత్రమే. ఖచ్చితమైన ఎరువుల మోతాదు కోసం ఎల్లప్పుడూ సాయిల్ హెల్త్ కార్డ్ (ల్యాబ్) విలువలను నమోదు చేయండి.'
            : 'Visual observations from photographs provide surface color and drainage estimates only. Exact nutrient deficiencies and fertilizer dosage calculations are derived strictly from your entered laboratory soil test values.'}
        </div>
      </div>

      {/* Section 1: Visual Soil Observation (Photo Upload) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-earth-100 text-earth-800 text-xs font-bold flex items-center justify-center">A</span>
            <h3 className="text-lg font-bold text-stone-900">
              {isTe ? 'మట్టి ఫోటో ద్వారా ప్రాథమిక పరిశీలన' : 'Preliminary Visual Soil Observation (Photo)'}
            </h3>
          </div>
          <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
            {isTe ? 'ప్రాథమిక అంచనా' : 'Visual Estimation Only'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Upload Dropzone */}
          <div className="relative border-2 border-dashed border-stone-300 hover:border-earth-500 rounded-2xl p-6 text-center transition-colors bg-stone-50/50">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {previewUrl ? (
              <div className="space-y-2">
                <img src={previewUrl} alt="Soil preview" className="max-h-44 mx-auto rounded-xl object-contain border border-stone-200" />
                <p className="text-xs text-agri-700 font-semibold underline">
                  {isTe ? 'మరొక మట్టి ఫోటో ఎంచుకోండి' : 'Change soil photo'}
                </p>
              </div>
            ) : (
              <div className="space-y-2 py-4">
                <UploadCloud className="w-8 h-8 text-earth-600 mx-auto" />
                <p className="text-xs font-bold text-stone-800">
                  {isTe ? 'పొలంలోని మట్టి ఫోటో తీసి అప్‌లోడ్ చేయండి' : 'Upload photo of topsoil sample'}
                </p>
                <p className="text-[11px] text-stone-500">Examines color palette, clod texture, surface moisture</p>
              </div>
            )}
          </div>

          {/* Visual Output Card */}
          <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-700 uppercase tracking-wider text-[11px]">
                {isTe ? 'దృశ్య పరిశీలన ఫలితాలు' : 'Visual Surface Traits'}
              </span>
              <button
                type="button"
                onClick={handleSampleImage}
                className="text-[11px] text-earth-700 font-bold hover:underline"
              >
                {isTe ? 'శాంపిల్ నల్లరేగడి మట్టితో పరీక్షించండి' : 'Load sample Black Soil'}
              </button>
            </div>

            {visualLoading ? (
              <div className="py-6 text-center space-y-2">
                <RefreshCw className="w-5 h-5 text-earth-600 animate-spin mx-auto" />
                <p className="text-stone-500">{isTe ? 'మట్టి రంగు మరియు ఉపరితలాన్ని లెక్కిస్తోంది...' : 'Extracting texture gradients and RGB spectrum...'}</p>
              </div>
            ) : visualData ? (
              <div className="space-y-2 text-stone-800 animate-in fade-in-50">
                <div className="p-2.5 bg-white rounded-xl border border-stone-200">
                  <span className="text-stone-500 block text-[10px] uppercase font-semibold">{isTe ? 'గుర్తించబడిన నేల రకం' : 'Estimated Soil Category'}</span>
                  <strong className="text-sm text-stone-900">{visualData.visual_soil_type}</strong>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-white rounded-lg border border-stone-200">
                    <span className="text-stone-500 text-[10px] block">{isTe ? 'ఉపరితల తేమ' : 'Surface Moisture'}</span>
                    <span className="font-bold">{visualData.surface_moisture_estimate}</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-stone-200">
                    <span className="text-stone-500 text-[10px] block">{isTe ? 'మట్టి స్వరూపం' : 'Texture Roughness'}</span>
                    <span className="font-bold">{visualData.surface_roughness}</span>
                  </div>
                </div>
                <p className="text-[11px] text-stone-600 italic">
                  Drainage profile: {visualData.drainage_profile}
                </p>
              </div>
            ) : (
              <p className="text-stone-400 py-6 text-center italic">
                {isTe ? 'పై భాగంలో మట్టి ఫోటోను అప్‌లోడ్ చేయండి' : 'Upload soil photo or click sample to test'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Laboratory Measured Test Values (N, P, K, pH, Moisture) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-agri-100 text-agri-800 text-xs font-bold flex items-center justify-center">B</span>
            <h3 className="text-lg font-bold text-stone-900">
              {isTe ? 'ప్రయోగశాల మట్టి పరీక్ష విలువలు (ల్యాబ్ / సాయిల్ కార్డ్)' : 'Laboratory Measured Soil Values (Soil Health Card)'}
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-stone-500">{isTe ? 'ప్రిసెట్‌లు:' : 'Presets:'}</span>
            <button
              onClick={() => applyPreset('telangana_black')}
              className="px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded font-medium text-stone-700"
            >
              Telangana Black
            </button>
            <button
              onClick={() => applyPreset('andhra_red')}
              className="px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded font-medium text-stone-700"
            >
              Andhra Red
            </button>
            <button
              onClick={() => applyPreset('punjab_alluvial')}
              className="px-2 py-1 bg-stone-100 hover:bg-stone-200 rounded font-medium text-stone-700"
            >
              Punjab Alluvial
            </button>
          </div>
        </div>

        <form onSubmit={handleEvaluateSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Nitrogen (N) */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800">
                  {isTe ? 'నత్రజని (Nitrogen - N)' : 'Nitrogen (N)'}
                </label>
                <span className="text-xs font-bold text-emerald-700">{soilInputs.nitrogen} kg/ha</span>
              </div>
              <input
                type="range"
                min="50"
                max="700"
                step="5"
                value={soilInputs.nitrogen}
                onChange={(e) => setSoilInputs({ ...soilInputs, nitrogen: parseFloat(e.target.value) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>Low (&lt;280)</span>
                <span>Medium (280-560)</span>
                <span>High (&gt;560)</span>
              </div>
            </div>

            {/* Phosphorus (P) */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800">
                  {isTe ? 'భాస్వరం (Phosphorus - P)' : 'Phosphorus (P)'}
                </label>
                <span className="text-xs font-bold text-amber-700">{soilInputs.phosphorus} kg/ha</span>
              </div>
              <input
                type="range"
                min="2"
                max="50"
                step="0.5"
                value={soilInputs.phosphorus}
                onChange={(e) => setSoilInputs({ ...soilInputs, phosphorus: parseFloat(e.target.value) })}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>Low (&lt;10)</span>
                <span>Medium (10-25)</span>
                <span>High (&gt;25)</span>
              </div>
            </div>

            {/* Potassium (K) */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800">
                  {isTe ? 'పొటాష్ (Potassium - K)' : 'Potassium (K)'}
                </label>
                <span className="text-xs font-bold text-blue-700">{soilInputs.potassium} kg/ha</span>
              </div>
              <input
                type="range"
                min="50"
                max="450"
                step="5"
                value={soilInputs.potassium}
                onChange={(e) => setSoilInputs({ ...soilInputs, potassium: parseFloat(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>Low (&lt;110)</span>
                <span>Medium (110-280)</span>
                <span>High (&gt;280)</span>
              </div>
            </div>

            {/* Soil pH */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800">
                  {isTe ? 'ఉదజని సూచిక (Soil pH)' : 'Soil pH (Acidity / Alkalinity)'}
                </label>
                <span className="text-xs font-bold text-purple-700">{soilInputs.ph}</span>
              </div>
              <input
                type="range"
                min="4.5"
                max="9.5"
                step="0.1"
                value={soilInputs.ph}
                onChange={(e) => setSoilInputs({ ...soilInputs, ph: parseFloat(e.target.value) })}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>Acidic (&lt;6.5)</span>
                <span>Neutral (6.5-7.5)</span>
                <span>Alkaline (&gt;7.5)</span>
              </div>
            </div>

            {/* Soil Moisture % */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800">
                  {isTe ? 'నేలలో తేమ శాతం (Moisture %)' : 'Soil Moisture %'}
                </label>
                <span className="text-xs font-bold text-teal-700">{soilInputs.moisture}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={soilInputs.moisture}
                onChange={(e) => setSoilInputs({ ...soilInputs, moisture: parseFloat(e.target.value) })}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>Dry (&lt;15%)</span>
                <span>Ideal (20-35%)</span>
                <span>Saturated (&gt;40%)</span>
              </div>
            </div>

            {/* Soil Temperature */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-800">
                  {isTe ? 'నేల ఉష్ణోగ్రత (°C)' : 'Soil Temperature (°C)'}
                </label>
                <span className="text-xs font-bold text-stone-800">{soilInputs.temperature}°C</span>
              </div>
              <input
                type="range"
                min="10"
                max="45"
                step="1"
                value={soilInputs.temperature}
                onChange={(e) => setSoilInputs({ ...soilInputs, temperature: parseFloat(e.target.value) })}
                className="w-full accent-stone-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>Cool (&lt;18°C)</span>
                <span>Optimal (20-30°C)</span>
                <span>Warm (&gt;35°C)</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={evalLoading}
            className="w-full py-4 rounded-xl font-bold text-sm bg-agri-700 hover:bg-agri-800 text-white shadow-md transition-all flex items-center justify-center gap-2"
          >
            {evalLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{isTe ? 'భూసార నివేదికను లెక్కిస్తోంది...' : 'Computing Soil Health & ICAR Fertilizer Dosages...'}</span>
              </>
            ) : (
              <>
                <FlaskConical className="w-5 h-5" />
                <span>{isTe ? 'భూసారాన్ని విశ్లేషించండి (Evaluate Soil Health)' : 'Calculate Soil Health & Fertilizer Prescription'}</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Section 3: Evaluation Results & Fertilizer Prescriptions */}
      {evaluation && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-md space-y-8 animate-in fade-in-50">
          {/* Header & Overall Score */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                {isTe ? 'భూసార నివేదిక ఫలితం' : 'Soil Health Evaluation'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                {evaluation.soil_rating}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Evaluated against official Indian ICAR nutrient critical levels
              </p>
            </div>

            <div className="text-right bg-agri-50 px-6 py-4 rounded-2xl border border-agri-200">
              <span className="text-[11px] font-semibold text-agri-800 uppercase tracking-wider block">
                {isTe ? 'భూసార స్కోర్' : 'Soil Health Index'}
              </span>
              <span className="text-4xl font-black text-agri-800">
                {evaluation.soil_health_score} <span className="text-base text-agri-600 font-normal">/ 100</span>
              </span>
            </div>
          </div>

          {/* Measured Lab Values Table */}
          <div>
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
              {isTe ? 'పోషకాల స్థాయిల వర్గీకరణ' : 'Nutrient Adequacy Classification'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 block text-[10px] uppercase font-semibold">Nitrogen (N)</span>
                <span className="text-base font-bold text-stone-900">{evaluation.measured_lab_values.nitrogen.value} kg/ha</span>
                <span className="block text-[11px] font-semibold text-emerald-700 mt-0.5">
                  {evaluation.measured_lab_values.nitrogen.status}
                </span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 block text-[10px] uppercase font-semibold">Phosphorus (P)</span>
                <span className="text-base font-bold text-stone-900">{evaluation.measured_lab_values.phosphorus.value} kg/ha</span>
                <span className="block text-[11px] font-semibold text-amber-700 mt-0.5">
                  {evaluation.measured_lab_values.phosphorus.status}
                </span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 block text-[10px] uppercase font-semibold">Potassium (K)</span>
                <span className="text-base font-bold text-stone-900">{evaluation.measured_lab_values.potassium.value} kg/ha</span>
                <span className="block text-[11px] font-semibold text-blue-700 mt-0.5">
                  {evaluation.measured_lab_values.potassium.status}
                </span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-500 block text-[10px] uppercase font-semibold">pH Level</span>
                <span className="text-base font-bold text-stone-900">{evaluation.measured_lab_values.ph.value}</span>
                <span className="block text-[11px] font-semibold text-purple-700 mt-0.5">
                  {evaluation.measured_lab_values.ph.status}
                </span>
              </div>
            </div>
          </div>

          {/* pH Amelioration Advice */}
          {evaluation.ph_amelioration_advice && (
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 text-xs flex items-start gap-2.5">
              <FlaskConical className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold mb-0.5">
                  {isTe ? 'నేల ఉదజని (pH) సవరణ సూచన:' : 'Soil Reaction (pH) Correction Advice:'}
                </strong>
                <span>{evaluation.ph_amelioration_advice}</span>
              </div>
            </div>
          )}

          {/* Fertilizer Prescriptions (Requirement C & E: Recommend fertilizers based on soil nutrient deficiencies) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <Pill className="w-4 h-4 text-agri-700" />
              <span>{isTe ? 'సిఫార్సు చేయబడిన ఎరువుల మోతాదు (ఎకరానికి):' : 'Official ICAR Fertilizer Dosage Prescriptions (Per Acre):'}</span>
            </h4>

            <div className="space-y-3">
              {evaluation.fertilizer_prescriptions.map((fert, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-stone-900 text-sm">{fert.fertilizer}</h5>
                    <p className="text-xs text-stone-600 mt-0.5">
                      <strong>{isTe ? 'వినియోగ విధానం:' : 'Application:'}</strong> {fert.application_method}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      <em>{fert.purpose}</em>
                    </p>
                  </div>
                  <div className="sm:text-right shrink-0">
                    <span className="text-xs bg-agri-100 text-agri-900 font-bold px-3 py-1.5 rounded-xl block">
                      {fert.recommended_dose}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suitable Crops for this exact soil profile */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>{isTe ? 'ఈ నేల స్థితికి అత్యంత అనుకూలమైన పంటలు:' : 'Suitable Crops for this Specific Soil Condition:'}</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {evaluation.suitable_crops.map((crop, idx) => (
                <span key={idx} className="bg-emerald-50 text-emerald-800 font-semibold px-3 py-1.5 rounded-xl text-xs border border-emerald-200">
                  🌱 {crop}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
