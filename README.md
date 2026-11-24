# Plataforma de alerta temprana de deserción estudiantil

Modelo de Machine Learning para la identificación de estudiantes en riesgo de deserción.
**Autores:** Francy Almario · Andrés Carrillo — Metodología híbrida Cascada + Scrum.

Todo funciona en local y cada parte está separada (sin Docker por ahora).

```
Trabajofinal/
├── docs/entrevista/   Entrevista de recolección de información, por fases
├── database/          Capa 4 · PostgreSQL: schema.sql (solo estructura) + diccionario de datos
├── ml/                Capa 4 · Modelo de ML: entrenamiento, comparación, evaluación, SHAP
├── backend/           Capas 2-3-4 · API REST FastAPI + lógica de negocio
└── frontend/          Capa 1 · PWA en React (dashboards por rol)
```

## Arquitectura de 5 capas

| Capa | Implementación |
|---|---|
| 1. Presentación | `frontend/` — PWA React, dashboards por rol, consulta de estudiantes, predicción, alertas y reportes |
| 2. API / Controladores | `backend/app/api/` — FastAPI, JWT, validación Pydantic, respuestas JSON |
| 3. Aplicación y reglas de negocio | `backend/app/services/` — estudiantes, procesamiento de datos, predicción, alertas, reportes |
| 4. Acceso a datos e inteligencia | `database/` + `backend/app/data/` + `ml/` — PostgreSQL y modelos RF / GB / XGBoost / LightGBM (.pkl) |
| 5. Infraestructura y despliegue | Pendiente (Fase 7: Docker, Nginx, HTTPS) |

**Flujo principal:** datos del estudiante → almacenamiento en BD → procesamiento y predicción → alerta si el riesgo es alto → intervención y seguimiento.

## Puesta en marcha (en este orden)

1. **Base de datos** — ver [database/README.md](database/README.md)
   - Crear `desercion_db` y ejecutar `schema.sql`.
2. **Backend** — ver [backend/README.md](backend/README.md)
   - Crear `.venv`, instalar, configurar `.env`, `python crear_admin.py …`, `uvicorn app.main:app --reload`.
3. **Frontend** — ver [frontend/README.md](frontend/README.md)
   - `npm install`, `npm run dev`, entrar con el administrador.
4. **Cargar datos** — desde la web (Catálogos → Estudiantes → datos académicos/socioeconómicos, o *Carga de datos* por CSV) o directamente en PostgreSQL.
5. **Entrenar el modelo** — ver [ml/README.md](ml/README.md)
   - `python -m src.entrenar` y luego en la web *Modelo ML → Registrar y activar*.
6. **Predecir** — Dashboard → *Predecir riesgo de todos*, o desde la ficha de cada estudiante.

## Ejecutar en Visual Studio Code

1. **Archivo → Abrir carpeta…** → `Trabajofinal`.
2. **Terminal → Ejecutar tarea… → "Iniciar back y front"** (o `Ctrl+Shift+B`). Se abren dos terminales: backend en http://localhost:8000/docs y frontend en http://localhost:5173.
3. Para depurar con puntos de interrupción: pestaña **Ejecutar y depurar** (`Ctrl+Shift+D`) → **"Back + Front"** → `F5` (requiere la extensión *Python*).

## Datos de prueba

- `database/roles_y_usuarios.sql`: los 4 roles y un usuario por rol (la contraseña está en el comentario del archivo).
- `database/datos_prueba.sql`: 100 estudiantes **ficticios** con datos académicos y socioeconómicos.
- Se regeneran con `backend\.venv\Scripts\python database\generar_datos_prueba.py`.

## Relación con las fases de la metodología

| Fase | Entregable en este proyecto |
|---|---|
| 1. Requerimientos | `docs/entrevista/fase1_requerimientos.md` |
| 2. Análisis y preparación de datos | `docs/entrevista/fase2_datos.md`, `ml/notebooks/`, `ml/src/datos.py` |
| 3. Diseño | `docs/entrevista/fase3_diseno.md`, `database/README.md` (modelo E-R), `ml/src/config.py` |
| 4. Desarrollo y entrenamiento | `backend/`, `frontend/`, `ml/src/entrenar.py` (CV estratificada de 10 particiones) |
| 5. Pruebas y evaluación | `backend/tests/` (pytest), `ml/reports/` (métricas, matriz de confusión, SHAP), Swagger para Postman, `docs/entrevista/fase5_6_validacion.md` |
| 6. Integración y documentación | READMEs, Swagger en `/docs` |
| 7. Despliegue | `docs/entrevista/fase7_despliegue.md` (preguntas para TI); la implementación queda para después |
