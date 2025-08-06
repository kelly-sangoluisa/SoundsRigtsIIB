'use client';

import { useState, useEffect } from 'react';
import { Song } from '../types';
import { mockSongsAPI } from '@/shared/utils/mockSongsAPI';

interface AvailableSongsFilters {
  genre?: string;
  maxPrice?: number;
  search?: string;
}

export const useAvailableSongs = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<AvailableSongsFilters>({});

  const loadSongs = async (newFilters?: AvailableSongsFilters) => {
    try {
      setIsLoading(true);
      setError('');
      
      const filtersToUse = newFilters || filters;
      const response = await mockSongsAPI.getAvailableSongs(filtersToUse);
      
      setSongs(response.songs);
      setTotal(response.total);
    } catch (err: any) {
      setError(err.message || 'Error al cargar canciones');
      setSongs([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (newFilters: AvailableSongsFilters) => {
    setFilters(newFilters);
    loadSongs(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setFilters(emptyFilters);
    loadSongs(emptyFilters);
  };

  const refreshSongs = () => {
    loadSongs();
  };

  const clearError = () => {
    setError('');
  };

  useEffect(() => {
    loadSongs();
  }, []);

  return {
    songs,
    isLoading,
    error,
    total,
    filters,
    applyFilters,
    clearFilters,
    refreshSongs,
    clearError
  };
};
