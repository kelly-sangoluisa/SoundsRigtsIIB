'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/shared/components/DashboardLayout';

export default function HistoryPage() {
  const [currentMode, setCurrentMode] = useState<'artist' | 'buyer'>('buyer');

  return (
    <DashboardLayout
      currentMode={currentMode}
      onModeChange={setCurrentMode}
      title="Historial"
    >
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <h1 className={`text-3xl font-bold mb-2 ${
            currentMode === 'artist' ? 'text-purple-800' : 'text-blue-800'
          }`}>
            📋 Historial de Actividad
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Revisa todo tu historial de actividad en la plataforma
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option>Todas las actividades</option>
              <option>Compras</option>
              <option>Reproducciones</option>
              <option>Búsquedas</option>
              <option>Favoritos</option>
              <option>Descargas</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option>Últimos 7 días</option>
              <option>Últimos 30 días</option>
              <option>Últimos 3 meses</option>
              <option>Último año</option>
            </select>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              🔍 Filtrar
            </button>
          </div>
        </div>

        {/* Timeline de actividad */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <div className="space-y-6">
            {/* Hoy */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                📅 Hoy - 15 de Enero, 2024
              </h3>
              <div className="space-y-3 ml-6 border-l-2 border-blue-200 dark:border-blue-800 pl-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm">
                    💰
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Compraste la licencia comercial de "Canción Épica"
                    </p>
                    <p className="text-xs text-gray-500">hace 2 horas • $150</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-sm">
                    ❤️
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Agregaste "Melodía Nocturna" a tus favoritos
                    </p>
                    <p className="text-xs text-gray-500">hace 4 horas</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">
                    ▶️
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Reprodujiste "Ritmo Urbano" 5 veces
                    </p>
                    <p className="text-xs text-gray-500">hace 6 horas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ayer */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                📅 Ayer - 14 de Enero, 2024
              </h3>
              <div className="space-y-3 ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm">
                    🔍
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Buscaste canciones de "Rock alternativo"
                    </p>
                    <p className="text-xs text-gray-500">14:30 • 25 resultados</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm">
                    📥
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Descargaste los archivos de "Canción Clásica"
                    </p>
                    <p className="text-xs text-gray-500">10:15</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-sm">
                    ⭐
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Calificaste "Balada Romántica" con 5 estrellas
                    </p>
                    <p className="text-xs text-gray-500">09:45</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hace 3 días */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                📅 12 de Enero, 2024
              </h3>
              <div className="space-y-3 ml-6 border-l-2 border-gray-200 dark:border-gray-700 pl-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">
                    👤
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Actualizaste tu perfil de usuario
                    </p>
                    <p className="text-xs text-gray-500">16:20</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm">
                    💰
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      Compraste la licencia básica de "Instrumental Jazz"
                    </p>
                    <p className="text-xs text-gray-500">11:30 • $50</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas del historial */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">🛒</div>
            <div className="text-2xl font-bold text-blue-600">23</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Compras Totales</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">▶️</div>
            <div className="text-2xl font-bold text-green-600">1,247</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Reproducciones</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">❤️</div>
            <div className="text-2xl font-bold text-red-600">89</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Favoritos</div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 text-center">
            <div className="text-3xl mb-2">⏱️</div>
            <div className="text-2xl font-bold text-purple-600">47h</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Tiempo Escuchado</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
