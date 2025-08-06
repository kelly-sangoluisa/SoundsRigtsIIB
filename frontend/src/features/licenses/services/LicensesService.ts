import { License, LicensesResponse, LicenseFilters } from '../types';
import { tokenStorage } from '@/shared/utils/tokenStorage';

const API_BASE_URL = process.env.NEXT_PUBLIC_SONGS_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

console.log('🔧 [LicensesService] Configuración:', { API_BASE_URL });

class LicensesError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'LicensesError';
  }
}

export interface PurchaseRequest {
  buyerId: number;
  buyerMessage?: string;
  offerPrice?: number;
}

export interface PurchaseResponse {
  licenseId: string;
  message: string;
  status: string;
}

export class LicensesService {
  private static getAuthHeaders(): Record<string, string> {
    const token = tokenStorage.get();
    console.log('🔑 [LicensesService] Obteniendo headers:', { hasToken: !!token });
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
    
    console.log('📤 [LicensesService] Headers finales:', Object.keys(headers));
    return headers;
  }

  private static getUserFromToken(): { userId: string } {
    const token = tokenStorage.get();
    if (!token) {
      throw new LicensesError('No se encontró token de autenticación');
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userId = payload.userId || payload.sub || payload.id;
      console.log('👤 [LicensesService] Usuario del token:', { userId, payload });
      
      return {
        userId: userId?.toString() || '1'
      };
    } catch (error) {
      console.error('❌ [LicensesService] Error al decodificar token:', error);
      throw new LicensesError('Token inválido');
    }
  }

  // Comprar una canción
  static async purchaseSong(songId: string, purchaseData?: Partial<PurchaseRequest>): Promise<PurchaseResponse> {
    console.log('💰 [LicensesService] Comprando canción:', { songId, purchaseData });
    
    try {
      const { userId } = this.getUserFromToken();
      
      const requestBody = {
        buyerId: parseInt(userId),
        buyerMessage: purchaseData?.buyerMessage || '',
        offerPrice: purchaseData?.offerPrice
      };
      
      console.log('📝 [LicensesService] Datos de compra:', requestBody);
      console.log('🔗 [LicensesService] URL:', `${API_BASE_URL}/songs/${songId}/purchase`);

      const response = await fetch(`${API_BASE_URL}/songs/${songId}/purchase`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(requestBody),
      });

      console.log('📡 [LicensesService] Respuesta recibida:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [LicensesService] Error en respuesta:', errorText);
        throw new LicensesError(errorText || 'Error al realizar la compra');
      }

      const result = await response.json();
      console.log('✅ [LicensesService] Compra exitosa:', result);
      return result;
    } catch (error) {
      console.error('❌ [LicensesService] Error en purchaseSong:', error);
      if (error instanceof LicensesError) {
        throw error;
      }
      throw new LicensesError(error instanceof Error ? error.message : 'Error de conexión');
    }
  }

  // Obtener licencias compradas por el usuario
  static async getPurchasedLicenses(filters?: LicenseFilters): Promise<LicensesResponse> {
    console.log('📋 [LicensesService] Obteniendo licencias compradas...', { filters });
    
    try {
      const { userId } = this.getUserFromToken();
      
      const queryParams = new URLSearchParams();
      queryParams.append('userId', userId);
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);

      const url = `${API_BASE_URL}/licenses/purchased?${queryParams.toString()}`;
      console.log('🔗 [LicensesService] URL de licencias compradas:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log('📡 [LicensesService] Respuesta recibida:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        throw new LicensesError('Error al obtener las licencias compradas');
      }

      const result = await response.json();
      console.log('✅ [LicensesService] Licencias compradas obtenidas:', result);
      
      // Transformar el formato del backend al formato del frontend
      return {
        licenses: result.licenses?.map((license: any) => ({
          id: license.id.toString(),
          songId: license.songId.toString(),
          songName: license.songTitle,
          songArtist: license.artistName,
          songGenre: '', // No disponible en el backend
          buyerId: userId,
          buyerName: '', // No disponible
          buyerEmail: '', // No disponible
          sellerId: '', // No disponible
          sellerName: license.artistName,
          sellerEmail: '', // No disponible
          price: license.price,
          purchaseDate: license.purchaseDate,
          status: 'active' as const, // Asumimos que están activas
          licenseType: 'commercial' as const,
          transactionId: license.id.toString()
        })) || [],
        total: result.licenses?.length || 0,
        page: 1,
        limit: 50
      };
    } catch (error) {
      console.error('❌ [LicensesService] Error en getPurchasedLicenses:', error);
      if (error instanceof LicensesError) {
        throw error;
      }
      throw new LicensesError(error instanceof Error ? error.message : 'Error de conexión');
    }
  }

  // Obtener licencias vendidas por el usuario (como artista)
  static async getSoldLicenses(filters?: LicenseFilters): Promise<LicensesResponse> {
    console.log('📋 [LicensesService] Obteniendo licencias vendidas...', { filters });
    
    try {
      const { userId } = this.getUserFromToken();
      
      const queryParams = new URLSearchParams();
      queryParams.append('userId', userId);
      if (filters?.status) queryParams.append('status', filters.status);
      if (filters?.search) queryParams.append('search', filters.search);
      if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
      if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo);

      const url = `${API_BASE_URL}/licenses/sold?${queryParams.toString()}`;
      console.log('🔗 [LicensesService] URL de licencias vendidas:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log('📡 [LicensesService] Respuesta recibida:', { status: response.status, ok: response.ok });

      if (!response.ok) {
        throw new LicensesError('Error al obtener las licencias vendidas');
      }

      const result = await response.json();
      console.log('✅ [LicensesService] Licencias vendidas obtenidas:', result);
      
      // Transformar el formato del backend al formato del frontend
      return {
        licenses: result.licenses?.map((license: any) => ({
          id: license.id.toString(),
          songId: license.songId.toString(),
          songName: license.songTitle,
          songArtist: '', // Usuario actual (vendedor)
          songGenre: '', // No disponible
          buyerId: '', // No disponible
          buyerName: license.buyerName,
          buyerEmail: '', // No disponible
          sellerId: userId,
          sellerName: '', // Usuario actual
          sellerEmail: '', // No disponible
          price: license.price,
          purchaseDate: license.saleDate,
          status: 'active' as const,
          licenseType: 'commercial' as const,
          transactionId: license.id.toString()
        })) || [],
        total: result.licenses?.length || 0,
        page: 1,
        limit: 50
      };
    } catch (error) {
      console.error('❌ [LicensesService] Error en getSoldLicenses:', error);
      if (error instanceof LicensesError) {
        throw error;
      }
      throw new LicensesError(error instanceof Error ? error.message : 'Error de conexión');
    }
  }
}
