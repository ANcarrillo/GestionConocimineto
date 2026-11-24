# Frontend — Aplicación web progresiva (PWA) con React

Capa 1 de la arquitectura. React 18 + Vite + React Router + Recharts + vite-plugin-pwa.

## Instalación y ejecución

Requiere Node.js 18 o superior y el backend encendido en http://localhost:8000.

```bash
npm install
```

```bash
npm run dev
```

Abra http://localhost:5173. Si el backend está en otra dirección, copie `.env.example` como `.env` y cambie `VITE_API_URL`.

Versión de producción (carpeta `dist/`, instalable como app):

```bash
npm run build
```

```bash
npm run preview
```

## Pantallas

| Pantalla | Qué hace | Roles |
|---|---|---|
| Login | Inicio de sesión con CAPTCHA | todos |
| Dashboard | Indicadores, distribución del riesgo, riesgo por programa y semestre, estudiantes con mayor riesgo, alertas recientes, botón "Predecir riesgo de todos" | todos |
| Estudiantes | Búsqueda y filtros (programa, semestre, estado, nivel de riesgo) | todos |
| Ficha del estudiante | Riesgo actual, factores que lo explican, historial académico y socioeconómico, predicciones, alertas e intervenciones | todos |
| Nuevo / editar estudiante | Formulario | administrador, coordinador |
| Alertas | Filtrar, asignar responsable, cambiar estado, registrar intervención | gestionar: admin, coordinador, bienestar |
| Intervenciones | Seguimiento de tutorías, apoyo psicológico, financiero… | todos |
| Reportes | Indicadores por programa, evolución mensual, exportar a Excel (CSV) | todos |
| Carga de datos | Importación masiva CSV con plantilla descargable | administrador, coordinador |
| Modelo ML | Métricas, matriz de confusión, comparación de algoritmos, variables influyentes; registrar/activar modelos | ver: todos · gestionar: admin |
| Catálogos | Facultades, programas, periodos | administrador |
| Usuarios | Crear usuarios, roles y programas asignados | administrador |

La interfaz se adapta a celular (menú lateral desplegable) y se puede instalar como aplicación desde el navegador.

## Estructura del código

```
src/
├── main.jsx, App.jsx      Arranque y rutas
├── api.js, auth.jsx       Cliente HTTP y sesión
├── preferencias.jsx       Tema, tamaño de letra e idioma (se guardan en el navegador)
├── i18n/                  Traducciones: index.js (función t) y en.js (español → inglés)
├── components/            Layout, ui (componentes comunes), graficos, Preferencias
└── pages/                 Una carpeta por módulo
    ├── auth/              Login (con CAPTCHA)
    ├── dashboard/
    ├── estudiantes/       Lista, formulario, ficha y formularios/ (académico, socioeconómico, alerta)
    ├── alertas/           Lista y GestionAlerta
    ├── intervenciones/    Lista y FormIntervencion
    ├── reportes/
    ├── carga-datos/
    ├── modelo/            Modelo activo y AdministracionModelos
    ├── catalogos/
    └── usuarios/          Lista y FormUsuario
```

## Accesibilidad e idioma

El botón **Aa Accesibilidad** (barra superior y pantalla de inicio de sesión) permite elegir:

- **Tema:** claro, oscuro o alto contraste (fondo negro, texto blanco, acentos amarillos). La primera vez se usa el tema del sistema operativo.
- **Tamaño de letra:** cuatro tamaños (A− / A / A+).
- **Idioma:** español o inglés.

Para traducir un texto nuevo, escríbalo con `t('Texto en español')` (importando `t` de `src/i18n`) y agregue la línea `'Texto en español': 'English text'` en `src/i18n/en.js`. Si falta una traducción se muestra el texto en español.

## CAPTCHA

El inicio de sesión pide escribir los caracteres de una imagen generada por el backend (`GET /auth/captcha`). Cada código sirve una sola vez y vence a los 5 minutos; el botón ↻ genera otro. Se desactiva en el backend con `CAPTCHA_HABILITADO=false`.
