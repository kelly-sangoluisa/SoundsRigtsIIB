import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { SongsService } from '../songs/songs.service';
import { Chat } from './chat.entity';

@Injectable()
export class ChatService {
  constructor(
    private chatRepository: ChatRepository,
    private songsService: SongsService,
  ) {}

  async createChat(songId: number, buyerId: number): Promise<Chat> {
    // Verificar que la canción existe
    const song = await this.songsService.findOne(songId);
    
    if (song.artistId === buyerId) {
      throw new ForbiddenException('You cannot create a chat with yourself');
    }

    // Verificar si ya existe un chat para esta canción y comprador
    const existingChat = await this.chatRepository.findBySongAndBuyer(songId, buyerId);
    if (existingChat) {
      return existingChat;
    }

    // Crear nuevo chat
    return this.chatRepository.createChat({
      songId,
      buyerId,
      artistId: song.artistId,
    });
  }

  async findAll(): Promise<Chat[]> {
    return this.chatRepository.find({
      relations: ['song', 'buyer', 'artist'],
    });
  }

  async findOne(id: number): Promise<Chat> {
    const chat = await this.chatRepository.findOne({
      where: { id },
      relations: ['song', 'buyer', 'artist', 'messages', 'messages.sender'],
    });
    if (!chat) {
      throw new NotFoundException(`Chat with ID ${id} not found`);
    }
    return chat;
  }

  async findUserChats(userId: number): Promise<Chat[]> {
    return this.chatRepository.findByUser(userId);
  }

  async validateUserAccess(chatId: number, userId: number): Promise<Chat> {
    const chat = await this.findOne(chatId);
    if (chat.buyerId !== userId && chat.artistId !== userId) {
      throw new ForbiddenException('You do not have access to this chat');
    }
    return chat;
  }
}