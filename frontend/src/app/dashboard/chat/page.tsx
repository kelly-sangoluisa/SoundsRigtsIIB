'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/shared/components/DashboardLayout';

export default function ChatPage() {
  const [currentMode, setCurrentMode] = useState<'artist' | 'buyer'>('artist');

  return (
    <DashboardLayout
      currentMode={currentMode}
      onModeChange={setCurrentMode}
      title="Chat"
    >
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
          <h1 className={`text-3xl font-bold mb-2 ${
            currentMode === 'artist' ? 'text-purple-800' : 'text-blue-800'
          }`}>
            💬 Chat
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {currentMode === 'artist' 
              ? 'Comunícate con compradores interesados en tus canciones'
              : 'Chatea con artistas sobre sus obras'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de conversaciones */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
              Conversaciones
            </h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  currentMode === 'artist'
                    ? 'hover:bg-purple-50 dark:hover:bg-purple-900/20'
                    : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentMode === 'artist' ? 'bg-purple-100' : 'bg-blue-100'
                    }`}>
                      {currentMode === 'artist' ? '�' : '🎤'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">
                        {currentMode === 'artist' ? `Comprador ${i}` : `Artista ${i}`}
                      </h3>
                      <p className="text-sm text-gray-500">Última actividad hace 2h</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Área de chat */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 flex flex-col h-96">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              <div className="text-center text-gray-500 text-sm">
                Selecciona una conversación para comenzar a chatear
              </div>
            </div>
            
            <div className="border-t dark:border-gray-700 pt-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
                  currentMode === 'artist'
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}>
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
