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
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsImlhdCI6MTc3MzA1NTQwOCwiZXhwIjoxNzczMDU5MDA4fQ.mOaBEu5Siik7ZFONYadLCYaxBDev3YAeaYFwbf9QnB8';
    

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    
    return config;
});



export const employeesApi = {
    
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
            console.log('Получены файлы сотрудника:', response.data);
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке файлов:', error);
            return []; // Возвращаем пустой массив в случае ошибки
        }
    },

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

    async createFile(fileData) {
        try {
            const response = await api.post('/files', fileData);
            return response.data;
        } catch (error) {
            console.error('Ошибка при создании записи файла:', error);
            throw error;
        }
    },

    async createFullEmployee(employeeData) {
        try {
            // паспортные данные
            const passportResponse = await this.createPassportData(employeeData.passportData);
            const passportDataId = passportResponse.passport.id; 

            //  адрес регистрации
            const addressResponse = await this.createRegistrationAddress(employeeData.addressData);
            const addressDataId = addressResponse.address.id;
            
            // сотрудник
            const employeeResponse = await this.createEmployee(
                employeeData, 
                passportDataId, 
                addressDataId
            );
            const employeeId = employeeResponse.employee.id; 


            // файлы
            if (employeeData.files && employeeData.files.length > 0) {
                for (const file of employeeData.files) {
                    const fullPath = file.fullPath || file.name;
                    
                    
                    await this.createFile({
                        id_employees: String(employeeId),
                        name: file.name,
                        file: fullPath
                    });
                }
            }
            

            return {
                success: true,
                employeeId: employeeId,
                passportDataId: passportDataId,
                addressDataId: addressDataId,
                message: 'Сотрудник успешно создан'
            };

        } catch (error) {
            console.error('Ошибка при создании сотрудника:', error);
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
    },
    // Удаление файла
    async deleteFile(id) {
    try {
        const response = await api.delete(`/files/${id}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при удалении файла:', error);
        throw error;
    }
    },

    // Удаление паспортных данных
    async deletePassportData(id) {
    try {
        const response = await api.delete(`/passport/${id}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при удалении паспортных данных:', error);
        throw error;
    }
    },

    // Удаление адреса регистрации
    async deleteRegistrationAddress(id) {
    try {
        const response = await api.delete(`/registration-address/${id}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при удалении адреса регистрации:', error);
        throw error;
    }
    },


    async updatePassportData(id, data) {
        try {
            const response = await api.put(`/passport/${id}`, {
                series: data.series,
                number: data.number,
                date_of_issue: data.date_of_issue,
                unit_code: data.unit_code ? data.unit_code.replace(/-/g, '') : data.unit_code,
                issued_by_whom: data.issued_by_whom
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка при обновлении паспортных данных:', error);
            throw error;
        }
    },

    async updateRegistrationAddress(id, data) {
        try {
            console.log('Обновление адреса:', id, data);
            const response = await api.put(`/registration-address/${id}`, {
                region: data.region,
                locality: data.locality,
                street: data.street,
                house: data.house,
                building: data.building || null,
                apartament: data.apartament || null
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка при обновлении адреса:', error);
            throw error;
        }
    },
    async updateEmployee(id, data) {
        try {
            const response = await api.put(`/employees/${id}`, {
                first_name: data.first_name,
                name: data.name,
                patronymic: data.patronymic || null,
                date_of_birth: data.date_of_birth,
                update_at: new Date().toISOString()
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка при обновлении сотрудника:', error);
            throw error;
        }
    }

};

export default api;