import { Injectable } from '@nestjs/common';
import { CircuitBreakerService } from '../circuit-breaker/circuit-breaker.service';

@Injectable()
export class SongsService {
  constructor(private readonly circuitBreaker: CircuitBreakerService) {}

  private readonly songsServiceUrl = `http://${process.env.SONGS_SERVICE_HOST || 'localhost'}:${process.env.SONGS_SERVICE_PORT || 3002}`;

  async getMySongs(userId: string) {
    return this.circuitBreaker.execute(
      'songs-service',
      async () => {
        const response = await fetch(`${this.songsServiceUrl}/songs/mine?userId=${userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch songs');
        }
        
        const data = await response.json();
        
        // Asegurar que siempre devuelva un formato consistente
        return {
          songs: data.songs || [],
          total: data.total || 0,
          message: data.message || (data.songs?.length === 0 ? 'No tienes canciones aún' : undefined)
        };
      },
      async () => {
        // Fallback para canciones
        return {
          songs: [],
          total: 0,
          message: 'Songs service temporarily unavailable - Servicio de canciones temporalmente no disponible'
        };
      }
    );
  }

  async getAvailableSongs(filters: any) {
    return this.circuitBreaker.execute(
      'songs-service',
      async () => {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${this.songsServiceUrl}/songs/available?${queryParams}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch available songs');
        }
        
        const data = await response.json();
        
        // Asegurar formato consistente
        return {
          songs: data.songs || [],
          total: data.total || 0,
          message: data.message || (data.songs?.length === 0 ? 'No hay canciones disponibles con estos filtros' : undefined)
        };
      },
      async () => {
        return {
          songs: [],
          total: 0,
          message: 'Songs service temporarily unavailable - Servicio de canciones temporalmente no disponible'
        };
      }
    );
  }

  async createSong(songData: any, userId: string) {
    return this.circuitBreaker.execute(
      'songs-service',
      async () => {
        const response = await fetch(`${this.songsServiceUrl}/songs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...songData, artistId: userId }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create song');
        }
        
        return response.json();
      }
    );
  }

  async updateSong(id: string, songData: any, userId: string) {
    return this.circuitBreaker.execute(
      'songs-service',
      async () => {
        const response = await fetch(`${this.songsServiceUrl}/songs/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...songData, artistId: userId }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update song');
        }
        
        return response.json();
      }
    );
  }

  async deleteSong(id: string, userId: string) {
    return this.circuitBreaker.execute(
      'songs-service',
      async () => {
        const response = await fetch(`${this.songsServiceUrl}/songs/${id}?userId=${userId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete song');
        }
        
        return response.json();
      }
    );
  }

  async getSong(id: string) {
    return this.circuitBreaker.execute(
      'songs-service',
      async () => {
        const response = await fetch(`${this.songsServiceUrl}/songs/${id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch song');
        }
        
        return response.json();
      },
      async () => {
        return null;
      }
    );
  }

  async purchaseSong(songId: string, purchaseData: any, userId: string) {
    return this.circuitBreaker.execute(
      'songs-service',
      async () => {
        const response = await fetch(`${this.songsServiceUrl}/songs/${songId}/purchase`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...purchaseData, buyerId: userId }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to purchase song');
        }
        
        return response.json();
      }
    );
  }

  async getPurchasedLicenses(userId: string) {
    return this.circuitBreaker.execute(
      'songs-service',
      async () => {
        const response = await fetch(`${this.songsServiceUrl}/licenses/purchased?userId=${userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch purchased licenses');
        }
        
        const data = await response.json();
        
        return {
          licenses: data.licenses || [],
          message: data.message || (data.licenses?.length === 0 ? 'No has comprado licencias aún' : undefined)
        };
      },
      async () => {
        return {
          licenses: [],
          message: 'Licenses service temporarily unavailable - Servicio de licencias temporalmente no disponible'
        };
      }
    );
  }

  async getSoldLicenses(userId: string) {
    return this.circuitBreaker.execute(
      'songs-service',
      async () => {
        const response = await fetch(`${this.songsServiceUrl}/licenses/sold?userId=${userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch sold licenses');
        }
        
        const data = await response.json();
        
        return {
          licenses: data.licenses || [],
          message: data.message || (data.licenses?.length === 0 ? 'No has vendido licencias aún' : undefined)
        };
      },
      async () => {
        return {
          licenses: [],
          message: 'Licenses service temporarily unavailable - Servicio de licencias temporalmente no disponible'
        };
      }
    );
  }

  async updateSongStatus(id: string, statusData: any, userId: string) {
    return this.circuitBreaker.execute(
      'songs-service',
      async () => {
        const response = await fetch(`${this.songsServiceUrl}/songs/${id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...statusData, artistId: userId }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to update song status');
        }
        
        return response.json();
      },
      async () => {
        return {
          message: 'Song status update service temporarily unavailable'
        };
      }
    );
  }
}
