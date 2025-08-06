import { Controller, Get, Query } from '@nestjs/common';
import { LicensesService } from './licenses.service';

@Controller('licenses')
export class LicensesController {
  constructor(private readonly licensesService: LicensesService) {}

  @Get('purchased')
  async getPurchasedLicenses(@Query('userId') userId: string) {
    return this.licensesService.getPurchasedLicenses(parseInt(userId));
  }

  @Get('sold')
  async getSoldLicenses(@Query('userId') userId: string) {
    return this.licensesService.getSoldLicenses(parseInt(userId));
  }
}
