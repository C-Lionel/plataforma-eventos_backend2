# Plataforma de Eventos Musicales

API REST desarrollada para la gestión de eventos musicales y recitales.

## Temática

Plataforma de gestión de eventos musicales y recitales donde los usuarios pueden registrarse, iniciar sesión, consultar eventos disponibles e inscribirse. Los organizadores pueden crear y administrar sus propios eventos y consultar sus inscripciones, mientras que los administradores cuentan con permisos globales sobre los recursos protegidos.

## Objetivos

El proyecto permite:

- Registro seguro de usuarios.
- Inicio y cierre de sesión.
- Autenticación centralizada mediante Passport.js.
- Autenticación mediante JWT.
- Gestión de sesiones mediante cookies HTTP Only.
- Autorización basada en roles.
- Diferenciación entre usuarios `user`, `organizer` y `admin`.
- Gestión completa de eventos musicales.
- Asociación automática entre eventos y organizadores.
- Control de propiedad de eventos.
- Gestión del ciclo de vida de los eventos.
- Cancelación lógica de eventos.
- Filtrado de eventos.
- Paginación de resultados.
- Ordenamiento de eventos.
- Validaciones de negocio centralizadas en la capa de servicios.
- Rutas administrativas protegidas.
- Inscripción de usuarios a eventos publicados.
- Generación de tickets con código único de reserva.
- Control de cupos según la cantidad de entradas activas.
- Prevención de inscripciones duplicadas por usuario y evento.
- Cancelación lógica de tickets.
- Liberación automática de cupos al cancelar una inscripción.
- Consulta de tickets propios.
- Consulta de inscripciones de un evento por su organizador o un administrador.
- Envío de emails de confirmación mediante Nodemailer.
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
- Nodemailer
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
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=tu_correo@gmail.com
MAIL_PASS=tu_contraseña_de_aplicacion
MAIL_FROM=Plataforma de Eventos <tu_correo@gmail.com>
```

| Variable | Descripción |
|---|---|
| `PORT` | Puerto donde se ejecuta el servidor |
| `NODE_ENV` | Entorno de ejecución de la aplicación |
| `MONGO_URL` | URI de conexión a MongoDB Atlas |
| `JWT_SECRET` | Clave utilizada para firmar los JWT |
| `JWT_EXPIRES_IN` | Tiempo de expiración del JWT |
| `MAIL_HOST` | Host SMTP utilizado para el envío de emails |
| `MAIL_PORT` | Puerto utilizado por el servidor SMTP |
| `MAIL_USER` | Cuenta utilizada para autenticar el envío de emails |
| `MAIL_PASS` | Contraseña de aplicación utilizada para autenticar el servicio SMTP |
| `MAIL_FROM` | Remitente que aparece en los emails enviados |

El archivo `.env` contiene información sensible y no debe subirse al repositorio. `.env.example` se incluye únicamente como referencia y no contiene credenciales privadas.

Para Gmail se recomienda utilizar una contraseña de aplicación y nunca la contraseña principal de la cuenta.

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

Los tickets almacenan referencias mediante `ObjectId` hacia usuarios y eventos, evitando duplicar o embeber información de esas entidades.

## Estructura del proyecto

```text
.
├── app.js
├── server.js
├── src/
│   ├── config/
│   │   ├── database.config.js
│   │   ├── mail.config.js
│   │   └── passport.config.js
│   ├── controllers/
│   │   ├── events.controller.js
│   │   ├── sessions.controller.js
│   │   └── tickets.controller.js
│   ├── dao/
│   │   ├── events.dao.js
│   │   ├── tickets.dao.js
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
│   │   ├── Ticket.js
│   │   └── User.js
│   ├── repositories/
│   │   ├── events.repository.js
│   │   ├── tickets.repository.js
│   │   └── users.repository.js
│   ├── routes/
│   │   ├── events.router.js
│   │   ├── sessions.router.js
│   │   └── tickets.router.js
│   ├── services/
│   │   ├── events.service.js
│   │   ├── mail.service.js
│   │   ├── sessions.service.js
│   │   └── tickets.service.js
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
- **Services:** contienen la lógica de negocio y validaciones.
- **Repositories:** intermedian entre la lógica de negocio y la persistencia.
- **DAO:** realizan el acceso a MongoDB mediante Mongoose.
- **Models:** definen las entidades persistidas.
- **DTO:** controlan qué información se expone y evitan devolver datos sensibles.
- **Middlewares:** gestionan autenticación, autorización, propiedad de recursos y errores.
- **Config:** contiene la conexión a MongoDB, las estrategias de Passport y la configuración del servicio de correo.
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

