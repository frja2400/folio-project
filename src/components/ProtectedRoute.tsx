import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface ProtectedRouteProps {
    children: React.ReactNode
    requireAdmin?: boolean
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, user } = useAuth()

    if (isLoading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Laddar...</span>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (requireAdmin && user?.role !== 'admin') {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}

export default ProtectedRoute