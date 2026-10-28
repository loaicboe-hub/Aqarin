import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Helper to normalize JSON fields (PostgreSQL JSONB returns parsed JS objects/arrays)
function normalizeJson(val, fallback = []) {
  if (!val) return fallback;
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return val;
}

// 1. Get all properties with filtering, search, pagination, sorting, and PostGIS spatial queries
router.get('/', async (req, res) => {
  try {
    const {
      purpose,
      category,
      propertyType,
      city,
      district,
      compound,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      bedrooms,
      bathrooms,
      finishing,
      paymentType,
      search,
      sort,
      lat,
      lng,
      radiusMeters,
      minLng,
      minLat,
      maxLng,
      maxLat,
      limit = 50,
      offset = 0
    } = req.query;

    let query = "SELECT * FROM properties WHERE status = 'published'";
    const params = [];
    let pIdx = 1;

    if (purpose) {
      query += ` AND purpose = $${pIdx++}`;
      params.push(purpose);
    }
    if (category) {
      query += ` AND category = $${pIdx++}`;
      params.push(category);
    }
    if (propertyType && propertyType !== 'all') {
      query += ` AND property_type = $${pIdx++}`;
      params.push(propertyType);
    }
    if (city && city !== 'all') {
      query += ` AND city ILIKE $${pIdx++}`;
      params.push(`%${city}%`);
    }
    if (district && district !== 'all') {
      query += ` AND district ILIKE $${pIdx++}`;
      params.push(`%${district}%`);
    }
    if (compound) {
      query += ` AND compound ILIKE $${pIdx++}`;
      params.push(`%${compound}%`);
    }
    if (minPrice) {
      query += ` AND price >= $${pIdx++}`;
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      query += ` AND price <= $${pIdx++}`;
      params.push(Number(maxPrice));
    }
    if (minArea) {
      query += ` AND area_sqm >= $${pIdx++}`;
      params.push(Number(minArea));
    }
    if (maxArea) {
      query += ` AND area_sqm <= $${pIdx++}`;
      params.push(Number(maxArea));
    }
    if (bedrooms && bedrooms !== 'all') {
      query += ` AND bedrooms >= $${pIdx++}`;
      params.push(Number(bedrooms));
    }
    if (bathrooms && bathrooms !== 'all') {
      query += ` AND bathrooms >= $${pIdx++}`;
      params.push(Number(bathrooms));
    }
    if (finishing && finishing !== 'all') {
      query += ` AND finishing_type = $${pIdx++}`;
      params.push(finishing);
    }
    if (paymentType && paymentType !== 'all') {
      query += ` AND payment_type = $${pIdx++}`;
      params.push(paymentType);
    }
    if (search) {
      query += ` AND (title_en ILIKE $${pIdx} OR title_ar ILIKE $${pIdx} OR district ILIKE $${pIdx} OR compound ILIKE $${pIdx} OR city ILIKE $${pIdx})`;
      params.push(`%${search}%`);
      pIdx++;
    }

    // Native PostGIS Radius Proximity Search (Unit: METERS)
    if (lat && lng && radiusMeters) {
      query += ` AND ST_DWithin(location_geog, ST_SetSRID(ST_MakePoint($${pIdx++}, $${pIdx++}), 4326)::geography, $${pIdx++})`;
      params.push(Number(lng), Number(lat), Number(radiusMeters));
    }

    // Native PostGIS Map Viewport Bounding Box Search
    if (minLng && minLat && maxLng && maxLat) {
      query += ` AND location_geog && ST_MakeEnvelope($${pIdx++}, $${pIdx++}, $${pIdx++}, $${pIdx++}, 4326)::geography`;
      params.push(Number(minLng), Number(minLat), Number(maxLng), Number(maxLat));
    }

    // Sorting
    if (sort === 'price_asc') {
      query += ' ORDER BY price ASC';
    } else if (sort === 'price_desc') {
      query += ' ORDER BY price DESC';
    } else if (sort === 'area_desc') {
      query += ' ORDER BY area_sqm DESC';
    } else if (sort === 'rating_desc') {
      query += ' ORDER BY aqar_score DESC';
    } else {
      query += ' ORDER BY featured DESC, id DESC';
    }

    query += ` LIMIT $${pIdx++} OFFSET $${pIdx++}`;
    params.push(parseInt(limit, 10), parseInt(offset, 10));

    const { rows } = await pool.query(query, params);

    const properties = rows.map(p => ({
      ...p,
      images: normalizeJson(p.images_json),
      amenities: normalizeJson(p.amenities_json)
    }));

    res.json({ success: true, count: properties.length, data: properties });
  } catch (err) {
    console.error('Fetch properties error:', err);
    res.status(500).json({ error: true, message: 'Failed to retrieve properties: ' + err.message });
  }
});

