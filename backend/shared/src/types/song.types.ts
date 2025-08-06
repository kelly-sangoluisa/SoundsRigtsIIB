export interface Song {
  id: number;
  title: string;
  artistId: number;
  genre: string;
  price: number;
  status: SongStatus;
  createdAt: Date;
  updatedAt: Date;
  artist?: {
    id: number;
    username: string;
    email: string;
  };
}

export enum SongStatus {
  FOR_SALE = 'for_sale',
  PENDING = 'pending',
  SOLD = 'sold'
}

export interface SongFilters {
  genre?: string;
  status?: SongStatus;
  artistId?: number;
  minPrice?: number;
  maxPrice?: number;
}
