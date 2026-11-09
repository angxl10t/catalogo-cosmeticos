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
    console.error('API productos GET error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const apiKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !apiKey || supabaseUrl === 'https://tu-proyecto.supabase.co') {
    return NextResponse.json({ error: 'Supabase no configurado' }, { status: 500 });
  }

  try {
    const supabase = createClient(supabaseUrl, apiKey, {
      auth: { persistSession: false }
    });

    const body = await req.json();
    const { action, payload, productoId, variantes } = body;

    // 1. Eliminar producto
    if (action === 'delete') {
      if (!productoId) {
        return NextResponse.json({ error: 'Falta productoId' }, { status: 400 });
      }
      const { error } = await supabase.from('productos').delete().eq('id', productoId);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // 2. Conmutar activo/inactivo
    if (action === 'toggle_activo') {
      if (!productoId) {
        return NextResponse.json({ error: 'Falta productoId' }, { status: 400 });
      }
      const { error } = await supabase
        .from('productos')
        .update({ activo: body.activo, updated_at: new Date().toISOString() })
        .eq('id', productoId);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // 3. Actualizar producto existente
    if (action === 'update') {
      if (!productoId) {
        return NextResponse.json({ error: 'Falta productoId' }, { status: 400 });
      }

      const { error } = await supabase
        .from('productos')
        .update(payload)
        .eq('id', productoId);

      if (error) throw error;

      // Actualizar variantes si se especifican
      if (Array.isArray(variantes)) {
        await supabase.from('producto_variantes').delete().eq('producto_id', productoId);
        if (variantes.length > 0) {
          const varPayload = variantes.map((v: { nombre: string; codigo_tono?: string; codigo_hex?: string; stock?: number }, idx: number) => ({
            producto_id: productoId,
            nombre: v.nombre,
            codigo_tono: v.codigo_tono || `TONO-${idx + 1}`,
            codigo_hex: v.codigo_hex || '#A30000',
            stock: v.stock || 5,
            activo: true,
          }));
          const { error: varErr } = await supabase.from('producto_variantes').insert(varPayload);
          if (varErr) console.error('Error insertando variantes:', varErr.message);
        }
      }

      return NextResponse.json({ success: true });
    }

    // 4. Crear nuevo producto
    if (action === 'create') {
      const { data, error } = await supabase
        .from('productos')
        .insert(payload)
        .select('id')
        .single();

      if (error) throw error;
      const nuevoId = data.id;

      if (Array.isArray(variantes) && variantes.length > 0) {
        const varPayload = variantes.map((v: { nombre: string; codigo_tono?: string; codigo_hex?: string; stock?: number }, idx: number) => ({
          producto_id: nuevoId,
          nombre: v.nombre,
          codigo_tono: v.codigo_tono || `TONO-${idx + 1}`,
          codigo_hex: v.codigo_hex || '#A30000',
          stock: v.stock || 5,
          activo: true,
        }));
        await supabase.from('producto_variantes').insert(varPayload);
      }

      return NextResponse.json({ success: true, id: nuevoId });
    }

    return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Error desconocido';
    console.error('API productos POST error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
