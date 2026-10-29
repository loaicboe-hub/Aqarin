import express from 'express';
import pool from '../db.js';

const router = express.Router();

// 1. Fast Sell Request (Urgent cash offer)
router.post('/fast-sell', async (req, res) => {
  try {
    const {
      city,
      district,
      compound,
      propertyType = 'apartment',
      areaSqm,
      finishingType = 'fully_finished',
      expectedPrice,
      ownerName,
      phone,
      whatsapp,
      urgentReason = 'cash_liquidity',
      userId = null
    } = req.body;

    if (!city || !district || !areaSqm || !expectedPrice || !ownerName || !phone) {
      return res.status(400).json({
        error: true,
        message: 'City, district, area, expected price, owner name, and phone are required'
      });
    }

    const { rows } = await pool.query(
      `INSERT INTO fast_sell_requests (
        user_id, city, district, compound, property_type, area_sqm,
        finishing_type, expected_price, owner_name, phone, whatsapp, urgent_reason, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending_review') RETURNING id`,
      [
        userId || null,
        city,
        district,
        compound || '',
        propertyType,
        Number(areaSqm),
        finishingType,
        Number(expectedPrice),
        ownerName,
        phone,
        whatsapp || phone,
        urgentReason
      ]
    );

    res.status(201).json({
      success: true,
      requestId: rows[0].id,
      message: 'Fast Sell request received. Our investment appraisal team will analyze the property within 24 hours.'
    });
  } catch (err) {
    console.error('Fast sell error:', err);
    res.status(500).json({ error: true, message: 'Submission failed: ' + err.message });
  }
});

// 2. Property Exchange Request (Swap)
router.post('/exchange', async (req, res) => {
  try {
    const {
      offeringSpecs,
      seekingSpecs,
      phone,
      whatsapp,
      userId = null
    } = req.body;

    if (!offeringSpecs || !seekingSpecs || !phone) {
      return res.status(400).json({
        error: true,
        message: 'Offering specs, seeking specs, and phone number are required'
      });
    }

    const { rows } = await pool.query(
      `INSERT INTO property_exchange_requests (
        user_id, offering_specs, seeking_specs, phone, whatsapp, status
      ) VALUES ($1, $2, $3, $4, $5, 'open') RETURNING id`,
      [
        userId || null,
        typeof offeringSpecs === 'object' ? JSON.stringify(offeringSpecs) : offeringSpecs,
        typeof seekingSpecs === 'object' ? JSON.stringify(seekingSpecs) : seekingSpecs,
        phone,
        whatsapp || phone
      ]
    );

    res.status(201).json({
      success: true,
      exchangeId: rows[0].id,
      message: 'Property exchange request published. Matching listings will be notified.'
    });
  } catch (err) {
    console.error('Exchange error:', err);
    res.status(500).json({ error: true, message: 'Exchange submission failed: ' + err.message });
  }
});

// 3. Property Management Contract (Asset & Landlord services)
router.post('/management', async (req, res) => {
  try {
    const {
      planType = 'premium_full_management',
      ownerName,
      phone,
      city,
      compound,
      userId = null
    } = req.body;

    if (!ownerName || !phone || !city) {
      return res.status(400).json({
        error: true,
        message: 'Owner name, phone, and property city are required'
      });
    }

    const { rows } = await pool.query(
      `INSERT INTO property_management_contracts (
        user_id, plan_type, owner_name, phone, city, compound, status
      ) VALUES ($1, $2, $3, $4, $5, $6, 'pending_contact') RETURNING id`,
      [
        userId || null,
        planType,
        ownerName,
        phone,
        city,
        compound || ''
      ]
    );

    res.status(201).json({
      success: true,
      contractId: rows[0].id,
      message: 'Property management contract submitted. Our property manager will schedule an on-site unit inspection.'
    });
  } catch (err) {
    console.error('Management error:', err);
    res.status(500).json({ error: true, message: 'Submission failed: ' + err.message });
  }
});

