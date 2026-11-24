import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth'
import { t } from '../i18n'
import Preferencias from './Preferencias'
import { etiqueta } from './ui'

const MENU = [
  { ruta: '/', texto: 'Dashboard', icono: '📊' },
  { ruta: '/estudiantes', texto: 'Estudiantes', icono: '🎓' },
  { ruta: '/alertas', texto: 'Alertas', icono: '🔔' },
  { ruta: '/intervenciones', texto: 'Intervenciones', icono: '🤝' },
  { ruta: '/reportes', texto: 'Reportes', icono: '📈' },
  { ruta: '/carga-datos', texto: 'Carga de datos', icono: '📥', roles: ['administrador', 'coordinador'] },
  { ruta: '/modelo', texto: 'Modelo ML', icono: '🧠' },
  { ruta: '/catalogos', texto: 'Catálogos', icono: '🗂️', roles: ['administrador'] },
  { ruta: '/usuarios', texto: 'Usuarios', icono: '👥', roles: ['administrador'] },
]

export default function Layout() {
  const { usuario, logout, tieneRol } = useAuth()
  const [abierto, setAbierto] = useState(false)
  const navegar = useNavigate()

  const salir = () => { logout(); navegar('/login') }

  return (
    <div className="app">
      <a className="saltar" href="#principal">{t('Saltar al contenido')}</a>
      <aside className={`lateral ${abierto ? 'abierto' : ''}`}>
        <div className="marca">
          <img src="/icon.svg" alt="" width="32" height="32" />
          <div><strong>SAT Deserción</strong><small>{t('Alerta temprana')}</small></div>
        </div>
        <nav aria-label={t('Menú principal')}>
          {MENU.filter(m => !m.roles || tieneRol(...m.roles)).map(m => (
            <NavLink key={m.ruta} to={m.ruta} end={m.ruta === '/'} onClick={() => setAbierto(false)}>
              <span aria-hidden>{m.icono}</span> {t(m.texto)}
            </NavLink>
          ))}
        </nav>
      </aside>
      {abierto && <div className="velo" onClick={() => setAbierto(false)} />}
      <div className="contenido">
        <header className="barra">
          <button className="btn-icono menu-movil" onClick={() => setAbierto(!abierto)} aria-label={t('Menú')}>☰</button>
          <Preferencias />
          <div className="usuario">
            <span>{usuario?.nombres} {usuario?.apellidos}</span>
            <small className="rol">{etiqueta(usuario?.rol?.nombre)}</small>
            <button className="btn btn-sec" onClick={salir}>{t('Salir')}</button>
          </div>
        </header>
        <main id="principal" tabIndex={-1}><Outlet /></main>
      </div>
    </div>
  )
}
