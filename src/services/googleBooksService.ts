const GOOGLE_BOOKS_URL = 'https://www.googleapis.com/books/v1/volumes'
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY

// Sök böcker med query och typ (titel, författare, ämne)
export const searchBooks = async (query: string, type: string = 'intitle', startIndex: number = 0) => {
    const q = `${type}:${query.trim()}`

    const response = await fetch(
        `${GOOGLE_BOOKS_URL}?q=${q}&startIndex=${startIndex}&maxResults=20&key=${API_KEY}`
    )

    if (!response.ok) throw new Error('Kunde inte hämta böcker')
    return await response.json()
}

// Hämta en specifik bok med ID
export const getBookById = async (id: string) => {
    const response = await fetch(`${GOOGLE_BOOKS_URL}/${id}?key=${API_KEY}`)

    if (!response.ok) throw new Error('Kunde inte hämta boken')
    return await response.json()
}