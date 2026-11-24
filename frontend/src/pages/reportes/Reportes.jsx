import { useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { api } from '../../api'
import { COLORES, GraficoBarrasRiesgo } from '../../components/graficos'
import { Cargando, MensajeError, useCarga } from '../../components/ui'
import { t } from '../../i18n'

export default function Reportes() {
  const [programa, setPrograma] = useState('')
  const [nivel, setNivel] = useState('')
  const [errorDescarga, setErrorDescarga] = useState('')
  const programas = useCarga(() => api.get('/catalogos/programas'))
  const { datos, error, cargando } = useCarga(async () => {
    const p = { programa_id: programa }
    const [resumen, semestres, evolucion] = await Promise.all([
      api.get('/reportes/resumen', p), api.get('/reportes/riesgo-por-semestre', p), api.get('/reportes/evolucion', p),
    ])
    return { resumen, semestres, evolucion }
  }, [programa])

  const exportar = async () => {
    setErrorDescarga('')
    try { await api.descargar('/reportes/exportar', { programa_id: programa, nivel }) } catch (e) { setErrorDescarga(e.message) }
  }

  return (
    <>
      <div className="titulo-pagina"><h1>{t('Reportes e indicadores')}</h1></div>
      <div className="filtros tarjeta">
        <select value={programa} onChange={e => setPrograma(e.target.value)} aria-label={t('Programa')}>
          <option value="">{t('Todos los programas')}</option>
          {programas.datos?.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
        </select>
        <select value={nivel} onChange={e => setNivel(e.target.value)} aria-label={t('Nivel')}>
          <option value="">{t('Exportar todos los niveles')}</option><option value="alto">{t('Solo riesgo alto')}</option>
          <option value="medio">{t('Solo riesgo medio')}</option><option value="bajo">{t('Solo riesgo bajo')}</option>
        </select>
        <button className="btn" onClick={exportar}>⬇ {t('Exportar a Excel (CSV)')}</button>
      </div>
      <MensajeError mensaje={error || errorDescarga} />
      {cargando && !datos ? <Cargando /> : datos && (
        <>
          <section className="kpis">
            <div className="kpi"><small>{t('Estudiantes activos')}</small><strong>{datos.resumen.total_estudiantes}</strong></div>
            <div className="kpi kpi-alto"><small>{t('% en riesgo alto')}</small><strong>{datos.resumen.porcentaje_riesgo_alto}%</strong></div>
            <div className="kpi"><small>{t('Sin predicción')}</small><strong>{datos.resumen.por_nivel.sin_prediccion}</strong></div>
            <div className="kpi"><small>{t('Alertas abiertas / atendidas')}</small><strong>{datos.resumen.alertas_abiertas} / {datos.resumen.alertas_cerradas}</strong></div>
          </section>
          <section className="rejilla-2">
            <div className="tarjeta">
              <h2>{t('Riesgo por semestre')}</h2>
              <GraficoBarrasRiesgo datos={datos.semestres.map(s => ({ ...s, grupo: `${t('Sem')} ${s.grupo}` }))} />
            </div>
            <div className="tarjeta">
              <h2>{t('Seguimiento mensual de predicciones')}</h2>
              {datos.evolucion.length === 0 ? <p className="tenue">{t('Aún no hay predicciones.')}</p> : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={datos.evolucion.map(m => ({ ...m, prob: +(m.probabilidad_promedio * 100).toFixed(1) }))}>
                    <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="mes" />
                    <YAxis yAxisId="izq" unit="%" /><YAxis yAxisId="der" orientation="right" allowDecimals={false} />
                    <Tooltip /><Legend />
                    <Line yAxisId="izq" dataKey="prob" name={t('Probabilidad promedio (%)')} stroke={COLORES.primario} strokeWidth={2} />
                    <Line yAxisId="der" dataKey="alto" name={t('Casos de riesgo alto')} stroke={COLORES.alto} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>
        </>
      )}
    </>
  )
}
