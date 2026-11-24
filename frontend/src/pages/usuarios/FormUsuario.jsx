import { useState } from 'react'
import { api } from '../../api'
import { Campo, MensajeError, opciones } from '../../components/ui'
import { t } from '../../i18n'

const ROLES = ['administrador', 'coordinador', 'docente', 'bienestar']

// Crear o editar un usuario del sistema
export default function FormUsuario({ inicial, programas, onGuardado }) {
  const [f, setF] = useState(inicial ? {
    nombres: inicial.nombres, apellidos: inicial.apellidos, email: inicial.email, rol: inicial.rol.nombre,
    activo: inicial.activo, password: '', programas_ids: inicial.programas.map(p => p.id),
  } : { nombres: '', apellidos: '', email: '', rol: 'docente', password: '', programas_ids: [] })
  const [error, setError] = useState('')
  const c = (k) => (e) => setF({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })
  const alternarPrograma = (id) => setF({ ...f, programas_ids: f.programas_ids.includes(id) ? f.programas_ids.filter(x => x !== id) : [...f.programas_ids, id] })

  const guardar = async (e) => {
    e.preventDefault(); setError('')
    try {
      if (inicial) {
        const { email, password, ...resto } = f
        await api.put(`/usuarios/${inicial.id}`, password ? { ...resto, password } : resto)
      } else {
        await api.post('/usuarios', f)
      }
      onGuardado()
    } catch (err) { setError(err.message) }
  }
  return (
    <form onSubmit={guardar}>
      <MensajeError mensaje={error} />
      <div className="rejilla-campos">
        <Campo etiqueta={`${t('Nombres')} *`}><input value={f.nombres} onChange={c('nombres')} required /></Campo>
        <Campo etiqueta={`${t('Apellidos')} *`}><input value={f.apellidos} onChange={c('apellidos')} required /></Campo>
        <Campo etiqueta={`${t('Correo')} *`}><input type="email" value={f.email} onChange={c('email')} required disabled={!!inicial} /></Campo>
        <Campo etiqueta={t('Rol')}><select value={f.rol} onChange={c('rol')}>{opciones(ROLES)}</select></Campo>
        <Campo etiqueta={inicial ? t('Nueva contraseña (opcional)') : t('Contraseña * (mín. 8)')}>
          <input type="password" value={f.password} onChange={c('password')} minLength={8} required={!inicial} autoComplete="new-password" />
        </Campo>
      </div>
      {inicial && <label className="check"><input type="checkbox" checked={f.activo} onChange={c('activo')} /> {t('Usuario activo')}</label>}
      {['coordinador', 'docente'].includes(f.rol) && (
        <>
          <p className="tenue">{t('Programas asignados (si no marca ninguno, verá todos):')}</p>
          <div className="checks">
            {programas.map(p => <label key={p.id} className="check"><input type="checkbox" checked={f.programas_ids.includes(p.id)} onChange={() => alternarPrograma(p.id)} /> {p.nombre}</label>)}
          </div>
        </>
      )}
      <div className="acciones"><button className="btn">{t('Guardar')}</button></div>
    </form>
  )
}
