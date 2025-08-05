import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Public } from '../auth/public.decorator';
import { IsString } from 'class-validator';

class CreateMessageDto {
  @IsString()
  content: string;
}

@Controller('chats/:chatId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Public()
  @Post()
  create(
    @Param('chatId') chatId: string,
    @Body() createMessageDto: CreateMessageDto,
    @Request() req,
  ) {
    const userId = req?.user?.userId || 2;
    return this.messagesService.createMessage(+chatId, userId, createMessageDto.content);
  }

  @Public()
  @Get()
  findAll(@Param('chatId') chatId: string, @Request() req) {
    const userId = req?.user?.userId || 2;
    return this.messagesService.findByChatId(+chatId, userId);
  }
}