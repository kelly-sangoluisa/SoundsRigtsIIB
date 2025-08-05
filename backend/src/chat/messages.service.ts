import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';
import { ChatService } from './chat.service';
import { Message } from './message.entity';

@Injectable()
export class MessagesService {
  constructor(
    private messagesRepository: MessagesRepository,
    private chatService: ChatService,
  ) {}

  async createMessage(chatId: number, senderId: number, content: string): Promise<Message> {
    // Verificar que el usuario tiene acceso al chat
    await this.chatService.validateUserAccess(chatId, senderId);

    return this.messagesRepository.createMessage({
      chatId,
      senderId,
      content,
    });
  }

  async findByChatId(chatId: number, userId: number): Promise<Message[]> {
    // Verificar que el usuario tiene acceso al chat
    await this.chatService.validateUserAccess(chatId, userId);

    return this.messagesRepository.findByChatId(chatId);
  }

  async findOne(id: number): Promise<Message> {
    const message = await this.messagesRepository.findOne({
      where: { id },
      relations: ['sender', 'chat'],
    });
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }
}