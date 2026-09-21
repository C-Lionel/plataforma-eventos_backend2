# Plataforma de Eventos Musicales

API REST desarrollada para la gestión de eventos musicales y recitales.

## Temática

Plataforma de gestión de eventos musicales y recitales donde los usuarios pueden registrarse, iniciar sesión, consultar eventos disponibles e inscribirse.

Los organizadores pueden crear y administrar sus propios eventos y consultar sus inscripciones, mientras que los administradores cuentan con permisos globales sobre los recursos protegidos.

## Objetivos

El proyecto permite:

- Registro seguro de usuarios.
- Inicio y cierre de sesión.
- Autenticación centralizada mediante Passport.js.
- Autenticación mediante JWT.
- Gestión de sesiones mediante cookies HTTP Only.
- Autorización basada en roles.
- Diferenciación entre usuarios `user`, `organizer` y `admin`.
- Gestión completa de eventos.
- Asociación automática entre eventos y organizadores.
- Control de propiedad de eventos.
- Gestión del ciclo de vida de los eventos.
- Cancelación lógica de eventos.
- Filtrado, paginación y ordenamiento de eventos.
- Inscripción de usuarios a eventos publicados.
- Generación de tickets con código único de reserva.
- Control de cupos.
- Prevención de inscripciones activas duplicadas.
- Cancelación lógica de tickets.
- Liberación de cupos al cancelar una inscripción.
- Consulta de tickets propios.
- Consulta de inscripciones de un evento por su organizador o un administrador.
- Envío de emails de confirmación mediante Nodemailer.
- Arquitectura por capas con DAO, Repository, Service, Controller y DTO.
- Manejo centralizado de errores HTTP.

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
- JavaScript con ES Modules

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
| `NODE_ENV` | Entorno de ejecución |
| `MONGO_URL` | URI de conexión a MongoDB Atlas |
| `JWT_SECRET` | Clave utilizada para firmar los JWT |
| `JWT_EXPIRES_IN` | Tiempo de expiración del JWT |
| `MAIL_HOST` | Host SMTP utilizado para enviar emails |
| `MAIL_PORT` | Puerto del servidor SMTP |
| `MAIL_USER` | Cuenta utilizada para autenticar el envío |
| `MAIL_PASS` | Contraseña de aplicación del servicio SMTP |
| `MAIL_FROM` | Remitente mostrado en los emails |

El archivo `.env` contiene información sensible y no debe subirse al repositorio.

`.env.example` se incluye únicamente como referencia y no contiene credenciales privadas.

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

Los tickets almacenan referencias mediante `ObjectId` hacia usuarios y eventos.

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
│   │   ├── event.dto.js
│   │   ├── ticket.dto.js
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

# Arquitectura

El proyecto implementa una arquitectura por capas para separar responsabilidades.

## Routes

Definen los endpoints y aplican los middlewares necesarios.

## Controllers

Coordinan las peticiones y respuestas HTTP.

Sus responsabilidades principales son:

- Obtener datos desde `req.body`.
- Obtener parámetros desde `req.params`.
- Obtener filtros desde `req.query`.
- Obtener información del usuario autenticado desde `req.user`.
- Invocar al service correspondiente.
- Generar la respuesta HTTP.
- Derivar errores al middleware global.

Los controllers no acceden directamente a MongoDB ni importan modelos de Mongoose.

## Services

Contienen las reglas y validaciones de negocio.

Entre otras responsabilidades:

- Validación de datos.
- Reglas de estados de eventos.
- Control de cupos.
- Prevención de inscripciones duplicadas.
- Autenticación de usuarios.
- Hash y comparación de contraseñas.
- Control de propiedad de tickets.
- Envío de emails.

Los services consumen repositories y no acceden directamente a DAOs ni modelos.

## Repositories

Actúan como intermediarios entre los services y los DAOs.

Exponen operaciones relacionadas con las necesidades del dominio, por ejemplo:

- Buscar un usuario por email.
- Obtener eventos.
- Buscar una inscripción activa.
- Calcular capacidad ocupada.
- Actualizar o cancelar recursos.

Los repositories no importan modelos de Mongoose.

## DAO

Los DAO encapsulan el acceso a datos.

Son la capa encargada de utilizar directamente los modelos de Mongoose para realizar operaciones como:

