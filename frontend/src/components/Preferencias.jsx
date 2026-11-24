import { useEffect, useRef, useState } from 'react'
import { IDIOMAS, t } from '../i18n'
import { TAMANOS, TEMAS, usePreferencias } from '../preferencias'

const NOMBRE_TEMA = { claro: 'Claro', oscuro: 'Oscuro', contraste: 'Alto contraste' }
const ICONO_TEMA = { claro: '☀️', oscuro: '🌙', contraste: '◐' }

// Botón con menú desplegable: tema, tamaño de letra e idioma
export default function Preferencias() {
  const { tema, tamano, idioma, cambiar, pasoLetra } = usePreferencias()
  const [abierto, setAbierto] = useState(false)
  const caja = useRef(null)

  useEffect(() => {
    if (!abierto) return
    const cerrar = (e) => { if (!caja.current?.contains(e.target)) setAbierto(false) }
    const escape = (e) => { if (e.key === 'Escape') setAbierto(false) }
    document.addEventListener('mousedown', cerrar)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('mousedown', cerrar); document.removeEventListener('keydown', escape) }
  }, [abierto])

  const indice = TAMANOS.indexOf(tamano)

  return (
    <div className="preferencias" ref={caja}>
      <button type="button" className="btn btn-sec" onClick={() => setAbierto(!abierto)}
        aria-expanded={abierto} aria-haspopup="true" title={t('Accesibilidad')}>
        <span aria-hidden>Aa</span> <span className="solo-escritorio">{t('Accesibilidad')}</span>
      </button>
      {abierto && (
        <div className="panel-preferencias" role="dialog" aria-label={t('Accesibilidad')}>
          <fieldset>
            <legend>{t('Tema')}</legend>
            <div className="segmentado">
              {TEMAS.map(x => (
                <button type="button" key={x} className={tema === x ? 'activo' : ''} aria-pressed={tema === x}
                  onClick={() => cambiar('tema', x)}>
                  <span aria-hidden>{ICONO_TEMA[x]}</span> {t(NOMBRE_TEMA[x])}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('Tamaño de letra')}</legend>
            <div className="segmentado">
              <button type="button" onClick={() => pasoLetra(-1)} disabled={indice <= 0} aria-label={t('Reducir letra')}>A−</button>
              <button type="button" onClick={() => cambiar('tamano', 'normal')} aria-label={t('Letra normal')}
                className={tamano === 'normal' ? 'activo' : ''}>A</button>
              <button type="button" onClick={() => pasoLetra(1)} disabled={indice >= TAMANOS.length - 1} aria-label={t('Aumentar letra')}>A+</button>
            </div>
          </fieldset>
          <fieldset>
            <legend>{t('Idioma')}</legend>
            <div className="segmentado">
              {Object.entries(IDIOMAS).map(([k, nombre]) => (
                <button type="button" key={k} lang={k} className={idioma === k ? 'activo' : ''} aria-pressed={idioma === k}
                  onClick={() => cambiar('idioma', k)}>{nombre}</button>
              ))}
            </div>
          </fieldset>
        </div>
      )}
    </div>
  )
}
