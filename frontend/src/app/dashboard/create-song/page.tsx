'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { songsService } from '@/lib/songs-service';

interface SongForm {
  title: string;
  artist: string;
  genre: string;
  price: number;
  duration: string;
  description: string;
  lyrics: string;
}

export default function CreateSong() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SongForm>({
    title: '',
    artist: '',
    genre: '',
    price: 0,
    duration: '',
    description: '',
    lyrics: ''
  });
  const router = useRouter();

  const genres = ['Pop', 'Electronic', 'Folk', 'Hip Hop', 'Rock', 'Jazz', 'R&B', 'Country', 'Classical', 'Reggae'];

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    const user = JSON.parse(userData);
    setUser(user);
    // Pre-llenar el campo artista con el nombre del usuario
    setFormData(prev => ({
      ...prev,
      artist: `${user.firstName} ${user.lastName}`
    }));
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🎵 Formulario enviado - Iniciando proceso de creación de canción');
    setIsLoading(true);

    try {
      // Validar que tengamos todos los datos necesarios
      if (!user) {
        console.error('❌ Usuario no autenticado');
        alert('Error: Usuario no autenticado. Por favor, inicia sesión nuevamente.');
        return;
      }

      console.log('👤 Usuario autenticado:', user);

      // Validar que los campos requeridos estén llenos
      if (!formData.title || !formData.artist || !formData.genre || !formData.price) {
        console.error('❌ Campos requeridos faltantes');
        alert('Error: Por favor, completa todos los campos requeridos.');
        return;
      }

      console.log('📝 Datos del formulario:', formData);

      // Convertir duración de MM:SS a segundos
      const [minutes, seconds] = formData.duration.split(':').map(num => parseInt(num) || 0);
      const durationInSeconds = minutes * 60 + seconds;

      const songData = {
        title: formData.title,
        artist: formData.artist,
        genre: formData.genre,
        duration: durationInSeconds,
        price: formData.price,
        description: formData.description,
        ownerId: user.id || user._id, // Usar id o _id dependiendo de lo que tenga el usuario
        tags: formData.lyrics ? ['original'] : []
      };

      console.log('🎶 Datos de la canción a enviar:', songData);
      console.log('👤 Usuario completo:', user);

      console.log('🚀 Enviando solicitud al backend...');
      const result = await songsService.createSong(songData);
      console.log('✅ Canción creada exitosamente:', result);
      
      alert('¡Canción creada exitosamente!');
      router.push('/dashboard');
    } catch (error) {
      console.error('❌ Error al crear la canción:', error);
      alert('Error al crear la canción. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  const testBackendConnection = async () => {
    try {
      console.log('🧪 Probando conexión al backend...');
      const response = await fetch('http://localhost:3002/songs');
      console.log('🧪 Respuesta del backend:', response.status, response.ok);
      
      if (response.ok) {
        const songs = await response.json();
        console.log('🧪 Canciones encontradas:', songs.length);
        alert(`✅ Backend funcionando! ${songs.length} canciones encontradas`);
      } else {
        alert(`❌ Backend no responde: ${response.status}`);
      }
    } catch (error) {
      console.error('🧪 Error de conexión:', error);
      alert(`❌ Error de conexión: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-spotify-black via-spotify-dark-gray to-spotify-black">
      {/* Header */}
      <header className="bg-spotify-gray/50 backdrop-blur-sm border-b border-spotify-light-gray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className="text-spotify-light-gray hover:text-white transition-colors"
              >
                ← Volver al Dashboard
              </button>
              <h1 className="text-2xl font-bold text-white">🎵 Crear Nueva Canción</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-spotify-light-gray">
                {user.firstName} {user.lastName}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-spotify-gray/50 rounded-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Publica tu canción
            </h2>
            <p className="text-spotify-light-gray">
              Completa la información de tu canción para ponerla a la venta en el marketplace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
                  Título de la Canción *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="spotify-input"
                  placeholder="Ej: Midnight Dreams"
                />
              </div>

              <div>
                <label htmlFor="artist" className="block text-sm font-medium text-white mb-2">
                  Artista *
                </label>
                <input
                  type="text"
                  id="artist"
                  name="artist"
                  value={formData.artist}
                  onChange={handleInputChange}
                  required
                  className="spotify-input"
                  placeholder="Nombre del artista"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-white mb-2">
                  Género *
                </label>
                <select
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleInputChange}
                  required
                  className="spotify-input"
                >
                  <option value="">Selecciona un género</option>
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-white mb-2">
                  Precio (USD) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="1"
                  step="0.01"
                  required
                  className="spotify-input"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-white mb-2">
                  Duración *
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  className="spotify-input"
                  placeholder="3:24"
                  pattern="[0-9]+:[0-5][0-9]"
                  title="Formato: MM:SS (ej: 3:24)"
                />
              </div>
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                Descripción de la Canción
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="spotify-input resize-none"
                placeholder="Describe tu canción, su inspiración, estilo, etc..."
              />
            </div>

            {/* Letra */}
            <div>
              <label htmlFor="lyrics" className="block text-sm font-medium text-white mb-2">
                Letra de la Canción
              </label>
              <textarea
                id="lyrics"
                name="lyrics"
                value={formData.lyrics}
                onChange={handleInputChange}
                rows={8}
                className="spotify-input resize-none"
                placeholder="Escribe aquí la letra de tu canción..."
              />
            </div>

            {/* Upload de Archivo */}
            <div className="border-2 border-dashed border-spotify-light-gray rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Subir Archivo de Audio
              </h3>
              <p className="text-spotify-light-gray mb-4">
                Arrastra y suelta tu archivo de audio aquí o haz clic para seleccionar
              </p>
              <button
                type="button"
                className="bg-spotify-gray text-white px-6 py-2 rounded-lg hover:bg-spotify-light-gray transition-colors"
              >
                Seleccionar Archivo
              </button>
              <p className="text-xs text-spotify-light-gray mt-2">
                Formatos soportados: MP3, WAV, FLAC (máx. 50MB)
              </p>
            </div>

            {/* Términos y Condiciones */}
            <div className="bg-spotify-dark-gray rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 h-4 w-4 text-spotify-green"
                />
                <label htmlFor="terms" className="text-sm text-spotify-light-gray">
                  Acepto los términos y condiciones de SongRights. Confirmo que tengo todos los derechos 
                  sobre esta canción y autorizo su venta en la plataforma.
                </label>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {/* Botones de prueba para debugging */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    console.log('🔍 Datos del usuario:', user);
                    console.log('🔍 Token en localStorage:', localStorage.getItem('token'));
                    console.log('🔍 Datos del formulario:', formData);
                    alert('Verifica la consola del navegador para los logs de debugging');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
                >
                  🔍 Debug Info
                </button>
                
                <button
                  type="button"
                  onClick={testBackendConnection}
                  className="px-4 py-2 bg-green-600 text-white rounded text-sm"
                >
                  🧪 Test Backend
                </button>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="spotify-button flex-1 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-spotify-black mr-2"></div>
                    Publicando...
                  </span>
                ) : (
                  '🎼 Publicar Canción'
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-3 border border-spotify-light-gray text-white rounded-full hover:bg-spotify-gray transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        {/* Preview Card */}
        {formData.title && (
          <div className="mt-8 bg-spotify-gray/50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Vista Previa</h3>
            <div className="bg-spotify-gray rounded-lg p-4 max-w-sm">
              <div className="aspect-square bg-spotify-light-gray rounded-lg mb-4 flex items-center justify-center">
                <span className="text-4xl">🎵</span>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-white text-lg truncate">
                  {formData.title || 'Título de la canción'}
                </h4>
                <p className="text-spotify-light-gray text-sm">
                  {formData.artist || 'Nombre del artista'}
                </p>
                <div className="flex justify-between items-center text-xs text-spotify-light-gray">
                  <span>{formData.genre || 'Género'}</span>
                  <span>{formData.duration || '0:00'}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-spotify-green">
                    ${formData.price || '0.00'}
                  </span>
                  <button className="bg-spotify-green text-spotify-black px-4 py-2 rounded-full text-sm font-semibold">
                    Comprar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
