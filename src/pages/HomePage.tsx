import { useEffect, useState } from 'react'
import { getTopRated, getLatest } from '../services/reviewService'
import { getFavorites } from '../services/favoriteService'
import { getBookById } from '../services/googleBooksService'
import { useAuth } from '../context/AuthContext'
import BookCard from '../components/BookCard'
import type { Book } from '../types/Book'

const HomePage = () => {
  const { isAuthenticated } = useAuth()

  const [topRatedBooks, setTopRatedBooks] = useState<Book[]>([])
  const [latestBooks, setLatestBooks] = useState<Book[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [topRatings, setTopRatings] = useState<Record<string, number>>({})
  const [topReviewCounts, setTopReviewCounts] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        if (isAuthenticated) {
          const favData = await getFavorites()
          setFavorites(favData.map((f: { bookId: string }) => f.bookId))
        }

        const topRatedData = await getTopRated()
        const topRatedBooksData = await Promise.all(
          topRatedData.map((item: { bookId: string }) => getBookById(item.bookId))
        )
        setTopRatedBooks(topRatedBooksData.filter(Boolean))

        const ratings: Record<string, number> = {}
        const counts: Record<string, number> = {}
        topRatedData.forEach((item: { bookId: string, averageRating: number, reviewCount: number }) => {
          ratings[item.bookId] = item.averageRating
          counts[item.bookId] = item.reviewCount
        })
        setTopRatings(ratings)
        setTopReviewCounts(counts)

        const latestData = await getLatest()
        const latestBooksData = await Promise.all(
          latestData.map((item: { bookId: string }) => getBookById(item.bookId))
        )
        setLatestBooks(latestBooksData.filter(Boolean))

      } catch (err) {
        console.error('Kunde inte hämta startsidan', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [isAuthenticated])

  const handleFavoriteChange = (bookId: string, isFavorite: boolean) => {
    setFavorites((prev) =>
      isFavorite ? [...prev, bookId] : prev.filter((id) => id !== bookId)
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Laddar...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4" style={{ maxWidth: '1200px' }}>

      {/* Högst betygsatta */}
      {topRatedBooks.length > 0 && (
        <section className="mb-5">
          <h2 className="fw-bold mb-3 pb-2 border-bottom" style={{ fontSize: '1.2rem' }}>Högst betygsatta</h2>
          <div className="d-flex flex-wrap gap-3">
            {topRatedBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                avgRating={topRatings[book.id]}
                reviewCount={topReviewCounts[book.id]}
                isFavorite={favorites.includes(book.id)}
                onFavoriteChange={handleFavoriteChange}
              />
            ))}
          </div>
        </section>
      )}

      {/* Nyligen recenserade */}
      {latestBooks.length > 0 && (
        <section className="mb-5">
          <h2 className="fw-bold mb-3 pb-2 border-bottom" style={{ fontSize: '1.2rem' }}>Nyligen recenserade</h2>
          <div className="d-flex flex-wrap gap-3">
            {latestBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                isFavorite={favorites.includes(book.id)}
                onFavoriteChange={handleFavoriteChange}
              />
            ))}
          </div>
        </section>
      )}

      {/* Tom startsida */}
      {topRatedBooks.length === 0 && latestBooks.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-book" style={{ fontSize: '3rem', color: '#212529' }}></i>
          <p className="mt-3 text-muted">Inga recensioner ännu — bli den första!</p>
          <p className="text-muted">Sök efter en bok ovan och lämna din första recension.</p>
        </div>
      )}
    </div>
  )
}

export default HomePage