import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import { useAuth } from '../../auth'
import { Badge, Cargando, MensajeError, Modal, etiqueta, fecha, useCarga } from '../../components/ui'
import { t } from '../../i18n'
import FormIntervencion from './FormIntervencion'

export default function Intervenciones() {
  const { usuario, tieneRol } = useAuth()
  const [estado, setEstado] = useState('')
  const [editando, setEditando] = useState(null)
  const { datos, error, cargando, recargar } = useCarga(() => api.get('/intervenciones', { estado }), [estado])

  return (
    <>
      <div className="titulo-pagina"><h1>{t('Intervenciones')}</h1></div>
      <div className="filtros tarjeta">
        <select value={estado} onChange={e => setEstado(e.target.value)} aria-label={t('Estado')}>
          <option value="">{t('Todos los estados')}</option><option value="programada">{t('Programadas')}</option>
          <option value="realizada">{t('Realizadas')}</option><option value="cancelada">{t('Canceladas')}</option>
        </select>
        <span className="tenue">{t('Para registrar una intervención, abra la ficha del estudiante o la alerta.')}</span>
      </div>
      <MensajeError mensaje={error} />
      {cargando && !datos ? <Cargando /> : (
        <div className="tarjeta tabla-scroll">
          <table className="tabla">
            <thead><tr><th>{t('Fecha')}</th><th>{t('Estudiante')}</th><th>{t('Tipo')}</th><th>{t('Descripción')}</th><th>{t('Resultado')}</th><th>{t('Próx. seguimiento')}</th><th>{t('Estado')}</th><th>{t('Responsable')}</th><th></th></tr></thead>
            <tbody>
              {datos?.length === 0 && <tr><td colSpan="9" className="tenue">{t('Sin intervenciones.')}</td></tr>}
              {datos?.map(i => (
                <tr key={i.id}>
                  <td>{fecha(i.fecha)}</td>
                  <td><Link to={`/estudiantes/${i.estudiante.id}`}>{i.estudiante.nombres} {i.estudiante.apellidos}</Link></td>
                  <td>{etiqueta(i.tipo)}</td><td>{i.descripcion}</td><td>{i.resultado || '—'}</td><td>{fecha(i.proxima_fecha)}</td>
                  <td><Badge valor={i.estado} /></td><td>{i.responsable.nombres} {i.responsable.apellidos}</td>
                  <td>{(i.responsable.id === usuario.id || tieneRol('administrador')) &&
                    <button className="btn btn-sec btn-peq" onClick={() => setEditando(i)}>{t('Editar')}</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal titulo={t('Editar intervención')} abierto={!!editando} onCerrar={() => setEditando(null)}>
        {editando && <FormIntervencion inicial={editando} estudianteId={editando.estudiante_id}
          onGuardado={() => { setEditando(null); recargar() }} />}
      </Modal>
    </>
  )
}
