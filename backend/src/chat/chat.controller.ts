import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/public.decorator';
import { IsNumber } from 'class-validator';

class CreateChatDto {
  @IsNumber()
  songId: number;
}

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Public()
  @Post()
  create(@Body() createChatDto: CreateChatDto, @Request() req) {
    const userId = req?.user?.userId || 2; // Usuario 2 como buyer default
    return this.chatService.createChat(createChatDto.songId, userId);
  }

  @Public()
  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Public()
  @Get('my-chats')
  findMyChats(@Request() req) {
    const userId = req?.user?.userId || 2;
    return this.chatService.findUserChats(userId);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    const userId = req?.user?.userId || 2;
    return this.chatService.findOne(+id);
  }
}