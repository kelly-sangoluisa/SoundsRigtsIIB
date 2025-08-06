import { Injectable } from '@nestjs/common';
import { CircuitBreakerService } from '../circuit-breaker/circuit-breaker.service';

@Injectable()
export class ChatService {
  constructor(private readonly circuitBreaker: CircuitBreakerService) {}

  private readonly chatServiceUrl = `http://${process.env.CHAT_SERVICE_HOST || 'localhost'}:${process.env.CHAT_SERVICE_PORT || 3003}`;

  async getChats(userId: string) {
    return this.circuitBreaker.execute(
      'chat-service',
      async () => {
        const response = await fetch(`${this.chatServiceUrl}/chat?userId=${userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch chats');
        }
        
        return response.json();
      },
      async () => {
        // Fallback para chats - servicio independiente
        return {
          chats: [],
          message: 'Chat service is temporarily unavailable. Your other features remain accessible.'
        };
      }
    );
  }

  async createChat(chatData: any, userId: string) {
    return this.circuitBreaker.execute(
      'chat-service',
      async () => {
        const response = await fetch(`${this.chatServiceUrl}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...chatData, userId }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create chat');
        }
        
        return response.json();
      },
      async () => {
        throw new Error('Chat service is temporarily unavailable. Please try again later.');
      }
    );
  }

  async getChat(chatId: string, userId: string) {
    return this.circuitBreaker.execute(
      'chat-service',
      async () => {
        const response = await fetch(`${this.chatServiceUrl}/chat/${chatId}?userId=${userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch chat');
        }
        
        return response.json();
      },
      async () => {
        return null;
      }
    );
  }

  async getChatMessages(chatId: string, userId: string) {
    return this.circuitBreaker.execute(
      'chat-service',
      async () => {
        const response = await fetch(`${this.chatServiceUrl}/chat/${chatId}/messages?userId=${userId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        
        return response.json();
      },
      async () => {
        return {
          messages: [],
          message: 'Chat service temporarily unavailable'
        };
      }
    );
  }

  async sendMessage(chatId: string, messageData: any, userId: string) {
    return this.circuitBreaker.execute(
      'chat-service',
      async () => {
        const response = await fetch(`${this.chatServiceUrl}/chat/${chatId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...messageData, senderId: userId }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to send message');
        }
        
        return response.json();
      },
      async () => {
        throw new Error('Chat service is temporarily unavailable. Your message could not be sent.');
      }
    );
  }
}
