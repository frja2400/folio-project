import api from './api'

// Hämta alla recensioner
export const getAllReviews = async () => {
    const response = await api.get('/admin/reviews')
    return response.data
}

// Radera valfri recension
export const deleteReview = async (id: number) => {
    await api.delete(`/admin/reviews/${id}`)
}

// Hämta alla användare
export const getAllUsers = async () => {
    const response = await api.get('/admin/users')
    return response.data
}

// Radera användare
export const deleteUser = async (id: number) => {
    await api.delete(`/admin/users/${id}`)
}