import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { api } from '../../api'
import { useAuth } from '../../auth'
import { COLORES } from '../../components/graficos'
import {
  Badge, Cargando, MensajeError, Exito, Modal, Riesgo, etiqueta, fecha, fechaHora, numero, useCarga,
} from '../../components/ui'
import { t } from '../../i18n'
import FormIntervencion from '../intervenciones/FormIntervencion'
import FormAcademico from './formularios/FormAcademico'
import FormAlerta from './formularios/FormAlerta'
import FormSocioeconomico from './formularios/FormSocioeconomico'

export default function EstudianteDetalle() {
  const { id } = useParams()
  const { tieneRol } = useAuth()
  const [pestana, setPestana] = useState('resumen')
  const [modal, setModal] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [errorAccion, setErrorAccion] = useState('')
  const [prediciendo, setPrediciendo] = useState(false)

  const { datos, error, cargando, recargar } = useCarga(() => api.get(`/estudiantes/${id}/ficha`), [id])
  const periodos = useCarga(() => api.get('/catalogos/periodos'))

  const predecir = async () => {
    setPrediciendo(true); setMensaje(''); setErrorAccion('')
    try {
      const p = await api.post(`/predicciones/estudiante/${id}`)
      setMensaje(t('Predicción realizada: riesgo {nivel} ({p}%)', { nivel: etiqueta(p.nivel_riesgo), p: (p.probabilidad * 100).toFixed(1) }))
      recargar()
    } catch (e) { setErrorAccion(e.message) } finally { setPrediciendo(false) }
  }
  const guardado = (texto) => () => { setModal(''); setMensaje(t(texto)); recargar() }

  if (cargando && !datos) return <Cargando />
  if (error) return <MensajeError mensaje={error} />
  const { estudiante: e, academicos, socioeconomicos, predicciones, alertas, intervenciones } = datos
  const ultima = predicciones[0]
  const editar = tieneRol('administrador', 'coordinador')
  const editarSocio = tieneRol('administrador', 'coordinador', 'bienestar')

  const PESTANAS = [
    ['resumen', t('Resumen')], ['academico', `${t('Académico')} (${academicos.length})`],
    ['socio', `${t('Socioeconómico')} (${socioeconomicos.length})`],
    ['predicciones', `${t('Predicciones')} (${predicciones.length})`], ['alertas', `${t('Alertas')} (${alertas.length})`],
    ['intervenciones', `${t('Intervenciones')} (${intervenciones.length})`],
  ]

  return (
    <>
      <div className="titulo-pagina">
        <div>
          <Link to="/estudiantes" className="tenue">← {t('Estudiantes')}</Link>
          <h1>{e.nombres} {e.apellidos}</h1>
          <p className="tenue">{e.codigo} · {e.tipo_documento} {e.numero_documento} · {e.programa.nombre} · {t('Semestre')} {e.semestre_actual} · <Badge valor={e.estado} /></p>
        </div>
        <div className="botones">
          {editar && <Link className="btn btn-sec" to={`/estudiantes/${id}/editar`}>{t('Editar')}</Link>}
          <button className="btn btn-sec" onClick={() => setModal('alerta')}>+ {t('Alerta')}</button>
          <button className="btn" onClick={predecir} disabled={prediciendo}>{prediciendo ? t('Calculando…') : `🧠 ${t('Predecir riesgo')}`}</button>
        </div>
      </div>
      <Exito mensaje={mensaje} />
      <MensajeError mensaje={errorAccion} />

      <div className="pestanas" role="tablist">
        {PESTANAS.map(([k, texto]) => (
          <button key={k} role="tab" aria-selected={pestana === k} className={pestana === k ? 'activa' : ''} onClick={() => setPestana(k)}>{texto}</button>
        ))}
      </div>

      {pestana === 'resumen' && (
        <section className="rejilla-2">
          <div className="tarjeta">
            <h2>{t('Riesgo actual')}</h2>
            {!ultima ? <p className="tenue">{t('Sin predicciones. Registre datos académicos y pulse “Predecir riesgo”.')}</p> : (
              <div className={`medidor medidor-${ultima.nivel_riesgo}`}>
                <strong>{(ultima.probabilidad * 100).toFixed(1)}%</strong>
                <span>{t('probabilidad de deserción')}</span>
                <Riesgo riesgo={e.riesgo} />
                <small className="tenue">{fechaHora(ultima.creado_en)}</small>
              </div>
            )}
          </div>
          <div className="tarjeta">
            <h2>{t('Factores que más aumentan el riesgo')}</h2>
            {!ultima?.factores?.length ? <p className="tenue">{t('Sin factores destacados.')}</p> : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={ultima.factores.map(f => ({ ...f, impacto_pct: +(f.impacto * 100).toFixed(1) }))} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" unit=" pts" />
                    <YAxis type="category" dataKey="variable" width={150} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v) => [t('+{v} puntos porcentuales', { v }), t('Aumenta el riesgo')]} />
                    <Bar dataKey="impacto_pct" fill={COLORES.alto} />
                  </BarChart>
                </ResponsiveContainer>
                <ul className="factores">
                  {ultima.factores.map(f => (
                    <li key={f.variable}><b>{f.variable}</b>: {String(f.valor ?? t('sin dato'))} <span className="tenue">({t('típico')}: {String(f.referencia)})</span></li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div className="tarjeta">
            <h2>{t('Último periodo académico')}</h2>
            {academicos[0] ? (
              <dl className="datos">
                <dt>{t('Periodo')}</dt><dd>{academicos[0].periodo.codigo}</dd>
                <dt>{t('Promedio periodo / acumulado')}</dt><dd>{academicos[0].promedio_periodo ?? '—'} / {academicos[0].promedio_acumulado ?? '—'}</dd>
                <dt>{t('Créditos aprobados')}</dt><dd>{t('{a} de {b}', { a: academicos[0].creditos_aprobados, b: academicos[0].creditos_inscritos })}</dd>
                <dt>{t('Asistencia')}</dt><dd>{academicos[0].asistencia_pct ?? '—'}%</dd>
                <dt>{t('Materias reprobadas')}</dt><dd>{academicos[0].materias_reprobadas}</dd>
              </dl>
            ) : <p className="tenue">{t('Sin datos académicos.')}</p>}
          </div>
          <div className="tarjeta">
            <h2>{t('Datos personales')}</h2>
            <dl className="datos">
              <dt>{t('Correo')}</dt><dd>{e.email || '—'}</dd>
              <dt>{t('Teléfono')}</dt><dd>{e.telefono || '—'}</dd>
              <dt>{t('Fecha de nacimiento')}</dt><dd>{fecha(e.fecha_nacimiento)}</dd>
              <dt>{t('Saber 11')}</dt><dd>{e.puntaje_saber11 ?? '—'}</dd>
              <dt>{t('Colegio')}</dt><dd>{e.tipo_colegio ? etiqueta(e.tipo_colegio) : '—'}</dd>
            </dl>
          </div>
        </section>
      )}

      {pestana === 'academico' && (
        <section className="tarjeta">
          <div className="titulo-seccion"><h2>{t('Historial académico')}</h2>{editar && <button className="btn" onClick={() => setModal('academico')}>+ {t('Registrar periodo')}</button>}</div>
          <div className="tabla-scroll"><table className="tabla">
            <thead><tr><th>{t('Periodo')}</th><th>{t('Sem.')}</th><th>{t('Créditos (ins/apr/rep)')}</th><th>{t('Prom. periodo')}</th><th>{t('Prom. acum.')}</th><th>{t('Asistencia')}</th><th>{t('Reprob.')}</th><th>{t('Cancel.')}</th><th>{t('Matrícula')}</th></tr></thead>
            <tbody>
              {academicos.length === 0 && <tr><td colSpan="9" className="tenue">{t('Sin registros.')}</td></tr>}
              {academicos.map(a => (
                <tr key={a.id}><td>{a.periodo.codigo}</td><td>{a.semestre_cursado}</td>
                  <td>{a.creditos_inscritos} / {a.creditos_aprobados} / {a.creditos_reprobados}</td>
                  <td>{a.promedio_periodo ?? '—'}</td><td>{a.promedio_acumulado ?? '—'}</td><td>{a.asistencia_pct ?? '—'}%</td>
                  <td>{a.materias_reprobadas}</td><td>{a.materias_canceladas}</td><td>{etiqueta(a.estado_matricula)}</td></tr>
              ))}
            </tbody>
          </table></div>
        </section>
      )}

      {pestana === 'socio' && (
        <section className="tarjeta">
          <div className="titulo-seccion"><h2>{t('Datos socioeconómicos')}</h2>{editarSocio && <button className="btn" onClick={() => setModal('socio')}>+ {t('Registrar')}</button>}</div>
          <div className="tabla-scroll"><table className="tabla">
            <thead><tr><th>{t('Periodo')}</th><th>{t('Estrato')}</th><th>{t('Ingreso')}</th><th>{t('Trabaja')}</th><th>{t('Personas a cargo')}</th><th>{t('Zona')}</th><th>{t('Distancia')}</th><th>{t('Beca / apoyo')}</th></tr></thead>
            <tbody>
              {socioeconomicos.length === 0 && <tr><td colSpan="8" className="tenue">{t('Sin registros.')}</td></tr>}
              {socioeconomicos.map(s => (
                <tr key={s.id}><td>{s.periodo.codigo}</td><td>{s.estrato ?? '—'}</td>
                  <td>{s.ingreso_familiar != null ? `$${numero(s.ingreso_familiar)}` : '—'}</td>
                  <td>{s.trabaja ? `${t('Sí')} (${s.horas_trabajo_semana} h)` : t('No')}</td><td>{s.personas_a_cargo}</td>
                  <td>{s.zona_residencia ? etiqueta(s.zona_residencia) : '—'}</td><td>{s.distancia_km ?? '—'} km</td>
                  <td>{s.tiene_beca ? t('Beca') : ''} {s.apoyo_financiero ? t('Apoyo') : ''}{!s.tiene_beca && !s.apoyo_financiero && t('No')}</td></tr>
              ))}
            </tbody>
          </table></div>
        </section>
      )}

      {pestana === 'predicciones' && (
        <section className="tarjeta">
          <h2>{t('Evolución del riesgo')}</h2>
          {predicciones.length === 0 ? <p className="tenue">{t('Sin predicciones.')}</p> : (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={[...predicciones].reverse().map(p => ({ fecha: fecha(p.creado_en), prob: +(p.probabilidad * 100).toFixed(1) }))}>
                  <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="fecha" /><YAxis domain={[0, 100]} unit="%" />
                  <Tooltip /><Line type="monotone" dataKey="prob" name={t('Probabilidad')} stroke={COLORES.primario} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
              <div className="tabla-scroll"><table className="tabla">
                <thead><tr><th>{t('Fecha')}</th><th>{t('Probabilidad')}</th><th>{t('Nivel')}</th><th>{t('Factores principales')}</th></tr></thead>
                <tbody>{predicciones.map(p => (
                  <tr key={p.id}><td>{fechaHora(p.creado_en)}</td><td>{(p.probabilidad * 100).toFixed(1)}%</td>
                    <td><Badge valor={p.nivel_riesgo} /></td><td>{(p.factores || []).slice(0, 3).map(f => f.variable).join(', ') || '—'}</td></tr>
                ))}</tbody>
              </table></div>
            </>
          )}
        </section>
      )}

      {pestana === 'alertas' && (
        <section className="tarjeta">
          <h2>{t('Alertas')}</h2>
          <div className="tabla-scroll"><table className="tabla">
            <thead><tr><th>{t('Fecha')}</th><th>{t('Tipo')}</th><th>{t('Alerta')}</th><th>{t('Nivel')}</th><th>{t('Estado')}</th><th>{t('Responsable')}</th></tr></thead>
            <tbody>
              {alertas.length === 0 && <tr><td colSpan="6" className="tenue">{t('Sin alertas.')}</td></tr>}
              {alertas.map(a => (
                <tr key={a.id}><td>{fechaHora(a.creado_en)}</td><td>{etiqueta(a.tipo)}</td>
                  <td><b>{a.titulo}</b><br /><small className="tenue">{a.descripcion}</small></td>
                  <td><Badge valor={a.nivel} /></td><td><Badge valor={a.estado} /></td>
                  <td>{a.responsable ? `${a.responsable.nombres} ${a.responsable.apellidos}` : '—'}</td></tr>
              ))}
            </tbody>
          </table></div>
        </section>
      )}

      {pestana === 'intervenciones' && (
        <section className="tarjeta">
          <div className="titulo-seccion"><h2>{t('Intervenciones')}</h2><button className="btn" onClick={() => setModal('intervencion')}>+ {t('Registrar intervención')}</button></div>
          <div className="tabla-scroll"><table className="tabla">
            <thead><tr><th>{t('Fecha')}</th><th>{t('Tipo')}</th><th>{t('Descripción')}</th><th>{t('Resultado')}</th><th>{t('Estado')}</th><th>{t('Responsable')}</th></tr></thead>
            <tbody>
              {intervenciones.length === 0 && <tr><td colSpan="6" className="tenue">{t('Sin intervenciones.')}</td></tr>}
              {intervenciones.map(i => (
                <tr key={i.id}><td>{fecha(i.fecha)}</td><td>{etiqueta(i.tipo)}</td><td>{i.descripcion}</td><td>{i.resultado || '—'}</td>
                  <td><Badge valor={i.estado} /></td><td>{i.responsable.nombres} {i.responsable.apellidos}</td></tr>
              ))}
            </tbody>
          </table></div>
        </section>
      )}

      <Modal titulo={t('Registrar datos académicos del periodo')} abierto={modal === 'academico'} onCerrar={() => setModal('')}>
        <FormAcademico estudianteId={e.id} periodos={periodos.datos || []} onGuardado={guardado('Datos académicos guardados')} />
      </Modal>
      <Modal titulo={t('Registrar datos socioeconómicos')} abierto={modal === 'socio'} onCerrar={() => setModal('')}>
        <FormSocioeconomico estudianteId={e.id} periodos={periodos.datos || []} onGuardado={guardado('Datos socioeconómicos guardados')} />
      </Modal>
      <Modal titulo={t('Nueva alerta manual')} abierto={modal === 'alerta'} onCerrar={() => setModal('')}>
        <FormAlerta estudianteId={e.id} onGuardado={guardado('Alerta creada')} />
      </Modal>
      <Modal titulo={t('Registrar intervención')} abierto={modal === 'intervencion'} onCerrar={() => setModal('')}>
        <FormIntervencion estudianteId={e.id} alertas={alertas.filter(a => ['pendiente', 'en_proceso'].includes(a.estado))}
          onGuardado={guardado('Intervención registrada')} />
      </Modal>
    </>
  )
}
