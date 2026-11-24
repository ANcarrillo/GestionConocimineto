import { useState } from 'react'
import { api } from '../../api'
import { MensajeError, Exito, fechaHora, useCarga } from '../../components/ui'
import { t } from '../../i18n'

export const pct = (v) => (v == null ? '—' : `${(v * 100).toFixed(1)}%`)

// Registrar y activar modelos entrenados (solo administrador)
export default function AdministracionModelos({ onCambio }) {
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const { datos, recargar } = useCarga(async () => {
    const [disponibles, registrados] = await Promise.all([api.get('/modelo/disponibles'), api.get('/modelo')])
    return { disponibles, registrados }
  })
  const accion = async (fn, texto) => {
    setError(''); setMensaje('')
    try { await fn(); setMensaje(t(texto)); recargar(); onCambio() } catch (e) { setError(e.message) }
  }
  if (!datos) return null
  const registradas = new Set(datos.registrados.map(m => m.version))
  return (
    <section className="tarjeta">
      <h2>{t('Administración de modelos')}</h2>
      <Exito mensaje={mensaje} /><MensajeError mensaje={error} />
      <h3>{t('Modelos entrenados en')} <code>ml/models</code></h3>
      {datos.disponibles.length === 0 ? <p className="tenue">{t('No hay modelos. Ejecute')} <code>python -m src.entrenar</code> {t('en la carpeta ml.')}</p> : (
        <div className="tabla-scroll"><table className="tabla">
          <thead><tr><th>{t('Versión')}</th><th>{t('Algoritmo')}</th><th>F1</th><th>AUC-ROC</th><th>Recall</th><th></th></tr></thead>
          <tbody>{datos.disponibles.map(m => (
            <tr key={m.archivo}><td>{m.version}</td><td>{m.algoritmo}</td><td>{pct(m.metricas?.f1)}</td>
              <td>{pct(m.metricas?.auc_roc)}</td><td>{pct(m.metricas?.recall)}</td>
              <td>{registradas.has(m.version) ? <span className="tenue">{t('Registrado')}</span> :
                <button className="btn btn-peq" onClick={() => accion(() => api.post('/modelo/registrar', { archivo: m.archivo, activar: true }), 'Modelo registrado y activado')}>{t('Registrar y activar')}</button>}</td></tr>
          ))}</tbody>
        </table></div>
      )}
      <h3>{t('Modelos registrados')}</h3>
      <div className="tabla-scroll"><table className="tabla">
        <thead><tr><th>{t('Versión')}</th><th>{t('Algoritmo')}</th><th>{t('Entrenado')}</th><th>{t('Estado')}</th><th></th></tr></thead>
        <tbody>
          {datos.registrados.length === 0 && <tr><td colSpan="5" className="tenue">{t('Ninguno.')}</td></tr>}
          {datos.registrados.map(m => (
            <tr key={m.id}><td>{m.version}</td><td>{m.algoritmo}</td><td>{fechaHora(m.fecha_entrenamiento)}</td>
              <td>{m.activo ? <span className="badge badge-bajo">{t('Activo')}</span> : t('Inactivo')}</td>
              <td>{!m.activo && <button className="btn btn-sec btn-peq" onClick={() => accion(() => api.post(`/modelo/${m.id}/activar`), 'Modelo activado')}>{t('Activar')}</button>}</td></tr>
          ))}
        </tbody>
      </table></div>
    </section>
  )
}
