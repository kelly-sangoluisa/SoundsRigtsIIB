-- =====================================================
-- SONGS SERVICE DATABASE - songs_db
-- =====================================================

-- Tabla de perfiles de usuario (réplica ligera para relaciones)
CREATE TABLE user_profiles (
    id INTEGER PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla principal de canciones
CREATE TABLE songs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist_id INTEGER NOT NULL,
    genre VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('for_sale', 'pending', 'sold')) DEFAULT 'for_sale',
    file_url VARCHAR(500),
    duration INTEGER, -- duración en segundos
    description TEXT,
    tags VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Referencia al usuario (sin FK para microservicios)
    CONSTRAINT fk_songs_artist FOREIGN KEY (artist_id) REFERENCES user_profiles(id)
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
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON songs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Crear índices para optimización
CREATE INDEX idx_songs_artist_id ON songs(artist_id);
CREATE INDEX idx_songs_status ON songs(status);
CREATE INDEX idx_songs_genre ON songs(genre);
CREATE INDEX idx_songs_price ON songs(price);
CREATE INDEX idx_songs_created_at ON songs(created_at);

-- =====================================================
-- DATOS DE PRUEBA
-- =====================================================

-- Insertar perfiles de usuario (sincronizados con auth_db)
INSERT INTO user_profiles (id, username, email) VALUES
(1, 'artista1', 'artista1@soundsrights.com'),
(2, 'comprador1', 'comprador1@soundsrights.com'),
(3, 'artista2', 'artista2@soundsrights.com'),
(4, 'comprador2', 'comprador2@soundsrights.com');

-- Insertar canciones de ejemplo
INSERT INTO songs (title, artist_id, genre, price, status, file_url, duration, description, tags) VALUES
('Melodía del Amanecer', 1, 'Pop', 25.99, 'for_sale', '/uploads/songs/melodia-amanecer.mp3', 180, 'Una hermosa melodía que evoca los primeros rayos del sol', 'pop,instrumental,relajante'),
('Ritmo Urbano', 1, 'Hip-Hop', 19.99, 'for_sale', '/uploads/songs/ritmo-urbano.mp3', 210, 'Beats urbanos con gran energía', 'hip-hop,urbano,energético'),
('Balada del Corazón', 3, 'Ballad', 30.00, 'for_sale', '/uploads/songs/balada-corazon.mp3', 240, 'Una emotiva balada sobre el amor perdido', 'balada,romántico,emotivo'),
('Sinfonía Electrónica', 1, 'Electronic', 35.50, 'pending', '/uploads/songs/sinfonia-electronica.mp3', 300, 'Fusión de música clásica y electrónica', 'electronic,fusión,experimental'),
('Canción Vendida', 3, 'Rock', 45.00, 'sold', '/uploads/songs/cancion-vendida.mp3', 220, 'Un potente tema de rock ya vendido', 'rock,energético,vendido');

-- Verificar inserción
SELECT s.id, s.title, up.username, s.genre, s.price, s.status 
FROM songs s 
JOIN user_profiles up ON s.artist_id = up.id;
