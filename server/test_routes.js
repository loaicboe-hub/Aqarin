// ====================================================================
// AQAR IN — End-to-End PostgreSQL & PostGIS Route Verification Suite
// ====================================================================

const BASE_URL = 'http://127.0.0.1:5000/api';

async function runTests() {
  console.log('=== STARTING POSTGRESQL & POSTGIS ENDPOINT VERIFICATION ===\n');
  const results = [];

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      results.push({ name, status: 'PASS' });
    } catch (err) {
      console.error(`❌ FAIL: ${name} ->`, err.message);
      results.push({ name, status: 'FAIL', error: err.message });
    }
  }

  // 1. Health check
  await test('GET /api/health (Reports PostgreSQL 16 & PostGIS)', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    const json = await res.json();
    if (!res.ok || json.database !== 'PostgreSQL 16 + PostGIS') {
      throw new Error(`Unexpected health response: ${JSON.stringify(json)}`);
    }
  });

  // 2. Fetch properties
  await test('GET /api/properties (Fetches properties with parsed JSON)', async () => {
    const res = await fetch(`${BASE_URL}/properties`);
    const json = await res.json();
    if (!res.ok || !json.success || json.count !== 5) {
      throw new Error(`Expected count: 5, got ${json.count}`);
    }
    const first = json.data[0];
    if (!Array.isArray(first.images) || !Array.isArray(first.amenities)) {
      throw new Error('images or amenities not properly parsed into Array');
    }
  });

  // 3. Fetch single property
  await test('GET /api/properties/1 (Fetches single listing + similar)', async () => {
    const res = await fetch(`${BASE_URL}/properties/1`);
    const json = await res.json();
    if (!res.ok || !json.success || json.data.id !== 1) {
      throw new Error(`Failed to retrieve property 1: ${JSON.stringify(json)}`);
    }
    if (!Array.isArray(json.similar)) {
      throw new Error('similar properties not an array');
    }
  });

  // 4. PostGIS radius query
  await test('GET /api/properties (PostGIS ST_DWithin 15km Radius in Meters)', async () => {
    // Search around AUC New Cairo (lat: 30.0167, lng: 31.4833) within 15,000 meters
    const res = await fetch(`${BASE_URL}/properties?lat=30.0167&lng=31.4833&radiusMeters=15000`);
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(`PostGIS radius query failed: ${JSON.stringify(json)}`);
    }
    // Should match Mivida (id 1) which is right at those coordinates
    const ids = json.data.map(p => p.id);
    if (!ids.includes(1)) {
      throw new Error(`Expected property 1 in radius results, got ids: ${ids}`);
    }
    // Should NOT match Ras El Hekma (id 3) which is 370km away
    if (ids.includes(3)) {
      throw new Error('Ras El Hekma (370km away) erroneously included in 15km radius!');
    }
  });

  // 5. PostGIS viewport bounding box query
  await test('GET /api/properties (PostGIS && ST_MakeEnvelope Bounding Box)', async () => {
    // Greater Cairo bounding box
    const res = await fetch(`${BASE_URL}/properties?minLng=30.8&minLat=29.8&maxLng=31.8&maxLat=30.2`);
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(`PostGIS bbox query failed: ${JSON.stringify(json)}`);
    }
    const ids = json.data.map(p => p.id);
    // Should include Cairo properties (1, 2, 4, 5) but NOT North Coast (3)
    if (!ids.includes(1) || ids.includes(3)) {
      throw new Error(`Bounding box filtering incorrect, got ids: ${ids}`);
    }
  });

  // 6. User Login with real bcrypt hash
  let authToken = null;
  await test('POST /api/auth/login (Authenticates against PostgreSQL bcrypt hash)', async () => {
    // 1. Rejects wrong password
    const wrongRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@aqarin.com', password: 'wrongpassword' })
    });
    if (wrongRes.status !== 401) {
      throw new Error(`Expected 401 for wrong password, got ${wrongRes.status}`);
    }

    // 2. Accepts real admin123 password
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@aqarin.com', password: 'admin123' })
    });
    const json = await res.json();
    if (!res.ok || !json.success || !json.token || json.user.role !== 'admin') {
      throw new Error(`Admin login failed: ${JSON.stringify(json)}`);
    }
    authToken = json.token;
  });

  // 7. Register new user in PostgreSQL
  const testEmail = `test_pg_${Date.now()}@aqarin.com`;
  await test('POST /api/auth/register (Creates new user in PostgreSQL with RETURNING id)', async () => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Postgres Test User',
        email: testEmail,
        password: 'SecurePass2026!',
        role: 'buyer'
      })
    });
    const json = await res.json();
    if (res.status !== 201 || !json.success || !json.token) {
      throw new Error(`Registration failed: ${JSON.stringify(json)}`);
    }
    authToken = json.token;
  });

  // 8. Login with the newly registered user
  await test('POST /api/auth/login (Authenticates new user from PostgreSQL)', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'SecurePass2026!' })
    });
    const json = await res.json();
    if (!res.ok || !json.success || !json.token) {
      throw new Error(`Login failed: ${JSON.stringify(json)}`);
    }
    authToken = json.token;
  });

  // 9. Get current profile
  await test('GET /api/auth/me (Returns user profile with valid JWT)', async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const json = await res.json();
    if (!res.ok || !json.success || json.user.email !== testEmail) {
      throw new Error(`Me endpoint failed: ${JSON.stringify(json)}`);
    }
  });

  // Clean up temporary test user immediately
  await test('CLEANUP: Remove temporary registration test user', async () => {
    const { default: pool } = await import('./src/db.js');
    await pool.query('DELETE FROM users WHERE email = $1', [testEmail]);
  });

  // 10. Admin Stats (Total users must strictly equal 1: admin only)
  await test('GET /api/admin/stats (Returns real live PostgreSQL counts with 1 admin user)', async () => {
    const res = await fetch(`${BASE_URL}/admin/stats`);
    const json = await res.json();
    if (!res.ok || !json.success || typeof json.stats.totalProperties !== 'number') {
      throw new Error(`Admin stats failed: ${JSON.stringify(json)}`);
    }
    if (json.stats.totalUsers !== 1) {
      throw new Error(`Expected exactly 1 admin user, got ${json.stats.totalUsers}`);
    }
    if (json.stats.totalProperties < 5) {
      throw new Error(`Expected at least 5 properties, got ${json.stats.totalProperties}`);
    }
  });

  // 11. Admin Users list
  await test('GET /api/admin/users (Returns only authorized admin account)', async () => {
    const res = await fetch(`${BASE_URL}/admin/users`);
    const json = await res.json();
    if (!res.ok || !json.success || json.count !== 1 || json.data[0].email !== 'admin@aqarin.com') {
      throw new Error(`Expected only 1 admin user, got: ${JSON.stringify(json)}`);
    }
  });

  // 12. Admin Benchmarks
  await test('GET /api/admin/benchmarks (Returns 16 location benchmarks)', async () => {
    const res = await fetch(`${BASE_URL}/admin/benchmarks`);
    const json = await res.json();
    if (!res.ok || !json.success || json.count !== 16) {
      throw new Error(`Expected 16 benchmarks, got ${json.count}`);
    }
  });

  // 12. Verification: Removed Valuation Endpoints Return 404
  await test('CONFIRM 404: POST /api/valuation/instant returns 404 Not Found', async () => {
    const res = await fetch(`${BASE_URL}/valuation/instant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city: 'Cairo', district: 'New Cairo' })
    });
    if (res.status !== 404) {
      throw new Error(`Expected 404 for removed valuation route, got: ${res.status}`);
    }
  });

  // 13. Verification: Removed Mortgage Endpoints Return 404
  await test('CONFIRM 404: GET /api/mortgage/banks and POST /api/mortgage/calculate return 404', async () => {
    const res1 = await fetch(`${BASE_URL}/mortgage/banks`);
    const res2 = await fetch(`${BASE_URL}/mortgage/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyPrice: 5000000 })
    });
    if (res1.status !== 404 || res2.status !== 404) {
      throw new Error(`Expected 404 for removed mortgage routes, got: ${res1.status}, ${res2.status}`);
    }
  });

  // 14. Verification: Removed Admin Valuation & Mortgage Endpoints Return 404
  await test('CONFIRM 404: GET /api/admin/valuations and GET /api/admin/mortgages return 404', async () => {
    const res1 = await fetch(`${BASE_URL}/admin/valuations`);
    const res2 = await fetch(`${BASE_URL}/admin/mortgages`);
    if (res1.status !== 404 || res2.status !== 404) {
      throw new Error(`Expected 404 for removed admin routes, got: ${res1.status}, ${res2.status}`);
    }
  });

  // 15. Upload up to 5 property images
  let uploadedImageUrls = [];
  await test('POST /api/upload/multiple (Uploads up to 5 images for properties)', async () => {
    const formData = new FormData();
    for (let i = 1; i <= 3; i++) {
      const dummyBlob = new Blob(['fake image content ' + i], { type: 'image/jpeg' });
      formData.append('images', dummyBlob, `test-image-${i}.jpg`);
    }

    const res = await fetch(`${BASE_URL}/upload/multiple`, {
      method: 'POST',
      body: formData
    });
    const json = await res.json();
    if (!res.ok || !json.success || json.count !== 3 || !Array.isArray(json.urls)) {
      throw new Error(`Multiple image upload failed: ${JSON.stringify(json)}`);
    }
    uploadedImageUrls = json.urls;
  });

  // 16. Lead Inquiry
  await test('POST /api/leads/property-inquiry (Inserts lead into PostgreSQL)', async () => {
    const res = await fetch(`${BASE_URL}/leads/property-inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        propertyId: 1,
        name: 'Sara Tawfik',
        phone: '+201055556666',
        email: 'sara@example.com',
        message: 'Can I schedule a visit this Friday?'
      })
    });
    const json = await res.json();
    if (res.status !== 201 || !json.success || !json.inquiryId) {
      throw new Error(`Property lead failed: ${JSON.stringify(json)}`);
    }
  });

  // 16. Fast Sell Request
  await test('POST /api/services/fast-sell (Inserts fast sell request into PostgreSQL)', async () => {
    const res = await fetch(`${BASE_URL}/services/fast-sell`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        city: 'Cairo',
        district: 'New Cairo',
        compound: 'Mivida',
        propertyType: 'apartment',
        areaSqm: 180,
        finishingType: 'fully_finished',
        expectedPrice: 12000000,
        ownerName: 'Tarek Zaki',
        phone: '+201077778888',
        urgentReason: 'cash_liquidity'
      })
    });
    const json = await res.json();
    if (res.status !== 201 || !json.success || !json.requestId) {
      throw new Error(`Fast sell failed: ${JSON.stringify(json)}`);
    }
  });

  // 17. Property Exchange Request
  await test('POST /api/services/exchange (Inserts property swap into PostgreSQL)', async () => {
    const res = await fetch(`${BASE_URL}/services/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        offeringSpecs: '2BR 120 sqm apartment in Sheikh Zayed',
        seekingSpecs: '3BR villa in New Cairo with difference in cash',
        phone: '+201088889999'
      })
    });
    const json = await res.json();
    if (res.status !== 201 || !json.success || !json.exchangeId) {
      throw new Error(`Exchange request failed: ${JSON.stringify(json)}`);
    }
  });

  // 18. Property Management Request
  await test('POST /api/services/management (Inserts management contract into PostgreSQL)', async () => {
    const res = await fetch(`${BASE_URL}/services/management`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planType: 'premium_full_management',
        ownerName: 'Khaled Fahmy',
        phone: '+201099990000',
        city: 'Giza',
        compound: 'Allegria'
      })
    });
    const json = await res.json();
    if (res.status !== 201 || !json.success || !json.contractId) {
      throw new Error(`Management request failed: ${JSON.stringify(json)}`);
    }
  });

  // 19. Favorites in Database
  await test('POST /api/services/favorites & GET /api/services/favorites/:userId', async () => {
    const saveRes = await fetch(`${BASE_URL}/services/favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 1, propertyId: 1 })
    });
    const saveJson = await saveRes.json();
    if (!saveRes.ok || !saveJson.success) throw new Error('Save favorite failed');

    const getRes = await fetch(`${BASE_URL}/services/favorites/1`);
    const getJson = await getRes.json();
    if (!getRes.ok || !getJson.success || getJson.count < 1) {
      throw new Error('Get favorites failed');
    }
  });

  console.log('\n======================================================');
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log(`TOTAL TESTS: ${results.length} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('======================================================');

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