La lógica de negocio se encuentra centralizada en los services. Los controllers no realizan operaciones directas sobre MongoDB.

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

- `user`: usuario estándar. Puede consultar eventos, inscribirse y administrar sus propios tickets.
- `organizer`: puede crear eventos y administrar únicamente sus propios eventos.
- `admin`: cuenta con permisos administrativos y puede administrar cualquier evento y cancelar cualquier ticket.

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
| Consultar eventos | ✅ | ✅ | ✅ |
| Consultar evento por ID | ✅ | ✅ | ✅ |
| Crear eventos | ❌ | ✅ | ✅ |
| Modificar eventos propios | ❌ | ✅ | ✅ |
| Modificar eventos ajenos | ❌ | ❌ | ✅ |
| Cambiar estado de eventos propios | ❌ | ✅ | ✅ |
| Cambiar estado de eventos ajenos | ❌ | ❌ | ✅ |
| Ver todos los usuarios | ❌ | ❌ | ✅ |
| Crear una inscripción | ✅ | ✅ | ✅ |
| Consultar tickets propios | ✅ | ✅ | ✅ |
| Cancelar ticket propio | ✅ | ✅ | ✅ |
| Cancelar ticket ajeno | ❌ | ❌ | ✅ |
| Consultar tickets de evento propio | ❌ | ✅ | ✅ |
| Consultar tickets de evento ajeno | ❌ | ❌ | ✅ |

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

Este middleware protege la modificación, el cambio de estado y la consulta de tickets de un evento:

- Busca el evento solicitado.
- Permite continuar a un `admin`.
- Permite continuar a un `organizer` únicamente cuando `event.organizer` coincide con `req.user.id`.
- Devuelve `403` cuando un organizer intenta administrar un evento ajeno.
- Devuelve `404` cuando el evento no existe.

Al crear un evento, el campo `organizer` se obtiene de `req.user.id`; no se confía en un valor enviado por el cliente.

Al actualizar un evento, los campos `organizer` y `status` se excluyen de los datos modificables.

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
- Un usuario intenta cancelar el ticket de otra persona.
- Un `user` intenta consultar las inscripciones de un evento.
- Un `organizer` intenta consultar las inscripciones de un evento ajeno.

# Entidad Event

Los eventos se almacenan mediante el modelo `Event`.

## Campos

| Campo | Tipo | Requerido | Descripción |
|---|---|:---:|---|
| `title` | String | Sí | Título del evento |
| `description` | String | Sí | Descripción del evento |
| `category` | String | Sí | Categoría del evento |
| `date` | Date | Sí | Fecha y hora del evento |
| `location` | String | Sí | Ubicación |
| `capacity` | Number | Sí | Capacidad máxima |
| `price` | Number | Sí | Precio del evento |
| `status` | String | Sí | Estado actual |
| `organizer` | ObjectId | Sí | Referencia al usuario organizador |

`organizer` referencia al modelo `User`.

## Estados del evento

Los estados permitidos son:

```text
draft
published
cancelled
finished
```

El estado inicial de un nuevo evento es `draft`.

Los estados representan:

- `draft`: evento creado pero todavía no publicado.
- `published`: evento publicado y disponible.
- `cancelled`: evento cancelado.
- `finished`: evento finalizado.

# Reglas de negocio de eventos

Las reglas de negocio se encuentran centralizadas en `events.service.js`.

## Creación

Para crear un evento:

- `title` es obligatorio.
- `description` es obligatorio.
- `category` es obligatoria.
- `location` es obligatoria.
- `date` es obligatoria.
- La fecha debe tener un formato válido.
- La fecha debe ser futura.
- `capacity` debe ser mayor a `0`.
- `price` debe ser mayor o igual a `0`.
- El organizador se obtiene automáticamente desde `req.user.id`.
- No se permite confiar en un `organizer` enviado por el cliente.

