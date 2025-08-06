// Datos de usuarios simulados
const mockUsers = [
  {
    id: '1',
    email: 'admin@test.com',
    password: '123456',
    name: 'Administrador',
    role: 'admin'
  },
  {
    id: '2', 
    email: 'user@test.com',
    password: 'password',
    name: 'Usuario Normal',
    role: 'user'
  },
  {
    id: '3',
    email: 'demo@demo.com',
    password: 'demo',
    name: 'Usuario Demo',
    role: 'user'
  }
];

// Función para generar un JWT simulado
const generateMockJWT = (user: typeof mockUsers[0]) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
  }));
  const signature = btoa('mock-signature');
  
  return `${header}.${payload}.${signature}`;
};

export const mockAuthAPI = {
  login: async (email: string, password: string) => {
    debugger; // 🔍 Punto de debug 5: Mock login iniciado
    console.log('🔍 Mock login attempt:', { email, password });
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    debugger; // 🔍 Punto de debug 6: Usuario encontrado o no
    console.log('🔍 User found:', user);
    
    if (!user) {
      debugger; // 🔍 Punto de debug 7: Usuario no encontrado
      throw new Error('Credenciales inválidas');
    }
    
    const token = generateMockJWT(user);
    const response = {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
    
    debugger; // 🔍 Punto de debug 8: Respuesta exitosa
    console.log('🔍 Mock login success:', response);
    return response;
  },

  validateToken: async (token: string): Promise<boolean> => {
    debugger; // 🔍 Punto de debug 9: Validando token
    console.log('🔍 Validating token:', token);
    
    // Simular delay de validación
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Validar que el token tenga el formato correcto de mock JWT
    const isValid = typeof token === 'string' && token.startsWith('eyJ') && token.split('.').length === 3;
    
    console.log('🔍 Token validation result:', isValid);
    return isValid;
  }
};