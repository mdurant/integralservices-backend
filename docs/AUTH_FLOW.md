# Flujo de autenticación (Feature/authentication)

**Documentación completa (input/output por endpoint y uso en Postman):** **[docs/CICLO_VIDA_AUTH.md](./CICLO_VIDA_AUTH.md)**.

**Puertos:** Backend `http://localhost:3000`.  
Enlaces de correo apuntan al backend: `http://localhost:3000/auth/activate?token=...` y `http://localhost:3000/auth/reset-password?token=...`.

**Postman:** Importar `docs/IntegralServices-Auth.postman_collection.json`. Variables y ejemplos de body en `CICLO_VIDA_AUTH.md`.

---

## Resumen rápido

| Paso | Endpoint | Notas |
|------|----------|--------|
| 1 | POST `/identity/register` | Body: nombres, apellidos, email, password, rePassword, acceptTerms |
| 2 | POST `/identity/activate` | Body: token (del enlace del correo) |
| 3 | POST `/identity/send-otp` | Body: email |
| 4 | POST `/identity/verify-otp` | Body: email, code → devuelve accessToken, refreshToken |
| 5 | POST `/identity/login` | Body: email, password, rememberMe? |
| 6 | GET `/identity/dashboard` | Header: Authorization Bearer {{accessToken}} |
| 7 | GET/PATCH `/identity/profile` | Actualizar perfil (nacionalidad, phone, sexo, región, comuna, actividad) |
| 8 | POST `/identity/profile/image` | form-data campo `image` |

Recuperación: POST `/identity/forgot-password` → correo con enlace → POST `/identity/reset-password` (token, newPassword, rePassword).

---

## Registro

**POST** `/api/v1/identity/register`

Body:
- `nombres`, `apellidos`, `email`, `password`, `rePassword`, `acceptTerms` (boolean)

Tras el registro se envía un correo con enlace de activación (variable `FRONTEND_URL` + `/auth/activate?token=...`).

---

## Activación por email

**POST** `/api/v1/identity/activate`

Body: `{ "token": "..." }` (token del enlace del correo)

Al activar, se genera un OTP y se envía por correo. El usuario pasa a estado `pending_otp`.

---

## OTP y acceso al dashboard

**POST** `/api/v1/identity/send-otp` — reenvío de OTP  
Body: `{ "email": "..." }`

**POST** `/api/v1/identity/verify-otp`  
Body: `{ "email": "...", "code": "123456" }`

Al verificar el OTP:
- El usuario pasa a `active`
- Se activa 2FA (`two_fa_enabled: true`)
- Se crea un log de registro (`dashboard_first_access`)
- Se devuelven `accessToken`, `refreshToken` y datos de usuario (para redirigir al dashboard).

---

## Dashboard (protegido)

**GET** `/api/v1/identity/dashboard` — Header: `Authorization: Bearer <accessToken>`

Respuesta: mensaje de bienvenida, datos del usuario y log de registro (evento y fecha).

---

## Completar perfil (obligatorio)

**GET** `/api/v1/identity/profile` — Ver perfil  
**PATCH** `/api/v1/identity/profile` — Actualizar perfil

Campos obligatorios para considerar el perfil completo:
- `nombres`, `apellidos`
- `nacionalidad` (select: **GET** `/api/v1/identity/nacionalidades`)
- `phone` (8 dígitos)
- `sexo` (M, F, X, other)
- `regionCode`, `comunaCode` (geografía Chile: usar módulo geography o apis-chile)
- `actividadOfertadaId` (uno del listado: **GET** `/api/v1/identity/actividades-ofertadas` — 50 tipos de servicios, Chile)

---

## Imagen de perfil

**POST** `/api/v1/identity/profile/image` — Header: `Authorization: Bearer <accessToken>`, body: `multipart/form-data` con campo `image`.

Se guarda en `UPLOAD_DIR` (por defecto `uploads/`) y se sirve en `/uploads/<filename>`.

---

## Login y recordar credenciales

**POST** `/api/v1/identity/login`  
Body: `{ "email", "password", "rememberMe"?: boolean }`

Si `rememberMe` es true, el refresh token tiene mayor duración (`JWT_REFRESH_TTL_DAYS`).

**POST** `/api/v1/identity/refresh`  
Body: `{ "refreshToken": "..." }`

---

## Recuperación de contraseña

**POST** `/api/v1/identity/forgot-password`  
Body: `{ "email": "..." }`  
Se envía un enlace al correo (`FRONTEND_URL` + `/auth/reset-password?token=...`).

**POST** `/api/v1/identity/reset-password`  
Body: `{ "token": "...", "newPassword": "...", "rePassword": "..." }`

---

## Bajar cuenta (desactivar)

**POST** `/api/v1/identity/deactivate` — Header: `Authorization: Bearer <accessToken>`  
Body: `{ "password": "..." }`

Se marca al usuario como `deactivated` y se revocan las sesiones.

---

## Variables de entorno

- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` — Firmas de tokens
- `JWT_ACCESS_TTL_MIN`, `JWT_REFRESH_TTL_DAYS`
- `FRONTEND_URL` — Base URL de los enlaces de correo (por defecto `http://localhost:3000`). Activación y reset usan `/auth/activate` y `/auth/reset-password`.
- `OTP_TTL_MIN` — Minutos de validez del OTP
- `ACTIVATION_TOKEN_TTL_HOURS` — Validez del enlace de activación
- `UPLOAD_DIR` — Carpeta de subida de imágenes (por defecto `uploads`)

---

## Migraciones

Ejecutar antes de usar el flujo de autenticación:

```bash
npm run migrate
```

Crea las tablas: `users`, `otp_codes`, `user_sessions`, `registration_logs`, `activation_tokens`.
