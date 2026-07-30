# Plataforma de Eventos Musicales

API REST desarrollada para la gestión de eventos musicales y recitales.

## Temática

Plataforma de gestión de eventos musicales y recitales, donde los usuarios podrán registrarse, consultar eventos disponibles e inscribirse, mientras que los administradores podrán crear eventos, gestionar cupos y controlar las inscripciones.

## Objetivos

El proyecto permitirá:

- Registro e inicio de sesión de usuarios.
- Gestión de eventos musicales.
- Inscripción de usuarios a eventos.
- Administración de eventos.
- Control de cupos disponibles.
- Gestión de roles (Administrador y Usuario).

## Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- Dotenv
- JavaScript (ES Modules)

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/C-Lionel/plataforma-eventos_backend2
```

Ingresar al proyecto:

```bash
cd plataforma-eventos_backend
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
- **Services:** contienen la lógica de negocio.
- **Repositories:** intermedian entre los servicios y la capa de persistencia.
- **DAO:** realizan el acceso a la base de datos mediante Mongoose.
- **Models:** definen los modelos de MongoDB.
- **Middlewares:** manejan funcionalidades comunes como el tratamiento global de errores.
- **Config:** configuración general de la aplicación.
- **Utils:** utilidades reutilizables.

## Endpoints disponibles

### Estado del servidor

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

### Obtener eventos

```http
GET /api/events
```

Obtiene la lista de eventos almacenados en MongoDB.

---

### Obtener un evento por ID

```http
GET /api/events/:id
```

Obtiene un evento específico mediante su identificador.

---

### Crear un evento

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

### Sessions

```http
GET /api/sessions
```

Respuesta:

```json
{
  "status": "success",
  "message": "Ruta de sesiones disponible"
}
```

Esta ruta constituye la base para incorporar autenticación mediante JWT y Passport en futuras entregas.

## Estado del proyecto

En esta etapa se encuentra implementada la estructura arquitectónica inicial del proyecto, incluyendo:

- Configuración del servidor Express.
- Variables de entorno mediante Dotenv.
- Conexión a MongoDB Atlas utilizando Mongoose.
- Arquitectura por capas (Controller → Service → Repository → DAO).
- Middleware global para el manejo de errores.
- Modelos base de User y Event.
- Endpoints iniciales para eventos y sesiones.

Las próximas entregas incorporarán:

- Registro e inicio de sesión.
- Autenticación mediante JWT.
- Passport.
- Roles y autorización.
- Gestión completa de eventos.
- Inscripciones.
- Control de capacidad.
- Notificaciones.

## Autor

Lionel Cancellieri

Proyecto desarrollado para el curso **Programación Backend II: Diseño y Arquitectura Backend**.