- `find`
- `findOne`
- `findById`
- `create`
- `update`
- `aggregate`

El acceso directo a los modelos `User`, `Event` y `Ticket` queda encapsulado en esta capa.

## Models

Definen la estructura de los documentos persistidos en MongoDB mediante Mongoose.

Actualmente existen:

- `User`
- `Event`
- `Ticket`

## DTO

Los DTO controlan la representación de los datos que se devuelve al cliente.

Actualmente existen:

- `UserDTO`
- `EventDTO`
- `TicketDTO`

Su objetivo es evitar devolver directamente documentos de persistencia y controlar qué campos forman parte de la respuesta.

`UserDTO` nunca expone la contraseña.

`TicketDTO` también controla los documentos relacionados. Si `user` o `event` llegan mediante `populate`, se exponen únicamente los campos definidos por el DTO.

## Flujo general

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
Mongoose Model
  ↓
MongoDB
```

La lógica de negocio se encuentra centralizada en los services y el acceso a Mongoose queda encapsulado en los DAO.

# Autenticación con Passport.js

La autenticación se encuentra centralizada mediante **Passport.js**.

Las estrategias están definidas en:

```text
src/config/passport.config.js
```

Passport se inicializa desde `app.js`.

Las estrategias disponibles son:

| Estrategia | Responsabilidad |
|---|---|
| `register` | Recibe las credenciales y delega el registro en `sessions.service.js` |
| `login` | Recibe las credenciales y delega la autenticación en `sessions.service.js` |
| `current` | Obtiene y verifica el JWT almacenado en la cookie |

Passport se ocupa del mecanismo de autenticación mientras que las reglas de negocio del registro y login se encuentran en `SessionsService`.

## Estrategia register

Passport recibe:

- `first_name`
- `last_name`
- `email`
- `password`

y delega la operación en:

```text
sessionsService.register()
```

El service:

- Valida los campos obligatorios.
- Normaliza el email mediante `trim()` y `toLowerCase()`.
- Valida el formato del email.
- Valida la longitud mínima de la contraseña.
- Comprueba que el email no esté registrado.
- Hashea la contraseña mediante bcrypt.
- Asigna el rol `user`.
- Persiste el usuario mediante el repository.
- Devuelve un `UserDTO`.

Aunque el cliente envíe un campo `role`, el registro público no permite registrarse como `admin` u `organizer`.

## Estrategia login

Passport recibe email y contraseña y delega la autenticación en:

```text
sessionsService.login()
```

El service:

- Normaliza el email.
- Busca al usuario mediante `usersRepository`.
- Compara la contraseña mediante bcrypt.
- Devuelve `401` ante credenciales incorrectas.
- Utiliza el mensaje genérico `Credenciales inválidas`.
- Devuelve un `UserDTO` si la autenticación es correcta.

Passport no genera el JWT.

Luego de autenticar correctamente, el controller construye el token y configura la cookie `currentUser`.

## Estrategia current

La estrategia `current` utiliza Passport JWT.

Sus responsabilidades son:

- Extraer el JWT desde la cookie `currentUser`.
- Verificar la firma mediante `JWT_SECRET`.
- Verificar la expiración.
- Recuperar el payload.
- Dejar el payload disponible en `req.user`.

Las rutas privadas utilizan `auth.middleware.js`, que ejecuta esta estrategia.

Si no existe una sesión válida se devuelve:

```text
401 Unauthorized
```

# JWT y cookie de autenticación

Después de un login exitoso se genera un JWT con información mínima:

```json
{
  "id": "id_del_usuario",
  "email": "usuario@mail.com",
  "role": "user"
}
```

El JWT se almacena en la cookie `currentUser` con:

- `httpOnly: true`
- `sameSite: "lax"`
- `maxAge: 3600000`
- `secure: true` únicamente en producción

El JWT nunca contiene la contraseña.

# Roles y autorización

La aplicación utiliza tres roles.

### user

Puede:

- Consultar eventos.
- Inscribirse a eventos.
- Consultar sus propios tickets.
- Cancelar sus propios tickets.

### organizer

Puede además:

- Crear eventos.
- Modificar sus propios eventos.
- Cambiar el estado de sus propios eventos.
- Consultar las inscripciones de sus propios eventos.

### admin

Cuenta con permisos administrativos globales.

Puede:

- Administrar cualquier evento.
- Consultar todos los usuarios.
- Consultar tickets de cualquier evento.
- Cancelar cualquier ticket.

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
| Crear inscripción | ✅ | ✅ | ✅ |
| Consultar tickets propios | ✅ | ✅ | ✅ |
| Cancelar ticket propio | ✅ | ✅ | ✅ |
| Cancelar ticket ajeno | ❌ | ❌ | ✅ |
| Consultar tickets de evento propio | ❌ | ✅ | ✅ |
| Consultar tickets de evento ajeno | ❌ | ❌ | ✅ |

# Autenticación y autorización

## Middleware de autenticación

Archivo:

```text
src/middlewares/auth.middleware.js
```

Responsabilidades:

1. Ejecutar la estrategia Passport `current`.
2. Validar el JWT almacenado en la cookie.
3. Dejar el usuario autenticado en `req.user`.
4. Devolver `401 Unauthorized` si no existe una sesión válida.

## Middleware de autorización por roles

Archivo:

```text
src/middlewares/authorize.middleware.js
```

Es reutilizable y recibe los roles permitidos.

Ejemplo:

```javascript
authorize("organizer", "admin")
```

Si el usuario está autenticado pero no posee un rol permitido devuelve:

```json
{
  "status": "error",
  "message": "No tenés permisos para realizar esta acción"
}
```

con estado:

```text
403 Forbidden
```

## Autorización por propiedad de eventos

Archivo:

```text
src/middlewares/authorizeEventOwnerOrAdmin.middleware.js
```

Este middleware:

- Busca el evento solicitado mediante `eventsRepository`.
- Permite continuar a un `admin`.
- Permite continuar al `organizer` propietario.
- Devuelve `403` cuando un organizer intenta administrar un evento ajeno.
- Devuelve `404` cuando el evento no existe.

Al crear un evento, el campo `organizer` se obtiene desde `req.user.id`.

El cliente no puede decidir arbitrariamente quién será el propietario.

# Diferencia entre 401 y 403

## 401 Unauthorized

Significa que no existe una sesión válida.

Ejemplos:

- No existe la cookie `currentUser`.
- El JWT es inválido.
- El JWT expiró.

Respuesta:

```json
{
  "status": "error",
  "message": "No autenticado"
}
```

## 403 Forbidden

Significa que el usuario está autenticado pero no posee permisos suficientes.

Ejemplos:

- Un `user` intenta crear un evento.
- Un `organizer` intenta modificar el evento de otro organizer.
- Un usuario intenta cancelar el ticket de otra persona.
- Un `user` intenta consultar las inscripciones de un evento.

# Entidad Event

Los eventos se almacenan mediante el modelo `Event`.

## Campos

| Campo | Tipo | Requerido | Descripción |
|---|---|:---:|---|
| `title` | String | Sí | Título del evento |
| `description` | String | Sí | Descripción |
| `category` | String | Sí | Categoría |
| `date` | Date | Sí | Fecha y hora |
| `location` | String | Sí | Ubicación |
| `capacity` | Number | Sí | Capacidad máxima |
| `price` | Number | Sí | Precio |
| `status` | String | Sí | Estado |
| `organizer` | ObjectId | Sí | Usuario organizador |

`organizer` referencia al modelo `User`.

## Estados del evento

```text
draft
published
cancelled
finished
```

- `draft`: evento creado pero todavía no publicado.
- `published`: evento publicado y disponible.
- `cancelled`: evento cancelado.
- `finished`: evento finalizado.

El estado inicial es `draft`.

# Reglas de negocio de eventos

Las reglas se encuentran centralizadas en:

```text
src/services/events.service.js
```

## Creación

Para crear un evento:

- `title` es obligatorio.
- `description` es obligatorio.
- `category` es obligatoria.
- `location` es obligatoria.
- `date` es obligatoria.
- La fecha debe tener formato válido.
- La fecha debe ser futura.
- `capacity` debe ser mayor a `0`.
- `price` debe ser mayor o igual a `0`.
- El organizador se obtiene desde el usuario autenticado.

## Modificación

- Solo puede modificarlo su organizer o un admin.
- Un evento cancelado no puede modificarse.
- `capacity` debe permanecer mayor a `0`.
- `price` no puede ser negativo.
- `organizer` no puede modificarse mediante el endpoint general.
- `status` se modifica mediante su endpoint específico.

## Cambio de estado

Endpoint:

```http
PATCH /api/events/:id/status
```

Estados aceptados:

- `draft`
- `published`
- `cancelled`
- `finished`

Reglas:

- Solo el propietario o un admin puede cambiar el estado.
- Un evento cancelado no puede cambiar hacia otro estado.
- Solicitar nuevamente `cancelled` sobre un evento ya cancelado devuelve el evento sin generar un nuevo error.
- Un evento finalizado no puede publicarse nuevamente.
- Un evento cuya fecha ya pasó no puede publicarse.
- La cancelación es lógica.

# Entidad Ticket

Las inscripciones se representan mediante el modelo `Ticket`.

## Campos

| Campo | Tipo | Requerido | Descripción |
|---|---|:---:|---|
| `user` | ObjectId | Sí | Usuario que realizó la inscripción |
| `event` | ObjectId | Sí | Evento |
| `status` | String | Sí | Estado |
| `quantity` | Number | Sí | Cantidad de lugares |
| `reservationCode` | String | Sí | Código único de reserva |
| `cancelledAt` | Date | No | Fecha de cancelación |
| `createdAt` | Date | Automático | Fecha de creación |
| `updatedAt` | Date | Automático | Última actualización |

## Estados del ticket

```text
confirmed
pending
cancelled
```

Las inscripciones creadas correctamente utilizan `confirmed`.

La cancelación es lógica:

```text
status = cancelled
cancelledAt = fecha de cancelación
```

El documento no se elimina físicamente de MongoDB.

# Inscripciones y control de cupos

La lógica se encuentra centralizada en:

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
    TicketsController
            ↓
     TicketsService
            ↓
     ¿Existe evento?
            ↓
    ¿Está published?
            ↓
   ¿La fecha es futura?
            ↓
   ¿quantity es válida?
            ↓
 ¿Existe ticket activo?
            ↓
 Calcular cupos ocupados
            ↓
 ¿Hay cupo suficiente?
            ↓
 Generar reservationCode
            ↓
 Crear Ticket confirmed
            ↓
 Aplicar TicketDTO
            ↓
 Enviar email
            ↓
       Response 201
```

