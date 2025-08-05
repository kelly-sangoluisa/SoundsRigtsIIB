# Music Marketplace Backend

Backend para la plataforma de venta y compra de canciones construido con NestJS.

## 🚀 Características

- **Autenticación JWT** - Sistema seguro de autenticación
- **Microservicios** - Arquitectura modular (Auth, Songs, Licenses, Chat)
- **TypeORM** - ORM para PostgreSQL
- **API Gateway** - Punto único de entrada
- **Validación** - Validación automática de datos
- **Filtros de excepción** - Manejo centralizado de errores

## 📋 Prerrequisitos

- Node.js 18+
- PostgreSQL 13+
- npm o yarn

## ⚙️ Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. **Configurar base de datos**
```bash
# Crear base de datos PostgreSQL
createdb sounds_rights_db

# Ejecutar migraciones (cuando estén disponibles)
npm run migration:run
```

## 🏃‍♂️ Ejecutar la aplicación

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## 📦 Scripts disponibles

```bash
npm run build         # Compilar TypeScript
npm run start         # Iniciar aplicación
npm run start:dev     # Desarrollo con hot reload
npm run start:debug   # Desarrollo con debug
npm run start:prod    # Producción
npm run lint          # Linter
npm run test          # Tests unitarios
npm run test:e2e      # Tests end-to-end
npm run test:cov      # Coverage de tests
```

## 🗂️ Estructura del proyecto

```
src/
├── auth/           # Módulo de autenticación
├── users/          # Módulo de usuarios
├── songs/          # Módulo de canciones
├── licenses/       # Módulo de licencias
├── chat/           # Módulo de chat
├── gateway/        # API Gateway
├── common/         # Utilidades compartidas
├── config/         # Configuraciones
├── app.module.ts   # Módulo principal
└── main.ts         # Punto de entrada
```

## 🔌 API Endpoints

### Autenticación
- `POST /auth/login` - Iniciar sesión
- `POST /auth/register` - Registrar usuario
- `GET /auth/me` - Obtener perfil

### Canciones
- `GET /songs/mine` - Mis canciones
- `GET /songs/available` - Canciones disponibles
- `POST /songs` - Crear canción
- `PUT /songs/:id` - Actualizar canción
- `DELETE /songs/:id` - Eliminar canción

### Licencias
- `POST /licenses` - Comprar licencia
- `GET /licenses/mine` - Mis compras
- `GET /licenses/sold` - Mis ventas

### Chat
- `GET /chats` - Mis chats
- `POST /chats` - Crear chat
- `GET /chats/:id/messages` - Mensajes
- `POST /chats/:id/messages` - Enviar mensaje

## 🔐 Autenticación

Todas las rutas protegidas requieren un token JWT en el header:
```
Authorization: Bearer <token>
```

## 🗄️ Base de datos

El proyecto usa PostgreSQL con TypeORM. Las entidades principales son:
- `User` - Usuarios del sistema
- `Song` - Canciones
- `License` - Licencias de compra/venta
- `Chat` - Conversaciones
- `Message` - Mensajes

## 🐳 Docker (Próximamente)

```bash
# Ejecutar con Docker
docker-compose up -d
```

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Tests con watch
npm run test:watch

# Coverage
npm run test:cov

# Tests end-to-end
npm run test:e2e
```

## 📝 Próximas características

- [ ] Migraciones de base de datos
- [ ] Docker Compose
- [ ] WebSockets para chat en tiempo real
- [ ] Sistema de notificaciones
- [ ] Métricas y logging
- [ ] Rate limiting
- [ ] Documentación con Swagger

## 🤝 Contribuir

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
