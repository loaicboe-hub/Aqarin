import express from 'express';
import pool from '../db.js';

const router = express.Router();

// 1. Get all properties with filtering, search, pagination, and sorting
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
      limit = 50,
      offset = 0
    } = req.query;

    let query = 'SELECT * FROM properties WHERE status = "published"';
    const params = [];

    if (purpose) {
      query += ' AND purpose = ?';
      params.push(purpose);
    }
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (propertyType && propertyType !== 'all') {
      query += ' AND property_type = ?';
      params.push(propertyType);
    }
    if (city) {
      query += ' AND (city LIKE ? OR city LIKE ?)';
      params.push(`%${city}%`, `%${city}%`);
    }
    if (district) {
      query += ' AND district LIKE ?';
      params.push(`%${district}%`);
    }
    if (compound) {
      query += ' AND compound LIKE ?';
      params.push(`%${compound}%`);
    }
    if (minPrice) {
      query += ' AND price >= ?';
      params.push(Number(minPrice));
    }
    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(Number(maxPrice));
    }
    if (minArea) {
      query += ' AND area_sqm >= ?';
      params.push(Number(minArea));
    }
    if (maxArea) {
      query += ' AND area_sqm <= ?';
      params.push(Number(maxArea));
    }
    if (bedrooms && bedrooms !== 'all') {
      query += ' AND bedrooms >= ?';
      params.push(Number(bedrooms));
    }
    if (bathrooms && bathrooms !== 'all') {
      query += ' AND bathrooms >= ?';
      params.push(Number(bathrooms));
    }
    if (finishing && finishing !== 'all') {
      query += ' AND finishing_type = ?';
      params.push(finishing);
    }
    if (paymentType && paymentType !== 'all') {
      query += ' AND payment_type = ?';
      params.push(paymentType);
    }
    if (search) {
      query += ' AND (title_en LIKE ? OR title_ar LIKE ? OR district LIKE ? OR compound LIKE ? OR city LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s, s);
    }

    // Sorting
    if (sort === 'price_asc') {
      query += ' ORDER BY price ASC';
    } else if (sort === 'price_desc') {
      query += ' ORDER BY price DESC';
    } else if (sort === 'area_desc') {
      query += ' ORDER BY area_sqm DESC';
    } else if (sort === 'rating_desc') {
      query += ' ORDER BY iscore_rating DESC';
    } else {
      query += ' ORDER BY featured DESC, id DESC';
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);
    
    // Parse JSON fields
    const properties = rows.map(p => ({
      ...p,
      images: typeof p.images_json === 'string' ? JSON.parse(p.images_json) : p.images_json,
      amenities: typeof p.amenities_json === 'string' ? JSON.parse(p.amenities_json) : p.amenities_json
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
    const [rows] = await pool.query('SELECT * FROM properties WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: true, message: 'Property not found' });
    }

    // Increment views count asynchronously
    pool.query('UPDATE properties SET views_count = views_count + 1 WHERE id = ?', [id]).catch(console.error);

    const prop = rows[0];
    const property = {
      ...prop,
      images: typeof prop.images_json === 'string' ? JSON.parse(prop.images_json) : prop.images_json,
      amenities: typeof prop.amenities_json === 'string' ? JSON.parse(prop.amenities_json) : prop.amenities_json
    };

    // Get 3 similar properties in the same city or category
    const [similarRows] = await pool.query(
      'SELECT * FROM properties WHERE id != ? AND (district = ? OR city = ? OR property_type = ?) LIMIT 3',
      [id, prop.district, prop.city, prop.property_type]
    );

    const similarProperties = similarRows.map(p => ({
      ...p,
      images: typeof p.images_json === 'string' ? JSON.parse(p.images_json) : p.images_json,
      amenities: typeof p.amenities_json === 'string' ? JSON.parse(p.amenities_json) : p.amenities_json
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

    const [result] = await pool.query(
      `INSERT INTO properties (
        title_en, title_ar, description_en, description_ar, purpose, category, property_type,
        price, area_sqm, bedrooms, bathrooms, floor_level, finishing_type, delivery_status,
        delivery_year, payment_type, down_payment, installment_years, monthly_installment,
        city, district, compound, address, lat, lng, iscore_rating, images_json, amenities_json,
        status, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 9.0, ?, ?, 'published', ?)`,
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
      propertyId: result.insertId
    });
  } catch (err) {
    console.error('Create property error:', err);
    res.status(500).json({ error: true, message: 'Failed to create property: ' + err.message });
  }
});

export default router;
