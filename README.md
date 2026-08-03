# Plataforma de Eventos Musicales

API REST desarrollada para la gestión de eventos musicales y recitales.

## Temática

Plataforma de gestión de eventos musicales y recitales donde los usuarios pueden registrarse, consultar eventos disponibles e inscribirse, mientras que los administradores podrán crear eventos, gestionar cupos y controlar las inscripciones.

## Objetivos

El proyecto permitirá:

- Registro seguro de usuarios.
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
MONGO_URL=mongodb+srv://usuario:contraseña@cluster.mongodb.net/plataforma_eventos
JWT_SECRET=tu_clave_secreta
```

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

## Estructura del proyecto

```text
.
├── app.js
├── server.js
├── src/
│   ├── config/
│   ├── controllers/
│   ├── dao/
│   ├── middlewares/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   └── utils/
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
- **Middlewares:** manejan funcionalidades comunes, como el tratamiento global de errores.
- **Config:** configuración general de la aplicación.
- **Utils:** contiene funciones reutilizables, como el hash de contraseñas mediante bcrypt.

---

# Endpoints disponibles

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

## Obtener eventos

```http
GET /api/events
```

Obtiene la lista de eventos almacenados en MongoDB.

---

## Obtener un evento por ID

```http
GET /api/events/:id
```

Obtiene un evento específico mediante su identificador.

---

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

---

## Actualizar un evento

```http
PUT /api/events/:id
```

Permite modificar la información de un evento existente.

---

## Eliminar un evento

```http
DELETE /api/events/:id
```

Permite eliminar un evento de la base de datos.

---

## Registrar usuario

```http
POST /api/sessions/register
```

Permite registrar un nuevo usuario de forma segura.

### Body esperado

```json
{
  "first_name": "Ana",
  "last_name": "Pérez",
  "email": "Ana@Mail.com ",
  "password": "Secreta123"
}
```

### Respuesta exitosa

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

### Validaciones implementadas

- Todos los campos son obligatorios.
- El email debe tener un formato válido.
- El email se normaliza utilizando `trim()` y `toLowerCase()`.
- No se permiten usuarios con emails duplicados.
- La contraseña debe tener una longitud mínima de 8 caracteres.
- La contraseña se almacena hasheada mediante **bcrypt**.
- La respuesta nunca devuelve la contraseña.

---

# Estado del proyecto

Actualmente el proyecto cuenta con:

- Configuración del servidor Express.
- Variables de entorno mediante Dotenv.
- Conexión a MongoDB Atlas utilizando Mongoose.
- Arquitectura por capas (Route → Controller → Service → Repository → DAO).
- Middleware global para el manejo de errores.
- Modelo `Event`.
- Modelo `User`.
- CRUD básico de eventos.
- Registro seguro de usuarios.
- Hash de contraseñas mediante bcrypt.
- Validación de datos y prevención de usuarios duplicados.

## Autor

**Lionel Cancellieri**

Proyecto desarrollado para la materia **Programación Backend II: Diseño y Arquitectura Backend**.