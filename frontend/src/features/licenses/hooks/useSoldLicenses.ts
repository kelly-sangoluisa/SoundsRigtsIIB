'use client';

import { useState, useEffect } from 'react';
import { License, LicenseFilters } from '../types';
import { LicensesService } from '../services/LicensesService';

export const useSoldLicenses = () => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<LicenseFilters>({});

  const loadLicenses = async (newFilters?: LicenseFilters) => {
    try {
      setIsLoading(true);
      setError('');
      
      console.log('📋 [useSoldLicenses] Cargando licencias vendidas...');
      
      const filtersToUse = newFilters || filters;
      const response = await LicensesService.getSoldLicenses(filtersToUse);
      
      console.log('✅ [useSoldLicenses] Licencias cargadas:', response);
      
      setLicenses(response.licenses);
      setTotal(response.total);
    } catch (err: any) {
      console.error('❌ [useSoldLicenses] Error:', err);
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
    clearError
  };
};
