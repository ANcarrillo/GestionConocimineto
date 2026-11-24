import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { api } from '../../api'
import { useAuth } from '../../auth'
import { COLORES } from '../../components/graficos'
import { Cargando, MensajeError, fechaHora, useCarga } from '../../components/ui'
import { t } from '../../i18n'
import AdministracionModelos, { pct } from './AdministracionModelos'

const METRICAS = [['accuracy', 'Accuracy'], ['precision', 'Precision'], ['recall', 'Recall'], ['f1', 'F1-Score'], ['auc_roc', 'AUC-ROC']]

export default function Modelo() {
  const { tieneRol } = useAuth()
  const { datos, error, cargando, recargar } = useCarga(() => api.get('/modelo/activo/detalle').catch(e => ({ error: e.message })))

  return (
    <>
      <div className="titulo-pagina"><h1>{t('Modelo de Machine Learning')}</h1></div>
      <MensajeError mensaje={error} />
      {cargando && !datos ? <Cargando /> : datos?.error ? <div className="aviso">{datos.error}</div> : datos && (
        <>
          <section className="tarjeta">
            <h2>{t('Modelo activo')}: {datos.algoritmo} <small className="tenue">v{datos.version}</small></h2>
            <p className="tenue">{t('Entrenado el {f} · {e} registros de entrenamiento, {p} de prueba · Selección por {m}', {
              f: fechaHora(datos.fecha_entrenamiento), e: datos.registros?.entrenamiento, p: datos.registros?.prueba, m: datos.metrica_seleccion,
            })}</p>
            <div className="kpis">
              {METRICAS.map(([k, nombre]) => <div className="kpi" key={k}><small>{nombre}</small><strong>{pct(datos.metricas?.[k])}</strong></div>)}
            </div>
            {datos.metricas?.matriz_confusion && (
              <>
                <h3>{t('Matriz de confusión (datos de prueba)')}</h3>
                <div className="tabla-scroll"><table className="matriz">
                  <thead><tr><th></th><th>{t('Predicho: no deserta')}</th><th>{t('Predicho: deserta')}</th></tr></thead>
                  <tbody>
                    <tr><th>{t('Real: no deserta')}</th><td className="ok">{datos.metricas.matriz_confusion[0][0]}</td><td className="mal">{datos.metricas.matriz_confusion[0][1]}</td></tr>
                    <tr><th>{t('Real: deserta')}</th><td className="mal">{datos.metricas.matriz_confusion[1][0]}</td><td className="ok">{datos.metricas.matriz_confusion[1][1]}</td></tr>
                  </tbody>
                </table></div>
              </>
            )}
          </section>
          <section className="rejilla-2">
            <div className="tarjeta">
              <h2>{t('Comparación de algoritmos')}</h2>
              <div className="tabla-scroll"><table className="tabla">
                <thead><tr><th>{t('Algoritmo')}</th><th>Accuracy</th><th>Precision</th><th>Recall</th><th>F1</th><th>AUC</th></tr></thead>
                <tbody>{(datos.comparacion || []).map(c => (
                  <tr key={c.algoritmo} className={c.algoritmo === datos.algoritmo ? 'resaltada' : ''}>
                    <td>{c.algoritmo}</td><td>{pct(c.accuracy)}</td><td>{pct(c.precision)}</td><td>{pct(c.recall)}</td><td>{pct(c.f1)}</td><td>{pct(c.auc_roc)}</td></tr>
                ))}</tbody>
              </table></div>
            </div>
            <div className="tarjeta">
              <h2>{t('Variables más influyentes (global)')}</h2>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={(datos.importancia_global || []).slice(0, 12).map(v => ({ ...v, imp: +(v.importancia * 100).toFixed(1) }))} layout="vertical" margin={{ left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" unit="%" /><YAxis type="category" dataKey="variable" width={160} tick={{ fontSize: 11 }} />
                  <Tooltip /><Bar dataKey="imp" name={t('Importancia')} fill={COLORES.primario} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </>
      )}
      {tieneRol('administrador') && <AdministracionModelos onCambio={recargar} />}
    </>
  )
}
