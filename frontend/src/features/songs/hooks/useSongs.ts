'use client';

import { useState, useEffect } from 'react';
import { songsApi, licensesApi, Song, License, SongsResponse, LicensesResponse } from '@/lib/api-client';

// Hook para gestionar canciones disponibles
export function useAvailableSongs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSongs = async () => {
    setLoading(true);
    setError(null);
    
    const response = await songsApi.getAvailable();
    
    if (response.error) {
      setError(response.error);
      setSongs([]);
    } else {
      setSongs(response.data?.songs || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return {
    songs,
    loading,
    error,
    refetch: fetchSongs,
  };
}

// Hook para gestionar mis canciones
export function useMySongs() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSongs = async () => {
    setLoading(true);
    setError(null);
    
    const response = await songsApi.getMine();
    
    if (response.error) {
      setError(response.error);
      setSongs([]);
    } else {
      setSongs(response.data?.songs || []);
    }
    
    setLoading(false);
  };

  const createSong = async (songData: Partial<Song>) => {
    const response = await songsApi.create(songData);
    
    if (response.error) {
      setError(response.error);
      return false;
    }
    
    await fetchSongs(); // Refrescar la lista
    return true;
  };

  const updateSong = async (id: string, songData: Partial<Song>) => {
    const response = await songsApi.update(id, songData);
    
    if (response.error) {
      setError(response.error);
      return false;
    }
    
    await fetchSongs(); // Refrescar la lista
    return true;
  };

  const deleteSong = async (id: string) => {
    const response = await songsApi.delete(id);
    
    if (response.error) {
      setError(response.error);
      return false;
    }
    
    await fetchSongs(); // Refrescar la lista
    return true;
  };

  const updateSongStatus = async (id: string, status: Song['status']) => {
    const response = await songsApi.updateStatus(id, status);
    
    if (response.error) {
      setError(response.error);
      return false;
    }
    
    await fetchSongs(); // Refrescar la lista
    return true;
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return {
    songs,
    loading,
    error,
    refetch: fetchSongs,
    createSong,
    updateSong,
    deleteSong,
    updateSongStatus,
  };
}

// Hook para gestionar licencias
export function useLicenses() {
  const [purchasedLicenses, setPurchasedLicenses] = useState<License[]>([]);
  const [soldLicenses, setSoldLicenses] = useState<License[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLicenses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [purchasedResponse, soldResponse] = await Promise.all([
        licensesApi.getPurchased(),
        licensesApi.getSold(),
      ]);

      if (purchasedResponse.error) {
        setError(purchasedResponse.error);
      } else {
        setPurchasedLicenses(purchasedResponse.data?.licenses || []);
      }

      if (soldResponse.error) {
        setError(soldResponse.error);
      } else {
        setSoldLicenses(soldResponse.data?.licenses || []);
      }
    } catch (err) {
      setError('Error cargando licencias');
    }
    
    setLoading(false);
  };

  const purchaseLicense = async (songId: string) => {
    const response = await songsApi.purchase(songId);
    
    if (response.error) {
      setError(response.error);
      return false;
    }
    
    await fetchLicenses(); // Refrescar las licencias
    return true;
  };

  useEffect(() => {
    fetchLicenses();
  }, []);

  return {
    purchasedLicenses,
    soldLicenses,
    loading,
    error,
    refetch: fetchLicenses,
    purchaseLicense,
  };
}

// Hook combinado para el dashboard
export function useSongsDashboard() {
  const availableSongs = useAvailableSongs();
  const mySongs = useMySongs();
  const licenses = useLicenses();

  const isLoading = availableSongs.loading || mySongs.loading || licenses.loading;
  const hasError = availableSongs.error || mySongs.error || licenses.error;

  return {
    // Canciones disponibles
    availableSongs: availableSongs.songs,
    // Mis canciones
    mySongs: mySongs.songs,
    // Licencias
    purchasedLicenses: licenses.purchasedLicenses,
    soldLicenses: licenses.soldLicenses,
    // Estados
    loading: isLoading,
    error: hasError,
    // Acciones
    refetchAll: () => {
      availableSongs.refetch();
      mySongs.refetch();
      licenses.refetch();
    },
    // Acciones de canciones
    createSong: mySongs.createSong,
    updateSong: mySongs.updateSong,
    deleteSong: mySongs.deleteSong,
    updateSongStatus: mySongs.updateSongStatus,
    // Acciones de licencias
    purchaseLicense: licenses.purchaseLicense,
  };
}
