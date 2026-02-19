const fs = require('fs');
const path = require('path');
const db = require('../db/Connect');

class employeesController {
    // создание сотрудника
    async createEmployee(req, res) {
        const { first_name, name, patronymic, date_of_birth, id_passport_data, id_registration_address, delete_at, update_at, add_at } = req.body;
        console.log(first_name, name, patronymic, date_of_birth, id_passport_data, id_registration_address, delete_at, update_at, add_at);

        try {
            const newEmployee = await db.query(
                'INSERT INTO employees(first_name, name, patronymic, date_of_birth, id_passport_data, id_registration_address, delete_at, update_at, add_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', 
                [first_name, name, patronymic, date_of_birth, id_passport_data, id_registration_address, delete_at, update_at, add_at]
            );
            res.json({ message: 'Сотрудник добавлен в базу данных', employee: newEmployee.rows[0] });
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при добавлении сотрудника', error: error.message });
        }
    }
    
    // просмотр всех сотрудников
    async getEmployees(req, res) {
        try {
            const employees = await db.query('SELECT * FROM employees');
            res.json(employees.rows);
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении сотрудников', error });
        }
    }
    
    // возврат 1 сотрудника по айди
    async getOneEmployee(req, res) {
        const { id } = req.params;
        try {
            const employee = await db.query('SELECT * FROM employees WHERE id = $1', [id]);
            if (employee.rows.length === 0) {
                res.status(404).json({ message: 'Сотрудник не найден' });
            } else {
                res.json(employee.rows[0]);
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении сотрудника', error });
        }
    }
    
    // обновление данных сотрудника
    async updateEmployee(req, res) {
        const { id } = req.params;
        const { first_name, name, patronymic, date_of_birth, id_passport_data, id_registration_address, delete_at, update_at, add_at } = req.body;

        try {
            const updatedEmployee = await db.query(
                'UPDATE employees SET first_name = $1, name = $2, patronymic = $3, date_of_birth = $4, id_passport_data = $5, id_registration_address = $6, delete_at = $7, update_at = $8, add_at = $9 WHERE id = $10 RETURNING *', 
                [first_name, name, patronymic, date_of_birth, id_passport_data, id_registration_address, delete_at, update_at, add_at, id]
            );
            if (updatedEmployee.rows.length === 0) {
                res.status(404).json({ message: 'Сотрудник не найден' });
            } else {
                res.json({ message: 'Данные сотрудника обновлены', employee: updatedEmployee.rows[0] });
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при обновлении данных сотрудника', error });
        }
    }
    
    // удаление сотрудника
    async deleteEmployee(req, res) {
        const { id } = req.params;
        try {
            const deletedEmployee = await db.query('DELETE FROM employees WHERE id = $1 RETURNING *', [id]);
            if (deletedEmployee.rows.length === 0) {
                res.status(404).json({ message: 'Сотрудник не найден' });
            } else {
                res.json({ message: 'Сотрудник удалён', employee: deletedEmployee.rows[0] });
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при удалении сотрудника', error });
        }
    }
    
    // выгрузка данных в файл
    async exportEmployeesToFile(req, res) {
        try {
            // получаем данные из базы
            const result = await db.query('SELECT * FROM employees');
            const employees = result.rows;

            // путь для сохранения файла
            const exportDirectory = path.join(__dirname, '..', 'export');

            // проверка существования папки и её создание при отсутствии
            if (!fs.existsSync(exportDirectory)) {
                fs.mkdirSync(exportDirectory);
            }

            // создаем путь для JSON файла
            const filePath = path.join(exportDirectory, 'employees.json');
            
            // запись данных в файл
            fs.writeFileSync(filePath, JSON.stringify(employees, null, 2));

            // отправляем файл на скачивание
            res.download(filePath, 'employees.json', (err) => {
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
module.exports = new employeesController();