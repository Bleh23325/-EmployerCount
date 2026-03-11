const db = require('../db/Connect');

class SpecialistController {

    async index(req, res) {
        try {
            const specialists = await db.query(`
                SELECT s.id,
                       s.surname,
                       s.name,
                       s.patronymic,
                       s.add_at,
                       s.update_at,
                       r.roles,
                       a.login
                FROM specialist s
                JOIN roles r ON s.id_roles = r.id
                JOIN auth_users a ON s.id_authorization = a.id
                WHERE s.delete_at IS NULL
                ORDER BY s.id
            `);

            res.json(specialists.rows);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params;

            if (isNaN(id))
                return res.status(400).json({ message: 'Invalid specialist id' });

            const specialist = await db.query(`
                SELECT s.id,
                       s.surname,
                       s.name,
                       s.patronymic,
                       s.add_at,
                       s.update_at,
                       r.roles,
                       a.login
                FROM specialist s
                JOIN roles r ON s.id_roles = r.id
                JOIN auth_users a ON s.id_authorization = a.id
                WHERE s.id = $1 AND s.delete_at IS NULL
            `, [id]);

            if (!specialist.rows.length)
                return res.status(404).json({ message: 'Specialist not found' });

            res.json(specialist.rows[0]);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async store(req, res) {
        try {
            const { surname, name, patronymic, id_authorization, id_roles } = req.body;
            const userId = req.user?.id || null;

            if (!surname || !name || !id_authorization || !id_roles)
                return res.status(422).json({ message: 'Missing required fields' });

            // Проверяем auth_users
            const authUser = await db.query(
                'SELECT id FROM auth_users WHERE id=$1 AND deleted_at IS NULL',
                [id_authorization]
            );

            if (!authUser.rows.length)
                return res.status(404).json({ message: 'Authorization user not found' });

            // Проверяем роль
            const role = await db.query(
                'SELECT id FROM roles WHERE id=$1',
                [id_roles]
            );

            if (!role.rows.length)
                return res.status(404).json({ message: 'Role not found' });

            const newSpec = await db.queryWithUser(
                userId,
                `INSERT INTO specialist
                (surname, name, patronymic, id_authorization, id_roles)
                VALUES ($1,$2,$3,$4,$5)
                RETURNING *`,
                [surname, name, patronymic, id_authorization, id_roles]
            );

            res.status(201).json(newSpec.rows[0]);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { surname, name, patronymic, id_authorization, id_roles } = req.body;
            const userId = req.user?.id || null;

            if (isNaN(id))
                return res.status(400).json({ message: 'Invalid specialist id' });

            const exists = await db.query(
                'SELECT id FROM specialist WHERE id=$1 AND delete_at IS NULL',
                [id]
            );

            if (!exists.rows.length)
                return res.status(404).json({ message: 'Specialist not found' });

            const updated = await db.queryWithUser(
                userId,
                `UPDATE specialist
                 SET surname = COALESCE($1, surname),
                     name = COALESCE($2, name),
                     patronymic = COALESCE($3, patronymic),
                     id_authorization = COALESCE($4, id_authorization),
                     id_roles = COALESCE($5, id_roles),
                     update_at = NOW()
                 WHERE id = $6 AND delete_at IS NULL
                 RETURNING *`,
                [surname, name, patronymic, id_authorization, id_roles, id]
            );

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

            if (isNaN(id))
                return res.status(400).json({ message: 'Invalid specialist id' });

            const deleted = await db.queryWithUser(
                userId,
                `UPDATE specialist
                 SET delete_at = NOW()
                 WHERE id=$1 AND delete_at IS NULL
                 RETURNING *`,
                [id]
            );

            if (!deleted.rows.length)
                return res.status(404).json({ message: 'Specialist not found' });

            res.json({ message: 'Specialist soft deleted' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = new SpecialistController();