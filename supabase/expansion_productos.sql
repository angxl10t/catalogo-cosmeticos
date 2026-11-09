-- ==============================================================================
-- EXPANSION MASIVA DE CATALOGO (CYZONE, BELCORP, UNIQUE, NATURA, ELECTRO)
-- ENFOQUE DE CONSULTA DIRECTA (PRECIO POR WHATSAPP)
-- ==============================================================================

-- 1. Asegurar politica de insercion o ejecucion directa
INSERT INTO public.productos (
    codigo_referencia, nombre, slug, descripcion,
    marca_id, categoria_id, stock,
    es_destacado, es_nuevo, activo, imagen_principal
) VALUES
-- CYZONE
(
    'CYZ-POTION-01',
    'In Love Potion Eau de Parfum',
    'in-love-potion-eau-de-parfum-cyzone',
    'Frutal gourmand. Notas chispeantes de mandarina, toque floral de violeta y fondo adictivo de caramelo dulce. Tecnologia EssentTech.',
    (SELECT id FROM public.marcas WHERE slug = 'cyzone' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'fragancias' LIMIT 1),
    25, true, true, true,
    '/hero-cyzone.jpg'
),
(
    'CYZ-DANCING-01',
    'Dancing Sunset Eau de Parfum',
    'dancing-sunset-eau-de-parfum-cyzone',
    'Aroma oriental dulce con vibrantes notas de melocoton y flores blancas. Ideal para fiestas y salidas nocturnas.',
    (SELECT id FROM public.marcas WHERE slug = 'cyzone' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'fragancias' LIMIT 1),
    30, true, false, true,
    'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80'
),
(
    'CYZ-MAGNETIC-01',
    'Mascara Magnetic Lash Efecto Extension',
    'mascara-magnetic-lash-cyzone',
    'Pestanas visiblemente mas largas con tecnologia magnetica. Formula a prueba de agua que dura hasta 24 horas sin grumos.',
    (SELECT id FROM public.marcas WHERE slug = 'cyzone' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'maquillaje' LIMIT 1),
    40, true, true, true,
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80'
),
(
    'CYZ-SKIN-01',
    'Gel Limpiador Facial Purificante Skin First',
    'gel-limpiador-facial-purificante-skin-first-cyzone',
    'Limpia profundamente reduciendo el exceso de grasa y brillo en la zona T con extracto de cafe y limon.',
    (SELECT id FROM public.marcas WHERE slug = 'cyzone' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'cuidado-facial' LIMIT 1),
    20, false, false, true,
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80'
),
(
    'CYZ-CYPLAY-01',
    'Delineador Liquido Metalico Cy Play',
    'delineador-liquido-metalico-cy-play',
    'Punta pincel ultra precisa con pigmentos brillantes de alta intensidad. No se corre ni transfiere.',
    (SELECT id FROM public.marcas WHERE slug = 'cyzone' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'maquillaje' LIMIT 1),
    35, false, true, true,
    'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=600&q=80'
),

-- UNIQUE / YANBAL
(
    'UNI-TEMPT-01',
    'Perfume Temptation Mujer Eau de Parfum',
    'perfume-temptation-mujer-unique-yanbal',
    'Aroma floral especiado con notas intensas de flor de naranja y pimienta rosa. El clasico de seduccion de Yanbal.',
    (SELECT id FROM public.marcas WHERE slug = 'unique-yanbal' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'fragancias' LIMIT 1),
    18, true, false, true,
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80'
),
(
    'UNI-OHM-01',
    'Perfume Ohm para Hombre Eau de Cologne',
    'perfume-ohm-hombre-unique-yanbal',
    'Aroma herbal con notas frescas de salvia, lavanda y maderas nobles. Fragancia emblematica y varonil.',
    (SELECT id FROM public.marcas WHERE slug = 'unique-yanbal' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'fragancias' LIMIT 1),
    22, true, false, true,
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80'
),
(
    'UNI-SUERO-01',
    'Suero Concentrado Antimanchas Control Blanc',
    'suero-concentrado-antimanchas-control-blanc-unique',
    'Tecnologia avanzada con niacinamida y extracto de uva que unifica el tono de la piel y reduce manchas solares.',
    (SELECT id FROM public.marcas WHERE slug = 'unique-yanbal' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'cuidado-facial' LIMIT 1),
    15, false, true, true,
    'https://images.unsplash.com/photo-1608248597359-2e06a31c5874?auto=format&fit=crop&w=600&q=80'
),
(
    'UNI-HYDRA-01',
    'Labial Hydra-Lip Larga Duracion',
    'labial-hydra-lip-larga-duracion-unique',
    'Color de alto impacto con manteca de myrica que nutre y acondiciona los labios hasta por 12 horas.',
    (SELECT id FROM public.marcas WHERE slug = 'unique-yanbal' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'maquillaje' LIMIT 1),
    30, true, false, true,
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'
),

