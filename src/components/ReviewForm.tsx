import { useState, useEffect } from 'react'
import { createReview, updateReview, deleteReview } from '../services/reviewService'
import StarRating from './StarRating'
import type { Review } from '../types/Review'

interface ReviewFormProps {
    bookId: string
    existingReview: Review | null
    onReviewSaved: () => void
    onReviewDeleted: () => void
}

const ReviewForm = ({ bookId, existingReview, onReviewSaved, onReviewDeleted }: ReviewFormProps) => {
    const [rating, setRating] = useState(0)
    const [text, setText] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    // Fyll i befintlig recension om den finns
    useEffect(() => {
        if (existingReview) {
            setRating(existingReview.rating)
            setText(existingReview.text)
        } else {
            setRating(0)
            setText('')
        }
    }, [existingReview])

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault()
        setError('')

        if (rating === 0) {
            setError('Välj ett betyg')
            return
        }

        if (!text.trim()) {
            setError('Skriv en recension')
            return
        }

        setIsLoading(true)
        try {
            if (existingReview) {
                await updateReview(existingReview.id, bookId, text, rating)
            } else {
                await createReview(bookId, text, rating)
            }
            onReviewSaved()
        } catch {
            setError('Något gick fel, försök igen')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!existingReview) return
        setIsLoading(true)
        try {
            await deleteReview(existingReview.id)
            onReviewDeleted()
        } catch {
            setError('Något gick fel, försök igen')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="mb-4">
            <h5 className="fw-bold mb-3">
                {existingReview ? 'Din recension' : 'Lämna en recension'}
            </h5>

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Stjärnbetyg */}
                <div className="mb-3">
                    <StarRating
                        rating={rating}
                        interactive={true}
                        onRate={(r) => {
                            setRating(r)
                            setError('')
                        }}
                    />
                </div>

                {/* Recensionstext */}
                <div className="mb-3" style={{ maxWidth: '600px' }}>
                    <textarea
                        className="form-control"
                        rows={4}
                        placeholder="Skriv din recension..."
                        value={text}
                        onChange={(e) => {
                            setText(e.target.value)
                            setError('')
                        }}
                        aria-label="Recensionstext"
                    />
                </div>

                {/* Knappar */}
                <div className="d-flex gap-2">
                    <button
                        type="submit"
                        className="btn btn-dark"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Sparar...
                            </>
                        ) : existingReview ? 'UPPDATERA' : 'SPARA'}
                    </button>

                    {existingReview && (
                        <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={handleDelete}
                            disabled={isLoading}
                        >
                            RADERA
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}

export default ReviewForm