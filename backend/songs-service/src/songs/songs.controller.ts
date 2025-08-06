import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { UpdateSongDto } from './dto/update-song.dto';
import { RequestSongDto, AcceptSongRequestDto, RejectSongRequestDto } from './dto/purchase-song.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createSongDto: CreateSongDto) {
    return this.songsService.create(createSongDto);
  }

  @Get()
  findAll() {
    return this.songsService.findAll();
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.songsService.searchSongs(query);
  }

  @Get('genre/:genre')
  findByGenre(@Param('genre') genre: string) {
    return this.songsService.findByGenre(genre);
  }

  @Get('owner/:ownerId')
  @UseGuards(JwtAuthGuard)
  findByOwner(@Param('ownerId') ownerId: string) {
    return this.songsService.findByOwner(ownerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.songsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateSongDto: UpdateSongDto) {
    return this.songsService.update(id, updateSongDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.songsService.remove(id);
  }

  @Post(':id/play')
  incrementPlayCount(@Param('id') id: string) {
    return this.songsService.incrementPlayCount(id);
  }

  // Nuevos endpoints para compras
  @Post('request')
  @UseGuards(JwtAuthGuard)
  requestSong(@Body() requestSongDto: RequestSongDto) {
    return this.songsService.requestSong(requestSongDto);
  }

  @Post('accept-request')
  @UseGuards(JwtAuthGuard)
  acceptSongRequest(@Body() acceptSongRequestDto: AcceptSongRequestDto) {
    return this.songsService.acceptSongRequest(acceptSongRequestDto);
  }

  @Post('reject-request')
  @UseGuards(JwtAuthGuard)
  rejectSongRequest(@Body() rejectSongRequestDto: RejectSongRequestDto) {
    return this.songsService.rejectSongRequest(rejectSongRequestDto);
  }

  @Get('requests/:ownerId')
  @UseGuards(JwtAuthGuard)
  getRequestedSongs(@Param('ownerId') ownerId: string) {
    return this.songsService.getRequestedSongs(ownerId);
  }

  @Get('purchased/:userId')
  @UseGuards(JwtAuthGuard)
  getPurchasedSongs(@Param('userId') userId: string) {
    return this.songsService.getPurchasedSongs(userId);
  }
}
