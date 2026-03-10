import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()
    const [query, setQuery] = useState('')
    const [subject, setSubject] = useState('')

    const genres = [
        { label: 'Alla genrer', value: '' },
        { label: 'Fantasy', value: 'fantasy' },
        { label: 'Science Fiction', value: 'science+fiction' },
        { label: 'Thriller', value: 'thriller' },
        { label: 'Romance', value: 'romance' },
        { label: 'Deckare', value: 'mystery' },
        { label: 'Skräck', value: 'horror' },
        { label: 'Historia', value: 'history' },
        { label: 'Biografi', value: 'biography' },
        { label: 'Barn', value: 'juvenile+fiction' },
    ]

    const handleSearch = (e: React.SyntheticEvent) => {
        e.preventDefault()
        if (!query.trim() && !subject) return
        const params = new URLSearchParams()
        if (query.trim()) params.set('q', query.trim())
        if (subject) params.set('subject', subject)
        navigate(`/search?${params.toString()}`)
    }

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    // Desktop
    const renderDesktopLinks = () => {
        if (!isAuthenticated) {
            return (
                <Link to="/login" className="btn btn-outline-dark btn-sm" style={{ minWidth: '85px' }}>
                    Logga in
                </Link>
            )
        }
        return (
            <div className="d-flex gap-2 align-items-center">
                {user?.role === 'admin' && (
                    <Link to="/admin" className="btn btn-outline-dark btn-sm" style={{ minWidth: '85px' }}>Admin</Link>
                )}
                <Link to="/profile" className="btn btn-outline-dark btn-sm" style={{ minWidth: '85px' }}>Min profil</Link>
                <button onClick={handleLogout} className="btn btn-outline-dark btn-sm" style={{ minWidth: '85px' }}>Logga ut</button>
            </div>
        )
    }

    // Mobil
    const renderMobileLinks = () => {
        if (!isAuthenticated) {
            return (
                <div className="d-flex justify-content-end">
                    <Link to="/login" className="btn btn-outline-dark btn-sm" style={{ minWidth: '85px' }}>Logga in</Link>
                </div>
            )
        }
        return (
            <div className="d-flex justify-content-between align-items-center w-100">
                {user?.role === 'admin' && (
                    <Link to="/admin" className="btn btn-outline-dark btn-sm" style={{ minWidth: '85px' }}>Admin</Link>
                )}
                <Link to="/profile" className="btn btn-outline-dark btn-sm" style={{ minWidth: '85px' }}>Min profil</Link>
                <button onClick={handleLogout} className="btn btn-outline-dark btn-sm" style={{ minWidth: '85px' }}>Logga ut</button>
            </div>
        )
    }

    return (
        <nav className="navbar bg-white border-bottom py-2">
            <div className="container" style={{ maxWidth: '1200px' }}>

                {/* ===== DESKTOP ===== */}
                <div className="d-none d-lg-flex w-100 align-items-center justify-content-between">

                    <form className="d-flex" style={{ width: '650px' }} onSubmit={handleSearch}>
                        <div className="input-group">

                            {/* Logotyp */}
                            <Link
                                className="input-group-text fw-bold text-white text-decoration-none"
                                style={{ backgroundColor: '#212529' }}
                                to="/"
                            >
                                FOLIO
                            </Link>

                            {/* Fritext */}
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Sök titel, författare, ISBN..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />

                            {/* Genre */}
                            <select
                                className="form-select"
                                style={{ maxWidth: '160px' }}
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            >
                                {genres.map((genre) => (
                                    <option key={genre.value} value={genre.value}>
                                        {genre.label}
                                    </option>
                                ))}
                            </select>

                            {/* Sökknapp */}
                            <button type="submit" className="btn btn-dark">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </form>

                    {renderDesktopLinks()}
                </div>

                {/* ===== MOBIL ===== */}
                <div className="d-flex d-lg-none flex-column w-100 gap-2">

                    {/* Rad 1 — Navigeringslänkar */}
                    {renderMobileLinks()}

                    {/* Rad 2 — Sökruta */}
                    <form onSubmit={handleSearch}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Sök titel, författare, ISBN..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </form>

                    {/* Rad 3 — Genre + sökknapp */}
                    <form className="d-flex gap-2" onSubmit={handleSearch}>
                        <select
                            className="form-select"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        >
                            {genres.map((genre) => (
                                <option key={genre.value} value={genre.value}>
                                    {genre.label}
                                </option>
                            ))}
                        </select>
                        <button type="submit" className="btn btn-dark">
                            <i className="bi bi-search"></i>
                        </button>
                    </form>
                </div>

            </div>
        </nav>
    )
}

export default Navbar