import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !apiKey || supabaseUrl === 'https://tu-proyecto.supabase.co') {
    return NextResponse.json({ error: 'Supabase no configurado' }, { status: 500 });
  }

  try {
    const supabase = createClient(supabaseUrl, apiKey, {
      auth: { persistSession: false }
    });

    const { data, error } = await supabase
      .from('productos')
      .select('*, marca:marcas(*), categoria:categorias(*), variantes:producto_variantes(*)')
      .eq('activo', true)
      .order('created_at', { ascending: false })
      .limit(1000);

    if (error) {
      console.error('Error fetching productos from Supabase:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || [], {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    console.error('API productos error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
