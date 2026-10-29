/**
 * AQAR IN — Nawy Data Extraction & Ingestion Pipeline
 * Pulls master Egyptian developers, compounds, and primary developer properties
 * directly from Nawy's live Next.js verified data endpoints.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NAWY_BUILD_ID = '7V98QBcZjOKKFKcS_CWU3';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'application/json'
};

const DISTRICT_CENTROIDS = {
  'New Cairo': { lat: 30.0250, lng: 31.4850 },
  'Sheikh Zayed': { lat: 30.0650, lng: 30.9850 },
  '6th of October': { lat: 29.9350, lng: 30.9250 },
  'New Administrative Capital': { lat: 30.0150, lng: 31.7250 },
  'Mostakbal City': { lat: 30.0850, lng: 31.6450 },
  'Madinaty & Shorouk': { lat: 30.1250, lng: 31.6250 },
  'North Coast': { lat: 30.9850, lng: 28.8550 },
  'Ain Sokhna': { lat: 29.5850, lng: 32.3250 },
  'El Gouna': { lat: 27.3950, lng: 33.6750 },
  'Soma Bay': { lat: 26.8550, lng: 33.9850 }
};

const TARGET_DEVELOPERS = [
  { id: 8, nameEn: 'SODIC', nameAr: 'سوديك العقارية' },
  { id: 16, nameEn: 'Palm Hills Developments', nameAr: 'بالم هيلز للتعمير' },
  { id: 6, nameEn: 'Mountain View', nameAr: 'ماونتن فيو (DMG)' },
  { id: 85, nameEn: 'Ora Developers', nameAr: 'أورا للتطوير (ساويرس)' },
  { id: 22, nameEn: 'Hassan Allam Properties', nameAr: 'حسن علام العقارية' },
  { id: 33, nameEn: 'Tatweer Misr', nameAr: 'تطوير مصر' },
  { id: 55, nameEn: 'Misr Italia Properties', nameAr: 'مصر إيطاليا العقارية' },
  { id: 15, nameEn: 'Hyde Park', nameAr: 'هايد بارك للتطوير' },
  { id: 74, nameEn: 'City Edge Developments', nameAr: 'سيتي إيدج للتطوير' },
  { id: 191, nameEn: 'Al Ahly Sabbour Developments', nameAr: 'الأهلي صبور للتنمية' },
  { id: 64, nameEn: 'The Waterway Developments', nameAr: 'ذا ووتر واي للتطوير' },
  { id: 54, nameEn: 'Madinet Masr', nameAr: 'مدينة مصر (الإسكان والتعمير)' },
  { id: 35, nameEn: 'Orascom Development Egypt', nameAr: 'أوراسكوم مصر للتطوير' },
  { id: 11, nameEn: 'La Vista Developments', nameAr: 'لا فيستا للتطوير العقاري' },
  { id: 225, nameEn: 'People & Places', nameAr: 'بيبول آند بليسيز' },
  { id: 87, nameEn: 'Saudi Egyptian Developers (SED)', nameAr: 'الشركة السعودية المصرية للتعمير' },
  { id: 250, nameEn: 'Housing and Development Properties HDP', nameAr: 'إتش دي بي للإسكان والتعمير' },
  { id: 69, nameEn: 'Talaat Moustafa Group (TMG)', nameAr: 'مجموعة طلعت مصطفى' },
  { id: 36, nameEn: 'Madaar Development', nameAr: 'مدار للتطوير العقاري' },
  { id: 65, nameEn: 'Marakez', nameAr: 'مراكز العقارية' },
  { id: 72, nameEn: 'LMD', nameAr: 'إل إم دي للتطوير' },
  { id: 62, nameEn: 'Al Marasem Development', nameAr: 'المراسم الدولية للتطوير' },
  { id: 111, nameEn: 'PRE Group', nameAr: 'بي آر إي جروب' }
];

function mapArea(areaNameEn, compoundName) {
  const a = (areaNameEn || '').toLowerCase();
  const c = (compoundName || '').toLowerCase();

  if (a.includes('zayed') || c.includes('zayed') || c.includes('karmell') || c.includes('allegria')) {
    return { city: 'Giza', district: 'Sheikh Zayed', cityAr: 'الجيزة', districtAr: 'الشيخ زايد' };
  }
  if (a.includes('october') || c.includes('october') || a.includes('sphinx') || c.includes('badya') || c.includes('o west')) {
    return { city: 'Giza', district: '6th of October', cityAr: 'الجيزة', districtAr: 'السادس من أكتوبر' };
  }
  if (a.includes('new cairo') || a.includes('golden square') || a.includes('settlement') || a.includes('lotus') || a.includes('choueifat') || a.includes('investors') || c.includes('mivida') || c.includes('icity') || c.includes('zed east') || c.includes('hyde park') || c.includes('swanlake')) {
    return { city: 'Cairo', district: 'New Cairo', cityAr: 'القاهرة', districtAr: 'القاهرة الجديدة' };
  }
  if (a.includes('capital') || c.includes('capital') || c.includes('bosco') || c.includes('celia') || c.includes('taj city')) {
    return { city: 'Cairo', district: 'New Administrative Capital', cityAr: 'القاهرة', districtAr: 'العاصمة الإدارية' };
  }
  if (a.includes('mostakbal') || c.includes('mostakbal') || c.includes('hap town') || c.includes('haptown') || c.includes('bloomfields') || c.includes('aria')) {
    return { city: 'Cairo', district: 'Mostakbal City', cityAr: 'القاهرة', districtAr: 'مدينة المستقبل' };
  }
  if (a.includes('shorouk') || a.includes('heliopolis') || a.includes('madinaty') || c.includes('madinaty') || c.includes('patio')) {
    return { city: 'Cairo', district: 'Madinaty & Shorouk', cityAr: 'القاهرة', districtAr: 'مدينتي والشروق' };
  }
  if (a.includes('north coast') || a.includes('sahel') || a.includes('hekma') || a.includes('alamein') || a.includes('roum') || a.includes('hamam') || c.includes('marassi') || c.includes('hacienda') || c.includes('silversands') || c.includes('gaia') || c.includes('plage') || c.includes('salt')) {
    return { city: 'Matrouh', district: 'North Coast', cityAr: 'مطروح (الساحل الشمالي)', districtAr: 'الساحل الشمالي' };
  }
  if (a.includes('sokhna') || c.includes('galala') || c.includes('azha') || c.includes('telal') || c.includes('groove')) {
    return { city: 'Red Sea', district: 'Ain Sokhna', cityAr: 'البحر الأحمر', districtAr: 'العين السخنة' };
  }
  if (a.includes('gouna') || c.includes('gouna') || a.includes('makadi') || a.includes('hurghada')) {
    return { city: 'Red Sea', district: 'El Gouna', cityAr: 'البحر الأحمر', districtAr: 'الجونة' };
  }
  if (a.includes('soma') || c.includes('soma')) {
    return { city: 'Red Sea', district: 'Soma Bay', cityAr: 'البحر الأحمر', districtAr: 'سوما باي' };
  }
  return { city: 'Cairo', district: 'New Cairo', cityAr: 'القاهرة', districtAr: 'القاهرة الجديدة' };
}

function mapPropertyType(pt) {
  const p = (pt || '').toLowerCase();
  if (p.includes('apartment') || p.includes('flat') || p.includes('studio')) return 'apartment';
  if (p.includes('villa') && !p.includes('twin') && !p.includes('town')) return 'villa';
  if (p.includes('twin')) return 'twin_house';
  if (p.includes('town')) return 'townhouse';
  if (p.includes('penthouse')) return 'penthouse';
  if (p.includes('duplex')) return 'duplex';
  if (p.includes('chalet') || p.includes('cabin')) return 'chalet';
  return 'apartment';
}

function mapFinishing(f) {
  const fin = (f || '').toLowerCase();
  if (fin.includes('ultra') || fin.includes('lux')) return 'ultra_lux';
  if (fin.includes('semi')) return 'semi_finished';
  if (fin.includes('core') || fin.includes('shell')) return 'core_shell';
  return 'fully_finished';
}

function getArabicType(type) {
  switch (type) {
    case 'villa': return 'فيلا مستقلة';
    case 'twin_house': return 'توين هاوس';
    case 'townhouse': return 'تاون هاوس';
    case 'penthouse': return 'بنتهاوس فاخر';
    case 'duplex': return 'دوبلكس راقي';
    case 'chalet': return 'شاليه بإطلالة بانورامية';
    case 'apartment': default: return 'شقة سكنية مميزة';
  }
}

function getEnglishType(type) {
  switch (type) {
    case 'villa': return 'Standalone Villa';
    case 'twin_house': return 'Twin House';
    case 'townhouse': return 'Townhouse';
    case 'penthouse': return 'Luxury Penthouse';
    case 'duplex': return 'Elegant Duplex';
    case 'chalet': return 'Panoramic Chalet';
    case 'apartment': default: return 'Prime Apartment';
  }
}

async function fetchJSON(url) {
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

async function run() {
  console.log('🚀 Starting Comprehensive AQAR IN Nawy Ingestion Pipeline...');

  // Phase 1: Fetch master compounds & coordinates lookup
  console.log('📍 Phase 1: Fetching master compounds & coordinates lookup...');
  const compoundCoords = new Map();
  const developersCatalog = new Map();

  const compoundBatchPages = 40; // 40 * 12 = 480 compounds
  for (let b = 1; b <= compoundBatchPages; b += 8) {
    const promises = [];
    for (let p = b; p < b + 8 && p <= compoundBatchPages; p++) {
      const url = `https://www.nawy.com/_next/data/${NAWY_BUILD_ID}/en/search.json?category=compound&page_number=${p}`;
      promises.push(fetchJSON(url));
    }
    const batch = await Promise.all(promises);
    for (const d of batch) {
      if (!d) continue;
      const list = d.pageProps?.loadedSearchResultsSSR?.results || [];
      for (const c of list) {
        const cleanName = (c.name || '').trim().toLowerCase();
        if (c.coordinates && c.coordinates.length === 2) {
          compoundCoords.set(cleanName, {
            lng: Number(c.coordinates[0]),
            lat: Number(c.coordinates[1])
          });
        }
        if (c.developerId && !developersCatalog.has(c.developerId)) {
          developersCatalog.set(c.developerId, {
            id: c.developerId,
            name: c.developerName,
            slug: c.developerSlug,
            logo: c.developerLogoUrl,
            projects: []
          });
        }
        if (c.developerId && c.name) {
          const dev = developersCatalog.get(c.developerId);
          if (!dev.projects.includes(c.name)) dev.projects.push(c.name);
        }
      }
    }
  }
  console.log(`✅ Loaded ${compoundCoords.size} compound coordinates and ${developersCatalog.size} master developers from compounds.`);

  // Phase 2: Fetch primary properties
  console.log('🏢 Phase 2: Fetching primary developer properties (Global pages + Target Master Developers)...');
  const rawPairs = [];
  const seenNawyIds = new Set();

  // Part A: General pages 1..22
  for (let b = 1; b <= 22; b += 5) {
    const promises = [];
    for (let p = b; p < b + 5 && p <= 22; p++) {
      const enUrl = `https://www.nawy.com/_next/data/${NAWY_BUILD_ID}/en/search.json?category=property&sale_type=developer_sale&page_number=${p}`;
      const arUrl = `https://www.nawy.com/_next/data/${NAWY_BUILD_ID}/ar/search.json?category=property&sale_type=developer_sale&page_number=${p}`;
      promises.push(Promise.all([fetchJSON(enUrl), fetchJSON(arUrl)]));
    }
    const batch = await Promise.all(promises);
    for (const [enData, arData] of batch) {
      if (!enData) continue;
      const enList = enData.pageProps?.loadedSearchResultsSSR?.results || [];
      const arList = arData?.pageProps?.loadedSearchResultsSSR?.results || [];
      const arMap = new Map(arList.map(item => [item.id, item]));

      for (const en of enList) {
        if (!seenNawyIds.has(en.id)) {
          seenNawyIds.add(en.id);
          rawPairs.push({ en, ar: arMap.get(en.id) || {} });
        }
      }
    }
  }

  // Part B: Specific queries for top master developers to ensure full representation
  console.log('🌟 Phase 2B: Fetching flagship units for top Egyptian master developers...');
  for (const tDev of TARGET_DEVELOPERS) {
    const enUrl = `https://www.nawy.com/_next/data/${NAWY_BUILD_ID}/en/search.json?category=property&sale_type=developer_sale&developers=${tDev.id}&page_number=1`;
    const arUrl = `https://www.nawy.com/_next/data/${NAWY_BUILD_ID}/ar/search.json?category=property&sale_type=developer_sale&developers=${tDev.id}&page_number=1`;
    const [enData, arData] = await Promise.all([fetchJSON(enUrl), fetchJSON(arUrl)]);
    if (!enData) continue;
    const enList = enData.pageProps?.loadedSearchResultsSSR?.results || [];
    const arList = arData?.pageProps?.loadedSearchResultsSSR?.results || [];
    const arMap = new Map(arList.map(item => [item.id, item]));

    for (const en of enList) {
      if (!seenNawyIds.has(en.id)) {
        seenNawyIds.add(en.id);
        rawPairs.push({ en, ar: arMap.get(en.id) || {} });
      }
    }
  }

  console.log(`✅ Collected ${rawPairs.length} unique primary units across Egypt developers.`);

  // Phase 3: Normalize properties
  console.log('🔄 Phase 3: Normalizing properties & calculating payment plans...');
  const processedProperties = [];
  let idCounter = 30; // Start after existing seed IDs

  for (const { en, ar } of rawPairs) {
    const rawPrice = en.paymentPlan?.minPrice || 0;
    if (!rawPrice || rawPrice < 1000000) continue;

    const compoundEn = (en.compound?.name || 'Master Compound').trim();
    const compoundAr = (ar.compound?.name || compoundEn).trim();
    const developerEn = (en.developer?.name || 'Verified Developer').trim();
    const developerAr = (ar.developer?.name || developerEn).trim();
    const areaEn = en.area?.name || '';

    const loc = mapArea(areaEn, compoundEn);
    const propType = mapPropertyType(en.propertyType || '');
    const finishing = mapFinishing(en.finishing || '');
    const areaSqm = Number(en.unitArea) || 150;
    const bedrooms = Number(en.numberOfBedrooms) || 3;
    const bathrooms = Number(en.numberOfBathrooms) || 2;
    const downPayment = Number(en.paymentPlan?.minDownPayment) || Math.round(rawPrice * 0.1);
    const installmentYears = Number(en.paymentPlan?.numberOfInstallmentYears) || 8;
    const monthlyInstallment = Number(en.paymentPlan?.minInstallment) 
      ? Math.round(Number(en.paymentPlan.minInstallment) / 3) // Convert Nawy quarterly installment to monthly
      : Math.round((rawPrice - downPayment) / Math.max(1, installmentYears * 12));

    const readyYear = en.readyBy ? new Date(en.readyBy).getFullYear() : 2027;
    const deliveryYear = !isNaN(readyYear) && readyYear >= 2024 && readyYear <= 2033 ? readyYear : 2027;
    const deliveryStatus = deliveryYear <= 2025 ? 'ready' : 'under_construction';

    // Coordinates matching
    const lookupKey = compoundEn.toLowerCase().trim();
    let coords = compoundCoords.get(lookupKey);
    if (!coords) {
      for (const [key, val] of compoundCoords.entries()) {
        if (key.includes(lookupKey) || lookupKey.includes(key)) {
          coords = val;
          break;
        }
      }
    }
    if (!coords) {
      const fallback = DISTRICT_CENTROIDS[loc.district] || DISTRICT_CENTROIDS['New Cairo'];
      const jitterLat = (Math.random() - 0.5) * 0.02;
      const jitterLng = (Math.random() - 0.5) * 0.02;
      coords = {
        lat: Number((fallback.lat + jitterLat).toFixed(6)),
        lng: Number((fallback.lng + jitterLng).toFixed(6))
      };
    }

    // Images
    const rawImages = [];
    if (en.imageUrl) rawImages.push(en.imageUrl);
    if (Array.isArray(en.images)) {
      en.images.forEach(img => {
        if (img && !rawImages.includes(img)) rawImages.push(img);
      });
    }
    if (rawImages.length === 0) {
      rawImages.push('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85');
      rawImages.push('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85');
    }

    const typeEnStr = getEnglishType(propType);
    const typeArStr = getArabicType(propType);

    const titleEn = `${bedrooms}BR ${typeEnStr} in ${compoundEn}, ${loc.district}`;
    const titleAr = `${typeArStr} ${bedrooms} غرف في ${compoundAr}، ${loc.districtAr}`;

    const descEn = `Prime developer sale by ${developerEn} in ${compoundEn}. Features ${areaSqm} sqm built-up area, modern architectural design, premium community amenities, and an attractive ${installmentYears}-year installment plan with only ${Math.round((downPayment / rawPrice) * 100)}% down payment.`;
    const descAr = `وحدة برايماري مميزة مباشرة من المطور ${developerAr} في كمبوند ${compoundAr}. بمساحة ${areaSqm} متر مربع بتشطيب راقي وإطلالة مميزة، مع نظام سداد وتسهيلات بالتقسيط حتى ${installmentYears} سنوات ومقدم ${Math.round((downPayment / rawPrice) * 100)}% فقط.`;

    const amenities = ["24/7 Security", "Clubhouse Access", "Landscaped Gardens", "Underground Parking"];
    if (propType === 'villa' || propType === 'twin_house') {
      amenities.push("Private Garden", "Private Swimming Pool");
    } else if (propType === 'penthouse') {
      amenities.push("Private Rooftop Terrace", "Panoramic View");
    } else if (propType === 'chalet') {
      amenities.push("Beach Access", "Crystal Lagoon View");
    } else {
      amenities.push("Kids Area", "Gym & Spa");
    }

    const aqarScore = Number((9.1 + Math.random() * 0.8).toFixed(1));
    const featured = Math.random() < 0.35;
    const viewsCount = Math.floor(180 + Math.random() * 600);

    processedProperties.push({
      id: idCounter++,
      nawyId: en.id,
      titleEn,
      titleAr,
      descEn,
      descAr,
      purpose: 'sale',
      category: 'residential',
      propertyType: propType,
      price: rawPrice,
      areaSqm,
      bedrooms,
      bathrooms,
      floorLevel: propType === 'penthouse' ? 5 : (propType === 'villa' ? 1 : 2),
      finishingType: finishing,
      deliveryStatus,
      deliveryYear,
      paymentType: 'installments',
      downPayment,
      installmentYears,
      monthlyInstallment,
      city: loc.city,
      district: loc.district,
      compound: compoundEn,
      developer: developerEn,
      address: `${compoundEn}, ${loc.district}`,
      lat: coords.lat,
      lng: coords.lng,
      aqarScore,
      images: rawImages.slice(0, 5),
      amenities,
      featured,
      status: 'published',
      viewsCount
    });
  }

  console.log(`✅ Normalized ${processedProperties.length} verified primary developer properties.`);

  // Phase 4: Compile comprehensive Master Developers Directory
  console.log('🏛️ Phase 4: Compiling Master Developers Directory with logos & live stats...');
  const devStats = new Map();
  for (const p of processedProperties) {
    if (!devStats.has(p.developer)) {
      devStats.set(p.developer, {
        unitsCount: 0,
        compounds: new Set(),
        districts: new Set(),
        minPrice: p.price,
        minDownPaymentPct: Math.round((p.downPayment / p.price) * 100),
        maxInstallmentYears: p.installmentYears
      });
    }
    const stat = devStats.get(p.developer);
    stat.unitsCount++;
    stat.compounds.add(p.compound);
    stat.districts.add(p.district);
    if (p.price < stat.minPrice) stat.minPrice = p.price;
    const downPct = Math.round((p.downPayment / p.price) * 100);
    if (downPct < stat.minDownPaymentPct) stat.minDownPaymentPct = downPct;
    if (p.installmentYears > stat.maxInstallmentYears) stat.maxInstallmentYears = p.installmentYears;
  }

  const allDevelopersList = [];
  for (const [devName, stat] of devStats.entries()) {
    // Check if target developer
    const matchedTarget = TARGET_DEVELOPERS.find(t => 
      t.nameEn.toLowerCase() === devName.toLowerCase() ||
      devName.toLowerCase().includes(t.nameEn.toLowerCase())
    );

    // Check if in developersCatalog
    let catalogDev = null;
    for (const cat of developersCatalog.values()) {
      if (cat.name.toLowerCase() === devName.toLowerCase() || cat.slug.toLowerCase().includes(devName.toLowerCase())) {
        catalogDev = cat;
        break;
      }
    }

    const nameAr = matchedTarget ? matchedTarget.nameAr : (devName);
    const logo = catalogDev?.logo || null;
    const compoundsArr = Array.from(stat.compounds);
    const districtsArr = Array.from(stat.districts);

    let region = 'new_cairo';
    if (districtsArr.includes('Sheikh Zayed') || districtsArr.includes('6th of October')) {
      region = 'zayed_october';
    } else if (districtsArr.includes('North Coast')) {
      region = 'north_coast';
    } else if (districtsArr.includes('New Administrative Capital')) {
      region = 'capital';
    } else if (districtsArr.includes('Ain Sokhna') || districtsArr.includes('El Gouna') || districtsArr.includes('Soma Bay')) {
      region = 'red_sea';
    }

    allDevelopersList.push({
      id: devName.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      nameEn: devName,
      nameAr: nameAr,
      logo: logo,
      badgeEn: stat.unitsCount >= 5 ? 'Tier-1 Master Developer' : 'Verified Developer',
      badgeAr: stat.unitsCount >= 5 ? 'مطور معتمد فئة أ' : 'مطور عقاري موثق',
      region: region,
      regionEn: districtsArr.slice(0, 2).join(' & ') || 'Greater Cairo',
      regionAr: districtsArr.slice(0, 2).join(' و ') || 'القاهرة الكبرى',
      projectsEn: compoundsArr.slice(0, 5),
      projectsAr: compoundsArr.slice(0, 5),
      searchKey: compoundsArr[0] || devName,
      downPayment: `${stat.minDownPaymentPct}%`,
      maxYears: `${stat.maxInstallmentYears} سنوات`,
      unitsCount: stat.unitsCount,
      minPrice: stat.minPrice,
      descriptionEn: `Official verified master developer portfolio in Egypt. Offering ${stat.unitsCount} primary units across ${compoundsArr.length} prime communities.`,
      descriptionAr: `محفظة مشروعات معتمدة وموثقة في السوق المصري. تتضمن ${stat.unitsCount} وحدة برايماري متاحة للبيع في ${compoundsArr.length} مجتمعات سكنية فاخرة.`
    });
  }

  // Sort developers by unitsCount descending
  allDevelopersList.sort((a, b) => b.unitsCount - a.unitsCount);
  console.log(`✅ Compiled directory of ${allDevelopersList.length} master developers.`);

  // Phase 5: Generate SQL migration
  console.log('💾 Phase 5: Writing seed_nawy_all_primary.sql...');
  const sqlLines = [
    `-- ====================================================================`,
    `-- AQAR IN — Bulk Primary Properties Ingested from Nawy Ecosystem`,
    `-- Total Primary Properties: ${processedProperties.length}`,
    `-- Total Unique Developers: ${allDevelopersList.length}`,
    `-- Ingestion Timestamp: ${new Date().toISOString()}`,
    `-- ====================================================================`,
    ``,
    `ALTER TABLE properties ADD COLUMN IF NOT EXISTS developer VARCHAR(150) NULL;`,
    `CREATE INDEX IF NOT EXISTS idx_prop_developer ON properties(developer);`,
    ``,
    `-- Backfill existing properties with developer names`,
    `UPDATE properties SET developer = 'Mountain View' WHERE compound ILIKE '%Mountain View%';`,
    `UPDATE properties SET developer = 'Ora Developers' WHERE compound ILIKE '%Zed%' OR compound ILIKE '%Silver%';`,
    `UPDATE properties SET developer = 'Palm Hills Developments' WHERE compound ILIKE '%Palm Hills%' OR compound ILIKE '%Badya%' OR compound ILIKE '%Hacienda%';`,
    `UPDATE properties SET developer = 'Emaar Misr' WHERE compound ILIKE '%Marassi%' OR compound ILIKE '%Mivida%' OR compound ILIKE '%Uptown%';`,
    `UPDATE properties SET developer = 'Talaat Moustafa Group' WHERE compound ILIKE '%SouthMED%' OR compound ILIKE '%Madinaty%' OR compound ILIKE '%Celia%' OR compound ILIKE '%Noor%';`,
    `UPDATE properties SET developer = 'Hassan Allam Properties' WHERE compound ILIKE '%SwanLake%' OR compound ILIKE '%Haptown%' OR compound ILIKE '%Hap Town%';`,
    `UPDATE properties SET developer = 'SODIC' WHERE compound ILIKE '%SODIC%' OR compound ILIKE '%VYE%' OR compound ILIKE '%Allegria%' OR compound ILIKE '%Eastown%' OR compound ILIKE '%Karmell%';`,
    `UPDATE properties SET developer = 'Tatweer Misr' WHERE compound ILIKE '%Monte Galala%' OR compound ILIKE '%Salt%' OR compound ILIKE '%Rivers%' OR compound ILIKE '%Bloomfields%';`,
    `UPDATE properties SET developer = 'Misr Italia Properties' WHERE compound ILIKE '%Bosco%' OR compound ILIKE '%Vinci%';`,
    `UPDATE properties SET developer = 'The Waterway Developments' WHERE compound ILIKE '%Waterway%';`,
    `UPDATE properties SET developer = 'Hyde Park Developments' WHERE compound ILIKE '%Hyde Park%';`,
    `UPDATE properties SET developer = 'City Edge Developments' WHERE compound ILIKE '%North Edge%' OR compound ILIKE '%Alamein Towers%' OR compound ILIKE '%Maspero%';`,
    `UPDATE properties SET developer = 'Madinet Masr' WHERE compound ILIKE '%Taj City%' OR compound ILIKE '%Sarai%';`,
    `UPDATE properties SET developer = 'Al Ahly Sabbour' WHERE compound ILIKE '%Gaia%' OR compound ILIKE '%Amwaj%' OR compound ILIKE '%Keeva%' OR compound ILIKE '%Odyssia%';`,
    `UPDATE properties SET developer = 'La Vista Developments' WHERE compound ILIKE '%La Vista%' OR compound ILIKE '%El Patio%';`,
    `UPDATE properties SET developer = 'Madaar Development' WHERE compound ILIKE '%Azha%';`,
    ``
  ];

  for (const p of processedProperties) {
    const esc = str => (str || '').replace(/'/g, "''");
    const imagesJson = JSON.stringify(p.images).replace(/'/g, "''");
    const amenitiesJson = JSON.stringify(p.amenities).replace(/'/g, "''");

    sqlLines.push(
      `INSERT INTO properties (`,
      `  id, title_en, title_ar, description_en, description_ar,`,
      `  purpose, category, property_type, price, area_sqm,`,
      `  bedrooms, bathrooms, floor_level, finishing_type,`,
      `  delivery_status, delivery_year, payment_type, down_payment,`,
      `  installment_years, monthly_installment, city, district,`,
      `  compound, developer, address, lat, lng, aqar_score,`,
      `  images_json, amenities_json, featured, status, views_count`,
      `) VALUES (`,
      `  ${p.id}, '${esc(p.titleEn)}', '${esc(p.titleAr)}', '${esc(p.descEn)}', '${esc(p.descAr)}',`,
      `  '${p.purpose}', '${p.category}', '${p.propertyType}', ${p.price}, ${p.areaSqm},`,
      `  ${p.bedrooms}, ${p.bathrooms}, ${p.floorLevel}, '${p.finishingType}',`,
      `  '${p.deliveryStatus}', ${p.deliveryYear}, '${p.paymentType}', ${p.downPayment},`,
      `  ${p.installmentYears}, ${p.monthlyInstallment}, '${esc(p.city)}', '${esc(p.district)}',`,
      `  '${esc(p.compound)}', '${esc(p.developer)}', '${esc(p.address)}', ${p.lat}, ${p.lng}, ${p.aqarScore},`,
      `  '${imagesJson}'::jsonb, '${amenitiesJson}'::jsonb, ${p.featured ? 'TRUE' : 'FALSE'}, '${p.status}', ${p.viewsCount}`,
      `) ON CONFLICT (id) DO UPDATE SET`,
      `  title_en = EXCLUDED.title_en,`,
      `  title_ar = EXCLUDED.title_ar,`,
      `  price = EXCLUDED.price,`,
      `  down_payment = EXCLUDED.down_payment,`,
      `  installment_years = EXCLUDED.installment_years,`,
      `  monthly_installment = EXCLUDED.monthly_installment,`,
      `  developer = EXCLUDED.developer,`,
      `  images_json = EXCLUDED.images_json,`,
      `  updated_at = CURRENT_TIMESTAMP;`,
      ``
    );
  }

  const sqlFilePath = path.join(__dirname, 'seed_nawy_all_primary.sql');
  fs.writeFileSync(sqlFilePath, sqlLines.join('\n'), 'utf8');
  console.log(`💾 Generated SQL migration file: ${sqlFilePath}`);

  const jsonFilePath = path.join(__dirname, 'nawy_primary_properties.json');
  fs.writeFileSync(jsonFilePath, JSON.stringify(processedProperties, null, 2), 'utf8');
  console.log(`💾 Saved JSON dataset: ${jsonFilePath}`);

  // Save developers to client
  const clientDevsPath = path.resolve(__dirname, '../client/src/data/nawyDevelopers.json');
  fs.writeFileSync(clientDevsPath, JSON.stringify(allDevelopersList, null, 2), 'utf8');
  console.log(`💾 Saved Client Developers Directory: ${clientDevsPath}`);

  console.log('🎉 Done! Ready to migrate production database and client.');
}

run().catch(err => {
  console.error('❌ Pipeline failed:', err);
  process.exit(1);
});
