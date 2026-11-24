# Parte 5 — Fase 7: Despliegue

**Dirigida a:** Oficina de TI / Infraestructura de la universidad.
**Duración estimada:** 25 minutos.
**Producto esperado:** condiciones del servidor de producción, seguridad, respaldos y monitoreo.

---

## Bloque 7.1 — Servidor y entorno de producción

1. ¿La universidad dispone de servidores propios o se usaría un servicio en la nube (AWS, Azure, VPS, Render, Railway)?
2. ¿Qué sistema operativo usan los servidores? ¿Se permite instalar Docker?
3. ¿Qué recursos se pueden asignar? (CPU, RAM, disco)
4. ¿Existen políticas para instalar software de terceros en servidores institucionales?

## Bloque 7.2 — Base de datos y backend

5. ¿Hay un servidor de PostgreSQL o MySQL institucional disponible, o se debe instalar uno nuevo?
6. ¿Qué versión de Python está permitida en producción?
7. ¿Quién administraría la base de datos y los usuarios del sistema después del proyecto?

## Bloque 7.3 — Publicación de la interfaz

8. ¿Bajo qué dominio o subdominio se publicaría? (ej. `desercion.universidad.edu.co`)
9. ¿La universidad provee el certificado SSL/TLS (HTTPS) o se usaría Let's Encrypt?
10. ¿El sistema debe ser accesible desde internet o solo desde la red interna / VPN?

## Bloque 7.4 — Variables de entorno, seguridad y pruebas

11. ¿Cómo se gestionan las credenciales y llaves secretas? (archivo `.env`, gestor de secretos)
12. ¿Existe un ambiente de pruebas (staging) separado del de producción?
13. ¿Hay requisitos de seguridad institucionales? (firewall, puertos permitidos, escaneo de vulnerabilidades)

## Bloque 7.5 — Monitoreo y respaldos

14. ¿Cada cuánto se hacen copias de seguridad y dónde se guardan?
15. ¿Qué herramienta de monitoreo usan? ¿Quién recibe los avisos de caída?
16. ¿Cuál es el procedimiento para reportar y atender incidentes?

---

### Registro de cierre

| Recurso / decisión | Valor acordado | Responsable |
|---|---|---|
| Servidor / proveedor | | |
| Dominio | | |
| Certificado HTTPS | | |
| Frecuencia de respaldos | | |
