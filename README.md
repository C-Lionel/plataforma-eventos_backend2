# Plataforma de Eventos Musicales

API REST desarrollada para la gestión de eventos musicales y recitales.

## Temática

Plataforma de gestión de eventos musicales y recitales donde los usuarios pueden registrarse, iniciar sesión, consultar eventos disponibles e inscribirse, mientras que los administradores podrán crear eventos, gestionar cupos y controlar las inscripciones.

## Objetivos

El proyecto permitirá:

- Registro seguro de usuarios.
- Inicio y cierre de sesión.
- Autenticación mediante JWT.
- Gestión de sesiones mediante cookies HTTP Only.
- Gestión de eventos musicales.
- Inscripción de usuarios a eventos.
- Administración de eventos.
- Control de cupos disponibles.
- Gestión de roles (Administrador, Organizador y Usuario).

## Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Bcrypt
- JSON Web Token (JWT)
- Cookie Parser
- Dotenv
- JavaScript (ES Modules)

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/C-Lionel/plataforma-eventos_backend2.git
```

Ingresar al proyecto:

```bash
cd plataforma-eventos_backend2
```

Instalar las dependencias:

```bash
npm install
```

## Variables de entorno

Crear un archivo `.env` tomando como referencia el archivo `.env.example`.

Ejemplo:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=mongodb+srv://usuario:contraseña@cluster.mongodb.net/plataforma_eventos?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1h
```

El archivo `.env` contiene información sensible y no debe subirse al repositorio.

## Ejecución

Modo desarrollo:

```bash
npm run dev
```

Modo producción:

```bash
npm start
```

## Base de datos

El proyecto utiliza **MongoDB Atlas** como sistema de persistencia y **Mongoose** como ODM para la comunicación con la base de datos.

Las contraseñas de los usuarios se almacenan hasheadas mediante **bcrypt** y nunca se guardan en texto plano.

## Estructura del proyecto

```text
.
├── app.js
├── server.js
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── events.controller.js
│   │   └── sessions.controller.js
│   ├── dao/
│   │   ├── events.dao.js
│   │   └── users.dao.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   ├── models/
│   │   ├── Event.js
│   │   └── User.js
│   ├── repositories/
│   │   ├── events.repository.js
│   │   └── users.repository.js
│   ├── routes/
│   │   ├── events.router.js
│   │   └── sessions.router.js
│   ├── services/
│   │   ├── events.service.js
│   │   └── sessions.service.js
│   └── utils/
│       ├── hash.js
│       └── jwt.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Arquitectura

El proyecto implementa una arquitectura por capas para separar responsabilidades y facilitar el mantenimiento.

- **Routes:** definen los endpoints de la API.
- **Controllers:** reciben las peticiones HTTP y generan las respuestas.
- **Services:** contienen la lógica de negocio y las validaciones.
- **Repositories:** intermedian entre los servicios y la capa de persistencia.
- **DAO:** realizan el acceso a la base de datos mediante Mongoose.
- **Models:** definen los modelos de MongoDB.
- **Middlewares:** manejan funcionalidades comunes, como autenticación y tratamiento global de errores.
- **Config:** contiene la configuración general de la aplicación y la conexión a MongoDB.
- **Utils:** contiene funciones reutilizables para el hash de contraseñas y la generación/verificación de JWT.

## Autenticación

La autenticación se realiza mediante **JSON Web Tokens (JWT)**.

Cuando un usuario inicia sesión correctamente, el servidor genera un JWT con la siguiente información:

```json
{
  "id": "id_del_usuario",
  "email": "usuario@mail.com",
  "role": "user"
}
```

El token se almacena en una cookie llamada `currentUser` configurada con:

- `httpOnly: true`
- `sameSite: "lax"`
- `maxAge: 3600000`
- `secure: true` únicamente en producción

La ruta protegida `/api/sessions/current` utiliza un middleware de autenticación que verifica el JWT y almacena su payload en `req.user`.

---

# Endpoints disponibles

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/health` | Verifica el estado del servidor |
| GET | `/api/events` | Obtiene todos los eventos |
| GET | `/api/events/:id` | Obtiene un evento por ID |
| POST | `/api/events` | Crea un evento |
| PUT | `/api/events/:id` | Actualiza un evento |
| DELETE | `/api/events/:id` | Elimina un evento |
| POST | `/api/sessions/register` | Registra un nuevo usuario |
| POST | `/api/sessions/login` | Inicia sesión y genera la cookie de autenticación |
| GET | `/api/sessions/current` | Obtiene los datos del usuario autenticado |
| POST | `/api/sessions/logout` | Cierra la sesión y elimina la cookie |

---

## Estado del servidor

```http
GET /api/health
```

Respuesta:

```json
{
  "status": "ok",
  "message": "Servidor activo"
}
```

---

# Eventos

## Obtener eventos

```http
GET /api/events
```

Obtiene la lista de eventos almacenados en MongoDB.

## Obtener un evento por ID

```http
GET /api/events/:id
```

Obtiene un evento específico mediante su identificador.

## Crear un evento

```http
POST /api/events
```

Ejemplo del cuerpo de la petición:

