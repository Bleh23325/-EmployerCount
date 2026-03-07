const API_BASE = 'http://localhost:5000/api'; 

export const organizationsApi = {
  async getOrganizations() {
    const response = await fetch(`${API_BASE}/organizations`);
    if (!response.ok) throw new Error('Ошибка загрузки');
    return response.json();
  },
  async getOrganization(id) {
    const response = await fetch(`${API_BASE}/organizations/${id}`);
    if (!response.ok) throw new Error('Ошибка загрузки');
    return response.json();
  },
  async createOrganization(data) {
    const response = await fetch(`${API_BASE}/organizations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Ошибка создания');
    return response.json();
  },
  async updateOrganization(id, data) {
    const response = await fetch(`${API_BASE}/organizations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Ошибка обновления');
    return response.json();
  },
  async deleteOrganization(id) {
    const response = await fetch(`${API_BASE}/organizations/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Ошибка удаления');
    return response.json();
  }
};