'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/hooks/useAuth';

interface ChatCreatedNotificationProps {
  isVisible: boolean;
  chatId: string;
  songTitle: string;
  onClose: () => void;
}

export const ChatCreatedNotification = ({ 
  isVisible, 
  chatId, 
  songTitle, 
  onClose 
}: ChatCreatedNotificationProps) => {
  const router = useRouter();
  const { user } = useAuth();

  const handleGoToChat = () => {
    const role = user?.role === 'artist' ? 'artist' : 'buyer';
    router.push(`/dashboard/${role}/chats/${chatId}`);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-4.126-.98L3 20l1.98-5.874A8.955 8.955 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
              </svg>
            </div>
          </div>
          
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              ¡Chat creado!
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Se ha creado un chat para "{songTitle}". Ahora puedes comunicarte con el {user?.role === 'buyer' ? 'artista' : 'comprador'}.
            </p>
            
            <div className="mt-3 flex items-center space-x-2">
              <button
                onClick={handleGoToChat}
                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                💬 Ir al chat
              </button>
              <button
                onClick={onClose}
                className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Cerrar
              </button>
            </div>
          </div>
          
          <div className="ml-2">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
