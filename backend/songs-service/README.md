# Songs Service - Microservicio de Canciones

## ✅ Estado Actual
El microservicio de canciones está **completamente funcional** y ejecutándose en Docker.

## 🏗️ Arquitectura Implementada

### Backend - Songs Service (Puerto 3002)
- **Framework**: NestJS
- **Base de Datos**: MongoDB (puerto 27018)
- **Autenticación**: JWT
- **Containerización**: Docker + Docker Compose

### 📁 Estructura del Proyecto
```
songs-service/
├── src/
│   ├── main.ts                    # Punto de entrada
│   ├── app.module.ts              # Módulo principal
│   ├── auth/                      # Módulo de autenticación
│   │   ├── auth.module.ts
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   └── strategies/
│   │       └── jwt.strategy.ts
│   └── songs/                     # Módulo de canciones
│       ├── songs.module.ts
│       ├── songs.controller.ts
│       ├── songs.service.ts
│       ├── schemas/
│       │   └── song.schema.ts
│       └── dto/
│           ├── create-song.dto.ts
│           └── update-song.dto.ts
├── docker-compose.yml
├── Dockerfile
├── .env
└── package.json
```

## 🚀 Endpoints Disponibles

### Canciones (Songs)
- `GET /songs` - Obtener todas las canciones disponibles
- `GET /songs/search?q=query` - Buscar canciones
- `GET /songs/genre/:genre` - Obtener canciones por género
- `GET /songs/owner/:ownerId` - Obtener canciones de un propietario (requiere auth)
- `GET /songs/:id` - Obtener una canción específica
- `POST /songs` - Crear nueva canción (requiere auth)
- `PATCH /songs/:id` - Actualizar canción (requiere auth)
- `DELETE /songs/:id` - Eliminar canción (requiere auth)
- `POST /songs/:id/play` - Incrementar contador de reproducciones

## 📊 Schema de Canciones
```typescript
{
  title: string;           // Título de la canción
  artist: string;          // Artista
  genre: string;           // Género musical
  duration: number;        // Duración en segundos
  price: number;           // Precio en USD
  description?: string;    // Descripción opcional
  albumCover?: string;     // URL de la portada
  audioFile?: string;      // URL del archivo de audio
  isAvailable: boolean;    // Si está disponible para compra
  ownerId: string;         // ID del propietario
  playCount: number;       // Contador de reproducciones
  tags: string[];          // Etiquetas
  releaseDate?: Date;      // Fecha de lanzamiento
}
```

## 🔧 Servicios Docker
- **songs-service**: Aplicación NestJS (Puerto 3002)
- **songs-mongo**: Base de datos MongoDB (Puerto 27018)

## 🔑 Variables de Entorno
```
PORT=3002
MONGODB_URI=mongodb://songs-mongo:27017/songs-db
JWT_SECRET=songrights-secret-key
```

## ⚙️ Comandos de Docker
```bash
# Levantar servicios
docker-compose up -d

# Ver logs
docker-compose logs songs-service

# Parar servicios
docker-compose down

# Rebuild
docker-compose up --build -d
```

## 🌐 CORS
Configurado para permitir conexiones desde:
- http://localhost:3000 (Frontend)
- http://127.0.0.1:3000

## 🔐 Autenticación
- JWT tokens requeridos para operaciones de escritura
- Guard implementado para proteger endpoints sensibles
- Misma clave secreta que el auth-service para compatibilidad

## ✅ Características Implementadas
- ✅ CRUD completo de canciones
- ✅ Búsqueda y filtrado
- ✅ Autenticación JWT
- ✅ Validación de DTOs
- ✅ MongoDB con Mongoose
- ✅ Docker containerizado
- ✅ CORS configurado
- ✅ Logging detallado

## 🔄 Próximos Pasos
1. Conectar frontend con este microservicio
2. Implementar upload de archivos de audio
3. Integrar con sistema de pagos
4. Añadir notificaciones en tiempo real
