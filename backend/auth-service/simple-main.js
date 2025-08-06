const express = require('express');
const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'auth-service', port: 3001 });
});

app.get('/api/auth/status', (req, res) => {
  res.json({ message: 'Auth service is running', timestamp: new Date().toISOString() });
});

// AUTH ENDPOINTS
app.post('/api/auth/register', (req, res) => {
  const { email, password, name, role } = req.body;
  
  // Simulación de registro
  if (!email || !password || !name) {
    return res.status(400).json({ 
      error: 'Email, password y name son requeridos',
      required: ['email', 'password', 'name', 'role (artist|buyer)']
    });
  }
  
  res.status(201).json({
    message: 'Usuario registrado exitosamente',
    user: {
      id: Math.floor(Math.random() * 1000),
      email,
      name,
      role: role || 'buyer',
      createdAt: new Date().toISOString()
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email y password son requeridos',
      required: ['email', 'password']
    });
  }
  
  // Simulación de login
  res.json({
    message: 'Login exitoso',
    token: 'fake-jwt-token-123456789',
    user: {
      id: 1,
      email,
      name: 'Usuario Demo',
      role: 'artist'
    }
  });
});

app.get('/api/auth/profile', (req, res) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: 'Token requerido en Authorization header' });
  }
  
  res.json({
    id: 1,
    email: 'demo@soundsrights.com',
    name: 'Usuario Demo',
    role: 'artist',
    profileImage: null,
    verified: true
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Auth Service running on port ${port}`);
});
