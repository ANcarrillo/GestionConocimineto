# Parte 3 — Fase 3: Diseño de la solución

**Dirigida a:** usuarios finales (coordinadores de programa, docentes / consejeros, Bienestar Universitario).
**Duración estimada:** 30 minutos. Se recomienda mostrar los bocetos de Figma durante la entrevista.
**Producto esperado:** validación del modelo de datos, de las pantallas, de la navegación y de las reglas del modelo de ML.

---

## Bloque 3.1 — Modelo de datos

1. ¿Qué información de un estudiante necesita ver en una sola pantalla? (datos personales, historial académico, socioeconómico, predicciones, alertas, intervenciones)
2. ¿Necesita ver el historial semestre a semestre o solo el último semestre?
3. ¿Qué datos de una intervención es importante registrar? (tipo, fecha, responsable, descripción, resultado, próxima cita)
4. ¿Una alerta puede tener varias intervenciones? ¿Una intervención puede atender varias alertas?
5. ¿Qué estados debería tener una alerta? (pendiente, en proceso, atendida, cerrada)

## Bloque 3.2 — Interfaz, pantallas y navegación

6. Al iniciar sesión, ¿qué es lo primero que le gustaría ver?
7. ¿Qué indicadores debería tener el dashboard? Marque:
   - [ ] Total de estudiantes y cuántos están en riesgo alto, medio y bajo
   - [ ] Distribución de riesgo por programa
   - [ ] Distribución de riesgo por semestre
   - [ ] Alertas pendientes y atendidas
   - [ ] Intervenciones realizadas en el periodo
   - [ ] Evolución del riesgo en el tiempo
   - [ ] Otro: ____________
8. ¿Qué tipo de gráficos entiende mejor? (barras, torta, tabla, semáforo de colores)
9. ¿Cómo prefiere buscar a un estudiante? (código, documento, nombre, filtros por programa / semestre / nivel de riesgo)
10. ¿Le gustaría usar el sistema desde el celular (aplicación web instalable – PWA)?
11. ¿Cómo prefiere recibir las alertas? (dentro del sistema, correo electrónico, notificación en el celular)
12. ¿Qué formato de reporte necesita? (Excel/CSV, PDF, solo pantalla)

## Bloque 3.3 — Arquitectura

13. ¿El sistema debe conectarse con algún sistema institucional existente (plataforma académica, LDAP / correo institucional)?
14. ¿Debe permitir cargar datos de forma masiva (archivo Excel / CSV)?

## Bloque 3.4 — Diseño del modelo de Machine Learning

15. De la lista de variables de la Parte 2, ¿cuáles cree que influyen **más** en la deserción? Ordene las 5 principales.
16. ¿Hay variables que, por ética o normativa, **no** deberían usarse para predecir? (género, etnia, discapacidad, condición de víctima)
17. ¿Cómo prefiere que se muestre la explicación de la predicción? (lista de factores, gráfico de barras, texto en lenguaje natural)
18. ¿Cada cuánto debería reentrenarse el modelo con datos nuevos? (cada semestre, cada año)

---

### Registro de cierre

| Pantalla / componente | Observación del usuario | Cambio solicitado | Prioridad |
|---|---|---|---|
| | | | |
