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

function formatPropertyRow(p) {
  if (!p) return null;
  return {
    ...p,
    titleEn: p.title_en,
    titleAr: p.title_ar,
    descriptionEn: p.description_en,
    descriptionAr: p.description_ar,
    propertyType: p.property_type,
    finishingType: p.finishing_type,
    paymentType: p.payment_type,
    areaSqm: Number(p.area_sqm),
    aqarScore: Number(p.aqar_score),
    viewsCount: Number(p.views_count),
    price: Number(p.price),
    images: normalizeJson(p.images_json),
    amenities: normalizeJson(p.amenities_json)
  };
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

    const radiusInMeters = radiusMeters ? Number(radiusMeters) : (req.query.radiusKm ? Number(req.query.radiusKm) * 1000 : null);
    if (lat && lng && radiusInMeters) {
      query += ` AND ST_DWithin(location_geog, ST_SetSRID(ST_MakePoint($${pIdx++}, $${pIdx++}), 4326)::geography, $${pIdx++})`;
      params.push(Number(lng), Number(lat), radiusInMeters);
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

    const properties = rows.map(formatPropertyRow);

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

    const property = formatPropertyRow(rows[0]);

    // Get 3 similar properties in the same district, city or category
    const { rows: similarRows } = await pool.query(
      'SELECT * FROM properties WHERE id != $1 AND (district = $2 OR city = $3 OR property_type = $4) LIMIT 3',
      [id, property.district, property.city, property.property_type]
    );

    const similarProperties = similarRows.map(formatPropertyRow);

    res.json({ success: true, data: property, similar: similarProperties });
  } catch (err) {
    console.error('Fetch single property error:', err);
    res.status(500).json({ error: true, message: 'Failed to retrieve property: ' + err.message });
  }
});

// Helper functions to safely parse numbers and integers for PostgreSQL
function parseNum(val, defaultVal = 0) {
  if (val === undefined || val === null) return defaultVal;
  if (typeof val === 'string' && val.trim() === '') return defaultVal;
  const parsed = Number(val);
  return isNaN(parsed) ? defaultVal : parsed;
}

function parseIntNum(val, defaultVal = 0) {
  if (val === undefined || val === null) return defaultVal;
  if (typeof val === 'string' && val.trim() === '') return defaultVal;
  const parsed = parseInt(val, 10);
  return isNaN(parsed) ? defaultVal : parsed;
}

