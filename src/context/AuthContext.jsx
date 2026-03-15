import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [username, setUsername] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Auto-login on mount
    autoLogin()
  }, [])

  const autoLogin = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
      const data = await res.json()
      if (data.success) {
        const newToken = data.data.token
        const newUsername = data.data.username
        localStorage.setItem('admin_token', newToken)
        localStorage.setItem('admin_username', newUsername)
        setToken(newToken)
        setUsername(newUsername)
      }
    } catch (err) {
      console.log('Auto-login failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const login = (newToken, newUsername) => {
    localStorage.setItem('admin_token', newToken)
    localStorage.setItem('admin_username', newUsername)
    setToken(newToken)
    setUsername(newUsername)
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_username')
    setToken(null)
    setUsername(null)
  }

  return (
    <AuthContext.Provider value={{ token, username, loading, login, logout }}>
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
