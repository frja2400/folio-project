const GOOGLE_BOOKS_URL = 'https://www.googleapis.com/books/v1/volumes'
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY

// In-memory cache för att minimera API-anrop
const bookCache = new Map<string, unknown>()
const searchCache = new Map<string, unknown>()

// Sök böcker med caching
export const searchBooks = async (query: string, type: string = 'intitle', startIndex: number = 0) => {
    const cacheKey = `${type}:${query.trim()}:${startIndex}`
    if (searchCache.has(cacheKey)) return searchCache.get(cacheKey)

    const q = `${type}:${query.trim()}`
    const response = await fetch(
        `${GOOGLE_BOOKS_URL}?q=${q}&startIndex=${startIndex}&maxResults=20&key=${API_KEY}`
    )
    if (!response.ok) throw new Error('Kunde inte hämta böcker')

    const data = await response.json()
    searchCache.set(cacheKey, data)
    return data
}

export const getBookById = async (id: string) => {
    if (bookCache.has(id)) return bookCache.get(id)

    const response = await fetch(`${GOOGLE_BOOKS_URL}/${id}?key=${API_KEY}`)
    if (!response.ok) throw new Error('Kunde inte hämta boken')

    const data = await response.json()
    bookCache.set(id, data)
    return data
}