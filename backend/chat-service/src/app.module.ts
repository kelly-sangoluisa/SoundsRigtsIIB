import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModule } from './chat/chat.module';
import { Chat } from './chat/entities/chat.entity';
import { Message } from './chat/entities/message.entity';
import { User } from './shared/entities/user.entity';
import { Song } from './shared/entities/song.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      username: process.env.DATABASE_USER || 'admin',
      password: process.env.DATABASE_PASSWORD || 'admin123',
      database: process.env.DATABASE_NAME || 'soundsrights',
      entities: [User, Song, Chat, Message],
      synchronize: false,
    }),
    ChatModule,
  ],
})
export class AppModule {}
