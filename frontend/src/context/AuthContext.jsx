import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { login as loginService, logout as logoutService, getUser } from '../services/authService'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const response = await getUser()
      setUser(response.data)
    } catch {
      localStorage.removeItem('token')
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = async (credentials) => {
    const response = await loginService(credentials)
    const { token: newToken, user: userData } = response.data
    localStorage.setItem('token', newToken)
    setToken(newToken)
    setUser(userData)
    return response.data
  }

  const logout = async () => {
    try {
      await logoutService()
    } catch {
      // ignore
    }
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const isAdmin = user?.rol === 'admin'
  const isVendedor = user?.rol === 'vendedor'
  const isCajero = user?.rol === 'cajero'

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      isAdmin,
      isVendedor,
      isCajero
    }}>
      {children}
    </AuthContext.Provider>
  )
}
