import axios from 'axios'
import { BASE_URL } from '../config'

// Skapar Axios-instans med bas-URL och JSON-header
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Interceptor som automatiskt lägger till JWT-token i alla anrop
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api