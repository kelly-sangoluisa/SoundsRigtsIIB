import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessage, CreateMessageRequest } from '../types';
import { chatApi } from '../api/chatApi';

export const useChatMessages = (chatId: string, userId: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await chatApi.getChatMessages(chatId);
      setMessages(response.messages);
      setTotal(response.total);
      
      // Marcar mensajes como leídos
      await chatApi.markAsRead(chatId, userId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los mensajes');
    } finally {
      setIsLoading(false);
    }
  }, [chatId, userId]);

  useEffect(() => {
    if (chatId && userId) {
      fetchMessages();
    }
  }, [fetchMessages, chatId, userId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    try {
      setIsSending(true);
      setError(null);
      
      const request: CreateMessageRequest = { content: content.trim() };
      const response = await chatApi.sendMessage(chatId, userId, request);
      
      // Añadir mensaje localmente
      setMessages(prev => [...prev, response.message]);
      setTotal(prev => prev + 1);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el mensaje');
    } finally {
      setIsSending(false);
    }
  }, [chatId, userId]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const refreshMessages = useCallback(() => {
    fetchMessages();
  }, [fetchMessages]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    isSending,
    error,
    total,
    sendMessage,
    refreshMessages,
    clearError,
    messagesEndRef,
    scrollToBottom
  };
};
