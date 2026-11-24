import { useState } from 'react'
import { api } from '../../api'
import { Campo, MensajeError, Exito, fecha, opciones, useCarga } from '../../components/ui'
import { t } from '../../i18n'

export default function Catalogos() {
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const { datos, recargar } = useCarga(async () => {
    const [facultades, programas, periodos] = await Promise.all([
      api.get('/catalogos/facultades'), api.get('/catalogos/programas'), api.get('/catalogos/periodos'),
    ])
    return { facultades, programas, periodos }
  })
  const [fac, setFac] = useState('')
  const [prog, setProg] = useState({ facultad_id: '', codigo: '', nombre: '', nivel: 'pregrado', duracion_semestres: 10 })
  const [per, setPer] = useState({ codigo: '', fecha_inicio: '', fecha_fin: '', actual: false })

  const enviar = (ruta, cuerpo, limpiar) => async (e) => {
    e.preventDefault(); setError(''); setMensaje('')
    try { await api.post(ruta, cuerpo); setMensaje(t('Guardado correctamente')); limpiar(); recargar() } catch (err) { setError(err.message) }
  }

  if (!datos) return null
  return (
    <>
      <div className="titulo-pagina"><h1>{t('Catálogos')}</h1></div>
      <Exito mensaje={mensaje} /><MensajeError mensaje={error} />
      <section className="rejilla-3">
        <div className="tarjeta">
          <h2>{t('Facultades')}</h2>
          <form onSubmit={enviar('/catalogos/facultades', { nombre: fac }, () => setFac(''))} className="en-linea">
            <input placeholder={t('Nombre de la facultad')} aria-label={t('Nombre de la facultad')} value={fac} onChange={e => setFac(e.target.value)} required />
            <button className="btn">{t('Agregar')}</button>
          </form>
          <ul className="lista">{datos.facultades.map(f => <li key={f.id}>{f.nombre}</li>)}</ul>
        </div>
        <div className="tarjeta">
          <h2>{t('Programas')}</h2>
          <form onSubmit={enviar('/catalogos/programas', { ...prog, facultad_id: Number(prog.facultad_id), duracion_semestres: Number(prog.duracion_semestres) },
            () => setProg({ ...prog, codigo: '', nombre: '' }))}>
            <Campo etiqueta={t('Facultad')}>
              <select value={prog.facultad_id} onChange={e => setProg({ ...prog, facultad_id: e.target.value })} required>
                <option value="">{t('Seleccione…')}</option>
                {datos.facultades.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
              </select>
            </Campo>
            <Campo etiqueta={t('Código')}><input value={prog.codigo} onChange={e => setProg({ ...prog, codigo: e.target.value })} required /></Campo>
            <Campo etiqueta={t('Nombre')}><input value={prog.nombre} onChange={e => setProg({ ...prog, nombre: e.target.value })} required /></Campo>
            <Campo etiqueta={t('Nivel')}>
              <select value={prog.nivel} onChange={e => setProg({ ...prog, nivel: e.target.value })}>
                {opciones(['tecnico', 'tecnologico', 'pregrado', 'especializacion', 'maestria'])}
              </select>
            </Campo>
            <Campo etiqueta={t('Duración (semestres)')}><input type="number" min="1" max="14" value={prog.duracion_semestres} onChange={e => setProg({ ...prog, duracion_semestres: e.target.value })} /></Campo>
            <button className="btn">{t('Agregar programa')}</button>
          </form>
          <ul className="lista">{datos.programas.map(p => <li key={p.id}><b>{p.codigo}</b> {p.nombre} <small className="tenue">({p.facultad.nombre})</small></li>)}</ul>
        </div>
        <div className="tarjeta">
          <h2>{t('Periodos académicos')}</h2>
          <form onSubmit={enviar('/catalogos/periodos', per, () => setPer({ codigo: '', fecha_inicio: '', fecha_fin: '', actual: false }))}>
            <Campo etiqueta={t('Código (AAAA-1 / AAAA-2)')}><input value={per.codigo} onChange={e => setPer({ ...per, codigo: e.target.value })} pattern="\d{4}-[12]" required /></Campo>
            <Campo etiqueta={t('Fecha de inicio')}><input type="date" value={per.fecha_inicio} onChange={e => setPer({ ...per, fecha_inicio: e.target.value })} required /></Campo>
            <Campo etiqueta={t('Fecha de fin')}><input type="date" value={per.fecha_fin} onChange={e => setPer({ ...per, fecha_fin: e.target.value })} required /></Campo>
            <label className="check"><input type="checkbox" checked={per.actual} onChange={e => setPer({ ...per, actual: e.target.checked })} /> {t('Periodo actual')}</label>
            <button className="btn">{t('Agregar periodo')}</button>
          </form>
          <ul className="lista">{datos.periodos.map(p => <li key={p.id}><b>{p.codigo}</b> {fecha(p.fecha_inicio)} – {fecha(p.fecha_fin)} {p.actual && <span className="badge badge-bajo">{t('Actual')}</span>}</li>)}</ul>
        </div>
      </section>
    </>
  )
}
