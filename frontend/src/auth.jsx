import { createContext, useContext, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { api, sesion } from './api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(sesion.usuario())

  const login = async (email, password, captcha) => {
    const datos = await api.login(email, password, captcha)
    sesion.guardar(datos.access_token, datos.usuario)
    setUsuario(datos.usuario)
  }
  const logout = () => {
    sesion.cerrar()
    setUsuario(null)
  }
  const tieneRol = (...roles) => !!usuario && roles.includes(usuario.rol.nombre)

  return <AuthContext.Provider value={{ usuario, login, logout, tieneRol }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)

export function RutaPrivada({ children, roles }) {
  const { usuario, tieneRol } = useAuth()
  if (!usuario) return <Navigate to="/login" replace />
  if (roles && !tieneRol(...roles)) return <Navigate to="/" replace />
  return children
}
