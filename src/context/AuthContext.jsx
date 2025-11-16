import { createContext, useState } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: null,
    role: null
  })

  const login = (token, role) => {
    setAuth({ token, role })
    localStorage.setItem('token', token)
    localStorage.setItem('role', role)
  }

  const logout = () => {
    setAuth({ token: null, role: null })
    localStorage.clear()
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
