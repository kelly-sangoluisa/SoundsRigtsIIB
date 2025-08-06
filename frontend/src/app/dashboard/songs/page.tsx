'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/shared/components/DashboardLayout';

export default function SongsPage() {
  const [currentMode, setCurrentMode] = useState<'artist' | 'buyer'>('artist');

  return (
    <DashboardLayout
      currentMode={currentMode}
      onModeChange={setCurrentMode}
      title="Mis Canciones"
    >
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${
                currentMode === 'artist' ? 'text-purple-800' : 'text-blue-800'
              }`}>
                🎵 Mis Canciones
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Gestiona tu biblioteca musical y sube nuevas canciones
              </p>
            </div>
            <button className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${
              currentMode === 'artist'
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}>
              ➕ Nueva Canción
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow">
              <div className={`w-full h-32 rounded-lg mb-4 flex items-center justify-center text-4xl ${
                currentMode === 'artist' ? 'bg-purple-100' : 'bg-blue-100'
              }`}>
                🎵
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Canción {i}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Género: Pop • Duración: 3:24
              </p>
              <div className="flex space-x-2">
                <button className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  currentMode === 'artist'
                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}>
                  ▶️ Reproducir
                </button>
                <button className="py-2 px-3 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                  ⚙️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
