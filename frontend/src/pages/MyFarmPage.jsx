import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  Save, 
  Calendar, 
  FileText, 
  Activity, 
  Sprout, 
  CheckCircle2, 
  Search, 
  RefreshCw,
  Printer,
  Compass
} from 'lucide-react';
import LeafletMap from '../components/LeafletMap';
import { 
  fetchFarmProfile, 
  updateFarmProfile, 
  fetchAnalysisHistory, 
  resolveLocation,
  fetchWeather 
} from '../services/api';

export default function MyFarmPage({ language }) {
  const isTe = language === 'te';
  const [profile, setProfile] = useState({
    farmer_name: 'Ramesh Patel',
    phone: '9876543210',
    village: 'Thirumalayapalem',
    district: 'Khammam',
    state: 'Telangana',
    latitude: 17.2473,
    longitude: 80.1514,
    farm_size_acres: 6.5,
    primary_crop: 'Cotton & Chilli',
    soil_type: 'Deep Black Cotton Soil (Regur)',
    preferred_language: 'en'
  });

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [searchingLocation, setSearchingLocation] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [profData, histData] = await Promise.all([
          fetchFarmProfile(),
          fetchAnalysisHistory()
        ]);
        if (profData && profData.id) {
          setProfile(profData);
        }
        if (histData) {
          setHistory(histData);
        }
      } catch (err) {
        console.error('Failed to load farm profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const updated = await updateFarmProfile(profile);
      setProfile(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Failed to save profile: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleUseCurrentGPS = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setProfile((prev) => ({
            ...prev,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          }));
        },
        (err) => {
          alert('GPS location permission denied or unavailable. You can search by village/district name.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleSearchLocation = async (e) => {
    e.preventDefault();
    if (!searchLocation.trim()) return;
    setSearchingLocation(true);
    try {
      const resolved = await resolveLocation(searchLocation);
      if (resolved && resolved.lat && resolved.lon) {
        setProfile((prev) => ({
          ...prev,
          latitude: resolved.lat,
          longitude: resolved.lon,
          district: resolved.district || prev.district,
          state: resolved.state || prev.state
        }));
      }
    } catch (err) {
      alert('Location search failed: ' + err.message);
    } finally {
      setSearchingLocation(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <RefreshCw className="w-8 h-8 text-agri-600 animate-spin" />
        <p className="text-stone-500 text-sm">{isTe ? 'పొలం వివరాలు లోడ్ అవుతున్నాయి...' : 'Loading farm profile and field logs...'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-agri-800 bg-agri-100 px-3 py-1 rounded-full">
              {isTe ? 'రైతు ప్రొఫైల్ & రికార్డులు' : 'Farm Management Portal'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
            {profile.village} {isTe ? 'వ్యవసాయ క్షేత్రం' : 'Farmstead'}
          </h1>
          <p className="text-xs text-stone-500 font-medium">
            {profile.farmer_name} • {profile.district}, {profile.state} • Lat: {profile.latitude?.toFixed(4)}, Lon: {profile.longitude?.toFixed(4)}
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition self-start sm:self-center"
        >
          <Printer className="w-4 h-4" />
          <span>{isTe ? 'నివేదికను ప్రింట్ చేయండి' : 'Print Farm Report'}</span>
        </button>
      </div>

      {/* Map & Geolocation Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-agri-700" />
              <span>{isTe ? 'పొలం స్థాన నిర్ధారణ (ఇంటరాక్టివ్ మ్యాప్)' : 'Interactive Farm Geo-Location (Leaflet Map)'}</span>
            </h3>
            <p className="text-xs text-stone-500">
              {isTe ? 'మ్యాప్‌పై క్లిక్ చేసి లేదా మీ గ్రామం/జిల్లాను వెతకండి' : 'Click marker or search village to calibrate local agro-weather'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* GPS Auto Detect */}
            <button
              onClick={handleUseCurrentGPS}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-emerald-200"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{isTe ? 'ప్రస్తుత GPS స్థానం' : 'Detect My GPS'}</span>
            </button>

            {/* Manual Location Search Form */}
            <form onSubmit={handleSearchLocation} className="flex items-center gap-1">
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder={isTe ? 'గ్రామం / జిల్లా పేరు...' : 'Village or district...'}
                className="px-3 py-1.5 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-agri-500 w-36 sm:w-48"
              />
              <button
                type="submit"
                disabled={searchingLocation}
                className="px-3 py-2 bg-agri-700 hover:bg-agri-800 text-white rounded-xl text-xs font-bold transition"
              >
                {searchingLocation ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
              </button>
            </form>
          </div>
        </div>

        {/* Leaflet Map Component */}
        <LeafletMap
          latitude={profile.latitude}
          longitude={profile.longitude}
          farmName={`${profile.farmer_name}'s Farm`}
          onLocationSelect={(lat, lon) => {
            setProfile((prev) => ({ ...prev, latitude: lat, longitude: lon }));
          }}
        />
      </div>

      {/* Farm Profile Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <h3 className="text-base font-bold text-stone-900">
            {isTe ? 'రైతు మరియు భూమి వివరాలను నవీకరించండి' : 'Farmer & Land Particulars'}
          </h3>
          {saveSuccess && (
            <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isTe ? 'విజయవంతంగా సేవ్ చేయబడింది!' : 'Saved successfully!'}
            </span>
          )}
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isTe ? 'రైతు పేరు' : 'Farmer Name'}
              </label>
              <input
                type="text"
                value={profile.farmer_name}
                onChange={(e) => setProfile({ ...profile, farmer_name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isTe ? 'ఫోన్ నంబర్' : 'Mobile Phone'}
              </label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isTe ? 'భూమి విస్తీర్ణం (ఎకరాలు)' : 'Farm Size (Acres)'}
              </label>
              <input
                type="number"
                step="0.5"
                value={profile.farm_size_acres}
                onChange={(e) => setProfile({ ...profile, farm_size_acres: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isTe ? 'గ్రామం' : 'Village'}
              </label>
              <input
                type="text"
                value={profile.village}
                onChange={(e) => setProfile({ ...profile, village: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isTe ? 'జిల్లా' : 'District'}
              </label>
              <input
                type="text"
                value={profile.district}
                onChange={(e) => setProfile({ ...profile, district: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isTe ? 'రాష్ట్రం' : 'State'}
              </label>
              <input
                type="text"
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isTe ? 'ప్రధాన పంట' : 'Primary Crop'}
              </label>
              <input
                type="text"
                value={profile.primary_crop}
                onChange={(e) => setProfile({ ...profile, primary_crop: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {isTe ? 'నేల రకం' : 'Soil Category'}
              </label>
              <input
                type="text"
                value={profile.soil_type}
                onChange={(e) => setProfile({ ...profile, soil_type: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-agri-700 hover:bg-agri-800 text-white rounded-xl text-sm font-bold shadow-xs transition flex items-center justify-center gap-1.5"
              >
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isTe ? 'ప్రొఫైల్ సేవ్ చేయండి' : 'Save Farm Changes'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Analysis History Log */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-stone-900">
            {isTe ? 'గత విశ్లేషణల రికార్డులు (హిస్టరీ)' : 'Crop & Disease Diagnostic History Log'}
          </h3>
          <p className="text-xs text-stone-500">
            {isTe ? 'ఈ పొలంలో గతంలో నిర్వహించిన స్కాన్‌లు మరియు సిఫార్సులు' : 'Persistent SQLite database record of previous AI detections'}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-600 uppercase border-y border-stone-200">
              <tr>
                <th className="py-3 px-4 font-semibold">{isTe ? 'తేదీ' : 'Date'}</th>
                <th className="py-3 px-4 font-semibold">{isTe ? 'రకం' : 'Scan Type'}</th>
                <th className="py-3 px-4 font-semibold">{isTe ? 'నిర్ధారణ శీర్షిక' : 'Title / Crop'}</th>
                <th className="py-3 px-4 font-semibold">{isTe ? 'తెగులు' : 'Identified Disease'}</th>
                <th className="py-3 px-4 font-semibold">{isTe ? 'ఖచ్చితత్వం' : 'Confidence'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {history.length > 0 ? (
                history.map((h) => (
                  <tr key={h.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3 px-4 text-stone-500 whitespace-nowrap">
                      {new Date(h.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        h.analysis_type === 'crop_id' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {h.analysis_type === 'crop_id' ? 'Crop ID' : 'Disease'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-900">
                      {h.title}
                    </td>
                    <td className="py-3 px-4 text-stone-700">
                      {h.disease_name || 'N/A (Crop Only)'}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-700">
                      {h.confidence}%
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-stone-400">
                    No scan history recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
