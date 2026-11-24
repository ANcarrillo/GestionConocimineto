import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../api'
import { useAuth } from '../../auth'
import { Badge, Cargando, MensajeError, Modal, Paginacion, etiqueta, fechaHora, opciones, useCarga } from '../../components/ui'
import { t } from '../../i18n'
import GestionAlerta, { ESTADOS_ALERTA } from './GestionAlerta'

export default function Alertas() {
  const { tieneRol } = useAuth()
  const [filtros, setFiltros] = useState({ estado: 'abiertas', nivel: '', tipo: '', mias: false })
  const [pagina, setPagina] = useState(1)
  const [seleccion, setSeleccion] = useState(null)
  const { datos, error, cargando, recargar } = useCarga(() => api.get('/alertas', { ...filtros, pagina, por_pagina: 20 }), [filtros, pagina])
  const responsables = useCarga(() => api.get('/usuarios/responsables'))
  const cambiar = (k) => (e) => { setPagina(1); setFiltros({ ...filtros, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }) }

  return (
    <>
      <div className="titulo-pagina"><h1>{t('Alertas')}</h1></div>
      <div className="filtros tarjeta">
        <select value={filtros.estado} onChange={cambiar('estado')} aria-label={t('Estado')}>
          <option value="abiertas">{t('Abiertas')}</option><option value="">{t('Todas')}</option>
          {opciones(ESTADOS_ALERTA)}
        </select>
        <select value={filtros.nivel} onChange={cambiar('nivel')} aria-label={t('Nivel')}>
          <option value="">{t('Todo nivel')}</option>{opciones(['alto', 'medio', 'bajo'])}
        </select>
        <select value={filtros.tipo} onChange={cambiar('tipo')} aria-label={t('Tipo')}>
          <option value="">{t('Todo tipo')}</option>
          {opciones(['prediccion_ml', 'academica', 'asistencia', 'socioeconomica', 'manual'])}
        </select>
        <label className="check"><input type="checkbox" checked={filtros.mias} onChange={cambiar('mias')} /> {t('Asignadas a mí')}</label>
      </div>
      <MensajeError mensaje={error} />
      {cargando && !datos ? <Cargando /> : datos && (
        <div className="tarjeta">
          <div className="tabla-scroll"><table className="tabla">
            <thead><tr><th>{t('Fecha')}</th><th>{t('Estudiante')}</th><th>{t('Tipo')}</th><th>{t('Alerta')}</th><th>{t('Nivel')}</th><th>{t('Estado')}</th><th>{t('Responsable')}</th><th></th></tr></thead>
            <tbody>
              {datos.items.length === 0 && <tr><td colSpan="8" className="tenue">{t('No hay alertas con estos filtros.')}</td></tr>}
              {datos.items.map(a => (
                <tr key={a.id}>
                  <td>{fechaHora(a.creado_en)}</td>
                  <td><Link to={`/estudiantes/${a.estudiante.id}`}>{a.estudiante.nombres} {a.estudiante.apellidos}</Link><br /><small className="tenue">{a.estudiante.codigo}</small></td>
                  <td>{etiqueta(a.tipo)}</td><td>{a.titulo}</td><td><Badge valor={a.nivel} /></td><td><Badge valor={a.estado} /></td>
                  <td>{a.responsable ? `${a.responsable.nombres} ${a.responsable.apellidos}` : <span className="tenue">{t('Sin asignar')}</span>}</td>
                  <td><button className="btn btn-sec btn-peq" onClick={() => setSeleccion(a)}>{t('Gestionar')}</button></td>
                </tr>
              ))}
            </tbody>
          </table></div>
          <Paginacion total={datos.total} pagina={pagina} porPagina={20} onCambiar={setPagina} />
        </div>
      )}
      <Modal titulo={t('Gestionar alerta')} abierto={!!seleccion} onCerrar={() => setSeleccion(null)}>
        {seleccion && <GestionAlerta alerta={seleccion} responsables={responsables.datos || []}
          puedeGestionar={tieneRol('administrador', 'coordinador', 'bienestar')}
          onListo={() => { setSeleccion(null); recargar() }} />}
      </Modal>
    </>
  )
}
