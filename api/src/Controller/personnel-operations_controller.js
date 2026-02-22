const fs = require('fs');
const path = require('path');
const db = require('../db/Connect');

class personnelOperationController {
    // создание кадровой операции
    async createPersonnelOperation(req, res) {
        const { 
            id_employee, 
            id_department, 
            id_position, 
            setting_the_salary, 
            salary_change, 
            dismissal_from_work, 
            delete_at, 
            update_at, 
            add_at 
        } = req.body;
        console.log(id_employee, id_department, id_position, setting_the_salary, salary_change, dismissal_from_work, delete_at, update_at, add_at);

        try {
            const newOperation = await db.query(
                `INSERT INTO personnel_operations 
                 (id_employee, id_department, id_position, setting_the_salary, salary_change, dismissal_from_work, delete_at, update_at, add_at) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
                [id_employee, id_department, id_position, setting_the_salary, salary_change, dismissal_from_work, delete_at, update_at, add_at]
            );
            res.json({ message: 'Кадровая операция добавлена в базу данных', operation: newOperation.rows[0] });
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при добавлении кадровой операции', error: error.message });
        }
    }

    // просмотр всех кадровых операций
    async getPersonnelOperations(req, res) {
        try {
            const operations = await db.query('SELECT * FROM personnel_operations');
            res.json(operations.rows);
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении кадровых операций', error });
        }
    }

    // возврат 1 кадровой операции по айди
    async getOnePersonnelOperation(req, res) {
        const { id } = req.params;
        try {
            const operation = await db.query('SELECT * FROM personnel_operations WHERE id = $1', [id]);
            if (operation.rows.length === 0) {
                res.status(404).json({ message: 'Кадровая операция не найдена' });
            } else {
                res.json(operation.rows[0]);
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении кадровой операции', error });
        }
    }

    // обновление кадровой операции
    async updatePersonnelOperation(req, res) {
        const { id } = req.params;
        const { 
            id_employee, 
            id_department, 
            id_position, 
            setting_the_salary, 
            salary_change, 
            dismissal_from_work, 
            delete_at, 
            update_at, 
            add_at 
        } = req.body;

        try {
            const updatedOperation = await db.query(
                `UPDATE personnel_operations 
                 SET id_employee = $1, id_department = $2, id_position = $3, setting_the_salary = $4, salary_change = $5, 
                     dismissal_from_work = $6, delete_at = $7, update_at = $8, add_at = $9 
                 WHERE id = $10 RETURNING *`,
                [id_employee, id_department, id_position, setting_the_salary, salary_change, dismissal_from_work, delete_at, update_at, add_at, id]
            );
            if (updatedOperation.rows.length === 0) {
                res.status(404).json({ message: 'Кадровая операция не найдена' });
            } else {
                res.json({ message: 'Кадровая операция обновлена', operation: updatedOperation.rows[0] });
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при обновлении кадровой операции', error });
        }
    }

    // удаление кадровой операции
    async deletePersonnelOperation(req, res) {
        const { id } = req.params;
        try {
            const deletedOperation = await db.query('DELETE FROM personnel_operations WHERE id = $1 RETURNING *', [id]);
            if (deletedOperation.rows.length === 0) {
                res.status(404).json({ message: 'Кадровая операция не найдена' });
            } else {
                res.json({ message: 'Кадровая операция удалена', operation: deletedOperation.rows[0] });
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при удалении кадровой операции', error });
        }
    }

    // выгрузка данных в файл
    async exportPersonnelOperationsToFile(req, res) {
        try {
            // получаем данные из базы
            const result = await db.query('SELECT * FROM personnel_operations');
            const operations = result.rows;

            // путь для сохранения файла
            const exportDirectory = path.join(__dirname, '..', 'export');

            // проверка существования папки и её создание при отсутствии
            if (!fs.existsSync(exportDirectory)) {
                fs.mkdirSync(exportDirectory);
            }

            // создаем путь для JSON файла
            const filePath = path.join(exportDirectory, 'personnel_operations.json');
            
            // запись данных в файл
            fs.writeFileSync(filePath, JSON.stringify(operations, null, 2));

            // отправляем файл на скачивание
            res.download(filePath, 'personnel_operations.json', (err) => {
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
module.exports = new personnelOperationController();