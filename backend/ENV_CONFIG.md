# 🔧 Configuración de Variables de Entorno

## 📁 Archivos Creados

Se han creado los siguientes archivos de configuración:

```
backend/
├── .env                        # Variables principales
├── .env.example               # Plantilla para desarrollo
├── .env.production.example    # Plantilla para producción
├── api-gateway/.env          # Config específica del gateway
├── auth-service/.env         # Config del servicio de auth
├── songs-service/.env        # Config del servicio de canciones
├── chat-service/.env         # Config del servicio de chat
└── .gitignore               # Excluye archivos sensibles
```

## 🎯 Variables Principales

### **Base de Datos:**
```bash
DATABASE_HOST=localhost          # Host de PostgreSQL
DATABASE_PORT=5432              # Puerto de PostgreSQL
DATABASE_USER=admin             # Usuario de la DB
DATABASE_PASSWORD=admin123      # Contraseña de la DB
DATABASE_NAME=soundsrights      # Nombre de la base de datos
```

### **Autenticación:**
```bash
JWT_SECRET=your-secret-key-here-change-in-production
```

### **Puertos de Servicios:**
```bash
PORT=3000                       # API Gateway
AUTH_SERVICE_PORT=3001         # Auth Service
SONGS_SERVICE_PORT=3002        # Songs Service
CHAT_SERVICE_PORT=3003         # Chat Service
```

### **URLs de Microservicios:**
```bash
AUTH_SERVICE_HOST=localhost
SONGS_SERVICE_HOST=localhost
CHAT_SERVICE_HOST=localhost
```

## 🚀 Para Desarrollo Local

Los archivos `.env` ya están configurados para desarrollo local. Solo ejecuta:

```powershell
.\start.ps1
```

## 🔒 Para Producción

1. **Copiar plantilla:**
```bash
cp .env.production.example .env.production
```

2. **Modificar valores:**
- Cambiar `JWT_SECRET` por algo seguro
- Configurar host real de base de datos
- Ajustar URLs de servicios para tu infraestructura
- Configurar CORS para tu dominio

3. **Variables críticas para cambiar en producción:**
```bash
JWT_SECRET=tu-secret-muy-largo-y-seguro-minimo-32-caracteres
DATABASE_HOST=tu-servidor-postgres-real
DATABASE_PASSWORD=password-super-seguro
CORS_ORIGIN=https://tu-dominio-real.com
NODE_ENV=production
```

## 🔐 Seguridad

- ✅ Los archivos `.env` están en `.gitignore`
- ✅ NO subas archivos `.env` con datos reales a Git
- ✅ Usa secrets de Docker/Kubernetes en producción
- ✅ Cambia el `JWT_SECRET` en producción

## 🧪 Para Probar

```powershell
# Verificar que las variables se cargan correctamente
.\test-endpoints.ps1
```

## 🐛 Solución de Problemas

Si algo no funciona:

1. **Verificar que los archivos `.env` existen:**
```powershell
ls .env*
```

2. **Verificar que las variables se cargan:**
```powershell
docker-compose config
```

3. **Ver logs de servicios:**
```powershell
docker-compose logs auth-service
docker-compose logs songs-service
docker-compose logs chat-service
```
