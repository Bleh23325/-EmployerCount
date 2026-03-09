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

export const departmentsApi = {
    async getDepartments() {
        try {
            const response = await api.get('/departments');
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке отделов:', error);
            throw error;
        }
    },

    async getDepartment(id) {
        try {
            const response = await api.get(`/departments/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке отдела:', error);
            throw error;
        }
    },

    async createDepartment(data) {
        try {
            const response = await api.post('/departments', data);
            return response.data;
        } catch (error) {
            console.error('Ошибка при создании отдела:', error);
            throw error;
        }
    },

    async updateDepartment(id, data) {
        try {
            const response = await api.put(`/departments/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Ошибка при обновлении отдела:', error);
            throw error;
        }
    },

    async deleteDepartment(id) {
        try {
            const response = await api.delete(`/departments/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при удалении отдела:', error);
            throw error;
        }
    }
};

export default api;