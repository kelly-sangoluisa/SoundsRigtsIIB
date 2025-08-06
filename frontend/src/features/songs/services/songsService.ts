import { Song, SongsResponse, SongFilters, UpdateSongRequest } from '../types';
import { mockSongsAPI } from '@/shared/utils/mockSongsAPI';
import { tokenStorage } from '@/shared/utils/tokenStorage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100/api/v1';
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || true;

console.log('🔧 [SongsService] Configuración:', { API_BASE_URL, USE_MOCK_API });

class SongsError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'SongsError';
  }
}

export class SongsService {
  private static getAuthHeaders(): Record<string, string> {
    const token = tokenStorage.get();
    console.log('🔑 [SongsService] Obteniendo headers:', { hasToken: !!token });
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
    
    console.log('📤 [SongsService] Headers finales:', Object.keys(headers));
    return headers;
  }

  private static getUserFromToken(): { userId: string; artistId: string } {
    const token = tokenStorage.get();
    if (!token) {
      throw new SongsError('No se encontró token de autenticación');
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.userId || payload.sub || payload.id;
      console.log('👤 [SongsService] Usuario del token:', { userId, payload });
      
      return {
        userId: userId?.toString() || '1',
        artistId: userId?.toString() || '1'
      };
    } catch (error) {
      console.error('❌ [SongsService] Error al decodificar token:', error);
      throw new SongsError('Token inválido');
    }
  }

  // Obtener canciones del usuario autenticado
  static async getMySongs(filters?: SongFilters): Promise<SongsResponse> {
    console.log('📋 [SongsService] Obteniendo mis canciones...', { filters, USE_MOCK_API });
    
    try {
      if (USE_MOCK_API) {
        console.log('🎭 [SongsService] Usando Mock API para getMySongs');
        const { artistId } = this.getUserFromToken();
        const result = await mockSongsAPI.getMySongs(artistId);
        console.log('✅ [SongsService] Mock API - Canciones obtenidas:', result);
        return result;
      }

      // API real
      console.log('🌐 [SongsService] Usando API real para getMySongs');
      const queryParams = new URLSearchParams();
      if (filters?.genre) queryParams.append('genre', filters.genre);
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.search) queryParams.append('search', filters.search);

      const url = `${API_BASE_URL}/songs/mine${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      console.log('🔗 [SongsService] URL de la petición:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log('📡 [SongsService] Respuesta recibida:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        throw new SongsError('Error al obtener las canciones');
      }

      const result = await response.json();
      console.log('✅ [SongsService] API real - Canciones obtenidas:', result);
      return result;
    } catch (error) {
      console.error('❌ [SongsService] Error en getMySongs:', error);
      if (error instanceof SongsError) {
        throw error;
      }
      throw new SongsError(error instanceof Error ? error.message : 'Error de conexión');
    }
  }

  // Crear una nueva canción
  static async createSong(songData: any): Promise<Song> {
    console.log('🎵 [SongsService] Creando canción...', { songData, USE_MOCK_API });
    
    try {
      if (USE_MOCK_API) {
        console.log('🎭 [SongsService] Usando Mock API para crear canción');
        const { artistId } = this.getUserFromToken();
        
        // Convertir formato frontend a formato mock API
        const mockSongData = {
          name: songData.title || songData.name,
          genre: songData.genre,
          duration: songData.duration || 180,
          price: songData.price,
          url: songData.url || 'https://example.com/song.mp3'
        };
        
        console.log('📝 [SongsService] Datos para Mock API:', mockSongData);
        const result = await mockSongsAPI.createSong(mockSongData, artistId);
        console.log('✅ [SongsService] Mock API - Canción creada:', result);
        return result;
      }

      // API real
      console.log('🌐 [SongsService] Usando API real para crear canción');
      const { userId } = this.getUserFromToken();
      
      const requestBody = {
        ...songData,
        artistId: parseInt(userId) || 1,
      };
      
      console.log('📝 [SongsService] Datos para API real:', requestBody);
      console.log('🔗 [SongsService] URL:', `${API_BASE_URL}/songs`);

      const response = await fetch(`${API_BASE_URL}/songs`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(requestBody),
      });

      console.log('📡 [SongsService] Respuesta recibida:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [SongsService] Error en respuesta:', errorText);
        throw new SongsError(errorText || 'Error al crear la canción');
      }

      const result = await response.json();
      console.log('✅ [SongsService] API real - Canción creada:', result);
      return result;
    } catch (error) {
      console.error('❌ [SongsService] Error en createSong:', error);
      if (error instanceof SongsError) {
        throw error;
      }
      throw new SongsError(error instanceof Error ? error.message : 'Error de conexión');
    }
  }

  // Obtener una canción específica
  static async getSong(songId: string): Promise<Song> {
    console.log('🔍 [SongsService] Obteniendo canción:', { songId, USE_MOCK_API });
    
    try {
      if (USE_MOCK_API) {
        console.log('🎭 [SongsService] Usando Mock API para getSong');
        const song = await mockSongsAPI.getSong(songId);
        if (!song) {
          throw new SongsError('Canción no encontrada');
        }
        console.log('✅ [SongsService] Mock API - Canción obtenida:', song);
        return song;
      }

      console.log('🌐 [SongsService] Usando API real para getSong');
      const response = await fetch(`${API_BASE_URL}/songs/${songId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log('📡 [SongsService] Respuesta recibida:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        throw new SongsError('Error al obtener la canción');
      }

      const result = await response.json();
      console.log('✅ [SongsService] API real - Canción obtenida:', result);
      return result;
    } catch (error) {
      console.error('❌ [SongsService] Error en getSong:', error);
      if (error instanceof SongsError) {
        throw error;
      }
      throw new SongsError(error instanceof Error ? error.message : 'Error de conexión');
    }
  }

