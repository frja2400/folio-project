import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { addFavorite, deleteFavorite } from '../services/favoriteService'
import type { Book } from '../types/Book'

interface BookCardProps {
    book: Book
    avgRating?: number
    reviewCount?: number
    isFavorite?: boolean
    onFavoriteChange?: (bookId: string, isFavorite: boolean) => void
}

// Komponent som visar en bok i ett kortformat, inklusive omslag, titel, författare, betyg och favoritstatus.
const BookCard = ({ book, avgRating, reviewCount, isFavorite = false, onFavoriteChange }: BookCardProps) => {
    const { isAuthenticated, token } = useAuth()
    const [imgError, setImgError] = useState(false)

    const handleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault()
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

    // Hämta omslagsbild, titel och författare från bokdatat. Använd en placeholder om omslaget inte finns eller inte kan laddas.
    const coverUrl = book.volumeInfo.imageLinks?.thumbnail?.replace('http://', 'https://') ?? ''
    const title = book.volumeInfo.title ?? 'Okänd titel'
    const authors = book.volumeInfo.authors?.join(', ') ?? 'Okänd författare'

    return (
        <Link to={`/book/${book.id}`} className="text-decoration-none text-dark">
            <div style={{ width: '128px' }}>

                {/* Bokomslag */}
                <div className="position-relative">
                    {coverUrl && !imgError ? (
                        <img
                            src={coverUrl}
                            alt={title}
                            style={{ width: '128px', height: '192px', objectFit: 'cover', display: 'block' }}
                            className="rounded"
                            onError={() => setImgError(true)}
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

                {/* Kortinfo */}
                <div className="pt-2">
                    <p className="mb-0 small fw-bold" style={{
                        overflow: 'hidden',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: '1.3'
                    }}>
                        {title}
                    </p>
                    <p className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>{authors}</p>

                    {avgRating !== undefined && avgRating > 0 && (
                        <p className="mb-0 small">
                            <i className="bi bi-star-fill me-1" style={{ color: '#E8A838', fontSize: '0.75rem' }} />
                            {avgRating.toFixed(1)}/5
                            {reviewCount !== undefined && (
                                <span className="text-muted ms-1">({reviewCount})</span>
                            )}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    )
}

export default BookCard