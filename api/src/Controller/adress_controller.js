const fs = require('fs');
const path = require('path');
const db = require('../db/Connect');

class registrationAddressController {
    // создание адреса регистрации
    async createRegistrationAddress(req, res) {
        const { region, locality, street, house, building, apartament } = req.body;
        console.log(region, locality, street, house, building, apartament);

        try {
            const newAddress = await db.query(
                'INSERT INTO registration_address(region, locality, street, house, building, apartament) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', 
                [region, locality, street, house, building, apartament]
            );
            res.json({ message: 'Адрес регистрации добавлен в базу данных', address: newAddress.rows[0] });
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при добавлении адреса регистрации', error: error.message });
        }
    }
    
    // просмотр всех адресов регистрации
    async getRegistrationAddresses(req, res) {
        try {
            const addresses = await db.query('SELECT * FROM registration_address');
            res.json(addresses.rows);
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении адресов регистрации', error });
        }
    }
    
    // возврат 1 адреса регистрации по айди
    async getOneRegistrationAddress(req, res) {
        const { id } = req.params;
        try {
            const address = await db.query('SELECT * FROM registration_address WHERE id = $1', [id]);
            if (address.rows.length === 0) {
                res.status(404).json({ message: 'Адрес регистрации не найден' });
            } else {
                res.json(address.rows[0]);
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при получении адреса регистрации', error });
        }
    }
    
    // обновление адреса регистрации
    async updateRegistrationAddress(req, res) {
        const { id } = req.params;
        const { region, locality, street, house, building, apartament } = req.body;

        try {
            const updatedAddress = await db.query(
                'UPDATE registration_address SET region = $1, locality = $2, street = $3, house = $4, building = $5, apartament = $6 WHERE id = $7 RETURNING *', 
                [region, locality, street, house, building, apartament, id]
            );
            if (updatedAddress.rows.length === 0) {
                res.status(404).json({ message: 'Адрес регистрации не найден' });
            } else {
                res.json({ message: 'Адрес регистрации обновлён', address: updatedAddress.rows[0] });
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при обновлении адреса регистрации', error });
        }
    }
    
    // удаление адреса регистрации
    async deleteRegistrationAddress(req, res) {
        const { id } = req.params;
        try {
            const deletedAddress = await db.query('DELETE FROM registration_address WHERE id = $1 RETURNING *', [id]);
            if (deletedAddress.rows.length === 0) {
                res.status(404).json({ message: 'Адрес регистрации не найден' });
            } else {
                res.json({ message: 'Адрес регистрации удалён', address: deletedAddress.rows[0] });
            }
        } catch (error) {
            res.status(500).json({ message: 'Ошибка при удалении адреса регистрации', error });
        }
    }
    
    // выгрузка данных в файл
    async exportRegistrationAddressesToFile(req, res) {
        try {
            // получаем данные из базы
            const result = await db.query('SELECT * FROM registration_address');
            const addresses = result.rows;

            // путь для сохранения файла
            const exportDirectory = path.join(__dirname, '..', 'export');

            // проверка существования папки и её создание при отсутствии
            if (!fs.existsSync(exportDirectory)) {
                fs.mkdirSync(exportDirectory);
            }

            // создаем путь для JSON файла
            const filePath = path.join(exportDirectory, 'registration_address.json');
            
            // запись данных в файл
            fs.writeFileSync(filePath, JSON.stringify(addresses, null, 2));

            // отправляем файл на скачивание
            res.download(filePath, 'registration_address.json', (err) => {
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
module.exports = new registrationAddressController();