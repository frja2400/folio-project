import api from './api'

// Hämta alla recensioner för en bok
export const getReviewsByBook = async (bookId: string) => {
    const response = await api.get(`/reviews/${bookId}`)
    return response.data
}

// Hämta inloggad användares recension för en specifik bok
export const getUserReviewForBook = async (bookId: string) => {
    try {
        const response = await api.get(`/reviews/${bookId}/user`)
        return response.data
    } catch {
        return null
    }
}

// Hämta inloggad användares alla recensioner
export const getUserReviews = async () => {
    const response = await api.get('/reviews/user')
    return response.data
}

// Hämta 4 högst betygsatta böcker
export const getTopRated = async () => {
    const response = await api.get('/reviews/top-rated')
    return response.data
}

// Hämta 4 senast recenserade böcker
export const getLatest = async () => {
    const response = await api.get('/reviews/latest')
    return response.data
}

// Skapa recension
export const createReview = async (bookId: string, text: string, rating: number) => {
    const response = await api.post('/reviews', { bookId, text, rating })
    return response.data
}

// Uppdatera recension
export const updateReview = async (id: number, bookId: string, text: string, rating: number) => {
    const response = await api.put(`/reviews/${id}`, { bookId, text, rating })
    return response.data
}

// Radera recension
export const deleteReview = async (id: number) => {
    await api.delete(`/reviews/${id}`)
}