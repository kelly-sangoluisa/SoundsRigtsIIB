'use client';

import { useState } from 'react';
import { RouteGuard } from '@/shared/components/RouteGuard';
import { DashboardLayout } from '@/shared/components/DashboardLayout';
import { useAuth } from '@/shared/hooks/useAuth';

// Componente de contenido del modo comprador
const BuyerDashboard = () => {
  debugger; // 🔍 Punto de debug U: BuyerDashboard renderizado
  console.log('🔍 BuyerDashboard - rendered');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          🛒 Explorar Canciones
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Descubre y compra licencias de música increíble
        </p>
      </div>

      {/* Cards de estadísticas para comprador */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Canciones Disponibles</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">1,234</p>
            </div>
            <div className="text-3xl">🎵</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Mis Compras</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
            </div>
            <div className="text-3xl">🛍️</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Favoritos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">45</p>
            </div>
            <div className="text-3xl">❤️</div>
          </div>
        </div>
      </div>

      {/* Lista de canciones populares */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🔥 Canciones Populares
          </h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    🎵
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Canción Demo {i}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Artista Demo • Pop • 3:24</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-bold text-green-600">$2.99</span>
                  <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    Comprar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de contenido del modo artista
const ArtistDashboard = () => {
  debugger; // 🔍 Punto de debug V: ArtistDashboard renderizado
  console.log('🔍 ArtistDashboard - rendered');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          🎤 Panel de Artista
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Gestiona tus canciones y ventas
        </p>
      </div>

      {/* Cards de estadísticas para artista */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Mis Canciones</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
            </div>
            <div className="text-3xl">🎵</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ventas Este Mes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ingresos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">$486</p>
            </div>
            <div className="text-3xl">💵</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pendientes</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
            </div>
            <div className="text-3xl">⏳</div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🎵 Mis Canciones Recientes
            </h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Mi Canción {i}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Pop • $2.99</p>
                  </div>
                  <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    En venta
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
              + Subir Nueva Canción
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              💰 Ventas Recientes
            </h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Venta #{i}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Comprador Demo</p>
                  </div>
                  <span className="font-semibold text-green-600">$2.99</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
              Ver Todas las Ventas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [currentMode, setCurrentMode] = useState<'buyer' | 'artist'>('buyer'); // Por defecto comprador

  debugger; // 🔍 Punto de debug W: DashboardPage renderizado
  console.log('🔍 DashboardPage - current mode:', currentMode);
  console.log('🔍 DashboardPage - user:', user);

  const handleModeChange = (mode: 'buyer' | 'artist') => {
    debugger; // 🔍 Punto de debug X: Cambio de modo en dashboard
    console.log('🔍 DashboardPage - mode changed to:', mode);
    setCurrentMode(mode);
  };

  return (
    <RouteGuard>
      <DashboardLayout
        currentMode={currentMode}
        onModeChange={handleModeChange}
        title={currentMode === 'buyer' ? 'Explorar Canciones' : 'Panel de Artista'}
      >
        {currentMode === 'buyer' ? <BuyerDashboard /> : <ArtistDashboard />}
      </DashboardLayout>
    </RouteGuard>
  );
}
