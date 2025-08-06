import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { SongRepository } from './repositories/song.repository';
import { Song } from './entities/song.entity';
import { LicensesModule } from '../licenses/licenses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Song]),
    LicensesModule
  ],
  controllers: [SongsController],
  providers: [SongsService, SongRepository],
  exports: [SongsService],
})
export class SongsModule {}
