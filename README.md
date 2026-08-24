# Plataforma de Eventos Musicales

API REST desarrollada para la gestión de eventos musicales y recitales.

## Temática

Plataforma de gestión de eventos musicales y recitales donde los usuarios pueden registrarse, iniciar sesión, consultar eventos disponibles e inscribirse, mientras que los administradores y organizadores podrán gestionar eventos, cupos e inscripciones.

## Objetivos

El proyecto permitirá:

- Registro seguro de usuarios.
- Inicio y cierre de sesión.
- Autenticación centralizada mediante Passport.js.
- Autenticación mediante JWT.
- Gestión de sesiones mediante cookies HTTP Only.
- Gestión de eventos musicales.
- Inscripción de usuarios a eventos.
- Administración de eventos.
- Control de cupos disponibles.
- Gestión de roles (Administrador, Organizador y Usuario).
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

Crear un archivo `.env` tomando como referencia el archivo `.env.example`.

Ejemplo:

```env
PORT=8080
NODE_ENV=development
MONGO_URL=mongodb+srv://usuario:contraseña@cluster.mongodb.net/plataforma_eventos?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta
JWT_EXPIRES_IN=1h
```

Variables utilizadas:

| Variable | Descripción |
|---|---|
| `PORT` | Puerto donde se ejecuta el servidor |
| `NODE_ENV` | Entorno de ejecución de la aplicación |
| `MONGO_URL` | URI de conexión a MongoDB Atlas |
| `JWT_SECRET` | Clave utilizada para firmar los JWT |
| `JWT_EXPIRES_IN` | Tiempo de expiración del JWT |

El archivo `.env` contiene información sensible y no debe subirse al repositorio.

El archivo `.env.example` se incluye como referencia y contiene únicamente valores de ejemplo, sin credenciales privadas.

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

El proyecto implementa una arquitectura por capas para separar responsabilidades y facilitar el mantenimiento.

- **Routes:** definen los endpoints y delegan la autenticación a las estrategias correspondientes.
- **Controllers:** reciben las peticiones HTTP y generan las respuestas. El controller de login genera el JWT y configura la cookie de autenticación.
- **Services:** contienen lógica de negocio reutilizable.
- **Repositories:** intermedian entre la lógica de la aplicación y la capa de persistencia.
- **DAO:** realizan el acceso a la base de datos mediante Mongoose.
- **Models:** definen los modelos almacenados en MongoDB.
- **DTO:** controlan qué información de las entidades se expone hacia otras capas, evitando devolver datos sensibles como la contraseña.
- **Middlewares:** manejan funcionalidades comunes, como la integración de Passport y el tratamiento global de errores.
- **Config:** contiene la configuración de la aplicación, conexión a MongoDB y estrategias de Passport.
- **Utils:** contiene funciones reutilizables, como el hash de contraseñas y la generación de JWT.

---

# Autenticación con Passport.js

La autenticación se encuentra centralizada mediante **Passport.js**.

Las estrategias están definidas en:

```text
src/config/passport.config.js
```

Passport se inicializa en `app.js`, mientras que la definición de las estrategias permanece separada de la configuración principal de Express.

Actualmente se implementan tres estrategias:

| Estrategia | Función |
|---|---|
| `register` | Valida los datos y registra nuevos usuarios |
| `login` | Valida email y contraseña |
| `current` | Obtiene y verifica el JWT almacenado en la cookie |

Esta organización permite incorporar en el futuro nuevas estrategias de autenticación, como **Google** o **GitHub**, sin tener que modificar la lógica principal de `app.js`.

## Estrategia `register`

La estrategia `register` se encarga de:

- Validar los campos obligatorios.
- Normalizar el email mediante `trim()` y `toLowerCase()`.
- Validar el formato del email.
- Validar la longitud mínima de la contraseña.
- Verificar que el email no se encuentre registrado.
- Hashear la contraseña mediante bcrypt.
- Asignar el rol `user` por defecto.
- Persistir el usuario en MongoDB.
- Utilizar `UserDTO` para evitar exponer la contraseña.

La ruta delega la autenticación mediante:

```text
authenticate("register")
```

## Estrategia `login`

La estrategia `login` se encarga de:

