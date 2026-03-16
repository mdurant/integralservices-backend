# Flujo de autenticación (Feature/authentication)

**Puertos:** Backend `http://localhost:3000`, Frontend `http://localhost:4200`.  
Los enlaces de activación y recuperación de contraseña apuntan al frontend (`FRONTEND_URL`), por ejemplo:  
`http://localhost:4200/auth/activate?token=...` y `http://localhost:4200/auth/reset-password?token=...`.

---

## Postman

En **`docs/IntegralServices-Auth.postman_collection.json`** está la colección para probar todos los endpoints.

**Importar en Postman:** File → Import → seleccionar el archivo `IntegralServices-Auth.postman_collection.json`.

**Variables de la colección** (editar en Collection → Variables):

| Variable          | Valor por defecto           | Uso |
|-------------------|-----------------------------|-----|
| `baseUrl`         | `http://localhost:3000/api/v1` | Base de la API (backend en puerto 3000) |
| `accessToken`     | (vacío)                     | Se rellena automáticamente tras Login o Verify OTP |
| `refreshToken`    | (vacío)                     | Se rellena automáticamente tras Login o Verify OTP |
| `email`           | `test@example.com`          | Email para register/login/OTP |
| `activationToken`| (vacío)                     | Pegar el token del enlace del correo de activación |
| `otpCode`         | `123456`                    | Código OTP recibido por correo (cambiar en cada prueba) |

**Orden sugerido para probar el flujo completo:**  
Register → (revisar correo y copiar token) → Activate → Send OTP → (revisar correo y copiar código) → Verify OTP → Dashboard → Get Profile → Update Profile → (opcional) Upload Profile Image.  
Para login directo (usuario ya activo): Login → Dashboard / Get Profile.  
Para recuperación: Forgot Password → (revisar correo, copiar token) → Reset Password.

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
- `FRONTEND_URL` — URL del frontend (p. ej. `http://localhost:4200`). Enlaces de activación y reset apuntan aquí.
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
