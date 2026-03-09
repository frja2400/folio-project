import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User } from '../types/User'

// Definierar vad Context innehåller och kan göra
interface AuthContextType {
    user: User | null           // inloggad användare, null om utloggad
    token: string | null        // JWT-token
    isAuthenticated: boolean    // true om användaren är inloggad
    isLoading: boolean          // håller på att kontrollera om användaren är inloggad
    login: (token: string) => void
    logout: () => void
}

// Skapar Context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider som wrapplar hela appen i App.tsx
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Körs en gång när appen startar, kollar om användaren redan är inloggad
    useEffect(() => {
        const savedToken = localStorage.getItem('token')
        if (savedToken) {
            const decoded = parseToken(savedToken)
            setUser(decoded)
            setToken(savedToken)
        }
        setIsLoading(false)
    }, [])

    // Sparar token i localStorage och uppdaterar state när användaren loggar in
    const login = (newToken: string) => {
        localStorage.setItem('token', newToken)
        const decoded = parseToken(newToken)
        setUser(decoded)
        setToken(newToken)
    }

    // Tar bort token från localStorage och nollställer state
    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
        setToken(null)
    }

    // JWT-token är uppbyggd av tre delar: header, payload och signature. Vi vill ha payloaden som innehåller användarinfo.
    const parseToken = (token: string): User => {
        const payload = JSON.parse(atob(token.split('.')[1]))
        return {
            id: parseInt(payload.id),
            username: payload.username,
            email: payload.email,
            role: payload.role
        }
    }

    const isAuthenticated = !!token

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook för att använda AuthContext
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth måste användas inom AuthProvider')
    }
    return context
}