// Datos de usuarios simulados
const mockUsers = [
  {
    id: '1',
    email: 'admin@test.com',
    password: '123456',
    name: 'Administrador',
    username: 'admin'
  },
  {
    id: '2', 
    email: 'user@test.com',
    password: 'password',
    name: 'Usuario Normal',
    username: 'user'
  },
  {
    id: '3',
    email: 'demo@demo.com',
    password: 'demo',
    name: 'Usuario Demo',
    username: 'demo'
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
    username: user.username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
  }));
  const signature = btoa('mock-signature');
  
  return `${header}.${payload}.${signature}`;
};

export const mockAuthAPI = {
  login: async (email: string, password: string) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Credenciales inválidas');
    }
    
    const token = generateMockJWT(user);
    
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username
      }
    };
  },
  
  validateToken: async (token: string) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      // Decodificar el payload del token
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      // Verificar que no haya expirado
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }
};
