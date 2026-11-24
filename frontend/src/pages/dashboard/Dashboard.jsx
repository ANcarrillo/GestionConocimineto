import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { api } from '../../api'
import { useAuth } from '../../auth'
import { COLORES, GraficoBarrasRiesgo } from '../../components/graficos'
import { Badge, Cargando, MensajeError, Exito, Riesgo, etiqueta, fechaHora, useCarga } from '../../components/ui'
import { t } from '../../i18n'

export default function Dashboard() {
  const { tieneRol } = useAuth()
  const [mensaje, setMensaje] = useState('')
  const [errorLote, setErrorLote] = useState('')
  const [procesando, setProcesando] = useState(false)

  const { datos, error, cargando, recargar } = useCarga(async () => {
    const [resumen, programas, semestres, top, alertas] = await Promise.all([
      api.get('/reportes/resumen'),
      api.get('/reportes/riesgo-por-programa'),
      api.get('/reportes/riesgo-por-semestre'),
      api.get('/estudiantes', { orden: 'riesgo', nivel_riesgo: 'alto', estado: 'activo', por_pagina: 8 }),
      api.get('/alertas', { estado: 'abiertas', por_pagina: 6 }),
    ])
    return { resumen, programas, semestres, top, alertas }
  })

  const predecirTodos = async () => {
    setProcesando(true); setMensaje(''); setErrorLote('')
    try {
      const r = await api.post('/predicciones/lote', {})
      setMensaje(t('Se evaluaron {n} estudiantes (alto: {alto}, medio: {medio}, bajo: {bajo}). Sin datos académicos: {sin}. Alertas nuevas: {alertas}.', {
        n: r.procesados, alto: r.por_nivel.alto, medio: r.por_nivel.medio, bajo: r.por_nivel.bajo,
        sin: r.sin_datos, alertas: r.alertas_generadas,
      }))
      recargar()
    } catch (e) { setErrorLote(e.message) } finally { setProcesando(false) }
  }

  if (cargando && !datos) return <Cargando />
  if (error) return <MensajeError mensaje={error} />
  const { resumen, programas, semestres, top, alertas } = datos
  const torta = Object.entries(resumen.por_nivel).filter(([, v]) => v > 0).map(([k, v]) => ({ nombre: etiqueta(k), clave: k, valor: v }))

  return (
    <>
      <div className="titulo-pagina">
        <h1>{t('Dashboard')}</h1>
        {tieneRol('administrador', 'coordinador', 'bienestar') && (
          <button className="btn" onClick={predecirTodos} disabled={procesando}>
            {procesando ? t('Calculando…') : `🧠 ${t('Predecir riesgo de todos')}`}
          </button>
        )}
      </div>
      <Exito mensaje={mensaje} />
      <MensajeError mensaje={errorLote} />

      <section className="kpis">
        <div className="kpi"><small>{t('Estudiantes activos')}</small><strong>{resumen.total_estudiantes}</strong></div>
        <div className="kpi kpi-alto"><small>{t('Riesgo alto')}</small><strong>{resumen.por_nivel.alto}</strong>
          <span>{t('{p}% del total', { p: resumen.porcentaje_riesgo_alto })}</span></div>
        <div className="kpi kpi-medio"><small>{t('Riesgo medio')}</small><strong>{resumen.por_nivel.medio}</strong></div>
        <div className="kpi kpi-bajo"><small>{t('Riesgo bajo')}</small><strong>{resumen.por_nivel.bajo}</strong></div>
        <div className="kpi"><small>{t('Alertas abiertas')}</small><strong>{resumen.alertas_abiertas}</strong>
          <span>{t('{n} atendidas', { n: resumen.alertas_cerradas })}</span></div>
        <div className="kpi"><small>{t('Intervenciones del mes')}</small><strong>{resumen.intervenciones_mes}</strong></div>
      </section>

      <section className="rejilla-2">
        <div className="tarjeta">
          <h2>{t('Distribución del riesgo')}</h2>
          {torta.length === 0 ? <p className="tenue">{t('Aún no hay estudiantes registrados.')}</p> : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={torta} dataKey="valor" nameKey="nombre" innerRadius={60} outerRadius={100} paddingAngle={2} label>
                  {torta.map(x => <Cell key={x.clave} fill={COLORES[x.clave]} />)}
                </Pie>
                <Tooltip /><Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="tarjeta">
          <h2>{t('Riesgo por programa')}</h2>
          <GraficoBarrasRiesgo datos={programas} />
        </div>
        <div className="tarjeta">
          <h2>{t('Riesgo por semestre')}</h2>
          <GraficoBarrasRiesgo datos={semestres.map(s => ({ ...s, grupo: `${t('Sem')} ${s.grupo}` }))} />
        </div>
        <div className="tarjeta">
          <h2>{t('Estudiantes con mayor riesgo')}</h2>
          {top.items.length === 0 ? <p className="tenue">{t('No hay estudiantes en riesgo alto.')}</p> : (
            <table className="tabla compacta">
              <tbody>
                {top.items.map(e => (
                  <tr key={e.id}>
                    <td><Link to={`/estudiantes/${e.id}`}>{e.nombres} {e.apellidos}</Link><br /><small className="tenue">{e.programa.nombre}</small></td>
                    <td><Riesgo riesgo={e.riesgo} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="tarjeta">
        <div className="titulo-seccion"><h2>{t('Alertas abiertas recientes')}</h2><Link to="/alertas">{t('Ver todas')} →</Link></div>
        {alertas.items.length === 0 ? <p className="tenue">{t('No hay alertas abiertas.')}</p> : (
          <div className="tabla-scroll"><table className="tabla">
            <thead><tr><th>{t('Estudiante')}</th><th>{t('Alerta')}</th><th>{t('Nivel')}</th><th>{t('Estado')}</th><th>{t('Fecha')}</th></tr></thead>
            <tbody>
              {alertas.items.map(a => (
                <tr key={a.id}>
                  <td><Link to={`/estudiantes/${a.estudiante.id}`}>{a.estudiante.nombres} {a.estudiante.apellidos}</Link></td>
                  <td>{a.titulo}</td><td><Badge valor={a.nivel} /></td><td><Badge valor={a.estado} /></td>
                  <td>{fechaHora(a.creado_en)}</td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </section>
    </>
  )
}
