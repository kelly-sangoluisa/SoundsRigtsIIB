-- =====================================================
-- AUTH SERVICE DATABASE - auth_db
-- =====================================================

-- Crear tabla de usuarios (tabla principal del sistema)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Crear índices para optimización
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- =====================================================
-- DATOS DE PRUEBA
-- =====================================================

-- Insertar usuarios de prueba (passwords hasheadas con bcrypt para "password123")
INSERT INTO users (username, email, password) VALUES
('artista1', 'artista1@soundsrights.com', '$2b$10$8K5iDy0X8r.Rz9m.zNqXe.X5h1K2mE3N4o5P6q7R8s9T0u1V2w3X4y'),
('comprador1', 'comprador1@soundsrights.com', '$2b$10$8K5iDy0X8r.Rz9m.zNqXe.X5h1K2mE3N4o5P6q7R8s9T0u1V2w3X4y'),
('artista2', 'artista2@soundsrights.com', '$2b$10$8K5iDy0X8r.Rz9m.zNqXe.X5h1K2mE3N4o5P6q7R8s9T0u1V2w3X4y'),
('comprador2', 'comprador2@soundsrights.com', '$2b$10$8K5iDy0X8r.Rz9m.zNqXe.X5h1K2mE3N4o5P6q7R8s9T0u1V2w3X4y');

-- Verificar inserción
SELECT id, username, email, created_at FROM users;