-- ESIKA
(
    'ESK-RED-01',
    'Perfume Red Power Eau de Parfum',
    'perfume-red-power-esika',
    'Aroma floral maderoso con flor de siempreviva y nectar de grosella. Fuerza, determinacion y feminidad.',
    (SELECT id FROM public.marcas WHERE slug = 'esika' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'fragancias' LIMIT 1),
    20, true, true, true,
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80'
),
(
    'ESK-COLORFIX-01',
    'Labial Colorfix Liquid Tattoo 24H',
    'labial-colorfix-liquid-tattoo-24h-esika',
    'Cero transferencia a mascarillas o vasos. Acabado mate impecable que no reseca los labios.',
    (SELECT id FROM public.marcas WHERE slug = 'esika' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'maquillaje' LIMIT 1),
    45, true, false, true,
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'
),
(
    'ESK-TRIPLE-01',
    'Crema Facial Antiarrugas Triple Accion Max',
    'crema-facial-antiarrugas-triple-accion-max-esika',
    'Nutricion, firmeza y reduccion de lineas de expresion con complejo bio-reparador de colageno vegetal.',
    (SELECT id FROM public.marcas WHERE slug = 'esika' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'cuidado-facial' LIMIT 1),
    30, false, false, true,
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80'
),

-- NATURA
(
    'NAT-KAYAK-01',
    'Perfume Kaiak Masculino Clasico',
    'perfume-kaiak-masculino-clasico-natura',
    'Aroma acuatico aromatico con notas de bergamota y maderas marinas. Hiper frescura e intensidad natural.',
    (SELECT id FROM public.marcas WHERE slug = 'natura' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'fragancias' LIMIT 1),
    25, true, false, true,
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80'
),
(
    'NAT-LUMINA-01',
    'Mascara Regeneradora Lumina Cabello Danado',
    'mascara-regeneradora-lumina-natura',
    'Biotecnologia pro-teia que rellena la fibra capilar de adentro hacia afuera devolviendo fuerza y brillo.',
    (SELECT id FROM public.marcas WHERE slug = 'natura' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'cuidado-facial' LIMIT 1),
    20, false, true, true,
    'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80'
),

-- ELECTRO HOGAR & BELLEZA
(
    'ELE-ONDULADOR-01',
    'Ondulador Giratorio Automatico Ceramica Turmalina',
    'ondulador-giratorio-automatico-ceramica',
    'Rizos perfectos y sin esfuerzo en segundos con control de temperatura digital y apagado automatico de seguridad.',
    (SELECT id FROM public.marcas WHERE slug = 'electro-hogar' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'electro-hogar' LIMIT 1),
    12, true, true, true,
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
),
(
    'ELE-CEPILLO-01',
    'Cepillo Secador y Alisador Voluminizador One-Step',
    'cepillo-secador-alisador-voluminizador-one-step',
    'Seca, alisa y da volumen en un solo paso con tecnologia de iones que reduce el frizz y protege las puntas.',
    (SELECT id FROM public.marcas WHERE slug = 'electro-hogar' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'electro-hogar' LIMIT 1),
    15, true, false, true,
    'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80'
)
ON CONFLICT (slug) DO NOTHING;
