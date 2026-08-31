# Plataforma de Eventos Musicales

API REST desarrollada para la gestión de eventos musicales y recitales.

## Temática

Plataforma de gestión de eventos musicales y recitales donde los usuarios pueden registrarse, iniciar sesión y consultar eventos disponibles. Los organizadores pueden crear y administrar sus propios eventos, mientras que los administradores cuentan con permisos globales sobre los recursos protegidos.

## Objetivos

El proyecto permite:

- Registro seguro de usuarios.
- Inicio y cierre de sesión.
- Autenticación centralizada mediante Passport.js.
- Autenticación mediante JWT.
- Gestión de sesiones mediante cookies HTTP Only.
- Autorización basada en roles.
- Diferenciación entre usuarios `user`, `organizer` y `admin`.
- Gestión de eventos musicales.
- Control de propiedad de eventos.
- Rutas administrativas protegidas.
- Preparación para incorporar proveedores externos de autenticación en futuras etapas.

## Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Passport.js
- Passport Local
- Passport JWT
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

Crear un archivo `.env` tomando como referencia `.env.example`.

```env
PORT=8080
NODE_ENV=development
MONGO_URL=mongodb+srv://usuario:contraseña@cluster.mongodb.net/plataforma_eventos?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1h
```

| Variable | Descripción |
|---|---|
| `PORT` | Puerto donde se ejecuta el servidor |
| `NODE_ENV` | Entorno de ejecución de la aplicación |
| `MONGO_URL` | URI de conexión a MongoDB Atlas |
| `JWT_SECRET` | Clave utilizada para firmar los JWT |
| `JWT_EXPIRES_IN` | Tiempo de expiración del JWT |

El archivo `.env` contiene información sensible y no debe subirse al repositorio. `.env.example` se incluye únicamente como referencia y no contiene credenciales privadas.

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

El proyecto utiliza **MongoDB Atlas** como sistema de persistencia y **Mongoose** como ODM.

Las contraseñas se almacenan hasheadas mediante **bcrypt** y nunca se guardan en texto plano.

## Estructura del proyecto

```text
.
├── app.js
├── server.js
├── src/
│   ├── config/
│   │   ├── database.config.js
│   │   └── passport.config.js
│   ├── controllers/
│   │   ├── events.controller.js
│   │   └── sessions.controller.js
│   ├── dao/
│   │   ├── events.dao.js
│   │   └── users.dao.js
│   ├── dto/
│   │   └── user.dto.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── authorize.middleware.js
│   │   ├── authorizeEventOwnerOrAdmin.middleware.js
│   │   ├── error.middleware.js
│   │   └── passport.middleware.js
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

El proyecto implementa una arquitectura por capas para separar responsabilidades:

- **Routes:** definen endpoints y aplican los middlewares necesarios.
- **Controllers:** reciben peticiones HTTP y generan respuestas.
- **Services:** contienen lógica de negocio reutilizable.
- **Repositories:** intermedian entre la aplicación y la persistencia.
- **DAO:** realizan el acceso a MongoDB mediante Mongoose.
- **Models:** definen las entidades persistidas.
- **DTO:** controlan qué información se expone y evitan devolver datos sensibles.
- **Middlewares:** gestionan autenticación, autorización, propiedad de recursos y errores.
- **Config:** contiene la conexión a MongoDB y las estrategias de Passport.
- **Utils:** contiene helpers reutilizables como hash de contraseñas y generación de JWT.

Flujo general:

```text
Route
  ↓
Middlewares
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
DAO
  ↓
