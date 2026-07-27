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
- MongoDB
- Mongoose
- Dotenv
- JavaScript (ES Modules)

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/TU-USUARIO/plataforma-eventos_backend.git
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

```env
PORT=8080
NODE_ENV=development
MONGO_URL=mongodb://localhost:27017/plataforma_eventos
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

## Estructura del proyecto

```text
src/
├── config/
├── controllers/
├── dao/
├── middlewares/
├── models/
├── repositories/
├── routes/
├── services/
├── utils/
├── app.js
└── server.js
```

## Arquitectura

El proyecto se encuentra organizado mediante una arquitectura por capas para facilitar el mantenimiento y la escalabilidad.

- **Routes:** definen los endpoints de la API.
- **Controllers:** reciben las peticiones HTTP y generan las respuestas.
- **Services:** contendrán la lógica de negocio en futuras entregas.
- **Repositories:** actuarán como intermediarios entre los servicios y el acceso a datos.
- **DAO:** contendrá la lógica de acceso a la base de datos.
- **Models:** definen los modelos de MongoDB mediante Mongoose.
- **Middlewares:** funciones intermedias utilizadas por Express.
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

### Eventos

```http
GET /api/events
```

Respuesta:

```json
{
  "status": "success",
  "payload": []
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

Esta ruta se encuentra preparada para futuras implementaciones de autenticación mediante JWT y Passport.

## Estado del proyecto

Esta corresponde a la primera pre-entrega del proyecto de **Backend II**, donde se implementó la estructura base de la API REST, preparada para incorporar en futuras entregas funcionalidades como:

- Registro e inicio de sesión.
- Autenticación con JWT.
- Passport.
- Roles y autorización.
- Gestión completa de eventos.
- Inscripciones.
- Control de capacidad.
- Notificaciones.

## Autor

Lionel Cancellieri

Proyecto desarrollado para el curso **Programación Backend II: Diseño y Arquitectura Backend**.