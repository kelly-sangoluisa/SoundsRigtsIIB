import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, Query } from '@nestjs/common';
import { SongsService } from './songs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SongStatus } from './songs.entity';
import { Public } from '../auth/public.decorator';
import { IsString, IsNumber, IsOptional, IsPositive } from 'class-validator';

class CreateSongDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  tags?: string;
}

class UpdateSongDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsNumber()
  duration?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  tags?: string;
}

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Public()
  @Get()
  findAll(@Query('status') status?: SongStatus) {
    if (status === SongStatus.FOR_SALE) {
      return this.songsService.findAvailable();
    }
    return this.songsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.songsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('artist/my-songs')
  findMySongs(@Request() req) {
    return this.songsService.findByArtist(req.user.userId);
  }

  @Public()
  @Post()
  create(@Body() createSongDto: CreateSongDto, @Request() req) {
    // Para testing - usando user ID 1 como default
    const userId = req?.user?.userId || 1;
    return this.songsService.create(createSongDto, userId);
  }

  @Public()
  @Put(':id')
  update(@Param('id') id: string, @Body() updateSongDto: UpdateSongDto, @Request() req) {
    const userId = req?.user?.userId || 1;
    return this.songsService.update(+id, updateSongDto, userId);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    const userId = req?.user?.userId || 1;
    return this.songsService.remove(+id, userId);
  }
}