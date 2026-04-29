-- Script de creación de base de datos para el sistema Gatekeeper

-- 1. Tabla de Solicitudes
CREATE TABLE IF NOT EXISTS solicitudes (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    folio VARCHAR(50) NOT NULL,
    estatus VARCHAR(20) DEFAULT 'Procesando',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Pagos de Referencia (Folios válidos)
CREATE TABLE IF NOT EXISTS pagos_referencia (
    id SERIAL PRIMARY KEY,
    folio VARCHAR(50) UNIQUE NOT NULL,
    valido BOOLEAN DEFAULT TRUE
);

-- 3. Inserción de datos de prueba
INSERT INTO pagos_referencia (folio, valido) VALUES 
('FOLIO-2026-A1X', true),
('FOLIO-2026-B2Y', true),
('FOLIO-2026-C3Z', true);