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
        
        return response.json();
      },
      async () => {
        // Fallback para canciones
        return {
          songs: [],
          total: 0,
          message: 'Songs service temporarily unavailable'
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
        
        return response.json();
      },
      async () => {
        return {
          songs: [],
          total: 0,
          message: 'Songs service temporarily unavailable'
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
        
        return response.json();
      },
      async () => {
        return {
          licenses: [],
          message: 'Licenses service temporarily unavailable'
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
        
        return response.json();
      },
      async () => {
        return {
          licenses: [],
          message: 'Licenses service temporarily unavailable'
        };
      }
    );
  }
}
