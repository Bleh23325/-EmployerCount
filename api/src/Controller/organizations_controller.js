const fs = require('fs');
const path = require('path');
const db = require('../db/Connect');
const jwt = require('jsonwebtoken');

class organizationController {
    // создание организации
    async createOrganization(req, res) {
        const { name, comment, delete_at, update_at, add_at } = req.body;
        console.log(name, comment, delete_at, update_at, add_at);

        try {
            const newOrganization = await db.query(
                `INSERT INTO organizations (name, comment, delete_at, update_at, add_at) 
                 VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [name, comment, delete_at, update_at, add_at]
            );
            res.json({ message: 'Организация добавлена в базу данных', organization: newOrganization.rows[0] });
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при добавлении организации', error: error.message });
        }
    }

    // просмотр всех организаций
    async getOrganizations(req, res) {
        try {
            const organizations = await db.query('SELECT * FROM organizations');
            res.json(organizations.rows);
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении организаций', error });
        }
    }

    // возврат 1 организации по айди
    async getOneOrganization(req, res) {
        const { id } = req.params;
        try {
            const organization = await db.query('SELECT * FROM organizations WHERE id = $1', [id]);
            if (organization.rows.length === 0) {
                res.status(404).json({ message: 'Организация не найдена' });
            } else {
                res.json(organization.rows[0]);
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении организации', error });
        }
    }

    // обновление организации
    async updateOrganization(req, res) {
        const { id } = req.params;
        const { name, comment, delete_at, update_at, add_at } = req.body;

        try {
            const updatedOrganization = await db.query(
                `UPDATE organizations 
                 SET name = $1, comment = $2, delete_at = $3, update_at = $4, add_at = $5 
                 WHERE id = $6 RETURNING *`,
                [name, comment, delete_at, update_at, add_at, id]
            );
            if (updatedOrganization.rows.length === 0) {
                res.status(404).json({ message: 'Организация не найдена' });
            } else {
                res.json({ message: 'Организация обновлена', organization: updatedOrganization.rows[0] });
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при обновлении организации', error });
        }
    }

    // удаление организации
    async deleteOrganization(req, res) {
        const { id } = req.params;
        try {
            const deletedOrganization = await db.query('DELETE FROM organizations WHERE id = $1 RETURNING *', [id]);
            if (deletedOrganization.rows.length === 0) {
                res.status(404).json({ message: 'Организация не найдена' });
            } else {
                res.json({ message: 'Организация удалена', organization: deletedOrganization.rows[0] });
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при удалении организации', error });
        }
    }

    // выгрузка данных в файл
    async exportOrganizationsToFile(req, res) {
        try {
            // получаем данные из базы
            const result = await db.query('SELECT * FROM organizations');
            const organizations = result.rows;

            // путь для сохранения файла
            const exportDirectory = path.join(__dirname, '..', 'export');

            // проверка существования папки и её создание при отсутствии
            if (!fs.existsSync(exportDirectory)) {
                fs.mkdirSync(exportDirectory);
            }

            // создаем путь для JSON файла
            const filePath = path.join(exportDirectory, 'organizations.json');
            
            // запись данных в файл
            fs.writeFileSync(filePath, JSON.stringify(organizations, null, 2));

            // отправляем файл на скачивание
            res.download(filePath, 'organizations.json', (err) => {
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
module.exports = new organizationController();