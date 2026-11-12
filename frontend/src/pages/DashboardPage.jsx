import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Activity, 
  FlaskConical, 
  Pill, 
  MapPin, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  ArrowUpRight, 
  FileText,
  Calendar,
  Layers
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import WeatherWidget from '../components/WeatherWidget';
import { fetchDashboardSummary } from '../services/api';

export default function DashboardPage({ setActivePage, language }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isTe = language === 'te';

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const summary = await fetchDashboardSummary();
      setData(summary);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <RefreshCw className="w-8 h-8 text-agri-600 animate-spin" />
        <p className="text-stone-600 font-medium text-sm">
          {isTe ? 'రైతు డ్యాష్‌బోర్డ్ లోడ్ అవుతోంది...' : 'Gathering farm insights and live agronomy data...'}
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-rose-50 border border-rose-200 text-rose-800 p-6 rounded-2xl max-w-xl mx-auto my-12 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
        <h3 className="font-bold text-base">{isTe ? 'డేటా లోడ్ చేయడం విఫలమైంది' : 'Unable to connect to farm data server'}</h3>
        <p className="text-xs">{error}</p>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-rose-600 text-white rounded-lg text-xs font-semibold hover:bg-rose-700 transition"
        >
          {isTe ? 'మళ్ళీ ప్రయత్నించండి' : 'Retry Connection'}
        </button>
      </div>
    );
  }

  const { farm_profile, weather, recent_scans = [], latest_soil_record, stats } = data;

  // Chart data for Soil NPK vs Benchmark
  const npkChartData = latest_soil_record ? [
    { name: isTe ? 'నత్రజని (N)' : 'Nitrogen (N)', current: latest_soil_record.nitrogen, optimal: 350, unit: 'kg/ha', fill: '#10b981' },
    { name: isTe ? 'భాస్వరం (P)' : 'Phosphorus (P)', current: latest_soil_record.phosphorus * 10, optimal: 180, unit: 'x10 kg/ha', fill: '#f59e0b' },
    { name: isTe ? 'పొటాష్ (K)' : 'Potassium (K)', current: latest_soil_record.potassium, optimal: 200, unit: 'kg/ha', fill: '#3b82f6' },
  ] : [];

  return (
    <div className="space-y-8">
      {/* Top Banner / Farmer Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-agri-600 to-agri-800 text-white flex items-center justify-center font-bold text-xl shadow-md">
            <Sprout className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-stone-900">
                {farm_profile.farmer_name || 'Farmer Ramesh Patel'}
              </h1>
              <span className="text-[10px] bg-agri-100 text-agri-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                {isTe ? 'ధృవీకరించబడిన రైతు' : 'Verified Farmer'}
              </span>
            </div>
            <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5 font-medium">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>{farm_profile.village}, {farm_profile.district}, {farm_profile.state}</span>
              <span>•</span>
              <span className="font-semibold text-agri-800">{stats.farm_size_acres} {isTe ? 'ఎకరాలు' : 'Acres'}</span>
            </p>
          </div>
        </div>

        {/* Quick Diagnostic Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActivePage('disease-detect')}
            className="px-4 py-2.5 rounded-xl bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{isTe ? 'తెగులు స్కాన్' : 'Scan Disease'}</span>
          </button>
          <button
            onClick={() => setActivePage('soil-analysis')}
            className="px-4 py-2.5 rounded-xl bg-earth-600 hover:bg-earth-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>{isTe ? 'భూసార పరీక్ష' : 'Soil Test'}</span>
          </button>
          <button
            onClick={loadData}
            title="Refresh dashboard"
            className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Selected / Primary Crop */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{isTe ? 'ప్రధాన పంట' : 'Primary Crop'}</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-stone-900">{stats.primary_crop}</h3>
            <p className="text-[11px] text-stone-500 mt-0.5">{isTe ? 'ఖరీఫ్ సీజన్ సాగు' : 'Kharif Cultivation'}</p>
          </div>
        </div>

        {/* Soil Health Score */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{isTe ? 'భూసార ఇండెక్స్' : 'Soil Health Index'}</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-stone-900">{stats.soil_health_score}</span>
              <span className="text-xs font-bold text-stone-400">/ 100</span>
              <span className="text-xs font-bold text-emerald-600 ml-auto bg-emerald-50 px-2 py-0.5 rounded">
                {stats.soil_health_score >= 75 ? (isTe ? 'మంచిది' : 'Good') : (isTe ? 'మధ్యస్థం' : 'Medium')}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">{latest_soil_record ? latest_soil_record.soil_type : 'Black Cotton Soil'}</p>
          </div>
        </div>

        {/* Active Spray Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{isTe ? 'వాతావరణ హెచ్చరిక' : 'Spraying Window'}</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isTe ? 'అనుకూల సమయం' : 'Safe to Spray'}</span>
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {weather?.current ? `${weather.current.condition}, ${weather.current.wind_speed} km/h wind` : 'Low rain probability'}
            </p>
          </div>
        </div>

        {/* Total Scans Conducted */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">{isTe ? 'మొత్తం స్కాన్‌లు' : 'Total Field Scans'}</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-stone-900">{stats.total_scans}</span>
              <span className="text-xs text-stone-500">{isTe ? 'రికార్డులు' : 'Completed'}</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">{isTe ? 'డేటాబేస్‌లో భద్రపరచబడింది' : 'Saved in Farm Log'}</p>
          </div>
        </div>
      </div>

      {/* Middle Row: Live Agro-Weather & Soil Nutrient Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Weather Widget */}
        <div className="lg:col-span-7">
          <WeatherWidget weatherData={weather} language={language} />
        </div>

        {/* Soil Health Summary Card & Mini Chart */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold text-earth-600 bg-earth-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {isTe ? 'మట్టి పోషకాల నివేదిక' : 'Soil Nutrient Balance'}
                </span>
                <h3 className="text-base font-bold text-stone-900 mt-1">
                  {latest_soil_record ? latest_soil_record.sample_name : 'Current Soil Test'}
                </h3>
              </div>
              <button
                onClick={() => setActivePage('soil-analysis')}
                className="text-xs font-semibold text-agri-700 hover:text-agri-900 flex items-center gap-0.5"
              >
                <span>{isTe ? 'పూర్తి వివరాలు' : 'Full Analysis'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {latest_soil_record ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    <span className="text-[10px] text-stone-500 block">{isTe ? 'నత్రజని (N)' : 'Nitrogen'}</span>
                    <span className="text-sm font-bold text-stone-900">{latest_soil_record.nitrogen}</span>
                    <span className="text-[9px] text-stone-400 block">kg/ha</span>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    <span className="text-[10px] text-stone-500 block">{isTe ? 'భాస్వరం (P)' : 'Phosphorus'}</span>
                    <span className="text-sm font-bold text-stone-900">{latest_soil_record.phosphorus}</span>
                    <span className="text-[9px] text-stone-400 block">kg/ha</span>
                  </div>
                  <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                    <span className="text-[10px] text-stone-500 block">{isTe ? 'పొటాష్ (K)' : 'Potassium'}</span>
                    <span className="text-sm font-bold text-stone-900">{latest_soil_record.potassium}</span>
                    <span className="text-[9px] text-stone-400 block">kg/ha</span>
                  </div>
                </div>

                {/* pH & Moisture Pill */}
                <div className="flex items-center justify-between text-xs p-3 bg-stone-50 rounded-xl border border-stone-100">
                  <div>
                    <span className="text-stone-500">{isTe ? 'నేల ఉదజని సూచిక (pH):' : 'Soil pH:'} </span>
                    <strong className="text-stone-900 font-bold">{latest_soil_record.ph}</strong>
                    <span className="text-[11px] text-emerald-600 font-medium ml-1">({isTe ? 'తటస్థ నేల' : 'Neutral'})</span>
                  </div>
                  <div>
                    <span className="text-stone-500">{isTe ? 'తేమ:' : 'Moisture:'} </span>
                    <strong className="text-stone-900 font-bold">{latest_soil_record.moisture}%</strong>
                  </div>
                </div>

                {/* Recharts Bar Chart */}
                <div className="h-36 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={npkChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="current" radius={[4, 4, 0, 0]}>
                        {npkChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <p className="text-stone-400 text-xs py-8 text-center">
                {isTe ? 'భూసార నివేదిక ఏదీ నమోదు కాలేదు.' : 'No soil test on record yet.'}
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500">
            {isTe 
              ? 'సిఫార్సు: 1 ఎకరానికి 52 కిలోల యూరియాను 3 దఫాలుగా వేయాలి.' 
              : 'Active Advice: Apply 52 kg/acre Urea in 3 split doses for optimal canopy.'}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Scans History & Farming Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Crop & Disease Scans */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                {isTe ? 'ఇటీవలి పంట & తెగుళ్ళ నిర్ధారణలు' : 'Recent Plant Health & Disease Scans'}
              </h3>
              <p className="text-xs text-stone-500">
                {isTe ? 'గత విశ్లేషణ ఫలితాలు మరియు సిఫార్సులు' : 'Latest AI diagnostic history with confidence ratings'}
              </p>
            </div>
            <button
              onClick={() => setActivePage('my-farm')}
              className="text-xs font-semibold text-agri-700 hover:text-agri-800 flex items-center gap-1"
            >
              <span>{isTe ? 'మొత్తం చూడండి' : 'View Full Log'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recent_scans.length > 0 ? (
              recent_scans.map((scan) => {
                const isCropId = scan.analysis_type === 'crop_id';
                return (
                  <div
                    key={scan.id}
                    className="p-4 rounded-xl border border-stone-100 hover:border-agri-200 bg-stone-50/50 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl ${isCropId ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {isCropId ? <Sprout className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-stone-900">{scan.title}</h4>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            {scan.confidence}% {isTe ? 'ఖచ్చితత్వం' : 'Confidence'}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {scan.disease_name ? (
                            <span>{scan.disease_name} • {scan.crop_name}</span>
                          ) : (
                            <span>{scan.crop_name}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="text-right sm:border-l sm:border-stone-200 sm:pl-4">
                      <span className="text-[11px] text-stone-400 block flex items-center gap-1 justify-end">
                        <Calendar className="w-3 h-3" />
                        {new Date(scan.created_at).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => setActivePage(isCropId ? 'crop-id' : 'disease-detect')}
                        className="text-xs font-semibold text-agri-700 hover:underline mt-1"
                      >
                        {isTe ? 'మళ్ళీ స్కాన్ చేయండి' : 'Scan Again'}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-stone-400 text-center py-8">
                {isTe ? 'స్కాన్‌ల రికార్డు ఏదీ లేదు.' : 'No scans performed yet.'}
              </p>
            )}
          </div>
        </div>

        {/* Practical Farming Alerts & Seasonal Tips */}
        <div className="lg:col-span-4 bg-gradient-to-br from-agri-900 to-stone-900 text-white p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm tracking-wide text-emerald-200 uppercase">
                {isTe ? 'ఈ వారం రైతు సూచనలు' : 'Kharif Seasonal Advisories'}
              </h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-emerald-100/90">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <strong className="block text-white font-semibold mb-1">
                  {isTe ? '1. తామర పురుగుల (Thrips) నిఘా' : '1. Blue Sticky Traps for Thrips'}
                </strong>
                <span>
                  {isTe
                    ? 'మిరప మరియు ప్రత్తి పంటల్లో ఎకరానికి 15-20 నీలి రంగు జిగురు అట్టలను ఏర్పాటు చేయండి.'
                    : 'Install 15-20 blue sticky traps/acre in chilli & cotton fields for early thrips monitoring.'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <strong className="block text-white font-semibold mb-1">
                  {isTe ? '2. యూరియా పైపాటు యాజమాన్యం' : '2. Split Urea Application'}
                </strong>
                <span>
                  {isTe
                    ? 'మొత్తం యూరియాను ఒకేసారి వేయకుండా 3 దఫాలుగా వేస్తే వేరు వ్యవస్థ బలంగా ఎదుగుతుంది.'
                    : 'Avoid single heavy urea dosing. Apply in 3 splits to prevent vegetative lodging and blast susceptibility.'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <strong className="block text-white font-semibold mb-1">
                  {isTe ? '3. సేంద్రీయ వేపనూనె పిచికారీ' : '3. Prophylactic Neem Spray'}
                </strong>
                <span>
                  {isTe
                    ? '10,000 PPM వేపనూనెను లీటరు నీటికి 2 మి.లీ చొప్పున సాయంత్రం వేళల్లో పిచికారీ చేయండి.'
                    : 'Spray 10,000 PPM Neem Oil (2ml/L) in calm evening hours to suppress sucking pest vectors.'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-emerald-300">{isTe ? 'సందేహాలు ఉన్నాయా?' : 'Need personalized advice?'}</span>
            <button
              onClick={() => setActivePage('assistant')}
              className="text-xs font-bold bg-white text-agri-950 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition"
            >
              {isTe ? 'ఏఐ సహాయకుడిని అడగండి' : 'Chat with AI'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
