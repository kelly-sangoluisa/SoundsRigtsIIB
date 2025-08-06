# 🎵 Auth Service - SongRights

Microservicio de autenticación para la plataforma SongRights, inspirado en la experiencia de Spotify.

## 🚀 Características

- Registro de usuarios
- Login con JWT
- Validación de credenciales
- Base de datos MongoDB
- Dockerizado para microservicios

## 🛠️ Tecnologías

- **NestJS** - Framework backend
- **MongoDB** - Base de datos
- **JWT** - Autenticación
- **Passport** - Estrategias de autenticación
- **Docker** - Contenedorización

## 📦 Instalación y Ejecución

### Con Docker (Recomendado)

```bash
# Levantar MongoDB y el servicio de autenticación
docker-compose up --build

# En modo detached (segundo plano)
docker-compose up --build -d

# Ver logs
docker-compose logs -f auth-service

# Parar servicios
docker-compose down

# Parar servicios y eliminar volúmenes
docker-compose down -v
```

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Levantar solo MongoDB con Docker
docker-compose up mongo -d

# Ejecutar en modo desarrollo
npm run start:dev
```

## 🔧 Variables de Entorno

```bash
PORT=3001
MONGODB_URI=mongodb://admin:songrights123@localhost:27017/songrights_auth?authSource=admin
JWT_SECRET=spotify_secret_key_songrights_jwt_token_2025
FRONTEND_URL=http://localhost:3000
```

## 📡 API Endpoints

### POST /auth/register
Registrar un nuevo usuario
```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "firstName": "Juan",
  "lastName": "Pérez"
}
```

**Respuesta:**
```json
{
  "access_token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez"
  }
}
```

### POST /auth/login
Iniciar sesión
```json
{
  "email": "usuario@ejemplo.com",
  "password": "password123"
}
```

**Respuesta:**
```json
{
  "access_token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "usuario@ejemplo.com",
    "firstName": "Juan",
    "lastName": "Pérez"
  }
}
```

## 🐳 Docker Services

### MongoDB
- **Puerto**: 27017
- **Usuario**: admin
- **Contraseña**: songrights123
- **Base de datos**: songrights_auth

### Auth Service
- **Puerto**: 3001
- **URL**: http://localhost:3001

## 📝 Testing

```bash
# Registrar usuario
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🎨 Paleta de Colores (Spotify-inspired)

- **Primary**: #1DB954 (Spotify Green)
- **Secondary**: #191414 (Spotify Black)
- **Accent**: #1ed760 (Bright Green)
- **Background**: #121212 (Dark Background)
