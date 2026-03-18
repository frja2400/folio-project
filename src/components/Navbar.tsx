import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

// Navigationskomponent som visas på alla sidor. Innehåller logotyp, sökfält och navigeringslänkar som anpassas efter användarens inloggningsstatus och roll.
const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth()
    const navigate = useNavigate()
    const [query, setQuery] = useState('')
    const [searchType, setSearchType] = useState('intitle')

    const searchTypes = [
        { label: 'Titel', value: 'intitle' },
        { label: 'Författare', value: 'inauthor' },
        { label: 'ISBN', value: 'isbn' },
    ]

    const handleSearch = (e: React.SyntheticEvent) => {
        e.preventDefault()
        if (!query.trim()) return
        const params = new URLSearchParams()
        params.set('q', query.trim())
        params.set('type', searchType)
        navigate(`/search?${params.toString()}`)
    }

    const handleLogout = () => {
        logout()
        setQuery('')
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
                <>
                    <Link to="/" className="fw-bold text-white text-decoration-none px-2 py-1 rounded" style={{ backgroundColor: '#212529', minWidth: '80px', textAlign: 'center' }}>FOLIO</Link>
                    <Link to="/login" className="btn btn-outline-dark btn-sm" style={{ minWidth: '80px' }}>Logga in</Link>
                </>
            )
        }
        if (user?.role === 'admin') {
            return (
                <>
                    <Link to="/" className="fw-bold text-white text-decoration-none px-2 py-1 rounded" style={{ backgroundColor: '#212529', minWidth: '80px', textAlign: 'center' }}>FOLIO</Link>
                    <Link to="/admin" className="btn btn-outline-dark btn-sm" style={{ minWidth: '80px' }}>Admin</Link>
                    <Link to="/profile" className="btn btn-outline-dark btn-sm" style={{ minWidth: '80px' }}>Min profil</Link>
                </>
            )
        }
        return (
            <>
                <Link to="/" className="fw-bold text-white text-decoration-none px-2 py-1 rounded" style={{ backgroundColor: '#212529', minWidth: '80px', textAlign: 'center' }}>FOLIO</Link>
                <Link to="/profile" className="btn btn-outline-dark btn-sm" style={{ minWidth: '80px' }}>Min profil</Link>
            </>
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

                            {/* Söktyp */}
                            <select
                                className="form-select"
                                style={{ maxWidth: '130px' }}
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                            >
                                {searchTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>

                            {/* Fritext */}
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Sök..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />

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

                    {/* Rad 1 — FOLIO + navigeringslänkar */}
                    <div className="d-flex align-items-center justify-content-between w-100">
                        {renderMobileLinks()}
                    </div>

                    {/* Rad 2 — Söktyp + sökruta */}
                    <form onSubmit={handleSearch}>
                        <div className="input-group">
                            <select
                                className="form-select"
                                style={{ maxWidth: '130px' }}
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                            >
                                {searchTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Sök..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <button type="submit" className="btn btn-dark">
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </nav>
    )
}

export default Navbar