'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/shared/hooks/useAuth';
import { AuthService } from '@/features/auth/services/authService';

export default function TestPage() {
  const [loginResult, setLoginResult] = useState<any>(null);
  const [cookies, setCookies] = useState('');
  const { login, user, isAuthenticated } = useAuth();

  useEffect(() => {
    setCookies(document.cookie);
  }, []);

  const handleTestLogin = async () => {
    try {
      console.log('Testing login...');
      const result = await AuthService.login({
        email: 'demo@soundsrights.com',
        password: 'demo123'
      });
      
      console.log('Login result:', result);
      setLoginResult(result);
      
      if (result.access_token) {
        login(result.access_token);
        setCookies(document.cookie);
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginResult({ error: error.message });
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Auth Page</h1>
      
      <div className="space-y-4">
        <button 
          onClick={handleTestLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test Login
        </button>
        
        <div>
          <h2 className="font-bold">Auth Status:</h2>
          <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          <p>User: {user ? JSON.stringify(user) : 'None'}</p>
        </div>
        
        <div>
          <h2 className="font-bold">Cookies:</h2>
          <p className="text-sm break-all">{cookies}</p>
        </div>
        
        <div>
          <h2 className="font-bold">Login Result:</h2>
          <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
            {loginResult ? JSON.stringify(loginResult, null, 2) : 'None'}
          </pre>
        </div>
      </div>
    </div>
  );
}
