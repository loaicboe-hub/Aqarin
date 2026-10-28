import express from 'express';
import pool from '../db.js';

const router = express.Router();

// 1. Submit Property Lead (WhatsApp click, Direct inquiry, Schedule visit)
router.post('/property-inquiry', async (req, res) => {
  try {
    const { propertyId, name, phone, email, message, inquiryType = 'inquiry', userId = null } = req.body;

    if (!propertyId || !name || !phone) {
      return res.status(400).json({ error: true, message: 'Property ID, name, and phone are required' });
    }

    const { rows } = await pool.query(
      `INSERT INTO leads_inquiries (property_id, user_id, name, phone, email, message, inquiry_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [propertyId, userId || null, name, phone, email || '', message || '', inquiryType]
    );

    res.status(201).json({
      success: true,
      inquiryId: rows[0].id,
      message: 'Inquiry sent successfully to the property agent'
    });
  } catch (err) {
    console.error('Lead inquiry error:', err);
    res.status(500).json({ error: true, message: 'Failed to send inquiry: ' + err.message });
  }
});

// 2. Submit Partner Application (Brokers / Valuers / Developers)
router.post('/partner-apply', async (req, res) => {
  try {
    const { name, companyName, email, phone, partnerType, city, message } = req.body;

    if (!name || !companyName || !phone || !email || !partnerType) {
      return res.status(400).json({ error: true, message: 'All essential partner fields are required' });
    }

    const { rows } = await pool.query(
      `INSERT INTO partner_applications (name, company_name, email, phone, partner_type, city, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
      [name, companyName, email, phone, partnerType, city || 'Cairo', message || '']
    );

    res.status(201).json({
      success: true,
      applicationId: rows[0].id,
      message: 'Partner application received. Our business development team will reach out soon.'
    });
  } catch (err) {
    console.error('Partner application error:', err);
    res.status(500).json({ error: true, message: 'Submission failed: ' + err.message });
  }
});

export default router;
