// ==========================================================
// AQAR IN (عقار إن) - Unified API Service
// Communicates with Express/MySQL with transparent fallback to LocalStorage & Mock Data
// ==========================================================

import { INITIAL_PROPERTIES, EGYPT_BANKS, EGYPT_LOCATIONS } from '../data/mockData';

const API_BASE_URL = '/api';

// Local storage key for properties added in browser session
const LOCAL_PROPERTIES_KEY = 'aqarin_properties';
const LOCAL_VALUATIONS_KEY = 'aqarin_valuations';
const LOCAL_SAVED_PROPERTIES_KEY = 'aqarin_saved_props';

function getLocalProperties() {
  const saved = localStorage.getItem(LOCAL_PROPERTIES_KEY);
  if (!saved) {
    localStorage.setItem(LOCAL_PROPERTIES_KEY, JSON.stringify(INITIAL_PROPERTIES));
    return INITIAL_PROPERTIES;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return INITIAL_PROPERTIES;
  }
}

function saveLocalProperties(props) {
  localStorage.setItem(LOCAL_PROPERTIES_KEY, JSON.stringify(props));
}

// 1. Properties API
export async function fetchProperties(filters = {}) {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '' && val !== 'all') {
        params.append(key, val);
      }
    });

    const res = await fetch(`${API_BASE_URL}/properties?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data && data.data.length > 0) {
        return data.data;
      }
    }
  } catch (e) {
    // Fallback to local filtering
  }

  // Local fallback filter implementation
  let list = getLocalProperties();

  if (filters.purpose && filters.purpose !== 'all') {
    list = list.filter(p => p.purpose === filters.purpose);
  }
  if (filters.category && filters.category !== 'all') {
    list = list.filter(p => p.category === filters.category);
  }
  if (filters.propertyType && filters.propertyType !== 'all') {
    list = list.filter(p => p.propertyType.toLowerCase() === filters.propertyType.toLowerCase());
  }
  if (filters.city && filters.city !== 'all') {
    list = list.filter(p => p.city.toLowerCase().includes(filters.city.toLowerCase()));
  }
  if (filters.district && filters.district !== 'all') {
    list = list.filter(p => p.district.toLowerCase().includes(filters.district.toLowerCase()));
  }
  if (filters.minPrice) {
    list = list.filter(p => p.price >= Number(filters.minPrice));
  }
  if (filters.maxPrice) {
    list = list.filter(p => p.price <= Number(filters.maxPrice));
  }
  if (filters.bedrooms && filters.bedrooms !== 'all') {
    list = list.filter(p => p.bedrooms >= Number(filters.bedrooms));
  }
  if (filters.search) {
    const s = filters.search.toLowerCase();
    list = list.filter(p =>
      p.titleEn.toLowerCase().includes(s) ||
      p.titleAr.includes(s) ||
      p.district.toLowerCase().includes(s) ||
      (p.compound && p.compound.toLowerCase().includes(s))
    );
  }

  return list;
}

export async function fetchPropertyById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/properties/${id}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.data) {
        return { property: data.data, similar: data.similar || [] };
      }
    }
  } catch (e) {
    // Fallback
  }

  const all = getLocalProperties();
  const found = all.find(p => String(p.id) === String(id));
  const similar = all.filter(p => String(p.id) !== String(id)).slice(0, 3);
  return { property: found || all[0], similar };
}

export async function createProperty(propertyData) {
  try {
    const res = await fetch(`${API_BASE_URL}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(propertyData)
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    // Fallback
  }

  const all = getLocalProperties();
  const newProp = {
    id: Date.now(),
    ...propertyData,
    aqarScore: 9.4,
    viewsCount: 1,
    featured: false,
    owner: { name: 'Verified Seller', phone: '+201000000000', whatsapp: '+201000000000', verified: true }
  };
  saveLocalProperties([newProp, ...all]);
  return { success: true, message: 'Property created', propertyId: newProp.id };
}