// 3. Add New Property Listing
router.post('/', async (req, res) => {
  try {
    const b = req.body || {};

    const title_en = (b.title_en || b.titleEn || '').trim();
    const title_ar = (b.title_ar || b.titleAr || title_en).trim();
    const description_en = (b.description_en || b.descriptionEn || '').trim();
    const description_ar = (b.description_ar || b.descriptionAr || description_en).trim();

    const purpose = b.purpose === 'rent' ? 'rent' : 'sale';
    const category = b.category === 'commercial' ? 'commercial' : 'residential';
    const property_type = b.property_type || b.propertyType || 'apartment';

    const price = parseNum(b.price ?? b.price_egp, 0);
    const area_sqm = parseIntNum(b.area_sqm ?? b.areaSqm, 0);
    const bedrooms = parseIntNum(b.bedrooms, 0);
    const bathrooms = parseIntNum(b.bathrooms, 0);
    const floor_level = parseIntNum(b.floor_level ?? b.floorLevel, 1);

    const validFinishings = ['core_shell', 'semi_finished', 'fully_finished', 'ultra_lux'];
    const finishing_type = validFinishings.includes(b.finishing_type || b.finishingType)
      ? (b.finishing_type || b.finishingType)
      : 'fully_finished';

    const delivery_status = b.delivery_status || b.deliveryStatus || 'ready';
    const delivery_year = parseIntNum(b.delivery_year ?? b.deliveryYear, 2026);
    const payment_type = b.payment_type || b.paymentType || 'cash';
    const down_payment = parseNum(b.down_payment ?? b.downPayment, 0);
    const installment_years = parseIntNum(b.installment_years ?? b.installmentYears, 0);
    const monthly_installment = parseNum(b.monthly_installment ?? b.monthlyInstallment, 0);

    const city = (b.city || '').trim();
    const district = (b.district || '').trim();
    const compound = (b.compound || '').trim();
    const address = (b.address || '').trim();

    const lat = parseNum(b.lat, 30.0444);
    const lng = parseNum(b.lng, 31.2357);

    const rawImages = Array.isArray(b.images) ? b.images : [];
    const images = rawImages.filter(img => typeof img === 'string' && img.trim().length > 0);
    const amenities = Array.isArray(b.amenities) ? b.amenities : [];

    let user_id = null;
    if (b.user_id || b.userId) {
      const uid = parseIntNum(b.user_id || b.userId, 0);
      if (uid > 0) {
        const uCheck = await pool.query('SELECT id FROM users WHERE id = $1', [uid]);
        if (uCheck.rows.length > 0) user_id = uid;
      }
    }

    if (!title_en || price <= 0 || area_sqm <= 0 || !city || !district) {
      return res.status(400).json({
        error: true,
        message: 'Required fields missing or invalid (title_en, price > 0, area_sqm > 0, city, district)'
      });
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
        title_en, title_ar, description_en, description_ar, purpose, category, property_type,
        price, area_sqm, bedrooms, bathrooms, floor_level, finishing_type, delivery_status,
        delivery_year, payment_type, down_payment, installment_years, monthly_installment,
        city, district, compound, address, lat, lng, imagesJson, amenitiesJson, user_id
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

// 4. Update Existing Property Listing
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const b = req.body || {};

    const { rows: existingRows } = await pool.query('SELECT * FROM properties WHERE id = $1', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ error: true, message: 'Property not found' });
    }
    const curr = existingRows[0];

    const title_en = b.title_en !== undefined ? String(b.title_en).trim() : (b.titleEn !== undefined ? String(b.titleEn).trim() : curr.title_en);
    const title_ar = b.title_ar !== undefined ? String(b.title_ar).trim() : (b.titleAr !== undefined ? String(b.titleAr).trim() : (curr.title_ar || title_en));
    const description_en = b.description_en !== undefined ? String(b.description_en).trim() : (b.descriptionEn !== undefined ? String(b.descriptionEn).trim() : (curr.description_en || ''));
    const description_ar = b.description_ar !== undefined ? String(b.description_ar).trim() : (b.descriptionAr !== undefined ? String(b.descriptionAr).trim() : (curr.description_ar || ''));

    const purpose = ['sale', 'rent'].includes(b.purpose) ? b.purpose : curr.purpose;
    const category = ['residential', 'commercial'].includes(b.category) ? b.category : curr.category;
    const property_type = b.property_type || b.propertyType || curr.property_type;

    const price = b.price !== undefined ? parseNum(b.price, Number(curr.price)) : Number(curr.price);
    const area_sqm = b.area_sqm !== undefined ? parseIntNum(b.area_sqm, curr.area_sqm) : (b.areaSqm !== undefined ? parseIntNum(b.areaSqm, curr.area_sqm) : curr.area_sqm);
    const bedrooms = b.bedrooms !== undefined ? parseIntNum(b.bedrooms, curr.bedrooms) : curr.bedrooms;
    const bathrooms = b.bathrooms !== undefined ? parseIntNum(b.bathrooms, curr.bathrooms) : curr.bathrooms;
    const floor_level = b.floor_level !== undefined ? parseIntNum(b.floor_level, curr.floor_level) : (b.floorLevel !== undefined ? parseIntNum(b.floorLevel, curr.floor_level) : curr.floor_level);

    const validFinishings = ['core_shell', 'semi_finished', 'fully_finished', 'ultra_lux'];
    const finishing_type = validFinishings.includes(b.finishing_type || b.finishingType)
      ? (b.finishing_type || b.finishingType)
      : curr.finishing_type;

    const delivery_status = b.delivery_status || b.deliveryStatus || curr.delivery_status;
    const delivery_year = b.delivery_year !== undefined ? parseIntNum(b.delivery_year, curr.delivery_year) : (b.deliveryYear !== undefined ? parseIntNum(b.deliveryYear, curr.delivery_year) : curr.delivery_year);
    const payment_type = b.payment_type || b.paymentType || curr.payment_type;
    const down_payment = b.down_payment !== undefined ? parseNum(b.down_payment, Number(curr.down_payment)) : (b.downPayment !== undefined ? parseNum(b.downPayment, Number(curr.down_payment)) : Number(curr.down_payment));
    const installment_years = b.installment_years !== undefined ? parseIntNum(b.installment_years, curr.installment_years) : (b.installmentYears !== undefined ? parseIntNum(b.installmentYears, curr.installment_years) : curr.installment_years);
    const monthly_installment = b.monthly_installment !== undefined ? parseNum(b.monthly_installment, Number(curr.monthly_installment)) : (b.monthlyInstallment !== undefined ? parseNum(b.monthlyInstallment, Number(curr.monthly_installment)) : Number(curr.monthly_installment));

    const city = b.city !== undefined ? String(b.city).trim() : curr.city;
    const district = b.district !== undefined ? String(b.district).trim() : curr.district;
    const compound = b.compound !== undefined ? String(b.compound).trim() : (curr.compound || '');
    const address = b.address !== undefined ? String(b.address).trim() : (curr.address || '');

    const lat = b.lat !== undefined ? parseNum(b.lat, Number(curr.lat)) : Number(curr.lat);
    const lng = b.lng !== undefined ? parseNum(b.lng, Number(curr.lng)) : Number(curr.lng);

    let imagesJson;
    if (Array.isArray(b.images)) {
      const filtered = b.images.filter(img => typeof img === 'string' && img.trim().length > 0);
      imagesJson = JSON.stringify(filtered.length > 0 ? filtered : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80']);
    } else {
      imagesJson = JSON.stringify(curr.images_json);
    }

    let amenitiesJson;
    if (Array.isArray(b.amenities)) {
      amenitiesJson = JSON.stringify(b.amenities);
    } else {
      amenitiesJson = JSON.stringify(curr.amenities_json);
    }

    const validStatuses = ['published', 'pending_review', 'rejected', 'archived'];
    const status = validStatuses.includes(b.status) ? b.status : curr.status;
    const featured = b.featured !== undefined ? Boolean(b.featured) : curr.featured;

    if (!title_en || price <= 0 || area_sqm <= 0 || !city || !district) {
      return res.status(400).json({
        error: true,
        message: 'Required fields missing or invalid (title_en, price > 0, area_sqm > 0, city, district)'
      });
    }

    const { rows: updatedRows } = await pool.query(
      `UPDATE properties SET
        title_en = $1, title_ar = $2, description_en = $3, description_ar = $4,
        purpose = $5, category = $6, property_type = $7, price = $8, area_sqm = $9,
        bedrooms = $10, bathrooms = $11, floor_level = $12, finishing_type = $13,
        delivery_status = $14, delivery_year = $15, payment_type = $16, down_payment = $17,
        installment_years = $18, monthly_installment = $19, city = $20, district = $21,
        compound = $22, address = $23, lat = $24, lng = $25, images_json = $26::jsonb,
        amenities_json = $27::jsonb, status = $28, featured = $29, updated_at = CURRENT_TIMESTAMP
      WHERE id = $30 RETURNING *`,
      [
        title_en, title_ar, description_en, description_ar, purpose, category, property_type,
        price, area_sqm, bedrooms, bathrooms, floor_level, finishing_type, delivery_status,
        delivery_year, payment_type, down_payment, installment_years, monthly_installment,
        city, district, compound, address, lat, lng, imagesJson, amenitiesJson, status, featured,
        id
      ]
    );

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: formatPropertyRow(updatedRows[0])
    });
  } catch (err) {
    console.error('Update property error:', err);
    res.status(500).json({ error: true, message: 'Failed to update property: ' + err.message });
  }
});

// 5. Delete Property Listing
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('DELETE FROM properties WHERE id = $1 RETURNING id', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Property not found' });
    }
    res.json({
      success: true,
      message: 'Property deleted successfully',
      deletedId: rows[0].id
    });
  } catch (err) {
    console.error('Delete property error:', err);
    res.status(500).json({ error: true, message: 'Failed to delete property: ' + err.message });
  }
});

// 6. Get Properties Created By Specific User (User Dashboard)
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { rows } = await pool.query('SELECT * FROM properties WHERE user_id = $1 ORDER BY id DESC', [userId]);
    res.json({ success: true, count: rows.length, data: rows.map(formatPropertyRow) });
  } catch (err) {
    console.error('Fetch user properties error:', err);
    res.status(500).json({ error: true, message: 'Failed to retrieve user properties: ' + err.message });
  }
});

export default router;
