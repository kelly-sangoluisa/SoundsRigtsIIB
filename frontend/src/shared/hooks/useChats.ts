import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { API_ROUTES } from '../constants';
import { 
  Chat, 
  Message, 
  CreateChatRequest,
  SendMessageRequest,
  ChatFilters,
  PaginationParams,
  AsyncState,
  PaginatedState
} from '../types';

// Funciones helper para construir parámetros
const buildChatFilters = (filters?: ChatFilters) => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.participantId) params.append('participantId', filters.participantId);
  if (filters?.hasUnread !== undefined) params.append('hasUnread', filters.hasUnread.toString());
  if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
  if (filters?.dateTo) params.append('dateTo', filters.dateTo);
  return params;
};

const buildMessagePagination = (pagination?: PaginationParams) => {
  const params = new URLSearchParams();
  if (pagination?.page) params.append('page', pagination.page.toString());
  if (pagination?.pageSize) params.append('pageSize', pagination.pageSize.toString());
  if (pagination?.sortBy) params.append('sortBy', pagination.sortBy);
  if (pagination?.sortOrder) params.append('sortOrder', pagination.sortOrder);
  return params;
};

// Hook principal para chats
export const useChats = (filters?: ChatFilters) => {
  const [state, setState] = useState<AsyncState<Chat[]>>({
    data: [],
    isLoading: false,
    error: null,
  });

  const fetchChats = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const params = buildChatFilters(filters);
      const query = params.toString();
      const baseEndpoint = API_ROUTES.CHATS.LIST;
      const endpoint = query ? `${baseEndpoint}?${query}` : baseEndpoint;
      
      const response = await api.get<{ chats: Chat[] }>(endpoint);
      
      if (response.success && response.data) {
        setState({
          data: response.data.chats || [],
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(response.error || 'Error al cargar chats');
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Error al cargar chats' 
      }));
    }
  }, [filters]);

  const refetch = useCallback(() => fetchChats(), [fetchChats]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  return {
    chats: state.data || [],
    loading: state.isLoading,
    error: state.error,
    refetch,
  };
};

// Hook para un chat específico
export const useChat = (chatId: string) => {
  const [state, setState] = useState<AsyncState<Chat>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const fetchChat = useCallback(async () => {
    if (!chatId) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await api.get<Chat>(API_ROUTES.CHATS.GET(chatId));
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(response.error || 'Error al cargar el chat');
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Error al cargar el chat' 
      }));
    }
  }, [chatId]);

  useEffect(() => {
    fetchChat();
  }, [fetchChat]);

  return {
    chat: state.data,
    loading: state.isLoading,
    error: state.error,
    refetch: fetchChat,
  };
};

// Hook para mensajes de un chat
export const useChatMessages = (chatId: string, pagination?: PaginationParams) => {
  const [state, setState] = useState<PaginatedState<Message>>({
    data: [],
    pagination: null,
    hasMore: false,
    isLoading: false,
    error: null,
  });

  const fetchMessages = useCallback(async (reset = false) => {
    if (!chatId) return;

    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      ...(reset && { data: [] })
    }));

    try {
      const params = buildMessagePagination(pagination);
      const query = params.toString();
      const baseEndpoint = API_ROUTES.CHATS.MESSAGES(chatId);
      const endpoint = query ? `${baseEndpoint}?${query}` : baseEndpoint;
      
      const response = await api.get<Message[]>(endpoint);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          data: reset ? response.data! : [...prev.data!, ...response.data!],
          pagination: response.pagination || null,
          hasMore: response.pagination ? response.pagination.hasNext : false,
          isLoading: false,
        }));
      } else {
        throw new Error(response.error || 'Error al cargar mensajes');
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Error al cargar mensajes' 
      }));
    }
  }, [chatId, pagination]);

  const refetch = useCallback(() => fetchMessages(true), [fetchMessages]);
  const loadMore = useCallback(() => fetchMessages(false), [fetchMessages]);

  useEffect(() => {
    fetchMessages(true);
  }, [fetchMessages]);

  return {
    messages: state.data || [],
    pagination: state.pagination,
    hasMore: state.hasMore,
    loading: state.isLoading,
    error: state.error,
    refetch,
    loadMore,
  };
};

