-- =====================================================
-- LICENSES SERVICE DATABASE - licenses_db
-- =====================================================

-- Tabla de perfiles de usuario (réplica ligera para relaciones)
CREATE TABLE user_profiles (
    id INTEGER PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de referencias de canciones (información básica de canciones)
CREATE TABLE song_references (
    id INTEGER PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    artist_id INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla principal de licencias
CREATE TABLE licenses (
    id SERIAL PRIMARY KEY,
    song_id INTEGER NOT NULL,
    buyer_id INTEGER NOT NULL,
    seller_id INTEGER NOT NULL,
    purchase_price DECIMAL(10, 2) NOT NULL,
    license_type VARCHAR(50) DEFAULT 'standard', -- standard, exclusive, commercial
    license_terms TEXT,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP NULL, -- para licencias temporales
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Referencias (sin FK para microservicios)
    CONSTRAINT fk_licenses_song FOREIGN KEY (song_id) REFERENCES song_references(id),
    CONSTRAINT fk_licenses_buyer FOREIGN KEY (buyer_id) REFERENCES user_profiles(id),
    CONSTRAINT fk_licenses_seller FOREIGN KEY (seller_id) REFERENCES user_profiles(id)
);

-- Tabla para el historial de transacciones
CREATE TABLE license_transactions (
    id SERIAL PRIMARY KEY,
    license_id INTEGER NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- purchase, transfer, revoke
    amount DECIMAL(10, 2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_transactions_license FOREIGN KEY (license_id) REFERENCES licenses(id)
);

-- Crear índices para optimización
CREATE INDEX idx_licenses_song_id ON licenses(song_id);
CREATE INDEX idx_licenses_buyer_id ON licenses(buyer_id);
CREATE INDEX idx_licenses_seller_id ON licenses(seller_id);
CREATE INDEX idx_licenses_is_active ON licenses(is_active);
CREATE INDEX idx_licenses_created_at ON licenses(created_at);
CREATE INDEX idx_transactions_license_id ON license_transactions(license_id);

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
INSERT INTO song_references (id, title, artist_id, price) VALUES
(1, 'Melodía del Amanecer', 1, 25.99),
(2, 'Ritmo Urbano', 1, 19.99),
(3, 'Balada del Corazón', 3, 30.00),
(4, 'Sinfonía Electrónica', 1, 35.50),
(5, 'Canción Vendida', 3, 45.00);

-- Insertar licencias de ejemplo
INSERT INTO licenses (song_id, buyer_id, seller_id, purchase_price, license_type, license_terms) VALUES
(5, 2, 3, 45.00, 'exclusive', 'Licencia exclusiva para uso comercial sin restricciones'),
(3, 4, 3, 30.00, 'standard', 'Licencia estándar para uso personal y comercial limitado');

-- Insertar transacciones de ejemplo
INSERT INTO license_transactions (license_id, transaction_type, amount, notes) VALUES
(1, 'purchase', 45.00, 'Compra de licencia exclusiva'),
(2, 'purchase', 30.00, 'Compra de licencia estándar');

-- Verificar inserción
SELECT 
    l.id,
    sr.title as song_title,
    seller.username as seller,
    buyer.username as buyer,
    l.purchase_price,
    l.license_type,
    l.is_active,
    l.created_at
FROM licenses l
JOIN song_references sr ON l.song_id = sr.id
JOIN user_profiles seller ON l.seller_id = seller.id
JOIN user_profiles buyer ON l.buyer_id = buyer.id;
