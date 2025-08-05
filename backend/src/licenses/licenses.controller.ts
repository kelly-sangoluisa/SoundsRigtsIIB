import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { LicensesService } from './licenses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class PurchaseLicenseDto {
  songId: number;
}

@Controller('licenses')
@UseGuards(JwtAuthGuard)
export class LicensesController {
  constructor(private readonly licensesService: LicensesService) {}

  @Post('purchase')
  purchase(@Body() purchaseDto: PurchaseLicenseDto, @Request() req) {
    return this.licensesService.purchaseLicense(purchaseDto.songId, req.user.userId);
  }

  @Get()
  findAll() {
    return this.licensesService.findAll();
  }

  @Get('my-purchases')
  findMyPurchases(@Request() req) {
    return this.licensesService.findUserPurchases(req.user.userId);
  }

  @Get('my-sales')
  findMySales(@Request() req) {
    return this.licensesService.findUserSales(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.licensesService.findOne(+id);
  }

  @Get('song/:songId')
  findBySong(@Param('songId') songId: string) {
    return this.licensesService.findBySong(+songId);
  }

  @Get('check-ownership/:songId')
  checkOwnership(@Param('songId') songId: string, @Request() req) {
    return this.licensesService.checkOwnership(req.user.userId, +songId);
  }
}