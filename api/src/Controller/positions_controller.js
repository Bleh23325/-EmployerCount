const fs = require('fs');
const path = require('path');
const db = require('../db/Connect');

class positionController {
    // создание должности
    async createPosition(req, res) {
        const { name, delete_at, update_at, add_at } = req.body;
        console.log(name, delete_at, update_at, add_at);

        try {
            const newPosition = await db.query(
                `INSERT INTO positions (name, delete_at, update_at, add_at) 
                 VALUES ($1, $2, $3, $4) RETURNING *`,
                [name, delete_at, update_at, add_at]
            );
            res.json({ message: 'Должность добавлена в базу данных', position: newPosition.rows[0] });
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при добавлении должности', error: error.message });
        }
    }

    // просмотр всех должностей
    async getPositions(req, res) {
        try {
            const positions = await db.query('SELECT * FROM positions');
            res.json(positions.rows);
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении должностей', error });
        }
    }

    // возврат 1 должности по айди
    async getOnePosition(req, res) {
        const { id } = req.params;
        try {
            const position = await db.query('SELECT * FROM positions WHERE id = $1', [id]);
            if (position.rows.length === 0) {
                res.status(404).json({ message: 'Должность не найдена' });
            } else {
                res.json(position.rows[0]);
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении должности', error });
        }
    }

    // обновление должности
    async updatePosition(req, res) {
        const { id } = req.params;
        const { name, delete_at, update_at, add_at } = req.body;

        try {
            const updatedPosition = await db.query(
                `UPDATE positions 
                 SET name = $1, delete_at = $2, update_at = $3, add_at = $4 
                 WHERE id = $5 RETURNING *`,
                [name, delete_at, update_at, add_at, id]
            );
            if (updatedPosition.rows.length === 0) {
                res.status(404).json({ message: 'Должность не найдена' });
            } else {
                res.json({ message: 'Должность обновлена', position: updatedPosition.rows[0] });
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при обновлении должности', error });
        }
    }

    // удаление должности
    async deletePosition(req, res) {
        const { id } = req.params;
        try {
            const deletedPosition = await db.query('DELETE FROM positions WHERE id = $1 RETURNING *', [id]);
            if (deletedPosition.rows.length === 0) {
                res.status(404).json({ message: 'Должность не найдена' });
            } else {
                res.json({ message: 'Должность удалена', position: deletedPosition.rows[0] });
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при удалении должности', error });
        }
    }

    // выгрузка данных в файл
    async exportPositionsToFile(req, res) {
        try {
            // получаем данные из базы
            const result = await db.query('SELECT * FROM positions');
            const positions = result.rows;

            // путь для сохранения файла
            const exportDirectory = path.join(__dirname, '..', 'export');

            // проверка существования папки и её создание при отсутствии
            if (!fs.existsSync(exportDirectory)) {
                fs.mkdirSync(exportDirectory);
            }

            // создаем путь для JSON файла
            const filePath = path.join(exportDirectory, 'positions.json');
            
            // запись данных в файл
            fs.writeFileSync(filePath, JSON.stringify(positions, null, 2));

            // отправляем файл на скачивание
            res.download(filePath, 'positions.json', (err) => {
                if (err) {
                    console.error("Ошибка при скачивании файла:", err);
                    res.status(500).json({ message: "Ошибка при скачивании файла" });
                } 
            });
        } catch (error) {
            console.error("Ошибка при выгрузке данных:", error);
            res.status(500).json({ message: 'Ошибка при выгрузке данных', error });
        }
    }
}

// экспортируем объект контроллера
module.exports = new positionController();