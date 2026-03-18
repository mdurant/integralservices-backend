# Ciclo de vida – Autenticación e identidad (main)

Documentación actualizada del flujo de autenticación tras el merge a `main`. Incluye **input** y **output** de cada endpoint para usar en **Postman**.

**Entorno:** Backend `http://localhost:3000`.  
Enlaces de correo (activación, reset password) usan `FRONTEND_URL` → por defecto `http://localhost:3000/auth/activate?token=...` y `http://localhost:3000/auth/reset-password?token=...`.

---

## Uso con Postman

1. **Importar colección:** File → Import → `docs/IntegralServices-Auth.postman_collection.json`.
2. **Variables de colección** (Collection → Variables):

| Variable           | Valor inicial              | Uso |
|--------------------|----------------------------|-----|
| `baseUrl`          | `http://localhost:3000/api/v1` | Base de la API |
| `accessToken`      | (vacío)                    | Se rellena tras Login o Verify OTP |
| `refreshToken`     | (vacío)                    | Se rellena tras Login o Verify OTP |
| `email`            | `test@example.com`         | Email para register/login/OTP |
| `activationToken`  | (vacío)                    | Token del enlace del correo de activación |
| `otpCode`          | `123456`                   | Código OTP del correo (cambiar en cada prueba) |
| `resetPasswordToken` | (vacío)                 | Token del enlace del correo de recuperación |

3. **Orden sugerido (flujo completo):**  
   Register → Activate → Send OTP → Verify OTP → Dashboard → Get Profile → Update Profile → (opcional) Upload Profile Image.  
   **Login directo:** Login → Dashboard / Get Profile.  
   **Recuperación:** Forgot Password → Reset Password (usar token del correo).

---

## 1. Registro

**POST** `{{baseUrl}}/identity/register`

| Tipo   | Contenido |
|--------|-----------|
| Header | `Content-Type: application/json` |
| Body   | JSON (ver abajo) |

**Input (body):**

```json
{
  "nombres": "Juan",
  "apellidos": "Pérez",
  "email": "usuario@example.com",
  "password": "Password123!",
  "rePassword": "Password123!",
  "acceptTerms": true
}
```

| Campo        | Tipo    | Requerido | Descripción |
|-------------|---------|-----------|-------------|
| nombres     | string  | Sí        | Nombre(s) |
| apellidos   | string  | Sí        | Apellido(s) |
| email       | string  | Sí        | Correo único |
| password    | string  | Sí        | Contraseña |
| rePassword  | string  | Sí        | Debe coincidir con `password` |
| acceptTerms | boolean | Sí        | Debe ser `true` |

**Output (201):**

```json
{
  "message": "Revisa tu correo para activar la cuenta.",
  "email": "usuario@example.com"
}
```

**Errores:** `400` contraseñas no coinciden / términos no aceptados; `409` correo ya registrado.

---

## 2. Activación por email

**POST** `{{baseUrl}}/identity/activate`

Token obtenido del enlace del correo: `http://localhost:3000/auth/activate?token=XXXX`.

**Input (body):**

```json
{
  "token": "24936dd01347bd89ac1c3209ec6406c9606160359284b373b3a3b1f6410554a3"
}
```

| Campo | Tipo   | Requerido | Descripción |
|-------|--------|-----------|-------------|
| token | string | Sí        | Token del enlace (hex 64 caracteres) |

**Output (200):**

```json
{
  "message": "Cuenta activada. Revisa tu correo para el código OTP."
}
```

**Errores:** `400` enlace inválido o expirado / usuario ya activado.

---

## 3. Envío de OTP

**POST** `{{baseUrl}}/identity/send-otp`

**Input (body):**

```json
{
  "email": "usuario@example.com"
}
```

**Output (200):**

- Si el usuario existe y está en estado que permite OTP:  
  `{ "message": "Código enviado al correo." }`
- Si el correo no existe (por seguridad):  
  `{ "message": "Si el correo existe, recibirás el código." }`

---

## 4. Verificación OTP (y acceso al dashboard)

**POST** `{{baseUrl}}/identity/verify-otp`

Tras verificar, el usuario pasa a `active`, se activa 2FA y se crea el log `dashboard_first_access`. La respuesta incluye tokens para usar en endpoints protegidos.

**Input (body):**

```json
{
  "email": "usuario@example.com",
  "code": "123456"
}
```

| Campo | Tipo   | Requerido | Descripción |
|-------|--------|-----------|-------------|
| email | string | Sí        | Mismo email del registro |
| code  | string | Sí        | Código de 6 dígitos recibido por correo |

