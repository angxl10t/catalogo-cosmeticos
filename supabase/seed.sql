-- ==============================================================================
-- SEMILLA DE PRODUCTOS INICIALES (Cosméticos & Electro)
-- Compatible con UUIDs válidos en PostgreSQL / Supabase
-- ==============================================================================

-- 1. Insertar Categorías
INSERT INTO public.categorias (id, nombre, slug, descripcion) VALUES
('a0000001-0000-0000-0000-000000000001', 'Fragancias & Perfumería', 'fragancias', 'Perfumes, colonias y aromas de alta duración'),
('a0000001-0000-0000-0000-000000000002', 'Maquillaje & Tonos', 'maquillaje', 'Bases, labiales mate, máscaras y delineadores'),
('a0000001-0000-0000-0000-000000000003', 'Cuidado Facial & Corporal', 'cuidado-facial', 'Cremas hidratantes, sérums y protectores'),
('a0000001-0000-0000-0000-000000000004', 'Electro Hogar & Belleza', 'electro-hogar', 'Freidoras, planchas y secadoras')
ON CONFLICT (slug) DO UPDATE SET 
    nombre = EXCLUDED.nombre,
    descripcion = EXCLUDED.descripcion;

-- 2. Producto 1: Cyzone - Labial Mate
INSERT INTO public.productos (
    id, codigo_referencia, nombre, slug, descripcion,
    marca_id, categoria_id, precio_regular, precio_oferta, stock,
    es_destacado, es_nuevo, activo, imagen_principal
) VALUES (
    'b0000001-0000-0000-0000-000000000001',
    'CYZ-LAB-01',
    'Labial Mate Studio Look',
    'labial-mate-studio-look',
    'Color intenso de larga duración, acabado mate aterciopelado que no reseca los labios.',
    (SELECT id FROM public.marcas WHERE slug = 'cyzone' LIMIT 1),
    'a0000001-0000-0000-0000-000000000002',
    28.00, 19.90, 25,
    true, true, true,
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'
) ON CONFLICT (slug) DO UPDATE SET 
    precio_oferta = EXCLUDED.precio_oferta,
    stock = EXCLUDED.stock;

-- Variantes del Labial
INSERT INTO public.producto_variantes (producto_id, nombre, codigo_tono, codigo_hex, stock) VALUES
('b0000001-0000-0000-0000-000000000001', 'Deep Red', 'DR-01', '#900C3F', 10),
('b0000001-0000-0000-0000-000000000001', 'Rose Nude', 'RN-02', '#C70039', 8),
('b0000001-0000-0000-0000-000000000001', 'Mocha', 'MO-03', '#581845', 7)
ON CONFLICT DO NOTHING;

-- 3. Producto 2: Unique - Perfume Ccori Cristal
INSERT INTO public.productos (
    id, codigo_referencia, nombre, slug, descripcion,
    marca_id, categoria_id, precio_regular, precio_oferta, stock,
    es_destacado, es_nuevo, activo, imagen_principal
) VALUES (
    'b0000001-0000-0000-0000-000000000002',
    'UNI-CCORI-01',
    'Perfume Ccori Cristal L''Elixir',
    'perfume-ccori-cristal-elixir',
    'Aroma floral con notas brillantes de flor de azahar y jazmín. Alta fijación y elegancia.',
    (SELECT id FROM public.marcas WHERE slug = 'unique-yanbal' LIMIT 1),
    'a0000001-0000-0000-0000-000000000001',
    165.00, 119.00, 12,
    true, false, true,
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80'
) ON CONFLICT (slug) DO UPDATE SET 
    precio_oferta = EXCLUDED.precio_oferta,
    stock = EXCLUDED.stock;

-- 4. Producto 3: Ésika - Kalos Sport
INSERT INTO public.productos (
    id, codigo_referencia, nombre, slug, descripcion,
    marca_id, categoria_id, precio_regular, precio_oferta, stock,
    es_destacado, es_nuevo, activo, imagen_principal
) VALUES (
    'b0000001-0000-0000-0000-000000000003',
    'ESK-KALOS-01',
    'Kalos Sport Eau de Toilette',
    'kalos-sport-eau-de-toilette',
    'Fragancia fresca herbal para hombre, energía y vitalidad duradera durante todo el día.',
    (SELECT id FROM public.marcas WHERE slug = 'esika' LIMIT 1),
    'a0000001-0000-0000-0000-000000000001',
    95.00, 69.90, 15,
    false, true, true,
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80'
) ON CONFLICT (slug) DO UPDATE SET 
    precio_oferta = EXCLUDED.precio_oferta,
    stock = EXCLUDED.stock;