## Modificación

Al modificar un evento:

- Solo puede hacerlo su `organizer` o un `admin`.
- Un evento con estado `cancelled` no puede modificarse.
- Si se modifica `capacity`, debe continuar siendo mayor a `0`.
- Si se modifica `price`, no puede ser negativo.
- `organizer` no puede modificarse mediante `PUT`.
- `status` no puede modificarse mediante `PUT`.

## Cambio de estado

Los cambios de estado se realizan mediante:

```http
PATCH /api/events/:id/status
```

Reglas:

- Solo se aceptan `draft`, `published`, `cancelled` y `finished`.
- Solo el propietario del evento o un `admin` puede cambiar su estado.
- Un evento cancelado no puede cambiar hacia otro estado.
- Si un evento ya está cancelado y se solicita nuevamente `cancelled`, la operación se considera cumplida y se devuelve el evento sin generar un nuevo error.
- Un evento finalizado no puede publicarse nuevamente.
- Un evento cuya fecha ya pasó no puede publicarse.
- La cancelación es lógica.
- No se elimina físicamente el evento de MongoDB.

# Entidad Ticket

Las inscripciones a eventos se representan mediante el modelo `Ticket`.

Cada ticket relaciona un usuario con un evento mediante referencias `ObjectId`.

## Campos

| Campo | Tipo | Requerido | Descripción |
|---|---|:---:|---|
| `user` | ObjectId | Sí | Referencia al usuario que realizó la inscripción |
| `event` | ObjectId | Sí | Referencia al evento |
| `status` | String | Sí | Estado actual del ticket |
| `quantity` | Number | Sí | Cantidad de lugares reservados |
| `reservationCode` | String | Sí | Código único de reserva |
| `createdAt` | Date | Automático | Fecha de creación |
| `updatedAt` | Date | Automático | Fecha de última actualización |
| `cancelledAt` | Date | No | Fecha de cancelación |

Los campos `user` y `event` son referencias. No se embeben documentos completos dentro del ticket.

`createdAt` y `updatedAt` son generados automáticamente mediante `timestamps` de Mongoose.

## Estados del ticket

Los estados permitidos son:

```text
confirmed
pending
cancelled
```

- `confirmed`: inscripción confirmada.
- `pending`: inscripción pendiente.
- `cancelled`: inscripción cancelada.

Las inscripciones creadas correctamente se almacenan con estado `confirmed`.

La cancelación es lógica: el documento permanece en MongoDB y se actualizan:

```text
status = cancelled
cancelledAt = fecha de cancelación
```

# Inscripciones y control de cupos

La lógica de inscripciones se encuentra centralizada en:

```text
src/services/tickets.service.js
```

## Flujo de inscripción

```text
POST /api/events/:eid/tickets
          ↓
         auth
          ↓
  Usuario autenticado
          ↓
 tickets.controller
          ↓
  tickets.service
          ↓
 ¿Existe el evento?
          ↓
 ¿Está published?
          ↓
 ¿La fecha es futura?
          ↓
 ¿quantity es válida?
          ↓
 ¿Ya existe ticket activo?
          ↓
 Calcular cupos ocupados
          ↓
 ¿Hay cupo suficiente?
          ↓
 Generar reservationCode
          ↓
 Crear Ticket confirmed
          ↓
 Enviar email de confirmación
          ↓
      Response 201
```

## Reglas para crear una inscripción

Para realizar una inscripción:

- El usuario debe estar autenticado.
- El evento debe existir.
- El evento debe encontrarse en estado `published`.
- No se permiten inscripciones a eventos cancelados, finalizados o no publicados.
- La fecha del evento debe ser futura.
- `quantity` debe ser un número entero mayor a `0`.
- Debe existir capacidad suficiente.
- El usuario no puede tener otra inscripción activa para el mismo evento.
- Cada ticket recibe un `reservationCode` único.
- El ticket se crea con estado `confirmed`.

