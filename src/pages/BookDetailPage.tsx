import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getBookById } from '../services/googleBooksService'
import { getReviewsByBook, getUserReviewForBook } from '../services/reviewService'
import { getFavorites, addFavorite, deleteFavorite } from '../services/favoriteService'
import { useAuth } from '../context/AuthContext'
import ReviewForm from '../components/ReviewForm'
import ReviewList from '../components/ReviewList'
import StarRating from '../components/StarRating'
import type { Book } from '../types/Book'
import type { Review } from '../types/Review'

// Sidan som visar detaljer om en bok. Användare kan skriva och redigera sin recension och lägga till eller ta bort boken från sina favoriter.
const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()

  const [book, setBook] = useState<Book | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [userReview, setUserReview] = useState<Review | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Hämta bokdata, recensioner, användarrecension och favoritstatus när komponenten laddas eller när id/isAuthenticated ändras.
  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      setIsLoading(true)
      setError('')
      try {
        const bookData = await getBookById(id)
        setBook(bookData)

        const reviewsData = await getReviewsByBook(id)
        setReviews(reviewsData)

        if (isAuthenticated) {
          const userReviewData = await getUserReviewForBook(id)
          setUserReview(userReviewData)

          const favData = await getFavorites()
          const isFav = favData.some((f: { bookId: string }) => f.bookId === id)
          setIsFavorite(isFav)
        }
      } catch {
        setError('Något gick fel, försök igen')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id, isAuthenticated])

  const handleFavorite = async () => {
    try {
      if (isFavorite) {
        await deleteFavorite(id!)
        setIsFavorite(false)
      } else {
        await addFavorite(id!)
        setIsFavorite(true)
      }
    } catch {
      console.error('Kunde inte uppdatera favorit')
    }
  }

  const handleReviewSaved = async () => {
    const reviewsData = await getReviewsByBook(id!)
    setReviews(reviewsData)
    const userReviewData = await getUserReviewForBook(id!)
    setUserReview(userReviewData)
  }

  const handleReviewDeleted = async () => {
    const reviewsData = await getReviewsByBook(id!)
    setReviews(reviewsData)
    setUserReview(null)
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

  if (error || !book) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{error || 'Boken hittades inte'}</div>
      </div>
    )
  }

  const info = book.volumeInfo
  const coverUrl = info.imageLinks?.thumbnail
    ?.replace('http://', 'https://')
    ?? ''

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : null

  const isbn = info.industryIdentifiers?.find(
    (i: { type: string, identifier: string }) => i.type === 'ISBN_13'
  )?.identifier ?? info.industryIdentifiers?.[0]?.identifier ?? null

  return (
    <div className="container py-4" style={{ maxWidth: '1200px' }}>

      {/* ===== BOKINFORMATION ===== */}
      <div className="row g-4 mb-5">

        {/* Omslag */}
        <div className="col-12 col-sm-auto">
          <div className="position-relative" style={{ width: '128px' }}>
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={info.title}
                style={{ width: '128px', height: 'auto' }}
                className="rounded"
              />
            ) : (
              <div
                className="bg-secondary rounded d-flex align-items-center justify-content-center"
                style={{ width: '128px', height: '192px' }}
              >
                <i className="bi bi-book" style={{ fontSize: '2rem', color: 'white' }}></i>
              </div>
            )}

            {/* Favorit-ikon */}
            {isAuthenticated && (
              <button
                className="position-absolute top-0 end-0 m-1 d-flex align-items-center justify-content-center rounded-circle border-0"
                style={{ background: 'rgba(255,255,255,0.7)', width: '32px', height: '32px', cursor: 'pointer' }}
                onClick={handleFavorite}
                aria-label={isFavorite ? 'Ta bort favorit' : 'Lägg till favorit'}
              >
                <i
                  className={isFavorite ? 'bi bi-heart-fill' : 'bi bi-heart'}
                  style={{ color: '#212529', fontSize: '1.2rem' }}
                />
              </button>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="col-12 col-sm">

          {/* Titel */}
          <h1 className="fw-bold mb-1" style={{ fontSize: '1.5rem' }}>{info.title}</h1>

          {/* Snittbetyg */}
          {avgRating !== null ? (
            <div className="d-flex align-items-center gap-2 mb-1">
              <StarRating rating={Math.round(avgRating)} />
              <span className="text-muted small">
                {avgRating.toFixed(1)} / 5 ({reviews.length} {reviews.length === 1 ? 'recension' : 'recensioner'})
              </span>
            </div>
          ) : (
            <p className="mb-1 text-muted small">Inga recensioner ännu</p>
          )}

          {/* Författare */}
          {info.authors && (
            <p className="text-muted mb-3">{info.authors.join(', ')}</p>
          )}

          {/* Beskrivning */}
          {info.description && (
            <div
              className="mb-3"
              style={{ fontSize: '0.9rem', maxWidth: '700px' }}
              dangerouslySetInnerHTML={{ __html: info.description }}
            />
          )}

          {/* Metadata */}
          <div className="text-muted small">
            {info.categories && (
              <p className="mb-1" style={{ maxWidth: '700px' }}><strong>Genre:</strong> {info.categories.join(', ')}</p>
            )}
            {isbn && (
              <p className="mb-1"><strong>ISBN:</strong> {isbn}</p>
            )}
            {info.pageCount && (
              <p className="mb-1"><strong>Sidantal:</strong> {info.pageCount}</p>
            )}
            {info.publishedDate && (
              <p className="mb-1"><strong>Utgiven:</strong> {info.publishedDate}</p>
            )}
            {info.language && (
              <p className="mb-1"><strong>Språk:</strong> {info.language.toUpperCase()}</p>
            )}
          </div>
        </div>
      </div>

      <hr />

      {/* ===== RECENSIONSFORMULÄR ===== */}
      {isAuthenticated ? (
        <ReviewForm
          bookId={id!}
          existingReview={userReview}
          onReviewSaved={handleReviewSaved}
          onReviewDeleted={handleReviewDeleted}
        />
      ) : (
        <p className="text-muted">
          <Link to="/login" className="text-dark fw-bold">Logga in</Link> för att lämna en recension
        </p>
      )}

      <hr />

      {/* ===== RECENSIONSLISTA ===== */}
      <ReviewList
        reviews={reviews}
        onReviewDeleted={handleReviewDeleted}
      />
    </div>
  )
}

export default BookDetailPage