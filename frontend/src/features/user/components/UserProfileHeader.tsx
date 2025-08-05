import React, { useState } from 'react';
import Link from 'next/link';
import { useUserProfile } from '../hooks/useUserProfile';

interface UserProfileHeaderProps {
  userId: string;
}

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({ userId }) => {
  const { profile, loading, error } = useUserProfile(userId);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-500 text-sm">👤</span>
        </div>
        <span className="text-sm text-gray-500">Usuario</span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Trigger del dropdown */}
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-3 text-left p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
            {profile.avatar}
          </div>
        </div>
        <div className="min-w-0 flex-1 hidden sm:block">
          <p className="text-sm font-medium text-gray-900 truncate">
            {profile.name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {profile.role === 'artist' ? 'Artista' : 'Comprador'}
          </p>
        </div>
        <div className="flex-shrink-0">
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Información del usuario */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                  {profile.avatar}
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {profile.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {profile.email}
                </p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                  profile.role === 'artist' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {profile.role === 'artist' ? 'Artista' : 'Comprador'}
                </span>
              </div>
            </div>
          </div>

          {/* Estadísticas rápidas */}
          {profile.stats && (
            <div className="px-4 py-3 border-b border-gray-200">
              <div className="text-xs font-medium text-gray-500 mb-2">Estadísticas</div>
              {profile.role === 'artist' && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="font-semibold text-purple-600">
                      {profile.stats.songsPublished || 0}
                    </div>
                    <div className="text-gray-500">Canciones</div>
                  </div>
                  <div>
                    <div className="font-semibold text-green-600">
                      {profile.stats.licensesSold || 0}
                    </div>
                    <div className="text-gray-500">Licencias</div>
                  </div>
                </div>
              )}
              {profile.role === 'buyer' && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="font-semibold text-blue-600">
                      {profile.stats.licensesPurchased || 0}
                    </div>
                    <div className="text-gray-500">Compradas</div>
                  </div>
                  <div>
                    <div className="font-semibold text-green-600">
                      €{(profile.stats.totalSpent || 0).toFixed(0)}
                    </div>
                    <div className="text-gray-500">Gastado</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Enlaces de navegación */}
          <div className="py-1">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              onClick={closeDropdown}
            >
              <div className="flex items-center space-x-2">
                <span>👤</span>
                <span>Mi perfil</span>
              </div>
            </Link>
            
            <Link
              href="/profile/settings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              onClick={closeDropdown}
            >
              <div className="flex items-center space-x-2">
                <span>⚙️</span>
                <span>Configuración</span>
              </div>
            </Link>

            {profile.role === 'artist' && (
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                onClick={closeDropdown}
              >
                <div className="flex items-center space-x-2">
                  <span>📊</span>
                  <span>Dashboard</span>
                </div>
              </Link>
            )}

            {profile.role === 'buyer' && (
              <Link
                href="/licenses"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                onClick={closeDropdown}
              >
                <div className="flex items-center space-x-2">
                  <span>📄</span>
                  <span>Mis licencias</span>
                </div>
              </Link>
            )}

            <hr className="my-1" />
            
            <button
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => {
                closeDropdown();
                // Aquí iría la lógica de logout
                console.log('Logout');
              }}
            >
              <div className="flex items-center space-x-2">
                <span>🚪</span>
                <span>Cerrar sesión</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Overlay para cerrar dropdown */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={closeDropdown}
        />
      )}
    </div>
  );
};
