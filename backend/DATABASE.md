# 🗄️ **ARQUITECTURA DE BASES DE DATOS - MICROSERVICIOS**

## 📊 **DISTRIBUCIÓN DE BASES DE DATOS**

### **🔐 Auth Service Database** - `auth_db` (Puerto 5432)
**Responsabilidad:** Gestión de usuarios y autenticación

**Tablas:**
- `users` - Tabla principal de usuarios del sistema
  - `id` (SERIAL PRIMARY KEY)
  - `username` (VARCHAR(100) UNIQUE)
  - `email` (VARCHAR(100) UNIQUE) 
  - `password` (VARCHAR(255)) - Hash bcrypt
  - `created_at`, `updated_at` (TIMESTAMP)

**Usuarios de prueba:**
- **artista1** - `artista1@soundsrights.com` / password: `password123`
- **comprador1** - `comprador1@soundsrights.com` / password: `password123` 
- **artista2** - `artista2@soundsrights.com` / password: `password123`
- **comprador2** - `comprador2@soundsrights.com` / password: `password123`

---

### **🎵 Songs Service Database** - `songs_db` (Puerto 5433)  
**Responsabilidad:** Gestión del catálogo de canciones

**Tablas:**
- `user_profiles` - Réplica ligera de usuarios para relaciones
- `songs` - Catálogo de canciones
  - `id` (SERIAL PRIMARY KEY)
  - `title` (VARCHAR(255))
  - `artist_id` (INTEGER) - Referencia a user_profiles
  - `genre` (VARCHAR(50))
  - `price` (DECIMAL(10,2))
  - `status` (ENUM: 'for_sale', 'pending', 'sold')
  - `file_url` (VARCHAR(500))
  - `duration` (INTEGER) - Segundos
  - `description` (TEXT)
  - `tags` (VARCHAR(255))
  - `created_at`, `updated_at` (TIMESTAMP)

**Datos de ejemplo:**
- 5 canciones de prueba con diferentes géneros y estados
- Relaciones con artistas del auth service

---

### **📜 Licenses Service Database** - `licenses_db` (Puerto 5434)
**Responsabilidad:** Gestión de licencias y transacciones

**Tablas:**
- `user_profiles` - Réplica ligera de usuarios
- `song_references` - Referencias básicas de canciones
- `licenses` - Licencias de compra/venta
  - `id` (SERIAL PRIMARY KEY)
  - `song_id` (INTEGER)
  - `buyer_id` (INTEGER) 
  - `seller_id` (INTEGER)
  - `purchase_price` (DECIMAL(10,2))
  - `license_type` (VARCHAR(50)) - standard, exclusive, commercial
  - `license_terms` (TEXT)
  - `is_active` (BOOLEAN)
  - `expires_at` (TIMESTAMP) - Para licencias temporales
  - `created_at` (TIMESTAMP)

- `license_transactions` - Historial de transacciones
  - `id` (SERIAL PRIMARY KEY)
  - `license_id` (INTEGER)
  - `transaction_type` (VARCHAR(50)) - purchase, transfer, revoke
  - `amount` (DECIMAL(10,2))
  - `notes` (TEXT)
  - `created_at` (TIMESTAMP)

**Datos de ejemplo:**
- 2 licencias vendidas con sus transacciones

---

### **💬 Chat Service Database** - `chat_db` (Puerto 5435)
**Responsabilidad:** Sistema de mensajería entre usuarios

**Tablas:**
- `user_profiles` - Réplica ligera de usuarios
- `song_references` - Referencias básicas de canciones para contexto
- `chats` - Conversaciones entre compradores y artistas
  - `id` (SERIAL PRIMARY KEY)
  - `song_id` (INTEGER) - Canción de la que se habla
  - `buyer_id` (INTEGER)
  - `artist_id` (INTEGER) 
  - `is_active` (BOOLEAN)
  - `last_message_at` (TIMESTAMP)
  - `created_at` (TIMESTAMP)
  - **UNIQUE(song_id, buyer_id, artist_id)** - Un chat por combinación

- `messages` - Mensajes individuales
  - `id` (SERIAL PRIMARY KEY)
  - `chat_id` (INTEGER)
  - `sender_id` (INTEGER)
  - `content` (TEXT)
  - `message_type` (VARCHAR(20)) - text, image, file, system
  - `is_read` (BOOLEAN)
  - `edited_at` (TIMESTAMP)
  - `sent_at` (TIMESTAMP)