// 2. Get Single Property by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM properties WHERE id = $1', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Property not found' });
    }

    // Increment views count asynchronously
    pool.query('UPDATE properties SET views_count = views_count + 1 WHERE id = $1', [id]).catch(console.error);

    const prop = rows[0];
    const property = {
      ...prop,
      images: normalizeJson(prop.images_json),
      amenities: normalizeJson(prop.amenities_json)
    };

    // Get 3 similar properties in the same district, city or category
    const { rows: similarRows } = await pool.query(
      'SELECT * FROM properties WHERE id != $1 AND (district = $2 OR city = $3 OR property_type = $4) LIMIT 3',
      [id, prop.district, prop.city, prop.property_type]
    );

    const similarProperties = similarRows.map(p => ({
      ...p,
      images: normalizeJson(p.images_json),
      amenities: normalizeJson(p.amenities_json)
    }));

    res.json({ success: true, data: property, similar: similarProperties });
  } catch (err) {
    console.error('Fetch single property error:', err);
    res.status(500).json({ error: true, message: 'Failed to retrieve property: ' + err.message });
  }
});

// 3. Add New Property Listing
router.post('/', async (req, res) => {
  try {
    const {
      title_en,
      title_ar,
      description_en,
      description_ar,
      purpose = 'sale',
      category = 'residential',
      property_type,
      price,
      area_sqm,
      bedrooms = 0,
      bathrooms = 0,
      floor_level = 1,
      finishing_type = 'fully_finished',
      delivery_status = 'ready',
      delivery_year = 2026,
      payment_type = 'cash',
      down_payment = 0,
      installment_years = 0,
      monthly_installment = 0,
      city,
      district,
      compound,
      address,
      lat = 30.0444,
      lng = 31.2357,
      images = [],
      amenities = [],
      user_id = null
    } = req.body;

    if (!title_en || !price || !area_sqm || !city || !district) {
      return res.status(400).json({ error: true, message: 'Required fields missing (title, price, area, city, district)' });
    }

    const imagesJson = JSON.stringify(images.length > 0 ? images : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80']);
    const amenitiesJson = JSON.stringify(amenities.length > 0 ? amenities : ['Security', 'Parking']);

    const { rows } = await pool.query(
      `INSERT INTO properties (
        title_en, title_ar, description_en, description_ar, purpose, category, property_type,
        price, area_sqm, bedrooms, bathrooms, floor_level, finishing_type, delivery_status,
        delivery_year, payment_type, down_payment, installment_years, monthly_installment,
        city, district, compound, address, lat, lng, aqar_score, images_json, amenities_json,
        status, user_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19,
        $20, $21, $22, $23, $24, $25, 9.0, $26::jsonb, $27::jsonb,
        'published', $28
      ) RETURNING id`,
      [
        title_en, title_ar || title_en, description_en || '', description_ar || '', purpose, category, property_type,
        price, area_sqm, bedrooms, bathrooms, floor_level, finishing_type, delivery_status,
        delivery_year, payment_type, down_payment, installment_years, monthly_installment,
        city, district, compound || '', address || '', lat, lng, imagesJson, amenitiesJson, user_id
      ]
    );

    res.status(201).json({
      success: true,
      message: 'Property listing published successfully',
      propertyId: rows[0].id
    });
  } catch (err) {
    console.error('Create property error:', err);
    res.status(500).json({ error: true, message: 'Failed to create property: ' + err.message });
  }
});

export default router;
