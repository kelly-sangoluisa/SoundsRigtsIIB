'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/shared/components/DashboardLayout';

export default function LicensesPage() {
  const [currentMode, setCurrentMode] = useState<'artist' | 'buyer'>('artist');

  return (
    <DashboardLayout
      currentMode={currentMode}
      onModeChange={setCurrentMode}
      title="Licencias"
    >
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-3xl font-bold mb-2 ${
                currentMode === 'artist' ? 'text-purple-800' : 'text-blue-800'
              }`}>
                📄 Licencias
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {currentMode === 'artist' 
                  ? 'Gestiona los tipos de licencias para tus canciones'
                  : 'Revisa las licencias que has adquirido'
                }
              </p>
            </div>
            {currentMode === 'artist' && (
              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors">
                ➕ Nueva Licencia
              </button>
            )}
          </div>
        </div>

        {currentMode === 'artist' ? (
          /* Vista de Artista - Tipos de licencia */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Licencia Básica', price: 50, description: 'Uso personal y pequeños proyectos', icon: '📝' },
              { name: 'Licencia Comercial', price: 150, description: 'Uso comercial y publicitario', icon: '💼' },
              { name: 'Licencia Premium', price: 300, description: 'Uso exclusivo y derechos extendidos', icon: '⭐' },
            ].map((license, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 border hover:shadow-xl transition-shadow">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">{license.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {license.name}
                  </h3>
                  <p className="text-3xl font-bold text-purple-600">${license.price}</p>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
                  {license.description}
                </p>
                <div className="space-y-2">
                  <button className="w-full py-2 px-4 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                    ⚙️ Configurar
                  </button>
                  <button className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    📊 Ver Ventas
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Vista de Comprador - Licencias adquiridas */
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Mis Licencias Adquiridas
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
                      Artista
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tipo de Licencia
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Fecha de Compra
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[1, 2, 3, 4].map((i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                        Canción {i}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        Artista {i}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        Licencia {i % 2 === 0 ? 'Comercial' : 'Básica'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        2024-01-{10 + i}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Activa
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <button className="text-blue-600 hover:text-blue-800 mr-3">📥 Descargar</button>
                        <button className="text-gray-600 hover:text-gray-800">👁️ Ver</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
