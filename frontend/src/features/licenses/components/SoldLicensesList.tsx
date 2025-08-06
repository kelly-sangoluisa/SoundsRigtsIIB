'use client';

import { useState } from 'react';
import { License } from '../types';
import { getLicenseStatusLabel, getLicenseStatusColor, formatDate } from '../utils/mockLicensesAPI';

interface SoldLicensesListProps {
  licenses: License[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const SoldLicensesList = ({ licenses, isLoading, onRefresh }: SoldLicensesListProps) => {
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="h-16 w-16 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/6"></div>
                </div>
              </div>
              <div className="h-10 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (licenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💰</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No has vendido licencias aún
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Cuando otros usuarios compren tus canciones, las licencias aparecerán aquí.
        </p>
        <button
          onClick={onRefresh}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualizar
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {licenses.map((license) => (
          <div 
            key={license.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  {/* Icono de venta */}
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 flex items-center justify-center text-white text-xl font-bold">
                      💰
                    </div>
                  </div>

                  {/* Información de la venta */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {license.songName}
                      </h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLicenseStatusColor(license.status)}`}>
                        {getLicenseStatusLabel(license.status)}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Comprador: {license.buyerName}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>{license.buyerEmail}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0a2 2 0 01-2-2v-5.586l-4.414-4.414z" />
                        </svg>
                        <span>ID: {license.transactionId}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ganancia y acciones */}
                <div className="flex flex-col items-end space-y-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      +${license.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(license.purchaseDate)}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedLicense(license)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Detalles
                    </button>

                    {license.status === 'active' && (
                      <button
                        onClick={() => window.open(`mailto:${license.buyerEmail}?subject=Licencia ${license.songName}&body=Hola ${license.buyerName}, gracias por comprar la licencia de mi canción.`)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Contactar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de detalles */}
      {selectedLicense && (
        <SoldLicenseDetailsModal
          license={selectedLicense}
          onClose={() => setSelectedLicense(null)}
        />
      )}
    </>
  );
};

// Modal para mostrar detalles de la licencia vendida
interface SoldLicenseDetailsModalProps {
  license: License;
  onClose: () => void;
}

const SoldLicenseDetailsModal = ({ license, onClose }: SoldLicenseDetailsModalProps) => {
  const totalEarned = license.price;
  const platformFee = totalEarned * 0.1; // 10% comisión de plataforma
  const netEarnings = totalEarned - platformFee;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Detalles de la Venta
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Contenido */}
          <div className="space-y-6">
            {/* Información de la canción */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Canción Vendida
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Título:</span>
                  <p className="text-gray-900 dark:text-white">{license.songName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Género:</span>
                  <p className="text-gray-900 dark:text-white">{license.songGenre}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Fecha de Venta:</span>
                  <p className="text-gray-900 dark:text-white">{formatDate(license.purchaseDate)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Estado:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLicenseStatusColor(license.status)}`}>
                    {getLicenseStatusLabel(license.status)}
                  </span>
                </div>
              </div>
            </div>

            {/* Información del comprador */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Información del Comprador
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Nombre:</span>
                  <p className="text-gray-900 dark:text-white">{license.buyerName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                  <p className="text-gray-900 dark:text-white">{license.buyerEmail}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">ID de Usuario:</span>
                  <p className="text-gray-900 dark:text-white font-mono">{license.buyerId}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Tipo de Licencia:</span>
                  <p className="text-gray-900 dark:text-white">
                    {license.licenseType === 'commercial' ? 'Comercial' : 'Personal'}
                  </p>
                </div>
              </div>
            </div>

            {/* Desglose financiero */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Desglose de Ingresos
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Precio de Venta:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">${totalEarned.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Comisión de Plataforma (10%):</span>
                  <span className="font-semibold text-red-600 dark:text-red-400">-${platformFee.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900 dark:text-white">Ganancia Neta:</span>
                    <span className="font-bold text-green-600 dark:text-green-400 text-lg">${netEarnings.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Información de la transacción */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Información de la Transacción
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">ID de Licencia:</span>
                  <p className="text-gray-900 dark:text-white font-mono">{license.id}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">ID de Transacción:</span>
                  <p className="text-gray-900 dark:text-white font-mono">{license.transactionId}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cerrar
            </button>
            <button
              onClick={() => window.open(`mailto:${license.buyerEmail}?subject=Licencia ${license.songName}&body=Hola ${license.buyerName}, gracias por comprar la licencia de mi canción "${license.songName}". Si tienes alguna pregunta sobre el uso de la licencia, no dudes en contactarme.`)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
            >
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Contactar Comprador
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
