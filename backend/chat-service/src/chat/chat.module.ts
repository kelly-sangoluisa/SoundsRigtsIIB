import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatRepository } from './repositories/chat.repository';
import { MessageRepository } from './repositories/message.repository';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message])],
  controllers: [ChatController],
  providers: [ChatService, ChatRepository, MessageRepository],
  exports: [ChatService],
})
export class ChatModule {}
