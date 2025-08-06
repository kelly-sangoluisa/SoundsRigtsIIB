export interface ChatUser {
  id: string;
  name: string;
  email: string;
  role: 'artist' | 'buyer';
  avatar?: string;
}

export interface Chat {
  id: string;
  songId: string;
  songTitle: string;
  songArtist: string;
  participants: ChatUser[];
  lastMessage?: ChatMessage;
  lastActivity: string;
  isActive: boolean;
  unreadCount: number;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderRole: 'artist' | 'buyer';
  content: string;
  timestamp: string;
  isRead: boolean;
  type: 'text' | 'system';
}

export interface CreateMessageRequest {
  content: string;
}

export interface CreateMessageResponse {
  message: ChatMessage;
  success: boolean;
}

export interface CreateChatRequest {
  songId: string;
  buyerId: string;
  artistId: string;
}

export interface CreateChatResponse {
  chat: Chat;
  success: boolean;
}

export interface ChatListResponse {
  chats: Chat[];
  total: number;
  success: boolean;
}

export interface ChatMessagesResponse {
  messages: ChatMessage[];
  total: number;
  success: boolean;
}

export interface ChatFilters {
  search?: string;
  songId?: string;
  status?: 'active' | 'inactive' | 'all';
  sortBy?: 'recent' | 'oldest' | 'activity';
}
