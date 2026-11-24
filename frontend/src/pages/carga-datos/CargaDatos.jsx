import { useState } from 'react'
import { api } from '../../api'
import { Campo, MensajeError, Exito } from '../../components/ui'
import { t } from '../../i18n'

const EJEMPLOS = {
  academicos: 'codigo_estudiante;periodo;semestre_cursado;creditos_inscritos;creditos_aprobados;creditos_reprobados;promedio_periodo;promedio_acumulado;asistencia_pct;materias_reprobadas;materias_canceladas;materias_repetidas;estado_matricula\n2026001;2026-1;3;18;15;3;3,4;3,6;88;1;0;0;matriculado',
  socioeconomicos: 'codigo_estudiante;periodo;estrato;ingreso_familiar;trabaja;horas_trabajo_semana;personas_a_cargo;tipo_vivienda;zona_residencia;distancia_km;tiene_beca;apoyo_financiero;nivel_educativo_padres\n2026001;2026-1;2;1800000;si;20;0;arriendo;urbana;8,5;no;si;secundaria',
}

export default function CargaDatos() {
  const [tipo, setTipo] = useState('academicos')
  const [archivo, setArchivo] = useState(null)
  const [resultado, setResultado] = useState(null)
  const [error, setError] = useState('')
  const [subiendo, setSubiendo] = useState(false)

  const subir = async (e) => {
    e.preventDefault()
    setError(''); setResultado(null); setSubiendo(true)
    try { setResultado(await api.subir('/datos-academicos/importar', archivo, { tipo })) } catch (err) { setError(err.message) } finally { setSubiendo(false) }
  }

  const descargarPlantilla = () => {
    const blob = new Blob(['﻿' + EJEMPLOS[tipo]], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `plantilla_${tipo}.csv`
    a.click()
  }

  return (
    <>
      <div className="titulo-pagina"><h1>{t('Carga masiva de datos')}</h1></div>
      <section className="rejilla-2">
        <form className="tarjeta" onSubmit={subir}>
          <h2>{t('Importar archivo CSV')}</h2>
          <Campo etiqueta={t('Tipo de datos')}>
            <select value={tipo} onChange={e => { setTipo(e.target.value); setResultado(null) }}>
              <option value="academicos">{t('Datos académicos por periodo')}</option>
              <option value="socioeconomicos">{t('Datos socioeconómicos por periodo')}</option>
            </select>
          </Campo>
          <Campo etiqueta={t('Archivo (.csv separado por ; o ,)')}>
            <input type="file" accept=".csv,text/csv" onChange={e => setArchivo(e.target.files[0])} required />
          </Campo>
          <div className="acciones">
            <button type="button" className="btn btn-sec" onClick={descargarPlantilla}>{t('Descargar plantilla')}</button>
            <button className="btn" disabled={!archivo || subiendo}>{subiendo ? t('Procesando…') : t('Importar')}</button>
          </div>
          <MensajeError mensaje={error} />
          {resultado && (
            <>
              <Exito mensaje={t('Insertados: {i} · Actualizados: {a} · Alertas generadas: {g}', {
                i: resultado.insertados, a: resultado.actualizados, g: resultado.alertas_generadas,
              })} />
              {resultado.errores.length > 0 && (
                <div className="aviso error"><b>{t('{n} filas con errores:', { n: resultado.errores.length })}</b>
                  <ul>{resultado.errores.slice(0, 50).map((e, i) => <li key={i}>{e}</li>)}</ul></div>
              )}
            </>
          )}
        </form>
        <div className="tarjeta">
          <h2>{t('Instrucciones')}</h2>
          <ol>
            <li>{t('Los estudiantes y el periodo (ej. 2026-1) deben existir antes de importar.')}</li>
            <li>{t('Columnas obligatorias:')} <code>codigo_estudiante</code>, <code>periodo</code>.</li>
            <li>{t('Si ya existe un registro para el mismo estudiante y periodo, se actualiza.')}</li>
            <li>{t('Decimales con coma o punto. Booleanos:')} <code>si/no</code>, <code>1/0</code>, <code>true/false</code>.</li>
            <li>{t('Al importar se aplican las reglas de riesgo (promedio, asistencia, materias reprobadas, trabajo) y se generan alertas.')}</li>
            <li>{t('Las filas con errores se informan y no detienen la carga.')}</li>
          </ol>
          <h3>{t('Ejemplo')}</h3>
          <pre className="codigo">{EJEMPLOS[tipo]}</pre>
        </div>
      </section>
    </>
  )
}
