import { useState, useCallback } from 'react';
import { Chat } from '../types';
import { chatApi } from '../api/chatApi';

export const useCreateChat = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createChat = useCallback(async (songId: string, buyerId: string, artistId: string): Promise<Chat | null> => {
    try {
      setIsCreating(true);
      setError(null);
      
      const response = await chatApi.createChat(songId, buyerId, artistId);
      
      if (response.success) {
        return response.chat;
      } else {
        throw new Error('Error al crear el chat');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear el chat';
      setError(errorMessage);
      return null;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    createChat,
    isCreating,
    error,
    clearError
  };
};
