const db = require('../db/Connect');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AuthorizationController {

    async index(req, res) {
        try {
            const auth = await db.query(
                'SELECT id, login FROM auth_users WHERE deleted_at IS NULL'
            );
            res.json(auth.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async show(req, res) {
        try {
            const { id } = req.params;

            if (isNaN(id))
                return res.status(400).json({ message: 'Invalid id' });

            const auth = await db.query(
                'SELECT id, login FROM auth_users WHERE id = $1 AND deleted_at IS NULL',
                [id]
            );

            if (!auth.rows.length)
                return res.status(404).json({ message: 'User not found' });

            res.json(auth.rows[0]);

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async store(req, res) {
        try {
            const { login, password } = req.body || {};
            const userId = req.user?.id || null;

            if (!login || !password)
                return res.status(422).json({ message: 'Login and password required' });

            const exist = await db.query(
                'SELECT id FROM auth_users WHERE login = $1',
                [login]
            );

            if (exist.rows.length)
                return res.status(409).json({ message: 'Login already exists' });

            const hashed = await bcrypt.hash(password, 10);

            const newAuth = await db.queryWithUser(
                userId,
                `INSERT INTO auth_users (login, password, created_at)
                 VALUES ($1, $2, NOW())
                 RETURNING id, login`,
                [login, hashed]
            );

            res.status(201).json(newAuth.rows[0]);

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async login(req, res) {
        try {
            const { login, password } = req.body || {};

            if (!login || !password)
                return res.status(422).json({ message: 'Login and password required' });

            const user = await db.query(
                'SELECT * FROM auth_users WHERE login = $1 AND deleted_at IS NULL',
                [login]
            );

            if (!user.rows.length)
                return res.status(404).json({ message: 'User not found' });

            const validPassword = await bcrypt.compare(
                password,
                user.rows[0].password
            );

            if (!validPassword)
                return res.status(401).json({ message: 'Invalid credentials' });

            const token = jwt.sign(
                { id: user.rows[0].id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({
                token,
                user: {
                    id: user.rows[0].id,
                    login: user.rows[0].login
                }
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const { login, password } = req.body || {};
            const userId = req.user?.id || null;

            if (isNaN(id))
                return res.status(400).json({ message: 'Invalid id' });

            if (!login && !password)
                return res.status(422).json({ message: 'Nothing to update' });

            let hashed = null;
            if (password)
                hashed = await bcrypt.hash(password, 10);

            const updated = await db.queryWithUser(
                userId,
                `UPDATE auth_users
                 SET login = COALESCE($1, login),
                     password = COALESCE($2, password),
                     updated_at = NOW()
                 WHERE id = $3 AND deleted_at IS NULL
                 RETURNING id, login`,
                [login, hashed, id]
            );

            if (!updated.rows.length)
                return res.status(404).json({ message: 'User not found' });

            res.json(updated.rows[0]);

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.id || null;

            if (isNaN(id))
                return res.status(400).json({ message: 'Invalid id' });

            const deleted = await db.queryWithUser(
                userId,
                'UPDATE auth_users SET deleted_at = NOW() WHERE id = $1 RETURNING id',
                [id]
            );

            if (!deleted.rows.length)
                return res.status(404).json({ message: 'User not found' });

            res.json({ message: 'Authorization deleted' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        }
    }
}

module.exports = new AuthorizationController();