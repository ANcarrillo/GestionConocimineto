import { useState } from 'react'
import { api } from '../../../api'
import { Campo, MensajeError, opciones } from '../../../components/ui'
import { t } from '../../../i18n'
import { num } from './FormAcademico'

// Datos socioeconómicos de un estudiante en un periodo
export default function FormSocioeconomico({ estudianteId, periodos, onGuardado }) {
  const [f, setF] = useState({
    periodo_id: '', estrato: '', ingreso_familiar: '', trabaja: false, horas_trabajo_semana: 0, personas_a_cargo: 0,
    tipo_vivienda: '', zona_residencia: '', distancia_km: '', tiene_beca: false, apoyo_financiero: false,
    nivel_educativo_padres: '', victima_conflicto: false, pertenece_etnia: false, discapacidad: false,
  })
  const [error, setError] = useState('')
  const c = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const guardar = async (e) => {
    e.preventDefault(); setError('')
    const numeros = ['periodo_id', 'estrato', 'ingreso_familiar', 'horas_trabajo_semana', 'personas_a_cargo', 'distancia_km']
    const datos = Object.fromEntries(Object.entries(f).map(([k, v]) => [k, numeros.includes(k) ? num(v) : v === '' ? null : v]))
    try { await api.post('/datos-academicos/socioeconomicos', { ...datos, estudiante_id: estudianteId }); onGuardado() } catch (err) { setError(err.message) }
  }
  const sel = (k, valores) => (
    <select value={f[k]} onChange={c(k)}><option value="">—</option>{opciones(valores)}</select>
  )
  const chk = (k, texto) => <label className="check"><input type="checkbox" checked={f[k]} onChange={c(k)} /> {t(texto)}</label>
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
        <Campo etiqueta={t('Estrato (0-6)')}><input type="number" min="0" max="6" value={f.estrato} onChange={c('estrato')} /></Campo>
        <Campo etiqueta={t('Ingreso familiar mensual')}><input type="number" min="0" value={f.ingreso_familiar} onChange={c('ingreso_familiar')} /></Campo>
        <Campo etiqueta={t('Horas de trabajo/semana')}><input type="number" min="0" max="80" value={f.horas_trabajo_semana} onChange={c('horas_trabajo_semana')} disabled={!f.trabaja} /></Campo>
        <Campo etiqueta={t('Personas a cargo')}><input type="number" min="0" value={f.personas_a_cargo} onChange={c('personas_a_cargo')} /></Campo>
        <Campo etiqueta={t('Tipo de vivienda')}>{sel('tipo_vivienda', ['propia', 'arriendo', 'familiar', 'residencia', 'otra'])}</Campo>
        <Campo etiqueta={t('Zona de residencia')}>{sel('zona_residencia', ['urbana', 'rural'])}</Campo>
        <Campo etiqueta={t('Distancia a la sede (km)')}><input type="number" min="0" step="0.1" value={f.distancia_km} onChange={c('distancia_km')} /></Campo>
        <Campo etiqueta={t('Nivel educativo de los padres')}>{sel('nivel_educativo_padres', ['ninguno', 'primaria', 'secundaria', 'tecnico', 'universitario', 'posgrado'])}</Campo>
      </div>
      <div className="checks">
        {chk('trabaja', 'Trabaja')}{chk('tiene_beca', 'Tiene beca')}{chk('apoyo_financiero', 'Apoyo financiero')}
        {chk('victima_conflicto', 'Víctima del conflicto')}{chk('pertenece_etnia', 'Pertenece a etnia')}{chk('discapacidad', 'Discapacidad')}
      </div>
      <div className="acciones"><button className="btn">{t('Guardar')}</button></div>
    </form>
  )
}