**Output (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "a1b2c3d4e5f6...",
  "expiresIn": "15m",
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "profileImageUrl": null,
    "status": "active",
    "twoFaEnabled": true,
    "profileCompleted": false
  }
}
```

**En Postman:** Los scripts de la petición guardan `accessToken` y `refreshToken` en las variables de colección.

**Errores:** `400` código inválido o expirado.

---

## 5. Login

**POST** `{{baseUrl}}/identity/login`

**Input (body):**

```json
{
  "email": "usuario@example.com",
  "password": "Password123!",
  "rememberMe": true
}
```

| Campo       | Tipo    | Requerido | Descripción |
|------------|---------|-----------|-------------|
| email      | string  | Sí        | Correo del usuario activo |
| password   | string  | Sí        | Contraseña |
| rememberMe | boolean | No        | Si `true`, refresh token con mayor duración |

**Output (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "a1b2c3d4e5f6...",
  "expiresIn": "15m",
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "profileImageUrl": null,
    "status": "active",
    "twoFaEnabled": true,
    "profileCompleted": true
  }
}
```

**Errores:** `401` credenciales inválidas; `403` cuenta desactivada o pendiente activación/OTP.

---

## 6. Refresh token

**POST** `{{baseUrl}}/identity/refresh`

**Input (body):**

```json
{
  "refreshToken": "valor_obtenido_en_login_o_verify_otp"
}
```

**Output (200):**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "expiresIn": "15m",
  "user": { ... }
}
```

**Errores:** `401` refresh token inválido o revocado.

---

## 6.1. Logout (este dispositivo)

**POST** `{{baseUrl}}/identity/logout`

Revoca solo la sesión asociada al `refreshToken` enviado. El cliente debe enviar el refresh token que tiene guardado y después borrarlo en local.

**Input (body):**

```json
{
  "refreshToken": "valor_guardado_en_el_cliente"
}
```

**Output (200):**

```json
{
  "message": "Sesión cerrada."
}
```

Siempre responde 200 con el mismo mensaje (incluso si el token era inválido o ya estaba revocado), para no revelar información.

---

## 6.2. Logout (todos los dispositivos)

**POST** `{{baseUrl}}/identity/logout-all`

**Headers:** `Authorization: Bearer {{accessToken}}`

Revoca todas las sesiones del usuario autenticado. Útil para “Cerrar sesión en todos los dispositivos” desde configuración o seguridad.

**Input:** Sin body.

**Output (200):**

```json
{
  "message": "Sesiones cerradas en todos los dispositivos."
}
```

**Errores:** `401` sin token o token inválido.

---

## 7. Recuperación de contraseña – Solicitar enlace

**POST** `{{baseUrl}}/identity/forgot-password`

**Input (body):**

```json
{
  "email": "usuario@example.com"
}
```

**Output (200):**

- Siempre el mismo mensaje (por seguridad):  
  `{ "message": "Revisa tu correo para restablecer la contraseña." }`  
  o si el correo no existe:  
  `{ "message": "Si el correo existe, recibirás un enlace para restablecer la contraseña." }`

---

## 8. Recuperación de contraseña – Restablecer

**POST** `{{baseUrl}}/identity/reset-password`

Token del enlace del correo: `http://localhost:3000/auth/reset-password?token=XXXX`. En Postman usar variable `{{resetPasswordToken}}`.

**Input (body):**

```json
{
  "token": "token_del_enlace_del_correo",
  "newPassword": "NewPassword123!",
  "rePassword": "NewPassword123!"
}
```

| Campo       | Tipo   | Requerido | Descripción |
|------------|--------|-----------|-------------|
| token      | string | Sí        | Token del enlace |
| newPassword| string | Sí        | Nueva contraseña |
| rePassword | string | Sí        | Debe coincidir con `newPassword` |

**Output (200):**

```json
{
  "message": "Contraseña actualizada. Inicia sesión."
}
```

**Errores:** `400` token inválido/expirado o contraseñas no coinciden.

---

## 9. Dashboard (protegido)

**GET** `{{baseUrl}}/identity/dashboard`

**Headers:** `Authorization: Bearer {{accessToken}}`

**Input:** Sin body.

**Output (200):**

```json
{
  "welcome": "Bienvenido, Juan. Tu cuenta ha sido verificada correctamente.",
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "profileImageUrl": null,
    "status": "active",
    "twoFaEnabled": true,
    "profileCompleted": false
  },
  "registrationLog": {
    "event": "dashboard_first_access",
    "createdAt": "2026-03-04T21:00:00.000Z"
  }
}
```

**Errores:** `401` sin token o token inválido; `403` cuenta desactivada.

---

## 10. Obtener perfil (protegido)

**GET** `{{baseUrl}}/identity/profile`

**Headers:** `Authorization: Bearer {{accessToken}}`

**Output (200):**

