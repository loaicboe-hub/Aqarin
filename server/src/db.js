import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

// PostgreSQL connection pool configuration
const poolConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.PGPORT || process.env.DB_PORT || '5432', 10),
      user: process.env.PGUSER || process.env.DB_USER || 'postgres',
      password: process.env.PGPASSWORD || process.env.DB_PASSWORD || '',
      database: process.env.PGDATABASE || process.env.DB_NAME || 'aqarin_db',
      max: parseInt(process.env.PG_POOL_MAX || '8', 10),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };

const pool = new Pool(poolConfig);

// Helper for test connection
export async function testDbConnection() {
  try {
    const client = await pool.connect();
    const res = await client.query('SELECT version(), current_database(), PostGIS_Version();');
    console.log('✅ PostgreSQL Database connected successfully to:', res.rows[0].current_database);
    console.log('ℹ️ Engine Version:', res.rows[0].version.split(' on ')[0]);
    console.log('🗺️ PostGIS Version:', res.rows[0].postgis_version);
    client.release();
    return true;
  } catch (error) {
    console.warn('⚠️ PostgreSQL connection notice:', error.message);
    return false;
  }
}

export default pool;
