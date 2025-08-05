'use client';

import { useState, useEffect } from 'react';
import { License, LicenseFilters } from '../types';
import { mockLicensesAPI } from '../utils/mockLicensesAPI';

export const usePurchasedLicenses = (buyerId: string) => {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<LicenseFilters>({});

  const loadLicenses = async (newFilters?: LicenseFilters) => {
    if (!buyerId) return;
    
    try {
      setIsLoading(true);
      setError('');
      
      const filtersToUse = newFilters || filters;
      const response = await mockLicensesAPI.getPurchasedLicenses(buyerId, filtersToUse);
      
      setLicenses(response.licenses);
      setTotal(response.total);
    } catch (err: any) {
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
      return await mockLicensesAPI.downloadLicense(licenseId, buyerId);
    } catch (err: any) {
      setError(err.message || 'Error al descargar licencia');
      throw err;
    }
  };

  useEffect(() => {
    if (buyerId) {
      loadLicenses();
    }
  }, [buyerId]);

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
