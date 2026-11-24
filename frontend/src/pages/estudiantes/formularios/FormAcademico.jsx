import { useState } from 'react'
import { api } from '../../../api'
import { Campo, MensajeError, opciones } from '../../../components/ui'
import { t } from '../../../i18n'

export const num = (v) => (v === '' || v === null || v === undefined ? null : Number(v))

// Datos académicos de un estudiante en un periodo
export default function FormAcademico({ estudianteId, periodos, inicial, onGuardado }) {
  const [f, setF] = useState(inicial || {
    periodo_id: '', semestre_cursado: 1, creditos_inscritos: 0, creditos_aprobados: 0, creditos_reprobados: 0,
    promedio_periodo: '', promedio_acumulado: '', asistencia_pct: '', materias_reprobadas: 0,
    materias_canceladas: 0, materias_repetidas: 0, estado_matricula: 'matriculado',
  })
  const [error, setError] = useState('')
  const c = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const guardar = async (e) => {
    e.preventDefault(); setError('')
    const datos = Object.fromEntries(Object.entries(f).map(([k, v]) => [k, k === 'estado_matricula' ? v : num(v)]))
    try { await api.post('/datos-academicos', { ...datos, estudiante_id: estudianteId }); onGuardado() } catch (err) { setError(err.message) }
  }
  const n = (k, extra = {}) => <input type="number" value={f[k]} onChange={c(k)} {...extra} />
  return (
    <form onSubmit={guardar}>
      <MensajeError mensaje={error} />
      <div className="rejilla-campos">
        <Campo etiqueta={`${t('Periodo')} *`}>
          <select value={f.periodo_id} onChange={c('periodo_id')} required>
            <option value="">{t('Seleccione…')}</option>
            {periodos.map(p => <option key={p.id} value={p.id}>{p.codigo}</option>)}
          </select>
        </Campo>
        <Campo etiqueta={`${t('Semestre cursado')} *`}>{n('semestre_cursado', { min: 1, max: 14, required: true })}</Campo>
        <Campo etiqueta={t('Créditos inscritos')}>{n('creditos_inscritos', { min: 0 })}</Campo>
        <Campo etiqueta={t('Créditos aprobados')}>{n('creditos_aprobados', { min: 0 })}</Campo>
        <Campo etiqueta={t('Créditos reprobados')}>{n('creditos_reprobados', { min: 0 })}</Campo>
        <Campo etiqueta={t('Promedio del periodo (0-5)')}>{n('promedio_periodo', { min: 0, max: 5, step: 0.01 })}</Campo>
        <Campo etiqueta={t('Promedio acumulado (0-5)')}>{n('promedio_acumulado', { min: 0, max: 5, step: 0.01 })}</Campo>
        <Campo etiqueta={t('Asistencia (%)')}>{n('asistencia_pct', { min: 0, max: 100, step: 0.1 })}</Campo>
        <Campo etiqueta={t('Materias reprobadas')}>{n('materias_reprobadas', { min: 0 })}</Campo>
        <Campo etiqueta={t('Materias canceladas')}>{n('materias_canceladas', { min: 0 })}</Campo>
        <Campo etiqueta={t('Materias repetidas')}>{n('materias_repetidas', { min: 0 })}</Campo>
        <Campo etiqueta={t('Estado de matrícula')}>
          <select value={f.estado_matricula} onChange={c('estado_matricula')}>
            {opciones(['matriculado', 'cancelado', 'aplazado', 'no_matriculado'])}
          </select>
        </Campo>
      </div>
      <div className="acciones"><button className="btn">{t('Guardar')}</button></div>
    </form>
  )
}
