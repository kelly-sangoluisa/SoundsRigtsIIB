'use client';

import { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
  isOwnMessage: boolean;
  showSender?: boolean;
}

export const ChatMessage = ({ message, isOwnMessage, showSender = true }: ChatMessageProps) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  if (message.type === 'system') {
    return (
      <div className="flex justify-center py-2">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {message.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-1' : 'order-2'}`}>
        {/* Información del remitente */}
        {showSender && !isOwnMessage && (
          <div className="flex items-center mb-1">
            <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-2">
              <span className="text-xs">
                {message.senderRole === 'artist' ? '🎤' : '👤'}
              </span>
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {message.senderName}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
              {message.senderRole === 'artist' ? 'Artista' : 'Comprador'}
            </span>
          </div>
        )}

        {/* Contenido del mensaje */}
        <div className={`relative px-4 py-2 rounded-lg ${
          isOwnMessage
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
        }`}>
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>
          
          {/* Timestamp */}
          <div className={`flex items-center justify-end mt-1 ${
            isOwnMessage ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
          }`}>
            <span className="text-xs">
              {formatDate(message.timestamp)} {formatTime(message.timestamp)}
            </span>
            
            {/* Estado de lectura para mensajes propios */}
            {isOwnMessage && (
              <div className="ml-1">
                {message.isRead ? (
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cola del mensaje */}
        <div className={`w-0 h-0 ${
          isOwnMessage
            ? 'border-l-8 border-l-blue-500 border-t-8 border-t-transparent ml-auto mr-0'
            : 'border-r-8 border-r-gray-100 dark:border-r-gray-700 border-t-8 border-t-transparent ml-0 mr-auto'
        }`} />
      </div>
    </div>
  );
};
