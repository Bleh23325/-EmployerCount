const db = require('../db/Connect');

class HistoryController {

    async index(req, res) {
        try {
            const history = await db.query(`
                SELECT h.*, s.surname
                FROM history_of_change h
                LEFT JOIN specialist s ON h.who_changed_it = s.id
                WHERE h.delete_at IS NULL
                ORDER BY h.date_and_time_of_the_operation DESC
            `);

            res.json(history.rows);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async store(req, res) {
        try {
            const { who_changed_it, the_object_of_operation, changed_fields } = req.body || {};

            // Валидация
            if (!who_changed_it || !the_object_of_operation || !changed_fields) {
                return res.status(422).json({
                    message: 'Missing required fields'
                });
            }

            if (isNaN(who_changed_it)) {
                return res.status(400).json({
                    message: 'Invalid specialist id'
                });
            }

            // Проверяем существует ли specialist
            const specialist = await db.query(
                'SELECT id FROM specialist WHERE id = $1',
                [who_changed_it]
            );

            if (!specialist.rows.length) {
                return res.status(404).json({
                    message: 'Specialist not found'
                });
            }

            const history = await db.query(`
                INSERT INTO history_of_change
                (who_changed_it, the_object_of_operation, changed_fields)
                VALUES ($1,$2,$3)
                RETURNING *
            `, [who_changed_it, the_object_of_operation, changed_fields]);

            res.status(201).json(history.rows[0]);

        } catch (error) {
            console.error(error);

            if (error.code === '23503') {
                return res.status(409).json({
                    message: 'Invalid specialist reference'
                });
            }

            res.status(500).json({ message: 'Server error' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;

            if (isNaN(id)) {
                return res.status(400).json({
                    message: 'Invalid history id'
                });
            }

            const deleted = await db.query(
                `UPDATE history_of_change
                 SET delete_at = NOW()
                 WHERE id=$1 AND delete_at IS NULL
                 RETURNING *`,
                [id]
            );

            if (!deleted.rows.length) {
                return res.status(404).json({
                    message: 'History not found'
                });
            }

            res.json({ message: 'History soft deleted' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = new HistoryController();