## Reglas de inscripción

- El usuario debe estar autenticado.
- El evento debe existir.
- Debe encontrarse en estado `published`.
- La fecha debe ser futura.
- `quantity` debe ser un entero mayor a `0`.
- Debe existir capacidad suficiente.
- El usuario no puede tener otra inscripción activa para el mismo evento.
- Cada ticket recibe un `reservationCode` único.
- El ticket se crea como `confirmed`.

## Control de capacidad

`Event.capacity` representa la capacidad máxima.

Los lugares ocupados se calculan sumando `quantity` de los tickets que no estén cancelados:

```text
occupiedCapacity = suma de quantity de tickets activos
```

Luego:

```text
availableCapacity = event.capacity - occupiedCapacity
```

Antes de crear la inscripción:

```text
availableCapacity >= quantity solicitada
```

Los tickets cancelados no participan del cálculo.

Al cancelar una inscripción sus lugares vuelven a quedar disponibles sin modificar manualmente `Event.capacity`.

## Prevención de duplicados

Antes de crear un ticket se verifica si el usuario posee otra inscripción activa para ese evento.

Si existe, se devuelve:

```text
409 Conflict
```

Un ticket cancelado no cuenta como inscripción activa, por lo que el usuario puede volver a inscribirse posteriormente.

# Cancelación de tickets