MongoDB
```

# Autenticación con Passport.js

La autenticación se encuentra centralizada mediante **Passport.js**.

Las estrategias están definidas en:

```text
src/config/passport.config.js
```

Passport se inicializa en `app.js`.

| Estrategia | Función |
|---|---|
| `register` | Valida los datos y registra nuevos usuarios |
| `login` | Valida email y contraseña |
| `current` | Obtiene y verifica el JWT almacenado en la cookie |

Esta organización permite incorporar en el futuro estrategias como Google o GitHub sin trasladar la lógica a `app.js`.

## Estrategia `register`

La estrategia:

- Valida los campos obligatorios.
- Normaliza el email con `trim()` y `toLowerCase()`.
- Valida el formato del email.
- Valida la longitud mínima de la contraseña.
- Verifica que el email no esté registrado.
- Hashea la contraseña con bcrypt.
- Asigna siempre el rol `user` en el registro público.
- Persiste el usuario en MongoDB.
- Utiliza `UserDTO` para evitar exponer la contraseña.

Aunque un cliente envíe `role` en el body del registro, no puede registrarse públicamente como `admin` u `organizer`.

## Estrategia `login`

La estrategia:

- Normaliza el email.
- Busca el usuario registrado.
- Compara la contraseña mediante bcrypt.
- Utiliza un mensaje genérico ante credenciales incorrectas.
- Deja el usuario autenticado disponible en `req.user`.

Passport no genera el JWT.

Luego de autenticar correctamente, el controller construye el token y configura la cookie `currentUser`.

## Estrategia `current`

La estrategia `current`, basada en Passport JWT:

- Extrae el JWT desde la cookie `currentUser`.
- Verifica su firma con `JWT_SECRET`.
- Verifica su expiración.
- Recupera el payload.
- Lo deja disponible en `req.user`.

Las rutas privadas utilizan `auth.middleware.js`, que ejecuta internamente la estrategia `current` y devuelve `401` cuando no existe una sesión válida.

## Middleware de Passport

El archivo:

```text
src/middlewares/passport.middleware.js
```

permite ejecutar las estrategias de Passport para los flujos de registro y login y unifica sus respuestas de autenticación.

# JWT y cookie de autenticación

Después de un login exitoso se genera un JWT con información mínima:

```json
{
  "id": "id_del_usuario",
  "email": "usuario@mail.com",
  "role": "user"
}
```

El payload se construye mediante `sessions.service.js` y el controller genera el token con `generateToken`.

El JWT se almacena en `currentUser` con:

- `httpOnly: true`
- `sameSite: "lax"`
- `maxAge: 3600000`
- `secure: true` únicamente en producción

El JWT no contiene la contraseña.

# Roles y autorización

La aplicación utiliza tres roles:

- `user`: usuario estándar.
- `organizer`: puede crear eventos y modificar únicamente sus propios eventos.
- `admin`: cuenta con permisos administrativos y puede modificar cualquier evento.

El modelo `User` restringe el campo `role` a:

```text
user
organizer
admin
```

y utiliza `user` como valor por defecto.

## Matriz de permisos

| Acción | `user` | `organizer` | `admin` |
|---|:---:|:---:|:---:|
| Consultar eventos publicados | ✅ | ✅ | ✅ |
| Crear eventos | ❌ | ✅ | ✅ |
| Modificar eventos propios | ❌ | ✅ | ✅ |
| Modificar cualquier evento | ❌ | ❌ | ✅ |
| Ver todos los usuarios | ❌ | ❌ | ✅ |

## Middleware de autenticación

```text
src/middlewares/auth.middleware.js
```

Responsabilidades:

1. Ejecuta la estrategia Passport `current`.
2. Valida el JWT almacenado en la cookie.
3. Deja el usuario autenticado en `req.user`.
4. Si no existe una sesión válida, responde `401 Unauthorized`.

## Middleware de autorización por roles

```text
src/middlewares/authorize.middleware.js
```

Es reutilizable y recibe los roles permitidos como parámetros.

Ejemplo:

```javascript
authorize("organizer", "admin")
```

Si el usuario está autenticado pero su rol no se encuentra entre los permitidos, responde:

```json
{
  "status": "error",
  "message": "No tenés permisos para realizar esta acción"
}
```

con estado `403 Forbidden`.

## Autorización por propiedad de eventos

```text
src/middlewares/authorizeEventOwnerOrAdmin.middleware.js
```

Este middleware protege la modificación de eventos:

- Busca el evento solicitado.
- Permite continuar a un `admin`.
- Permite continuar a un `organizer` únicamente cuando `event.organizer` coincide con `req.user.id`.
- Devuelve `403` cuando un organizer intenta modificar un evento ajeno.
- Devuelve `404` cuando el evento no existe.

Al crear un evento, el campo `organizer` se obtiene de `req.user.id`; no se confía en un valor enviado por el cliente.

Al actualizar un evento, el campo `organizer` se excluye de los datos modificables para impedir cambiar la propiedad mediante el body.

# Diferencia entre 401 y 403

La API diferencia explícitamente autenticación de autorización.

### 401 Unauthorized

Significa que **no existe una sesión válida**.

Ejemplos:

- No se envió la cookie `currentUser`.
- El JWT es inválido.
- El JWT expiró.

Respuesta:

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

### 403 Forbidden

Significa que **el usuario está autenticado, pero no tiene permisos suficientes**.

Ejemplos:

- Un `user` intenta crear un evento.
- Un `organizer` intenta acceder al listado administrativo de usuarios.
- Un `organizer` intenta modificar el evento de otro organizer.

Respuesta:

```json
{
  "status": "error",
  "message": "No tenés permisos para realizar esta acción"
}
```

# Endpoints disponibles

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/health` | Público | Verifica el estado del servidor |
| GET | `/api/events` | Público | Obtiene todos los eventos |
| GET | `/api/events/:id` | Público | Obtiene un evento por ID |
| POST | `/api/events` | `organizer`, `admin` | Crea un evento |
| PUT | `/api/events/:id` | `organizer` propietario, `admin` | Actualiza un evento |
| POST | `/api/sessions/register` | Público | Registra un usuario |
| POST | `/api/sessions/login` | Público | Inicia sesión y genera la cookie |
| GET | `/api/sessions/current` | Autenticado | Devuelve el usuario autenticado |
| GET | `/api/sessions/users` | `admin` | Devuelve todos los usuarios |
| POST | `/api/sessions/logout` | Público | Cierra la sesión y elimina la cookie |

