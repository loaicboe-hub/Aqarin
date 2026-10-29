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

// 4. Get All Leads & Inquiries (Admin view)
router.get('/leads', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM leads_inquiries ORDER BY id DESC LIMIT 50');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('Fetch admin leads error:', err);
    res.status(500).json({ error: true, message: 'Failed to retrieve leads: ' + err.message });
  }
});

// 5. Get All Users (Admin view)
router.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, email, full_name, role, created_at FROM users ORDER BY id ASC');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('Fetch admin users error:', err);
    res.status(500).json({ error: true, message: 'Failed to retrieve users: ' + err.message });
  }
});

export default router;
