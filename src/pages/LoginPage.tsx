import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as loginService } from '../services/authService'
import axios from 'axios'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setError('')

    // Validera att fälten är ifyllda
    if (!email.trim() || !password.trim()) {
      setError('Fyll i både email och lösenord')
      return
    }

    setIsLoading(true)

    try {
      // Anropa backend och få JWT-token
      const token = await loginService(email, password)
      // Spara token i AuthContext och localStorage
      login(token)
      // Navigera till startsidan
      navigate('/')
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Fel email eller lösenord')
        } else {
          setError('Något gick fel, försök igen')
        }
      } else {
        setError('Något gick fel, försök igen')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div style={{ width: '400px' }}>

        {/* Profilikon centrerad */}
        <div className="text-center mb-4">
          <i className="bi bi-person-circle" style={{ fontSize: '64px', color: '#212529' }}></i>
        </div>

        {/* Felmeddelande */}
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              placeholder="Email"
              aria-label="Email"
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="Lösenord"
              aria-label="Lösenord"
            />
          </div>
          <button
            type="submit"
            className="btn btn-dark w-100"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Loggar in...
              </>
            ) : (
              'LOGGA IN'
            )}
          </button>
        </form>

        <p className="mt-3 text-center">
          Inget konto?{' '}
          <Link to="/register" className="text-dark fw-bold">
            Registrera dig
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage