import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../api'
import { Campo, Cargando, MensajeError, opciones, useCarga } from '../../components/ui'
import { t } from '../../i18n'
import { ESTADOS_ESTUDIANTE } from './Estudiantes'

const VACIO = {
  codigo: '', tipo_documento: 'CC', numero_documento: '', nombres: '', apellidos: '', fecha_nacimiento: '',
  genero: '', email: '', telefono: '', programa_id: '', periodo_ingreso_id: '', semestre_actual: 1,
  puntaje_saber11: '', tipo_colegio: '', estado: 'activo',
}

// Convierte '' en null y los campos numéricos a número antes de enviar
function limpiar(f) {
  const numeros = ['programa_id', 'periodo_ingreso_id', 'semestre_actual', 'puntaje_saber11']
  return Object.fromEntries(Object.entries(f).map(([k, v]) => [k, v === '' ? null : numeros.includes(k) ? Number(v) : v]))
}

export default function EstudianteForm() {
  const { id } = useParams()
  const navegar = useNavigate()
  const [form, setForm] = useState(VACIO)
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  const catalogos = useCarga(async () => {
    const [programas, periodos] = await Promise.all([api.get('/catalogos/programas'), api.get('/catalogos/periodos')])
    return { programas, periodos }
  })

  useEffect(() => {
    if (!id) return
    api.get(`/estudiantes/${id}`).then(e => {
      setForm(Object.fromEntries(Object.keys(VACIO).map(k => [k, e[k] ?? ''])))
    }).catch(err => setError(err.message))
  }, [id])

  const cambiar = (campo) => (e) => setForm({ ...form, [campo]: e.target.value })

  const guardar = async (e) => {
    e.preventDefault()
    setError(''); setGuardando(true)
    try {
      const datos = limpiar(form)
      const est = id ? await api.put(`/estudiantes/${id}`, (({ codigo, ...resto }) => resto)(datos))
        : await api.post('/estudiantes', datos)
      navegar(`/estudiantes/${est.id}`)
    } catch (err) { setError(err.message) } finally { setGuardando(false) }
  }

  if (catalogos.cargando) return <Cargando />
  const { programas = [], periodos = [] } = catalogos.datos || {}

  return (
    <>
      <div className="titulo-pagina"><h1>{id ? t('Editar estudiante') : t('Nuevo estudiante')}</h1></div>
      <MensajeError mensaje={catalogos.error || error} />
      {programas.length === 0 && <div className="aviso">{t('Primero registre facultades y programas en Catálogos.')}</div>}
      <form className="tarjeta formulario" onSubmit={guardar}>
        <h2>{t('Identificación')}</h2>
        <div className="rejilla-campos">
          <Campo etiqueta={`${t('Código estudiantil')} *`}><input value={form.codigo} onChange={cambiar('codigo')} required disabled={!!id} /></Campo>
          <Campo etiqueta={t('Tipo de documento')}>
            <select value={form.tipo_documento} onChange={cambiar('tipo_documento')}>
              {['CC', 'TI', 'CE', 'PA', 'PPT'].map(x => <option key={x}>{x}</option>)}
            </select>
          </Campo>
          <Campo etiqueta={`${t('Número de documento')} *`}><input value={form.numero_documento} onChange={cambiar('numero_documento')} required /></Campo>
          <Campo etiqueta={`${t('Nombres')} *`}><input value={form.nombres} onChange={cambiar('nombres')} required /></Campo>
          <Campo etiqueta={`${t('Apellidos')} *`}><input value={form.apellidos} onChange={cambiar('apellidos')} required /></Campo>
          <Campo etiqueta={t('Fecha de nacimiento')}><input type="date" value={form.fecha_nacimiento} onChange={cambiar('fecha_nacimiento')} /></Campo>
          <Campo etiqueta={t('Género')}>
            <select value={form.genero} onChange={cambiar('genero')}>
              <option value="">—</option><option value="femenino">{t('Femenino')}</option>
              <option value="masculino">{t('Masculino')}</option><option value="otro">{t('Otro')}</option>
            </select>
          </Campo>
          <Campo etiqueta={t('Correo')}><input type="email" value={form.email} onChange={cambiar('email')} /></Campo>
          <Campo etiqueta={t('Teléfono')}><input value={form.telefono} onChange={cambiar('telefono')} /></Campo>
        </div>

        <h2>{t('Información académica')}</h2>
        <div className="rejilla-campos">
          <Campo etiqueta={`${t('Programa')} *`}>
            <select value={form.programa_id} onChange={cambiar('programa_id')} required>
              <option value="">{t('Seleccione…')}</option>
              {programas.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </Campo>
          <Campo etiqueta={t('Periodo de ingreso')}>
            <select value={form.periodo_ingreso_id} onChange={cambiar('periodo_ingreso_id')}>
              <option value="">—</option>
              {periodos.map(p => <option key={p.id} value={p.id}>{p.codigo}</option>)}
            </select>
          </Campo>
          <Campo etiqueta={t('Semestre actual')}><input type="number" min="1" max="14" value={form.semestre_actual} onChange={cambiar('semestre_actual')} /></Campo>
          <Campo etiqueta={t('Puntaje Saber 11')}><input type="number" min="0" max="500" value={form.puntaje_saber11} onChange={cambiar('puntaje_saber11')} /></Campo>
          <Campo etiqueta={t('Tipo de colegio')}>
            <select value={form.tipo_colegio} onChange={cambiar('tipo_colegio')}>
              <option value="">—</option>{opciones(['publico', 'privado'])}
            </select>
          </Campo>
          <Campo etiqueta={t('Estado')}>
            <select value={form.estado} onChange={cambiar('estado')}>{opciones(ESTADOS_ESTUDIANTE)}</select>
          </Campo>
        </div>
        <div className="acciones">
          <button type="button" className="btn btn-sec" onClick={() => navegar(-1)}>{t('Cancelar')}</button>
          <button className="btn" disabled={guardando}>{guardando ? t('Guardando…') : t('Guardar')}</button>
        </div>
      </form>
    </>
  )
}
