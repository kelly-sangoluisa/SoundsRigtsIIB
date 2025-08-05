'use client';

import { useState } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { useAvailableSongs } from '../hooks/useAvailableSongs';
import { BuyerFilters } from '../components/BuyerFilters';
import { AvailableSongsList } from '../components/AvailableSongsList';
import { PurchaseModal } from '../components/PurchaseModal';
import { ChatCreatedNotification } from '@/features/chat/components/ChatCreatedNotification';
import { Song } from '../types';

export const ExploreSongsView = () => {
  const { user } = useAuth();
  const {
    songs,
    isLoading,
    error,
    total,
    filters,
    applyFilters,
    clearFilters,
    refreshSongs,
    clearError
  } = useAvailableSongs();

  const [selectedSongForPurchase, setSelectedSongForPurchase] = useState<Song | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [chatNotification, setChatNotification] = useState<{
    isVisible: boolean;
    chatId: string;
    songTitle: string;
  }>({
    isVisible: false,
    chatId: '',
    songTitle: ''
  });

  const handlePurchase = (song: Song) => {
    setSelectedSongForPurchase(song);
  };

  const handlePurchaseSuccess = (message: string) => {
    setSuccessMessage(message);
    refreshSongs(); // Refrescar para actualizar estados
    setTimeout(() => setSuccessMessage(''), 5000); // Limpiar mensaje después de 5 segundos
  };

  const handleChatCreated = (chatId: string, songTitle: string) => {
    setChatNotification({
      isVisible: true,
      chatId,
      songTitle
    });
    // Auto-ocultar después de 10 segundos
    setTimeout(() => {
      setChatNotification(prev => ({ ...prev, isVisible: false }));
    }, 10000);
  };

  const handleRefresh = () => {
    clearError();
    setSuccessMessage('');
    refreshSongs();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Explorar Canciones
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Descubre y compra licencias musicales de artistas independientes
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {filters && Object.keys(filters).length > 0 && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpiar filtros
            </button>
          )}
          
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Actualizar
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Canciones</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Artistas</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Set(songs.map(song => song.artist)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v11a3 3 0 01-3 3H6a3 3 0 01-3-3V6H2a1 1 0 110-2h4z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Géneros</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Set(songs.map(song => song.genre)).size}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Precio promedio</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                ${songs.length > 0 ? (songs.reduce((acc, song) => acc + song.price, 0) / songs.length).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-green-600 dark:text-green-400">
                {successMessage}
              </p>
            </div>
            <button
              onClick={() => setSuccessMessage('')}
              className="ml-auto text-green-400 hover:text-green-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Filtros */}
      <BuyerFilters 
        onFiltersChange={applyFilters}
        currentFilters={filters}
      />

      {/* Lista de canciones */}
      <AvailableSongsList
        songs={songs}
        isLoading={isLoading}
        onPurchase={handlePurchase}
        onRefresh={handleRefresh}
      />

      {/* Modal de compra */}
      {selectedSongForPurchase && (
        <PurchaseModal
          song={selectedSongForPurchase}
          isOpen={!!selectedSongForPurchase}
          onClose={() => setSelectedSongForPurchase(null)}
          onSuccess={handlePurchaseSuccess}
          onChatCreated={handleChatCreated}
        />
      )}

      {/* Notificación de chat creado */}
      <ChatCreatedNotification
        isVisible={chatNotification.isVisible}
        chatId={chatNotification.chatId}
        songTitle={chatNotification.songTitle}
        onClose={() => setChatNotification(prev => ({ ...prev, isVisible: false }))}
      />

      {/* Información del usuario actual */}
      {user && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            🛒 Modo Comprador Activo
          </h4>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Estás navegando como: <strong>{user.name || user.email}</strong> ({user.role})
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            Puedes explorar y solicitar la compra de canciones de otros artistas.
          </p>
        </div>
      )}
    </div>
  );
};
