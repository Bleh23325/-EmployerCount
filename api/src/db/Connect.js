// Connect.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

/**
 * Обычный запрос
 */
async function query(text, params = []) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

/**
 * Упрощенный запрос с пользователем (без истории)
 */
async function queryWithUser(userId, text, params = []) {
  const client = await pool.connect();
  try {
    // Просто выполняем запрос без истории
    const result = await client.query(text, params);
    return result;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  pool,
  query,
  queryWithUser,
};