  // Actualizar una canción
  static async updateSong(songId: string, songData: UpdateSongRequest): Promise<Song> {
    console.log('✏️ [SongsService] Actualizando canción:', { songId, songData, USE_MOCK_API });
    
    try {
      if (USE_MOCK_API) {
        console.log('🎭 [SongsService] Usando Mock API para actualizar canción');
        const { artistId } = this.getUserFromToken();
        const result = await mockSongsAPI.updateSong(songId, songData, artistId);
        console.log('✅ [SongsService] Mock API - Canción actualizada:', result);
        return result;
      }

      console.log('🌐 [SongsService] Usando API real para actualizar canción');
      const response = await fetch(`${API_BASE_URL}/songs/${songId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(songData),
      });

      console.log('📡 [SongsService] Respuesta recibida:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new SongsError(errorData.message || 'Error al actualizar la canción');
      }

      const result = await response.json();
      console.log('✅ [SongsService] API real - Canción actualizada:', result);
      return result;
    } catch (error) {
      console.error('❌ [SongsService] Error en updateSong:', error);
      if (error instanceof SongsError) {
        throw error;
      }
      throw new SongsError(error instanceof Error ? error.message : 'Error de conexión');
    }
  }

  // Eliminar una canción
  static async deleteSong(songId: string): Promise<void> {
    console.log('🗑️ [SongsService] Eliminando canción:', { songId, USE_MOCK_API });
    
    try {
      if (USE_MOCK_API) {
        console.log('🎭 [SongsService] Usando Mock API para eliminar canción');
        const { artistId } = this.getUserFromToken();
        await mockSongsAPI.deleteSong(songId, artistId);
        console.log('✅ [SongsService] Mock API - Canción eliminada');
        return;
      }

      console.log('🌐 [SongsService] Usando API real para eliminar canción');
      const response = await fetch(`${API_BASE_URL}/songs/${songId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      console.log('📡 [SongsService] Respuesta recibida:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        throw new SongsError('Error al eliminar la canción');
      }

      console.log('✅ [SongsService] API real - Canción eliminada');
    } catch (error) {
      console.error('❌ [SongsService] Error en deleteSong:', error);
      if (error instanceof SongsError) {
        throw error;
      }
      throw new SongsError(error instanceof Error ? error.message : 'Error de conexión');
    }
  }

  // Actualizar estado de una canción
  static async updateSongStatus(songId: string, status: Song['status']): Promise<Song> {
    console.log('🔄 [SongsService] Actualizando estado de canción:', { songId, status, USE_MOCK_API });
    
    try {
      if (USE_MOCK_API) {
        console.log('🎭 [SongsService] Usando Mock API para actualizar estado');
        const result = await mockSongsAPI.updateSongStatus(songId, status);
        console.log('✅ [SongsService] Mock API - Estado actualizado:', result);
        return result;
      }

      console.log('🌐 [SongsService] Usando API real para actualizar estado');
      const response = await fetch(`${API_BASE_URL}/songs/${songId}/status`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status }),
      });

      console.log('📡 [SongsService] Respuesta recibida:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        throw new SongsError('Error al actualizar el estado de la canción');
      }

      const result = await response.json();
      console.log('✅ [SongsService] API real - Estado actualizado:', result);
      return result;
    } catch (error) {
      console.error('❌ [SongsService] Error en updateSongStatus:', error);
      if (error instanceof SongsError) {
        throw error;
      }
      throw new SongsError(error instanceof Error ? error.message : 'Error de conexión');
    }
  }
}