# Eventos

## Obtener eventos

```http
GET /api/events
```

Ruta pública.

## Obtener un evento por ID

```http
GET /api/events/:id
```

Ruta pública.

## Crear un evento

```http
POST /api/events
```

Requiere autenticación y rol `organizer` o `admin`.

### Request

```json
{
  "title": "Recital de Rock",
  "description": "Evento musical",
  "date": "2026-10-15",
  "location": "Buenos Aires",
  "capacity": 500
}
```

El cliente no necesita enviar `organizer`. El backend utiliza `req.user.id`.

### Response 201

```json
{
  "status": "success",
  "message": "Evento creado correctamente",
  "payload": {
    "_id": "6690...",
    "title": "Recital de Rock",
    "organizer": "665f2a..."
  }
}
```

Un usuario con rol `user` recibe `403`.

## Actualizar un evento

```http
PUT /api/events/:id
```

Requiere autenticación.

- `organizer`: solo puede modificar eventos propios.
- `admin`: puede modificar cualquier evento.
- `user`: no tiene permiso.

Ejemplo:

```json
{
  "title": "Recital de Rock - Actualizado",
  "capacity": 700
}
```

El campo `organizer` no puede modificarse mediante el body.

# Sesiones y autenticación

## Registrar usuario

```http
POST /api/sessions/register
```

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
  "message": "Registro correcto",
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
- El email debe tener formato válido.
- El email se normaliza.
- No se permiten emails duplicados.
- La contraseña debe tener al menos 8 caracteres.
- La contraseña se almacena hasheada.
- La respuesta nunca devuelve la contraseña.
- El registro público no permite elegir `admin` ni `organizer`.
- El rol asignado es `user`.

## Iniciar sesión

```http
POST /api/sessions/login
```

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

Credenciales incorrectas:

```json
{
  "status": "error",
  "message": "Credenciales inválidas"
}
```

con estado `401`.

## Usuario autenticado

```http
GET /api/sessions/current
```

La ruta utiliza `auth.middleware.js`. Este middleware ejecuta Passport `current`, valida la cookie y deja el payload en `req.user`.

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

Sin sesión válida:

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

con estado `401`.

## Listar todos los usuarios

```http
GET /api/sessions/users
```

Ruta administrativa exclusiva para `admin`.

Un `user` o `organizer` autenticado recibe `403`.

La respuesta utiliza `UserDTO`, por lo que no expone contraseñas.

## Cerrar sesión

```http
POST /api/sessions/logout
```

El controller elimina la cookie `currentUser`.

### Response 200

```json
{
  "status": "success",
  "message": "Sesión cerrada"
}
```

# Flujo de autenticación y autorización

