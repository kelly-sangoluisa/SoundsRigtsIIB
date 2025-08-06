import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SongsModule } from './songs/songs.module';
import { ChatModule } from './chat/chat.module';
import { CircuitBreakerModule } from './circuit-breaker/circuit-breaker.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    SongsModule,
    ChatModule,
    CircuitBreakerModule,
  ],
})
export class AppModule {}
