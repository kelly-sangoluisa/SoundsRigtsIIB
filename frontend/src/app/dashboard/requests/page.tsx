'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '../../../components/DashboardHeader';
import { songsService, Song } from '@/lib/songs-service';
import { User } from '@/types/auth';

export default function RequestsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [requestedSongs, setRequestedSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    const user = JSON.parse(userData);
    setUser(user);
    loadRequestedSongs(user.id);
  }, [router]);

  const loadRequestedSongs = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const songs = await songsService.getRequestedSongs(userId);
      setRequestedSongs(songs);
    } catch (error) {
      console.error('Error loading requested songs:', error);
      setError('Error al cargar las solicitudes de compra.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async (songId: string, requesterId: string) => {
    if (!user) return;
    try {
      await songsService.acceptSongRequest(songId, requesterId);
      alert('¡Solicitud aceptada! La canción ha sido transferida.');
      loadRequestedSongs(user.id);
    } catch (error) {
      console.error('Error accepting request:', error);
      alert('Error al aceptar la solicitud.');
    }
  };

  const handleRejectRequest = async (songId: string) => {
    if (!user) return;
    try {
      await songsService.rejectSongRequest(songId);
      alert('Solicitud rechazada.');
      loadRequestedSongs(user.id);
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Error al rechazar la solicitud.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const formatDuration = (duration: number): string => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <DashboardHeader user={user} onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Cargando solicitudes...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <DashboardHeader user={user} onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-400 text-lg">{error}</p>
              <button 
                onClick={() => user && loadRequestedSongs(user.id)}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-semibold transition-colors"
              >
                Reintentar
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black via-spotify-dark-gray to-spotify-black">
      <DashboardHeader user={user} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            📩 Solicitudes de Compra
          </h2>
          <p className="text-spotify-light-gray">
            Gestiona las solicitudes de compra que has recibido para tus canciones
          </p>
        </div>

        {/* Requests List */}
        {requestedSongs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No tienes solicitudes pendientes
            </h3>
            <p className="text-spotify-light-gray">
              Cuando alguien solicite comprar una de tus canciones, aparecerá aquí
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requestedSongs.map((song) => (
              <div key={song._id} className="bg-spotify-gray/50 rounded-lg p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-16 h-16 bg-spotify-light-gray rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🎵</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{song.title}</h3>
                        <p className="text-spotify-light-gray">{song.artist}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-spotify-green font-bold">${song.price}</span>
                          <span className="text-sm text-spotify-light-gray">{formatDuration(song.duration)}</span>
                          <span className="bg-spotify-dark-gray px-2 py-1 rounded-full text-xs">{song.genre}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-lg p-3">
                      <p className="text-yellow-100">
                        <strong>🛒 Solicitud de compra recibida</strong>
                      </p>
                      <p className="text-sm text-yellow-200 mt-1">
                        Alguien está interesado en comprar esta canción. Si aceptas, la canción será transferida al comprador.
                      </p>
                      {song.requestedAt && (
                        <p className="text-xs text-yellow-300 mt-2">
                          Solicitada el: {new Date(song.requestedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleAcceptRequest(song._id, song.requestedById!)}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold transition-colors"
                    >
                      ✅ Aceptar
                    </button>
                    <button
                      onClick={() => handleRejectRequest(song._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold transition-colors"
                    >
                      ❌ Rechazar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
