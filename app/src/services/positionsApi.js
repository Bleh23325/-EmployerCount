import axios from 'axios';
import { TOKEN } from './token';

const API_BASE = 'http://localhost:5000/api';

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

export const positionsApi = {
    async getPositions() {
        try {
            const response = await api.get('/positions');
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке должностей:', error);
            throw error;
        }
    },

    async getPosition(id) {
        try {
            const response = await api.get(`/positions/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке должности:', error);
            throw error;
        }
    },

    async createPosition(data) {
        try {
            const response = await api.post('/positions', data);
            return response.data;
        } catch (error) {
            console.error('Ошибка при создании должности:', error);
            throw error;
        }
    },

    async updatePosition(id, data) {
        try {
            const response = await api.put(`/positions/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Ошибка при обновлении должности:', error);
            throw error;
        }
    },

    async deletePosition(id) {
        try {
            const response = await api.delete(`/positions/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при удалении должности:', error);
            throw error;
        }
    }
};

export default api;