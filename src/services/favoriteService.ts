import api from './api'

// Hämta inloggad användares favoriter
export const getFavorites = async () => {
    const response = await api.get('/favorites')
    return response.data
}

// Lägg till favorit
export const addFavorite = async (bookId: string) => {
    const response = await api.post(`/favorites/${bookId}`)
    return response.data
}

// Ta bort favorit
export const deleteFavorite = async (bookId: string) => {
    await api.delete(`/favorites/${bookId}`)
}