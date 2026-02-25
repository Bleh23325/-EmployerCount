const jwt = require('jsonwebtoken');
const db = require('../db/Connect');

module.exports = async function setCurrentSpecialist(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) return next();

        const token = authHeader.split(' ')[1];
        if (!token) return next();

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Получаем specialist по id_authorization
        const specialist = await db.query(
            'SELECT id FROM specialist WHERE id_authorization = $1',
            [decoded.id]
        );

        if (specialist.rows.length) {
            req.currentSpecialistId = specialist.rows[0].id;
        }

        next();
    } catch (err) {
        next();
    }
};