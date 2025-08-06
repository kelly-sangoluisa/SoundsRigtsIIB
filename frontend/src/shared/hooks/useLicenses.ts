import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import { API_ROUTES } from '../constants';
import { 
  License, 
  LicenseFilters, 
  PaginationParams, 
  CreateLicenseRequest,
  AsyncState,
  PaginatedState
} from '../types';

// Funciones helper para construir parámetros
const buildLicenseFilters = (filters?: LicenseFilters) => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.type) params.append('type', filters.type);
  if (filters?.songId) params.append('songId', filters.songId);
  if (filters?.buyerId) params.append('buyerId', filters.buyerId);
  if (filters?.sellerId) params.append('sellerId', filters.sellerId);
  if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
  if (filters?.dateTo) params.append('dateTo', filters.dateTo);
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

// Hook principal para licencias
export const useLicenses = (filters?: LicenseFilters, pagination?: PaginationParams) => {
  const [state, setState] = useState<PaginatedState<License>>({
    data: [],
    pagination: null,
    hasMore: false,
    isLoading: false,
    error: null,
  });

  const fetchLicenses = useCallback(async (reset = false) => {
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      ...(reset && { data: [] })
    }));

    try {
      const filterParams = buildLicenseFilters(filters);
      const paginationParams = buildPaginationParams(pagination);
      
      // Combinar parámetros
      const allParams = new URLSearchParams([
        ...Array.from(filterParams.entries()),
        ...Array.from(paginationParams.entries())
      ]);

      const query = allParams.toString();
      const baseEndpoint = API_ROUTES.LICENSES.LIST;
      const endpoint = query ? `${baseEndpoint}?${query}` : baseEndpoint;
      
      const response = await api.get<License[]>(endpoint);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          data: reset ? response.data! : [...prev.data!, ...response.data!],
          pagination: response.pagination || null,
          hasMore: response.pagination ? response.pagination.hasNext : false,
          isLoading: false,
        }));
      } else {
        throw new Error(response.error || 'Error al cargar licencias');
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Error al cargar licencias' 
      }));
    }
  }, [filters, pagination]);

  const refetch = useCallback(() => fetchLicenses(true), [fetchLicenses]);
  const loadMore = useCallback(() => fetchLicenses(false), [fetchLicenses]);

  useEffect(() => {
    fetchLicenses(true);
  }, [fetchLicenses]);

  return {
    licenses: state.data || [],
    pagination: state.pagination,
    hasMore: state.hasMore,
    loading: state.isLoading,
    error: state.error,
    refetch,
    loadMore,
  };
};

const buildSimpleFilters = (filters?: Omit<LicenseFilters, 'buyerId' | 'sellerId'>) => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.type) params.append('type', filters.type);
  if (filters?.songId) params.append('songId', filters.songId);
  if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
  if (filters?.dateTo) params.append('dateTo', filters.dateTo);
  return params;
};

// Hook para licencias compradas (comprador)
export const usePurchasedLicenses = (filters?: Omit<LicenseFilters, 'buyerId'>) => {
  const [state, setState] = useState<AsyncState<License[]>>({
    data: [],
    isLoading: false,
    error: null,
  });

  const fetchPurchasedLicenses = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const params = buildSimpleFilters(filters);
      const query = params.toString();
      const baseEndpoint = API_ROUTES.LICENSES.PURCHASED;
      const endpoint = query ? `${baseEndpoint}?${query}` : baseEndpoint;
      
      const response = await api.get<License[]>(endpoint);
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(response.error || 'Error al cargar licencias compradas');
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Error al cargar licencias compradas' 
      }));
    }
  }, [filters]);

  useEffect(() => {
    fetchPurchasedLicenses();
  }, [fetchPurchasedLicenses]);

  return {
    licenses: state.data || [],
    loading: state.isLoading,
    error: state.error,
    refetch: fetchPurchasedLicenses,
  };
};

// Hook para licencias vendidas (artista)
export const useSoldLicenses = (filters?: Omit<LicenseFilters, 'sellerId'>) => {
  const [state, setState] = useState<AsyncState<License[]>>({
    data: [],
    isLoading: false,
    error: null,
  });

  const fetchSoldLicenses = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const params = buildSimpleFilters(filters);
      const query = params.toString();
      const baseEndpoint = API_ROUTES.LICENSES.SOLD;
      const endpoint = query ? `${baseEndpoint}?${query}` : baseEndpoint;
      
      const response = await api.get<License[]>(endpoint);
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(response.error || 'Error al cargar licencias vendidas');
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Error al cargar licencias vendidas' 
      }));
    }
  }, [filters]);

  useEffect(() => {
    fetchSoldLicenses();
  }, [fetchSoldLicenses]);

  return {
    licenses: state.data || [],
    loading: state.isLoading,
    error: state.error,
    refetch: fetchSoldLicenses,
  };
};

// Hook para una licencia específica
export const useLicense = (licenseId: string) => {
  const [state, setState] = useState<AsyncState<License>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const fetchLicense = useCallback(async () => {
    if (!licenseId) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await api.get<License>(API_ROUTES.LICENSES.GET(licenseId));
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(response.error || 'Error al cargar la licencia');
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Error al cargar la licencia' 
      }));
    }
  }, [licenseId]);

  useEffect(() => {
    fetchLicense();
  }, [fetchLicense]);

  return {
    license: state.data,
    loading: state.isLoading,
    error: state.error,
    refetch: fetchLicense,
  };
};

// Hook para crear/comprar licencia
export const useCreateLicense = () => {
  const [state, setState] = useState<AsyncState<License>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const createLicense = useCallback(async (licenseData: CreateLicenseRequest) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await api.post<License>(API_ROUTES.LICENSES.CREATE, licenseData);
      
      if (response.success && response.data) {
        setState({
          data: response.data,
          isLoading: false,
          error: null,
        });
        return response.data;
      } else {
        throw new Error(response.error || 'Error al crear la licencia');
      }
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message || 'Error al crear la licencia' 
      }));
      throw error;
    }
  }, []);

  return {
    license: state.data,
    loading: state.isLoading,
    error: state.error,
    createLicense,
  };
};

// Hook para descargar licencia
export const useDownloadLicense = () => {
  const [state, setState] = useState<{ isLoading: boolean; error: string | null }>({
    isLoading: false,
    error: null,
  });

  const downloadLicense = useCallback(async (licenseId: string) => {
    setState({ isLoading: true, error: null });

    try {
      const response = await api.get<{ downloadUrl: string }>(
        API_ROUTES.LICENSES.DOWNLOAD(licenseId)
      );
      
      if (response.success && response.data?.downloadUrl) {
        // Abrir URL de descarga en nueva ventana
        window.open(response.data.downloadUrl, '_blank');
        setState({ isLoading: false, error: null });
        return response.data.downloadUrl;
      } else {
        throw new Error(response.error || 'Error al obtener el enlace de descarga');
      }
    } catch (error: any) {
      setState({ 
        isLoading: false, 
        error: error.message || 'Error al descargar la licencia' 
      });
      throw error;
    }
  }, []);

  return {
    loading: state.isLoading,
    error: state.error,
    downloadLicense,
  };
};