- Normalizar el email.
- Buscar el usuario registrado.
- Comparar la contraseña mediante bcrypt.
- Rechazar credenciales incorrectas utilizando un mensaje genérico.
- Dejar el usuario autenticado disponible en `req.user`.

Passport **no genera el JWT**.

Una vez que la estrategia autentica correctamente al usuario, el controller genera el JWT y configura la cookie `currentUser`.

## Estrategia `current`

La estrategia `current` utiliza Passport JWT para:

- Obtener el JWT desde la cookie `currentUser`.
- Verificar la firma del token mediante `JWT_SECRET`.
- Verificar que el token no haya expirado.
- Obtener el payload del JWT.
- Dejar el payload disponible en `req.user`.

La ruta:

```http
GET /api/sessions/current
```

utiliza esta estrategia como middleware de autenticación.

## Middleware de Passport

El archivo:

```text
src/middlewares/passport.middleware.js
```

permite ejecutar las diferentes estrategias de Passport y manejar de manera uniforme las respuestas de autenticación.

Cuando una estrategia se ejecuta correctamente, el usuario queda disponible en:

```javascript
req.user
```

Cuando falla, el middleware devuelve el código HTTP y mensaje correspondiente en formato JSON.

---

# JWT y cookie de autenticación

Después de un login exitoso, el controller genera un JWT con información mínima del usuario:

```json
{
  "id": "id_del_usuario",
  "email": "usuario@mail.com",
  "role": "user"
}
```

La construcción del payload se realiza mediante `sessions.service.js`, mientras que la generación del token permanece en el controller utilizando el helper `generateToken`.

El token se almacena en una cookie llamada `currentUser` configurada con:

- `httpOnly: true`
- `sameSite: "lax"`
- `maxAge: 3600000`
- `secure: true` únicamente en producción

El JWT no contiene la contraseña del usuario.

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
| POST | `/api/sessions/register` | Registra un usuario mediante la estrategia `register` |
| POST | `/api/sessions/login` | Autentica mediante la estrategia `login` y genera la cookie |
| GET | `/api/sessions/current` | Valida el JWT mediante la estrategia `current` |
| POST | `/api/sessions/logout` | Cierra la sesión y elimina la cookie |

---

## Estado del servidor

```http
GET /api/health
```

### Response 200

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

La ruta utiliza la estrategia Passport `register`.

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

### Response 400 — campos faltantes

```json
{
  "status": "error",
  "message": "Faltan campos obligatorios"
}
```

### Response 400 — email inválido

```json
{
  "status": "error",
  "message": "El formato del email no es válido"
}
```

### Response 409 — email duplicado

```json
{
  "status": "error",
  "message": "El email ya está registrado"
}
```

### Validaciones

- Todos los campos son obligatorios.
- El email debe tener un formato válido.
- El email se normaliza mediante `trim()` y `toLowerCase()`.
- No se permiten usuarios con emails duplicados.
- La contraseña debe tener una longitud mínima de 8 caracteres.
- La contraseña se almacena hasheada mediante bcrypt.
- La respuesta nunca devuelve la contraseña.
- El rol no puede establecerse desde el registro público.
- El rol asignado por defecto es `user`.

---

## Iniciar sesión

```http
POST /api/sessions/login
```

La ruta utiliza la estrategia Passport `login`.

La estrategia valida las credenciales y, después de una autenticación exitosa, el controller genera el JWT y configura la cookie HTTP Only `currentUser`.

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

Además de la respuesta, el servidor crea la cookie `currentUser`.

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

La ruta utiliza la estrategia Passport `current`.

Passport obtiene el JWT desde la cookie `currentUser`, verifica su firma y expiración y deja el payload disponible en `req.user`.

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

La respuesta no incluye la contraseña.

### Response 401

Si no existe una cookie válida o el JWT fue manipulado o expiró:

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

El logout no requiere una estrategia de Passport.

El controller elimina directamente la cookie `currentUser`.

### Response 200

```json
{
  "status": "success",
  "message": "Sesión cerrada"
}
```

Después del logout, intentar acceder nuevamente a:

```http
GET /api/sessions/current
```

devuelve estado `401`:

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

---

# Flujo de autenticación

