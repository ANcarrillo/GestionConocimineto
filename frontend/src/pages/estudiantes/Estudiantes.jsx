import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../../api'
import { useAuth } from '../../auth'
import { Badge, Cargando, MensajeError, Paginacion, Riesgo, opciones, useCarga } from '../../components/ui'
import { t } from '../../i18n'

export const ESTADOS_ESTUDIANTE = ['activo', 'desertor', 'graduado', 'retirado', 'inactivo']

export default function Estudiantes() {
  const { tieneRol } = useAuth()
  const navegar = useNavigate()
  const [filtros, setFiltros] = useState({ q: '', programa_id: '', semestre: '', estado: 'activo', nivel_riesgo: '', orden: 'riesgo' })
  const [busqueda, setBusqueda] = useState(filtros)
  const [pagina, setPagina] = useState(1)

  const programas = useCarga(() => api.get('/catalogos/programas'))
  const { datos, error, cargando } = useCarga(
    () => api.get('/estudiantes', { ...busqueda, pagina, por_pagina: 20 }), [busqueda, pagina])

  const cambiar = (campo) => (e) => setFiltros({ ...filtros, [campo]: e.target.value })
  const buscar = (e) => { e.preventDefault(); setPagina(1); setBusqueda(filtros) }

  return (
    <>
      <div className="titulo-pagina">
        <h1>{t('Estudiantes')}</h1>
        {tieneRol('administrador', 'coordinador') && <Link className="btn" to="/estudiantes/nuevo">+ {t('Nuevo estudiante')}</Link>}
      </div>

      <form className="filtros tarjeta" onSubmit={buscar}>
        <input placeholder={t('Buscar por código, documento o nombre')} aria-label={t('Buscar')} value={filtros.q} onChange={cambiar('q')} />
        <select value={filtros.programa_id} onChange={cambiar('programa_id')} aria-label={t('Programa')}>
          <option value="">{t('Todos los programas')}</option>
          {programas.datos?.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
        <select value={filtros.semestre} onChange={cambiar('semestre')} aria-label={t('Semestre')}>
          <option value="">{t('Todos los semestres')}</option>
          {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{t('Semestre')} {i + 1}</option>)}
        </select>
        <select value={filtros.estado} onChange={cambiar('estado')} aria-label={t('Estado')}>
          <option value="">{t('Todos los estados')}</option>
          {opciones(ESTADOS_ESTUDIANTE)}
        </select>
        <select value={filtros.nivel_riesgo} onChange={cambiar('nivel_riesgo')} aria-label={t('Nivel de riesgo')}>
          <option value="">{t('Todo nivel de riesgo')}</option>
          {opciones(['alto', 'medio', 'bajo', 'sin_prediccion'])}
        </select>
        <select value={filtros.orden} onChange={cambiar('orden')} aria-label={t('Orden')}>
          <option value="riesgo">{t('Ordenar por riesgo')}</option><option value="nombre">{t('Ordenar por nombre')}</option>
        </select>
        <button className="btn">{t('Buscar')}</button>
      </form>

      <MensajeError mensaje={error} />
      {cargando && !datos ? <Cargando /> : datos && (
        <div className="tarjeta">
          <div className="tabla-scroll">
            <table className="tabla">
              <thead>
                <tr><th>{t('Código')}</th><th>{t('Nombre')}</th><th>{t('Programa')}</th><th>{t('Sem.')}</th><th>{t('Estado')}</th><th>{t('Riesgo')}</th></tr>
              </thead>
              <tbody>
                {datos.items.length === 0 && <tr><td colSpan="6" className="tenue">{t('No se encontraron estudiantes.')}</td></tr>}
                {datos.items.map(e => (
                  <tr key={e.id} className="fila-click" onClick={() => navegar(`/estudiantes/${e.id}`)}>
                    <td>{e.codigo}</td>
                    <td><Link to={`/estudiantes/${e.id}`}>{e.nombres} {e.apellidos}</Link></td>
                    <td>{e.programa.nombre}</td>
                    <td>{e.semestre_actual}</td>
                    <td><Badge valor={e.estado} /></td>
                    <td><Riesgo riesgo={e.riesgo} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Paginacion total={datos.total} pagina={pagina} porPagina={20} onCambiar={setPagina} />
        </div>
      )}
    </>
  )
}
