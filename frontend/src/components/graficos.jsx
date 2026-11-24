// Gráficos compartidos por Dashboard y Reportes.
// Los colores salen de variables CSS para que cambien con el tema (claro / oscuro / contraste).
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { etiqueta } from './ui'

export const COLORES = {
  bajo: 'var(--bajo)', medio: 'var(--medio)', alto: 'var(--alto)', sin_prediccion: 'var(--sin-prediccion)',
  primario: 'var(--grafico)',
}

export function GraficoBarrasRiesgo({ datos, alto = 280 }) {
  return (
    <ResponsiveContainer width="100%" height={alto}>
      <BarChart data={datos}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="grupo" tick={{ fontSize: 11 }} interval={0} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        {['alto', 'medio', 'bajo', 'sin_prediccion'].map(n => (
          <Bar key={n} dataKey={n} name={etiqueta(n)} stackId="a" fill={COLORES[n]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}
