import axios from 'axios'

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ✅ Перехватчик для добавления токена
api.interceptors.request.use(config => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzcyODk5MDEzLCJleHAiOjE3NzI5MDI2MTN9.4JSYSk3DXwQZSTodyEEdwMj9-Wl9q_a5SfgQ7xI9iAA';
     
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
});



export const employeesApi = {
    // === СУЩЕСТВУЮЩИЕ МЕТОДЫ (ГЕТТЕРЫ) ===
    
    async getEmployees() {
        try {
            const response = await api.get('/employees');
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке сотрудников:', error);
            throw error;
        }
    },

    async getPassportData(id) {
        try {
            const response = await api.get(`/passport/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке паспортных данных:', error);
            throw error;
        }
    },

    async getRegistrationAddress(id) {
        try {
            const response = await api.get(`/registration-address/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке адреса регистрации:', error);
            throw error;
        }
    },

    async getEmployeeFiles(employeeId) {
        try {
            const response = await api.get(`/files/employee/${employeeId}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке файлов:', error);
            throw error;
        }
    },

    // === НОВЫЕ МЕТОДЫ ДЛЯ СОЗДАНИЯ (ПОСТЕРЫ) ===

    // Создание паспортных данных
    async createPassportData(passportData) {
        try {const cleanUnitCode = passportData.unit_code ? passportData.unit_code.replace(/-/g, '') : '';
            const response = await api.post('/passport', {
                series: passportData.series,
                number: passportData.number,
                date_of_issue: passportData.date_of_issue,
                unit_code: cleanUnitCode,
                issued_by_whom: passportData.issued_by_whom
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка при создании паспортных данных:', error);
            throw error;
        }
    },

    // Создание адреса регистрации
    async createRegistrationAddress(addressData) {
        try {
            const response = await api.post('/registration-address', {
                region: addressData.region,
                locality: addressData.locality,
                street: addressData.street,
                house: addressData.house,
                building: addressData.building || null,
                apartament: addressData.apartament || null
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка при создании адреса регистрации:', error);
            throw error;
        }
    },

    // Создание сотрудника (используя полученные ID)
    async createEmployee(employeeData, passportDataId, addressDataId) {
        try {
            const response = await api.post('/employees', {
                first_name: employeeData.first_name,
                name: employeeData.name,
                patronymic: employeeData.patronymic || null,
                date_of_birth: employeeData.date_of_birth,
                id_passport_data: passportDataId,
                id_registration_address: addressDataId,
                delete_at: null,
                update_at: null,
                add_at: new Date().toISOString()
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка при создании сотрудника:', error);
            throw error;
        }
    },

    // Создание файла для сотрудника
    async createFile(employeeId, fileData) {
        try {
            const response = await api.post('/files', {
                id_employees: employeeId,
                name: fileData.name,
                file: fileData.file
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка при создании файла:', error);
            throw error;
        }
    },

    
    async createFullEmployee(employeeData) {
        try {
            console.log('1. Создание паспортных данных...');
            const passportResponse = await this.createPassportData(employeeData.passportData);
            const passportDataId = passportResponse.passport.id; 
            console.log(' Паспортные данные созданы, ID:', passportDataId);

            console.log('2. Создание адреса регистрации...');
            const addressResponse = await this.createRegistrationAddress(employeeData.addressData);
            const addressDataId = addressResponse.address.id; // Или addressResponse.id
            console.log(' Адрес создан, ID:', addressDataId);

            console.log('3. Создание сотрудника...');
            const employeeResponse = await this.createEmployee(
                employeeData, 
                passportDataId, 
                addressDataId
            );
            const employeeId = employeeResponse.employee.id; // Или employeeResponse.id
            console.log('Сотрудник создан, ID:', employeeId);

            // ШАГ 4: Загружаем файлы (если есть)
            if (employeeData.files && employeeData.files.length > 0) {
                console.log('4. Загрузка файлов...');
                const filePromises = employeeData.files.map(file => 
                    this.createFile(employeeId, file)
                );
                await Promise.all(filePromises);
                console.log(` Загружено ${employeeData.files.length} файлов`);
            }

            return {
                success: true,
                employeeId: employeeId,
                passportDataId: passportDataId,
                addressDataId: addressDataId,
                message: 'Сотрудник успешно создан'
            };

        } catch (error) {
            console.error(' Ошибка при создании сотрудника:', error);
            throw error;
        }
    },


    async updateEmployee(id, employeeData) {
        try {
            const response = await api.put(`/employees/${id}`, {
                first_name: employeeData.first_name,
                name: employeeData.name,
                patronymic: employeeData.patronymic,
                date_of_birth: employeeData.date_of_birth,
                update_at: new Date().toISOString()
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка при обновлении сотрудника:', error);
            throw error;
        }
    },

    async deleteEmployee(id) {
        try {
            const response = await api.delete(`/employees/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при удалении сотрудника:', error);
            throw error;
        }
    },

    async getEmployeeById(id) {
        try {
            const response = await api.get(`/employees/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке сотрудника:', error);
            throw error;
        }
    }
};

export default api;