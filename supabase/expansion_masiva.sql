-- ==============================================================================
-- EXPANSION MASIVA DE PRODUCTOS (40 NUEVOS PRODUCTOS REALES)
-- CYZONE, BELCORP (L'BEL, ESIKA), UNIQUE YANBAL, NATURA Y ELECTRO HOGAR
-- ==============================================================================

-- 1. Asegurar política de inserción pública (o habilitar inserción para anon key)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'productos' AND policyname = 'Insercion publica de productos'
    ) THEN
        CREATE POLICY "Insercion publica de productos" ON public.productos FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'productos' AND policyname = 'Actualizacion publica de productos'
    ) THEN
        CREATE POLICY "Actualizacion publica de productos" ON public.productos FOR UPDATE USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'productos' AND policyname = 'Eliminacion publica de productos'
    ) THEN
        CREATE POLICY "Eliminacion publica de productos" ON public.productos FOR DELETE USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'producto_variantes' AND policyname = 'Acceso total variantes'
    ) THEN
        CREATE POLICY "Acceso total variantes" ON public.producto_variantes FOR ALL USING (true);
    END IF;
END $$;

-- 2. Asegurar marcas L'BEL si aún no estuviera
INSERT INTO public.marcas (nombre, slug, categoria_principal, activo) VALUES
('L''BEL', 'lbel', 'COSMETICOS', true)
ON CONFLICT (slug) DO NOTHING;

-- 3. INSERCIÓN DE 40 PRODUCTOS ADICIONALES
INSERT INTO public.productos (
    codigo_referencia, nombre, slug, descripcion,
    marca_id, categoria_id, stock, es_destacado, es_nuevo, activo, imagen_principal
) VALUES
-- === CYZONE ===
(
    'CYZ-POTION-01',
    'In Love Potion Eau de Parfum',
    'in-love-potion-eau-de-parfum-cyzone',
    'Frutal gourmand. Notas chispeantes de mandarina, toque floral de violeta y fondo adictivo de caramelo dulce. Tecnologia EssentTech.',
    (SELECT id FROM public.marcas WHERE slug = 'cyzone' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'fragancias' LIMIT 1),
    35, true, true, true,
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
    50, true, true, true,
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80'
),
(
    'CYZ-SKIN-01',
    'Gel Limpiador Facial Purificante Skin First',
    'gel-limpiador-facial-purificante-skin-first-cyzone',
    'Limpia profundamente reduciendo el exceso de grasa y brillo en la zona T con extracto de cafe y limon.',
    (SELECT id FROM public.marcas WHERE slug = 'cyzone' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'cuidado-facial' LIMIT 1),
    28, false, false, true,
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80'
),
(
    'CYZ-CYPLAY-01',
    'Delineador Liquido Metalico Cy Play',
    'delineador-liquido-metalico-cy-play',
    'Punta pincel ultra precisa con pigmentos brillantes de alta intensidad. No se corre ni transfiere.',
    (SELECT id FROM public.marcas WHERE slug = 'cyzone' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'maquillaje' LIMIT 1),
    40, false, true, true,
    'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?auto=format&fit=crop&w=600&q=80'
),
(
    'CYZ-STUDIO-POLVO',
    'Polvo Compacto Matificante Studio Look',
    'polvo-compacto-matificante-studio-look-cyzone',
    'Control de brillo por 12 horas. Formula sedosa que unifica el tono de piel sin dejar efecto acartonado.',
    (SELECT id FROM public.marcas WHERE slug = 'cyzone' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'maquillaje' LIMIT 1),
    30, true, false, true,
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80'
),
(
    'CYZ-BROW-01',
    'Plumon para Cejas Efecto Microblading Oh My Brow',
    'plumon-cejas-efecto-microblading-cyzone',
    'Punta triple que dibuja trazos ultra finos imitando el pelo natural de las cejas. Larga duracion.',
    (SELECT id FROM public.marcas WHERE slug = 'cyzone' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'maquillaje' LIMIT 1),
    35, false, true, true,
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
),
(
    'CYZ-GIRL-POWER',
    'Perfume Pure Girl Power Eau de Toilette',
    'perfume-pure-girl-power-cyzone',
    'Fragancia frutal chispeante con notas de manzana verde, frutos del bosque y flores suaves.',
    (SELECT id FROM public.marcas WHERE slug = 'cyzone' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'fragancias' LIMIT 1),
    22, false, false, true,
    'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80'
),
(
    'CYZ-FIX-MIST',
    'Fijador de Maquillaje en Spray Studio Look',
    'fijador-de-maquillaje-spray-studio-look-cyzone',
    'Bruma ligera que sella el maquillaje hasta por 16 horas, manteniendo un acabado fresco y sin brillo.',
    (SELECT id FROM public.marcas WHERE slug = 'cyzone' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'maquillaje' LIMIT 1),
    45, true, false, true,
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80'
),

