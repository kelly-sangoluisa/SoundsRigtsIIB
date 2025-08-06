# SoundsRights Backend - Microservices

Este es el backend de SoundsRights implementado con microservicios usando NestJS, PostgreSQL y Docker.

## Arquitectura

- **API Gateway** (Puerto 3000): Punto de entrada principal con circuit breaker
- **Auth Service** (Puerto 3001): Autenticación y gestión de usuarios
- **Songs Service** (Puerto 3002): Gestión de canciones y licencias
- **Chat Service** (Puerto 3003): Sistema de chat independiente
- **PostgreSQL** (Puerto 5432): Base de datos compartida

## Características

- ✅ Microservicios con NestJS
- ✅ JWT Authentication
- ✅ Circuit Breaker pattern
- ✅ PostgreSQL con TypeORM
- ✅ Docker Compose para desarrollo
- ✅ Repository pattern
- ✅ Estructura modular

## Estructura del Proyecto

```
backend/
├── api-gateway/          # Gateway principal
├── auth-service/         # Servicio de autenticación
├── songs-service/        # Servicio de canciones y licencias
├── chat-service/         # Servicio de chat
├── docker-compose.yml    # Configuración de Docker
├── init.sql             # Script inicial de la BD
└── package.json         # Dependencias compartidas
```

## Instalación y Uso

### Opción 1: PowerShell Script (Recomendado)
```powershell
.\start.ps1
```

### Opción 2: Manual
```powershell
# Instalar dependencias
npm install

# Levantar servicios con Docker
docker-compose up --build
```

## Endpoints Principales

### Auth Service
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario
- `GET /auth/profile/:id` - Obtener perfil

### Songs Service
- `GET /songs/mine` - Mis canciones
- `GET /songs/available` - Canciones disponibles
- `POST /songs` - Crear canción
- `PUT /songs/:id` - Actualizar canción
- `DELETE /songs/:id` - Eliminar canción
- `POST /songs/:id/purchase` - Comprar canción

### Chat Service
- `GET /chat` - Obtener chats
- `POST /chat` - Crear chat
- `GET /chat/:id/messages` - Mensajes del chat
- `POST /chat/:id/messages` - Enviar mensaje

## Circuit Breaker

El API Gateway implementa circuit breaker para manejar fallos de servicios:
- Si un servicio falla 5 veces, se abre el circuito
- Tiempo de recuperación: 30 segundos
- Fallbacks implementados para degradar funcionalidad sin romper la app

## Base de Datos

La base de datos se inicializa automáticamente con:
- Esquema de tablas (users, songs, licenses, chats, messages)
- Usuarios de prueba
- Canciones de ejemplo

### Credenciales por defecto:
- Usuario: admin
- Password: admin123
- Base de datos: soundsrights

## Variables de Entorno

Las variables están configuradas en el `docker-compose.yml`. Para producción, crear archivos `.env` en cada servicio.

## Desarrollo

Para desarrollo local:

```powershell
# Instalar dependencias
npm install

# Levantar solo la base de datos
docker-compose up postgres

# Ejecutar servicios en modo desarrollo
cd auth-service
npm run start:dev

cd ../songs-service  
npm run start:dev

cd ../chat-service
npm run start:dev

cd ../api-gateway
npm run start:dev
```

## Testing

Para probar los endpoints:

1. Registrar usuario: `POST http://localhost:3000/auth/register`
2. Hacer login: `POST http://localhost:3000/auth/login`
3. Usar el token JWT en Authorization header para otros endpoints

## Frontend

Para conectar con el frontend de Next.js, asegúrate de que:
- El frontend esté configurado para usar `http://localhost:3000` como API base
- Las rutas del frontend coincidan con los endpoints del gateway

## Troubleshooting

Si hay problemas:

1. Verificar que Docker esté ejecutándose
2. Verificar que los puertos 3000-3003 y 5432 estén libres
3. Limpiar containers: `docker-compose down -v`
4. Reconstruir: `docker-compose up --build`
