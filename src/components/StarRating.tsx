interface StarRatingProps {
    rating: number        // betyg 1-5
    interactive?: boolean // true = klickbara stjärnor, false = visning endast
    onRate?: (rating: number) => void
}

const StarRating = ({ rating, interactive = false, onRate }: StarRatingProps) => {
    return (
        <div className="d-flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <i
                    key={star}
                    className={star <= rating ? 'bi bi-star-fill' : 'bi bi-star'}
                    style={{
                        color: '#E8A838',
                        fontSize: '1.2rem',
                        cursor: interactive ? 'pointer' : 'default'
                    }}
                    onClick={() => interactive && onRate?.(star)}
                />
            ))}
        </div>
    )
}

export default StarRating