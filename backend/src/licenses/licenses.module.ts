import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LicensesController } from './licenses.controller';
import { LicensesService } from './licenses.service';
import { License } from './licenses.entity';
import { LicensesRepository } from './licenses.repository';
import { SongsModule } from '../songs/songs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([License]),
    SongsModule,
  ],
  controllers: [LicensesController],
  providers: [LicensesService, LicensesRepository],
  exports: [LicensesService],
})
export class LicensesModule {}