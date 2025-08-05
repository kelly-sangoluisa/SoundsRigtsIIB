# SoundsRights Frontend

Una plataforma de marketplace para la compra y venta de derechos musicales, construida con Next.js 15, TypeScript y Tailwind CSS.

## 🚀 Características Principales

### 🔐 Sistema de Autenticación
- **Login con JWT**: Autenticación segura con tokens JWT
- **Protección de rutas**: Middleware que protege rutas privadas
- **Gestión de sesión**: Sistema de logout y persistencia de sesión
- **Hook useAuth**: Manejo centralizado del estado de autenticación

### 🎵 Gestión de Canciones
- **Subida de canciones**: Formulario completo para registrar nuevas canciones
- **Catálogo personal**: Vista de "Mis Canciones" con gestión completa
- **Explorar música**: Búsqueda y filtrado de canciones disponibles
- **Estados de canción**: Manejo de estados (disponible, pendiente, vendida, reservada)
- **Edición y eliminación**: CRUD completo para canciones propias

### 💸 Sistema de Licencias
- **Compra de licencias**: Proceso de compra simplificado
- **Historial de compras**: Vista de licencias adquiridas
- **Ventas realizadas**: Seguimiento de licencias vendidas
- **Gestión de estados**: Control de estados de transacciones
- **Descargas**: Sistema de descarga de licencias compradas

### 💬 Sistema de Chat
- **Chat por canción**: Comunicación directa entre comprador y vendedor
- **Lista de conversaciones**: Vista organizada de todos los chats
- **Mensajes en tiempo real**: (Preparado para WebSockets)
- **Notificaciones**: Indicadores de mensajes no leídos
- **Archivado**: Gestión de chats activos y archivados

### 👤 Perfiles de Usuario
- **Información personal**: Visualización de datos del usuario
- **Cambio de roles**: Alternancia entre modo artista y comprador
- **Configuraciones**: Panel de ajustes personales

### 🧱 Componentes Reutilizables
- **SongCard**: Tarjeta de canción con toda la información
- **RoleSwitchButton**: Botón para cambiar entre roles
- **Layout responsivo**: Header, sidebar y contenido adaptativo
- **Componentes base**: Input, Button, Modal, Select, Textarea
- **Sistema de routing**: Navegación protegida y dinámica

## 🏗️ Arquitectura del Proyecto

```
frontend/
├── src/
│   ├── app/                     # App Router de Next.js
│   │   ├── (auth)/
│   │   │   └── login/          # Página de login
│   │   ├── dashboard/          # Rutas protegidas del dashboard
│   │   │   ├── layout.tsx      # Layout principal con sidebar
│   │   │   ├── page.tsx        # Dashboard principal
│   │   │   ├── artist/         # Rutas específicas del artista
│   │   │   │   ├── songs/      # Gestión de canciones
│   │   │   │   ├── licenses/   # Licencias vendidas
│   │   │   │   └── chats/      # Chats del artista
│   │   │   └── buyer/          # Rutas específicas del comprador
│   │   │       ├── explore/    # Explorar canciones
│   │   │       ├── licenses/   # Licencias compradas
│   │   │       └── chats/      # Chats del comprador
│   │   └── profile/            # Perfil de usuario
│   ├── shared/                 # Código compartido
│   │   ├── components/         # Componentes reutilizables
│   │   │   ├── ui/            # Componentes base (Button, Input, etc.)
│   │   │   ├── SongCard.tsx   # Tarjeta de canción
│   │   │   ├── RoleSwitchButton.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── RouteGuard.tsx
│   │   ├── hooks/             # Hooks personalizados
│   │   │   ├── useAuth.ts     # Autenticación
│   │   │   ├── useSongs.ts    # Gestión de canciones
│   │   │   ├── useLicenses.ts # Gestión de licencias
│   │   │   └── useChats.ts    # Gestión de chats
│   │   ├── lib/              # Utilidades y configuración
│   │   │   └── api.ts        # Cliente API centralizado
│   │   ├── types/            # Tipos TypeScript
│   │   │   └── index.ts      # Interfaces y tipos
│   │   └── constants/        # Constantes de la aplicación
│   │       └── index.ts      # Rutas API, estados, etc.
│   └── middleware.ts         # Middleware de autenticación
├── tailwind.config.js        # Configuración de Tailwind
├── next.config.js           # Configuración de Next.js
└── package.json             # Dependencias del proyecto
```

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Gestión de Estado**: React Hooks + Context API
- **Autenticación**: JWT con localStorage/cookies
- **Cliente HTTP**: Fetch API con wrapper personalizado
- **Enrutamiento**: Next.js App Router con middleware
- **UI/UX**: Componentes personalizados + Tailwind

## 📝 Features Implementados

### ✅ Autenticación (Tasks 1-3)
- [x] **Task 1**: Página de login con JWT
- [x] **Task 2**: Middleware para proteger rutas privadas  
- [x] **Task 3**: Hook useAuth() para manejo de sesión

### ✅ Gestión de Canciones (Tasks 4-9)
- [x] **Task 4**: Página "Mis canciones" (modo artista)
- [x] **Task 5**: Crear nueva canción
- [x] **Task 6**: Editar o eliminar canción
- [x] **Task 7**: Mostrar canciones "reservadas"
- [x] **Task 8**: Vista de canciones disponibles (modo comprador)
- [x] **Task 9**: Iniciar solicitud de compra

