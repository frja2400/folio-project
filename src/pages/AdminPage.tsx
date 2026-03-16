import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { getAllReviews, getAllUsers, deleteReview, deleteUser } from '../services/adminService'
import { getBookById } from '../services/googleBooksService'
import { useAuth } from '../context/AuthContext'
import StarRating from '../components/StarRating'

// AdminPage är en skyddad sida som endast är tillgänglig för administratörer.
interface AdminReview {
  id: number
  bookId: string
  text: string
  rating: number
  createdAt: string
  username: string
}

interface AdminUser {
  id: number
  username: string
  email: string
  role: string
  createdAt: string
  reviewCount: number
}

// State för att hantera bekräftelsedialog.
interface ConfirmState {
  message: string
  onConfirm: () => void
}

const AdminPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [reviews, setReviews] = useState<AdminReview[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [bookTitles, setBookTitles] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [confirmModal, setConfirmModal] = useState<ConfirmState | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [reviewsData, usersData] = await Promise.all([
          getAllReviews(),
          getAllUsers()
        ])
        setReviews(reviewsData)
        setUsers(usersData)

        // Hämta boktitlar för unika book-IDs
        const uniqueIds = [...new Set(reviewsData.map((r: AdminReview) => r.bookId))] as string[]
        const titles: Record<string, string> = {}
        for (const id of uniqueIds) {
          try {
            const book = await getBookById(id)
            titles[id] = book?.volumeInfo?.title ?? id
          } catch {
            titles[id] = id
          }
        }
        setBookTitles(titles)

      } catch (err) {
        console.error('Kunde inte hämta admindata', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Radera recension
  const handleDeleteReview = async (id: number) => {
    try {
      await deleteReview(id)
      setReviews(prev => prev.filter(r => r.id !== id))
    } catch {
      console.error('Kunde inte radera recensionen')
    }
  }

  // Radera användare (med bekräftelse)
  const handleDeleteUser = (id: number) => {
    setConfirmModal({
      message: 'Är du säker? Användaren och alla dess recensioner raderas permanent.',
      onConfirm: async () => {
        setConfirmModal(null)
        try {
          await deleteUser(id)
          setUsers(prev => prev.filter(u => u.id !== id))
          setReviews(prev => {
            const deletedUser = users.find(u => u.id === id)
            return prev.filter(r => r.username !== deletedUser?.username)
          })
        } catch {
          console.error('Kunde inte radera användaren')
        }
      }
    })
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sv-SE')
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

      {/* ===== ANVÄNDARE ===== */}
      <section className="mb-5">
        <h2 className="fw-bold mb-3 pb-2 border-bottom" style={{ fontSize: '1.2rem' }}>
          Användare ({users.length})
        </h2>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Användarnamn</th>
                <th>Email</th>
                <th>Roll</th>
                <th>Recensioner</th>
                <th>Registrerad</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role === 'admin' ? 'Admin' : 'Användare'}</td>
                  <td>{u.reviewCount}</td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td>
                    {u.role !== 'admin' && (
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDeleteUser(u.id)}
                      >
                        RADERA
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== RECENSIONER ===== */}
      <section className="mb-5">
        <h2 className="fw-bold mb-3 pb-2 border-bottom" style={{ fontSize: '1.2rem' }}>
          Recensioner ({reviews.length})
        </h2>

        {reviews.map(review => (
          <div key={review.id} className="mb-4 pb-4 border-bottom">
            <div className="d-flex flex-wrap align-items-center gap-2">
              <span className="fw-bold">{review.username}</span>
              <Link
                to={`/book/${review.bookId}`}
                className="text-dark"
              >
                {bookTitles[review.bookId] ?? review.bookId}
              </Link>
              <StarRating rating={review.rating} />
              <span className="text-muted small">{formatDate(review.createdAt)}</span>
            </div>

            <p className="mb-3 mt-3">{review.text}</p>

            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => handleDeleteReview(review.id)}
            >
              RADERA
            </button>
          </div>
        ))}
      </section>

      {/* ===== BEKRÄFTELSEDIALOG ===== */}
      {confirmModal && (
        <>
          <div className="modal show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body py-4">
                  <p className="mb-0">{confirmModal.message}</p>
                </div>
                <div className="modal-footer border-0 pt-0">
                  <button
                    className="btn btn-outline-dark btn-sm"
                    onClick={() => setConfirmModal(null)}
                  >
                    AVBRYT
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={confirmModal.onConfirm}
                  >
                    RADERA
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </>
      )}
    </div>
  )
}

export default AdminPage