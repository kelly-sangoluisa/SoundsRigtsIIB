'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/shared/hooks/useAuth';
import { useChatMessages } from '../hooks/useChatMessages';
import { ChatMessage } from '../components/ChatMessage';
import { MessageInput } from '../components/MessageInput';
import { useEffect, useState } from 'react';
import { chatApi } from '../api/chatApi';
import { Chat } from '../types';

export const ChatDetailView = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const chatId = params.chatId as string;
  
  const [chatInfo, setChatInfo] = useState<Chat | null>(null);
  const [isLoadingChat, setIsLoadingChat] = useState(true);
  
  const {
    messages,
    isLoading,
    isSending,
    error,
    sendMessage,
    refreshMessages,
    clearError,
    messagesEndRef
  } = useChatMessages(chatId, user?.id || '');

  // Cargar información del chat
  useEffect(() => {
    const loadChatInfo = async () => {
      try {
        setIsLoadingChat(true);
        // En una implementación real, esto vendría de una API
        const response = await chatApi.getChats(user?.id || '');
        const chat = response.chats.find(c => c.id === chatId);
        setChatInfo(chat || null);
      } catch (err) {
        console.error('Error loading chat info:', err);
      } finally {
        setIsLoadingChat(false);
      }
    };

    if (user?.id && chatId) {
      loadChatInfo();
    }
  }, [user?.id, chatId]);

  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  const handleBackToChats = () => {
    const role = user?.role === 'artist' ? 'artist' : 'buyer';
    router.push(`/dashboard/${role}/chats`);
  };

  const otherParticipant = chatInfo?.participants.find(p => p.id !== user?.id);

  if (isLoadingChat) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!chatInfo) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Chat no encontrado
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            El chat que buscas no existe o no tienes acceso a él.
          </p>
          <button
            onClick={handleBackToChats}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            ← Volver a Chats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header del chat */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Botón de volver */}
            <button
              onClick={handleBackToChats}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Información del chat */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-lg">
                  {otherParticipant?.avatar || '👤'}
                </span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  🎵 {chatInfo.songTitle}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.role === 'artist' ? (
                    <>👤 {otherParticipant?.name} (Comprador)</>
                  ) : (
                    <>🎤 {chatInfo.songArtist} (Artista)</>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Estado del chat */}
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              chatInfo.isActive 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}>
              {chatInfo.isActive ? '🟢 Activo' : '⚫ Inactivo'}
            </span>

            {/* Botón de actualizar */}
            <button
              onClick={refreshMessages}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
            <button
              onClick={clearError}
              className="text-red-400 hover:text-red-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Área de mensajes */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Comienza la conversación
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Envía el primer mensaje para iniciar el chat sobre "{chatInfo.songTitle}"
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isOwnMessage={message.senderId === user?.id}
                showSender={true}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input para enviar mensajes */}
      <MessageInput
        onSendMessage={handleSendMessage}
        isSending={isSending}
        disabled={!chatInfo.isActive}
        placeholder={
          chatInfo.isActive 
            ? `Escribe un mensaje sobre "${chatInfo.songTitle}"...`
            : "Este chat está inactivo"
        }
      />

      {/* Información adicional */}
      {!chatInfo.isActive && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800 p-3">
          <div className="flex">
            <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Este chat está marcado como inactivo. No se pueden enviar nuevos mensajes.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
