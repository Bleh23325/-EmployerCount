import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// создание экземпляра с предустановленным базовым адресом и заголовком JSON
const api = axios.create({
    baseURL: API_BASE,
    headers: { 'Content-Type': 'application/json' },
});

// перехватчик запросов, он срабатывает перед каждым запросом
api.interceptors.request.use(config => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMsImlhdCI6MTc3MzA3Mjk4OSwiZXhwIjoxNzczMDc2NTg5fQ.dYpNrVe2GJ7ucRTtTHKhsSe3UKMcRWxg_C4b7suCKK0';

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// экспорт объекта с методами для работы с должностями
export const positionsApi = {
    async getPositions() {
        try {
            // отправление запроса на получение на адрес с должностями
            const response = await api.get('/positions');
            return response.data; // помещение ответа в поле дата, а затем его возвращение
        } catch (error) {
            // при возникновении ошибки пишем её в консоль и пробрасываем дальше
            console.error('Ошибка при загрузке должностей:', error);
            throw error;
        }
    },

    // получаем должность по её айди
    async getPosition(id) {
        try {
            // вставляем айди в URL
            const response = await api.get(`/positions/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке должности:', error);
            throw error;
        }
    },

    // создаём новую должность, дата это объект с данными должности
    async createPosition(data) {
        try {
            // запрос на отправку дата на сервер
            const response = await api.post('/positions', data);
            return response.data;
        } catch (error) {
            console.error('Ошибка при создании должности:', error);
            throw error;
        }
    },

    // обновляем данные должности
    async updatePosition(id, data) {
        try {
            // запрос на обновление по указанному айди и передача новых дата
            const response = await api.put(`/positions/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Ошибка при обновлении должности:', error);
            throw error;
        }
    },

    // удаление должности по её айди
    async deletePosition(id) {
        try {
            // запрос на удаление
            const response = await api.delete(`/positions/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при удалении должности:', error);
            throw error;
        }
    }
};

// экспорт экземпляра axios, т.к. он может пригодиться для других запросов
export default api;