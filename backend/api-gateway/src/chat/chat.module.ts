import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { CircuitBreakerModule } from '../circuit-breaker/circuit-breaker.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [CircuitBreakerModule, AuthModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
