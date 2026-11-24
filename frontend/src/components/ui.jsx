import { useCallback, useEffect, useState } from 'react'
import { locale, t } from '../i18n'

// Hook para cargar datos de la API con estado de carga y error
export function useCarga(funcion, dependencias = []) {
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const recargar = useCallback(async () => {
    setCargando(true)
    setError('')
    try { setDatos(await funcion()) } catch (e) { setError(e.message) } finally { setCargando(false) }
  }, dependencias)
  useEffect(() => { recargar() }, [recargar])
  return { datos, error, cargando, recargar, setDatos }
}

export const Cargando = () => <div className="cargando" role="status">{t('Cargando…')}</div>
export const MensajeError = ({ mensaje }) => (mensaje ? <div className="aviso error" role="alert">{mensaje}</div> : null)
export const Exito = ({ mensaje }) => (mensaje ? <div className="aviso exito" role="status">{mensaje}</div> : null)

const ETIQUETAS = {
  bajo: 'Bajo', medio: 'Medio', alto: 'Alto', sin_prediccion: 'Sin predicción',
  pendiente: 'Pendiente', en_proceso: 'En proceso', atendida: 'Atendida', cerrada: 'Cerrada',
  programada: 'Programada', realizada: 'Realizada', cancelada: 'Cancelada',
  activo: 'Activo', desertor: 'Desertor', graduado: 'Graduado', retirado: 'Retirado', inactivo: 'Inactivo',
  prediccion_ml: 'Predicción ML', academica: 'Académica', asistencia: 'Asistencia',
  socioeconomica: 'Socioeconómica', manual: 'Manual',
  // roles
  administrador: 'Administrador', coordinador: 'Coordinador', docente: 'Docente', bienestar: 'Bienestar',
  // tipos de intervención
  tutoria: 'Tutoría', psicologica: 'Psicológica', financiera: 'Financiera', familiar: 'Familiar',
  seguimiento: 'Seguimiento', otra: 'Otra',
  // matrícula
  matriculado: 'Matriculado', cancelado: 'Cancelado', aplazado: 'Aplazado', no_matriculado: 'No matriculado',
  // socioeconómicos
  propia: 'Propia', arriendo: 'Arriendo', residencia: 'Residencia', urbana: 'Urbana', rural: 'Rural',
  ninguno: 'Ninguno', primaria: 'Primaria', secundaria: 'Secundaria', tecnico: 'Técnico',
  universitario: 'Universitario', posgrado: 'Posgrado',
  // niveles de programa y colegio
  tecnologico: 'Tecnológico', pregrado: 'Pregrado', especializacion: 'Especialización', maestria: 'Maestría',
  publico: 'Público', privado: 'Privado',
}
// Texto visible (y traducido) de un valor interno de la base de datos
export const etiqueta = (v) => (ETIQUETAS[v] ? t(ETIQUETAS[v]) : v)

// <select> con opciones cuyo valor interno no cambia pero el texto sí se traduce
export const opciones = (valores) => valores.map(v => <option key={v} value={v}>{etiqueta(v)}</option>)

export function Badge({ valor }) {
  return <span className={`badge badge-${valor || 'sin_prediccion'}`}>{etiqueta(valor || 'sin_prediccion')}</span>
}

export function Riesgo({ riesgo }) {
  if (!riesgo) return <Badge valor="sin_prediccion" />
  return (
    <span className="riesgo">
      <Badge valor={riesgo.nivel_riesgo} />
      <small>{(riesgo.probabilidad * 100).toFixed(0)}%</small>
    </span>
  )
}

export function Modal({ titulo, abierto, onCerrar, children }) {
  useEffect(() => {
    if (!abierto) return
    const escape = (e) => { if (e.key === 'Escape') onCerrar() }
    document.addEventListener('keydown', escape)
    return () => document.removeEventListener('keydown', escape)
  }, [abierto, onCerrar])
  if (!abierto) return null
  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={titulo}>
        <div className="modal-cabecera">
          <h3>{titulo}</h3>
          <button className="btn-icono" onClick={onCerrar} aria-label={t('Cerrar')}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Paginacion({ total, pagina, porPagina, onCambiar }) {
  const paginas = Math.max(1, Math.ceil(total / porPagina))
  return (
    <div className="paginacion">
      <span>{t('{n} registros', { n: total })}</span>
      <button className="btn btn-sec" disabled={pagina <= 1} onClick={() => onCambiar(pagina - 1)}>‹ {t('Anterior')}</button>
      <span>{t('Página {a} de {b}', { a: pagina, b: paginas })}</span>
      <button className="btn btn-sec" disabled={pagina >= paginas} onClick={() => onCambiar(pagina + 1)}>{t('Siguiente')} ›</button>
    </div>
  )
}

export function Campo({ etiqueta: texto, children, ancho }) {
  return (
    <label className={`campo ${ancho ? 'campo-ancho' : ''}`}>
      <span>{texto}</span>
      {children}
    </label>
  )
}

export const fecha = (v) => (v ? new Date(v.length === 10 ? v + 'T00:00:00' : v).toLocaleDateString(locale()) : '—')
export const fechaHora = (v) => (v ? new Date(v).toLocaleString(locale(), { dateStyle: 'short', timeStyle: 'short' }) : '—')
export const numero = (v) => Number(v).toLocaleString(locale())
