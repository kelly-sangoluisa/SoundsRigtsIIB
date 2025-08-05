import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

class CreateMessageDto {
  content: string;
}

@Controller('chats/:chatId/messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  create(
    @Param('chatId') chatId: string,
    @Body() createMessageDto: CreateMessageDto,
    @Request() req,
  ) {
    return this.messagesService.createMessage(+chatId, req.user.userId, createMessageDto.content);
  }

  @Get()
  findAll(@Param('chatId') chatId: string, @Request() req) {
    return this.messagesService.findByChatId(+chatId, req.user.userId);
  }
}