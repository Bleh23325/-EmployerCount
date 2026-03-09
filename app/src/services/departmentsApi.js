import axios from 'axios';
import { TOKEN } from './token';

const API_BASE = 'http://localhost:5000/api';

// создание экземпляра с предустановленным базовым адресом и заголовком JSON
const api = axios.create({ 
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
});

// Перехватчик для добавления токена
api.interceptors.request.use(config => {
    if (TOKEN) {
        config.headers.Authorization = `Bearer ${TOKEN}`;

    }
    return config;
});

// экспорт объекта с методами для работы с отделами
export const departmentsApi = {
    async getDepartments() {
        try {
            // отправление запроса на получение на адрес с отделами
            const response = await api.get('/departments');
            return response.data; // помещение ответа в поле дата, а затем его возвращение
        } catch (error) {
            // при возникновении ошибки пишем её в консоль и пробрасываем дальше
            console.error('Ошибка при загрузке отделов:', error);
            throw error;
        }
    },

    // получаем отдел по его айди
    async getDepartment(id) {
        try {
            // вставляем айди в URL
            const response = await api.get(`/departments/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке отдела:', error);
            throw error;
        }
    },

    // создаём новый отдел, дата это объект с данными отдела
    async createDepartment(data) {
        try {
            // запрос на отправку дата на сервер
            const response = await api.post('/departments', data);
            return response.data;
        } catch (error) {
            console.error('Ошибка при создании отдела:', error);
            throw error;
        }
    },

    // обновляем данные отдела
    async updateDepartment(id, data) {
        try {
            // запрос на обновление по указанному айди и передача новых дата
            const response = await api.put(`/departments/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Ошибка при обновлении отдела:', error);
            throw error;
        }
    },

    // удаление отдела по его айди
    async deleteDepartment(id) {
        try {
            // запрос на удаление
            const response = await api.delete(`/departments/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при удалении отдела:', error);
            throw error;
        }
    }
};

// экспорт экземпляра axios, т.к. он может пригодиться для других запросов
export default api;