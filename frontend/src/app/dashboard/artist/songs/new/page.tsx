'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RouteGuard } from '@/shared/components/RouteGuard';
import { SongForm } from '@/features/songs/components/SongForm';
import { CreateSongRequest } from '@/features/songs/types';
import { SongsService } from '@/features/songs/services/songsService';

export default function NewSongPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (songData: CreateSongRequest) => {
    setIsLoading(true);
    
    try {
      console.log('🆕 [NewSongPage] Iniciando creación de canción:', songData);
      
      // Convertir el formato del frontend al formato que espera la API
      const apiSongData = {
        title: songData.name,
        name: songData.name, // Para compatibilidad
        genre: songData.genre,
        price: songData.price,
        duration: songData.duration,
        url: songData.url
      };
      
      console.log('📋 [NewSongPage] Datos convertidos para API:', apiSongData);
      
      const result = await SongsService.createSong(apiSongData);
      
      console.log('✅ [NewSongPage] Canción creada exitosamente:', result);
      
      // Mostrar notificación de éxito
      alert('¡Canción creada exitosamente!');
      
      // Redirigir a la lista de canciones después de crear
      router.push('/dashboard/artist/songs');
      
    } catch (error) {
      console.error('❌ [NewSongPage] Error al crear la canción:', error);
      
      // Mostrar mensaje de error específico
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Error al crear la canción: ${errorMessage}`);
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