Endpoint:

```http
PATCH /api/tickets/:tid/cancel
```

Reglas:

- El ticket debe existir.
- El propietario puede cancelarlo.
- Un admin puede cancelar cualquier ticket.
- Un usuario no puede cancelar el ticket de otra persona.
- El ticket no se elimina.
- Su estado cambia a `cancelled`.
- Se registra `cancelledAt`.
- Los lugares dejan de contar como ocupados.

# Notificaciones por email

El proyecto utiliza **Nodemailer** para enviar una confirmación cuando una inscripción se crea correctamente.

Configuración:

```text
src/config/mail.config.js
```

Servicio:

```text
src/services/mail.service.js
```

Las credenciales SMTP se obtienen mediante variables de entorno.

El email contiene:

- Nombre del usuario.
- Título del evento.
- Fecha.
- Lugar.
- Cantidad reservada.
- Código de reserva.

El código de reserva se genera mediante `randomUUID()`.

Si el ticket se crea correctamente pero el envío del correo falla, la inscripción ya persistida no se elimina.

# Endpoints disponibles

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/health` | Público | Verifica el estado del servidor |
| GET | `/api/events` | Público | Lista eventos |
| GET | `/api/events/:id` | Público | Obtiene un evento |
| POST | `/api/events` | `organizer`, `admin` | Crea un evento |
| PUT | `/api/events/:id` | Organizer propietario, admin | Actualiza un evento |
| PATCH | `/api/events/:id/status` | Organizer propietario, admin | Cambia el estado |
| POST | `/api/events/:eid/tickets` | Autenticado | Crea una inscripción |
| GET | `/api/events/:eid/tickets` | Organizer propietario, admin | Lista inscripciones del evento |
| GET | `/api/tickets/my-tickets` | Autenticado | Lista tickets propios |
| PATCH | `/api/tickets/:tid/cancel` | Propietario, admin | Cancela una inscripción |
| POST | `/api/sessions/register` | Público | Registra un usuario |
| POST | `/api/sessions/login` | Público | Inicia sesión |
| GET | `/api/sessions/current` | Autenticado | Devuelve el usuario autenticado |
| GET | `/api/sessions/users` | Admin | Lista usuarios |
| POST | `/api/sessions/logout` | Público | Cierra la sesión |

# Eventos

## Obtener eventos

```http
GET /api/events
```

Admite:

| Parámetro | Descripción |
|---|---|
| `status` | Estado |
| `category` | Categoría |
| `location` | Ubicación |
| `dateFrom` | Fecha mínima |
| `dateTo` | Fecha máxima |
| `page` | Página |
| `limit` | Resultados por página |
| `sort` | Ordenamiento |

Valores por defecto:

```text
page = 1
limit = 10
sort = date
```

Ejemplo:

```http
GET /api/events?status=published&category=workshop&page=1&limit=5&sort=date
```

La respuesta utiliza `EventDTO`.

Ejemplo:

```json
{
  "status": "success",
  "data": [
    {
      "id": "6690...",
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

## Crear evento

```http
POST /api/events
```

Requiere `organizer` o `admin`.

Ejemplo:

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

El cliente no necesita enviar `organizer`.

El backend lo obtiene desde `req.user.id`.

# Tickets

## Crear inscripción

```http
POST /api/events/:eid/tickets
```

Body:

```json
{
  "quantity": 1
}
```

Ejemplo de respuesta:

```json
{
  "status": "success",
  "message": "Inscripción realizada correctamente",
  "payload": {
    "id": "66aa...",
    "user": "665f...",
    "event": "6690...",
    "status": "confirmed",
    "quantity": 1,
    "reservationCode": "codigo-unico-de-reserva",
    "cancelledAt": null,
    "createdAt": "2026-09-21T18:00:00.000Z",
    "updatedAt": "2026-09-21T18:00:00.000Z"
  }
}
```

Si existe una inscripción activa:

```json
{
  "status": "error",
  "message": "El usuario ya tiene una inscripción activa para este evento"
}
```

con:

```text
409 Conflict
```

## Consultar mis tickets

```http
GET /api/tickets/my-tickets
```

Requiere autenticación.

La identidad del usuario se obtiene desde `req.user.id`.

Los eventos asociados se obtienen mediante `populate`.

`TicketDTO` filtra el evento relacionado y expone únicamente:

- `id`
- `title`
- `date`
- `location`

Ejemplo:

```json
{
  "status": "success",
  "payload": [
    {
      "id": "66aa...",
      "user": "665f...",
      "event": {
        "id": "6690...",
        "title": "Evento de prueba",
        "date": "2026-11-15T20:00:00.000Z",
        "location": "Buenos Aires"
      },
      "status": "confirmed",
      "quantity": 1,
      "reservationCode": "codigo-de-reserva"
    }
  ]
}
```

## Cancelar inscripción

```http
PATCH /api/tickets/:tid/cancel
```

Puede cancelar:

- El propietario del ticket.
- Un administrador.

La respuesta también pasa por `TicketDTO`.

# Sesiones

## Registrar usuario

```http
POST /api/sessions/register
```

Request:

```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "Ana@Mail.com",
  "password": "Secreta123"
}
```

Response:

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

La contraseña no se incluye porque la respuesta utiliza `UserDTO`.

## Iniciar sesión

```http
POST /api/sessions/login
```

Request:

```json
{
  "email": "ana@mail.com",
  "password": "Secreta123"
}
```

Response:

```json
{
  "status": "success",
  "message": "Login correcto"
}
```

## Usuario autenticado

```http
GET /api/sessions/current
```

La ruta requiere autenticación.

El ID obtenido desde el JWT se utiliza para recuperar al usuario mediante `SessionsService`.

La respuesta utiliza `UserDTO`.

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

La respuesta nunca incluye `password`.

## Listar usuarios

```http
GET /api/sessions/users
```

Disponible únicamente para `admin`.

La respuesta utiliza `UserDTO`.

## Cerrar sesión

```http
POST /api/sessions/logout
```

Elimina la cookie `currentUser`.

# Manejo de errores

La aplicación utiliza un middleware global:

```text
src/middlewares/error.middleware.js
```

Los services pueden generar errores asignando `statusCode`:

```javascript
const error = new Error("Evento no encontrado");
error.statusCode = 404;
throw error;
```

El controller deriva el error mediante:

```javascript
next(error);
```

El middleware global genera una respuesta consistente.

## Códigos utilizados

| Código | Significado dentro de la API |
|---|---|
| `400 Bad Request` | Datos inválidos |
| `401 Unauthorized` | No existe autenticación válida |
| `403 Forbidden` | Usuario autenticado sin permisos |
| `404 Not Found` | Recurso inexistente |
| `409 Conflict` | Conflicto con el estado actual del recurso |
| `500 Internal Server Error` | Error interno no controlado |

El middleware también contempla errores propios de Mongoose/MongoDB.

### CastError

Un identificador MongoDB mal formado devuelve:

```text
400 Bad Request
```

Ejemplo:

```http
GET /api/events/abc
```

Respuesta:

```json
{
  "status": "error",
  "message": "ID inválido"
}
```

### ValidationError

Los errores de validación de Mongoose se traducen a:

```text
400 Bad Request
```

### Clave duplicada

Los errores MongoDB con código `11000` se traducen a:

```text
409 Conflict
```

# Seguridad

El proyecto implementa:

- Contraseñas hasheadas mediante bcrypt.
- Contraseñas excluidas de las respuestas.
- `UserDTO`, `EventDTO` y `TicketDTO`.
- JWT firmado mediante `JWT_SECRET`.
- Expiración configurable.
- JWT almacenado en cookie HTTP Only.
- `sameSite: "lax"`.
- Cookie `secure` en producción.
- Mensajes genéricos ante credenciales incorrectas.
- Registro público restringido al rol `user`.
- Separación entre autenticación y autorización.
- Control de acceso por roles.
- Control de propiedad de eventos.
- Control de propiedad de tickets.
- Organizer obtenido desde el usuario autenticado.
- Usuario del ticket obtenido desde el usuario autenticado.
- JWT limitado a `id`, `email` y `role`.
- Variables sensibles mediante `.env`.
- Credenciales SMTP no hardcodeadas.

# Seguridad del repositorio

`.gitignore` excluye:

```gitignore
node_modules/
.env
```

Por lo tanto:

- `node_modules/` no debe subirse al repositorio.
- `.env` no debe subirse.
- `.env.example` documenta las variables necesarias sin incluir credenciales reales.
- `JWT_SECRET`, `MONGO_URL` y las credenciales SMTP se obtienen desde variables de entorno.

# Casos de prueba

Antes de la entrega se verificaron los principales escenarios de P8.

## Flujo completo

```text
Registro
   ↓
Login
   ↓
Crear evento
   ↓
Publicar evento
   ↓
Crear inscripción
   ↓
Consultar mis tickets
   ↓
Cancelar inscripción
```

El flujo se completó correctamente.

## Autenticación y DTO

| Caso | Resultado |
|---|---|
| Registrar usuario | `201 Created` |
| Login válido | `200 OK` |
| `/current` autenticado | `200 OK` |
| `/current` no expone password | Correcto |
| Respuesta de registro no expone password | Correcto |
| Ticket con evento populado pasa por DTO | Correcto |

## Autorización

| Caso | Resultado |
|---|---|
| Endpoint protegido sin sesión | `401 Unauthorized` |
| `user` intenta crear evento | `403 Forbidden` |
| Organizer administra evento propio | Permitido |
| Organizer intenta administrar evento ajeno | `403 Forbidden` |
| Admin administra cualquier evento | Permitido |
| Usuario intenta cancelar ticket ajeno | `403 Forbidden` |

## Eventos

| Caso | Resultado |
|---|---|
| Crear evento válido | `201 Created` |
| Publicar evento válido | `200 OK` |
| Fecha inválida | `400 Bad Request` |
| `capacity: 0` | `400 Bad Request` |
| Evento inexistente | `404 Not Found` |
| ID con formato inválido | `400 Bad Request` |

## Tickets

| Caso | Resultado |
|---|---|
| Inscripción válida | `201 Created` |
| Inscripción sin sesión | `401 Unauthorized` |
| Evento inexistente | `404 Not Found` |
| Evento no disponible | `400 Bad Request` |
| Cupos insuficientes | `400 Bad Request` |
| Inscripción activa duplicada | `409 Conflict` |
| Cancelar ticket propio | `200 OK` |
| Consultar tickets propios | `200 OK` |
| `quantity: 0` | `400 Bad Request` |

También se verificó que:

- El ticket cancelado permanece almacenado.
- `cancelledAt` se completa.
- Los tickets cancelados dejan de ocupar cupo.
- Los tickets propios pueden incluir datos básicos del evento mediante `populate`.
- `TicketDTO` controla la representación de las relaciones.
- El email de confirmación se envía correctamente.
- El código de reserva se incluye en el email.

# Verificación de arquitectura P8

La refactorización de P8 formaliza las capas DAO, Repository y DTO sin modificar las rutas externas de la API.

Se verificó que:

- `UserModel` es utilizado para persistencia desde `users.dao.js`.
- `EventModel` es utilizado para persistencia desde `events.dao.js`.
- `TicketModel` es utilizado para persistencia desde `tickets.dao.js`.
- Los repositories consumen DAOs.
- Los services consumen repositories.
- Los controllers consumen services.
- Los controllers no importan modelos de Mongoose.
- Los services no importan modelos ni DAOs.
- Los repositories no importan modelos.
- Las reglas de negocio se encuentran en services.
- Las respuestas de usuarios pasan por `UserDTO`.
- Las respuestas de eventos pasan por `EventDTO`.
- Las respuestas de tickets pasan por `TicketDTO`.
- Los documentos relacionados populados son filtrados por el DTO correspondiente.
- Las contraseñas no se incluyen en las respuestas.
- Los errores esperables utilizan códigos HTTP controlados.

Flujo de persistencia:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
DAO
    ↓
Model
    ↓
MongoDB
```

# Estado del proyecto

Actualmente el proyecto cuenta con:

- Servidor Express.
- MongoDB Atlas.
- Mongoose.
- Arquitectura por capas.
- DAO para usuarios, eventos y tickets.
- Repository para usuarios, eventos y tickets.
- Services con reglas de negocio.
- Controllers para coordinación HTTP.
- DTOs para usuarios, eventos y tickets.
- Middleware global de errores.
- Passport.js.
- Passport Local.
- Passport JWT.
- JWT.
- Cookie HTTP Only.
- Roles `user`, `organizer` y `admin`.
- Autorización por roles.
- Autorización por propiedad.
- Gestión de eventos.
- Estados de eventos.
- Filtros.
- Paginación.
- Ordenamiento.
- Inscripciones.
- Control de cupos.
- Prevención de inscripciones duplicadas.
- Cancelación lógica de tickets.
- Liberación de cupos.
- Nodemailer.
- Emails de confirmación.
- Manejo de errores `400`, `401`, `403`, `404`, `409` y `500`.
- `.env.example` sin credenciales privadas.
- `.env` y `node_modules/` excluidos mediante `.gitignore`.

## Autor

**Lionel Cancellieri**

Proyecto desarrollado para el curso **Programación Backend II: Diseño y Arquitectura Backend**.