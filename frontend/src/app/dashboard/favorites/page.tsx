'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/shared/components/DashboardLayout';

export default function FavoritesPage() {
  const [currentMode, setCurrentMode] = useState<'artist' | 'buyer'>('buyer');

  return (
    <DashboardLayout
      currentMode={currentMode}
      onModeChange={setCurrentMode}
      title="Favoritos"
    >
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <h1 className={`text-3xl font-bold mb-2 ${
            currentMode === 'artist' ? 'text-purple-800' : 'text-blue-800'
          }`}>
            ❤️ Mis Favoritos
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Canciones y artistas que has marcado como favoritos
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button className="py-4 px-1 border-b-2 border-blue-500 font-medium text-sm text-blue-600">
                🎵 Canciones (12)
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                🎤 Artistas (5)
              </button>
              <button className="py-4 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
                🎼 Álbumes (3)
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Lista de canciones favoritas */}
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                    🎵
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      Canción Favorita {i}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      por Artista Increíble {i} • Pop • 3:24
                    </p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="text-xs text-gray-500">Agregado hace {i} días</span>
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Disponible
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      ▶️
                    </button>
                    <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                      🛒
                    </button>
                    <button className="p-2 text-red-400 hover:text-red-600 transition-colors">
                      💔
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Paginación */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Mostrando 1-6 de 12 canciones
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                  Anterior
                </button>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                  1
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                  2
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recomendaciones */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            🎯 Recomendaciones Basadas en tus Favoritos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="w-full h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg mb-3 flex items-center justify-center text-2xl">
                  🎵
                </div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1">
                  Canción Recomendada {i}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  por Nuevo Artista {i}
                </p>
                <div className="flex space-x-2">
                  <button className="flex-1 py-2 px-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                    ▶️ Escuchar
                  </button>
                  <button className="py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                    ❤️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
