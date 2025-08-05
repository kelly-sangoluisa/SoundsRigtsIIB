import React from 'react';
import { UserProfile as UserProfileType } from '../types';

interface UserProfileProps {
  profile: UserProfileType;
  isOwnProfile?: boolean;
  compact?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  profile, 
  isOwnProfile = false,
  compact = false 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `hace ${diffMins} minutos`;
    } else if (diffHours < 24) {
      return `hace ${diffHours} horas`;
    } else {
      return `hace ${diffDays} días`;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    return role === 'artist' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  const getRoleText = (role: string) => {
    return role === 'artist' ? 'Artista' : 'Comprador';
  };

  if (compact) {
    return (
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
          <p className="text-sm text-gray-500 truncate">
            {isOwnProfile || profile.preferences?.privacy?.showEmail ? profile.email : 'Email privado'}
          </p>
        </div>
        <div className="flex-shrink-0">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(profile.role)}`}>
            {getRoleText(profile.role)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header del perfil */}
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
            {profile.avatar}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900 truncate">
              {profile.name}
            </h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(profile.role)}`}>
              {getRoleText(profile.role)}
            </span>
          </div>
          
          <p className="text-sm text-gray-500 mt-1">
            {isOwnProfile || profile.preferences?.privacy?.showEmail ? profile.email : 'Email privado'}
          </p>
          
          {profile.bio && (
            <p className="text-gray-700 mt-3">
              {profile.bio}
            </p>
          )}
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-6 border-t border-gray-200 pt-6">
        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500">
              Miembro desde
            </dt>
            <dd className="text-sm text-gray-900 mt-1">
              {formatDate(profile.joinedAt)}
            </dd>
          </div>
          
          {(isOwnProfile || profile.preferences?.privacy?.showActivity) && (
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Última actividad
              </dt>
              <dd className="text-sm text-gray-900 mt-1">
                {profile.lastActivity ? getTimeAgo(profile.lastActivity) : 'No disponible'}
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Estadísticas */}
      {profile.stats && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas</h3>
          
          {profile.role === 'artist' && (
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {profile.stats.songsPublished || 0}
                </div>
                <div className="text-sm text-gray-500">
                  Canciones publicadas
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {profile.stats.licensesSold || 0}
                </div>
                <div className="text-sm text-gray-500">
                  Licencias vendidas
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  €{(profile.stats.totalEarnings || 0).toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">
                  Ganancias totales
                </div>
              </div>
            </div>
          )}

          {profile.role === 'buyer' && (
            <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {profile.stats.licensesPurchased || 0}
                </div>
                <div className="text-sm text-gray-500">
                  Licencias compradas
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  €{(profile.stats.totalSpent || 0).toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">
                  Total gastado
                </div>
              </div>
              
              {profile.stats.favoriteGenres && profile.stats.favoriteGenres.length > 0 && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500 mb-2">
                    Géneros favoritos
                  </dt>
                  <div className="flex flex-wrap gap-2">
                    {profile.stats.favoriteGenres.map((genre) => (
                      <span 
                        key={genre}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