-- 5. Producto 4: Natura - Chronos Sérum
INSERT INTO public.productos (
    id, codigo_referencia, nombre, slug, descripcion,
    marca_id, categoria_id, precio_regular, precio_oferta, stock,
    es_destacado, es_nuevo, activo, imagen_principal
) VALUES (
    'b0000001-0000-0000-0000-000000000004',
    'NAT-CHRONOS-01',
    'Sérum Intensivo Antiarrugas Chronos',
    'serum-intensivo-antiarrugas-chronos',
    'Triple acción antiarrugas con bioactivos de la biodiversidad brasileña y ácido hialurónico.',
    (SELECT id FROM public.marcas WHERE slug = 'natura' LIMIT 1),
    'a0000001-0000-0000-0000-000000000003',
    142.00, 105.00, 8,
    true, false, true,
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80'
) ON CONFLICT (slug) DO UPDATE SET 
    precio_oferta = EXCLUDED.precio_oferta,
    stock = EXCLUDED.stock;

-- 6. Producto 5: Electro Hogar - Freidora de Aire Digital
INSERT INTO public.productos (
    id, codigo_referencia, nombre, slug, descripcion,
    marca_id, categoria_id, precio_regular, precio_oferta, stock,
    es_destacado, es_nuevo, activo, imagen_principal
) VALUES (
    'b0000001-0000-0000-0000-000000000005',
    'ELE-FREIDORA-01',
    'Freidora de Aire Digital 4.2L',
    'freidora-de-aire-digital-4-2l',
    'Cocina saludable con hasta 85% menos de grasa. Panel táctil LED con 8 programas preestablecidos.',
    (SELECT id FROM public.marcas WHERE slug = 'electro-hogar' LIMIT 1),
    'a0000001-0000-0000-0000-000000000004',
    289.00, 229.00, 6,
    true, true, true,
    'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80'
) ON CONFLICT (slug) DO UPDATE SET 
    precio_oferta = EXCLUDED.precio_oferta,
    stock = EXCLUDED.stock;

-- Variantes Freidora
INSERT INTO public.producto_variantes (producto_id, nombre, codigo_hex, stock) VALUES
('b0000001-0000-0000-0000-000000000005', 'Negro Mate', '#111827', 4),
('b0000001-0000-0000-0000-000000000005', 'Blanco Perla', '#F3F4F6', 2)
ON CONFLICT DO NOTHING;

-- 7. Producto 6: Unique - Crema Bio Milk
INSERT INTO public.productos (
    id, codigo_referencia, nombre, slug, descripcion,
    marca_id, categoria_id, precio_regular, precio_oferta, stock,
    es_destacado, es_nuevo, activo, imagen_principal
) VALUES (
    'b0000001-0000-0000-0000-000000000006',
    'UNI-CREMA-01',
    'Crema Hidratante Bio Milk Avena 750ml',
    'crema-hidratante-bio-milk-avena',
    'Fórmula enriquecida con proteínas de yogur probiótico y leche de avena. Piel suave y humectada.',
    (SELECT id FROM public.marcas WHERE slug = 'unique-yanbal' LIMIT 1),
    'a0000001-0000-0000-0000-000000000003',
    52.00, 36.90, 30,
    false, false, true,
    'https://images.unsplash.com/photo-1608248597359-2e06a31c5874?auto=format&fit=crop&w=600&q=80'
) ON CONFLICT (slug) DO UPDATE SET 
    precio_oferta = EXCLUDED.precio_oferta,
    stock = EXCLUDED.stock;

-- Actualizar teléfono en la configuración de la tienda
UPDATE public.configuracion_tienda 
SET whatsapp_pedidos = '51997491793'
WHERE id = 1;
