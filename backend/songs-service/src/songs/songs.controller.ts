import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { SongsService } from './songs.service';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get('mine')
  async getMySongs(@Query('userId') userId: string) {
    return this.songsService.getMySongs(parseInt(userId));
  }

  @Get('available')
  async getAvailableSongs(@Query() filters: any) {
    return this.songsService.getAvailableSongs(filters);
  }

  @Post()
  async createSong(@Body() songData: any) {
    return this.songsService.createSong(songData);
  }

  @Put(':id')
  async updateSong(@Param('id') id: string, @Body() songData: any) {
    return this.songsService.updateSong(parseInt(id), songData);
  }

  @Delete(':id')
  async deleteSong(@Param('id') id: string, @Query('userId') userId: string) {
    return this.songsService.deleteSong(parseInt(id), parseInt(userId));
  }

  @Get(':id')
  async getSong(@Param('id') id: string) {
    return this.songsService.getSong(parseInt(id));
  }

  @Post(':id/purchase')
  async purchaseSong(@Param('id') id: string, @Body() purchaseData: any) {
    return this.songsService.purchaseSong(parseInt(id), purchaseData);
  }
}
