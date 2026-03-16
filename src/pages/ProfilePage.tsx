import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUserReviews } from '../services/reviewService'
import { getFavorites } from '../services/favoriteService'
import { getBookById } from '../services/googleBooksService'
import { useAuth } from '../context/AuthContext'
import BookCard from '../components/BookCard'
import type { Book } from '../types/Book'

interface UserReview {
  id: number
  bookId: string
  text: string
  rating: number
  createdAt: string
}

interface FavoriteItem {
  bookId: string
}

const ProfilePage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [favoriteBooks, setFavoriteBooks] = useState<Book[]>([])
  const [reviewBooks, setReviewBooks] = useState<Book[]>([])
  const [userReviews, setUserReviews] = useState<UserReview[]>([])
  const [avgRatings, setAvgRatings] = useState<Record<string, number>>({})
  const [reviewCounts, setReviewCounts] = useState<Record<string, number>>({})
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const favData: FavoriteItem[] = await getFavorites()
      const favIds = favData.map(f => f.bookId)
      setFavorites(favIds)

      const favBooks = await Promise.all(favIds.map(id => getBookById(id)))
      setFavoriteBooks(favBooks.filter(Boolean))

      const reviewData: UserReview[] = await getUserReviews()
      setUserReviews(reviewData)

      const revBooks = await Promise.all(reviewData.map(r => getBookById(r.bookId)))
      setReviewBooks(revBooks.filter(Boolean))

      const ratings: Record<string, number> = {}
      const counts: Record<string, number> = {}
      await Promise.all(
        favIds.map(async (bookId) => {
          try {
            const res = await fetch(`http://localhost:5237/api/reviews/${bookId}`)
            const data = await res.json()
            if (data.length > 0) {
              ratings[bookId] = data.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / data.length
              counts[bookId] = data.length
            }
          } catch {
            // Ignorera fel för enskilda böcker, visa bara inga recensioner istället
          }
        })
      )
      setAvgRatings(ratings)
      setReviewCounts(counts)

    } catch (err) {
      console.error('Kunde inte hämta profildata', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleFavoriteChange = (bookId: string, isFavorite: boolean) => {
    setFavorites(prev =>
      isFavorite ? [...prev, bookId] : prev.filter(id => id !== bookId)
    )
    if (isFavorite) {
      // Lägg till boken i favoriter direkt utan omladdning
      getBookById(bookId).then(book => {
        if (book) setFavoriteBooks(prev => [...prev, book])
      })
    } else {
      setFavoriteBooks(prev => prev.filter(b => b.id !== bookId))
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
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

      {/* Rubrik + logga ut på mobil */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="fw-bold mb-0" style={{ fontSize: '1.5rem' }}>
          {user?.username}
        </h1>
        <button
          className="btn btn-outline-dark btn-sm d-lg-none"
          onClick={handleLogout}
        >
          Logga ut
        </button>
      </div>

      {/* Mina favoriter */}
      <section className="mb-5">
        <h2 className="fw-bold mb-3 pb-2 border-bottom" style={{ fontSize: '1.2rem' }}>
          Mina favoriter
        </h2>
        {favoriteBooks.length === 0 ? (
          <p className="text-muted">Du har inga favoriter ännu.</p>
        ) : (
          <div className="d-flex flex-wrap gap-3">
            {favoriteBooks.map(book => (
              <BookCard
                key={book.id}
                book={book}
                avgRating={avgRatings[book.id]}
                reviewCount={reviewCounts[book.id]}
                isFavorite={favorites.includes(book.id)}
                onFavoriteChange={handleFavoriteChange}
              />
            ))}
          </div>
        )}
      </section>

      {/* Mina recensioner */}
      <section className="mb-5">
        <h2 className="fw-bold mb-3 pb-2 border-bottom" style={{ fontSize: '1.2rem' }}>
          Mina recensioner
        </h2>
        {reviewBooks.length === 0 ? (
          <p className="text-muted">Du har inte skrivit några recensioner ännu.</p>
        ) : (
          <div className="d-flex flex-wrap gap-3">
            {reviewBooks.map(book => {
              const review = userReviews.find(r => r.bookId === book.id)
              return (
                <BookCard
                  key={book.id}
                  book={book}
                  avgRating={review?.rating}
                  isFavorite={favorites.includes(book.id)}
                  onFavoriteChange={handleFavoriteChange}
                />
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

export default ProfilePage