// 4. Saved Properties (Favorites in Database)
router.get('/favorites/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { rows } = await pool.query(
      `SELECT p.*, s.created_at as saved_at
       FROM saved_properties s
       JOIN properties p ON s.property_id = p.id
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC`,
      [userId]
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('Fetch favorites error:', err);
    res.status(500).json({ error: true, message: 'Failed to retrieve saved properties: ' + err.message });
  }
});

router.post('/favorites', async (req, res) => {
  try {
    const { userId, propertyId } = req.body;
    if (!userId || !propertyId) {
      return res.status(400).json({ error: true, message: 'userId and propertyId are required' });
    }

    const { rows } = await pool.query(
      `INSERT INTO saved_properties (user_id, property_id) 
       VALUES ($1, $2)
       ON CONFLICT (user_id, property_id) DO NOTHING
       RETURNING id`,
      [userId, propertyId]
    );

    res.json({ success: true, saved: true, id: rows[0]?.id || null });
  } catch (err) {
    console.error('Save favorite error:', err);
    res.status(500).json({ error: true, message: 'Failed to save favorite: ' + err.message });
  }
});

router.delete('/favorites', async (req, res) => {
  try {
    const { userId, propertyId } = req.body;
    await pool.query(
      'DELETE FROM saved_properties WHERE user_id = $1 AND property_id = $2',
      [userId, propertyId]
    );
    res.json({ success: true, saved: false });
  } catch (err) {
    console.error('Delete favorite error:', err);
    res.status(500).json({ error: true, message: 'Failed to remove favorite: ' + err.message });
  }
});

// 5. Get Live Active Property Exchanges
router.get('/exchange', async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM property_exchange_requests WHERE status = 'open' ORDER BY id DESC LIMIT 50"
    );
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    console.error('Fetch exchanges error:', err);
    res.status(500).json({ error: true, message: 'Failed to fetch exchanges: ' + err.message });
  }
});

// 6. Submit Finishing & Renovation Quote Request
router.post('/finishing', async (req, res) => {
  try {
    const { name, phone, areaSqm, tier, unitType, city, notes, userId = null } = req.body;
    if (!name || !phone || !areaSqm || !tier) {
      return res.status(400).json({ error: true, message: 'Name, phone, area, and tier are required' });
    }
    const { rows } = await pool.query(
      `INSERT INTO finishing_requests (user_id, name, phone, area_sqm, tier, unit_type, city, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [userId || null, name, phone, Number(areaSqm), tier, unitType || 'apartment', city || 'Cairo', notes || '']
    );
    res.status(201).json({ success: true, requestId: rows[0].id, message: 'Finishing quote request submitted successfully' });
  } catch (err) {
    console.error('Finishing error:', err);
    res.status(500).json({ error: true, message: 'Failed to submit finishing request: ' + err.message });
  }
});

// 7. Get All Submissions by Specific User (Dashboard tracking)
router.get('/user-submissions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [fastSellRes, exchangeRes, mgmtRes, finishingRes] = await Promise.all([
      pool.query('SELECT * FROM fast_sell_requests WHERE user_id = $1 ORDER BY id DESC', [userId]),
      pool.query('SELECT * FROM property_exchange_requests WHERE user_id = $1 ORDER BY id DESC', [userId]),
      pool.query('SELECT * FROM property_management_contracts WHERE user_id = $1 ORDER BY id DESC', [userId]),
      pool.query('SELECT * FROM finishing_requests WHERE user_id = $1 ORDER BY id DESC', [userId])
    ]);
    res.json({
      success: true,
      data: {
        fastSell: fastSellRes.rows,
        exchange: exchangeRes.rows,
        management: mgmtRes.rows,
        finishing: finishingRes.rows
      }
    });
  } catch (err) {
    console.error('Fetch user submissions error:', err);
    res.status(500).json({ error: true, message: 'Failed to fetch user submissions: ' + err.message });
  }
});

export default router;
