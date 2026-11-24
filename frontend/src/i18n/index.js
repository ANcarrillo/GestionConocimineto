// Traducciones (español / inglés).
// El texto en español es la clave: t('Guardar') devuelve 'Save' si el idioma es inglés.
// Si una frase no está en el diccionario se muestra en español.
import en from './en'

export const IDIOMAS = { es: 'Español', en: 'English' }
const DICCIONARIOS = { es: {}, en }

let idiomaActual = 'es'

export const setIdioma = (idioma) => { idiomaActual = DICCIONARIOS[idioma] ? idioma : 'es' }
export const getIdioma = () => idiomaActual
export const locale = () => (idiomaActual === 'en' ? 'en-US' : 'es-CO')

// t('Página {a} de {b}', { a: 1, b: 3 })
export function t(texto, variables) {
  let salida = DICCIONARIOS[idiomaActual][texto] ?? texto
  if (variables) {
    Object.entries(variables).forEach(([k, v]) => { salida = salida.replaceAll(`{${k}}`, v) })
  }
  return salida
}
