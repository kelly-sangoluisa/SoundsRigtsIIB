import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener mis chats' })
  @ApiResponse({ status: 200, description: 'Lista de chats del usuario' })
  async getChats(@Request() req) {
    return this.chatService.getChats(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear nuevo chat' })
  @ApiResponse({ status: 201, description: 'Chat creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createChat(@Body() chatData: any, @Request() req) {
    return this.chatService.createChat(chatData, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener chat por ID' })
  @ApiParam({ name: 'id', description: 'ID del chat' })
  @ApiResponse({ status: 200, description: 'Detalles del chat' })
  @ApiResponse({ status: 404, description: 'Chat no encontrado' })
  async getChat(@Param('id') id: string, @Request() req) {
    return this.chatService.getChat(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/messages')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener mensajes del chat' })
  @ApiParam({ name: 'id', description: 'ID del chat' })
  @ApiResponse({ status: 200, description: 'Lista de mensajes del chat' })
  @ApiResponse({ status: 404, description: 'Chat no encontrado' })
  async getChatMessages(@Param('id') id: string, @Request() req) {
    return this.chatService.getChatMessages(id, req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/messages')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Enviar mensaje al chat' })
  @ApiParam({ name: 'id', description: 'ID del chat' })
  @ApiResponse({ status: 201, description: 'Mensaje enviado exitosamente' })
  @ApiResponse({ status: 404, description: 'Chat no encontrado' })
  async sendMessage(@Param('id') id: string, @Body() messageData: any, @Request() req) {
    return this.chatService.sendMessage(id, messageData, req.user.userId);
  }
}