-- === UNIQUE / YANBAL ===
(
    'UNI-TEMPT-01',
    'Perfume Temptation Mujer Eau de Parfum',
    'perfume-temptation-mujer-unique-yanbal',
    'Aroma floral especiado con notas intensas de flor de naranja y pimienta rosa. El clasico de seduccion de Yanbal.',
    (SELECT id FROM public.marcas WHERE slug = 'unique-yanbal' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'fragancias' LIMIT 1),
    25, true, false, true,
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80'
),
(
    'UNI-OHM-01',
    'Perfume Ohm para Hombre Eau de Cologne',
    'perfume-ohm-hombre-unique-yanbal',
    'Aroma herbal con notas frescas de salvia, lavanda y maderas nobles. Fragancia emblematica y varonil.',
    (SELECT id FROM public.marcas WHERE slug = 'unique-yanbal' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'fragancias' LIMIT 1),
    28, true, false, true,
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80'
),
(
    'UNI-SUERO-01',
    'Suero Concentrado Antimanchas Control Blanc',
    'suero-concentrado-antimanchas-control-blanc-unique',
    'Tecnologia avanzada con niacinamida y extracto de uva que unifica el tono de la piel y reduce manchas solares.',
    (SELECT id FROM public.marcas WHERE slug = 'unique-yanbal' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'cuidado-facial' LIMIT 1),
    20, false, true, true,
    'https://images.unsplash.com/photo-1608248597359-2e06a31c5874?auto=format&fit=crop&w=600&q=80'
),
(
    'UNI-HYDRA-01',
    'Labial Hydra-Lip Larga Duracion',
    'labial-hydra-lip-larga-duracion-unique',
    'Color de alto impacto con manteca de myrica que nutre y acondiciona los labios hasta por 12 horas.',
    (SELECT id FROM public.marcas WHERE slug = 'unique-yanbal' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'maquillaje' LIMIT 1),
    38, true, false, true,
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'
),
(
    'UNI-GAIA-01',
    'Perfume Gaia Eau de Parfum',
    'perfume-gaia-eau-de-parfum-unique',
    'Fragancia floral ambarada con orquideas salvajes y toques de vainilla de Madagascar.',
    (SELECT id FROM public.marcas WHERE slug = 'unique-yanbal' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'fragancias' LIMIT 1),
    18, true, false, true,
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80'
),
(
    'UNI-CREMA-MANOS',
    'Crema Reparadora para Manos Uña de Gato',
    'crema-reparadora-manos-una-de-gato-unique',
    'Poder antioxidante de la selva amazonica que repara la piel agrietada y reseca.',
    (SELECT id FROM public.marcas WHERE slug = 'unique-yanbal' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'cuidado-facial' LIMIT 1),
    50, false, false, true,
    'https://images.unsplash.com/photo-1608248597359-2e06a31c5874?auto=format&fit=crop&w=600&q=80'
),
(
    'UNI-TITANIUM-01',
    'Perfume Titanium Hombre Eau de Cologne',
    'perfume-titanium-hombre-unique',
    'Aroma oriental moderno con ambar gris, cardamomo y cedro para el hombre audaz.',
    (SELECT id FROM public.marcas WHERE slug = 'unique-yanbal' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'fragancias' LIMIT 1),
    22, false, true, true,
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80'
),
(
    'UNI-BASE-MATTE',
    'Base de Maquillaje Anti-Edad Elixir de Vida FPS 20',
    'base-maquillaje-antiedad-elixir-vida-unique',
    'Efecto tensor inmediato con resveratrol que disimula imperfecciones y rejuvenece el rostro.',
    (SELECT id FROM public.marcas WHERE slug = 'unique-yanbal' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'maquillaje' LIMIT 1),
    25, true, false, true,
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
),

-- === ESIKA ===
(
    'ESK-RED-01',
    'Perfume Red Power Eau de Parfum',
    'perfume-red-power-esika',
    'Aroma floral maderoso con flor de siempreviva y nectar de grosella. Fuerza, determinacion y feminidad.',
    (SELECT id FROM public.marcas WHERE slug = 'esika' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'fragancias' LIMIT 1),
    26, true, true, true,
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80'
),
(
    'ESK-COLORFIX-01',
    'Labial Colorfix Liquid Tattoo 24H',
    'labial-colorfix-liquid-tattoo-24h-esika',
    'Cero transferencia a mascarillas o vasos. Acabado mate impecable que no reseca los labios.',
    (SELECT id FROM public.marcas WHERE slug = 'esika' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'maquillaje' LIMIT 1),
    48, true, false, true,
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'
),
(
    'ESK-TRIPLE-01',
    'Crema Facial Antiarrugas Triple Accion Max',
    'crema-facial-antiarrugas-triple-accion-max-esika',
    'Nutricion, firmeza y reduccion de lineas de expresion con complejo bio-reparador de colageno vegetal.',
    (SELECT id FROM public.marcas WHERE slug = 'esika' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'cuidado-facial' LIMIT 1),
    35, false, false, true,
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80'
),
(
    'ESK-DORADO-01',
    'Perfume Iluminas Dorado Eau de Parfum',
    'perfume-iluminas-dorado-esika',
    'Notas exquisitas de rosas de mayo, praline y maderas preciosas. Brillo y elegancia femenina.',
    (SELECT id FROM public.marcas WHERE slug = 'esika' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'fragancias' LIMIT 1),
    20, false, false, true,
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80'
),
(
    'ESK-PULVER-MASCARA',
    'Mascara Curvas Peligrosas Efecto Rizado Extremo',
    'mascara-curvas-peligrosas-esika',
    'Cepillo ergonomico curvo que levanta las pestanas desde la raiz hasta la punta.',
    (SELECT id FROM public.marcas WHERE slug = 'esika' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'maquillaje' LIMIT 1),
    42, false, true, true,
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80'
),
(
    'ESK-OXYGEN-01',
    'Agua Micelar Desmaquillante Oxygen Supreme',
    'agua-micelar-oxygen-supreme-esika',
    'Limpia, desmaquilla, tonifica e hidrata en un solo paso con celulas madre vegetales.',
    (SELECT id FROM public.marcas WHERE slug = 'esika' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'cuidado-facial' LIMIT 1),
    30, false, false, true,
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80'
),