## Regla de capacidad

El campo:

```text
Event.capacity
```

representa la **capacidad máxima total del evento**.

La capacidad disponible no se almacena como un segundo valor modificable dentro del evento.

Para conocer los lugares ocupados, el sistema suma `quantity` de los tickets activos:

```text
occupiedCapacity = suma de quantity de tickets no cancelados
```

Luego:

```text
availableCapacity = event.capacity - occupiedCapacity
```

Antes de crear una inscripción se verifica:

```text
availableCapacity >= quantity solicitada
```

Los tickets con estado `cancelled` no participan del cálculo.

De esta forma, al cancelar una inscripción sus lugares quedan nuevamente disponibles sin modificar manualmente `Event.capacity`.

## Prevención de inscripciones duplicadas

Antes de crear un ticket, el sistema verifica si el usuario ya posee un ticket activo para ese evento.

Si existe uno, la operación es rechazada.

Un ticket cancelado no se considera una inscripción activa, por lo que el usuario puede volver a inscribirse posteriormente si existen cupos.

# Cancelación de tickets

La cancelación se realiza mediante:

```http
PATCH /api/tickets/:tid/cancel
```

Reglas:

- El ticket debe existir.
- El propietario del ticket puede cancelarlo.
- Un `admin` puede cancelar cualquier ticket.
- Un usuario común no puede cancelar el ticket de otra persona.
- No se elimina físicamente el ticket.
- El estado pasa a `cancelled`.
- Se registra `cancelledAt`.
- Un ticket ya cancelado no puede volver a cancelarse.
- Al quedar cancelado deja de participar del cálculo de capacidad.

Ejemplo conceptual:

```text
Evento capacity = 80
Tickets activos = 80 lugares
Disponible = 0

        ↓ cancelar ticket de 1 lugar

Tickets activos = 79 lugares
Disponible = 1
```

No es necesario modificar `Event.capacity`.

# Notificaciones por email

El proyecto utiliza **Nodemailer** para enviar una confirmación cuando una inscripción se crea correctamente.

La configuración se encuentra en:

```text
src/config/mail.config.js
```

y la lógica de envío en:

```text
src/services/mail.service.js
```

Las credenciales SMTP se obtienen exclusivamente desde variables de entorno.

El email de confirmación contiene:

- Nombre del usuario.
- Título del evento.
- Fecha.
- Lugar.
- Cantidad reservada.
- Código de reserva.

El código de reserva se genera mediante `randomUUID()`.

Si ocurre un problema durante el envío del email luego de haber creado correctamente el ticket, el error de correo se registra en el servidor sin eliminar la inscripción ya persistida.

