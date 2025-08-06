import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getChats(@Query('userId') userId: string) {
    return this.chatService.getChats(parseInt(userId));
  }

  @Post()
  async createChat(@Body() chatData: any) {
    return this.chatService.createChat(chatData);
  }

  @Get(':id')
  async getChat(@Param('id') id: string, @Query('userId') userId: string) {
    return this.chatService.getChat(parseInt(id), parseInt(userId));
  }

  @Get(':id/messages')
  async getChatMessages(@Param('id') id: string, @Query('userId') userId: string) {
    return this.chatService.getChatMessages(parseInt(id), parseInt(userId));
  }

  @Post(':id/messages')
  async sendMessage(@Param('id') id: string, @Body() messageData: any) {
    return this.chatService.sendMessage(parseInt(id), messageData);
  }
}
