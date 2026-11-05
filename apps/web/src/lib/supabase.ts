import { createClient } from '@supabase/supabase-js';
import { MARCAS_MOCK, PRODUCTOS_MOCK } from './mockData';
import { Producto, Marca } from '@/types/catalogo';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://tu-proyecto.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Funciones para obtener productos con fallback transparente a mockData
export async function getProductos(): Promise<Producto[]> {
  if (!isSupabaseConfigured || !supabase) {
    return PRODUCTOS_MOCK;
  }

  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*, marca:marcas(*), categoria:categorias(*), variantes:producto_variantes(*)')
      .eq('activo', true)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn('Supabase sin datos o con error, usando mockData:', error?.message);
      return PRODUCTOS_MOCK;
    }

    return data as Producto[];
  } catch (err) {
    console.error('Error conectando a Supabase:', err);
    return PRODUCTOS_MOCK;
  }
}

export async function getMarcas(): Promise<Marca[]> {
  if (!isSupabaseConfigured || !supabase) {
    return MARCAS_MOCK;
  }

  try {
    const { data, error } = await supabase
      .from('marcas')
      .select('*')
      .eq('activo', true);

    if (error || !data || data.length === 0) {
      return MARCAS_MOCK;
    }

    return data as Marca[];
  } catch (err) {
    return MARCAS_MOCK;
  }
}