### ✅ Sistema de Licencias (Tasks 10-11)
- [x] **Task 10**: Historial de licencias compradas
- [x] **Task 11**: Licencias vendidas (modo artista)

### ✅ Sistema de Chat (Tasks 12-14)
- [x] **Task 12**: Lista de chats
- [x] **Task 13**: Ver chat por canción
- [x] **Task 14**: Crear chat al comprar

### ✅ Perfiles de Usuario (Task 15)
- [x] **Task 15**: Mostrar perfil del usuario

### ✅ Componentes Compartidos (Tasks 16-19)
- [x] **Task 16**: RoleSwitchButton
- [x] **Task 17**: SongCard
- [x] **Task 18**: Layout general
- [x] **Task 19**: Inputs y modales base

### ✅ Infraestructura Compartida (Tasks 20-22)
- [x] **Task 20**: API centralizada
- [x] **Task 21**: Hooks personalizados (useSongs, useLicenses, useChats)
- [x] **Task 22**: Constants y types

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js 18+ 
- npm, yarn, pnpm o bun

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/kelly-sangoluisa/SoundsRigtsIIB.git
cd SoundsRigtsIIB/frontend

# Instalar dependencias
npm install
# o
yarn install
# o
pnpm install
```

### Desarrollo

```bash
# Ejecutar servidor de desarrollo
npm run dev
# o
yarn dev
# o
pnpm dev

# Abrir http://localhost:3000
```

### Construcción

```bash
# Construir para producción
npm run build

# Iniciar servidor de producción
npm run start
```

## 🎯 Funcionalidades Clave

### Dashboard Inteligente
- **Estadísticas en tiempo real**: Calculadas desde datos reales de la API
- **Actividad reciente**: Generada dinámicamente basada en acciones del usuario
- **Acciones rápidas**: Enlaces contextuales según el rol del usuario
- **Indicadores visuales**: Badges y notificaciones para nueva actividad

### Sistema de Roles Dinámico
- **Cambio fluido**: Alternancia entre modo artista y comprador
- **Rutas específicas**: Navegación adaptada al rol activo
- **Permisos granulares**: Acceso controlado según el contexto
- **UI contextual**: Colores y elementos que cambian por rol

### Gestión Completa de Datos
- **CRUD completo**: Crear, leer, actualizar, eliminar para todas las entidades
- **Filtros avanzados**: Búsqueda y filtrado por múltiples criterios
- **Paginación automática**: Carga progresiva con "Load More"
- **Estados de error**: Manejo robusto de errores con mensajes descriptivos

### API Centralizada
- **Cliente unificado**: Todas las llamadas API pasan por un punto central
- **Autenticación automática**: JWT se adjunta automáticamente
- **Manejo de errores**: Respuestas consistentes y logging
- **Interceptores**: Posibilidad de middleware para requests/responses

## 🔧 Configuración

### Variables de Entorno
```env
# API Backend URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# JWT Secret (para validación client-side)
NEXT_PUBLIC_JWT_SECRET=your-secret-key

# Environment
NODE_ENV=development
```

### Rutas de la API
Las rutas están definidas en `src/shared/constants/index.ts`:

```typescript
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  SONGS: {
    LIST: '/songs',
    CREATE: '/songs',
    MY_SONGS: '/songs/my',
    AVAILABLE: '/songs/available',
    // ... más rutas
  },
  // ... más módulos
};
```

## 📱 Responsive Design

- **Mobile First**: Diseñado primero para dispositivos móviles
- **Breakpoints**: sm, md, lg, xl - adaptación fluida
- **Componentes flexibles**: Grid y flexbox para layouts adaptativos
- **Touch-friendly**: Botones y elementos optimizados para touch

## 🎨 Sistema de Diseño

### Colores por Rol
- **Artista**: Tonos azules y verdes (creatividad y crecimiento)
- **Comprador**: Tonos púrpuras y índigo (exploración y descubrimiento)
- **Neutros**: Grises para elementos comunes

### Iconografía
- Emojis contextuales para acciones rápidas
- Icons consistentes para estados y acciones
- Badges de notificación para nueva actividad

### Tipografía
- **Headers**: Bold para jerarquía clara
- **Body**: Regular para legibilidad
- **Accents**: Medium para elementos importantes

## 🚀 Próximos Pasos

### Funcionalidades Pendientes
1. **WebSockets**: Chat en tiempo real
2. **Notificaciones Push**: Alertas de nueva actividad
3. **Búsqueda Avanzada**: Filtros complejos y facetados
4. **Analytics**: Métricas detalladas de rendimiento
5. **Pagos**: Integración con procesadores de pago
6. **Multi-idioma**: Soporte para i18n

### Optimizaciones Técnicas
1. **Cache**: Implementar React Query o SWR
2. **Performance**: Code splitting y lazy loading
3. **SEO**: Meta tags y structured data
4. **PWA**: Service workers y offline support
5. **Testing**: Unit tests y E2E tests

## 📞 Soporte

Para preguntas o soporte técnico:
- **Email**: kelly.sangoluisa@example.com
- **GitHub Issues**: [Crear Issue](https://github.com/kelly-sangoluisa/SoundsRigtsIIB/issues)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

**SoundsRights** - Democratizando el acceso a los derechos musicales 🎵
