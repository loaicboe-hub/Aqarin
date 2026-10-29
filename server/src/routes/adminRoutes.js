import express from 'express';
import pool from '../db.js';

const router = express.Router();

// 1. Get Admin Dashboard Live Stats (Real database metrics, zero fake fallbacks)
router.get('/stats', async (req, res) => {
  try {
    const { rows: propsRows } = await pool.query('SELECT COUNT(*) as total FROM properties');
    const { rows: usersRows } = await pool.query('SELECT COUNT(*) as total FROM users');
    const { rows: leadsRows } = await pool.query('SELECT COUNT(*) as total FROM leads_inquiries');
    const { rows: fastSellRows } = await pool.query('SELECT COUNT(*) as total FROM fast_sell_requests');
    const { rows: exchangeRows } = await pool.query('SELECT COUNT(*) as total FROM property_exchange_requests');
    const { rows: managementRows } = await pool.query('SELECT COUNT(*) as total FROM property_management_contracts');

    res.json({
      success: true,
      stats: {
        totalProperties: parseInt(propsRows[0].total, 10),
        totalUsers: parseInt(usersRows[0].total, 10),
        totalLeads: parseInt(leadsRows[0].total, 10),
        totalFastSellRequests: parseInt(fastSellRows[0].total, 10),
        totalExchangeRequests: parseInt(exchangeRows[0].total, 10),
        totalManagementContracts: parseInt(managementRows[0].total, 10)
      }
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    // Honest error reporting — no fake numbers or demo fallbacks
    res.status(500).json({
      error: true,
      message: 'Failed to retrieve administrative statistics: ' + err.message
    });
  }
});

// 2. Get All Location Benchmarks (Live data for admin benchmark sliders)
router.get('/benchmarks', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, city_en, city_ar, district_en, district_ar, compound_en, compound_ar, avg_price_sqm, min_price_sqm, max_price_sqm, rental_yield_pct, annual_growth_pct, lat, lng FROM location_benchmarks ORDER BY city_en, district_en'
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('Fetch benchmarks error:', err);
    res.status(500).json({ error: true, message: 'Failed to retrieve benchmarks: ' + err.message });
  }
});

// 3. Update Location Benchmark Prices & Investment Metrics (Price/sqm, Rental Yield %, Annual Growth %)
router.put('/benchmarks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { avg_price_sqm, min_price_sqm, max_price_sqm, rental_yield_pct, annual_growth_pct } = req.body;

    const numAvgPrice = avg_price_sqm !== undefined && avg_price_sqm !== '' ? Number(avg_price_sqm) : null;
    const numMinPrice = min_price_sqm !== undefined && min_price_sqm !== '' ? Number(min_price_sqm) : (numAvgPrice ? Math.round(numAvgPrice * 0.88) : null);
    const numMaxPrice = max_price_sqm !== undefined && max_price_sqm !== '' ? Number(max_price_sqm) : (numAvgPrice ? Math.round(numAvgPrice * 1.25) : null);
    const numYield = rental_yield_pct !== undefined && rental_yield_pct !== '' ? Number(rental_yield_pct) : null;
    const numGrowth = annual_growth_pct !== undefined && annual_growth_pct !== '' ? Number(annual_growth_pct) : null;

    const { rowCount, rows } = await pool.query(
      `UPDATE location_benchmarks 
       SET avg_price_sqm = COALESCE($1, avg_price_sqm), 
           min_price_sqm = COALESCE($2, min_price_sqm), 
           max_price_sqm = COALESCE($3, max_price_sqm), 
           rental_yield_pct = COALESCE($4, rental_yield_pct), 
           annual_growth_pct = COALESCE($5, annual_growth_pct) 
       WHERE id = $6
       RETURNING id, city_en, city_ar, district_en, district_ar, compound_en, compound_ar, avg_price_sqm, min_price_sqm, max_price_sqm, rental_yield_pct, annual_growth_pct`,
      [numAvgPrice, numMinPrice, numMaxPrice, numYield, numGrowth, id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: true, message: 'Benchmark not found' });
    }

    res.json({ success: true, message: 'Benchmark updated successfully', data: rows[0] });
  } catch (err) {
    console.error('Update benchmark error:', err);
    res.status(500).json({ error: true, message: 'Update failed: ' + err.message });
  }
});

