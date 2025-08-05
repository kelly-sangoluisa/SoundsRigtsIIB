import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Chat } from './chat.entity';

@Injectable()
export class ChatRepository extends Repository<Chat> {
  constructor(private dataSource: DataSource) {
    super(Chat, dataSource.createEntityManager());
  }

  async findByUser(userId: number): Promise<Chat[]> {
    return this.find({
      where: [
        { buyerId: userId },
        { artistId: userId },
      ],
      relations: ['song', 'buyer', 'artist', 'messages'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findBySongAndBuyer(songId: number, buyerId: number): Promise<Chat | null> {
    return this.findOne({
      where: { songId, buyerId },
      relations: ['song', 'buyer', 'artist', 'messages'],
    });
  }

  async createChat(chatData: Partial<Chat>): Promise<Chat> {
    const chat = this.create(chatData);
    return this.save(chat);
  }
}