'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RouteGuard } from '@/shared/components/RouteGuard';
import { SongForm } from '@/features/songs/components/SongForm';
import { CreateSongRequest } from '@/features/songs/types';
import { mockSongsAPI } from '@/shared/utils/mockSongsAPI';

export default function NewSongPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (songData: CreateSongRequest) => {
    setIsLoading(true);
    
    try {
      await mockSongsAPI.createSong(songData, '1'); // Usar ID del usuario autenticado
      
      // Redirigir a la lista de canciones después de crear
      router.push('/dashboard/artist/songs');
      
      // Podrías mostrar una notificación de éxito aquí
    } catch (error) {
      console.error('Error al crear la canción:', error);
      // Podrías mostrar una notificación de error aquí
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/artist/songs');
  };

  return (
    <RouteGuard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Nueva Canción
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Agrega una nueva canción a tu catálogo
            </p>
          </div>
        </div>

        <SongForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
          submitLabel="Crear Canción"
        />
      </div>
    </RouteGuard>
  );
}
