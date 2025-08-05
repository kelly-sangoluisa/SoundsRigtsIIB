-- =====================================================
-- CHAT SERVICE DATABASE - chat_db
-- =====================================================

-- Tabla de perfiles de usuario (réplica ligera para relaciones)
CREATE TABLE user_profiles (
    id INTEGER PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de referencias de canciones (información básica para contexto)
CREATE TABLE song_references (
    id INTEGER PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla principal de chats
CREATE TABLE chats (
    id SERIAL PRIMARY KEY,
    song_id INTEGER NOT NULL,
    buyer_id INTEGER NOT NULL,
    artist_id INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Referencias (sin FK para microservicios)
    CONSTRAINT fk_chats_song FOREIGN KEY (song_id) REFERENCES song_references(id),
    CONSTRAINT fk_chats_buyer FOREIGN KEY (buyer_id) REFERENCES user_profiles(id),
    CONSTRAINT fk_chats_artist FOREIGN KEY (artist_id) REFERENCES user_profiles(id),
    
    -- Constraint único para evitar chats duplicados
    UNIQUE(song_id, buyer_id, artist_id)
);

-- Tabla de mensajes
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    chat_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text', -- text, image, file, system
    is_read BOOLEAN DEFAULT false,
    edited_at TIMESTAMP NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_messages_chat FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES user_profiles(id)
);

-- Función para actualizar last_message_at en chats
CREATE OR REPLACE FUNCTION update_chat_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE chats 
    SET last_message_at = NEW.sent_at 
    WHERE id = NEW.chat_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar last_message_at
CREATE TRIGGER update_chat_last_message_trigger
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_last_message();

-- Crear índices para optimización
CREATE INDEX idx_chats_song_id ON chats(song_id);
CREATE INDEX idx_chats_buyer_id ON chats(buyer_id);
CREATE INDEX idx_chats_artist_id ON chats(artist_id);
CREATE INDEX idx_chats_is_active ON chats(is_active);
CREATE INDEX idx_chats_last_message_at ON chats(last_message_at);
CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_sent_at ON messages(sent_at);
CREATE INDEX idx_messages_is_read ON messages(is_read);

-- =====================================================
-- DATOS DE PRUEBA
-- =====================================================

-- Insertar perfiles de usuario (sincronizados con auth_db)
INSERT INTO user_profiles (id, username, email) VALUES
(1, 'artista1', 'artista1@soundsrights.com'),
(2, 'comprador1', 'comprador1@soundsrights.com'),
(3, 'artista2', 'artista2@soundsrights.com'),
(4, 'comprador2', 'comprador2@soundsrights.com');

-- Insertar referencias de canciones (sincronizadas con songs_db)
INSERT INTO song_references (id, title, artist_id) VALUES
(1, 'Melodía del Amanecer', 1),
(2, 'Ritmo Urbano', 1),
(3, 'Balada del Corazón', 3),
(4, 'Sinfonía Electrónica', 1),
(5, 'Canción Vendida', 3);

-- Insertar chats de ejemplo
INSERT INTO chats (song_id, buyer_id, artist_id) VALUES
(3, 4, 3), -- comprador2 interesado en "Balada del Corazón" de artista2
(1, 2, 1), -- comprador1 interesado en "Melodía del Amanecer" de artista1
(5, 2, 3); -- comprador1 preguntando sobre "Canción Vendida" de artista2

-- Insertar mensajes de ejemplo
INSERT INTO messages (chat_id, sender_id, content, message_type) VALUES
-- Chat 1: Sobre "Balada del Corazón"
(1, 4, 'Hola! Me interesa mucho tu canción "Balada del Corazón". ¿Podrías contarme más sobre los derechos de uso?', 'text'),
(1, 3, '¡Hola! Gracias por tu interés. Es una licencia estándar que te permite uso personal y comercial limitado. ¿Tienes algún proyecto específico en mente?', 'text'),
(1, 4, 'Sí, quiero usarla en un video promocional para mi negocio. ¿Eso estaría incluido?', 'text'),
(1, 3, 'Perfectamente. El uso comercial limitado incluye videos promocionales. Te envío los términos completos.', 'text'),

-- Chat 2: Sobre "Melodía del Amanecer"  
(2, 2, 'Buenos días! Tu canción "Melodía del Amanecer" es exactamente lo que busco para mi podcast. ¿Está disponible?', 'text'),
(2, 1, 'Buenos días! Sí, está disponible. Es perfecta para podcasts. ¿Necesitas una licencia exclusiva o estándar?', 'text'),
(2, 2, 'Con la licencia estándar estaría bien. ¿Cuál sería el proceso de compra?', 'text'),

-- Chat 3: Sobre "Canción Vendida"
(3, 2, 'Hola, veo que esta canción ya está vendida. ¿Tienes algo similar disponible?', 'text'),
(3, 3, 'Hola! Sí, esa ya tiene licencia exclusiva. Pero tengo otras canciones del mismo estilo. Te puedo mostrar mi catálogo.', 'text');

-- Marcar algunos mensajes como leídos
UPDATE messages SET is_read = true WHERE chat_id = 1 AND sender_id = 4;
UPDATE messages SET is_read = true WHERE chat_id = 2 AND sender_id = 2;

-- Verificar inserción
SELECT 
    c.id as chat_id,
    sr.title as song_title,
    buyer.username as buyer,
    artist.username as artist,
    c.is_active,
    COUNT(m.id) as message_count,
    c.last_message_at
FROM chats c
JOIN song_references sr ON c.song_id = sr.id
JOIN user_profiles buyer ON c.buyer_id = buyer.id
JOIN user_profiles artist ON c.artist_id = artist.id
LEFT JOIN messages m ON c.id = m.chat_id
GROUP BY c.id, sr.title, buyer.username, artist.username, c.is_active, c.last_message_at
ORDER BY c.last_message_at DESC;
