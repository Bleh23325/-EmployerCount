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
 * Умный запрос с автоматическим логированием
 */
async function queryWithUser(userId, text, params = []) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const operation = text.trim().split(' ')[0].toUpperCase();

        // Определяем таблицу
        const tableMatch = text.match(/INTO\s+(\w+)|UPDATE\s+(\w+)|FROM\s+(\w+)/i);
        const tableName = tableMatch?.slice(1).filter(Boolean)[0];

        let oldData = null;
        let newData = null;

        // Для UPDATE и DELETE получаем старые данные
        if ((operation === 'UPDATE' || operation === 'DELETE') && params.length > 0) {
            const id = params[params.length - 1];
            const oldRes = await client.query(
                `SELECT * FROM ${tableName} WHERE id = $1`,
                [id]
            );
            oldData = oldRes.rows[0] || null;
        }

        // Выполняем основной запрос
        const result = await client.query(text, params);

        if (operation === 'INSERT' || operation === 'UPDATE') {
            newData = result.rows[0] || null;
        }

        // Формируем changed_fields
        let changedFields = null;

        if (operation === 'INSERT') {
            changedFields = {};
            for (const key in newData) {
                changedFields[key] = {
                    old: null,
                    new: newData[key],
                };
            }
        } else if (operation === 'DELETE') {
            changedFields = {};
            for (const key in oldData) {
                changedFields[key] = {
                    old: oldData[key],
                    new: null,
                };
            }
        } else if (operation === 'UPDATE' && oldData && newData) {
            changedFields = {};
            for (const key in newData) {
                if (oldData[key] !== newData[key]) {
                    changedFields[key] = {
                        old: oldData[key],
                        new: newData[key],
                    };
                }
            }
            if (Object.keys(changedFields).length === 0) {
                changedFields = null;
            }
        }

        // Записываем историю
        await client.query(
            `
            INSERT INTO history_of_change (
                date_and_time_of_the_operation,
                who_changed_it,
                the_object_of_operation,
                changed_fields,
                add_at,
                update_at,
                delete_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            `,
            [
                new Date(),
                userId || null,
                `${tableName} (${operation})`,
                changedFields ? JSON.stringify(changedFields) : null,
                operation === 'INSERT' ? new Date() : null,
                operation === 'UPDATE' ? new Date() : null,
                operation === 'DELETE' ? new Date() : null,
            ]
        );

        await client.query('COMMIT');
        return result;

    } catch (error) {
        await client.query('ROLLBACK');
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