// Hook para crear chat
export const useCreateChat = () => {
  const [state, setState] = useState<AsyncState<Chat>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const createChat = useCallback(async (chatData: CreateChatRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await api.post<Chat>(API_ROUTES.CHATS.CREATE, chatData);
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          isLoading: false,
          error: null,
        });
        return response.data;
      } else {
        throw new Error(response.error || 'Error al crear el chat');
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Error al crear el chat' 
      }));
      throw error;
    }
  }, []);

  return {
    chat: state.data,
    loading: state.isLoading,
    error: state.error,
    createChat,
  };
};

// Hook para enviar mensaje
export const useSendMessage = () => {
  const [state, setState] = useState<AsyncState<Message>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const sendMessage = useCallback(async (chatId: string, messageData: SendMessageRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await api.post<Message>(
        API_ROUTES.CHATS.SEND_MESSAGE(chatId),
        messageData
      );
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          isLoading: false,
          error: null,
        });
        return response.data;
      } else {
        throw new Error(response.error || 'Error al enviar mensaje');
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Error al enviar mensaje' 
      }));
      throw error;
    }
  }, []);

  return {
    message: state.data,
    loading: state.isLoading,
    error: state.error,
    sendMessage,
  };
};

// Hook para marcar mensajes como leídos
export const useMarkMessagesRead = () => {
  const [state, setState] = useState<{ isLoading: boolean; error: string | null }>({
    isLoading: false,
    error: null,
  });

  const markAsRead = useCallback(async (chatId: string, messageIds?: string[]) => {
    setState({ isLoading: true, error: null });

    try {
      const response = await api.put<{ success: boolean }>(
        API_ROUTES.CHATS.MARK_READ(chatId),
        { messageIds }
      );
      
      if (response.success) {
        setState({ isLoading: false, error: null });
        return true;
      } else {
        throw new Error(response.error || 'Error al marcar mensajes como leídos');
      }
    } catch (error: any) {
      setState({ 
        isLoading: false, 
        error: error.message || 'Error al marcar mensajes como leídos' 
      });
      throw error;
    }
  }, []);

  return {
    loading: state.isLoading,
    error: state.error,
    markAsRead,
  };
};

// Hook para archivas chat
export const useArchiveChat = () => {
  const [state, setState] = useState<{ isLoading: boolean; error: string | null }>({
    isLoading: false,
    error: null,
  });

  const archiveChat = useCallback(async (chatId: string) => {
    setState({ isLoading: true, error: null });

    try {
      const response = await api.put<{ success: boolean }>(
        API_ROUTES.CHATS.ARCHIVE(chatId)
      );
      
      if (response.success) {
        setState({ isLoading: false, error: null });
        return true;
      } else {
        throw new Error(response.error || 'Error al archivar el chat');
      }
    } catch (error: any) {
      setState({ 
        isLoading: false, 
        error: error.message || 'Error al archivar el chat' 
      });
      throw error;
    }
  }, []);

  return {
    loading: state.isLoading,
    error: state.error,
    archiveChat,
  };
};

// Hook para desarchivar chat
export const useUnarchiveChat = () => {
  const [state, setState] = useState<{ isLoading: boolean; error: string | null }>({
    isLoading: false,
    error: null,
  });

  const unarchiveChat = useCallback(async (chatId: string) => {
    setState({ isLoading: true, error: null });

    try {
      const response = await api.put<{ success: boolean }>(
        API_ROUTES.CHATS.UNARCHIVE(chatId)
      );
      
      if (response.success) {
        setState({ isLoading: false, error: null });
        return true;
      } else {
        throw new Error(response.error || 'Error al desarchivar el chat');
      }
    } catch (error: any) {
      setState({ 
        isLoading: false, 
        error: error.message || 'Error al desarchivar el chat' 
      });
      throw error;
    }
  }, []);

  return {
    loading: state.isLoading,
    error: state.error,
    unarchiveChat,
  };
};
