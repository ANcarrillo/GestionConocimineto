import { useState } from 'react'
import { api } from '../../api'
import { Campo, MensajeError, opciones } from '../../components/ui'
import { t } from '../../i18n'

export const TIPOS_INTERVENCION = ['tutoria', 'psicologica', 'financiera', 'academica', 'familiar', 'seguimiento', 'otra']

// Registrar o editar una intervención (se usa en Alertas, Intervenciones y la ficha del estudiante)
export default function FormIntervencion({ estudianteId, alertas = [], alertaId = '', inicial, onGuardado }) {
  const [f, setF] = useState(inicial || {
    tipo: 'tutoria', descripcion: '', fecha: new Date().toISOString().slice(0, 10), resultado: '',
    estado: 'programada', proxima_fecha: '', alerta_id: alertaId,
  })
  const [error, setError] = useState('')
  const c = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const guardar = async (e) => {
    e.preventDefault(); setError('')
    const datos = { ...f, alerta_id: f.alerta_id ? Number(f.alerta_id) : null,
      proxima_fecha: f.proxima_fecha || null, resultado: f.resultado || null }
    try {
      if (inicial?.id) {
        const { id, alerta_id, ...resto } = datos
        await api.put(`/intervenciones/${inicial.id}`, resto)
      } else {
        await api.post('/intervenciones', { ...datos, estudiante_id: estudianteId })
      }
      onGuardado()
    } catch (err) { setError(err.message) }
  }
  return (
    <form onSubmit={guardar}>
      <MensajeError mensaje={error} />
      <div className="rejilla-campos">
        <Campo etiqueta={t('Tipo')}><select value={f.tipo} onChange={c('tipo')}>{opciones(TIPOS_INTERVENCION)}</select></Campo>
        <Campo etiqueta={t('Fecha')}><input type="date" value={f.fecha} onChange={c('fecha')} /></Campo>
        <Campo etiqueta={t('Estado')}>
          <select value={f.estado} onChange={c('estado')}>{opciones(['programada', 'realizada', 'cancelada'])}</select>
        </Campo>
        <Campo etiqueta={t('Próximo seguimiento')}><input type="date" value={f.proxima_fecha || ''} onChange={c('proxima_fecha')} /></Campo>
        {!inicial && alertas.length > 0 && (
          <Campo etiqueta={t('Atiende la alerta')}>
            <select value={f.alerta_id} onChange={c('alerta_id')}>
              <option value="">— {t('Ninguna')} —</option>
              {alertas.map(a => <option key={a.id} value={a.id}>{a.titulo}</option>)}
            </select>
          </Campo>
        )}
      </div>
      <Campo etiqueta={`${t('Descripción')} *`}><textarea rows="3" value={f.descripcion} onChange={c('descripcion')} required minLength={3} /></Campo>
      <Campo etiqueta={t('Resultado')}><textarea rows="2" value={f.resultado || ''} onChange={c('resultado')} /></Campo>
      <div className="acciones"><button className="btn">{t('Guardar')}</button></div>
    </form>
  )
}
