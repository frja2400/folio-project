import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { register as registerService, login as loginService } from '../services/authService'
import axios from 'axios'

const RegisterPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setError('')

    // Validera att fälten är ifyllda
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Fyll i alla fält')
      return
    }

    // Validera att lösenorden matchar
    if (password !== confirmPassword) {
      setError('Lösenorden matchar inte')
      return
    }

    // Validera lösenord
    if (password.length < 8) {
      setError('Lösenordet måste vara minst 8 tecken')
      return
    }

    if (!/[0-9]/.test(password)) {
      setError('Lösenordet måste innehålla minst en siffra')
      return
    }

    setIsLoading(true)

    try {
      await registerService(username, email, password)
      const token = await loginService(email, password)
      login(token)
      navigate('/')
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const message = err.response.data
        if (message.includes('Email')) {
          setError('Det finns redan ett konto med denna e-postadress')
        } else if (message.includes('Användarnamnet')) {
          setError('Användarnamnet är redan taget, välj ett annat')
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
          <i className="bi bi-person-plus" style={{ fontSize: '64px', color: '#212529' }}></i>
        </div>

        {/* Felmeddelande */}
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
              placeholder="Användarnamn"
              aria-label="Användarnamn"
            />
          </div>
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
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setError('')
              }}
              placeholder="Upprepa lösenord"
              aria-label="Upprepa lösenord"
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
                Skapar konto...
              </>
            ) : (
              'SKAPA KONTO'
            )}
          </button>
        </form>

        <p className="mt-3 text-center">
          Har du redan ett konto?{' '}
          <Link to="/login" className="text-dark fw-bold">
            Logga in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage