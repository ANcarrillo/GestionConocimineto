import { useCallback, useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { api } from '../../api'
import { useAuth } from '../../auth'
import Preferencias from '../../components/Preferencias'
import { MensajeError } from '../../components/ui'
import { t } from '../../i18n'

// Imagen CAPTCHA generada y verificada por el backend (GET /auth/captcha)
function Captcha({ captcha, respuesta, onRespuesta, onRecargar, cargando }) {
  return (
    <div className="campo captcha">
      <span id="captcha-ayuda">{t('Verificación: escriba los caracteres de la imagen')}</span>
      <div className="captcha-imagen">
        {captcha?.imagen
          ? <img src={captcha.imagen} alt={t('Código CAPTCHA')} width="200" height="70" />
          : <div className="captcha-vacia">{cargando ? t('Cargando…') : '—'}</div>}
        <button type="button" className="btn btn-sec" onClick={onRecargar} disabled={cargando}
          aria-label={t('Generar otro código')} title={t('Generar otro código')}>↻</button>
      </div>
      <input value={respuesta} onChange={e => onRespuesta(e.target.value.toUpperCase())} required
        maxLength={8} autoComplete="off" autoCapitalize="characters" spellCheck="false"
        aria-describedby="captcha-ayuda" placeholder={t('Código')} />
    </div>
  )
}

export default function Login() {
  const { usuario, login } = useAuth()
  const navegar = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [captcha, setCaptcha] = useState(null)
  const [respuesta, setRespuesta] = useState('')
  const [cargandoCaptcha, setCargandoCaptcha] = useState(false)
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const nuevoCaptcha = useCallback(async () => {
    setCargandoCaptcha(true)
    setRespuesta('')
    try {
      setCaptcha(await api.captcha())
    } catch (e) {
      setCaptcha(null)
      setError(e.message)
    } finally {
      setCargandoCaptcha(false)
    }
  }, [])

  useEffect(() => { nuevoCaptcha() }, [nuevoCaptcha])

  if (usuario) return <Navigate to="/" replace />

  const enviar = async (e) => {
    e.preventDefault()
    setError('')
    setEnviando(true)
    try {
      await login(email, password, { token: captcha?.captcha_token, respuesta })
      navegar('/')
    } catch (err) {
      setError(err.message)
      nuevoCaptcha() // cada código sirve una sola vez
    } finally {
      setEnviando(false)
    }
  }

  const requiereCaptcha = captcha?.habilitado !== false

  return (
    <div className="login-fondo">
      <div className="login-preferencias"><Preferencias /></div>
      <form className="login" onSubmit={enviar}>
        <img src="/icon.svg" alt="" width="64" height="64" />
        <h1>{t('Alerta temprana de deserción')}</h1>
        <p className="tenue">{t('Ingrese con su correo institucional')}</p>
        <MensajeError mensaje={error} />
        <label className="campo"><span>{t('Correo')}</span>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus autoComplete="username" />
        </label>
        <label className="campo"><span>{t('Contraseña')}</span>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
        </label>
        {requiereCaptcha && (
          <Captcha captcha={captcha} respuesta={respuesta} onRespuesta={setRespuesta}
            onRecargar={nuevoCaptcha} cargando={cargandoCaptcha} />
        )}
        <button className="btn" disabled={enviando || (requiereCaptcha && !captcha)}>
          {enviando ? t('Ingresando…') : t('Ingresar')}
        </button>
      </form>
    </div>
  )
}
