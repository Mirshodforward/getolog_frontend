import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('admin_token'))
  const [username, setUsername] = useState(localStorage.getItem('admin_username'))
  const [isAuthenticated, setIsAuthenticated] = useState(!!token)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verify token on mount
    if (token) {
      verifyToken()
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setIsAuthenticated(true)
      } else {
        logout()
      }
    } catch {
      // If backend is down, keep token (don't force logout)
      setIsAuthenticated(true)
    } finally {
      setLoading(false)
    }
  }

  const login = (newToken, newUsername) => {
    localStorage.setItem('admin_token', newToken)
    localStorage.setItem('admin_username', newUsername)
    setToken(newToken)
    setUsername(newUsername)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_username')
    setToken(null)
    setUsername(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ token, username, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
