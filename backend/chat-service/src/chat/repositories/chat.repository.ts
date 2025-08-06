import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../entities/chat.entity';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepo: Repository<Chat>,
  ) {}

  async findByUser(userId: number): Promise<Chat[]> {
    return this.chatRepo.find({
      where: [
        { buyer_id: userId },
        { artist_id: userId }
      ],
      relations: ['song', 'buyer', 'artist', 'messages'],
      order: { created_at: 'DESC' }
    });
  }

  async findById(id: number): Promise<Chat | null> {
    return this.chatRepo.findOne({
      where: { id },
      relations: ['song', 'buyer', 'artist', 'messages', 'messages.sender']
    });
  }

  async create(chatData: Partial<Chat>): Promise<Chat> {
    const chat = this.chatRepo.create(chatData);
    return this.chatRepo.save(chat);
  }

  async findBySongAndUsers(songId: number, buyerId: number, artistId: number): Promise<Chat | null> {
    return this.chatRepo.findOne({
      where: {
        song_id: songId,
        buyer_id: buyerId,
        artist_id: artistId
      },
      relations: ['song', 'buyer', 'artist']
    });
  }
}
