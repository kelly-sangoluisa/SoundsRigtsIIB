import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { API_ROUTES } from '../constants';
import { 
  Song, 
  SongFilters, 
  PaginationParams, 
  CreateSongRequest, 
  UpdateSongRequest,
  AsyncState,
  PaginatedState
} from '../types';

// Funciones helper para construir parámetros
const buildSongFilters = (filters?: SongFilters) => {
  const params = new URLSearchParams();
  if (filters?.genre) params.append('genre', filters.genre);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.priceMin) params.append('priceMin', filters.priceMin.toString());
  if (filters?.priceMax) params.append('priceMax', filters.priceMax.toString());
  if (filters?.search) params.append('search', filters.search);
  if (filters?.artistId) params.append('artistId', filters.artistId);
  if (filters?.tags?.length) params.append('tags', filters.tags.join(','));
  return params;
};

const buildPaginationParams = (pagination?: PaginationParams) => {
  const params = new URLSearchParams();
  if (pagination?.page) params.append('page', pagination.page.toString());
  if (pagination?.pageSize) params.append('pageSize', pagination.pageSize.toString());
  if (pagination?.sortBy) params.append('sortBy', pagination.sortBy);
  if (pagination?.sortOrder) params.append('sortOrder', pagination.sortOrder);
  return params;
};

// Hook principal para canciones
export const useSongs = (filters?: SongFilters, pagination?: PaginationParams) => {
  const [state, setState] = useState<PaginatedState<Song>>({
    data: [],
    pagination: null,
    hasMore: false,
    isLoading: false,
    error: null,
  });

  const fetchSongs = useCallback(async (reset = false) => {
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      ...(reset && { data: [] })
    }));

    try {
      const filterParams = buildSongFilters(filters);
      const paginationParams = buildPaginationParams(pagination);
      
      // Combinar parámetros
      const allParams = new URLSearchParams([
        ...Array.from(filterParams.entries()),
        ...Array.from(paginationParams.entries())
      ]);

      const query = allParams.toString();
      const baseEndpoint = API_ROUTES.SONGS.LIST;
      const endpoint = query ? `${baseEndpoint}?${query}` : baseEndpoint;
      
      const response = await api.get<Song[]>(endpoint);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          data: reset ? response.data! : [...prev.data!, ...response.data!],
          pagination: response.pagination || null,
          hasMore: response.pagination ? response.pagination.hasNext : false,
          isLoading: false,
        }));
      } else {
        throw new Error(response.error || 'Error al cargar canciones');
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Error al cargar canciones' 
      }));
    }
  }, [filters, pagination]);

  const refetch = useCallback(() => fetchSongs(true), [fetchSongs]);
  const loadMore = useCallback(() => fetchSongs(false), [fetchSongs]);

  useEffect(() => {
    fetchSongs(true);
  }, [fetchSongs]);

  return {
    songs: state.data || [],
    pagination: state.pagination,
    hasMore: state.hasMore,
    loading: state.isLoading,
    error: state.error,
    refetch,
    loadMore,
  };
};

// Hook para mis canciones (artista)
export const useMySongs = (filters?: Omit<SongFilters, 'artistId'>) => {
  const [state, setState] = useState<AsyncState<Song[]>>({
    data: [],
    isLoading: false,
    error: null,
  });

  const fetchMySongs = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const params = new URLSearchParams();
      if (filters?.genre) params.append('genre', filters.genre);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.search) params.append('search', filters.search);

      const query = params.toString();
      const baseEndpoint = API_ROUTES.SONGS.MY_SONGS;
      const endpoint = query ? `${baseEndpoint}?${query}` : baseEndpoint;
      
      const response = await api.get<{ songs: Song[] }>(endpoint);
      
      if (response.success && response.data) {
        setState({
          data: response.data.songs || [],
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(response.error || 'Error al cargar mis canciones');
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Error al cargar mis canciones' 
      }));
    }
  }, [filters]);

  useEffect(() => {
    fetchMySongs();
  }, [fetchMySongs]);

  return {
    songs: state.data || [],
    loading: state.isLoading,
    error: state.error,
    refetch: fetchMySongs,
  };
};

// Hook para canciones disponibles (comprador)
export const useAvailableSongs = (filters?: SongFilters) => {
  return useSongs({ ...filters, status: 'available' });
};

// Hook para una canción específica
export const useSong = (songId: string) => {
  const [state, setState] = useState<AsyncState<Song>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const fetchSong = useCallback(async () => {
    if (!songId) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await api.get<Song>(API_ROUTES.SONGS.GET(songId));
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(response.error || 'Error al cargar la canción');
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Error al cargar la canción' 
      }));
    }
  }, [songId]);

  useEffect(() => {
    fetchSong();
  }, [fetchSong]);

  return {
    song: state.data,
    loading: state.isLoading,
    error: state.error,
    refetch: fetchSong,
  };
};

// Hook para crear canción
export const useCreateSong = () => {
  const [state, setState] = useState<AsyncState<Song>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const createSong = useCallback(async (songData: CreateSongRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await api.post<Song>(API_ROUTES.SONGS.CREATE, songData);
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          isLoading: false,
          error: null,
        });
        return response.data;
      } else {
        throw new Error(response.error || 'Error al crear la canción');
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Error al crear la canción' 
      }));
      throw error;
    }
  }, []);

  return {
    song: state.data,
    loading: state.isLoading,
    error: state.error,
    createSong,
  };
};

// Hook para actualizar canción
export const useUpdateSong = () => {
  const [state, setState] = useState<AsyncState<Song>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const updateSong = useCallback(async (songId: string, updates: UpdateSongRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await api.put<Song>(API_ROUTES.SONGS.UPDATE(songId), updates);
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          isLoading: false,
          error: null,
        });
        return response.data;
      } else {
        throw new Error(response.error || 'Error al actualizar la canción');
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Error al actualizar la canción' 
      }));
      throw error;
    }
  }, []);

  return {
    song: state.data,
    loading: state.isLoading,
    error: state.error,
    updateSong,
  };
};

// Hook para eliminar canción
export const useDeleteSong = () => {
  const [state, setState] = useState<{ isLoading: boolean; error: string | null }>({
    isLoading: false,
    error: null,
  });

  const deleteSong = useCallback(async (songId: string) => {
    setState({ isLoading: true, error: null });

    try {
      const response = await api.delete(API_ROUTES.SONGS.DELETE(songId));
      
      if (response.success) {
        setState({ isLoading: false, error: null });
        return true;
      } else {
        throw new Error(response.error || 'Error al eliminar la canción');
      }
    } catch (error: any) {
      setState({ 
        isLoading: false, 
        error: error.message || 'Error al eliminar la canción' 
      });
      throw error;
    }
  }, []);

  return {
    loading: state.isLoading,
    error: state.error,
    deleteSong,
  };
};

// Hook para subir archivo de canción
export const useUploadSong = () => {
  const [state, setState] = useState<AsyncState<{ url: string; metadata: any }>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const uploadSong = useCallback(async (file: File) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.upload<{ url: string; metadata: any }>(
        API_ROUTES.SONGS.UPLOAD, 
        formData
      );
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          isLoading: false,
          error: null,
        });
        return response.data;
      } else {
        throw new Error(response.error || 'Error al subir el archivo');
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Error al subir el archivo' 
      }));
      throw error;
    }
  }, []);

  return {
    result: state.data,
    loading: state.isLoading,
    error: state.error,
    uploadSong,
  };
};