# Endpoints disponibles

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/health` | Público | Verifica el estado del servidor |
| GET | `/api/events` | Público | Lista eventos con filtros, paginación y ordenamiento |
| GET | `/api/events/:id` | Público | Obtiene un evento por ID |
| POST | `/api/events` | `organizer`, `admin` | Crea un evento |
| PUT | `/api/events/:id` | `organizer` propietario, `admin` | Actualiza un evento |
| PATCH | `/api/events/:id/status` | `organizer` propietario, `admin` | Cambia el estado de un evento |
| POST | `/api/events/:eid/tickets` | Autenticado | Crea una inscripción para un evento |
| GET | `/api/events/:eid/tickets` | `organizer` propietario, `admin` | Lista las inscripciones de un evento |
| GET | `/api/tickets/my-tickets` | Autenticado | Lista los tickets del usuario autenticado |
| PATCH | `/api/tickets/:tid/cancel` | Propietario del ticket, `admin` | Cancela una inscripción |
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

El listado admite filtros, paginación y ordenamiento.

### Filtros disponibles

| Parámetro | Descripción |
|---|---|
| `status` | Filtra por estado |
| `category` | Filtra por categoría |
| `location` | Filtra por ubicación |
| `dateFrom` | Fecha mínima |
| `dateTo` | Fecha máxima |
| `page` | Página solicitada |
| `limit` | Cantidad de resultados por página |
| `sort` | Campo utilizado para ordenar |

Valores por defecto:

```text
page = 1
limit = 10
sort = date
```

`page` y `limit` deben ser números enteros mayores o iguales a `1`.

`dateFrom` y `dateTo` deben representar fechas válidas.

### Ejemplo con filtros

```http
GET /api/events?status=published&category=workshop&page=1&limit=5&sort=date
```

También pueden filtrarse eventos por rango de fechas:

```http
GET /api/events?dateFrom=2026-10-01&dateTo=2026-12-31
```

### Response 200

```json
{
  "status": "success",
  "data": [
    {
      "_id": "6690...",
      "title": "Workshop de Express",
      "description": "Workshop práctico",
      "category": "workshop",
      "date": "2026-12-28T18:00:00.000Z",
      "location": "Rosario",
      "capacity": 80,
      "price": 12000,
      "status": "published",
      "organizer": "665f2a..."
    }
  ],
  "page": 1,
  "limit": 5,
  "total": 1,
  "totalPages": 1
}
```

## Obtener un evento por ID

```http
GET /api/events/:id
```

Ruta pública.

Si el evento no existe:

```json
{
  "status": "error",
  "message": "Evento no encontrado"
}
```

con estado `404 Not Found`.

## Crear un evento

```http
POST /api/events
```

Requiere autenticación y rol `organizer` o `admin`.

### Request

```json
{
  "title": "Workshop de Node.js",
  "description": "Workshop práctico de backend",
  "category": "workshop",
  "date": "2026-12-20T18:00:00.000Z",
  "location": "Rosario",
  "capacity": 100,
  "price": 15000
}
```

El cliente no necesita enviar `organizer`. El backend utiliza `req.user.id`.

El estado inicial se establece como `draft`.

## Actualizar un evento

```http
PUT /api/events/:id
```

Requiere autenticación.

- `organizer`: solo puede modificar eventos propios.
- `admin`: puede modificar cualquier evento.
- `user`: no tiene permiso.

Los campos `organizer` y `status` se excluyen de los datos modificables mediante este endpoint.

Si el evento está cancelado, no puede modificarse.

## Cambiar estado de un evento

```http
PATCH /api/events/:id/status
```

Requiere autenticación y que el usuario sea:

- el `organizer` propietario del evento, o
- un `admin`.

### Request

```json
{
  "status": "published"
}
```

Para cancelar:

```json
{
  "status": "cancelled"
}
```

La cancelación no elimina el documento.

Si el evento ya se encuentra cancelado y se solicita nuevamente `cancelled`, la operación no genera un nuevo error y devuelve el evento en su estado actual.

# Tickets e inscripciones

## Crear una inscripción

```http
POST /api/events/:eid/tickets
```

Requiere autenticación.

### Request

```json
{
  "quantity": 1
}
```

### Response 201

```json
{
  "status": "success",
  "message": "Inscripción realizada correctamente",
  "payload": {
    "_id": "66aa...",
    "user": "665f...",
    "event": "6690...",
    "status": "confirmed",
    "quantity": 1,
    "reservationCode": "codigo-unico-de-reserva",
    "cancelledAt": null,
    "createdAt": "2026-09-14T18:00:00.000Z",
    "updatedAt": "2026-09-14T18:00:00.000Z"
  }
}
```

Si no existe sesión válida:

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

con estado `401 Unauthorized`.

Si el evento no existe:

```json
{
  "status": "error",
  "message": "Evento no encontrado"
}
```

con estado `404 Not Found`.

Si el evento no se encuentra disponible para inscripciones:

```json
{
  "status": "error",
  "message": "El evento no está disponible para inscripciones"
}
```

Si no existen cupos suficientes:

```json
{
  "status": "error",
  "message": "No hay cupos suficientes para realizar la inscripción"
}
```

Si el usuario ya posee una inscripción activa:

```json
{
  "status": "error",
  "message": "El usuario ya tiene una inscripción activa para este evento"
}
```

Si la cantidad es inválida:

```json
{
  "status": "error",
  "message": "La cantidad debe ser un número entero mayor a cero"
}
```

## Consultar mis tickets

```http
GET /api/tickets/my-tickets
```

Requiere autenticación.

La consulta utiliza el usuario obtenido desde `req.user.id`, por lo que un cliente no puede indicar mediante el body o la URL qué usuario desea consultar.

Los eventos asociados se obtienen mediante `populate`, exponiendo únicamente:

- `title`
- `date`
- `location`

De esta forma, la respuesta contiene información útil del evento sin incluir datos sensibles de otros usuarios.

## Consultar tickets de un evento

```http
GET /api/events/:eid/tickets
```

Requiere autenticación.

Puede acceder:

- El `organizer` propietario del evento.
- Un `admin`.

No puede acceder:

- Un usuario con rol `user`.
- Un organizer que no sea propietario del evento.

## Cancelar una inscripción

```http
PATCH /api/tickets/:tid/cancel
```

Requiere autenticación.

Puede cancelar:

- El propietario del ticket.
- Un `admin`.

### Response 200

```json
{
  "status": "success",
  "message": "Inscripción cancelada correctamente",
  "payload": {
    "_id": "66aa...",
    "status": "cancelled",
    "cancelledAt": "2026-09-14T18:30:00.000Z"
  }
}
```

Si un usuario intenta cancelar el ticket de otra persona:

```json
{
  "status": "error",
  "message": "No tenés permisos para cancelar este ticket"
}
```

con estado `403 Forbidden`.

Si el ticket ya está cancelado:

```json
{
  "status": "error",
  "message": "El ticket ya se encuentra cancelado"
}
```

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

con estado `401 Unauthorized`.

## Usuario autenticado

```http
GET /api/sessions/current
```

La ruta utiliza `auth.middleware.js`.

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

con estado `401 Unauthorized`.

## Listar todos los usuarios

```http
GET /api/sessions/users
```

Ruta administrativa exclusiva para `admin`.

Un `user` o `organizer` autenticado recibe `403 Forbidden`.

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


MODIFICAR EVENTO / CAMBIAR ESTADO / VER INSCRIPCIONES
   ↓
auth
   ↓
authorize("organizer", "admin")
   ↓
authorizeEventOwnerOrAdmin
   ↓
¿Admin o propietario?
   ├── NO → 403
   └── SÍ
          ↓
       Controller
          ↓
        Service
          ↓
   Reglas de negocio
          ↓
      Repository
          ↓
         DAO
          ↓
       MongoDB
```

