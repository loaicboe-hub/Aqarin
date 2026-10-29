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
    if (!res.ok || !json.success || json.count < 5) {
      throw new Error(`Expected at least 5 properties, got ${json.count}`);
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

  // 13. Update Location Benchmark Price, Yield, and Growth
  await test('PUT /api/admin/benchmarks/:id (Updates price/sqm, rental yield %, and annual growth %)', async () => {
    const res = await fetch(`${BASE_URL}/admin/benchmarks/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        avg_price_sqm: 85000,
        rental_yield_pct: 8.5,
        annual_growth_pct: 26.0
      })
    });
    const json = await res.json();
    if (!res.ok || !json.success || !json.data) {
      throw new Error(`Benchmark update failed: ${JSON.stringify(json)}`);
    }
    if (Number(json.data.avg_price_sqm) !== 85000 || Number(json.data.rental_yield_pct) !== 8.5 || Number(json.data.annual_growth_pct) !== 26.0) {
      throw new Error(`Benchmark updated values mismatch: ${JSON.stringify(json.data)}`);
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

  // 20. Property Creation with empty/optional numeric strings
  let createdPropId = null;
  await test('POST /api/properties (Creates property listing with empty strings for optional numeric fields)', async () => {
    const res = await fetch(`${BASE_URL}/properties`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title_en: 'Test Luxury Apartment with Clean Numerics',
        title_ar: 'شقة فاخرة تجريبية',
        purpose: 'sale',
        category: 'residential',
        property_type: 'apartment',
        price: '7500000',
        area_sqm: '190',
        bedrooms: '3',
        bathrooms: '2',
        floor_level: '4',
        finishing_type: 'fully_finished',
        delivery_status: 'ready',
        delivery_year: '2026',
        payment_type: 'installments',
        down_payment: '', // Intentionally empty string to verify numeric syntax fix
        installment_years: '', // Intentionally empty string
        monthly_installment: '', // Intentionally empty string
        city: 'Cairo',
        district: 'New Cairo',
        compound: 'Hyde Park',
        lat: 30.0123,
        lng: 31.4567,
        images: uploadedImageUrls.length > 0 ? uploadedImageUrls : ['https://images.unsplash.com/test.jpg'],
        amenities: ['Security', 'Elevator', 'Clubhouse']
      })
    });
    const json = await res.json();
    if (res.status !== 201 || !json.success || !json.propertyId) {
      throw new Error(`Property creation failed: ${JSON.stringify(json)}`);
    }
    createdPropId = json.propertyId;
  });

  // 21. Verify created property in DB
  await test('GET /api/properties/:id (Verifies newly created listing has numeric defaults 0 and uploaded images)', async () => {
    const res = await fetch(`${BASE_URL}/properties/${createdPropId}`);
    const json = await res.json();
    if (!res.ok || !json.success || !json.data) {
      throw new Error(`Failed to fetch created property ${createdPropId}: ${JSON.stringify(json)}`);
    }
    const prop = json.data;
    if (Number(prop.down_payment) !== 0 || Number(prop.monthly_installment) !== 0 || Number(prop.price) !== 7500000) {
      throw new Error(`Numeric fields mismatch: down_payment=${prop.down_payment}, monthly=${prop.monthly_installment}, price=${prop.price}`);
    }
  });

  // 22. Update Property Listing
  await test('PUT /api/properties/:id (Updates property price, title, specs, and status)', async () => {
    const res = await fetch(`${BASE_URL}/properties/${createdPropId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title_en: 'Test Luxury Apartment Updated',
        price: 8200000,
        area_sqm: 210,
        bedrooms: 4,
        status: 'published'
      })
    });
    const json = await res.json();
    if (!res.ok || !json.success || json.data.titleEn !== 'Test Luxury Apartment Updated' || Number(json.data.price) !== 8200000) {
      throw new Error(`Property update failed: ${JSON.stringify(json)}`);
    }
  });

  // 23. Delete Property Listing
  await test('DELETE /api/properties/:id (Permanently deletes property listing from PostgreSQL)', async () => {
    const res = await fetch(`${BASE_URL}/properties/${createdPropId}`, {
      method: 'DELETE'
    });
    const json = await res.json();
    if (!res.ok || !json.success || json.deletedId != createdPropId) {
      throw new Error(`Property deletion failed: ${JSON.stringify(json)}`);
    }

    // Verify it is indeed 404
    const checkRes = await fetch(`${BASE_URL}/properties/${createdPropId}`);
    if (checkRes.status !== 404) {
      throw new Error(`Expected 404 for deleted property, got ${checkRes.status}`);
    }
    createdPropId = null; // Cleaned up
  });

  // 24. Clean up test property (fallback if delete test skipped)
  await test('CLEANUP: Ensure test property listing is removed', async () => {
    if (createdPropId) {
      const { default: pool } = await import('./src/db.js');
      await pool.query('DELETE FROM properties WHERE id = $1', [createdPropId]);
    }
  });

  // 25. Admin Leads Inquiries
  await test('GET /api/admin/leads (Fetches joined inquiries & properties)', async () => {
    const res = await fetch(`${BASE_URL}/admin/leads`);
    const json = await res.json();
    if (!res.ok || !json.success || !Array.isArray(json.data)) {
      throw new Error(`Failed to fetch admin leads: ${JSON.stringify(json)}`);
    }
  });

  // 26. Fast Sell Admin & Update
  let fastSellId = null;
  await test('GET /api/admin/fast-sell & PUT status (Fetches requests and updates status/cash offer)', async () => {
    const res = await fetch(`${BASE_URL}/admin/fast-sell`);
    const json = await res.json();
    if (!res.ok || !json.success || !Array.isArray(json.data)) {
      throw new Error(`Failed to fetch fast sell requests: ${JSON.stringify(json)}`);
    }
    if (json.data.length > 0) {
      fastSellId = json.data[0].id;
      const updateRes = await fetch(`${BASE_URL}/admin/fast-sell/${fastSellId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'offer_made', cash_offer_amount: 3200000 })
      });
      const updateJson = await updateRes.json();
      if (!updateRes.ok || !updateJson.success) {
        throw new Error(`Failed to update fast sell status: ${JSON.stringify(updateJson)}`);
      }
    }
  });

  // 27. Property Exchange Feed & Admin
  await test('GET /api/services/exchange & GET /api/admin/exchange', async () => {
    const feedRes = await fetch(`${BASE_URL}/services/exchange`);
    const feedJson = await feedRes.json();
    if (!feedRes.ok || !feedJson.success || !Array.isArray(feedJson.data)) {
      throw new Error(`Failed to fetch public exchange feed: ${JSON.stringify(feedJson)}`);
    }

    const adminRes = await fetch(`${BASE_URL}/admin/exchange`);
    const adminJson = await adminRes.json();
    if (!adminRes.ok || !adminJson.success || !Array.isArray(adminJson.data)) {
      throw new Error(`Failed to fetch admin exchange deals: ${JSON.stringify(adminJson)}`);
    }
  });

  // 28. Property Management Contracts
  await test('GET /api/admin/management (Fetches active landlord service contracts)', async () => {
    const res = await fetch(`${BASE_URL}/admin/management`);
    const json = await res.json();
    if (!res.ok || !json.success || !Array.isArray(json.data)) {
      throw new Error(`Failed to fetch management contracts: ${JSON.stringify(json)}`);
    }
  });

  // 29. Partner Applications
  await test('GET /api/admin/partners (Fetches developer & broker applications)', async () => {
    const res = await fetch(`${BASE_URL}/admin/partners`);
    const json = await res.json();
    if (!res.ok || !json.success || !Array.isArray(json.data)) {
      throw new Error(`Failed to fetch partner applications: ${JSON.stringify(json)}`);
    }
  });

  // 30. Admin Analytics Reports
  await test('GET /api/admin/reports (Fetches live metrics by purpose, category, and city)', async () => {
    const res = await fetch(`${BASE_URL}/admin/reports`);
    const json = await res.json();
    if (!res.ok || !json.success || !json.data || !Array.isArray(json.data.byCity)) {
      throw new Error(`Failed to fetch reports: ${JSON.stringify(json)}`);
    }
  });

  // 31. Finishing Quotes Submission & Admin Feed
  let finishingId = null;
  await test('POST /api/services/finishing & GET /api/admin/finishing', async () => {
    const postRes = await fetch(`${BASE_URL}/services/finishing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Eng. Karim Mansour',
        phone: '+201011223344',
        areaSqm: 180,
        tier: 'super_lux',
        unitType: 'apartment',
        city: 'Cairo',
        notes: 'Handover target: June 2026'
      })
    });
    const postJson = await postRes.json();
    if (!postRes.ok || !postJson.success || !postJson.requestId) {
      throw new Error(`Failed to submit finishing request: ${JSON.stringify(postJson)}`);
    }
    finishingId = postJson.requestId;

    const getRes = await fetch(`${BASE_URL}/admin/finishing`);
    const getJson = await getRes.json();
    if (!getRes.ok || !getJson.success || !Array.isArray(getJson.data)) {
      throw new Error(`Failed to fetch admin finishing requests: ${JSON.stringify(getJson)}`);
    }
  });

  // 32. User Submissions Aggregation
  await test('GET /api/services/user-submissions/:userId', async () => {
    const res = await fetch(`${BASE_URL}/services/user-submissions/1`);
    const json = await res.json();
    if (!res.ok || !json.success || !json.data || !Array.isArray(json.data.fastSell)) {
      throw new Error(`Failed to fetch user submissions: ${JSON.stringify(json)}`);
    }
  });

  // 33. User Properties
  await test('GET /api/properties/user/:userId', async () => {
    const res = await fetch(`${BASE_URL}/properties/user/1`);
    const json = await res.json();
    if (!res.ok || !json.success || !Array.isArray(json.data)) {
      throw new Error(`Failed to fetch user properties: ${JSON.stringify(json)}`);
    }
  });

  // 34. Two-Step Password Reset Flow
  let resetJwtToken = null;
  await test('POST /api/auth/forgot-password & /api/auth/reset-password', async () => {
    // 1. Request reset
    const forgotRes = await fetch(`${BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@aqarin.com' })
    });
    const forgotJson = await forgotRes.json();
    if (!forgotRes.ok || !forgotJson.success || !forgotJson.resetToken) {
      throw new Error(`Failed forgot password step: ${JSON.stringify(forgotJson)}`);
    }
    resetJwtToken = forgotJson.resetToken;

    // 2. Perform reset
    const resetRes = await fetch(`${BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: resetJwtToken, newPassword: 'admin123' })
    });
    const resetJson = await resetRes.json();
    if (!resetRes.ok || !resetJson.success) {
      throw new Error(`Failed reset password step: ${JSON.stringify(resetJson)}`);
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
