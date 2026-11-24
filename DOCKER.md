# Despliegue con Docker

Levanta los tres componentes con un solo comando:

| Contenedor | Qué es | Dirección en el PC |
|---|---|---|
| `frontend` | Interfaz web (React compilado + Nginx) | http://localhost:8080 |
| `backend` | API FastAPI | http://localhost:8001/docs (Swagger) |
| `db` | PostgreSQL 16 | `localhost:5433` (usuario `postgres`) |

```
Navegador ──► frontend (Nginx :80) ──/api/──► backend (:8000) ──► db (:5432)
                                                   └── lee ml/models (modelos .pkl)
```

El navegador solo habla con Nginx; Nginx reenvía `/api/...` al backend. Por eso no hay problemas de CORS.

## Requisitos

- Docker Desktop instalado y **abierto** (el ícono de la ballena en verde).
- Haber entrenado al menos un modelo en `ml/models/` (ya hay dos).

## Pasos

Todos los comandos se ejecutan en la carpeta `Trabajofinal`.

**1. Crear el archivo de configuración** (solo la primera vez)

```powershell
Copy-Item .env.docker.example .env
```

Abra `.env` y cambie `POSTGRES_PASSWORD` y `SECRET_KEY`. Para generar una clave:

```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```

**2. Construir y levantar**

```powershell
docker compose up -d --build
```

La primera vez tarda unos minutos (descarga imágenes e instala dependencias). La base de datos se crea sola con `schema.sql`, los roles y usuarios de prueba y los 100 estudiantes ficticios.

**3. Verificar**

```powershell
docker compose ps
```

Los tres deben aparecer como `running` (`db` y `backend` como `healthy`).

**4. Entrar**

Abra http://localhost:8080 e ingrese con `admin@universidad.edu.co` (la contraseña está en `database/roles_y_usuarios.sql`).

**5. Activar el modelo de ML**

En la web: **Modelo ML → Registrar y activar** el modelo más reciente. Luego, en el **Dashboard**: **Predecir riesgo de todos**.

## Comandos útiles

| Para… | Comando |
|---|---|
| Ver los registros (logs) | `docker compose logs -f backend` |
| Detener todo | `docker compose stop` |
| Volver a encender | `docker compose start` |
| Aplicar cambios del código | `docker compose up -d --build` |
| Apagar y borrar contenedores (los datos se conservan) | `docker compose down` |
| **Borrar también la base de datos** y empezar de cero | `docker compose down -v` |
| Entrar a PostgreSQL | `docker compose exec db psql -U postgres -d desercion_db` |
| Crear otro administrador | `docker compose exec backend python crear_admin.py --email ... --nombres ... --apellidos ...` |

## Pasar los datos de la base local a Docker

Si ya tiene datos en el PostgreSQL instalado en el PC y quiere llevarlos al contenedor:

```powershell
pg_dump -U postgres -d desercion_db --clean --if-exists --no-owner -f respaldo.sql
```

```powershell
docker compose cp respaldo.sql db:/tmp/respaldo.sql
```

```powershell
docker compose exec db psql -U postgres -d desercion_db -f /tmp/respaldo.sql
```

`--clean` borra las tablas del contenedor y las crea de nuevo con los datos del PC (los datos de prueba del contenedor se pierden).

No suba `respaldo.sql` a GitHub si contiene datos reales.

## Producción

Para un servidor real (fase 7) además hay que:

- Usar claves nuevas en `.env` y borrar o cambiar los usuarios de prueba.
- Cambiar `DATOS_INICIALES` por un archivo vacío o por los datos reales.
- Poner HTTPS delante (por ejemplo, otro Nginx o Caddy con certificado) y no publicar los puertos `5433` y `8001`.
- Programar respaldos del volumen `datos_postgres` (`pg_dump`).
