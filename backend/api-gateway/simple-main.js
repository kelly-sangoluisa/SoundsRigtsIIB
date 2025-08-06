const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Configuración CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'api-gateway', port: 3000 });
});

app.get('/api/status', (req, res) => {
  res.json({ message: 'API Gateway is running', timestamp: new Date().toISOString() });
});

// PROXY PARA AUTH SERVICE CON PREFIJO /api/
app.post('/api/auth/login', async (req, res) => {
  try {
    const response = await fetch('http://auth-service:3001/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error conectando con auth service' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const response = await fetch('http://auth-service:3001/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error conectando con auth service' });
  }
});

app.get('/api/auth/profile', async (req, res) => {
  try {
    const response = await fetch('http://auth-service:3001/auth/profile', {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || ''
      }
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error conectando con auth service' });
  }
});

// RUTAS SIN PREFIJO PARA EL FRONTEND
app.post('/auth/login', async (req, res) => {
  try {
    const response = await axios.post('http://auth-service:3001/auth/login', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Error conectando con auth service' });
    }
  }
});

app.post('/auth/register', async (req, res) => {
  try {
    const response = await axios.post('http://auth-service:3001/auth/register', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Error conectando con auth service' });
    }
  }
});

app.get('/auth/profile', async (req, res) => {
  try {
    const response = await axios.get('http://auth-service:3001/auth/profile', {
      headers: { Authorization: req.headers.authorization || '' }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Error conectando con auth service' });
    }
  }
});

// PROXY PARA SONGS SERVICE
app.get('/api/songs', async (req, res) => {
  try {
    const response = await fetch('http://songs-service:3002/api/songs');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error conectando con songs service' });
  }
});

// PROXY PARA CHAT SERVICE
app.get('/api/chats', async (req, res) => {
  try {
    const response = await fetch('http://chat-service:3003/api/chats');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error conectando con chat service' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API Gateway running on port ${port}`);
});
