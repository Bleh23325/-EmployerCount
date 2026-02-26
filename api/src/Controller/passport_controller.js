const fs = require('fs');
const path = require('path');
const db = require('../db/Connect');
const jwt = require('jsonwebtoken');

class passportDataController {
    // создание паспортных данных
    async createPassportData(req, res) {
        const { series, number, date_of_issue, unit_code, issued_by_whom } = req.body;
        console.log(series, number, date_of_issue, unit_code, issued_by_whom);

        try {
            const newPassport = await db.query(
                'INSERT INTO passport_data(series, number, date_of_issue, unit_code, issued_by_whom) VALUES ($1, $2, $3, $4, $5) RETURNING *', 
                [series, number, date_of_issue, unit_code, issued_by_whom]
            );
            res.json({ message: 'Паспортные данные добавлены в базу данных', passport: newPassport.rows[0] });
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при добавлении паспортных данных', error: error.message });
        }
    }
    
    // просмотр всех паспортных данных
    async getPassportData(req, res) {
        try {
            const passports = await db.query('SELECT * FROM passport_data');
            res.json(passports.rows);
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении паспортных данных', error });
        }
    }
    
    // возврат 1 записи паспортных данных по айди
    async getOnePassportData(req, res) {
        const { id } = req.params;
        try {
            const passport = await db.query('SELECT * FROM passport_data WHERE id = $1', [id]);
            if (passport.rows.length === 0) {
                res.status(404).json({ message: 'Паспортные данные не найдены' });
            } else {
                res.json(passport.rows[0]);
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении паспортных данных', error });
        }
    }
    
    // обновление паспортных данных
    async updatePassportData(req, res) {
        const { id } = req.params;
        const { series, number, date_of_issue, unit_code, issued_by_whom } = req.body;

        try {
            const updatedPassport = await db.query(
                'UPDATE passport_data SET series = $1, number = $2, date_of_issue = $3, unit_code = $4, issued_by_whom = $5 WHERE id = $6 RETURNING *', 
                [series, number, date_of_issue, unit_code, issued_by_whom, id]
            );
            if (updatedPassport.rows.length === 0) {
                res.status(404).json({ message: 'Паспортные данные не найдены' });
            } else {
                res.json({ message: 'Паспортные данные обновлены', passport: updatedPassport.rows[0] });
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при обновлении паспортных данных', error });
        }
    }
    
    // удаление паспортных данных
    async deletePassportData(req, res) {
        const { id } = req.params;
        try {
            const deletedPassport = await db.query('DELETE FROM passport_data WHERE id = $1 RETURNING *', [id]);
            if (deletedPassport.rows.length === 0) {
                res.status(404).json({ message: 'Паспортные данные не найдены' });
            } else {
                res.json({ message: 'Паспортные данные удалены', passport: deletedPassport.rows[0] });
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при удалении паспортных данных', error });
        }
    }
    
    // выгрузка данных в файл
    async exportPassportDataToFile(req, res) {
        try {
            // получаем данные из базы
            const result = await db.query('SELECT * FROM passport_data');
            const passports = result.rows;

            // путь для сохранения файла
            const exportDirectory = path.join(__dirname, '..', 'export');

            // проверка существования папки и её создание при отсутствии
            if (!fs.existsSync(exportDirectory)) {
                fs.mkdirSync(exportDirectory);
            }

            // создаем путь для JSON файла
            const filePath = path.join(exportDirectory, 'passport_data.json');
            
            // запись данных в файл
            fs.writeFileSync(filePath, JSON.stringify(passports, null, 2));

            // отправляем файл на скачивание
            res.download(filePath, 'passport_data.json', (err) => {
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
module.exports = new passportDataController();