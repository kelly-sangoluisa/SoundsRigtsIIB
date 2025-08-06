import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LicensesController } from './licenses.controller';
import { LicensesService } from './licenses.service';
import { LicenseRepository } from './repositories/license.repository';
import { License } from './entities/license.entity';

@Module({
  imports: [TypeOrmModule.forFeature([License])],
  controllers: [LicensesController],
  providers: [LicensesService, LicenseRepository],
  exports: [LicensesService],
})
export class LicensesModule {}