**Datos de ejemplo:**
- 3 chats activos con múltiples mensajes de conversación realista

---

## 🚀 **COMANDOS PARA DESARROLLO**

### **Iniciar todas las bases de datos:**
```bash
npm run db:start:all
```

### **Iniciar bases de datos individuales:**
```bash
npm run db:start:auth      # Auth DB (puerto 5432)
npm run db:start:songs     # Songs DB (puerto 5433) 
npm run db:start:licenses  # Licenses DB (puerto 5434)
npm run db:start:chat      # Chat DB (puerto 5435)
```

### **Ver logs de bases de datos:**
```bash
npm run db:logs:auth
npm run db:logs:songs
npm run db:logs:licenses
npm run db:logs:chat
```

### **Resetear todas las bases de datos:**
```bash
npm run db:reset:all
```

---

## 🔗 **CONEXIONES DE ADMINER**

**URL:** http://localhost:8080

**Conexiones:**

1. **Auth DB:**
   - Servidor: `auth-db`
   - Usuario: `postgres`
   - Contraseña: `password`
   - Base de datos: `auth_db`

2. **Songs DB:**
   - Servidor: `songs-db`
   - Usuario: `postgres` 
   - Contraseña: `password`
   - Base de datos: `songs_db`

3. **Licenses DB:**
   - Servidor: `licenses-db`
   - Usuario: `postgres`
   - Contraseña: `password`
   - Base de datos: `licenses_db`

4. **Chat DB:**
   - Servidor: `chat-db`
   - Usuario: `postgres`
   - Contraseña: `password`
   - Base de datos: `chat_db`

---

## 📋 **SINCRONIZACIÓN DE DATOS**

**Importante:** Las tablas `user_profiles` y `song_references` en cada servicio son réplicas ligeras que deben sincronizarse cuando hay cambios en los servicios principales.

**Estrategia de sincronización:**
- **Eventos** - Cada servicio emite eventos cuando se crean/actualizan datos
- **API calls** - Los servicios consultan entre sí cuando necesitan datos actualizados
- **Eventual consistency** - Los datos se sincronizan de forma eventual, no inmediata

---

## ✅ **VERIFICACIÓN DE DATOS**

Puedes ejecutar estas consultas en Adminer para verificar los datos:

### **Auth DB:**
```sql
SELECT id, username, email, created_at FROM users;
```

### **Songs DB:**
```sql
SELECT s.id, s.title, up.username, s.genre, s.price, s.status 
FROM songs s 
JOIN user_profiles up ON s.artist_id = up.id;
```

### **Licenses DB:**
```sql
SELECT 
    l.id,
    sr.title as song_title,
    seller.username as seller,
    buyer.username as buyer,
    l.purchase_price,
    l.license_type
FROM licenses l
JOIN song_references sr ON l.song_id = sr.id
JOIN user_profiles seller ON l.seller_id = seller.id
JOIN user_profiles buyer ON l.buyer_id = buyer.id;
```

### **Chat DB:**
```sql
SELECT 
    c.id as chat_id,
    sr.title as song_title,
    buyer.username as buyer,
    artist.username as artist,
    COUNT(m.id) as message_count
FROM chats c
JOIN song_references sr ON c.song_id = sr.id
JOIN user_profiles buyer ON c.buyer_id = buyer.id
JOIN user_profiles artist ON c.artist_id = artist.id
LEFT JOIN messages m ON c.id = m.chat_id
GROUP BY c.id, sr.title, buyer.username, artist.username;
```

---

## 🎯 **ARQUITECTURA FINAL**

```
┌─────────────────────────┐
│      API GATEWAY        │
│      (Puerto 3000)      │
└─────────────┬───────────┘
              │
    ┌─────────┼─────────────────────┐
    │         │                     │
    ▼         ▼                     ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ Auth    │ │ Songs   │ │Licenses │ │ Chat    │
│Service  │ │Service  │ │Service  │ │Service  │
└─────────┘ └─────────┘ └─────────┘ └─────────┘
    │         │           │           │
    ▼         ▼           ▼           ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│auth_db  │ │songs_db │ │licenses │ │chat_db  │
│:5432    │ │:5433    │ │_db:5434 │ │:5435    │
└─────────┘ └─────────┘ └─────────┘ └─────────┘
```

**¡Cada microservicio tiene su propia base de datos independiente! 🎉**
