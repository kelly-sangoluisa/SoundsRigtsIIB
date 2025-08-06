'use client';

import { useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('Probando conexión...');
    
    try {
      console.log('Probando conexión al backend...');
      
      // Primero probar si el servicio responde
      const healthCheck = await fetch('http://localhost:3002/songs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!healthCheck.ok) {
        setResult(`❌ Backend no disponible: ${healthCheck.status}`);
        return;
      }

      // Probar registro
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: 'Test',
          lastName: 'User',
          email: `test${Date.now()}@example.com`,
          password: '123456',
        }),
      });

      console.log('Response received:', response);
      
      if (!response.ok) {
        const errorText = await response.text();
        setResult(`❌ Error en registro: ${response.status} - ${errorText}`);
        return;
      }

      const data = await response.json();
      setResult(`✅ Conexión exitosa! Token: ${data.access_token.substring(0, 20)}...`);
      
    } catch (error: any) {
      console.error('Error:', error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setResult(`❌ Error de red: No se puede conectar al backend. Verifica que los microservicios estén corriendo.`);
      } else {
        setResult(`❌ Error de conexión: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#191414] flex items-center justify-center p-8">
      <div className="bg-[#282828] rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-white mb-6">
          🔧 Prueba de Conectividad
        </h1>
        
        <button
          onClick={testConnection}
          disabled={loading}
          className="spotify-button mb-6 disabled:opacity-50"
        >
          {loading ? 'Probando...' : 'Probar Conexión al Backend'}
        </button>
        
        {result && (
          <div className="bg-[#191414] rounded p-4 text-left">
            <pre className="text-white text-sm whitespace-pre-wrap">{result}</pre>
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-400">
          <p>Esta página prueba la conexión entre:</p>
          <p>Frontend (localhost:3000) ↔ Backend (localhost:3001)</p>
        </div>
      </div>
    </div>
  );
}
