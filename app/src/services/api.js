const API_BASE_URL = 'http://localhost:5000/api'

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL
  }

  setAuthToken(token) {
    if (token) {
      localStorage.setItem('accessToken', token)
    } else {
      localStorage.removeItem('accessToken')
    }
  }

  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    }

    if (includeAuth) {
      const token = localStorage.getItem('accessToken')
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
    }

    return headers
  }

  async handleResponse(response) {
    const data = await response.json()

    if (!response.ok) {
      const error = new Error(data.message || 'Произошла ошибка')
      error.status = response.status
      error.data = data

      if (response.status === 401) {
        error.message = 'Неверный логин или пароль'
        localStorage.removeItem('accessToken')
      } else if (response.status === 422) {
        error.message = data.errors
          ? Object.values(data.errors).join(', ')
          : 'Проверьте введенные данные'
      } else if (response.status === 500) {
        error.message = 'Ошибка сервера. Попробуйте позже'
      }

      throw error
    }

    return data
  }

  async post(endpoint, data, includeAuth = false) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(includeAuth),
      body: JSON.stringify(data),
    })

    return this.handleResponse(response)
  }

  async get(endpoint) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: this.getHeaders(true),
    })

    return this.handleResponse(response)
  }
}

export default new ApiService()
