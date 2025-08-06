// Configuración de la API
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100/api/v1',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  },
};

// Endpoints de la API
export const API_ENDPOINTS = {
  // Autenticación
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  
  // Canciones
  SONGS: {
    AVAILABLE: '/songs/available',
    MINE: '/songs/mine',
    CREATE: '/songs',
    UPDATE: (id: string) => `/songs/${id}`,
    DELETE: (id: string) => `/songs/${id}`,
    PURCHASE: (id: string) => `/songs/${id}/purchase`,
    UPDATE_STATUS: (id: string) => `/songs/${id}/status`,
  },
  
  // Licencias
  LICENSES: {
    PURCHASED: '/licenses/purchased',
    SOLD: '/licenses/sold',
  },
  
  // Chat
  CHAT: {
    ROOMS: '/chat/rooms',
    MESSAGES: (roomId: string) => `/chat/rooms/${roomId}/messages`,
  },
};

export default API_CONFIG;
