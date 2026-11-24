# Parte 2 — Fase 2: Análisis y preparación de datos

**Dirigida a:** Registro y Control Académico, Oficina de TI / Sistemas de información, Bienestar Universitario.
**Duración estimada:** 45 minutos.
**Producto esperado:** inventario de fuentes de datos, variables disponibles, calidad de los datos y definición de "desertor" para entrenar el modelo.

---

## Bloque 2.1 — Recolección y exploración de los datos académicos

1. ¿En qué sistema se almacena la información académica de los estudiantes? (nombre del sistema, motor de base de datos, Excel)
2. ¿Desde qué año / semestre hay información histórica disponible?
3. ¿Cuántos registros aproximados hay? (estudiantes, matrículas por semestre, notas)
4. ¿En qué formato se puede entregar la información? (CSV, Excel, consulta SQL, API)
5. ¿Qué trámite o autorización se necesita para obtener los datos? ¿Deben entregarse **anonimizados**?
6. ¿Cada cuánto se actualiza la información? (por corte de notas, al cierre del semestre)

## Bloque 2.2 — Variables relevantes y valores faltantes

Marque qué variables existen, en qué sistema están y qué tan completas son.

| Variable | ¿Existe? | Sistema / dependencia | % aproximado de registros completos | Observaciones |
|---|---|---|---|---|
| Código y documento del estudiante | | | | |
| Fecha de nacimiento / edad | | | | |
| Género | | | | |
| Programa y facultad | | | | |
| Semestre de ingreso y semestre actual | | | | |
| Puntaje Saber 11 (ICFES) | | | | |
| Tipo de colegio (público / privado) | | | | |
| Promedio del semestre y promedio acumulado | | | | |
| Créditos inscritos, aprobados y reprobados | | | | |
| Materias reprobadas, canceladas, repetidas | | | | |
| Porcentaje de asistencia | | | | |
| Notas por asignatura | | | | |
| Estrato socioeconómico | | | | |
| Ingreso familiar | | | | |
| ¿Trabaja? Horas de trabajo por semana | | | | |
| Personas a cargo | | | | |
| Zona de residencia (urbana / rural) y distancia a la sede | | | | |
| Beca o apoyo financiero | | | | |
| Nivel educativo de los padres | | | | |
| Condición de víctima del conflicto, etnia, discapacidad | | | | |
| Estado final (activo, graduado, retirado, desertor) | | | | |

7. ¿Qué variables se llenan a mano y cuáles se generan automáticamente?
8. ¿Hay campos que normalmente quedan vacíos? ¿Por qué?
9. ¿Existen otras variables que ustedes consideren importantes para predecir la deserción?

## Bloque 2.3 — Datos inconsistentes y variables categóricas

10. ¿Han detectado errores frecuentes en los datos? (notas fuera de rango, fechas imposibles, duplicados, nombres mal escritos)
11. ¿Cómo se codifican las categorías? (ej. género "M/F" o "Masculino/Femenino", estrato "1–6", estado del estudiante)
12. ¿Han cambiado los códigos o formatos a lo largo de los años? (cambio de sistema, reforma de pensum)
13. ¿Cuál es la escala de notas? (0.0–5.0) ¿Cuál es la nota mínima aprobatoria?

## Bloque 2.4 — Normalización y valores atípicos

14. ¿Qué valores consideran "normales" y cuáles "extraños" para: promedio, créditos por semestre, horas de trabajo, distancia, edad?
15. ¿Existen casos especiales que deben excluirse? (estudiantes de intercambio, homologaciones, transferencias, reingresos)

## Bloque 2.5 — Balanceo de clases (definición de deserción)

16. ¿Cómo define la institución a un **desertor**? (ej. no se matricula durante 2 semestres consecutivos sin haberse graduado — definición del SPADIES / MEN)
17. ¿Cuántos estudiantes desertores aproximadamente hay frente a los que continúan? *(Permite estimar el desbalance de clases que se corregirá con SMOTE.)*
18. ¿Se diferencia entre retiro voluntario, cancelación de semestre, expulsión y deserción?
19. ¿Hay estudiantes que desertaron y luego regresaron (reintegro)? ¿Cómo se registran?

## Bloque 2.6 — Matriz de variables y partición de datos

20. ¿Qué semestres se pueden usar para **entrenar** el modelo y cuáles para **probarlo**? (ej. entrenar con 2018–2023, probar con 2024–2025)
21. ¿En qué momento del semestre debería hacerse la predicción? (al matricularse, después del primer corte, al finalizar) *(Define qué variables están disponibles en ese momento.)*
22. ¿Hay alguna persona de contacto para resolver dudas sobre los datos durante el proyecto?

---

### Registro de cierre

| Fuente de datos | Responsable | Formato | Fecha de entrega acordada | Anonimizado (Sí/No) |
|---|---|---|---|---|
| | | | | |
