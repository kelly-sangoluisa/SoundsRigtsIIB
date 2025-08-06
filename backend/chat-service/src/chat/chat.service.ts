import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ChatRepository } from './repositories/chat.repository';
import { MessageRepository } from './repositories/message.repository';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly messageRepository: MessageRepository,
  ) {}

  async getChats(userId: number) {
    const chats = await this.chatRepository.findByUser(userId);
    return {
      chats: chats.map(chat => ({
        id: chat.id,
        songId: chat.song_id,
        songTitle: chat.song?.title,
        buyerId: chat.buyer_id,
        buyerName: chat.buyer?.username,
        artistId: chat.artist_id,
        artistName: chat.artist?.username,
        lastMessage: chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].content : null,
        lastMessageDate: chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].sent_at : chat.created_at,
        createdAt: chat.created_at
      }))
    };
  }

  async createChat(chatData: { songId: number; buyerId: number; artistId: number; userId: number }) {
    // Verificar si ya existe un chat para esta canción entre estos usuarios
    const existingChat = await this.chatRepository.findBySongAndUsers(
      chatData.songId,
      chatData.buyerId,
      chatData.artistId
    );

    if (existingChat) {
      return {
        id: existingChat.id,
        message: 'Chat already exists'
      };
    }

    const chat = await this.chatRepository.create({
      song_id: chatData.songId,
      buyer_id: chatData.buyerId,
      artist_id: chatData.artistId
    });

    return {
      id: chat.id,
      message: 'Chat created successfully'
    };
  }

  async getChat(chatId: number, userId: number) {
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    // Verificar que el usuario sea parte del chat
    if (chat.buyer_id !== userId && chat.artist_id !== userId) {
      throw new ForbiddenException('You are not part of this chat');
    }

    return {
      id: chat.id,
      songId: chat.song_id,
      songTitle: chat.song?.title,
      buyerId: chat.buyer_id,
      buyerName: chat.buyer?.username,
      artistId: chat.artist_id,
      artistName: chat.artist?.username,
      createdAt: chat.created_at
    };
  }

  async getChatMessages(chatId: number, userId: number) {
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    // Verificar que el usuario sea parte del chat
    if (chat.buyer_id !== userId && chat.artist_id !== userId) {
      throw new ForbiddenException('You are not part of this chat');
    }

    const messages = await this.messageRepository.findByChatId(chatId);
    return {
      messages: messages.map(message => ({
        id: message.id,
        content: message.content,
        senderId: message.sender_id,
        senderName: message.sender?.username,
        sentAt: message.sent_at
      }))
    };
  }

  async sendMessage(chatId: number, messageData: { content: string; senderId: number }) {
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    // Verificar que el usuario sea parte del chat
    if (chat.buyer_id !== messageData.senderId && chat.artist_id !== messageData.senderId) {
      throw new ForbiddenException('You are not part of this chat');
    }

    const message = await this.messageRepository.create({
      chat_id: chatId,
      sender_id: messageData.senderId,
      content: messageData.content
    });

    return {
      id: message.id,
      content: message.content,
      senderId: message.sender_id,
      sentAt: message.sent_at,
      message: 'Message sent successfully'
    };
  }
}
