import React, { useState } from 'react';
import { 
  ScanLine, 
  UploadCloud, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  Sun, 
  Droplets, 
  RefreshCw, 
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { identifyCrop } from '../services/api';
import { generateSampleLeafBlob } from '../utils/sampleImages';

export default function CropDetectionPage({ setActivePage, language }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
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

  const handleSampleSelect = async (sampleType) => {
    setLoading(true);
    setError(null);
    try {
      const file = await generateSampleLeafBlob(sampleType);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      const res = await identifyCrop(file);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Crop identification failed');
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
      const res = await identifyCrop(selectedFile);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Failed to identify crop. Please check image format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <ScanLine className="w-3.5 h-3.5" />
          <span>{isTe ? 'కంప్యూటర్ విజన్ పంట గుర్తింపు' : 'AI Crop Identification'}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
          {isTe ? 'పంట లేదా మొక్క ఫోటోను గుర్తించండి' : 'Upload Crop or Plant Photo'}
        </h1>
        <p className="text-stone-600 text-sm">
          {isTe
            ? 'మీ పొలంలో ఉన్న పంట లేదా మొక్క ఫోటో తీసి అప్‌లోడ్ చేయండి. ఏఐ మోడల్ పంట రకం, వాతావరణ అవసరాలు, మరియు ఉత్తమ సాగు పద్ధతులను వివరిస్తుంది.'
            : 'Powered by MobileNetV2 deep learning classifier to identify crop species, ideal temperature, rainfall, and ICAR cultivation practices.'}
        </p>
      </div>

      {/* Main Upload Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dropzone */}
          <div className="relative border-2 border-dashed border-stone-300 hover:border-agri-500 rounded-2xl p-6 text-center transition-colors bg-stone-50/50">
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
                  alt="Crop preview"
                  className="max-h-64 mx-auto rounded-xl shadow-xs object-contain border border-stone-200"
                />
                <p className="text-xs text-stone-500">
                  {selectedFile ? `${selectedFile.name} (${Math.round(selectedFile.size / 1024)} KB)` : ''}
                </p>
                <p className="text-xs text-agri-700 font-semibold underline">
                  {isTe ? 'మరొక ఫోటో ఎంచుకోండి' : 'Click to choose another photo'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 py-6">
                <div className="w-16 h-16 rounded-full bg-agri-100 text-agri-700 flex items-center justify-center mx-auto">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-800">
                    {isTe ? 'ఇక్కడ ఫోటోను డ్రాప్ చేయండి లేదా క్లిక్ చేసి ఎంచుకోండి' : 'Drag & drop crop image here, or click to browse'}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">Supports JPEG, PNG, WebP (Max 10MB)</p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Demo Sample Selector */}
          <div>
            <p className="text-xs font-semibold text-stone-600 mb-2">
              {isTe ? 'లేదా పరీక్ష కోసం శాంపిల్ చిత్రాన్ని ఎంచుకోండి:' : 'Or test with a sample field image:'}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleSampleSelect('healthy_leaf')}
                className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 text-stone-700 text-xs font-medium transition"
              >
                🌱 {isTe ? 'పచ్చని ఆకు (Healthy Crop)' : 'Healthy Green Leaf'}
              </button>
              <button
                type="button"
                onClick={() => handleSampleSelect('tomato_blight')}
                className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 text-stone-700 text-xs font-medium transition"
              >
                🍅 {isTe ? 'టమాటా మొక్క (Tomato Leaf)' : 'Tomato Crop Leaf'}
              </button>
              <button
                type="button"
                onClick={() => handleSampleSelect('rice_blast')}
                className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 text-stone-700 text-xs font-medium transition"
              >
                🌾 {isTe ? 'వరి పంట ఆకు (Paddy Rice)' : 'Paddy Rice Leaf'}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!selectedFile || loading}
            className={`w-full py-4 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
              !selectedFile || loading
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-agri-700 hover:bg-agri-800 text-white hover:shadow-lg'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>{isTe ? 'ఏఐ మోడల్ విశ్లేషిస్తోంది...' : 'Running MobileNetV2 Deep Inference...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>{isTe ? 'పంటను గుర్తించండి (Identify Crop)' : 'Run AI Crop Identification'}</span>
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

      {/* AI Inference Results Section */}
      {result && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-agri-300 shadow-md space-y-6 animate-in fade-in-50 duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  {isTe ? 'గుర్తించబడిన పంట' : 'Identified Crop'}
                </span>
                <span className="text-xs text-stone-500">({result.model_info})</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
                {result.crop_name}
              </h2>
              <p className="text-xs font-serif italic text-stone-500 mt-0.5">
                Scientific name: {result.scientific_name} • {result.category}
              </p>
            </div>

            <div className="text-right bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100">
              <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider block">
                {isTe ? 'ఏఐ ఖచ్చితత్వ శాతం' : 'Confidence Score'}
              </span>
              <span className="text-3xl font-black text-emerald-700">
                {result.confidence}%
              </span>
            </div>
          </div>

          {/* Growing Conditions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="flex items-center gap-2 text-stone-700 mb-1">
                <Sun className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider">{isTe ? 'అనుకూల ఉష్ణోగ్రత' : 'Ideal Temperature'}</h4>
              </div>
              <p className="text-sm font-semibold text-stone-900">{result.optimal_conditions.temperature}</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="flex items-center gap-2 text-stone-700 mb-1">
                <Droplets className="w-4 h-4 text-blue-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider">{isTe ? 'వర్షపాత అవసరం' : 'Water & Rainfall'}</h4>
              </div>
              <p className="text-sm font-semibold text-stone-900">{result.optimal_conditions.rainfall}</p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
              <div className="flex items-center gap-2 text-stone-700 mb-1">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider">{isTe ? 'పంట కాలం' : 'Season & Cycle'}</h4>
              </div>
              <p className="text-sm font-semibold text-stone-900">{result.season} ({result.growth_period})</p>
            </div>
          </div>

          {/* Soil Requirements */}
          <div className="p-4 rounded-2xl bg-earth-50 border border-earth-200/60 text-xs">
            <strong className="text-earth-900 font-bold block mb-1">
              🌱 {isTe ? 'నేల రకం మరియు అవసరాలు:' : 'Soil Requirement:'}
            </strong>
            <p className="text-earth-800 leading-relaxed">{result.optimal_conditions.soil_type}</p>
          </div>

          {/* Best Practices */}
          <div>
            <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-2">
              🌾 {isTe ? 'సిఫార్సు చేయబడిన ఉత్తమ సాగు పద్ధతులు (ICAR)' : 'Key Cultivation Practices (ICAR Recommended)'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-700">
              {result.best_practices.map((practice, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{practice}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Major Producing States */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-stone-500 block mb-1">
              📍 {isTe ? 'భారతదేశంలో ప్రధానంగా పండించే రాష్ట్రాలు:' : 'Major Indian Producing States:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {result.major_states.map((st, idx) => (
                <span key={idx} className="bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                  {st}
                </span>
              ))}
            </div>
          </div>

          {/* Action to check disease */}
          <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-stone-600">
              {isTe ? 'ఈ పంట ఆకులపై మచ్చలు లేదా తెగుళ్ళు కనిపిస్తున్నాయా?' : 'Noticing spots or lesions on this crop?'}
            </span>
            <button
              onClick={() => setActivePage('disease-detect')}
              className="px-4 py-2 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold transition flex items-center gap-1.5"
            >
              <span>{isTe ? 'ఆకు తెగులు స్కాన్ చేయండి' : 'Check for Leaf Diseases'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
