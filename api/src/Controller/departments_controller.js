const fs = require('fs');
const path = require('path');
const db = require('../db/Connect');
const jwt = require('jsonwebtoken');

class departmentController {
    // создание отдела
    async createDepartment(req, res) {
        const { id_organization, parent, name, comment, delete_at, update_at, add_at } = req.body;
        console.log(id_organization, parent, name, comment, delete_at, update_at, add_at);

        try {
            const newDepartment = await db.query(
                `INSERT INTO departments (id_organization, parent, name, comment, delete_at, update_at, add_at) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [id_organization, parent, name, comment, delete_at, update_at, add_at]
            );
            res.json({ message: 'Отдел добавлен в базу данных', department: newDepartment.rows[0] });
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при добавлении отдела', error: error.message });
        }
    }

    // просмотр всех отделов
    async getDepartments(req, res) {
        try {
            const departments = await db.query('SELECT * FROM departments');
            res.json(departments.rows);
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении отделов', error });
        }
    }

    // возврат 1 отдела по айди
    async getOneDepartment(req, res) {
        const { id } = req.params;
        try {
            const department = await db.query('SELECT * FROM departments WHERE id = $1', [id]);
            if (department.rows.length === 0) {
                res.status(404).json({ message: 'Отдел не найден' });
            } else {
                res.json(department.rows[0]);
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении отдела', error });
        }
    }

    // обновление отдела
    async updateDepartment(req, res) {
        const { id } = req.params;
        const { id_organization, parent, name, comment, delete_at, update_at, add_at } = req.body;

        try {
            const updatedDepartment = await db.query(
                `UPDATE departments 
                 SET id_organization = $1, parent = $2, name = $3, comment = $4, delete_at = $5, update_at = $6, add_at = $7 
                 WHERE id = $8 RETURNING *`,
                [id_organization, parent, name, comment, delete_at, update_at, add_at, id]
            );
            if (updatedDepartment.rows.length === 0) {
                res.status(404).json({ message: 'Отдел не найден' });
            } else {
                res.json({ message: 'Отдел обновлён', department: updatedDepartment.rows[0] });
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при обновлении отдела', error });
        }
    }

    // удаление отдела
    async deleteDepartment(req, res) {
        const { id } = req.params;
        try {
            const deletedDepartment = await db.query('DELETE FROM departments WHERE id = $1 RETURNING *', [id]);
            if (deletedDepartment.rows.length === 0) {
                res.status(404).json({ message: 'Отдел не найден' });
            } else {
                res.json({ message: 'Отдел удалён', department: deletedDepartment.rows[0] });
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при удалении отдела', error });
        }
    }

    // выгрузка данных в файл
    async exportDepartmentsToFile(req, res) {
        try {
            // получаем данные из базы
            const result = await db.query('SELECT * FROM departments');
            const departments = result.rows;

            // путь для сохранения файла
            const exportDirectory = path.join(__dirname, '..', 'export');

            // проверка существования папки и её создание при отсутствии
            if (!fs.existsSync(exportDirectory)) {
                fs.mkdirSync(exportDirectory);
            }

            // создаем путь для JSON файла
            const filePath = path.join(exportDirectory, 'departments.json');
            
            // запись данных в файл
            fs.writeFileSync(filePath, JSON.stringify(departments, null, 2));

            // отправляем файл на скачивание
            res.download(filePath, 'departments.json', (err) => {
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
module.exports = new departmentController();