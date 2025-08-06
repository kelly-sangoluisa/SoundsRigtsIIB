export interface Chat {
  id: number;
  songId: number;
  buyerId: number;
  artistId: number;
  createdAt: Date;
  song?: {
    id: number;
    title: string;
  };
  buyer?: {
    id: number;
    username: string;
  };
  artist?: {
    id: number;
    username: string;
  };
  lastMessage?: Message;
}

export interface Message {
  id: number;
  chatId: number;
  senderId: number;
  content: string;
  sentAt: Date;
  sender?: {
    id: number;
    username: string;
  };
}
