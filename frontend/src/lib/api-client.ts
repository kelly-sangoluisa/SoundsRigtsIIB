import { API_CONFIG, API_ENDPOINTS } from './api-config';

// Tipos para las respuestas de la API
export interface Song {
  id: number;
  name: string;
  artist: string;
  genre: string;
  duration: number;
  price: number;
  status: 'for_sale' | 'pending' | 'sold';
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface License {
  id: number;
  songId: number;
  buyerId: number;
  sellerId: number;
  price: number;
  purchaseDate: string;
  songName: string;
  artistName: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface SongsResponse {
  songs: Song[];
  total: number;
}

export interface LicensesResponse {
  licenses: License[];
}

// Cliente API base
class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private headers: Record<string, string>;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.headers = { ...API_CONFIG.HEADERS };
  }

  // Método para agregar token de autenticación
  setAuthToken(token: string) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  // Método para agregar user-id (para el API Gateway)
  setUserId(userId: string) {
    this.headers['user-id'] = userId;
  }

  // Método genérico para hacer peticiones
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const config: RequestInit = {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
        },
        signal: AbortSignal.timeout(this.timeout),
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || data.message || `HTTP ${response.status}`,
        };
      }

      return { data };
    } catch (error) {
      console.error('API Error:', error);
      return {
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async patch<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient();

// API específica para canciones
export const songsApi = {
  // Obtener canciones disponibles para comprar
  getAvailable: () => 
    apiClient.get<SongsResponse>(API_ENDPOINTS.SONGS.AVAILABLE),

  // Obtener mis canciones
  getMine: () => 
    apiClient.get<SongsResponse>(API_ENDPOINTS.SONGS.MINE),

  // Crear nueva canción
  create: (songData: Partial<Song>) => 
    apiClient.post<Song>(API_ENDPOINTS.SONGS.CREATE, songData),

  // Actualizar canción
  update: (id: string, songData: Partial<Song>) => 
    apiClient.put<Song>(API_ENDPOINTS.SONGS.UPDATE(id), songData),

  // Eliminar canción
  delete: (id: string) => 
    apiClient.delete<void>(API_ENDPOINTS.SONGS.DELETE(id)),

  // Comprar licencia de canción
  purchase: (id: string) => 
    apiClient.post<License>(API_ENDPOINTS.SONGS.PURCHASE(id)),

  // Cambiar estado de canción
  updateStatus: (id: string, status: Song['status']) => 
    apiClient.patch<Song>(API_ENDPOINTS.SONGS.UPDATE_STATUS(id), { status }),
};

// API específica para licencias
export const licensesApi = {
  // Obtener licencias compradas
  getPurchased: () => 
    apiClient.get<LicensesResponse>(API_ENDPOINTS.LICENSES.PURCHASED),

  // Obtener licencias vendidas
  getSold: () => 
    apiClient.get<LicensesResponse>(API_ENDPOINTS.LICENSES.SOLD),
};

export default apiClient;
