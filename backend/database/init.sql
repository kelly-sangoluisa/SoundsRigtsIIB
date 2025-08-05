-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear enum para estado de canciones
CREATE TYPE song_status AS ENUM ('for_sale', 'pending', 'sold');

-- Crear tabla de canciones
CREATE TABLE IF NOT EXISTS songs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    genre VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    status song_status DEFAULT 'for_sale',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de licencias
CREATE TABLE IF NOT EXISTS licenses (
    id SERIAL PRIMARY KEY,
    song_id INTEGER REFERENCES songs(id) ON DELETE CASCADE,
    buyer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de chats
CREATE TABLE IF NOT EXISTS chats (
    id SERIAL PRIMARY KEY,
    song_id INTEGER REFERENCES songs(id) ON DELETE CASCADE,
    buyer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    artist_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de mensajes
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_songs_artist_id ON songs(artist_id);
CREATE INDEX IF NOT EXISTS idx_songs_status ON songs(status);
CREATE INDEX IF NOT EXISTS idx_licenses_song_id ON licenses(song_id);
CREATE INDEX IF NOT EXISTS idx_licenses_buyer_id ON licenses(buyer_id);
CREATE INDEX IF NOT EXISTS idx_chats_song_id ON chats(song_id);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);

-- Insertar algunos datos de ejemplo
INSERT INTO users (username, email, password) VALUES
('artista1', 'artista1@example.com', '$2b$10$example.hash.for.password123'),
('comprador1', 'comprador1@example.com', '$2b$10$example.hash.for.password123');

INSERT INTO songs (title, artist_id, genre, price, status) VALUES
('Mi Primera Canción', 1, 'Pop', 25.99, 'for_sale'),
('Balada Romántica', 1, 'Ballad', 19.99, 'for_sale'),
('Canción Vendida', 1, 'Rock', 30.00, 'sold');
