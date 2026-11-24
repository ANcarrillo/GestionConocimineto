// Preferencias de visualización: tema (claro / oscuro / alto contraste), tamaño de letra e idioma.
// Se guardan en el navegador y se aplican como atributos en <html>.
import { createContext, useContext, useEffect, useState } from 'react'
import { setIdioma } from './i18n'

export const TEMAS = ['claro', 'oscuro', 'contraste']
export const TAMANOS = ['pequena', 'normal', 'grande', 'muy_grande']
const CLAVE = 'sat_preferencias'

function leer() {
  const sistemaOscuro = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  const base = { tema: sistemaOscuro ? 'oscuro' : 'claro', tamano: 'normal', idioma: 'es' }
  try {
    return { ...base, ...JSON.parse(localStorage.getItem(CLAVE)) }
  } catch {
    return base
  }
}

function aplicar({ tema, tamano, idioma }) {
  const html = document.documentElement
  html.dataset.tema = tema
  html.dataset.letra = tamano
  html.lang = idioma
  setIdioma(idioma)
}

const PreferenciasContext = createContext(null)

export function PreferenciasProvider({ children }) {
  const [prefs, setPrefs] = useState(() => {
    const p = leer()
    aplicar(p)
    return p
  })

  useEffect(() => {
    aplicar(prefs)
    try { localStorage.setItem(CLAVE, JSON.stringify(prefs)) } catch { /* almacenamiento no disponible */ }
  }, [prefs])

  const cambiar = (campo, valor) => {
    if (campo === 'idioma') setIdioma(valor) // antes del render, para que t() ya use el nuevo idioma
    setPrefs(p => ({ ...p, [campo]: valor }))
  }

  const pasoLetra = (delta) => {
    const i = TAMANOS.indexOf(prefs.tamano) + delta
    if (i >= 0 && i < TAMANOS.length) cambiar('tamano', TAMANOS[i])
  }

  return (
    <PreferenciasContext.Provider value={{ ...prefs, cambiar, pasoLetra }}>
      {/* key: al cambiar de idioma se vuelve a dibujar toda la interfaz con los nuevos textos */}
      <div key={prefs.idioma} style={{ display: 'contents' }}>{children}</div>
    </PreferenciasContext.Provider>
  )
}

export const usePreferencias = () => useContext(PreferenciasContext)
