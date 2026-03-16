# Integral Services Backend

API REST en Node.js + TypeScript (Express, MySQL). Pensado para correr en local con MySQL en Docker.

---

## Requisitos

- **Node.js** ≥ 20
- **Docker** y **Docker Compose** (para MySQL)

---

## Arrancar en local (recomendado)

1. **Variables de entorno**
   ```bash
   cp .env.example .env
   ```
   El `.env.example` ya trae `DB_HOST=localhost` y `DB_PORT=3307` para desarrollo local.

2. **Levantar MySQL**
   ```bash
   docker compose up -d mysql
   ```
   - Crea la base `integralservices` y el usuario `app` / `app`.
   - Expone MySQL en **puerto 3307** en tu máquina (para no chocar con un MySQL en 3306).

3. **Instalar e iniciar la API**
   ```bash
   npm install
   npm run dev
   ```
   - Al arrancar se valida la conexión a la BD; si falla, el proceso termina.
   - Servidor en **http://localhost:3000** con recarga automática (nodemon). Si el frontend corre en otro puerto (p. ej. Angular en **4200**), configura `FRONTEND_URL=http://localhost:4200` en `.env` para que los enlaces de activación y recuperación de contraseña apunten al frontend.

4. **Comprobar**
   - Health: [http://localhost:3000/health](http://localhost:3000/health)
   - Swagger: según `SWAGGER_PATH` en `.env` (p. ej. `/api-docs`)

---

## Resumen rápido

```bash
cp .env.example .env
docker compose up -d mysql
npm install
npm run dev
```

→ [http://localhost:3000/health](http://localhost:3000/health)

---

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor en desarrollo (nodemon + ts-node). |
| `npm run build` | Compila TypeScript a `dist/`. |
| `npm start` | Producción: `node dist/server.js`. |
| `npm run dev:worker` | Worker en desarrollo. |
| `npm run migrate` | Migraciones Sequelize. |
| `npm run migrate:undo` | Revierte la última migración. |
| `npm run seed` | Seeders Sequelize. |
| `npm run install:apis-chile` | Instala SDK apis-chile (feriados, geografía). |

---

## Base de datos (MySQL 8.4)

- **Puerto en host:** 3307 (contenedor: 3306).
- **BD:** `integralservices` (se crea al levantar el contenedor).
- **Usuario:** `app` / `app` (definido en `docker-compose`).
- La app valida la conexión al iniciar (`connectDb()` en `server.ts`).

**Si MySQL no arranca** (p. ej. volumen dañado):

```bash
docker compose down
docker volume rm integralservices-backend_is_mysql_data
docker compose up -d mysql
```

(Si el volumen tiene otro nombre: `docker volume ls | grep mysql`.)

---

## Variables de entorno

| Variable | Uso |
|----------|-----|
| `DB_HOST` | `localhost` (app en tu máquina) o `mysql` (app en Docker). |
| `DB_PORT` | `3307` con MySQL en Docker desde el host; `3306` si MySQL es local. |
| `DB_NAME`, `DB_USER`, `DB_PASS` | Conexión MySQL (por defecto: `integralservices`, `app`, `app`). |
| `PORT` | Puerto del servidor (por defecto `3000`). |
| `FRONTEND_URL` | URL del frontend (p. ej. `http://localhost:4200`). Usado en enlaces de activación y reset. |
| `TZ` | Zona horaria (por defecto `America/Santiago`). |
| Resto | JWT, rate limit, Swagger, etc. Ver `.env.example`. |

---

## Todo en Docker (opcional)

Para levantar MySQL + backend + worker en contenedores:

```bash
cp .env.example .env
# En .env: DB_HOST=mysql, DB_PORT=3306 (para los servicios dentro de Docker)
docker compose up -d
```

El Dockerfile actual solo instala dependencias de producción, por lo que el servicio `backend` puede fallar al ejecutar `npm run dev` (falta nodemon/ts-node). Para desarrollo diario se recomienda usar **solo MySQL en Docker** y correr la API con `npm run dev` en tu máquina.
