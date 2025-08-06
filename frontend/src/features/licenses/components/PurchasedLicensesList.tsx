'use client';

import { useState } from 'react';
import { License } from '../types';
import { getLicenseStatusLabel, getLicenseStatusColor, formatDate } from '../utils/mockLicensesAPI';

interface PurchasedLicensesListProps {
  licenses: License[];
  isLoading: boolean;
  onDownload: (licenseId: string) => Promise<{ downloadUrl: string; fileName: string }>;
  onRefresh: () => void;
}

export const PurchasedLicensesList = ({ licenses, isLoading, onDownload, onRefresh }: PurchasedLicensesListProps) => {
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);

  const handleDownload = async (license: License) => {
    if (license.status !== 'active') {
      alert('Solo puedes descargar licencias activas');
      return;
    }

    setDownloadingIds(prev => new Set(prev).add(license.id));
    
    try {
      const { downloadUrl, fileName } = await onDownload(license.id);
      
      // Simular descarga (en una app real, esto sería un enlace real)
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert(`Descarga iniciada: ${fileName}`);
    } catch (error: any) {
      alert(`Error al descargar: ${error.message}`);
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(license.id);
        return newSet;
      });
    }
  };

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
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No tienes licencias compradas
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Explora canciones y compra licencias para que aparezcan aquí.
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
                  {/* Icono de licencia */}
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-lg bg-gradient-to-r from-green-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                      📄
                    </div>
                  </div>

                  {/* Información de la licencia */}
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
                        <span>Artista: {license.songArtist}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a1 1 0 110 2h-1v11a3 3 0 01-3 3H6a3 3 0 01-3-3V9H2a1 1 0 110-2h3z" />
                        </svg>
                        <span>Género: {license.songGenre}</span>
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

                {/* Precio y acciones */}
                <div className="flex flex-col items-end space-y-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${license.price.toFixed(2)}
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
                        onClick={() => handleDownload(license)}
                        disabled={downloadingIds.has(license.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {downloadingIds.has(license.id) ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                            Descargando...
                          </>
                        ) : (
                          <>
                            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Descargar
                          </>
                        )}
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
        <LicenseDetailsModal
          license={selectedLicense}
          onClose={() => setSelectedLicense(null)}
          onDownload={handleDownload}
          isDownloading={downloadingIds.has(selectedLicense.id)}
        />
      )}
    </>
  );
};

// Modal para mostrar detalles de la licencia
interface LicenseDetailsModalProps {
  license: License;
  onClose: () => void;
  onDownload: (license: License) => void;
  isDownloading: boolean;
}

const LicenseDetailsModal = ({ license, onClose, onDownload, isDownloading }: LicenseDetailsModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Detalles de la Licencia
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
                Información de la Canción
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Título:</span>
                  <p className="text-gray-900 dark:text-white">{license.songName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Artista:</span>
                  <p className="text-gray-900 dark:text-white">{license.songArtist}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Género:</span>
                  <p className="text-gray-900 dark:text-white">{license.songGenre}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Precio:</span>
                  <p className="text-gray-900 dark:text-white">${license.price.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Información de la licencia */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Información de la Licencia
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
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Estado:</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLicenseStatusColor(license.status)}`}>
                    {getLicenseStatusLabel(license.status)}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Tipo:</span>
                  <p className="text-gray-900 dark:text-white">
                    {license.licenseType === 'commercial' ? 'Comercial' : 'Personal'}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Fecha de Compra:</span>
                  <p className="text-gray-900 dark:text-white">{formatDate(license.purchaseDate)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Vendedor:</span>
                  <p className="text-gray-900 dark:text-white">{license.sellerName}</p>
                </div>
              </div>
            </div>

            {/* Términos de uso */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Derechos de Uso
              </h3>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>✅ Uso comercial ilimitado</li>
                <li>✅ Modificación y edición permitida</li>
                <li>✅ Uso en proyectos audiovisuales</li>
                <li>✅ Distribución como parte de trabajos derivados</li>
                <li>❌ Reventa de la pista original</li>
                <li>❌ Reclamación de autoría</li>
              </ul>
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
            {license.status === 'active' && (
              <button
                onClick={() => onDownload(license)}
                disabled={isDownloading}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Descargando...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Descargar Licencia
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
