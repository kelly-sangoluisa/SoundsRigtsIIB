import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SongsService } from './songs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Songs')
@Controller('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('mine')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener mis canciones' })
  @ApiResponse({ status: 200, description: 'Lista de canciones del usuario' })
  async getMySongs(@Request() req) {
    return this.songsService.getMySongs(req.user.userId);
  }

  @Get('available')
  @ApiOperation({ summary: 'Obtener canciones disponibles para compra' })
  @ApiQuery({ name: 'genre', required: false, description: 'Filtrar por género' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Precio máximo' })
  @ApiQuery({ name: 'search', required: false, description: 'Buscar por título o artista' })
  @ApiResponse({ status: 200, description: 'Lista de canciones disponibles' })
  async getAvailableSongs(@Query() filters: any) {
    return this.songsService.getAvailableSongs(filters);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nueva canción' })
  @ApiResponse({ status: 201, description: 'Canción creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createSong(@Body() songData: any, @Request() req) {
    return this.songsService.createSong(songData, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar canción' })
  @ApiParam({ name: 'id', description: 'ID de la canción' })
  @ApiResponse({ status: 200, description: 'Canción actualizada exitosamente' })
  @ApiResponse({ status: 404, description: 'Canción no encontrada' })
  async updateSong(@Param('id') id: string, @Body() songData: any, @Request() req) {
    return this.songsService.updateSong(id, songData, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar canción' })
  @ApiParam({ name: 'id', description: 'ID de la canción' })
  @ApiResponse({ status: 200, description: 'Canción eliminada exitosamente' })
  @ApiResponse({ status: 404, description: 'Canción no encontrada' })
  async deleteSong(@Param('id') id: string, @Request() req) {
    return this.songsService.deleteSong(id, req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener canción por ID' })
  @ApiParam({ name: 'id', description: 'ID de la canción' })
  @ApiResponse({ status: 200, description: 'Detalles de la canción' })
  @ApiResponse({ status: 404, description: 'Canción no encontrada' })
  async getSong(@Param('id') id: string) {
    return this.songsService.getSong(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/purchase')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Comprar canción' })
  @ApiParam({ name: 'id', description: 'ID de la canción' })
  @ApiResponse({ status: 200, description: 'Compra iniciada exitosamente' })
  @ApiResponse({ status: 404, description: 'Canción no encontrada' })
  async purchaseSong(@Param('id') id: string, @Body() purchaseData: any, @Request() req) {
    return this.songsService.purchaseSong(id, purchaseData, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('licenses/purchased')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener licencias compradas' })
  @ApiResponse({ status: 200, description: 'Lista de licencias compradas' })
  async getPurchasedLicenses(@Request() req) {
    return this.songsService.getPurchasedLicenses(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('licenses/sold')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener licencias vendidas' })
  @ApiResponse({ status: 200, description: 'Lista de licencias vendidas' })
  async getSoldLicenses(@Request() req) {
    return this.songsService.getSoldLicenses(req.user.userId);
  }
}
