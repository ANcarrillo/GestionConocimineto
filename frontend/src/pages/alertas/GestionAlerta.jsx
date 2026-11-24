import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import { Campo, MensajeError, opciones } from '../../components/ui'
import { t } from '../../i18n'
import FormIntervencion from '../intervenciones/FormIntervencion'

export const ESTADOS_ALERTA = ['pendiente', 'en_proceso', 'atendida', 'cerrada']

// Contenido del modal "Gestionar alerta": asignar responsable, cambiar estado y registrar intervención
export default function GestionAlerta({ alerta, responsables, puedeGestionar, onListo }) {
  const [estado, setEstado] = useState(alerta.estado)
  const [asignado, setAsignado] = useState(alerta.asignado_a || '')
  const [error, setError] = useState('')
  const [registrar, setRegistrar] = useState(false)

  const guardar = async () => {
    try {
      await api.put(`/alertas/${alerta.id}`, { estado, asignado_a: asignado ? Number(asignado) : null })
      onListo()
    } catch (e) { setError(e.message) }
  }

  return (
    <>
      <p><b>{alerta.titulo}</b></p>
      <p className="tenue">{alerta.descripcion}</p>
      <p>{t('Estudiante')}: <Link to={`/estudiantes/${alerta.estudiante.id}`}>{alerta.estudiante.nombres} {alerta.estudiante.apellidos}</Link> ({alerta.estudiante.programa.nombre})</p>
      <MensajeError mensaje={error} />
      {puedeGestionar && (
        <div className="rejilla-campos">
          <Campo etiqueta={t('Responsable')}>
            <select value={asignado} onChange={e => setAsignado(e.target.value)}>
              <option value="">— {t('Sin asignar')} —</option>
              {responsables.map(r => <option key={r.id} value={r.id}>{r.nombres} {r.apellidos}</option>)}
            </select>
          </Campo>
          <Campo etiqueta={t('Estado')}>
            <select value={estado} onChange={e => setEstado(e.target.value)}>{opciones(ESTADOS_ALERTA)}</select>
          </Campo>
        </div>
      )}
      <div className="acciones">
        <button className="btn btn-sec" onClick={() => setRegistrar(!registrar)}>{t('Registrar intervención')}</button>
        {puedeGestionar && <button className="btn" onClick={guardar}>{t('Guardar cambios')}</button>}
      </div>
      {registrar && (
        <div className="subtarjeta">
          <FormIntervencion estudianteId={alerta.estudiante_id} alertaId={alerta.id} onGuardado={onListo} />
        </div>
      )}
    </>
  )
}
