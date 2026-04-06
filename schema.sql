-- Ejecutar esto en Supabase SQL Editor

-- Proveedores
CREATE TABLE proveedores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    telefono TEXT DEFAULT '',
    direccion TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Clientes
CREATE TABLE clientes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    telefono TEXT DEFAULT '',
    direccion TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Compras
CREATE TABLE compras (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fecha DATE NOT NULL,
    proveedor_id UUID REFERENCES proveedores(id),
    cantidad INTEGER NOT NULL,
    costo_unitario NUMERIC NOT NULL,
    total NUMERIC GENERATED ALWAYS AS (cantidad * costo_unitario) STORED,
    notas TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Ventas
CREATE TABLE ventas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fecha DATE NOT NULL,
    cliente_id UUID REFERENCES clientes(id),
    cantidad INTEGER NOT NULL,
    precio_unitario NUMERIC NOT NULL,
    total NUMERIC GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    notas TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Habilitar acceso publico con anon key (Row Level Security desactivado para simplicidad)
ALTER TABLE proveedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acceso total proveedores" ON proveedores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total clientes" ON clientes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total compras" ON compras FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acceso total ventas" ON ventas FOR ALL USING (true) WITH CHECK (true);
