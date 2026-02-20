const fs = require('fs');
const path = require('path');
const db = require('../db/Connect');

class RegistrationAddressController {

    // создание адреса регистрации
    async createRegistrationAddress(req, res) {
        const { region, locality, street, house, building, apartament } = req.body;
        console.log(region, locality, street, house, building, apartament);

        try {
            const newAddress = await db.query(
                'INSERT INTO registration_address(region, locality, street, house, building, apartament) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', 
                [region, locality, street, house, building, apartament]
            );
            res.status(201).json({ 
                message: 'Адрес регистрации добавлен в базу данных', 
                address: newAddress.rows[0] 
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Ошибка при добавлении адреса регистрации', 
                error: error.message 
            });
        }
    }
    
    // просмотр всех адресов регистрации
    async getRegistrationAddresses(req, res) {
        try {
            const addresses = await db.query('SELECT * FROM registration_address');
            res.json(addresses.rows);
        } catch (error) {
            res.status(500).json({ 
                message: 'Ошибка при получении адресов регистрации', 
                error: error.message 
            });
        }
    }
    
    // возврат 1 адреса регистрации по айди
    async getOneRegistrationAddress(req, res) {
        const { id } = req.params;
        try {
            const address = await db.query(
                'SELECT * FROM registration_address WHERE id = $1', 
                [id]
            );

            if (address.rows.length === 0) {
                return res.status(404).json({ 
                    message: 'Адрес регистрации не найден' 
                });
            }

            res.json(address.rows[0]);
        } catch (error) {
            res.status(500).json({ 
                message: 'Ошибка при получении адреса регистрации', 
                error: error.message 
            });
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
                return res.status(404).json({ 
                    message: 'Адрес регистрации не найден' 
                });
            }

            res.json({ 
                message: 'Адрес регистрации обновлён', 
                address: updatedAddress.rows[0] 
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Ошибка при обновлении адреса регистрации', 
                error: error.message 
            });
        }
    }
    
    // удаление адреса регистрации
    async deleteRegistrationAddress(req, res) {
        const { id } = req.params;
        try {
            const deletedAddress = await db.query(
                'DELETE FROM registration_address WHERE id = $1 RETURNING *', 
                [id]
            );

            if (deletedAddress.rows.length === 0) {
                return res.status(404).json({ 
                    message: 'Адрес регистрации не найден' 
                });
            }

            res.json({ 
                message: 'Адрес регистрации удалён', 
                address: deletedAddress.rows[0] 
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Ошибка при удалении адреса регистрации', 
                error: error.message 
            });
        }
    }
    
}

// экспортируем объект контроллера
module.exports = new RegistrationAddressController();