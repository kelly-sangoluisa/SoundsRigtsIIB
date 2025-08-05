export interface License {
  id: string;
  songId: string;
  songName: string;
  songArtist: string;
  songGenre: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  sellerId: string;
  sellerName: string;
  sellerEmail: string;
  price: number;
  purchaseDate: string;
  status: LicenseStatus;
  licenseType: 'commercial' | 'personal';
  downloadUrl?: string;
  transactionId: string;
}

export type LicenseStatus = 
  | 'pending'     // Pendiente de confirmación
  | 'active'      // Licencia activa
  | 'expired'     // Licencia expirada
  | 'cancelled'   // Licencia cancelada
  | 'refunded';   // Licencia reembolsada

export interface LicensesResponse {
  licenses: License[];
  total: number;
  page: number;
  limit: number;
}

export interface LicenseFilters {
  status?: LicenseStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