```text
REGISTER
   ↓
authenticate("register")
   ↓
Passport register
   ↓
Validación + bcrypt + MongoDB
   ↓
UserDTO
   ↓
Response 201


LOGIN
   ↓
authenticate("login")
   ↓
Passport login
   ↓
Validación de credenciales
   ↓
req.user
   ↓
Controller
   ↓
JWT + cookie currentUser
   ↓
Response 200


RUTA PRIVADA
   ↓
auth.middleware
   ↓
Passport current
   ↓
JWT válido
   ↓
req.user
   ↓
authorize(...)
   ↓
¿Rol permitido?
   ├── NO → 403
   └── SÍ → Controller


MODIFICAR EVENTO
   ↓
auth
   ↓
authorize("organizer", "admin")
   ↓
authorizeEventOwnerOrAdmin
   ↓
¿Admin o propietario?
   ├── NO → 403
   └── SÍ → updateEvent
```

# Casos de prueba de autorización

Antes de la entrega se verificaron los siguientes escenarios:

| Caso | Resultado esperado |
|---|---|
| `user` intenta crear un evento | `403 Forbidden` |
| `organizer` crea un evento | `201 Created` |
| `organizer` intenta acceder al listado de usuarios | `403 Forbidden` |
| `admin` accede al listado de usuarios | `200 OK` |
| Ruta privada sin cookie | `401 Unauthorized` |
| `organizer` modifica un evento propio | `200 OK` |
| `organizer` intenta modificar un evento ajeno | `403 Forbidden` |
| `admin` modifica un evento ajeno | `200 OK` |

# Seguridad

El proyecto implementa:

- Contraseñas hasheadas mediante bcrypt.
- Contraseñas excluidas de las respuestas.
- `UserDTO` para evitar exposición de datos sensibles.
- JWT firmado con `JWT_SECRET`.
- Expiración configurable mediante `JWT_EXPIRES_IN`.
- JWT almacenado en cookie HTTP Only.
- `sameSite: "lax"`.
- Cookie `secure` únicamente en producción.
- Mensaje genérico ante credenciales incorrectas.
- Passport centralizado.
- Registro público con rol `user` obligatorio.
- Autenticación y autorización separadas.
- Control de acceso por roles.
- Control de propiedad de eventos.
- El propietario de un evento no puede alterarse mediante el body.
- Payload JWT limitado a `id`, `email` y `role`.

## Seguridad del repositorio

El archivo `.gitignore` excluye:

```gitignore
node_modules/
.env
```

Por lo tanto:

- `node_modules/` no se incluye en el repositorio.
- `.env` no se incluye en el repositorio.
- `.env.example` documenta las variables necesarias con valores de ejemplo.
- Las credenciales reales no se escriben directamente en el código fuente.
- `JWT_SECRET` y `MONGO_URL` se obtienen desde variables de entorno.

# Preparación para estrategias externas

La configuración de Passport está centralizada en:

```text
src/config/passport.config.js
```

`app.js` únicamente inicializa Passport:

```javascript
initializePassport();
app.use(passport.initialize());
```

Esta separación permite incorporar futuras estrategias como Google, GitHub u otros proveedores OAuth sin trasladar la lógica de las estrategias a `app.js`.

# Estado del proyecto

Actualmente el proyecto cuenta con:

- Servidor Express funcionando.
- Variables de entorno mediante Dotenv.
- MongoDB Atlas y Mongoose.
- Arquitectura por capas.
- Middleware global de errores.
- Modelos `Event` y `User`.
- Registro seguro de usuarios.
- DTO para exposición segura de usuarios.
- Hash y comparación de contraseñas con bcrypt.
- Passport.js inicializado.
- Estrategias `register`, `login` y `current`.
- JWT y cookie HTTP Only.
- Middleware reutilizable de autenticación.
- Middleware reutilizable de autorización por roles.
- Roles `user`, `organizer` y `admin`.
- Ruta administrativa exclusiva para `admin`.
- Creación de eventos restringida a `organizer` y `admin`.
- Asociación automática de eventos con su organizer.
- Control de propiedad al modificar eventos.
- `organizer` limitado a sus propios eventos.
- `admin` habilitado para modificar cualquier evento.
- Diferenciación entre errores `401` y `403`.
- Logout y eliminación de cookie.
- Configuración preparada para proveedores externos.
- `.env` y `node_modules/` excluidos mediante `.gitignore`.
- `.env.example` disponible como referencia.

## Autor

**Lionel Cancellieri**

Proyecto desarrollado para el curso **Programación Backend II: Diseño y Arquitectura Backend**.