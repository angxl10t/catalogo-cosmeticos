-- ==============================================================================
-- SCHEMA INICIAL: Catálogo Cosméticos & Electrodomésticos + Promociones
-- Compatible con PostgreSQL y Supabase
-- ==============================================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. MARCAS (Cyzone, Unique / Yanbal, Ésika, Natura, Oster, etc.)
CREATE TABLE IF NOT EXISTS public.marcas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    logo_url TEXT,
    categoria_principal VARCHAR(50) DEFAULT 'COSMETICOS', -- 'COSMETICOS' o 'ELECTRO'
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CATEGORÍAS (Fragancias, Cuidado Facial, Maquillaje, Cocina, Cuidado Personal, etc.)
CREATE TABLE IF NOT EXISTS public.categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icono VARCHAR(50),
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CAMPAÑAS (Ej: Campaña 05 - Día de la Madre, Catálogo C-06, Liquidación Anual)
CREATE TABLE IF NOT EXISTS public.campanas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(50) NOT NULL UNIQUE, -- ej: 'C-05-2026'
    nombre VARCHAR(150) NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    activa BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. PRODUCTOS
CREATE TABLE IF NOT EXISTS public.productos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo_referencia VARCHAR(50), -- Código de catálogo (ej: Unique 2001452)
    nombre VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    descripcion TEXT,
    marca_id UUID REFERENCES public.marcas(id) ON DELETE SET NULL,
    categoria_id UUID REFERENCES public.categorias(id) ON DELETE SET NULL,
    campana_id UUID REFERENCES public.campanas(id) ON DELETE SET NULL,
    
    -- Precios y Moneda
    precio_regular NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    precio_oferta NUMERIC(10, 2), -- Si aplica oferta fija
    precio_costo NUMERIC(10, 2) DEFAULT 0.00, -- Para cálculo de margen admin
    
    -- Control de Inventario
    stock INTEGER NOT NULL DEFAULT 0,
    stock_minimo INTEGER DEFAULT 2,
    es_destacado BOOLEAN DEFAULT false,
    es_nuevo BOOLEAN DEFAULT false,
    activo BOOLEAN DEFAULT true,
    
    -- Multimedia (URLs de Supabase Storage)
    imagen_principal TEXT,
    galeria_imagenes TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. VARIANTES DE PRODUCTO (Tonos de maquillaje, aromas, colores de electrodoméstico)
CREATE TABLE IF NOT EXISTS public.producto_variantes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    producto_id UUID NOT NULL REFERENCES public.productos(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL, -- ej: 'Rojo Pasión', 'Tono Claro 1', 'Negro Mate'
    codigo_tono VARCHAR(50),      -- ej: 'TONO-02'
    codigo_hex VARCHAR(10),       -- ej: '#A51D24' para swatch visual
    imagen_url TEXT,
    stock INTEGER DEFAULT 0,
    precio_adicional NUMERIC(10, 2) DEFAULT 0.00,
    activo BOOLEAN DEFAULT true
);

-- 6. PROMOCIONES & DESCUENTOS (2x1, % de descuento, combos)
CREATE TABLE IF NOT EXISTS public.promociones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo VARCHAR(150) NOT NULL,
    tipo VARCHAR(50) NOT NULL, -- 'PORCENTAJE', 'MONTO_FIJO', 'DOS_POR_UNO', 'COMBO'
    valor_descuento NUMERIC(10, 2) DEFAULT 0.00,
    fecha_inicio TIMESTAMP WITH TIME ZONE,
    fecha_fin TIMESTAMP WITH TIME ZONE,
    banner_url TEXT,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABLA DE ASOCIACIÓN: PRODUCTOS EN PROMOCIÓN
CREATE TABLE IF NOT EXISTS public.promocion_productos (
    promocion_id UUID REFERENCES public.promociones(id) ON DELETE CASCADE,
    producto_id UUID REFERENCES public.productos(id) ON DELETE CASCADE,
    PRIMARY KEY (promocion_id, producto_id)
);

-- 8. CONFIGURACIÓN DEL NEGOCIO / WHATSAPP
CREATE TABLE IF NOT EXISTS public.configuracion_tienda (
    id INTEGER PRIMARY KEY DEFAULT 1,
    nombre_tienda VARCHAR(100) DEFAULT 'Catálogo Cosméticos & Hogar',
    whatsapp_pedidos VARCHAR(30) NOT NULL DEFAULT '51999999999', -- Formato internacional
    mensaje_bienvenida TEXT DEFAULT '¡Hola! Me interesan los siguientes productos de su catálogo:',
    moneda_simbolo VARCHAR(10) DEFAULT 'S/',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserción de configuración por defecto
INSERT INTO public.configuracion_tienda (id, nombre_tienda, whatsapp_pedidos)
VALUES (1, 'Catálogo Cosméticos & Hogar', '51999999999')
ON CONFLICT (id) DO NOTHING;

-- 9. DATOS SEMILLA BÁSICOS (Marcas Populares)
INSERT INTO public.marcas (nombre, slug, categoria_principal) VALUES
('Cyzone', 'cyzone', 'COSMETICOS'),
('Unique (Yanbal)', 'unique-yanbal', 'COSMETICOS'),
('Ésika', 'esika', 'COSMETICOS'),
('Natura', 'natura', 'COSMETICOS'),
('Electro Hogar', 'electro-hogar', 'ELECTRO')
ON CONFLICT (nombre) DO NOTHING;

-- 10. POLÍTICAS ROW LEVEL SECURITY (RLS)
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marcas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promociones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracion_tienda ENABLE ROW LEVEL SECURITY;

-- Acceso de LECTURA para todo el público (Catálogo de clientes)
CREATE POLICY "Lectura pública de productos activos" ON public.productos FOR SELECT USING (activo = true);
CREATE POLICY "Lectura pública de marcas activas" ON public.marcas FOR SELECT USING (activo = true);
CREATE POLICY "Lectura pública de categorias activas" ON public.categorias FOR SELECT USING (activo = true);
CREATE POLICY "Lectura pública de promociones activas" ON public.promociones FOR SELECT USING (activa = true);
CREATE POLICY "Lectura pública de configuracion" ON public.configuracion_tienda FOR SELECT USING (true);
