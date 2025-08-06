import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async findByChatId(chatId: number): Promise<Message[]> {
    return this.messageRepo.find({
      where: { chat_id: chatId },
      relations: ['sender'],
      order: { sent_at: 'ASC' }
    });
  }

  async create(messageData: Partial<Message>): Promise<Message> {
    const message = this.messageRepo.create(messageData);
    return this.messageRepo.save(message);
  }
}
