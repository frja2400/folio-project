import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchBooks } from '../services/googleBooksService'
import { getFavorites } from '../services/favoriteService'
import { useAuth } from '../context/AuthContext'
import { getReviewsByBook } from '../services/reviewService'
import BookCard from '../components/BookCard'
import type { Book } from '../types/Book'

const SearchPage = () => {
  const [searchParams] = useSearchParams()
  const { isAuthenticated } = useAuth()

  const q = searchParams.get('q') ?? ''
  const type = searchParams.get('type') ?? 'intitle'

  const [bookRatings, setBookRatings] = useState<Record<string, { avg: number, count: number }>>({})
  const [books, setBooks] = useState<Book[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')


  // Hämta favoriter om inloggad
  useEffect(() => {
    if (!isAuthenticated) return
    const fetchFavorites = async () => {
      try {
        const data = await getFavorites()
        setFavorites(data.map((f: { bookId: string }) => f.bookId))
      } catch {
        // tyst fel — favoriter är inte kritiska
      }
    }
    fetchFavorites()
  }, [isAuthenticated])

  // Hämta böcker när sökparametrar eller sida ändras
  useEffect(() => {
    if (!q) return
    const fetchBooks = async () => {
      setIsLoading(true)
      setError('')
      try {
        const data = await searchBooks(q, type)
        const items = data.items ?? []
        const unique = items.filter((book: Book, index: number, self: Book[]) =>
          index === self.findIndex((b) => b.id === book.id)
        )
        setBooks(unique)

        const ratingsMap: Record<string, { avg: number, count: number }> = {}   // Snittbetyg och antal recensioner
        for (const book of unique) {
          try {
            const reviews = await getReviewsByBook(book.id)
            if (reviews.length > 0) {
              const avg = reviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviews.length
              ratingsMap[book.id] = { avg, count: reviews.length }
            }
          } catch {
            // tyst fel
          }
        }
        setBookRatings(ratingsMap)

      } catch {
        setError('Något gick fel vid sökningen, försök igen')
      } finally {
        setIsLoading(false)
      }
    }
    fetchBooks()
  }, [q, type])


  const handleFavoriteChange = (bookId: string, isFavorite: boolean) => {
    setFavorites((prev) =>
      isFavorite ? [...prev, bookId] : prev.filter((id) => id !== bookId)
    )
  }

  // Bygg sökrubrik
  const buildTitle = () => {
    const typeLabel: Record<string, string> = {
      intitle: 'titel',
      inauthor: 'författare',
      isbn: 'ISBN',
    }
    return `"${q}" (${typeLabel[type] ?? type})`
  }

  return (
    <div className="container py-4" style={{ maxWidth: '1200px' }}>

      {/* Rubrik */}
      {q && !isLoading && (
        <p className="text-muted mb-4">Sökning: {buildTitle()}</p>
      )}

      {/* Laddning */}
      {isLoading && (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Laddar...</span>
          </div>
        </div>
      )}

      {/* Felmeddelande */}
      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* Inga resultat */}
      {!isLoading && !error && books.length === 0 && q && (
        <p className="text-muted">Inga böcker hittades för {buildTitle()}.</p>
      )}

      {/* Bokrutnät */}
      {!isLoading && books.length > 0 && (
        <div className="d-flex flex-wrap gap-3">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isFavorite={favorites.includes(book.id)}
              onFavoriteChange={handleFavoriteChange}
              avgRating={bookRatings[book.id]?.avg}
              reviewCount={bookRatings[book.id]?.count}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchPage