-- Crear base de datos y tablas para SoundsRights

-- Crear tablas para la base de datos
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE songs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    genre VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('for_sale', 'pending', 'sold')) DEFAULT 'for_sale',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE licenses (
    id SERIAL PRIMARY KEY,
    song_id INTEGER REFERENCES songs(id) ON DELETE CASCADE,
    buyer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    seller_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    purchase_price DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'active',
    license_terms TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    song_id INTEGER REFERENCES songs(id) ON DELETE CASCADE,
    buyer_id INTEGER REFERENCES users(id),
    artist_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    chat_id INTEGER REFERENCES chats(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON songs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de prueba
INSERT INTO users (username, email, password) VALUES 
('admin', 'admin@example.com', '$2b$10$8eJ1q8ZqY4vNzGHu6.1Q9.xQK1YLQz3qK2vXyKqZ1YLQ3qK2vXyK'),
('usuario1', 'usuario1@example.com', '$2b$10$8eJ1q8ZqY4vNzGHu6.1Q9.xQK1YLQz3qK2vXyKqZ1YLQ3qK2vXyK');

INSERT INTO songs (title, artist_id, genre, price, status) VALUES
('Echoes of Tomorrow', 1, 'electronic', 2.99, 'for_sale'),
('Midnight Blues', 1, 'blues', 1.99, 'pending'),
('Summer Vibes', 1, 'pop', 2.49, 'for_sale'),
('Rock Anthem', 2, 'rock', 3.99, 'for_sale'),
('Ocean Dreams', 2, 'classical', 4.99, 'pending');
