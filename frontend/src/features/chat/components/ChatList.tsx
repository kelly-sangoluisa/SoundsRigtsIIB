'use client';

import Link from 'next/link';
import { useAuth } from '@/shared/hooks/useAuth';
import { Chat } from '../types';

interface ChatListProps {
  chats: Chat[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const ChatList = ({ chats, isLoading, onRefresh }: ChatListProps) => {
  const { user } = useAuth();

  const formatLastActivity = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? 'Ahora' : `Hace ${diffInMinutes}m`;
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Hace ${diffInDays}d`;
    }
  };

  const getOtherParticipant = (chat: Chat) => {
    return chat.participants.find(p => p.id !== user?.id);
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            {['skeleton-1', 'skeleton-2', 'skeleton-3'].map((skeletonId) => (
              <div key={skeletonId} className="flex space-x-4">
                <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hay chats disponibles
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Los chats aparecerán aquí cuando compres una licencia o alguien compre tu música.
          </p>
          <button
            onClick={onRefresh}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {chats.map((chat) => {
          const otherParticipant = getOtherParticipant(chat);
          const isArtist = user?.role === 'artist';
          const chatPath = `/dashboard/${isArtist ? 'artist' : 'buyer'}/chats/${chat.id}`;

          return (
            <Link
              key={chat.id}
              href={chatPath}
              className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center min-w-0 flex-1">
                    {/* Avatar del otro participante */}
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <span className="text-lg">
                          {otherParticipant?.avatar || '👤'}
                        </span>
                      </div>
                    </div>

                    <div className="ml-4 min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          {/* Título de la canción y artista */}
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            🎵 {chat.songTitle}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {isArtist ? (
                              <>👤 {otherParticipant?.name} ({otherParticipant?.role})</>
                            ) : (
                              <>🎤 {chat.songArtist}</>
                            )}
                          </p>
                        </div>
                        
                        {/* Timestamp y contador de no leídos */}
                        <div className="flex flex-col items-end ml-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatLastActivity(chat.lastActivity)}
                          </span>
                          {chat.unreadCount > 0 && (
                            <span className="inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-white bg-red-500 rounded-full mt-1">
                              {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Último mensaje */}
                      {chat.lastMessage && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            <span className="font-medium">
                              {chat.lastMessage.senderName}:
                            </span>{' '}
                            {chat.lastMessage.content}
                          </p>
                        </div>
                      )}

                      {/* Estado del chat */}
                      <div className="mt-2 flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          chat.isActive 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}>
                          {chat.isActive ? '🟢 Activo' : '⚫ Inactivo'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Flecha de navegación */}
                  <div className="ml-2">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
