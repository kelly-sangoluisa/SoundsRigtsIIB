'use client';

import { useState, useEffect } from 'react';
import { License, LicenseFilters } from '../types';
import { LicensesService } from '../services/LicensesService';

export const usePurchasedLicenses = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<LicenseFilters>({});

  const loadLicenses = async (newFilters?: LicenseFilters) => {
    try {
      setIsLoading(true);
      setError('');
      
      console.log('📋 [usePurchasedLicenses] Cargando licencias compradas...');
      
      const filtersToUse = newFilters || filters;
      const response = await LicensesService.getPurchasedLicenses(filtersToUse);
      
      console.log('✅ [usePurchasedLicenses] Licencias cargadas:', response);
      
      setLicenses(response.licenses);
      setTotal(response.total);
    } catch (err: any) {
      console.error('❌ [usePurchasedLicenses] Error:', err);
      setError(err.message || 'Error al cargar licencias');
      setLicenses([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = (newFilters: LicenseFilters) => {
    setFilters(newFilters);
    loadLicenses(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setFilters(emptyFilters);
    loadLicenses(emptyFilters);
  };

  const refreshLicenses = () => {
    loadLicenses();
  };

  const clearError = () => {
    setError('');
  };

  const downloadLicense = async (licenseId: string): Promise<{ downloadUrl: string; fileName: string }> => {
    try {
      setError('');
      // TODO: Implementar descarga real cuando esté disponible en el backend
      return {
        downloadUrl: `#download-${licenseId}`,
        fileName: `license-${licenseId}.pdf`
      };
    } catch (err: any) {
      setError(err.message || 'Error al descargar licencia');
      throw err;
    }
  };

  useEffect(() => {
    loadLicenses();
  }, []);

  return {
    licenses,
    isLoading,
    error,
    total,
    filters,
    applyFilters,
    clearFilters,
    refreshLicenses,
    clearError,
    downloadLicense
  };
};
