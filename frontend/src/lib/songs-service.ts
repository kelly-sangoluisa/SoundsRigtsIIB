import { API_ENDPOINTS } from './api-config';

export interface Song {
  _id: string;
  title: string;
  artist: string;
  genre: string;
  duration: number;
  price: number;
  description?: string;
  albumCover?: string;
  audioFile?: string;
  isAvailable: boolean;
  ownerId: string;
  currentOwnerId?: string;
  status: 'available' | 'requested' | 'sold';
  requestedById?: string;
  requestedAt?: string;
  playCount: number;
  tags: string[];
  releaseDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSongData {
  title: string;
  artist: string;
  genre: string;
  duration: number;
  price: number;
  description?: string;
  albumCover?: string;
  audioFile?: string;
  isAvailable?: boolean;
  ownerId: string;
  tags?: string[];
  releaseDate?: string;
}

class SongsService {
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  private getAuthHeaders(): Record<string, string> {
    const token = this.getAuthToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  async getAllSongs(): Promise<Song[]> {
    try {
      const response = await fetch(API_ENDPOINTS.SONGS);
      if (!response.ok) {
        throw new Error(`Error fetching songs: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching songs:', error);
      throw error;
    }
  }

  async searchSongs(query: string): Promise<Song[]> {
    try {
      const response = await fetch(`${API_ENDPOINTS.SONGS_SEARCH}?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`Error searching songs: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error searching songs:', error);
      throw error;
    }
  }

  async getSongsByGenre(genre: string): Promise<Song[]> {
    try {
      const response = await fetch(`${API_ENDPOINTS.SONGS_BY_GENRE}/${encodeURIComponent(genre)}`);
      if (!response.ok) {
        throw new Error(`Error fetching songs by genre: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching songs by genre:', error);
      throw error;
    }
  }

  async getSongsByOwner(ownerId: string): Promise<Song[]> {
    try {
      const response = await fetch(`${API_ENDPOINTS.SONGS_BY_OWNER}/${ownerId}`, {
        headers: this.getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error(`Error fetching songs by owner: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching songs by owner:', error);
      throw error;
    }
  }

  async createSong(songData: CreateSongData): Promise<Song> {
    try {
      console.log('SongsService.createSong - Datos a enviar:', songData);
      console.log('SongsService.createSong - Headers:', this.getAuthHeaders());
      console.log('SongsService.createSong - URL:', API_ENDPOINTS.SONGS);
      
      const response = await fetch(API_ENDPOINTS.SONGS, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(songData),
      });
      
      console.log('SongsService.createSong - Response status:', response.status);
      console.log('SongsService.createSong - Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('SongsService.createSong - Error response:', errorText);
        throw new Error(`Error creating song: ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('SongsService.createSong - Success result:', result);
      return result;
    } catch (error) {
      console.error('Error creating song:', error);
      throw error;
    }
  }

  async updateSong(songId: string, songData: Partial<CreateSongData>): Promise<Song> {
    try {
      const response = await fetch(`${API_ENDPOINTS.SONGS}/${songId}`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(songData),
      });
      
      if (!response.ok) {
        throw new Error(`Error updating song: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating song:', error);
      throw error;
    }
  }

  async deleteSong(songId: string): Promise<void> {
    try {
      const response = await fetch(`${API_ENDPOINTS.SONGS}/${songId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Error deleting song: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting song:', error);
      throw error;
    }
  }

  async incrementPlayCount(songId: string): Promise<Song> {
    try {
      const response = await fetch(`${API_ENDPOINTS.SONGS}/${songId}/play`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Error incrementing play count: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error incrementing play count:', error);
      throw error;
    }
  }

  // Nuevos métodos para compras
  async requestSong(songId: string, requesterId: string): Promise<Song> {
    try {
      console.log('🛒 Solicitando compra de canción:', { songId, requesterId });
      const response = await fetch(API_ENDPOINTS.SONGS_REQUEST, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ songId, requesterId }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al solicitar canción:', errorText);
        throw new Error(`Error requesting song: ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Canción solicitada exitosamente:', result);
      return result;
    } catch (error) {
      console.error('Error requesting song:', error);
      throw error;
    }
  }

  async acceptSongRequest(songId: string, newOwnerId: string): Promise<Song> {
    try {
      console.log('✅ Aceptando solicitud de compra:', { songId, newOwnerId });
      const response = await fetch(API_ENDPOINTS.SONGS_ACCEPT_REQUEST, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ songId, newOwnerId }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al aceptar solicitud:', errorText);
        throw new Error(`Error accepting request: ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Solicitud aceptada exitosamente:', result);
      return result;
    } catch (error) {
      console.error('Error accepting song request:', error);
      throw error;
    }
  }

  async rejectSongRequest(songId: string): Promise<Song> {
    try {
      console.log('❌ Rechazando solicitud de compra:', { songId });
      const response = await fetch(API_ENDPOINTS.SONGS_REJECT_REQUEST, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ songId }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error al rechazar solicitud:', errorText);
        throw new Error(`Error rejecting request: ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log('✅ Solicitud rechazada exitosamente:', result);
      return result;
    } catch (error) {
      console.error('Error rejecting song request:', error);
      throw error;
    }
  }

  async getRequestedSongs(ownerId: string): Promise<Song[]> {
    try {
      const response = await fetch(`${API_ENDPOINTS.SONGS_REQUESTS}/${ownerId}`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching requested songs: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching requested songs:', error);
      throw error;
    }
  }

  async getPurchasedSongs(userId: string): Promise<Song[]> {
    try {
      const response = await fetch(`${API_ENDPOINTS.SONGS_PURCHASED}/${userId}`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching purchased songs: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching purchased songs:', error);
      throw error;
    }
  }
}

export const songsService = new SongsService();
