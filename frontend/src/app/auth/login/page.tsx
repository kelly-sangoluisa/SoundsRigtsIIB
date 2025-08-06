'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/lib/api-config';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Intentando login con:', { email });
      
      const response = await fetch(API_ENDPOINTS.AUTH_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error de red' }));
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Login exitoso:', data);
      
      // Guardar el token y datos del usuario en localStorage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirigir al dashboard
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error completo:', err);
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('No se puede conectar al servidor. Verifica que el backend esté funcionando.');
      } else {
        setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#191414] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-white mb-2">
              🎵 <span className="text-[#1db954]">SongRights</span>
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-white mb-2">
            Inicia sesión en SongRights
          </h2>
          <p className="text-gray-400">
            Accede a tu cuenta de descubridor musical
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="spotify-input"
                placeholder="Ingresa tu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="spotify-input"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#1db954] focus:ring-[#1db954] border-gray-600 rounded bg-[#282828]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                Recordarme
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="text-[#1db954] hover:text-[#1ed760] transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="spotify-button w-full text-lg py-4"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-400">
              ¿No tienes una cuenta?{' '}
              <Link href="/auth/register" className="text-[#1db954] hover:text-[#1ed760] transition-colors font-medium">
                Regístrate gratis
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
