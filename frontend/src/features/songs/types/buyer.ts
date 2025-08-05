export interface AvailableSong {
  id: string;
  name: string;
  artist: string;
  artistId: string;
  genre: string;
  duration: number;
  price: number;
  description?: string;
  createdAt: string;
  audioUrl?: string;
  coverUrl?: string;
  status: 'published' | 'for_sale';
}

export interface PurchaseRequest {
  songId: string;
  buyerMessage?: string;
  offerPrice?: number;
}

export interface PurchaseResponse {
  licenseId: string;
  reservationId: string;
  expiresAt: string;
  message: string;
}

export interface SongFilters {
  genre?: string;
  maxPrice?: number;
  artist?: string;
  search?: string;
}
