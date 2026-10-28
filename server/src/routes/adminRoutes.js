import express from 'express';
import pool from '../db.js';

const router = express.Router();

// 1. Get Admin Dashboard Live Stats (Real database metrics, zero fake fallbacks)
router.get('/stats', async (req, res) => {
  try {
    const { rows: propsRows } = await pool.query('SELECT COUNT(*) as total FROM properties');
    const { rows: usersRows } = await pool.query('SELECT COUNT(*) as total FROM users');
    const { rows: valsRows } = await pool.query('SELECT COUNT(*) as total FROM valuations');
    const { rows: mortgagesRows } = await pool.query('SELECT COUNT(*) as total FROM mortgage_inquiries');
    const { rows: leadsRows } = await pool.query('SELECT COUNT(*) as total FROM leads_inquiries');
    const { rows: fastSellRows } = await pool.query('SELECT COUNT(*) as total FROM fast_sell_requests');
    const { rows: exchangeRows } = await pool.query('SELECT COUNT(*) as total FROM property_exchange_requests');
    const { rows: managementRows } = await pool.query('SELECT COUNT(*) as total FROM property_management_contracts');

    res.json({
      success: true,
      stats: {
        totalProperties: parseInt(propsRows[0].total, 10),
        totalUsers: parseInt(usersRows[0].total, 10),
        totalValuations: parseInt(valsRows[0].total, 10),
        totalMortgageInquiries: parseInt(mortgagesRows[0].total, 10),
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

// 3. Update Location Benchmark Prices
router.put('/benchmarks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { avg_price_sqm, min_price_sqm, max_price_sqm, rental_yield_pct, annual_growth_pct } = req.body;

    const { rowCount } = await pool.query(
      `UPDATE location_benchmarks 
       SET avg_price_sqm = $1, min_price_sqm = $2, max_price_sqm = $3, rental_yield_pct = $4, annual_growth_pct = $5 
       WHERE id = $6`,
      [avg_price_sqm, min_price_sqm, max_price_sqm, rental_yield_pct, annual_growth_pct, id]
    );

    if (rowCount === 0) {
      return res.status(404).json({ error: true, message: 'Benchmark not found' });
    }

    res.json({ success: true, message: 'Benchmark price updated successfully' });
  } catch (err) {
    console.error('Update benchmark error:', err);
    res.status(500).json({ error: true, message: 'Update failed: ' + err.message });
  }
});

// 4. Get All Valuations (Admin view)
router.get('/valuations', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM valuations ORDER BY id DESC LIMIT 50');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('Fetch admin valuations error:', err);
    res.status(500).json({ error: true, message: 'Failed to retrieve valuations: ' + err.message });
  }
});

// 5. Get All Mortgage Inquiries (Admin view)
router.get('/mortgages', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM mortgage_inquiries ORDER BY id DESC LIMIT 50');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('Fetch admin mortgages error:', err);
    res.status(500).json({ error: true, message: 'Failed to retrieve mortgage inquiries: ' + err.message });
  }
});

// 6. Get All Leads & Inquiries (Admin view)
router.get('/leads', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM leads_inquiries ORDER BY id DESC LIMIT 50');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('Fetch admin leads error:', err);
    res.status(500).json({ error: true, message: 'Failed to retrieve leads: ' + err.message });
  }
});

export default router;
