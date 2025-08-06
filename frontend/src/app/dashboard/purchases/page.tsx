'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/shared/components/DashboardLayout';

export default function PurchasesPage() {
  const [currentMode, setCurrentMode] = useState<'artist' | 'buyer'>('buyer');

  return (
    <DashboardLayout
      currentMode={currentMode}
      onModeChange={setCurrentMode}
      title="Mis Compras"
    >
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <h1 className={`text-3xl font-bold mb-2 ${
            currentMode === 'artist' ? 'text-purple-800' : 'text-blue-800'
          }`}>
            🛍️ Mis Compras
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Revisa todas tus compras de licencias musicales
          </p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por canción o artista..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option>Todas las licencias</option>
              <option>Licencia Básica</option>
              <option>Licencia Comercial</option>
              <option>Licencia Premium</option>
            </select>
            <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white">
              <option>Últimos 30 días</option>
              <option>Últimos 3 meses</option>
              <option>Último año</option>
              <option>Todo el tiempo</option>
            </select>
          </div>
        </div>

        {/* Lista de compras */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                  🎵
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    Canción {i}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    por Artista {i}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      Licencia {i % 2 === 0 ? 'Comercial' : 'Básica'}
                    </span>
                    <span className="text-sm text-gray-500">
                      ${50 + (i * 25)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>Comprado el 2024-01-{10 + i}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      Activa
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 py-2 px-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                      📥 Descargar
                    </button>
                    <button className="py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                      ▶️
                    </button>
                    <button className="py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                      📄
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Resumen de gastos */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Resumen de Gastos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">$485</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Gastado</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">6</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Licencias Activas</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">$80</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Promedio por Licencia</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
