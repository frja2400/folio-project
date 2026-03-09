import api from './api'

// Registrera ny användare
export const register = async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password })
    return response.data
}

// Logga in och returnera JWT-token
export const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data.token as string
}