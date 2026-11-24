import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Capa 1 - Presentación: aplicación web progresiva (instalable en PC y celular)
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Alerta Temprana de Deserción',
        short_name: 'SAT Deserción',
        description: 'Identificación de estudiantes en riesgo de deserción con Machine Learning',
        lang: 'es',
        theme_color: '#1e3a8a',
        background_color: '#f4f6fb',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icon.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
      workbox: {
        // La API no se guarda en caché: los datos siempre deben ser los actuales
        navigateFallbackDenylist: [/^\/api/],
      },
    }),
  ],
  server: { port: 5173 },
})
