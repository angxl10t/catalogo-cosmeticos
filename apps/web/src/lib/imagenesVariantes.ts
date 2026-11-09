import { Producto, VarianteProducto } from '@/types/catalogo';

export const MAPA_IMAGENES_VARIANTES: Record<string, string> = {
  // Labiales Rojos
  'Rojo Pasión': 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=700&auto=format&fit=crop',
  'Rojo Passion': 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=700&auto=format&fit=crop',
  'Rojo Carmesí': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=700&auto=format&fit=crop',
  'Rojo Carmesi': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=700&auto=format&fit=crop',

  // Labiales Nude & Cálidos
  'Nude Romántico': 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?q=80&w=700&auto=format&fit=crop',
  'Nude Chic': 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?q=80&w=700&auto=format&fit=crop',
  'Nude Natural': 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?q=80&w=700&auto=format&fit=crop',
  'Nude Almendra': 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?q=80&w=700&auto=format&fit=crop',
  'Canela Terracota': 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=700&auto=format&fit=crop',
  'Coral Radiante': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=700&auto=format&fit=crop',

  // Labiales Vino / Borgoña
  'Vino Borgoña': 'https://images.unsplash.com/photo-1591360236480-4ed861025fa1?q=80&w=700&auto=format&fit=crop',
  'Vino Imperial': 'https://images.unsplash.com/photo-1591360236480-4ed861025fa1?q=80&w=700&auto=format&fit=crop',
  'Vino Profundo': 'https://images.unsplash.com/photo-1591360236480-4ed861025fa1?q=80&w=700&auto=format&fit=crop',
  'Cereza Intensa': 'https://images.unsplash.com/photo-1591360236480-4ed861025fa1?q=80&w=700&auto=format&fit=crop',

  // Labiales Rosados & Fucsia
  'Rosa Pastel': 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=700&auto=format&fit=crop',
  'Fucsia Pop': 'https://images.unsplash.com/photo-1503236823255-94609f598e71?q=80&w=700&auto=format&fit=crop',
  'Malva Chic': 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=700&auto=format&fit=crop',

  // Bases, Polvos & Correctores
  'Claro 1 (Porcelana)': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=700&auto=format&fit=crop',
  'Claro 10': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=700&auto=format&fit=crop',
  'Claro 2 (Marfil)': 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?q=80&w=700&auto=format&fit=crop',
  'Medio 1 (Beige Natural)': 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=700&auto=format&fit=crop',
  'Medio 20': 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=700&auto=format&fit=crop',
  'Medio 2 (Arena Cálida)': 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=700&auto=format&fit=crop',
  'Medio 30': 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=700&auto=format&fit=crop',
  'Medio Oscuro 30': 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=700&auto=format&fit=crop',
  'Oscuro 1 (Bronce Suave)': 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?q=80&w=700&auto=format&fit=crop',
  'Neutralizador Ojeras': 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=700&auto=format&fit=crop',

  // Esmaltes de Uñas
  'Rosa Francés': 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=700&auto=format&fit=crop',
  'Blanco Perla': 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?q=80&w=700&auto=format&fit=crop',
  'Lila Lavanda': 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=700&auto=format&fit=crop',
  'Menta Fresca': 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=700&auto=format&fit=crop',
  'Cielo Pastel': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=700&auto=format&fit=crop',
  'Amarillo Sol': 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=700&auto=format&fit=crop',

  // Sombras & Delineadores
  'Warm Sunset (Cálidos)': 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=700&auto=format&fit=crop',
  'Nude Essentials (Neutros)': 'https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?q=80&w=700&auto=format&fit=crop',
  'Smoky Night (Ahumados)': 'https://images.unsplash.com/photo-1503236823255-94609f598e71?q=80&w=700&auto=format&fit=crop',
  'Rose Glam (Rosados)': 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=700&auto=format&fit=crop',
  'Negro Onix': 'https://images.unsplash.com/photo-1503236823255-94609f598e71?q=80&w=700&auto=format&fit=crop',
};

/**
 * Obtiene la imagen adecuada para un producto según la variante o tono seleccionado.
 * 1. Si la variante tiene `imagen_url` propia, se usa prioritariamente.
 * 2. Si no tiene pero coincide con el catálogo de tonos, se obtiene la imagen temática del tono.
 * 3. En caso contrario, se retorna la imagen principal del producto.
 */
export function obtenerImagenProducto(producto: Producto, variante?: VarianteProducto): string {
  if (variante?.imagen_url) {
    return variante.imagen_url;
  }
  if (variante?.nombre) {
    const mapeada = MAPA_IMAGENES_VARIANTES[variante.nombre];
    if (mapeada) return mapeada;
  }
  return producto.imagen_principal;
}