# Casos de prueba

Antes de la entrega se verificaron escenarios de autenticación, autorización, eventos, inscripciones y control de cupos.

## Autenticación y autorización

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

## Lógica de negocio de eventos

| Caso | Resultado esperado |
|---|---|
| Crear evento con fecha pasada | `400 Bad Request` |
| Crear evento con `capacity: 0` | `400 Bad Request` |
| `organizer` modifica su propio evento | `200 OK` |
| `organizer` modifica evento de otro organizer | `403 Forbidden` |
| `admin` modifica evento de otro organizer | `200 OK` |
| Solicitar nuevamente `cancelled` sobre un evento cancelado | `200 OK` |
| Intentar cambiar un evento cancelado hacia otro estado | `400 Bad Request` |
| Listar con `status`, `category`, `page` y `limit` | `200 OK` |
| Consultar un evento inexistente | `404 Not Found` |
| Utilizar `page=0` | `400 Bad Request` |
| Utilizar `dateFrom` inválido | `400 Bad Request` |
| Crear un evento con fecha inválida | `400 Bad Request` |

## Tickets, inscripciones y cupos

| Caso | Resultado esperado |
|---|---|
| Inscripción válida a evento publicado | `201 Created` + email de confirmación |
| Crear inscripción sin sesión | `401 Unauthorized` |
| Inscribirse a evento inexistente | `404 Not Found` |
| Inscribirse a evento cancelado o no disponible | `400 Bad Request` |
| Solicitar más lugares que los disponibles | `400 Bad Request` |
| Usuario con inscripción activa intenta inscribirse nuevamente | `400 Bad Request` |
| Cancelar ticket propio | `200 OK` |
| Crear una nueva inscripción utilizando el cupo liberado | `201 Created` |
| Usuario intenta cancelar ticket ajeno | `403 Forbidden` |
| `user` intenta listar tickets de un evento | `403 Forbidden` |
| `organizer` intenta listar tickets de un evento ajeno | `403 Forbidden` |
| `quantity: 0` | `400 Bad Request` |
| Consultar tickets propios | `200 OK` |
| `admin` consulta tickets de un evento | `200 OK` |

