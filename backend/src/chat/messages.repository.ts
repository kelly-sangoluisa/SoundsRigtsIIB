import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessagesRepository extends Repository<Message> {
  constructor(private dataSource: DataSource) {
    super(Message, dataSource.createEntityManager());
  }

  async findByChatId(chatId: number): Promise<Message[]> {
    return this.find({
      where: { chatId },
      relations: ['sender'],
      order: {
        sentAt: 'ASC',
      },
    });
  }

  async createMessage(messageData: Partial<Message>): Promise<Message> {
    const message = this.create(messageData);
    return this.save(message);
  }

  async getLastMessage(chatId: number): Promise<Message | null> {
    return this.findOne({
      where: { chatId },
      order: { sentAt: 'DESC' },
      relations: ['sender'],
    });
  }
}