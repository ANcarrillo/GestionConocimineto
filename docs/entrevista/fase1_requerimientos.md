# Parte 1 — Fase 1: Requerimientos y definición

**Dirigida a:** directivos, coordinadores de programa, docentes / consejeros académicos, Bienestar Universitario.
**Duración estimada:** 40 minutos.
**Producto esperado:** problema y alcance definidos, actores identificados, lista de requerimientos funcionales y no funcionales, backlog priorizado y criterios de aceptación.

---

## Bloque 1.1 — Problema, necesidades y alcance

1. ¿Cómo describiría la situación actual de deserción estudiantil en su programa / facultad?
2. ¿Conoce la tasa de deserción de los últimos semestres? ¿En qué semestres se concentra más?
3. Hoy, ¿cómo se detecta que un estudiante podría abandonar sus estudios? ¿Quién lo detecta y en qué momento?
4. ¿Qué acciones se toman cuando se detecta un estudiante en riesgo? (tutorías, apoyo psicológico, apoyo financiero, otros)
5. ¿Qué problemas o demoras tiene el proceso actual? ¿Qué se queda sin atender?
6. ¿Cuáles cree que son las principales causas de deserción? (académicas, económicas, personales, familiares, laborales, distancia, otras)
7. ¿Qué esperaría que haga una plataforma de alerta temprana? ¿Qué NO debería hacer?
8. ¿El sistema debería cubrir toda la universidad, una facultad o un programa en particular (alcance inicial)?
9. ¿Con qué frecuencia necesita conocer el nivel de riesgo? (cada semestre, a mitad de semestre, después de cada corte de notas)

## Bloque 1.2 — Usuarios, actores y fuentes de datos

10. ¿Qué personas o dependencias deberían usar el sistema? (rectoría, vicerrectoría, decanos, coordinadores, docentes, Bienestar, psicólogos, trabajo social)
11. Para cada uno, ¿qué información debería poder ver y qué acciones podría realizar?
12. ¿Quién debería recibir las alertas cuando un estudiante esté en riesgo alto?
13. ¿Quién es responsable de registrar y hacer seguimiento a las intervenciones?
14. ¿Qué dependencias tienen la información académica y socioeconómica de los estudiantes? (Registro Académico, Bienestar, Admisiones, Financiera)
15. ¿Existe algún sistema actual (SIA, plataforma académica, Excel) del que se pueda tomar esa información?
16. ¿Hay restricciones de confidencialidad sobre los datos de los estudiantes (Ley 1581 de 2012 – Habeas Data)? ¿Quién autoriza su uso?

## Bloque 1.3 — Requerimientos funcionales

Pregunte si necesita cada función y anote la prioridad (Alta / Media / Baja).

| # | Función | ¿La necesita? (Sí/No) | Prioridad | Comentarios |
|---|---|---|---|---|
| 17 | Iniciar sesión con usuario y contraseña según su rol | | | |
| 18 | Registrar, consultar y actualizar estudiantes | | | |
| 19 | Cargar datos académicos por semestre (promedio, créditos, asistencia, materias reprobadas) | | | |
| 20 | Cargar datos socioeconómicos (estrato, trabajo, ingresos, beca, distancia) | | | |
| 21 | Calcular la predicción de riesgo de un estudiante | | | |
| 22 | Calcular la predicción de forma masiva (todo un programa o semestre) | | | |
| 23 | Ver los factores que más influyen en el riesgo de cada estudiante | | | |
| 24 | Generar alertas automáticas cuando el riesgo sea alto | | | |
| 25 | Asignar una alerta a un responsable | | | |
| 26 | Registrar intervenciones (tutoría, apoyo psicológico, financiero) y su resultado | | | |
| 27 | Ver un dashboard con indicadores (estudiantes por nivel de riesgo, por programa, por semestre) | | | |
| 28 | Exportar reportes (Excel / CSV / PDF) | | | |
| 29 | Administrar usuarios y roles | | | |
| 30 | Reentrenar o actualizar el modelo de predicción | | | |

31. ¿Qué otra función considera indispensable y no está en la lista?
32. ¿Qué reportes o indicadores revisa hoy y le gustaría ver en el sistema?

## Bloque 1.4 — Requerimientos no funcionales

33. **Acceso:** ¿desde dónde se usaría el sistema? (oficina, casa, celular). ¿Necesita funcionar en el celular?
34. **Disponibilidad:** ¿en qué horarios debe estar disponible? ¿Qué tan grave es que falle un día?
35. **Rendimiento:** ¿cuánto es aceptable esperar para ver la predicción de un estudiante? (< 3 s, < 10 s)
36. **Usuarios concurrentes:** ¿cuántas personas lo usarían al mismo tiempo, aproximadamente?
37. **Volumen:** ¿cuántos estudiantes activos tiene el programa / la universidad?
38. **Seguridad:** ¿quién NO debe ver datos personales o socioeconómicos? ¿Se requiere registro de quién consulta qué (auditoría)?
39. **Usabilidad:** ¿qué nivel de manejo tecnológico tienen los usuarios? ¿Prefiere pantallas simples o con mucho detalle?
40. **Respaldo:** ¿cada cuánto deberían hacerse copias de seguridad de la información?
41. **Interpretabilidad:** ¿es importante entender por qué el sistema dice que un estudiante está en riesgo, o basta con el nivel?

## Bloque 1.5 — Priorización del Product Backlog

42. Si el sistema solo pudiera tener **tres funciones** en la primera versión, ¿cuáles serían?
43. ¿Qué función podría esperar a una segunda versión?
44. ¿Hay alguna fecha clave (inicio de semestre, comité académico) en la que se necesite una primera versión funcional?
45. ¿Con qué frecuencia podría reunirse con el equipo para revisar avances (revisión de sprint)? (cada 1 o 2 semanas)

Escala MoSCoW para clasificar lo dicho: **Must** (debe tener) · **Should** (debería) · **Could** (podría) · **Won't** (no por ahora).

## Bloque 1.6 — Criterios de aceptación y validación

46. ¿Cómo sabría usted que el sistema "funciona bien"?
47. ¿Qué porcentaje de acierto del modelo considera aceptable para usarlo en la toma de decisiones? (ej. ≥ 80 %)
48. ¿Qué es más grave para usted: **no detectar** a un estudiante que sí desertará (falso negativo) o **alertar** sobre uno que no desertará (falso positivo)? *(Esto define si se prioriza Recall o Precision.)*
49. ¿Qué umbrales de riesgo le parecen razonables? (ej. Bajo < 40 %, Medio 40–70 %, Alto ≥ 70 %)
50. ¿Quién debería aprobar formalmente el prototipo antes de usarlo?
51. ¿Acepta participar en la validación del prototipo diligenciando un formulario (Google Forms)?

---

### Registro de cierre

| Necesidad identificada | Tipo (RF / RNF) | Prioridad MoSCoW | Criterio de aceptación | Historia de usuario |
|---|---|---|---|---|
| | | | | |
