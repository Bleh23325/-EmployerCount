const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Принудительно ставим кодировку при каждом подключении
pool.on('connect', (client) => {
  client.query("SET client_encoding TO 'UTF8'");
});

async function query(text, params = []) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

async function queryWithUser(userId, text, params = []) {
  const client = await pool.connect();
  try {
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