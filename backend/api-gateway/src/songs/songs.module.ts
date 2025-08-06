import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { CircuitBreakerModule } from '../circuit-breaker/circuit-breaker.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [CircuitBreakerModule, AuthModule],
  controllers: [SongsController],
  providers: [SongsService],
  exports: [SongsService],
})
export class SongsModule {}
