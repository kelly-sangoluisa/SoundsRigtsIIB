// Estados de canciones
export const SONG_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending', 
  PUBLISHED: 'published',
  REJECTED: 'rejected',
  ARCHIVED: 'archived',
  AVAILABLE: 'available',
  SOLD: 'sold',
} as const;

// Estados de licencias
export const LICENSE_STATUS = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
  PENDING: 'pending',
} as const;

// Tipos de licencia
export const LICENSE_TYPES = {
  BASIC: 'basic',
  STANDARD: 'standard',
  PREMIUM: 'premium',
  EXCLUSIVE: 'exclusive',
} as const;

// Estados de chat
export const CHAT_STATUS = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  BLOCKED: 'blocked',
} as const;

// Estados de mensajes
export const MESSAGE_STATUS = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed',
} as const;

// Tipos de mensaje
export const MESSAGE_TYPE = {
  TEXT: 'text',
  IMAGE: 'image',
  AUDIO: 'audio',
  FILE: 'file',
  SYSTEM: 'system',
} as const;

// Roles de usuario
export const USER_ROLES = {
  ARTIST: 'artist',
  BUYER: 'buyer',
  ADMIN: 'admin',
} as const;

// Modos de aplicación
export const APP_MODES = {
  ARTIST: 'artist',
  BUYER: 'buyer',
} as const;

// Géneros musicales
export const MUSIC_GENRES = {
  ELECTRONIC: 'electronic',
  ROCK: 'rock',
  POP: 'pop',
  JAZZ: 'jazz',
  CLASSICAL: 'classical',
  HIP_HOP: 'hip_hop',
  REGGAE: 'reggae',
  COUNTRY: 'country',
  BLUES: 'blues',
  FOLK: 'folk',
  AMBIENT: 'ambient',
  TECHNO: 'techno',
  HOUSE: 'house',
  TRANCE: 'trance',
  DRUM_AND_BASS: 'drum_and_bass',
} as const;

// Rutas de la API
export const API_ROUTES = {
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
  },
  
  // Canciones
  SONGS: {
    LIST: '/songs',
    CREATE: '/songs',
    GET: (id: string) => `/songs/${id}`,
    UPDATE: (id: string) => `/songs/${id}`,
    DELETE: (id: string) => `/songs/${id}`,
    UPLOAD: '/songs/upload',
    MY_SONGS: '/songs/my',
    AVAILABLE: '/songs/available',
    SEARCH: '/songs/search',
  },
  
  // Licencias
  LICENSES: {
    LIST: '/licenses',
    CREATE: '/licenses',
    GET: (id: string) => `/licenses/${id}`,
    UPDATE: (id: string) => `/licenses/${id}`,
    DELETE: (id: string) => `/licenses/${id}`,
    PURCHASED: '/licenses/purchased',
    SOLD: '/licenses/sold',
    DOWNLOAD: (id: string) => `/licenses/${id}/download`,
  },
  
  // Chats
  CHATS: {
    LIST: '/chats',
    CREATE: '/chats',
    GET: (id: string) => `/chats/${id}`,
    UPDATE: (id: string) => `/chats/${id}`,
    DELETE: (id: string) => `/chats/${id}`,
    MESSAGES: (chatId: string) => `/chats/${chatId}/messages`,
    SEND_MESSAGE: (chatId: string) => `/chats/${chatId}/messages`,
    MARK_READ: (chatId: string) => `/chats/${chatId}/read`,
    ARCHIVE: (chatId: string) => `/chats/${chatId}/archive`,
    UNARCHIVE: (chatId: string) => `/chats/${chatId}/unarchive`,
  },
  
  // Usuarios
  USERS: {
    LIST: '/users',
    GET: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    PROFILE: '/users/profile',
    AVATAR: '/users/avatar',
    SETTINGS: '/users/settings',
  },
  
  // Pagos
  PAYMENTS: {
    CREATE: '/payments',
    GET: (id: string) => `/payments/${id}`,
    LIST: '/payments',
    WEBHOOK: '/payments/webhook',
  },
  
  // Estadísticas
  STATS: {
    OVERVIEW: '/stats/overview',
    SONGS: '/stats/songs',
    LICENSES: '/stats/licenses',
    REVENUE: '/stats/revenue',
  },
} as const;

// Configuraciones de paginación
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const;

// Configuraciones de archivos
export const FILE_CONFIG = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  ALLOWED_AUDIO_TYPES: ['audio/mpeg', 'audio/wav', 'audio/flac', 'audio/aac'],
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

// Configuraciones de tiempo
export const TIME_CONFIG = {
  TOKEN_REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutos
  IDLE_TIMEOUT: 30 * 60 * 1000, // 30 minutos
  CHAT_POLL_INTERVAL: 3 * 1000, // 3 segundos
} as const;

// Configuraciones de la UI
export const UI_CONFIG = {
  TOAST_DURATION: 5000,
  MODAL_ANIMATION_DURATION: 300,
  SIDEBAR_WIDTH: 256,
  HEADER_HEIGHT: 64,
} as const;

// Precios por defecto
export const DEFAULT_PRICES = {
  BASIC_LICENSE: 9.99,
  STANDARD_LICENSE: 19.99,
  PREMIUM_LICENSE: 49.99,
  EXCLUSIVE_LICENSE: 199.99,
} as const;

// Validaciones
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_SONG_TITLE_LENGTH: 100,
  MAX_SONG_DESCRIPTION_LENGTH: 1000,
  MAX_MESSAGE_LENGTH: 1000,
  MIN_SONG_DURATION: 10, // segundos
  MAX_SONG_DURATION: 600, // 10 minutos
} as const;