También se verificó que:

- El ticket cancelado permanece almacenado.
- `cancelledAt` se completa al cancelar.
- Los tickets cancelados no ocupan cupo.
- Los tickets propios incluyen los datos básicos del evento mediante `populate`.
- El email de confirmación llega correctamente a una dirección válida configurada para las pruebas.
- El código de reserva se incluye en el email.

# Manejo de errores

La aplicación utiliza un middleware global:

```text
src/middlewares/error.middleware.js
```

Los services pueden generar errores de negocio asignando un código HTTP:

```javascript
const error = new Error("Evento no encontrado");
error.statusCode = 404;
throw error;
```

El controller captura el error y lo deriva mediante:

```javascript
next(error);
```

El middleware global genera una respuesta HTTP consistente.

Ejemplo:

```json
{
  "status": "error",
  "message": "Evento no encontrado"
}
```

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
- Control de propiedad de tickets al cancelar.
- El propietario de un evento no puede alterarse mediante el body.
- El estado del evento no puede modificarse mediante el endpoint general de actualización.
- El organizer se obtiene del usuario autenticado al crear eventos.
- El usuario del ticket se obtiene del usuario autenticado.
- Payload JWT limitado a `id`, `email` y `role`.
- Validaciones de negocio centralizadas en services.
- Cancelación lógica de eventos.
- Cancelación lógica de tickets.
- Credenciales SMTP obtenidas mediante variables de entorno.
- Las credenciales de correo no se encuentran hardcodeadas.

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
- `JWT_SECRET`, `MONGO_URL` y las credenciales SMTP se obtienen desde variables de entorno.
- `MAIL_PASS` nunca debe contenerse con su valor real en `.env.example`.

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
- Modelos `Event`, `User` y `Ticket`.
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
- Control de propiedad al cambiar estados.
- Control de propiedad al consultar inscripciones de eventos.
- `organizer` limitado a sus propios eventos.
- `admin` habilitado para administrar cualquier evento.
- Entidad `Event` con categoría, precio, estado y organizer.
- Estados de evento `draft`, `published`, `cancelled` y `finished`.
- Cancelación lógica de eventos.
- Protección de eventos cancelados.
- Cancelación repetida de un evento tratada de forma idempotente.
- Filtros por estado, categoría, ubicación y fechas.
- Paginación mediante `page` y `limit`.
- Ordenamiento mediante `sort`.
- Respuestas paginadas con `data`, `page`, `limit`, `total` y `totalPages`.
- Validación de fechas.
- Validación de capacidad y precio.
- Entidad `Ticket` asociada mediante referencias a `User` y `Event`.
- Estados de ticket `confirmed`, `pending` y `cancelled`.
- Inscripción de usuarios a eventos.
- Generación de códigos únicos de reserva.
- Prevención de inscripciones activas duplicadas.
- Control de cupos.
- Cálculo de capacidad ocupada a partir de tickets activos.
- Exclusión de tickets cancelados del cálculo de capacidad.
- Liberación automática de cupos al cancelar.
- Cancelación lógica de tickets.
- Registro de `cancelledAt`.
- Consulta de tickets propios.
- Consulta de inscripciones por evento.
- Autorización de organizer propietario o admin para consultar inscripciones.
- Autorización de propietario o admin para cancelar tickets.
- Integración con Nodemailer.
- Envío de email de confirmación.
- Configuración SMTP mediante variables de entorno.
- Diferenciación entre errores `400`, `401`, `403` y `404`.
- Logout y eliminación de cookie.
- Configuración preparada para proveedores externos.
- `.env` y `node_modules/` excluidos mediante `.gitignore`.
- `.env.example` disponible como referencia sin credenciales privadas.

## Autor

**Lionel Cancellieri**

Proyecto desarrollado para el curso **Programación Backend II: Diseño y Arquitectura Backend**.