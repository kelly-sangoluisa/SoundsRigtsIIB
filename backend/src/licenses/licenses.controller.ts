import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { LicensesService } from './licenses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/public.decorator';
import { IsNumber } from 'class-validator';

class PurchaseLicenseDto {
  @IsNumber()
  songId: number;
}

@Controller('licenses')
export class LicensesController {
  constructor(private readonly licensesService: LicensesService) {}

  @Public()
  @Post('purchase')
  purchase(@Body() purchaseDto: PurchaseLicenseDto, @Request() req) {
    const userId = req?.user?.userId || 2; // User 2 como comprador default
    return this.licensesService.purchaseLicense(purchaseDto.songId, userId);
  }

  @Public()
  @Get()
  findAll() {
    return this.licensesService.findAll();
  }

  @Public()
  @Get('my-purchases')
  findMyPurchases(@Request() req) {
    const userId = req?.user?.userId || 2;
    return this.licensesService.findUserPurchases(userId);
  }

  @Public()
  @Get('my-sales')
  findMySales(@Request() req) {
    const userId = req?.user?.userId || 1;
    return this.licensesService.findUserSales(userId);
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