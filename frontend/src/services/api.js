const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Failed to fetch system status');
  return res.json();
}

export async function fetchDashboardSummary() {
  const res = await fetch(`${API_BASE}/dashboard/summary`);
  if (!res.ok) throw new Error('Failed to fetch dashboard summary');
  return res.json();
}

export async function identifyCrop(imageFile) {
  const formData = new FormData();
  formData.append('file', imageFile);
  const res = await fetch(`${API_BASE}/crops/identify`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Crop identification failed');
  }
  return res.json();
}

export async function detectDisease(imageFile, cropHint = '') {
  const formData = new FormData();
  formData.append('file', imageFile);
  if (cropHint) {
    formData.append('crop_hint', cropHint);
  }
  const res = await fetch(`${API_BASE}/diseases/detect`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Disease detection failed');
  }
  return res.json();
}

export async function analyzeSoilVisual(imageFile) {
  const formData = new FormData();
  formData.append('file', imageFile);
  const res = await fetch(`${API_BASE}/soil/analyze-image`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Soil image analysis failed');
  }
  return res.json();
}

export async function evaluateSoilTest(soilValues) {
  const res = await fetch(`${API_BASE}/soil/evaluate-test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(soilValues),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Soil test evaluation failed');
  }
  return res.json();
}

export async function fetchSoilRecords() {
  const res = await fetch(`${API_BASE}/soil/records`);
  if (!res.ok) throw new Error('Failed to fetch soil records');
  return res.json();
}

export async function fetchWeather(lat, lon) {
  let url = `${API_BASE}/weather`;
  if (lat && lon) {
    url += `?lat=${lat}&lon=${lon}`;
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch weather data');
  return res.json();
}

export async function resolveLocation(query) {
  const res = await fetch(`${API_BASE}/weather/resolve-location?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to resolve location');
  return res.json();
}

export async function fetchPesticideCatalog() {
  const res = await fetch(`${API_BASE}/pesticides/catalog`);
  if (!res.ok) throw new Error('Failed to fetch pesticide catalog');
  return res.json();
}

export async function getPesticideRecommendations(diseaseName, cropName = '') {
  const res = await fetch(`${API_BASE}/pesticides/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ disease_name: diseaseName, crop_name: cropName }),
  });
  if (!res.ok) throw new Error('Failed to fetch pesticide recommendations');
  return res.json();
}

export async function sendChatMessage(message, language = 'en') {
  const res = await fetch(`${API_BASE}/assistant/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, language }),
  });
  if (!res.ok) throw new Error('Failed to get answer from assistant');
  return res.json();
}

export async function fetchFarmProfile() {
  const res = await fetch(`${API_BASE}/farm/profile`);
  if (!res.ok) throw new Error('Failed to fetch farm profile');
  return res.json();
}

export async function updateFarmProfile(profileData) {
  const res = await fetch(`${API_BASE}/farm/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData),
  });
  if (!res.ok) throw new Error('Failed to update farm profile');
  return res.json();
}

export async function fetchAnalysisHistory() {
  const res = await fetch(`${API_BASE}/farm/history`);
  if (!res.ok) throw new Error('Failed to fetch analysis history');
  return res.json();
}
