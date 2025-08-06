export interface License {
  id: number;
  songId: number;
  buyerId: number;
  sellerId: number;
  createdAt: Date;
  song?: {
    id: number;
    title: string;
    genre: string;
    price: number;
  };
  buyer?: {
    id: number;
    username: string;
    email: string;
  };
  seller?: {
    id: number;
    username: string;
    email: string;
  };
}
