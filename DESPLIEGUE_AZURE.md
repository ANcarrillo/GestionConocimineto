# Despliegue en Azure (fase 7)

Se crea una **máquina virtual Linux** en Azure, se instala Docker y se levanta el mismo proyecto con HTTPS.

```
Internet ──https──► Caddy (443) ──► frontend (Nginx) ──/api/──► backend ──► db
                    certificado          interfaz           API         PostgreSQL
                    automático
```

> Por qué una máquina virtual y no *App Services*: App Services ya no admite bien varios contenedores juntos (base de datos + API + web). Con la máquina virtual se usa exactamente el mismo `docker-compose.yml` que funciona en el PC.

---

## Parte 1 — Crear la máquina virtual (en el portal de Azure)

**0. Revisar el crédito.** Portal → **Suscripciones**. Debe aparecer *Azure for Students* (o similar) con saldo. Si no hay suscripción, actívela en https://azure.microsoft.com/free/students con el correo `@udla.edu.co`.

**1.** Portal → **Máquinas virtuales** → **+ Crear** → **Máquina virtual de Azure**.

**2. Pestaña "Datos básicos":**

| Campo | Valor |
|---|---|
| Suscripción | Azure for Students |
| Grupo de recursos | **Crear nuevo** → `sat-desercion-rg` |
| Nombre de la máquina virtual | `sat-desercion` |
| Región | **(US) East US 2** o la más barata que permita la suscripción |
| Imagen | **Ubuntu Server 24.04 LTS - x64 Gen2** |
| Tamaño | **Standard_B2s** (2 vCPU, 4 GB) — o **Standard_B1ms** (1 vCPU, 2 GB) para gastar menos crédito |
| Tipo de autenticación | **Clave pública SSH** |
| Nombre de usuario | `azureuser` |
| Origen de clave pública SSH | Generar un nuevo par de claves → nombre `sat-desercion-clave` |
| Puertos de entrada públicos | Permitir los puertos seleccionados → **HTTP (80), HTTPS (443), SSH (22)** |

**3. Pestaña "Discos":** SSD estándar, 30 GB, está bien.

