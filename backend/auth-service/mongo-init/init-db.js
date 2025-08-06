// Script de inicialización para MongoDB
db = db.getSiblingDB('songrights_auth');

// Crear usuario para la base de datos de autenticación
db.createUser({
  user: 'auth_user',
  pwd: 'auth_password',
  roles: [
    {
      role: 'readWrite',
      db: 'songrights_auth'
    }
  ]
});

// Crear colección de usuarios con índices
db.createCollection('users');
db.users.createIndex({ "email": 1 }, { unique: true });

print('✅ Base de datos songrights_auth inicializada correctamente');
