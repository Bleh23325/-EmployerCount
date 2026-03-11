const db = require('../db/Connect');

class RolesController {

    async index(req, res) {
        try {
            const roles = await db.query('SELECT * FROM roles ORDER BY id');
            res.json(roles.rows);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params;

            const role = await db.query(
                'SELECT * FROM roles WHERE id = $1',
                [id]
            );

            if (!role.rows[0]) {
                return res.status(404).json({ message: 'Role not found' });
            }

            res.json(role.rows[0]);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async store(req, res) {
        try {
            const { roles } = req.body;
            const userId = req.user?.id || null;

            const newRole = await db.queryWithUser(
                userId,
                'INSERT INTO roles (roles) VALUES ($1) RETURNING *',
                [roles.trim()]
            );

            res.status(201).json(newRole.rows[0]);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { roles } = req.body;
            const userId = req.user?.id || null;

            const updated = await db.queryWithUser(
                userId,
                'UPDATE roles SET roles = $1 WHERE id = $2 RETURNING *',
                [roles.trim(), id]
            );

            if (!updated.rows[0]) {
                return res.status(404).json({ message: 'Role not found' });
            }

            res.json(updated.rows[0]);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.id || null;

            const deleted = await db.queryWithUser(
                userId,
                'DELETE FROM roles WHERE id = $1 RETURNING *',
                [id]
            );

            if (!deleted.rows[0]) {
                return res.status(404).json({ message: 'Role not found' });
            }

            res.json({ message: 'Role deleted' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = new RolesController();