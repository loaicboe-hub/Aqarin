import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import pool, { testDbConnection } from './db.js';
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

import helmet from 'helmet';
import { globalApiLimiter, authLimiter, leadLimiter, uploadLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Trust reverse proxy (Nginx) for accurate client IP rate limiting
app.set('trust proxy', 1);

// Security Headers (Helmet)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// Middlewares & Payload Limits (Defends against memory exhaustion)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint (bypasses rate limit for uptime monitors)
app.get('/api/health', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT version(), current_database(), PostGIS_Version();');
    res.json({
      status: 'online',
      platform: 'AQAR IN (عقار إن) API',
      database: 'PostgreSQL 16 + PostGIS',
      current_database: rows[0].current_database,
      postgis_version: rows[0].postgis_version,
      timestamp: new Date().toISOString(),
      version: '2.0.0-postgres'
    });
  } catch (err) {
    res.status(500).json({
      status: 'degraded',
      platform: 'AQAR IN (عقار إن) API',
      database_error: err.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Apply Rate Limiters
app.use('/api/', globalApiLimiter);
app.use('/api/auth/', authLimiter);
app.use('/api/leads/', leadLimiter);
app.use('/api/upload/', uploadLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
app.listen(PORT, async () => {
  console.log(`🚀 AQAR IN (عقار إن) API server running on http://localhost:${PORT}`);
  await testDbConnection();
});

export default app;
