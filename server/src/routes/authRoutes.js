import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'aqarin_super_secret_jwt_key_2026';

// 1. Register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, phone, role } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: true, message: 'Full name, email, and password are required' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    try {
      const [result] = await pool.query(
        'INSERT INTO users (full_name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)',
        [fullName, email.toLowerCase().trim(), passwordHash, phone || null, role || 'buyer']
      );

      const token = jwt.sign(
        { id: result.insertId, email: email.toLowerCase().trim(), role: role || 'buyer', name: fullName },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        token,
        user: { id: result.insertId, fullName, email: email.toLowerCase().trim(), role: role || 'buyer', phone }
      });
    } catch (dbErr) {
      // Handle fallback or duplicate email
      if (dbErr.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: true, message: 'This email is already registered' });
      }
      throw dbErr;
    }
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: true, message: 'Failed to create account: ' + err.message });
  }
});

// 2. Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: true, message: 'Email and password are required' });
    }

    try {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);
      if (rows.length === 0) {
        return res.status(401).json({ error: true, message: 'Invalid email or password' });
      }

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: true, message: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.full_name },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      return res.json({
        success: true,
        token,
        user: {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          role: user.role,
          phone: user.phone
        }
      });
    } catch (dbErr) {
      // Mock login for demo if MySQL is temporarily disconnected
      if (email === 'admin@aqarin.com' && password === 'admin123') {
        const token = jwt.sign({ id: 1, email: 'admin@aqarin.com', role: 'admin', name: 'AQAR IN Admin' }, JWT_SECRET, { expiresIn: '30d' });
        return res.json({
          success: true,
          token,
          user: { id: 1, fullName: 'AQAR IN Admin', email: 'admin@aqarin.com', role: 'admin' }
        });
      }
      throw dbErr;
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: true, message: 'Login failed: ' + err.message });
  }
});

// 3. Get Current User Profile
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: true, message: 'No authorization token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const [rows] = await pool.query('SELECT id, full_name, email, phone, role, created_at FROM users WHERE id = ?', [decoded.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: true, message: 'User not found' });
    }

    res.json({ success: true, user: rows[0] });
  } catch (err) {
    res.status(401).json({ error: true, message: 'Invalid or expired token' });
  }
});

export default router;
