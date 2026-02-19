const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const connectDB = async () => {
    try {
        const client = await pool.connect();
        console.log('База данных подключена');
        client.release();
    } catch (error) {
        console.error('Ошибка подключения к БД:', error.message);
        process.exit(1);
    }
};

connectDB();

module.exports = pool;