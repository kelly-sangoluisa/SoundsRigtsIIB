# 🎵 SoundsRights Backend - Guía de Endpoints

## 🚀 URLs de Documentación Swagger

Una vez que levantes los servicios, podrás acceder a la documentación interactiva aquí:

| Servicio | URL de Swagger | Puerto |
|----------|----------------|--------|
| **API Gateway** | http://localhost:3100/api | 3100 |
| **Auth Service** | http://localhost:3001/api | 3001 |
| **Songs Service** | http://localhost:3002/api | 3002 |
| **Chat Service** | http://localhost:3003/api | 3003 |

## 📍 Endpoints Principales (via API Gateway)

### 🔐 Autenticación
```
POST /auth/register    # Registrar usuario
POST /auth/login       # Iniciar sesión  
GET  /auth/profile     # Obtener perfil (requiere JWT)
GET  /auth/validate    # Validar token (requiere JWT)
```

### 🎵 Canciones
```
GET  /songs/available           # Ver canciones disponibles
GET  /songs/mine               # Mis canciones (requiere JWT)
POST /songs                    # Crear canción (requiere JWT)
GET  /songs/:id                # Ver canción específica
PUT  /songs/:id                # Actualizar canción (requiere JWT)
DELETE /songs/:id              # Eliminar canción (requiere JWT)
POST /songs/:id/purchase       # Comprar canción (requiere JWT)
```

### 📜 Licencias
```
GET /songs/licenses/purchased  # Licencias compradas (requiere JWT)
GET /songs/licenses/sold       # Licencias vendidas (requiere JWT)
```

### 💬 Chat
```
GET  /chat                     # Mis chats (requiere JWT)
POST /chat                     # Crear chat (requiere JWT)
GET  /chat/:id                 # Ver chat específico (requiere JWT)
GET  /chat/:id/messages        # Ver mensajes (requiere JWT)
POST /chat/:id/messages        # Enviar mensaje (requiere JWT)
```

## 🧪 Cómo Probar

### Opción 1: Script Automático
```powershell
.\test-endpoints.ps1
```

### Opción 2: Manual con PowerShell

1. **Registrar Usuario:**
```powershell
$body = @{
    username = "miusuario"
    email = "mi@email.com"
    password = "mipassword"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/auth/register" -Method POST -Body $body -ContentType "application/json"
```

2. **Hacer Login:**
```powershell
$loginBody = @{
    email = "mi@email.com"
    password = "mipassword"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $response.access_token
```

3. **Usar API con Token:**
```powershell
$headers = @{ Authorization = "Bearer $token" }

# Ver mi perfil
Invoke-RestMethod -Uri "http://localhost:3000/auth/profile" -Headers $headers

# Crear canción
$songBody = @{
    title = "Mi Canción"
    genre = "rock"
    price = 9.99
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/songs" -Method POST -Body $songBody -ContentType "application/json" -Headers $headers
```

### Opción 3: Swagger UI (Recomendado)

1. Levantar servicios: `.\start.ps1`
2. Ir a: http://localhost:3000/api
3. Usar la interfaz gráfica para probar

## 🏥 Health Checks

Verificar que los servicios estén funcionando:
```powershell
curl http://localhost:3100/health  # API Gateway
curl http://localhost:3001/health  # Auth Service
curl http://localhost:3002/health  # Songs Service  
curl http://localhost:3003/health  # Chat Service
```

## 🔑 Autenticación

Todos los endpoints que requieren JWT necesitan el header:
```
Authorization: Bearer <tu_token_jwt>
```

El token se obtiene del endpoint `/auth/login`.

## 💡 Ejemplos de Datos

### Registro de Usuario:
```json
{
  "username": "artista123",
  "email": "artista@example.com",
  "password": "password123"
}
```

### Crear Canción:
```json
{
  "title": "Mi Nueva Canción",
  "genre": "pop",
  "price": 12.99
}
```

### Crear Chat:
```json
{
  "songId": 1,
  "buyerId": 2,
  "artistId": 1
}
```

### Enviar Mensaje:
```json
{
  "content": "Hola, me interesa tu canción!",
  "senderId": 2
}
```

## 🚨 Solución de Problemas

Si algo no funciona:

1. Verificar que Docker esté corriendo
2. Verificar que los puertos estén libres
3. Reiniciar servicios: `docker-compose down && docker-compose up --build`
4. Ver logs: `docker-compose logs -f`