```json
{
  "title": "Recital de Rock",
  "description": "Evento musical",
  "date": "2026-08-15",
  "location": "Buenos Aires",
  "capacity": 500
}
```

## Actualizar un evento

```http
PUT /api/events/:id
```

Permite modificar la información de un evento existente.

## Eliminar un evento

```http
DELETE /api/events/:id
```

Permite eliminar un evento de la base de datos.

---

# Sesiones y autenticación

## Registrar usuario

```http
POST /api/sessions/register
```

Permite registrar un nuevo usuario de forma segura.

### Request

```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
```

### Response 201

```json
{
  "status": "success",
  "payload": {
    "id": "665f2a...",
    "first_name": "Ana",
    "last_name": "Pérez",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

### Validaciones

- Todos los campos son obligatorios.
- El email debe tener un formato válido.
- El email se normaliza utilizando `trim()` y `toLowerCase()`.
- No se permiten usuarios con emails duplicados.
- La contraseña debe tener una longitud mínima de 8 caracteres.
- La contraseña se almacena hasheada mediante bcrypt.
- La respuesta nunca devuelve la contraseña.
- El rol no puede establecerse desde el registro público.

---

## Iniciar sesión

```http
POST /api/sessions/login
```

Valida las credenciales del usuario y, si son correctas, genera un JWT y lo almacena en la cookie HTTP Only `currentUser`.

### Request

```json
{
  "email": "ana@mail.com",
  "password": "Secreta123"
}
```

### Response 200

```json
{
  "status": "success",
  "message": "Login correcto"
}
```

Si las credenciales no son válidas:

### Response 401

```json
{
  "status": "error",
  "message": "Credenciales inválidas"
}
```

El sistema utiliza el mismo mensaje tanto para un email inexistente como para una contraseña incorrecta.

---

## Usuario autenticado

```http
GET /api/sessions/current
```

Ruta protegida mediante el middleware `auth`.

El middleware obtiene el JWT desde la cookie `currentUser`, verifica su firma y expiración y guarda el payload en `req.user`.

### Response 200

```json
{
  "status": "success",
  "payload": {
    "id": "665f2a...",
    "email": "ana@mail.com",
    "role": "user"
  }
}
```

La respuesta no incluye la contraseña del usuario.

Si no existe una cookie válida o el JWT fue manipulado o expiró:

### Response 401

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

---

## Cerrar sesión

```http
POST /api/sessions/logout
```

Elimina la cookie `currentUser` utilizada para la autenticación.

### Response 200

```json
{
  "status": "success",
  "message": "Sesión cerrada"
}
```

Luego del logout, intentar acceder nuevamente a:

```http
GET /api/sessions/current
```

devuelve:

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

con estado HTTP `401`.

---

# Flujo de autenticación

El flujo implementado es:

```text
Registro
   ↓
Contraseña hasheada con bcrypt
   ↓
Usuario almacenado en MongoDB
   ↓
Login
   ↓
Comparación de contraseña con bcrypt
   ↓
Generación del JWT
   ↓
Cookie HTTP Only currentUser
   ↓
GET /api/sessions/current
   ↓
Middleware auth
   ↓
Verificación del JWT
   ↓
req.user
   ↓
Datos del usuario autenticado
   ↓
Logout
   ↓
Eliminación de currentUser
```

## Casos probados

Antes de la entrega se verificaron los siguientes casos:

- Registro exitoso.
- Login exitoso.
- Login con email inexistente.
- Login con contraseña incorrecta.
- Acceso a `/current` con una cookie válida.
- Acceso a `/current` sin cookie.
- Acceso a `/current` con un token inválido o manipulado.
- Logout.
- Acceso a `/current` después del logout.

## Seguridad

El proyecto implementa las siguientes medidas:

- Contraseñas hasheadas mediante bcrypt.
- Las contraseñas nunca se incluyen en las respuestas de la API.
- JWT firmado utilizando `JWT_SECRET` desde variables de entorno.
- Expiración del JWT configurable mediante `JWT_EXPIRES_IN`.
- JWT almacenado en una cookie HTTP Only.
- Cookie configurada con `sameSite: "lax"`.
- Cookie `secure` habilitada únicamente en producción.
- Mensaje genérico ante credenciales incorrectas.
- Middleware para proteger rutas que requieren autenticación.
- `.env` excluido del repositorio.

# Estado del proyecto

Actualmente el proyecto cuenta con:

- Servidor Express.
- Variables de entorno mediante Dotenv.
- Conexión a MongoDB Atlas utilizando Mongoose.
- Arquitectura por capas (Route → Controller → Service → Repository → DAO).
- Middleware global para manejo de errores.
- Modelos `Event` y `User`.
- CRUD básico de eventos.
- Registro seguro de usuarios.
- Hash y comparación de contraseñas mediante bcrypt.
- Login de usuarios.
- Generación y verificación de JWT.
- Autenticación mediante cookie HTTP Only.
- Ruta protegida `/api/sessions/current`.
- Middleware de autenticación.
- Logout y eliminación de la cookie de autenticación.

## Autor

**Lionel Cancellieri**

Proyecto desarrollado para el curso **Programación Backend II: Diseño y Arquitectura Backend**.