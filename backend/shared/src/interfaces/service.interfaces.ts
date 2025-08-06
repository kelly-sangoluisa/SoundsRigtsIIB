import { ApiResponse } from '../types/common.types';
import { User } from '../types/user.types';
import { Song } from '../types/song.types';
import { License } from '../types/license.types';
import { Chat, Message } from '../types/chat.types';

export interface IAuthService {
  login(email: string, password: string): Promise<ApiResponse<{ token: string; user: User }>>;
  register(username: string, email: string, password: string): Promise<ApiResponse<User>>;
  validateToken(token: string): Promise<ApiResponse<User>>;
  getProfile(userId: number): Promise<ApiResponse<User>>;
}

export interface ISongsService {
  create(songData: Partial<Song>, artistId: number): Promise<ApiResponse<Song>>;
  findAll(filters?: any): Promise<ApiResponse<Song[]>>;
  findByArtist(artistId: number): Promise<ApiResponse<Song[]>>;
  findById(id: number): Promise<ApiResponse<Song>>;
  update(id: number, songData: Partial<Song>, artistId: number): Promise<ApiResponse<Song>>;
  delete(id: number, artistId: number): Promise<ApiResponse<void>>;
  updateStatus(id: number, status: string): Promise<ApiResponse<Song>>;
}

export interface ILicensesService {
  create(licenseData: Partial<License>): Promise<ApiResponse<License>>;
  findByBuyer(buyerId: number): Promise<ApiResponse<License[]>>;
  findBySeller(sellerId: number): Promise<ApiResponse<License[]>>;
  findById(id: number): Promise<ApiResponse<License>>;
}

export interface IChatService {
  createChat(chatData: Partial<Chat>): Promise<ApiResponse<Chat>>;
  findByUser(userId: number): Promise<ApiResponse<Chat[]>>;
  findById(id: number): Promise<ApiResponse<Chat>>;
  createMessage(chatId: number, messageData: Partial<Message>): Promise<ApiResponse<Message>>;
  getMessages(chatId: number): Promise<ApiResponse<Message[]>>;
}
