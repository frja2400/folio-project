import { useAuth } from '../context/AuthContext'
import { deleteReview } from '../services/reviewService'
import StarRating from './StarRating'
import type { Review } from '../types/Review'

interface ReviewListProps {
    reviews: Review[]
    onReviewDeleted: () => void
}

const ReviewList = ({ reviews, onReviewDeleted }: ReviewListProps) => {
    const { user } = useAuth()

    const handleDelete = async (reviewId: number) => {
        try {
            await deleteReview(reviewId)
            onReviewDeleted()
        } catch {
            console.error('Kunde inte radera recensionen')
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('sv-SE')
    }

    if (reviews.length === 0) {
        return <p className="text-muted">Inga recensioner ännu — bli den första!</p>
    }

    return (
        <div>
            <h5 className="fw-bold mb-3">
                Recensioner ({reviews.length})
            </h5>

            {reviews.map((review) => (
                <div key={review.id} className="mb-4 pb-4 border-bottom">

                    <div className="d-flex flex-wrap align-items-center gap-3 mb-2">
                        <span className="fw-bold">{review.username}</span>
                        <span className="text-muted small">{formatDate(review.createdAt)}</span>
                        <StarRating rating={review.rating} />
                    </div>

                    <p className="mb-3">{review.text}</p>

                    {user?.role === 'admin' && (
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(review.id)}
                        >
                            RADERA
                        </button>
                    )}
                </div>
            ))}
        </div>
    )
}

export default ReviewList