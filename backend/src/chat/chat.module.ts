import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { Chat } from './chat.entity';
import { Message } from './message.entity';
import { ChatRepository } from './chat.repository';
import { MessagesRepository } from './messages.repository';
import { SongsModule } from '../songs/songs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, Message]),
    SongsModule,
  ],
  controllers: [ChatController, MessagesController],
  providers: [
    ChatService,
    MessagesService,
    ChatRepository,
    MessagesRepository,
  ],
  exports: [ChatService, MessagesService],
})
export class ChatModule {}