-- === L'BEL (ALTA GAMA BELCORP) ===
(
    'LBL-MITHYKA-01',
    'Perfume Mithyka L''Bel Eau de Parfum',
    'perfume-mithyka-lbel',
    'Bouquet floral opulento con jazmin de Sambac y tuberosa. La fragancia insignia de L''Bel.',
    (SELECT id FROM public.marcas WHERE slug = 'lbel' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'fragancias' LIMIT 1),
    15, true, true, true,
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80'
),
(
    'LBL-CONCENTRE-01',
    'Suero Facial Antiedad Global Concentre Total',
    'suero-facial-antiedad-global-concentre-total-lbel',
    'Afirma, alisa, aclara, hidrata y revitaliza la piel con nanotecnologia francesa.',
    (SELECT id FROM public.marcas WHERE slug = 'lbel' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'cuidado-facial' LIMIT 1),
    12, true, false, true,
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80'
),
(
    'LBL-ROUGE-LIP',
    'Labial Rouge L''Intense Textura Terciopelo',
    'labial-rouge-lintense-lbel',
    'Maxima pigmentacion francesa con ceramidas que mantienen el confort y la definicion labial.',
    (SELECT id FROM public.marcas WHERE slug = 'lbel' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'maquillaje' LIMIT 1),
    25, false, true, true,
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80'
),
(
    'LBL-BLEU-INTENSE',
    'Perfume Bleu Intense Masculino Eau de Toilette',
    'perfume-bleu-intense-masculino-lbel',
    'Aroma herbal acuatico con notas oceanicas vivas y madera de guaiaco.',
    (SELECT id FROM public.marcas WHERE slug = 'lbel' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'fragancias' LIMIT 1),
    20, true, false, true,
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80'
),

-- === NATURA ===
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
(
    'NAT-HUMOR-01',
    'Colonia Meu Primeiro Humor Femenino',
    'colonia-meu-primeiro-humor-natura',
    'Fragancia frutal fresca con notas de pera congelada, ciruela y flor de jazmin.',
    (SELECT id FROM public.marcas WHERE slug = 'natura' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'fragancias' LIMIT 1),
    30, true, false, true,
    'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80'
),
(
    'NAT-CHRONOS-ACQUA',
    'Acqua Biohidratante Renovador Chronos',
    'acqua-biohidratante-renovador-chronos-natura',
    'Acido hialuronico que promueve una recarga instantanea de hidratacion de hasta 5 veces mas en la piel.',
    (SELECT id FROM public.marcas WHERE slug = 'natura' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'cuidado-facial' LIMIT 1),
    22, true, true, true,
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80'
),
(
    'NAT-EKOS-PITANGA',
    'Frescor de Pitanga Ekos Colonia Femenina',
    'frescor-de-pitanga-ekos-natura',
    'Enriquecido con aceite esencial 100% natural de hojas de pitanga. Energia vibrante de la Amazonia.',
    (SELECT id FROM public.marcas WHERE slug = 'natura' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'fragancias' LIMIT 1),
    28, false, false, true,
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80'
),
(
    'NAT-MANTECA-MANOS',
    'Pulpa Hidratante Corporal Ekos Andiroba',
    'pulpa-hidratante-corporal-ekos-andiroba-natura',
    'Restaura la barrera cutanea con accion anti-danos y relajante muscular para el cuerpo.',
    (SELECT id FROM public.marcas WHERE slug = 'natura' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'cuidado-facial' LIMIT 1),
    35, false, false, true,
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80'
),

