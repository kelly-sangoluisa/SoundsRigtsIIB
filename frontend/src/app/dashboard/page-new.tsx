'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardHeader from '../../components/DashboardHeader';
import SongCard from '../../components/SongCard';
import { songsService, Song } from '@/lib/songs-service';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
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

    setUser(JSON.parse(userData));
    loadSongs();
  }, [router]);

  const loadSongs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const songsData = await songsService.getAllSongs();
      setSongs(songsData);
      setFilteredSongs(songsData);
    } catch (error) {
      console.error('Error loading songs:', error);
      setError('Error al cargar las canciones. Verificar que el servicio de canciones esté funcionando.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDuration = (duration: number): string => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Convertir Song del backend al formato que espera el frontend
  const convertSongFormat = (song: Song) => {
    return {
      id: song._id,
      title: song.title,
      artist: song.artist,
      price: song.price,
      genre: song.genre,
      duration: formatDuration(song.duration),
      imageUrl: song.albumCover || '/api/placeholder/300/300',
      owner: song.ownerId
    };
  };

  useEffect(() => {
    let filtered = songs;

    // Filtrar por género
    if (selectedGenre !== 'all') {
      filtered = filtered.filter(song => 
        song.genre.toLowerCase() === selectedGenre.toLowerCase()
      );
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.genre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSongs(filtered);
  }, [songs, selectedGenre, searchTerm]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const handleCreateSong = () => {
    router.push('/dashboard/create-song');
  };

  const handleBuySong = (songId: string) => {
    // TODO: Implementar lógica de compra cuando tengamos el microservicio
    alert(`Comprando canción con ID: ${songId}`);
  };

  const genres = ['all', ...Array.from(new Set(songs.map(song => song.genre)))];

  const totalSongs = songs.length;
  const totalValue = songs.reduce((sum, song) => sum + song.price, 0);
  const avgPrice = totalSongs > 0 ? totalValue / totalSongs : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <DashboardHeader user={user} onLogout={handleLogout} />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-4 text-gray-400">Cargando canciones...</p>
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
                onClick={loadSongs}
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black via-spotify-dark-gray to-spotify-black">
      {/* Header */}
      <DashboardHeader user={user} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Bienvenido de vuelta, {user.firstName}
          </h2>
          <p className="text-spotify-light-gray">
            Descubre canciones exclusivas de artistas emergentes o vende tus propias creaciones
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-spotify-gray/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Total de Canciones</h3>
            <p className="text-3xl font-bold text-spotify-green">{totalSongs}</p>
          </div>
          <div className="bg-spotify-gray/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Valor Total</h3>
            <p className="text-3xl font-bold text-spotify-green">${totalValue.toFixed(2)}</p>
          </div>
          <div className="bg-spotify-gray/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Precio Promedio</h3>
            <p className="text-3xl font-bold text-spotify-green">${avgPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <button
            onClick={handleCreateSong}
            className="spotify-button"
          >
            🎼 Crear Nueva Canción
          </button>
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar canciones o artistas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="spotify-input"
            />
          </div>
        </div>

        {/* Genre Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedGenre === genre
                    ? 'bg-spotify-green text-spotify-black'
                    : 'bg-spotify-gray text-white hover:bg-spotify-light-gray'
                }`}
              >
                {genre === 'all' ? 'Todos' : genre}
              </button>
            ))}
          </div>
        </div>

        {/* Songs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSongs.map((song) => (
            <SongCard
              key={song._id}
              song={convertSongFormat(song)}
              onBuy={handleBuySong}
            />
          ))}
        </div>

        {/* No Results */}
        {filteredSongs.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No se encontraron canciones
            </h3>
            <p className="text-spotify-light-gray">
              Intenta cambiar los filtros o crear una nueva canción
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
