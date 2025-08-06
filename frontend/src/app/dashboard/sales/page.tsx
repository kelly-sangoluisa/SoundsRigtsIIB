'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/shared/components/DashboardLayout';

export default function SalesPage() {
  const [currentMode, setCurrentMode] = useState<'artist' | 'buyer'>('artist');

  return (
    <DashboardLayout
      currentMode={currentMode}
      onModeChange={setCurrentMode}
      title="Ventas"
    >
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <h1 className={`text-3xl font-bold mb-2 ${
            currentMode === 'artist' ? 'text-purple-800' : 'text-blue-800'
          }`}>
            💰 Ventas
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Revisa tus ventas y ganancias de licencias musicales
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border-l-4 ${
            currentMode === 'artist' ? 'border-purple-500' : 'border-blue-500'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ventas Totales</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">$2,450</p>
              </div>
              <div className={`p-3 rounded-full ${
                currentMode === 'artist' ? 'bg-purple-100' : 'bg-blue-100'
              }`}>
                💰
              </div>
            </div>
          </div>

          <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border-l-4 ${
            currentMode === 'artist' ? 'border-purple-500' : 'border-blue-500'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Licencias Vendidas</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">23</p>
              </div>
              <div className={`p-3 rounded-full ${
                currentMode === 'artist' ? 'bg-purple-100' : 'bg-blue-100'
              }`}>
                📄
              </div>
            </div>
          </div>

          <div className={`bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border-l-4 ${
            currentMode === 'artist' ? 'border-purple-500' : 'border-blue-500'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Este Mes</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">$890</p>
              </div>
              <div className={`p-3 rounded-full ${
                currentMode === 'artist' ? 'bg-purple-100' : 'bg-blue-100'
              }`}>
                📈
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de ventas recientes */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Ventas Recientes
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Canción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Comprador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tipo de Licencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Monto
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                      Canción {i}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      usuario{i}@email.com
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      Licencia Básica
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      2024-01-{10 + i}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${50 + (i * 25)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
