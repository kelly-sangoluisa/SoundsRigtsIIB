import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, Query } from '@nestjs/common';
import { SongsService } from './songs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SongStatus } from './songs.entity';

class CreateSongDto {
  title: string;
  genre?: string;
  price: number;
}

class UpdateSongDto {
  title?: string;
  genre?: string;
  price?: number;
}

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get()
  findAll(@Query('status') status?: SongStatus) {
    if (status === SongStatus.FOR_SALE) {
      return this.songsService.findAvailable();
    }
    return this.songsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.songsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('artist/my-songs')
  findMySongs(@Request() req) {
    return this.songsService.findByArtist(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSongDto: CreateSongDto, @Request() req) {
    return this.songsService.create(createSongDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateSongDto: UpdateSongDto, @Request() req) {
    return this.songsService.update(+id, updateSongDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.songsService.remove(+id, req.user.userId);
  }
}