'use client';

import { useAuth } from '@/shared/hooks/useAuth';

export const UserInfo = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Bienvenido, {user.name || user.email}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {user.email} • {user.role}
          </p>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};
