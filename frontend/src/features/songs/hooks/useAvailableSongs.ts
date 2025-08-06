'use client';

import { useState, useEffect } from 'react';
import { Song } from '../types';
import { SongsService } from '../services/songsService';
import { useAuth } from '@/shared/hooks/useAuth';

interface AvailableSongsFilters {
  genre?: string;
  maxPrice?: number;
  search?: string;
}

export const useAvailableSongs = () => {
  const { user } = useAuth();
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<AvailableSongsFilters>({});

  const loadSongs = async (newFilters?: AvailableSongsFilters) => {
    try {
      setIsLoading(true);
      setError('');
      
      console.log('📋 [useAvailableSongs] Cargando canciones disponibles...');
      
      const filtersToUse = newFilters || filters;
      const response = await SongsService.getAvailableSongs(filtersToUse);
      
      console.log('✅ [useAvailableSongs] Canciones cargadas:', response);
      
      // Filtrar canciones que NO pertenezcan al usuario actual y que estén disponibles para compra
      const userId = user?.id?.toString();
      const availableSongs = response.songs.filter((song: Song) => 
        song.status === 'for_sale' && 
        song.artistId?.toString() !== userId
      );
      
      console.log('🔍 [useAvailableSongs] Canciones filtradas para compra:', {
        total: response.songs.length,
        filtered: availableSongs.length,
        userCanBuy: availableSongs.length,
        userId
      });
      
      setSongs(availableSongs);
      setTotal(availableSongs.length);
    } catch (err: any) {
      console.error('❌ [useAvailableSongs] Error:', err);
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
