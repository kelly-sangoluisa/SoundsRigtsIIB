import { useState, useEffect } from 'react';
import { Song, SongsResponse, SongFilters } from '../types';
import { SongsService } from '../services/songsService';

export const useMySongs = (initialFilters?: SongFilters) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filters, setFilters] = useState<SongFilters>(initialFilters || {});
  const [total, setTotal] = useState(0);

  const fetchSongs = async (currentFilters: SongFilters = filters) => {
    setIsLoading(true);
    setError('');

    try {
      const response: SongsResponse = await SongsService.getMySongs(currentFilters);
      setSongs(response.songs);
      setTotal(response.total);
    } catch (error: any) {
      setError(error.message || 'Error al cargar las canciones');
      setSongs([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSongStatus = async (songId: string, status: Song['status']) => {
    try {
      const updatedSong = await SongsService.updateSongStatus(songId, status);
      setSongs(prevSongs =>
        prevSongs.map(song =>
          song.id === songId ? updatedSong : song
        )
      );
      return updatedSong;
    } catch (error: any) {
      throw new Error(error.message || 'Error al actualizar el estado de la canción');
    }
  };

  const deleteSong = async (songId: string) => {
    try {
      await SongsService.deleteSong(songId);
      setSongs(prevSongs => prevSongs.filter(song => song.id !== songId));
      setTotal(prevTotal => prevTotal - 1);
    } catch (error: any) {
      throw new Error(error.message || 'Error al eliminar la canción');
    }
  };

  const applyFilters = (newFilters: SongFilters) => {
    setFilters(newFilters);
    fetchSongs(newFilters);
  };

  const refreshSongs = () => {
    fetchSongs();
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return {
    songs,
    isLoading,
    error,
    total,
    filters,
    updateSongStatus,
    deleteSong,
    applyFilters,
    refreshSongs,
    clearError: () => setError('')
  };
};
