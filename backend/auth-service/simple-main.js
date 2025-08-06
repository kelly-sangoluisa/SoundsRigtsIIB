const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;

// Configuración JWT
const JWT_SECRET = process.env.JWT_SECRET || 'NGMwOWJkMjgtZTk5YS00ZDVhLThjMWEtOWZmN2I1MjE3ZWE0MzYwN2M4NzktNTA5NC00ZmMzLTk2NTEtODQwOWU5NGU4NTg5';

app.use(cors());
app.use(express.json());

// Configuración de PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'postgres',
  database: 'soundsrights',
  password: 'admin123',
  port: 5432,
});

// Función para extraer userId del token JWT
function getUserIdFromToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.userId || decoded.sub;
  } catch (error) {
    console.log('Token verification failed:', error.message);
    return null;
  }
}

// Health check con verificación de BD
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'OK', 
      service: 'auth-service', 
      port: PORT,
      database: 'connected',
      timestamp: result.rows[0].now
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      service: 'auth-service', 
      port: PORT,
      database: 'disconnected',
      error: error.message
    });
  }
});

// POST /auth/register - Registro real en BD
app.post('/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'Username, email y password son requeridos' 
      });
    }

    // Verificar si el email ya existe
    const existingUserQuery = 'SELECT id FROM users WHERE email = $1';
    const existingUserResult = await pool.query(existingUserQuery, [email]);

    if (existingUserResult.rows.length > 0) {
      return res.status(409).json({ 
        error: 'El email ya está registrado' 
      });
    }

    // Crear nuevo usuario
    const insertUserQuery = `
      INSERT INTO users (username, email, password) 
      VALUES ($1, $2, $3) 
      RETURNING id, username, email, created_at
    `;
    const newUserResult = await pool.query(insertUserQuery, [username, email, password]);
    const newUser = newUserResult.rows[0];

    // Generar token JWT real
    const payload = {
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
      sub: newUser.id.toString()
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      access_token: token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        created_at: newUser.created_at
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});

// POST /auth/login - Login real con BD
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email y password son requeridos' 
      });
    }

    // Buscar usuario en la base de datos
    const userQuery = 'SELECT * FROM users WHERE email = $1 AND password = $2';
    const userResult = await pool.query(userQuery, [email, password]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Credenciales inválidas' 
      });
    }

    const user = userResult.rows[0];

    // Generar token JWT real
    const payload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      sub: user.id.toString()
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    res.json({
      message: 'Login exitoso',
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});

// GET /auth/profile - Obtener perfil real de BD
app.get('/auth/profile', async (req, res) => {
  try {
    const userId = getUserIdFromToken(req);
    
    if (!userId) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    // Buscar usuario en la base de datos
    const userQuery = 'SELECT id, username, email, created_at, updated_at FROM users WHERE id = $1';
    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = userResult.rows[0];

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🔐 Auth Service running on port ${PORT}`);
  console.log(`🗄️ Connecting to PostgreSQL at postgres:5432`);
});
