import { t } from './i18n'

// Cliente HTTP para la API REST (HTTPS/JSON en producción)
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const CLAVE_TOKEN = 'sat_token'
const CLAVE_USUARIO = 'sat_usuario'

export const sesion = {
  token: () => localStorage.getItem(CLAVE_TOKEN),
  usuario: () => {
    try { return JSON.parse(localStorage.getItem(CLAVE_USUARIO)) } catch { return null }
  },
  guardar: (token, usuario) => {
    localStorage.setItem(CLAVE_TOKEN, token)
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario))
  },
  cerrar: () => {
    localStorage.removeItem(CLAVE_TOKEN)
    localStorage.removeItem(CLAVE_USUARIO)
  },
}

function mensajeError(datos, status) {
  if (!datos) return `${t('Error')} ${status}`
  if (typeof datos.detail === 'string') return t(datos.detail)
  if (Array.isArray(datos.detail)) {
    return datos.detail.map(e => `${(e.loc || []).slice(1).join('.')}: ${e.msg}`).join(' · ')
  }
  return `${t('Error')} ${status}`
}

async function solicitar(ruta, { method = 'GET', body, params, form, archivo } = {}) {
  const url = new URL(API_URL + ruta)
  Object.entries(params || {}).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v)
  })
  const headers = {}
  const token = sesion.token()
  if (token) headers.Authorization = `Bearer ${token}`
  let cuerpo
  if (form) {
    cuerpo = new URLSearchParams(form)
  } else if (archivo) {
    cuerpo = new FormData()
    cuerpo.append('archivo', archivo)
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
    cuerpo = JSON.stringify(body)
  }
  let resp
  try {
    resp = await fetch(url, { method, headers, body: cuerpo })
  } catch {
    throw new Error(t('No se pudo conectar con el servidor. ¿Está encendido el backend?'))
  }
  if (resp.status === 401 && ruta !== '/auth/login') {
    sesion.cerrar()
    window.location.href = '/login'
    throw new Error(t('Sesión expirada'))
  }
  if (resp.status === 204) return null
  const tipo = resp.headers.get('content-type') || ''
  if (!resp.ok) {
    const datos = tipo.includes('json') ? await resp.json() : null
    throw new Error(mensajeError(datos, resp.status))
  }
  if (tipo.includes('text/csv')) return resp.blob()
  return tipo.includes('json') ? resp.json() : resp.text()
}

export const api = {
  get: (ruta, params) => solicitar(ruta, { params }),
  post: (ruta, body, params) => solicitar(ruta, { method: 'POST', body, params }),
  put: (ruta, body) => solicitar(ruta, { method: 'PUT', body }),
  del: (ruta) => solicitar(ruta, { method: 'DELETE' }),
  login: (email, password, captcha) => solicitar('/auth/login', {
    method: 'POST',
    form: { username: email, password, captcha_token: captcha?.token || '', captcha_respuesta: captcha?.respuesta || '' },
  }),
  captcha: () => solicitar('/auth/captcha'),
  subir: (ruta, archivo, params) => solicitar(ruta, { method: 'POST', archivo, params }),
  descargar: async (ruta, params) => {
    const blob = await solicitar(ruta, { params })
    const enlace = document.createElement('a')
    enlace.href = URL.createObjectURL(blob)
    enlace.download = `reporte_riesgo_${new Date().toISOString().slice(0, 10)}.csv`
    enlace.click()
    URL.revokeObjectURL(enlace.href)
  },
}
