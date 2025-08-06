'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/lib/api-config';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    if (!agreedToTerms) {
      setError('Debes aceptar los términos y condiciones');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Intentando registro con:', { firstName: formData.firstName, lastName: formData.lastName, email: formData.email });
      
      const response = await fetch(API_ENDPOINTS.AUTH_REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error de red' }));
        console.error('Error del servidor:', errorData);
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Registro exitoso:', data);
      
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
        setError(err.message || 'Error al crear la cuenta. Inténtalo de nuevo.');
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
            Regístrate gratis
          </h2>
          <p className="text-gray-400">
            Únete a la comunidad de descubridores musicales
          </p>
        </div>

        {/* Register Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-white mb-2">
                  Nombre
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  className="spotify-input"
                  placeholder="Tu nombre"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-white mb-2">
                  Apellido
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  className="spotify-input"
                  placeholder="Tu apellido"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
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
                value={formData.email}
                onChange={handleInputChange}
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
                required
                className="spotify-input"
                placeholder="Crea una contraseña"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                Confirmar contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="spotify-input"
                placeholder="Confirma tu contraseña"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-3">
            <input
              id="agreedToTerms"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-[#1db954] focus:ring-[#1db954] border-gray-600 rounded bg-[#282828]"
            />
            <label htmlFor="agreedToTerms" className="text-sm text-gray-400">
              Acepto los{' '}
              <Link href="/terms" className="text-[#1db954] hover:underline">
                términos y condiciones
              </Link>{' '}
              y la{' '}
              <Link href="/privacy" className="text-[#1db954] hover:underline">
                política de privacidad
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="spotify-button w-full disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#191414] mr-2"></div>
                  Creando cuenta...
                </span>
              ) : (
                'Registrarse'
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/auth/login" className="text-[#1db954] hover:underline font-medium">
                Inicia sesión
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