// 4. Get All Leads & Inquiries (Admin view with property details)
router.get('/leads', async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT l.*, p.title_en as property_title_en, p.title_ar as property_title_ar, p.price as property_price, p.city as property_city, p.district as property_district
      FROM leads_inquiries l
      LEFT JOIN properties p ON l.property_id = p.id
      ORDER BY l.id DESC
      LIMIT 100
    `);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('Fetch admin leads error:', err);
    res.status(500).json({ error: true, message: 'Failed to retrieve leads: ' + err.message });
  }
});

// 5. Get All Users (Admin view)
router.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, email, full_name, phone, role, created_at FROM users ORDER BY id ASC');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('Fetch admin users error:', err);
    res.status(500).json({ error: true, message: 'Failed to retrieve users: ' + err.message });
  }
});

// 6. Fast Sell Requests (Admin view & Status Update)
router.get('/fast-sell', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM fast_sell_requests ORDER BY id DESC LIMIT 100');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('Fetch admin fast sell error:', err);
    res.status(500).json({ error: true, message: 'Failed to retrieve fast sell requests: ' + err.message });
  }
});

router.put('/fast-sell/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, cash_offer_amount } = req.body;
    const { rows, rowCount } = await pool.query(
      `UPDATE fast_sell_requests 
       SET status = COALESCE($1, status), cash_offer_amount = COALESCE($2, cash_offer_amount) 
       WHERE id = $3 
       RETURNING *`,
      [status || null, cash_offer_amount !== undefined && cash_offer_amount !== '' ? Number(cash_offer_amount) : null, id]
    );
    if (rowCount === 0) return res.status(404).json({ error: true, message: 'Request not found' });
    res.json({ success: true, message: 'Status updated successfully', data: rows[0] });
  } catch (err) {
    console.error('Update fast sell status error:', err);
    res.status(500).json({ error: true, message: 'Update failed: ' + err.message });
  }
});

// 7. Property Exchange Requests (Admin view & Status Update)
router.get('/exchange', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM property_exchange_requests ORDER BY id DESC LIMIT 100');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('Fetch admin exchange error:', err);
    res.status(500).json({ error: true, message: 'Failed to retrieve exchange requests: ' + err.message });
  }
});

router.put('/exchange/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { rows, rowCount } = await pool.query(
      'UPDATE property_exchange_requests SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (rowCount === 0) return res.status(404).json({ error: true, message: 'Request not found' });
    res.json({ success: true, message: 'Status updated successfully', data: rows[0] });
  } catch (err) {
    console.error('Update exchange status error:', err);
    res.status(500).json({ error: true, message: 'Update failed: ' + err.message });
  }
});

// 8. Property Management Contracts (Admin view & Status Update)
router.get('/management', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM property_management_contracts ORDER BY id DESC LIMIT 100');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('Fetch admin management error:', err);
    res.status(500).json({ error: true, message: 'Failed to retrieve management contracts: ' + err.message });
  }
});

router.put('/management/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { rows, rowCount } = await pool.query(
      'UPDATE property_management_contracts SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (rowCount === 0) return res.status(404).json({ error: true, message: 'Contract not found' });
    res.json({ success: true, message: 'Status updated successfully', data: rows[0] });
  } catch (err) {
    console.error('Update management status error:', err);
    res.status(500).json({ error: true, message: 'Update failed: ' + err.message });
  }
});

// 9. Partner Applications (Admin view & Status Update)
router.get('/partners', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM partner_applications ORDER BY id DESC LIMIT 100');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('Fetch admin partners error:', err);
    res.status(500).json({ error: true, message: 'Failed to retrieve partner applications: ' + err.message });
  }
});

router.put('/partners/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { rows, rowCount } = await pool.query(
      'UPDATE partner_applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (rowCount === 0) return res.status(404).json({ error: true, message: 'Application not found' });
    res.json({ success: true, message: 'Status updated successfully', data: rows[0] });
  } catch (err) {
    console.error('Update partner status error:', err);
    res.status(500).json({ error: true, message: 'Update failed: ' + err.message });
  }
});

// 10. Finishing Requests (Admin view & Status Update)
router.get('/finishing', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM finishing_requests ORDER BY id DESC LIMIT 100');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('Fetch admin finishing error:', err);
    res.status(500).json({ error: true, message: 'Failed to retrieve finishing requests: ' + err.message });
  }
});

router.put('/finishing/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { rows, rowCount } = await pool.query(
      'UPDATE finishing_requests SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (rowCount === 0) return res.status(404).json({ error: true, message: 'Request not found' });
    res.json({ success: true, message: 'Status updated successfully', data: rows[0] });
  } catch (err) {
    console.error('Update finishing status error:', err);
    res.status(500).json({ error: true, message: 'Update failed: ' + err.message });
  }
});

// 11. Reports & Analytics Summary (Live metrics)
router.get('/reports', async (req, res) => {
  try {
    const [purposeRes, categoryRes, cityRes, fastSellSum, leadsTypeRes, priceStatsRes] = await Promise.all([
      pool.query('SELECT purpose, count(*)::int as count FROM properties GROUP BY purpose'),
      pool.query('SELECT category, count(*)::int as count FROM properties GROUP BY category'),
      pool.query('SELECT city, count(*)::int as count FROM properties GROUP BY city ORDER BY count DESC LIMIT 6'),
      pool.query('SELECT count(*)::int as total_requests, COALESCE(sum(expected_price), 0)::numeric as total_volume, COALESCE(avg(expected_price), 0)::numeric as avg_price FROM fast_sell_requests'),
      pool.query('SELECT inquiry_type, count(*)::int as count FROM leads_inquiries GROUP BY inquiry_type'),
      pool.query('SELECT MIN(price)::numeric as min_price, MAX(price)::numeric as max_price, AVG(price)::numeric as avg_price, AVG(area_sqm)::int as avg_area FROM properties')
    ]);

    res.json({
      success: true,
      data: {
        byPurpose: purposeRes.rows,
        byCategory: categoryRes.rows,
        byCity: cityRes.rows,
        fastSellSummary: fastSellSum.rows[0],
        byInquiryType: leadsTypeRes.rows,
        priceStats: priceStatsRes.rows[0]
      }
    });
  } catch (err) {
    console.error('Reports error:', err);
    res.status(500).json({ error: true, message: 'Failed to generate reports: ' + err.message });
  }
});

export default router;
