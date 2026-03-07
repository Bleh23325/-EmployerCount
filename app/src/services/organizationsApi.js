import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Перехватчик для добавления токена
api.interceptors.request.use(config => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzcyODk5MDEzLCJleHAiOjE3NzI5MDI2MTN9.4JSYSk3DXwQZSTodyEEdwMj9-Wl9q_a5SfgQ7xI9iAA';
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
});

export const organizationsApi = {
    async getOrganizations() {
        try {
            const response = await api.get('/organizations');
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке организаций:', error);
            throw error;
        }
    },

    async getOrganization(id) {
        try {
            const response = await api.get(`/organizations/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке организации:', error);
            throw error;
        }
    },

    async createOrganization(data) {
        try {
            const response = await api.post('/organizations', data);
            return response.data;
        } catch (error) {
            console.error('Ошибка при создании организации:', error);
            throw error;
        }
    },

    async updateOrganization(id, data) {
        try {
            const response = await api.put(`/organizations/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Ошибка при обновлении организации:', error);
            throw error;
        }
    },

    async deleteOrganization(id) {
        try {
            const response = await api.delete(`/organizations/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при удалении организации:', error);
            throw error;
        }
    }
};

export default api;