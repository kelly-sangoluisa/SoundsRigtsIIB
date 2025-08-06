export interface Song {
  id: string;
  name: string;
  artist: string;
  genre: SongGenre;
  duration: number; // en segundos
  price: number;
  status: SongStatus;
  url: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  artistId: string;
}

export type SongGenre = 'rock' | 'pop' | 'jazz' | 'classical' | 'electronic' | 'hip-hop' | 'reggae' | 'country' | 'blues' | 'folk';

export type SongStatus = 'draft' | 'published' | 'under_review' | 'rejected' | 'sold' | 'reserved' | 'for_sale';

export interface CreateSongRequest {
  name: string;
  genre: SongGenre;
  duration: number;
  price: number;
  url: string;
}

export interface UpdateSongRequest extends Partial<CreateSongRequest> {
  status?: SongStatus;
}

export interface SongsResponse {
  songs: Song[];
  total: number;
  page: number;
  limit: number;
}

export interface SongFilters {
  genre?: SongGenre | '';
  status?: SongStatus | '';
  search?: string;
}

export interface ReservationInfo {
  id: string;
  songId: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  reservedAt: string;
  expiresAt: string;
  offerPrice?: number;
  message?: string;
}

export interface AcceptSaleRequest {
  reservationId: string;
  finalPrice?: number;
}

export interface RejectSaleRequest {
  reservationId: string;
  reason?: string;
}