```text
REGISTER
   ↓
passport.authenticate("register")
   ↓
Estrategia register
   ↓
Validación + normalización
   ↓
bcrypt
   ↓
MongoDB
   ↓
UserDTO
   ↓
req.user
   ↓
Controller
   ↓
Response 201


LOGIN
   ↓
passport.authenticate("login")
   ↓
Estrategia login
   ↓
Validación de credenciales con bcrypt
   ↓
req.user
   ↓
Controller
   ↓
SessionsService construye el payload
   ↓
Generación del JWT
   ↓
Cookie currentUser HTTP Only
   ↓
Response 200


CURRENT
   ↓
passport.authenticate("current")
   ↓
Passport JWT
   ↓
Obtiene currentUser
   ↓
Verifica JWT
   ↓
req.user
   ↓
Controller
   ↓
Response 200


LOGOUT
   ↓
Controller
   ↓
Elimina cookie currentUser
   ↓
Response 200
```

---

# Seguridad

El proyecto implementa las siguientes medidas:

- Contraseñas hasheadas mediante bcrypt.
- Las contraseñas nunca se incluyen en las respuestas de la API.
- `UserDTO` evita exponer información sensible del usuario.
- JWT firmado utilizando `JWT_SECRET` desde variables de entorno.
- Expiración del JWT configurable mediante `JWT_EXPIRES_IN`.
- JWT almacenado en una cookie HTTP Only.
- Cookie configurada con `sameSite: "lax"`.
- Cookie `secure` habilitada únicamente en producción.
- Mensaje genérico ante credenciales incorrectas.
- Passport centraliza las estrategias de autenticación.
- La estrategia `current` verifica el JWT antes de permitir el acceso.
- El payload del JWT contiene únicamente `id`, `email` y `role`.

## Seguridad del repositorio

El repositorio no incluye archivos ni directorios que contengan información privada o dependencias instaladas localmente.

El archivo `.gitignore` excluye:

```gitignore
node_modules/
.env
```

Por lo tanto:

- `node_modules/` no se incluye en el repositorio. Las dependencias se instalan mediante `npm install`.
- `.env` no se incluye en el repositorio y mantiene las credenciales y secretos fuera del código fuente.
- `.env.example` sí se incluye y documenta las variables necesarias utilizando valores de ejemplo.
- Las credenciales reales no deben escribirse directamente en el código fuente.
- `JWT_SECRET` y `MONGO_URL` se obtienen mediante variables de entorno.

---

# Preparación para estrategias externas

La configuración de Passport se encuentra centralizada en:

```text
src/config/passport.config.js
```

`app.js` únicamente inicializa Passport:

```javascript
initializePassport();
app.use(passport.initialize());
```

Esta separación permite agregar futuras estrategias de autenticación, por ejemplo:

- Google
- GitHub
- Otros proveedores OAuth

sin incorporar la lógica de las estrategias directamente en `app.js`.

---

# Estado del proyecto

Actualmente el proyecto cuenta con:

- Servidor Express funcionando.
- Variables de entorno mediante Dotenv.
- Conexión a MongoDB Atlas utilizando Mongoose.
- Arquitectura organizada por capas.
- Middleware global para manejo de errores.
- Modelos `Event` y `User`.
- CRUD básico de eventos.
- Registro seguro de usuarios.
- DTO para exposición segura de datos del usuario.
- Hash y comparación de contraseñas mediante bcrypt.
- Passport.js inicializado en Express.
- Estrategia Passport `register`.
- Estrategia Passport `login`.
- Estrategia Passport `current`.
- Middleware reutilizable para ejecutar estrategias de Passport.
- Login de usuarios.
- Generación de JWT desde el controller.
- Autenticación mediante cookie HTTP Only.
- Ruta protegida `/api/sessions/current`.
- Logout y eliminación de la cookie de autenticación.
- Configuración preparada para incorporar providers externos en futuras etapas.
- `.env` y `node_modules/` excluidos del repositorio mediante `.gitignore`.
- `.env.example` disponible como referencia de configuración.

## Autor

**Lionel Cancellieri**

Proyecto desarrollado para el curso **Programación Backend II: Diseño y Arquitectura Backend**.