const db = require('../db/Connect');
const iconv = require('iconv-lite');

class HistoryController {
  
  async index(req, res) {
  try {
    const history = await db.query(`
      SELECT *
      FROM history_of_change
      ORDER BY date_and_time_of_the_operation DESC
    `);  // Убрали WHERE delete_at IS NULL

    res.json(history.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

  async delete(req, res) {
    try {
      const { id } = req.params;

      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid history id' });
      }

      const deleted = await db.query(
        `DELETE FROM history_of_change
        WHERE id = $1
        RETURNING *`,
        [id]
      );

      if (!deleted.rows.length) {
        return res.status(404).json({ message: 'History not found' });
      }

      res.json({ message: 'History permanently deleted' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

}

module.exports = new HistoryController();