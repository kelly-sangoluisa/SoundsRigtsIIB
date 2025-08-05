'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { RouteGuard } from '@/shared/components/RouteGuard';
import { SongForm } from '@/features/songs/components/SongForm';
import { CreateSongRequest, Song } from '@/features/songs/types';
import { mockSongsAPI } from '@/shared/utils/mockSongsAPI';

export default function EditSongPage() {
  const router = useRouter();
  const params = useParams();
  const songId = params.id as string;
  
  const [song, setSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadSong = async () => {
      if (!songId) {
        router.push('/dashboard/artist/songs');
        return;
      }

      try {
        const songData = await mockSongsAPI.getSongById(songId, '1');
        if (!songData) {
          alert('Canción no encontrada');
          router.push('/dashboard/artist/songs');
          return;
        }

        // Verificar si la canción puede ser editada
        if (songData.status === 'sold') {
          alert('No puedes editar una canción que ya fue vendida');
          router.push('/dashboard/artist/songs');
          return;
        }

        setSong(songData);
      } catch (error) {
        console.error('Error al cargar la canción:', error);
        alert('Error al cargar la canción');
        router.push('/dashboard/artist/songs');
      } finally {
        setIsLoading(false);
      }
    };

    loadSong();
  }, [songId, router]);

  const handleSubmit = async (songData: CreateSongRequest) => {
    if (!song) return;

    setIsSubmitting(true);
    
    try {
      await mockSongsAPI.updateSong(song.id, songData, '1');
      
      // Redirigir a la lista de canciones después de actualizar
      router.push('/dashboard/artist/songs');
      
    } catch (error) {
      console.error('Error al actualizar la canción:', error);
      alert('Error al actualizar la canción. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/artist/songs');
  };

  if (isLoading) {
    return (
      <RouteGuard>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </RouteGuard>
    );
  }

  if (!song) {
    return (
      <RouteGuard>
        <div className="text-center">
          <p className="text-gray-500">Canción no encontrada</p>
        </div>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Editar Canción
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Modifica los detalles de "{song.name}"
            </p>
          </div>
        </div>

        <SongForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isSubmitting}
          initialData={{
            name: song.name,
            genre: song.genre,
            duration: song.duration,
            price: song.price,
            url: song.url,
          }}
          submitLabel="Actualizar Canción"
        />
      </div>
    </RouteGuard>
  );
}