-- === ELECTRO HOGAR & BELLEZA ===
(
    'ELE-ONDULADOR-01',
    'Ondulador Giratorio Automatico Ceramica Turmalina',
    'ondulador-giratorio-automatico-ceramica',
    'Rizos perfectos y sin esfuerzo en segundos con control de temperatura digital y apagado automatico de seguridad.',
    (SELECT id FROM public.marcas WHERE slug = 'electro-hogar' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'electro-hogar' LIMIT 1),
    15, true, true, true,
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
),
(
    'ELE-CEPILLO-01',
    'Cepillo Secador y Alisador Voluminizador One-Step',
    'cepillo-secador-alisador-voluminizador-one-step',
    'Seca, alisa y da volumen en un solo paso con tecnologia de iones que reduce el frizz y protege las puntas.',
    (SELECT id FROM public.marcas WHERE slug = 'electro-hogar' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'electro-hogar' LIMIT 1),
    20, true, false, true,
    'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80'
),
(
    'ELE-DEPILADORA-IPL',
    'Depiladora Laser IPL Luz Pulsada Definitiva',
    'depiladora-laser-ipl-luz-pulsada-definitiva',
    '5 niveles de intensidad y 999,000 pulsos de luz para una depilacion suave, indolora y definitiva en casa.',
    (SELECT id FROM public.marcas WHERE slug = 'electro-hogar' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'electro-hogar' LIMIT 1),
    10, true, true, true,
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
),
(
    'ELE-PLANCHA-VAPOR',
    'Plancha de Cabello Nano Titanium Placas de Vapor',
    'plancha-cabello-nano-titanium-placas-vapor',
    'Alisado sedoso e hidratado con infusion de vapor. Placas anchas que reducen el tiempo de planchado.',
    (SELECT id FROM public.marcas WHERE slug = 'electro-hogar' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'electro-hogar' LIMIT 1),
    18, false, false, true,
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
),
(
    'ELE-EXTRACTOR-PUNTOS',
    'Succionador Facial de Poros y Puntos Negros al Vacio',
    'succionador-facial-poros-puntos-negros-vacio',
    'Limpieza profunda de cutis con 4 cabezales intercambiables y bateria recargable USB.',
    (SELECT id FROM public.marcas WHERE slug = 'electro-hogar' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'electro-hogar' LIMIT 1),
    25, false, true, true,
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80'
),
(
    'ELE-ESPEJO-LED',
    'Espejo Tocador Giratorio con Luces LED Touch',
    'espejo-tocador-giratorio-luces-led-touch',
    'Iluminacion natural regulable de 3 tonalidades con aumento 2X y 3X para maquillaje de precision.',
    (SELECT id FROM public.marcas WHERE slug = 'electro-hogar' LIMIT 1),
    (SELECT id FROM public.categorias WHERE slug = 'electro-hogar' LIMIT 1),
    20, true, false, true,
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80'
)
ON CONFLICT (slug) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    descripcion = EXCLUDED.descripcion,
    imagen_principal = EXCLUDED.imagen_principal,
    stock = EXCLUDED.stock;

-- 4. INSERTAR VARIANTES DE TONO PARA LOS NUEVOS LABIALES Y BASES
INSERT INTO public.producto_variantes (producto_id, nombre, codigo_tono, codigo_hex, stock)
SELECT id, 'Rojo Passion', 'RP-01', '#990000', 10 FROM public.productos WHERE slug = 'labial-rouge-lintense-lbel'
ON CONFLICT DO NOTHING;

INSERT INTO public.producto_variantes (producto_id, nombre, codigo_tono, codigo_hex, stock)
SELECT id, 'Nude Chic', 'NC-02', '#C28B78', 8 FROM public.productos WHERE slug = 'labial-rouge-lintense-lbel'
ON CONFLICT DO NOTHING;

INSERT INTO public.producto_variantes (producto_id, nombre, codigo_tono, codigo_hex, stock)
SELECT id, 'Vino Imperial', 'VI-03', '#5E1929', 7 FROM public.productos WHERE slug = 'labial-rouge-lintense-lbel'
ON CONFLICT DO NOTHING;

INSERT INTO public.producto_variantes (producto_id, nombre, codigo_tono, codigo_hex, stock)
SELECT id, 'Tono Claro 1', 'TC-01', '#F4DFD0', 12 FROM public.productos WHERE slug = 'base-maquillaje-antiedad-elixir-vida-unique'
ON CONFLICT DO NOTHING;

INSERT INTO public.producto_variantes (producto_id, nombre, codigo_tono, codigo_hex, stock)
SELECT id, 'Tono Medio 2', 'TM-02', '#E1B899', 10 FROM public.productos WHERE slug = 'base-maquillaje-antiedad-elixir-vida-unique'
ON CONFLICT DO NOTHING;
