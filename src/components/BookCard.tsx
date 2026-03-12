import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { addFavorite, deleteFavorite } from '../services/favoriteService'
import StarRating from './StarRating'
import type { Book } from '../types/Book'

interface BookCardProps {
    book: Book
    avgRating?: number
    isFavorite?: boolean
    onFavoriteChange?: (bookId: string, isFavorite: boolean) => void
}

const BookCard = ({ book, avgRating, isFavorite = false, onFavoriteChange }: BookCardProps) => {
    const { isAuthenticated, token } = useAuth()

    const handleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault() // förhindra navigation vid klick på favorit
        if (!isAuthenticated || !token) return

        try {
            if (isFavorite) {
                await deleteFavorite(book.id)
                onFavoriteChange?.(book.id, false)
            } else {
                await addFavorite(book.id)
                onFavoriteChange?.(book.id, true)
            }
        } catch (err) {
            console.error('Kunde inte uppdatera favorit', err)
        }
    }

    const coverUrl = book.volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') ?? ''

    const title = book.volumeInfo.title ?? 'Okänd titel'
    const authors = book.volumeInfo.authors?.join(', ') ?? 'Okänd författare'

    return (
        <Link to={`/book/${book.id}`} className="text-decoration-none text-dark">
            <div className="card h-100 border-0 shadow-sm">

                {/* Bokomslag */}
                <div className="position-relative">
                    {coverUrl ? (
                        <img
                            src={coverUrl}
                            alt={title}
                            className="card-img-top"
                            style={{ height: '200px', objectFit: 'contain', backgroundColor: '#6c757d' }}
                        />
                    ) : (
                        <div
                            className="card-img-top bg-secondary d-flex align-items-center justify-content-center"
                            style={{ height: '200px' }}
                        >
                            <i className="bi bi-book" style={{ fontSize: '2rem', color: 'white' }}></i>
                        </div>
                    )}

                    {/* Favorit-ikon */}
                    {isAuthenticated && (
                        <button
                            className="position-absolute top-0 end-0 m-1 d-flex align-items-center justify-content-center rounded-circle border-0"
                            style={{ background: 'rgba(255,255,255,0.7)', width: '32px', height: '32px', padding: 0, cursor: 'pointer' }}
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

                {/* Kortinfo */}
                <div className="card-body p-2">
                    <h6 className="card-title mb-1" style={{
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}>
                        {title}
                    </h6>
                    <p className="card-text text-muted small mb-2">{authors}</p>

                    {/* Betyg */}
                    {avgRating !== undefined && avgRating > 0 && (
                        <StarRating rating={Math.round(avgRating)} />
                    )}
                </div>
            </div>
        </Link>
    )
}

export default BookCard