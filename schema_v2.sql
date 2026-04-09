-- EJECUTAR EN SUPABASE SQL EDITOR
-- Actualizacion v2: tipos de panal + parametros de precios

-- 1. Agregar columna tipo a compras y ventas
ALTER TABLE compras ADD COLUMN IF NOT EXISTS tipo TEXT DEFAULT 'doble_a';
ALTER TABLE ventas ADD COLUMN IF NOT EXISTS tipo TEXT DEFAULT 'doble_a';

-- 2. Tabla de parametros (precios por tipo de panal)
CREATE TABLE IF NOT EXISTS parametros (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    tipo TEXT NOT NULL UNIQUE,  -- 'doble_a' o 'triple_a'
    nombre TEXT NOT NULL,
    costo_compra NUMERIC DEFAULT 0,
    precio_venta NUMERIC DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Datos iniciales
INSERT INTO parametros (tipo, nombre, costo_compra, precio_venta) VALUES
    ('doble_a', 'Panal Doble A', 0, 0),
    ('triple_a', 'Panal Triple A', 0, 0)
ON CONFLICT (tipo) DO NOTHING;

-- Seguridad
ALTER TABLE parametros ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acceso total parametros" ON parametros FOR ALL USING (true) WITH CHECK (true);
