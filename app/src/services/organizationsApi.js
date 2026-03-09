import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// создание экземпляра с предустановленным базовым адресом и заголовком JSON
const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

// перехватчик запросов, он срабатывает перед каждым запросом
api.interceptors.request.use(config => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiaWF0IjoxNzczMDY0MTkwLCJleHAiOjE3NzMwNjc3OTB9.XsFdZoitSxCkiLCSZlZdaoC2ymGRSH5ci7XQhQB4hBg';
    // добавление токена в заголовок авторизации
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
});

// экспорт объекта с методами для работы с организациями
export const organizationsApi = {
    async getOrganizations() {
        try {
            // отправление запроса на получение на адрес с организациями
            const response = await api.get('/organizations');
            return response.data; // помещение ответа в поле дата, а затем его возвращение
        } catch (error) {
            // при возникновении ошибки пишем её в консоль и пробрасываем дальше
            console.error('Ошибка при загрузке организаций:', error);
            throw error;
        }
    },

    // получаем организацию по её айди
    async getOrganization(id) {
        try {
            // вставляем айди в URL
            const response = await api.get(`/organizations/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при загрузке организации:', error);
            throw error;
        }
    },

    // создаём новую организацию, дата это объект с данными организации
    async createOrganization(data) {
        try {
            // запрос на отправку дата на сервер
            const response = await api.post('/organizations', data);
            return response.data;
        } catch (error) {
            console.error('Ошибка при создании организации:', error);
            throw error;
        }
    },

    // обновляем данные организации
    async updateOrganization(id, data) {
        try {
            // запрос на обновление по указанному айди и передача новых дата
            const response = await api.put(`/organizations/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Ошибка при обновлении организации:', error);
            throw error;
        }
    },

    // удаление организации по её айди
    async deleteOrganization(id) {
        try {
            // запрос на удаление
            const response = await api.delete(`/organizations/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при удалении организации:', error);
            throw error;
        }
    }
};

// экспорт экземпляра axios, т.к. он может пригодиться для других запросов
export default api;