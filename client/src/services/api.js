// ==========================================================
// AQAR IN (عقار إن) - Authoritative PostgreSQL API Service
// Real API communication without silent mock fallbacks or fake data
// ==========================================================

const API_BASE_URL = '/api';

// 1. Properties API
export async function fetchProperties(filters = {}) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '' && val !== 'all') {
      params.append(key, val);
    }
  });

  const res = await fetch(`${API_BASE_URL}/properties?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to retrieve properties (${res.status})`);
  }
  const data = await res.json();
  if (data.success && Array.isArray(data.data)) {
    return data.data;
  }
  return [];
}

export async function fetchPropertyById(id) {
  const res = await fetch(`${API_BASE_URL}/properties/${id}`);
  if (!res.ok) {
    if (res.status === 404) throw new Error('Property not found');
    throw new Error(`Failed to retrieve property details (${res.status})`);
  }
  const data = await res.json();
  if (data.success && data.data) {
    return { property: data.data, similar: data.similar || [] };
  }
  throw new Error('Invalid property payload from server');
}

export async function submitPropertyListing(propertyData) {
  const res = await fetch(`${API_BASE_URL}/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(propertyData)
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || `Failed to submit property listing (${res.status})`);
  }
  return data;
}

export const createProperty = submitPropertyListing;

// 2. Valuation API
const LOCAL_VALUATIONS_KEY = 'aqarin_user_valuations';

function saveValuationLocally(val) {
  try {
    const list = JSON.parse(localStorage.getItem(LOCAL_VALUATIONS_KEY) || '[]');
    localStorage.setItem(LOCAL_VALUATIONS_KEY, JSON.stringify([val, ...list.slice(0, 19)]));
  } catch (e) {}
}

export function getSavedValuations() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_VALUATIONS_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

export async function requestInstantValuation(input) {
  const res = await fetch(`${API_BASE_URL}/valuation/instant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input)
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || `Valuation engine failed (${res.status})`);
  }
  saveValuationLocally(data.data);
  return data.data;
}

export async function submitProfessionalValuationRequest(details) {
  const res = await fetch(`${API_BASE_URL}/valuation/professional-request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details)
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || `Failed to submit valuation request (${res.status})`);
  }
  return data;
}

export const calculateInstantValuation = requestInstantValuation;
export const submitValuationInquiry = submitProfessionalValuationRequest;

// 3. Mortgage Calculator & Application API
export async function calculateMortgage(params) {
  const res = await fetch(`${API_BASE_URL}/mortgage/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || `Mortgage calculation error (${res.status})`);
  }
  return data.data;
}

export async function fetchMortgageBanks() {
  const res = await fetch(`${API_BASE_URL}/mortgage/banks`);
  if (!res.ok) throw new Error('Failed to fetch bank rates');
  const data = await res.json();
  return data.data || [];
}

export async function submitMortgageApplication(appData) {
  const res = await fetch(`${API_BASE_URL}/mortgage/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appData)
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || `Application submission failed (${res.status})`);
  }
  return data;
}

// 4. Leads & Inquiries API
export async function submitPropertyInquiry(inquiry) {
  const res = await fetch(`${API_BASE_URL}/leads/property-inquiry`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inquiry)
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to send inquiry');
  }
  return data;
}

export async function submitPartnerApplication(partner) {
  const res = await fetch(`${API_BASE_URL}/leads/partner-apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(partner)
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Failed to submit partner application');
  }
  return data;
}

// 5. Special Real Estate Services API (Fast Sell, Exchange, Management)
export async function submitFastSell(fastSellData) {
  const res = await fetch(`${API_BASE_URL}/services/fast-sell`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fastSellData)
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Fast Sell submission failed');
  }
  return data;
}

export async function submitPropertyExchange(exchangeData) {
  const res = await fetch(`${API_BASE_URL}/services/exchange`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exchangeData)
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Exchange submission failed');
  }
  return data;
}

export async function submitPropertyManagement(managementData) {
  const res = await fetch(`${API_BASE_URL}/services/management`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(managementData)
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Management contract submission failed');
  }
  return data;
}

// 6. Database Favorites (Saved Properties)
export async function fetchUserFavorites(userId) {
  const res = await fetch(`${API_BASE_URL}/services/favorites/${userId}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.data || [];
}

export async function togglePropertyFavorite(userId, propertyId) {
  const res = await fetch(`${API_BASE_URL}/services/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, propertyId })
  });
  return await res.json();
}

// 7. Local Client Favorites Helpers
const LOCAL_SAVED_PROPERTIES_KEY = 'aqarin_favorites';

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_SAVED_PROPERTIES_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

export function toggleFavorite(propertyId) {
  const favs = getFavorites();
  const exists = favs.includes(propertyId);
  const updated = exists ? favs.filter(id => id !== propertyId) : [...favs, propertyId];
  localStorage.setItem(LOCAL_SAVED_PROPERTIES_KEY, JSON.stringify(updated));
  return updated;
}
