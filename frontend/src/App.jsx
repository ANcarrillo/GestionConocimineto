import { Navigate, Route, Routes } from 'react-router-dom'
import { RutaPrivada } from './auth'
import Layout from './components/Layout'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import Estudiantes from './pages/estudiantes/Estudiantes'
import EstudianteForm from './pages/estudiantes/EstudianteForm'
import EstudianteDetalle from './pages/estudiantes/EstudianteDetalle'
import Alertas from './pages/alertas/Alertas'
import Intervenciones from './pages/intervenciones/Intervenciones'
import Reportes from './pages/reportes/Reportes'
import CargaDatos from './pages/carga-datos/CargaDatos'
import Modelo from './pages/modelo/Modelo'
import Usuarios from './pages/usuarios/Usuarios'
import Catalogos from './pages/catalogos/Catalogos'

export const ROLES = {
  ADMIN: 'administrador', COORD: 'coordinador', DOCENTE: 'docente', BIENESTAR: 'bienestar',
}

export default function App() {
  const { ADMIN, COORD } = ROLES
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RutaPrivada><Layout /></RutaPrivada>}>
        <Route index element={<Dashboard />} />
        <Route path="estudiantes" element={<Estudiantes />} />
        <Route path="estudiantes/nuevo" element={<RutaPrivada roles={[ADMIN, COORD]}><EstudianteForm /></RutaPrivada>} />
        <Route path="estudiantes/:id" element={<EstudianteDetalle />} />
        <Route path="estudiantes/:id/editar" element={<RutaPrivada roles={[ADMIN, COORD]}><EstudianteForm /></RutaPrivada>} />
        <Route path="alertas" element={<Alertas />} />
        <Route path="intervenciones" element={<Intervenciones />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="carga-datos" element={<RutaPrivada roles={[ADMIN, COORD]}><CargaDatos /></RutaPrivada>} />
        <Route path="modelo" element={<Modelo />} />
        <Route path="usuarios" element={<RutaPrivada roles={[ADMIN]}><Usuarios /></RutaPrivada>} />
        <Route path="catalogos" element={<RutaPrivada roles={[ADMIN]}><Catalogos /></RutaPrivada>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
