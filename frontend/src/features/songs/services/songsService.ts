import { Song, SongsResponse, SongFilters, UpdateSongRequest } from '../types';
import { mockSongsAPI } from '@/shared/utils/mockSongsAPI';
import { tokenStorage } from '@/shared/utils/tokenStorage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true' || true;

class SongsError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'SongsError';
  }
}

export class SongsService {
  private static getAuthHeaders(): Record<string, string> {
    const token = tokenStorage.get();
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Obtener canciones del usuario autenticado
  static async getMySongs(filters?: SongFilters): Promise<SongsResponse> {
    try {
      if (USE_MOCK_API) {
        // Usar API simulada - necesitamos el ID del usuario del token
        const token = tokenStorage.get();
        if (!token) {
          throw new SongsError('No se encontró token de autenticación');
        }

        // Decodificar el token para obtener el ID del usuario
        const payload = JSON.parse(atob(token.split('.')[1]));
        const artistId = payload.id || payload.sub;
        
        return await mockSongsAPI.getMySongs(artistId);
      }

      // API real (cuando esté disponible)
      const queryParams = new URLSearchParams();
      if (filters?.genre) queryParams.append('genre', filters.genre);
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.search) queryParams.append('search', filters.search);

      const url = `${API_BASE_URL}/songs/mine${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new SongsError('Error al obtener las canciones');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof SongsError) {
        throw error;
      }
      throw new SongsError(error instanceof Error ? error.message : 'Error de conexión');
    }
  }

  // Obtener una canción específica
  static async getSong(songId: string): Promise<Song> {
    try {
      if (USE_MOCK_API) {
        const song = await mockSongsAPI.getSong(songId);
        if (!song) {
          throw new SongsError('Canción no encontrada');
        }
        return song;
      }

      const response = await fetch(`${API_BASE_URL}/songs/${songId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new SongsError('Error al obtener la canción');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof SongsError) {
        throw error;
      }
      throw new SongsError(error instanceof Error ? error.message : 'Error de conexión');
    }
  }

  // Actualizar estado de una canción
  static async updateSongStatus(songId: string, status: Song['status']): Promise<Song> {
    try {
      if (USE_MOCK_API) {
        return await mockSongsAPI.updateSongStatus(songId, status);
      }

      const response = await fetch(`${API_BASE_URL}/songs/${songId}/status`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new SongsError('Error al actualizar el estado de la canción');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof SongsError) {
        throw error;
      }
      throw new SongsError(error instanceof Error ? error.message : 'Error de conexión');
    }
  }

  // Eliminar una canción
  static async deleteSong(songId: string): Promise<void> {
    try {
      if (USE_MOCK_API) {
        await mockSongsAPI.deleteSong(songId);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/songs/${songId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new SongsError('Error al eliminar la canción');
      }
    } catch (error) {
      if (error instanceof SongsError) {
        throw error;
      }
      throw new SongsError(error instanceof Error ? error.message : 'Error de conexión');
    }
  }
}
