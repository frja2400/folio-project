const GOOGLE_BOOKS_URL = 'https://www.googleapis.com/books/v1/volumes'

// Sök böcker med fritext och valfri genre
export const searchBooks = async (query: string, subject?: string, startIndex: number = 0) => {
    let q = query
    if (subject) q += `+subject:${subject}`

    const response = await fetch(
        `${GOOGLE_BOOKS_URL}?q=${encodeURIComponent(q)}&startIndex=${startIndex}&maxResults=40`
    )

    if (!response.ok) throw new Error('Kunde inte hämta böcker')

    return await response.json()
}

// Hämta en specifik bok med ID
export const getBookById = async (id: string) => {
    const response = await fetch(`${GOOGLE_BOOKS_URL}/${id}`)

    if (!response.ok) throw new Error('Kunde inte hämta boken')

    return await response.json()
}