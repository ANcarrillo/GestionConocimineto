import { useState } from 'react'
import { api } from '../../../api'
import { Campo, MensajeError, opciones } from '../../../components/ui'
import { t } from '../../../i18n'

// Alerta creada manualmente para un estudiante
export default function FormAlerta({ estudianteId, onGuardado }) {
  const [f, setF] = useState({ titulo: '', nivel: 'medio', descripcion: '' })
  const [error, setError] = useState('')
  const guardar = async (e) => {
    e.preventDefault()
    try { await api.post('/alertas', { ...f, estudiante_id: estudianteId }); onGuardado() } catch (err) { setError(err.message) }
  }
  return (
    <form onSubmit={guardar}>
      <MensajeError mensaje={error} />
      <Campo etiqueta={`${t('Título')} *`}><input value={f.titulo} onChange={e => setF({ ...f, titulo: e.target.value })} required minLength={3} /></Campo>
      <Campo etiqueta={t('Nivel')}>
        <select value={f.nivel} onChange={e => setF({ ...f, nivel: e.target.value })}>{opciones(['bajo', 'medio', 'alto'])}</select>
      </Campo>
      <Campo etiqueta={t('Descripción')}><textarea rows="3" value={f.descripcion} onChange={e => setF({ ...f, descripcion: e.target.value })} /></Campo>
      <div className="acciones"><button className="btn">{t('Crear alerta')}</button></div>
    </form>
  )
}