```json
{
  "id": "uuid",
  "email": "usuario@example.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "profileImageUrl": "/uploads/profile-123.jpg",
  "status": "active",
  "twoFaEnabled": true,
  "profileCompleted": true,
  "nationality": "CL",
  "phone": "91234567",
  "sex": "M",
  "regionCode": "13",
  "comunaCode": "13101",
  "actividadOfertadaId": "plomeria",
  "emailVerifiedAt": "2026-03-04T20:00:00.000Z",
  "createdAt": "2026-03-04T19:00:00.000Z",
  "updatedAt": "2026-03-04T21:00:00.000Z"
}
```

---

## 11. Actualizar perfil (protegido)

**PATCH** `{{baseUrl}}/identity/profile`

**Headers:** `Authorization: Bearer {{accessToken}}`, `Content-Type: application/json`

**Input (body):** Todos los campos opcionales; se envían solo los que se actualizan.

```json
{
  "nombres": "Juan",
  "apellidos": "Pérez",
  "nacionalidad": "CL",
  "phone": "91234567",
  "sexo": "M",
  "regionCode": "13",
  "comunaCode": "13101",
  "actividadOfertadaId": "plomeria"
}
```

| Campo               | Tipo   | Descripción |
|---------------------|--------|-------------|
| nombres             | string | Nombre(s) |
| apellidos           | string | Apellido(s) |
| nacionalidad        | string | Código (ej. CL); ver GET nacionalidades |
| phone               | string | 8 dígitos Chile |
| sexo                | string | `M`, `F`, `X`, `other` |
| regionCode          | string | Código región; ver módulo geography |
| comunaCode          | string | Código comuna |
| actividadOfertadaId | string | Id del listado actividades-ofertadas |

**Output (200):** Objeto `user` con los campos actualizados (mismo formato que Get Profile, sin `createdAt`/`updatedAt` en la respuesta actual).

---

## 12. Imagen de perfil (protegido)

**POST** `{{baseUrl}}/identity/profile/image`

**Headers:** `Authorization: Bearer {{accessToken}}`

**Input:** `multipart/form-data`, campo **`image`** (archivo). Límite 5 MB.

**Output (200):**

```json
{
  "id": "uuid",
  "email": "usuario@example.com",
  "firstName": "Juan",
  "lastName": "Pérez",
  "profileImageUrl": "/uploads/profile-1234567890.jpg",
  "status": "active",
  "twoFaEnabled": true,
  "profileCompleted": true
}
```

La imagen se sirve en `http://localhost:3000/uploads/<filename>`.

**Errores:** `400` si no se envía archivo en el campo `image`.

---

## 13. Desactivar cuenta (protegido)

**POST** `{{baseUrl}}/identity/deactivate`

**Headers:** `Authorization: Bearer {{accessToken}}`, `Content-Type: application/json`

**Input (body):**

```json
{
  "password": "Password123!"
}
```

**Output (200):**

```json
{
  "message": "Cuenta desactivada."
}
```

**Errores:** `401` contraseña incorrecta; `403` cuenta desactivada.

---

## 14. Nacionalidades (público)

**GET** `{{baseUrl}}/identity/nacionalidades`

**Output (200):**

```json
{
  "data": [
    { "value": "CL", "label": "Chilena" },
    { "value": "AR", "label": "Argentina" },
    ...
  ]
}
```

---

## 15. Actividades ofertadas (público)

**GET** `{{baseUrl}}/identity/actividades-ofertadas`

**Output (200):**

```json
{
  "data": [
    { "id": "plomeria", "label": "Plomería" },
    { "id": "mant-servicios-domocilio-gas", "label": "Mant. servicios Domicilio GAS" },
    ...
  ]
}
```

Solo se puede elegir **una** actividad en el perfil (por id).

---

## 16. Health (público)

**GET** `http://localhost:3000/health`

**Output (200):**

```json
{
  "status": "ok",
  "timestamp": "2026-03-04T21:00:00.000Z"
}
```

---

## Resumen de flujo y estados de usuario

| Estado               | Descripción |
|----------------------|-------------|
| `pending_activation` | Registrado; debe abrir el enlace del correo y llamar a **Activate**. |
| `pending_otp`        | Email activado; debe ingresar OTP con **Verify OTP**. |
| `active`             | Cuenta activa; puede usar Login, Dashboard, Perfil, etc. |
| `deactivated`        | Cuenta dada de baja; no puede hacer login. |

**Formato de errores de la API:**

```json
{
  "error": {
    "message": "Texto legible",
    "code": "CODIGO_OPCIONAL"
  }
}
```

---

## Migraciones

Antes de usar el flujo en local:

```bash
npm run migrate
```

Crea tablas: `users`, `otp_codes`, `user_sessions`, `registration_logs`, `activation_tokens`.
