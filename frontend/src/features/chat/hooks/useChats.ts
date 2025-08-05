import { useState, useEffect, useCallback } from 'react';
import { Chat, ChatFilters } from '../types';
import { chatApi } from '../api/chatApi';

export const useChats = (userId: string) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<ChatFilters>({
    status: 'active',
    sortBy: 'activity'
  });

  const fetchChats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await chatApi.getChats(userId, filters);
      setChats(response.chats);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los chats');
    } finally {
      setIsLoading(false);
    }
  }, [userId, filters]);

  useEffect(() => {
    if (userId) {
      fetchChats();
    }
  }, [fetchChats, userId]);

  const applyFilters = useCallback((newFilters: ChatFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      status: 'active',
      sortBy: 'activity'
    });
  }, []);

  const refreshChats = useCallback(() => {
    fetchChats();
  }, [fetchChats]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getUnreadCount = useCallback(() => {
    return chats.reduce((acc, chat) => acc + chat.unreadCount, 0);
  }, [chats]);

  return {
    chats,
    isLoading,
    error,
    total,
    filters,
    applyFilters,
    clearFilters,
    refreshChats,
    clearError,
    getUnreadCount
  };
};
