import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { Song } from './songs.entity';
import { SongsRepository } from './songs.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Song])],
  controllers: [SongsController],
  providers: [SongsService, SongsRepository],
  exports: [SongsService],
})
export class SongsModule {}