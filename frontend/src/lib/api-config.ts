// Configuración centralizada de endpoints de API
export const API_CONFIG = {
  AUTH_SERVICE: 'http://localhost:3001',
  SONGS_SERVICE: 'http://localhost:3002'
};

export const API_ENDPOINTS = {
  // Auth service endpoints
  AUTH_LOGIN: `${API_CONFIG.AUTH_SERVICE}/auth/login`,
  AUTH_REGISTER: `${API_CONFIG.AUTH_SERVICE}/auth/register`,
  
  // Songs service endpoints
  SONGS: `${API_CONFIG.SONGS_SERVICE}/songs`,
  SONGS_SEARCH: `${API_CONFIG.SONGS_SERVICE}/songs/search`,
  SONGS_BY_GENRE: `${API_CONFIG.SONGS_SERVICE}/songs/genre`,
  SONGS_BY_OWNER: `${API_CONFIG.SONGS_SERVICE}/songs/owner`,
  
  // Purchase endpoints
  SONGS_REQUEST: `${API_CONFIG.SONGS_SERVICE}/songs/request`,
  SONGS_ACCEPT_REQUEST: `${API_CONFIG.SONGS_SERVICE}/songs/accept-request`,
  SONGS_REJECT_REQUEST: `${API_CONFIG.SONGS_SERVICE}/songs/reject-request`,
  SONGS_REQUESTS: `${API_CONFIG.SONGS_SERVICE}/songs/requests`,
  SONGS_PURCHASED: `${API_CONFIG.SONGS_SERVICE}/songs/purchased`,
};
