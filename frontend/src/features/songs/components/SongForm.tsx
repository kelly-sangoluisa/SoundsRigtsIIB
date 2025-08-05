'use client';

import { useState } from 'react';
import { CreateSongRequest, SongGenre } from '../types';

interface SongFormProps {
  onSubmit: (songData: CreateSongRequest) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Partial<CreateSongRequest>;
  submitLabel?: string;
}

const GENRE_OPTIONS: { value: SongGenre; label: string }[] = [
  { value: 'rock', label: 'Rock' },
  { value: 'pop', label: 'Pop' },
  { value: 'jazz', label: 'Jazz' },
  { value: 'classical', label: 'Clásica' },
  { value: 'electronic', label: 'Electrónica' },
  { value: 'hip-hop', label: 'Hip-Hop' },
  { value: 'reggae', label: 'Reggae' },
  { value: 'country', label: 'Country' },
  { value: 'blues', label: 'Blues' },
  { value: 'folk', label: 'Folk' },
];

export const SongForm = ({ 
  onSubmit, 
  onCancel, 
  isLoading = false, 
  initialData = {},
  submitLabel = 'Crear Canción'
}: SongFormProps) => {
  const [formData, setFormData] = useState<CreateSongRequest>({
    name: initialData.name || '',
    genre: initialData.genre || 'pop',
    duration: initialData.duration || 0,
    price: initialData.price || 0,
    url: initialData.url || '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateSongRequest, string>>>({});

  // Formatear duración de segundos a MM:SS
  const formatDurationInput = (seconds: number): string => {
    if (seconds === 0) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Convertir MM:SS a segundos
  const parseDurationInput = (value: string): number => {
    if (!value) return 0;
    const [minutes, seconds] = value.split(':').map(Number);
    return (minutes || 0) * 60 + (seconds || 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'duration') {
      // Manejar entrada de duración en formato MM:SS
      const seconds = parseDurationInput(value);
      setFormData((prev: CreateSongRequest) => ({ ...prev, [name]: seconds }));
    } else if (name === 'price') {
      setFormData((prev: CreateSongRequest) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData((prev: CreateSongRequest) => ({ ...prev, [name]: value }));
    }

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name as keyof CreateSongRequest]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateSongRequest, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre de la canción es requerido';
    }

    if (!formData.genre) {
      newErrors.genre = 'El género es requerido';
    }

    if (formData.duration <= 0) {
      newErrors.duration = 'La duración debe ser mayor a 0';
    }

    if (formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'La URL es requerida';
    } else if (!isValidUrl(formData.url)) {
      newErrors.url = 'La URL debe ser válida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        {initialData.name ? 'Editar Canción' : 'Nueva Canción'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre de la canción */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Nombre de la Canción *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ej: Midnight Dreams"
            disabled={isLoading}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Género */}
        <div>
          <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Género *
          </label>
          <select
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.genre ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          >
            {GENRE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.genre && <p className="mt-1 text-sm text-red-600">{errors.genre}</p>}
        </div>

        {/* Duración y Precio en la misma fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Duración */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duración (MM:SS) *
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formatDurationInput(formData.duration)}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.duration ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="3:45"
              pattern="[0-9]+:[0-5][0-9]"
              disabled={isLoading}
            />
            {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
          </div>

          {/* Precio */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Precio (USD) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price || ''}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="4.99"
              disabled={isLoading}
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>
        </div>

        {/* URL del archivo */}
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            URL del Archivo de Audio *
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.url ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="https://example.com/mi-cancion.mp3"
            disabled={isLoading}
          />
          {errors.url && <p className="mt-1 text-sm text-red-600">{errors.url}</p>}
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            En una aplicación real, aquí se subiría el archivo de audio
          </p>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Guardando...
              </div>
            ) : (
              submitLabel
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