**4.** **Revisar y crear** → **Crear** → **Descargar clave privada y crear recurso**. Guarde el archivo `sat-desercion-clave.pem` (por ejemplo en `C:\Users\USUARIO\.ssh\`). **No lo suba a GitHub ni lo comparta.**

**5. Nombre DNS gratuito.** Cuando termine: **Ir al recurso** → en *Información general*, junto a **Nombre DNS**, clic en **Sin configurar** → *Etiqueta de nombre DNS*: `sat-desercion-udla` → **Guardar**.
Queda una dirección como `sat-desercion-udla.eastus2.cloudapp.azure.com`. Ese será el **DOMINIO**.

> **Alternativa sin configurar nada:** [sslip.io](https://sslip.io) convierte la IP en un dominio. Para la IP `20.15.200.218` el dominio es `20-15-200-218.sslip.io`. Funciona con HTTPS, pero si la IP cambia hay que cambiar el dominio; por eso conviene poner la IP como **estática** (máquina virtual → *Redes* → IP pública → *Configuración* → *Estática*).

**6.** Anote la **Dirección IP pública** que aparece en *Información general*.

> **Para ahorrar crédito:** cuando no la usen, en la máquina virtual pulsen **Detener** (no solo apagar desde Linux). Detenida no cobra procesamiento; el disco sí cuesta unos centavos.

---

## Parte 2 — Preparar el servidor (desde PowerShell en su PC)

**7. Proteger la clave** (Windows exige que solo usted pueda leerla):

```powershell
icacls "$env:USERPROFILE\.ssh\sat-desercion-clave.pem" /inheritance:r /grant:r "$($env:USERNAME):R"
```

**8. Conectarse al servidor** (cambie `IP` por la IP pública):

```powershell
ssh -i "$env:USERPROFILE\.ssh\sat-desercion-clave.pem" azureuser@IP
```

La primera vez pregunta *Are you sure you want to continue connecting?* → escriba `yes`.

**9. Instalar Docker** (ya dentro del servidor):

```bash
curl -fsSL https://get.docker.com | sudo sh
```

```bash
sudo usermod -aG docker azureuser && exit
```

Vuelva a conectarse con el comando del paso 8 para que el cambio aplique.

**10. Si eligió B1ms (2 GB), agregue memoria de intercambio** (evita que la compilación se quede sin memoria):

```bash
sudo fallocate -l 2G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile && echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

**11. Descargar el proyecto:**

```bash
git clone https://github.com/ANcarrillo/GestionConocimineto.git app && cd app
```

---

## Parte 3 — Copiar los modelos y configurar

**12. Copiar los modelos entrenados** (no están en GitHub). En **otra** ventana de PowerShell, en la carpeta `Trabajofinal` del PC:

```powershell
scp -i "$env:USERPROFILE\.ssh\sat-desercion-clave.pem" ml\models\*.pkl ml\models\*.json azureuser@IP:~/app/ml/models/
```

**13. Crear el `.env` del servidor** (de vuelta en la conexión SSH, dentro de `~/app`):

```bash
cp .env.docker.example .env
sed -i "s/^POSTGRES_PASSWORD=.*/POSTGRES_PASSWORD=$(openssl rand -hex 16)/" .env
sed -i "s/^SECRET_KEY=.*/SECRET_KEY=$(openssl rand -hex 32)/" .env
sed -i "s/^DATOS_INICIALES=.*/DATOS_INICIALES=datos_prueba.sql/" .env
echo "DOMINIO=sat-desercion-udla.eastus2.cloudapp.azure.com" >> .env
```

- Cambie el `DOMINIO` por el que obtuvo en el paso 5.
- Las claves se generan al azar: **no use `root` ni contraseñas sencillas en internet**.
- `DATOS_INICIALES=datos_prueba.sql` carga los 100 estudiantes ficticios (útil para la sustentación). Para producción real use `sin_datos.sql`.

---

## Parte 4 — Encender

**14. Construir y levantar** (tarda unos minutos la primera vez):

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

**15. Verificar:**

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps
```

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs caddy | tail -20
```

En los logs de Caddy debe aparecer `certificate obtained successfully`.

**16. Abrir** `https://sat-desercion-udla.eastus2.cloudapp.azure.com` (su dominio) desde cualquier PC o celular. Como es una PWA, en el celular se puede **instalar** desde el menú del navegador.

**17. Seguridad inmediata** (los usuarios de prueba tienen la contraseña publicada en GitHub):

1. Ingrese con `admin@universidad.edu.co` y la contraseña de `database/roles_y_usuarios.sql`.
2. **Usuarios** → cree su propio administrador con una contraseña fuerte.
3. Ingrese con el nuevo administrador y **desactive** (o cambie la contraseña de) los 4 usuarios de prueba.

**18.** **Modelo ML → Registrar y activar**, y en el Dashboard **Predecir riesgo de todos**.

---

## Mantenimiento

Para no escribir los dos `-f` cada vez, dentro del servidor:

```bash
echo 'alias dc="docker compose -f docker-compose.yml -f docker-compose.prod.yml"' >> ~/.bashrc && source ~/.bashrc
```

| Para… | Comando (en el servidor, dentro de `~/app`) |
|---|---|
| Publicar cambios subidos a GitHub | `git pull && dc up -d --build` |
| Ver errores de la API | `dc logs -f backend` |
| Reiniciar todo | `dc restart` |
| Respaldo de la base de datos | `dc exec -T db pg_dump -U postgres desercion_db > respaldo_$(date +%F).sql` |
| Descargar el respaldo al PC (desde PowerShell) | `scp -i "$env:USERPROFILE\.ssh\sat-desercion-clave.pem" azureuser@IP:~/app/respaldo_*.sql .` |

**Respaldo diario automático** (a las 2 a. m., guarda los últimos 7):

```bash
mkdir -p ~/respaldos && (crontab -l 2>/dev/null; echo '0 2 * * * cd ~/app && docker compose exec -T db pg_dump -U postgres desercion_db > ~/respaldos/db_$(date +\%F).sql && ls -t ~/respaldos/*.sql | tail -n +8 | xargs -r rm') | crontab -
```

## Problemas frecuentes

| Síntoma | Causa / solución |
|---|---|
| El navegador no abre la página | Puertos 80/443 no abiertos: máquina virtual → **Redes** → agregar reglas de entrada para 80 y 443. |
| Caddy no obtiene el certificado | El `DOMINIO` del `.env` no coincide con el nombre DNS, o el puerto 80 está cerrado. |
| La compilación se detiene sin error | Falta memoria: haga el paso 10 (swap) o use B2s. |
| "Modelo no disponible" | Faltó el paso 12 (copiar modelos) o registrar el modelo en la web. |
| `Permission denied (publickey)` | Ruta de la clave `.pem` incorrecta o usuario distinto de `azureuser`. |
