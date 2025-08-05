'use client';

import { useState } from 'react';
import { Song } from '../types';
import { useAuth } from '@/shared/hooks/useAuth';
import { mockSongsAPI } from '@/shared/utils/mockSongsAPI';

interface PurchaseModalProps {
  song: Song;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
}

export const PurchaseModal = ({ song, isOpen, onClose, onSuccess }: PurchaseModalProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    message: '',
    offerPrice: song.price
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Debes estar autenticado para realizar una compra');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await mockSongsAPI.purchaseSong({
        songId: song.id,
        buyerMessage: formData.message,
        offerPrice: formData.offerPrice,
        buyerId: user.id,
        buyerName: user.name || user.email,
        buyerEmail: user.email
      });

      onSuccess(response.message);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error al procesar la compra');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriceChange = (value: number) => {
    setFormData(prev => ({
      ...prev,
      offerPrice: Math.max(0, value)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Solicitar compra
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {song.name} - {song.artist}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Precio */}
            <div>
              <label htmlFor="offerPrice" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Precio de oferta
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <input
                  id="offerPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.offerPrice}
                  onChange={(e) => handlePriceChange(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  disabled={isLoading}
                />
              </div>
              <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Precio original: ${song.price.toFixed(2)}</span>
                {formData.offerPrice !== song.price && (
                  <span className={formData.offerPrice > song.price ? 'text-green-600' : 'text-orange-600'}>
                    {formData.offerPrice > song.price ? 'Oferta mayor' : 'Oferta menor'}
                  </span>
                )}
              </div>
            </div>

            {/* Mensaje */}
            <div>
              <label htmlFor="buyerMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mensaje para el artista (opcional)
              </label>
              <textarea
                id="buyerMessage"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Cuéntale al artista por qué te interesa esta canción..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Un mensaje personalizado puede ayudar a que el artista acepte tu solicitud.
              </p>
            </div>

            {/* Información importante */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                ℹ️ Información importante
              </h4>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Tu solicitud se enviará al artista</li>
                <li>• La canción se reservará temporalmente</li>
                <li>• El artista tiene 48 horas para responder</li>
                <li>• Si acepta, recibirás la licencia por email</li>
                <li>• Si rechaza o expira, se liberará automáticamente</li>
              </ul>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading || formData.offerPrice <= 0}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Enviar solicitud
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