// 2. Valuation Engine API
export async function calculateInstantValuation(input) {
  try {
    const res = await fetch(`${API_BASE_URL}/valuation/instant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        saveValuationLocally(data.data);
        return data.data;
      }
    }
  } catch (e) {
    // Fallback calculation
  }

  // Dynamic Client-side valuation algorithm
  const area = Math.max(20, Number(input.areaSqm || 150));
  let baseSqm = 65000;
  
  // Lookup benchmark in local locations
  for (const city of EGYPT_LOCATIONS) {
    const foundDist = city.districts.find(d => d.nameEn === input.district || d.nameAr === input.district);
    if (foundDist) {
      baseSqm = foundDist.avgSqm;
      break;
    }
  }

  const finishMultipliers = { core_shell: 0.75, semi_finished: 0.88, fully_finished: 1.0, ultra_lux: 1.18 };
  const finishMod = finishMultipliers[input.finishing] || 1.0;
  const viewMod = input.viewType === 'Nile' ? 1.25 : input.viewType === 'Sea' ? 1.30 : input.viewType === 'Golf' ? 1.15 : input.viewType === 'Lagoon' ? 1.12 : 1.05;
  
  const pricePerSqm = Math.round(baseSqm * finishMod * viewMod);
  const midEstimate = Math.round(pricePerSqm * area);
  const minEstimate = Math.round(midEstimate * 0.92);
  const maxEstimate = Math.round(midEstimate * 1.09);
  const rentalYield = 8.4;
  const estRentalMonthly = Math.round((midEstimate * (rentalYield / 100)) / 12);
  const currentYear = new Date().getFullYear();

  const historyChart = [
    { year: currentYear - 4, pricePerSqm: Math.round(pricePerSqm * 0.42) },
    { year: currentYear - 3, pricePerSqm: Math.round(pricePerSqm * 0.55) },
    { year: currentYear - 2, pricePerSqm: Math.round(pricePerSqm * 0.70) },
    { year: currentYear - 1, pricePerSqm: Math.round(pricePerSqm * 0.85) },
    { year: currentYear, pricePerSqm: pricePerSqm },
    { year: currentYear + 1, pricePerSqm: Math.round(pricePerSqm * 1.22) }
  ];

  const result = {
    valuationCode: 'VAL-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    minEstimate,
    midEstimate,
    maxEstimate,
    pricePerSqm,
    areaSqm: area,
    confidenceScore: 95,
    rentalYieldEst: rentalYield,
    estRentalMonthly,
    annualGrowthPct: 22.5,
    historyChart,
    specs: input
  };

  saveValuationLocally(result);
  return result;
}

function saveValuationLocally(val) {
  try {
    const list = JSON.parse(localStorage.getItem(LOCAL_VALUATIONS_KEY) || '[]');
    localStorage.setItem(LOCAL_VALUATIONS_KEY, JSON.stringify([val, ...list.slice(0, 20)]));
  } catch (e) {}
}

export function getSavedValuations() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_VALUATIONS_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

// 3. Mortgage Calculator API
export async function calculateMortgage(params) {
  try {
    const res = await fetch(`${API_BASE_URL}/mortgage/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch (e) {}

  const price = Number(params.propertyPrice || 5000000);
  const downPayment = Math.round(price * (Number(params.downPaymentPct || 20) / 100));
  const loanAmount = price - downPayment;
  const monthlyRate = (Number(params.interestRate || 18.5) / 100) / 12;
  const totalMonths = Number(params.tenureYears || 15) * 12;

  let monthlyInstallment = 0;
  if (monthlyRate > 0) {
    monthlyInstallment = Math.round(
      loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    );
  } else {
    monthlyInstallment = Math.round(loanAmount / totalMonths);
  }

  const totalPayment = monthlyInstallment * totalMonths;
  const totalInterest = totalPayment - loanAmount;
  const minRequiredIncome = Math.round(monthlyInstallment * 2.5);

  return {
    propertyPrice: price,
    downPayment,
    downPaymentPct: Number(params.downPaymentPct || 20),
    loanAmount,
    tenureYears: Number(params.tenureYears || 15),
    interestRate: Number(params.interestRate || 18.5),
    monthlyInstallment,
    totalInterest,
    totalPayment,
    minRequiredIncome
  };
}

export async function submitMortgageApplication(data) {
  try {
    const res = await fetch(`${API_BASE_URL}/mortgage/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return { success: true, message: 'Application received' };
}

// 4. Saved Favorites
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
