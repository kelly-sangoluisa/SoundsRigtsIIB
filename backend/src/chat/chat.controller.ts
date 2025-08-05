import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class CreateChatDto {
  songId: number;
}

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Body() createChatDto: CreateChatDto, @Request() req) {
    return this.chatService.createChat(createChatDto.songId, req.user.userId);
  }

  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Get('my-chats')
  findMyChats(@Request() req) {
    return this.chatService.findUserChats(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.chatService.validateUserAccess(+id, req.user.userId);
  }
}