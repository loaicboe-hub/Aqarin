import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aqarin_db',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection helper
export async function testDbConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database connected successfully to', process.env.DB_NAME || 'aqarin_db');
    connection.release();
    return true;
  } catch (error) {
    console.warn('⚠️ MySQL connection notice:', error.message);
    console.warn('ℹ️ Running with active database configuration (Make sure MySQL is started or run database/schema.sql)');
    return false;
  }
}

export default pool;
