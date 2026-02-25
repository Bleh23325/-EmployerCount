const fs = require('fs');
const path = require('path');
const db = require('../db/Connect');
const jwt = require('jsonwebtoken');

class filesController {
    // создание записи о файле
    async createFile(req, res) {
        const { id_employees, name, file } = req.body;
        console.log(id_employees, name, file);

        try {
            const newFile = await db.query(
                'INSERT INTO files(id_employees, name, file) VALUES ($1, $2, $3) RETURNING *', 
                [id_employees, name, file]
            );
            res.json({ message: 'Файл добавлен в базу данных', file: newFile.rows[0] });
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при добавлении файла', error: error.message });
        }
    }
    
    // просмотр всех файлов
    async getFiles(req, res) {
        try {
            const files = await db.query('SELECT * FROM files');
            res.json(files.rows);
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении файлов', error });
        }
    }
    
    // возврат 1 файла по айди
    async getOneFile(req, res) {
        const { id } = req.params;
        try {
            const file = await db.query('SELECT * FROM files WHERE id = $1', [id]);
            if (file.rows.length === 0) {
                res.status(404).json({ message: 'Файл не найден' });
            } else {
                res.json(file.rows[0]);
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении файла', error });
        }
    }
    
    // получение файлов по id сотрудника
    async getFilesByEmployeeId(req, res) {
        const { id_employees } = req.params;
        try {
            const files = await db.query('SELECT * FROM files WHERE id_employees = $1', [id_employees]);
            res.json(files.rows);
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении файлов сотрудника', error });
        }
    }
    
    // обновление информации о файле
    async updateFile(req, res) {
        const { id } = req.params;
        const { id_employees, name, file } = req.body;

        try {
            const updatedFile = await db.query(
                'UPDATE files SET id_employees = $1, name = $2, file = $3 WHERE id = $4 RETURNING *', 
                [id_employees, name, file, id]
            );
            if (updatedFile.rows.length === 0) {
                res.status(404).json({ message: 'Файл не найден' });
            } else {
                res.json({ message: 'Информация о файле обновлена', file: updatedFile.rows[0] });
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при обновлении информации о файле', error });
        }
    }
    
    // удаление файла
    async deleteFile(req, res) {
        const { id } = req.params;
        try {
            const deletedFile = await db.query('DELETE FROM files WHERE id = $1 RETURNING *', [id]);
            if (deletedFile.rows.length === 0) {
                res.status(404).json({ message: 'Файл не найден' });
            } else {
                res.json({ message: 'Файл удалён', file: deletedFile.rows[0] });
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при удалении файла', error });
        }
    }
    
    // выгрузка данных в файл
    async exportFilesToFile(req, res) {
        try {
            // получаем данные из базы
            const result = await db.query('SELECT * FROM files');
            const files = result.rows;

            // путь для сохранения файла
            const exportDirectory = path.join(__dirname, '..', 'export');

            // проверка существования папки и её создание при отсутствии
            if (!fs.existsSync(exportDirectory)) {
                fs.mkdirSync(exportDirectory);
            }

            // создаем путь для JSON файла
            const filePath = path.join(exportDirectory, 'files.json');
            
            // запись данных в файл
            fs.writeFileSync(filePath, JSON.stringify(files, null, 2));

            // отправляем файл на скачивание
            res.download(filePath, 'files.json', (err) => {
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
module.exports = new filesController();