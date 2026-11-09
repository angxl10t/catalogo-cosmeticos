'use client';

import { useState, useEffect } from 'react';
import { Producto, Marca, Categoria } from '@/types/catalogo';
import { supabase } from '@/lib/supabase';
import { X, Plus, Trash2, Save } from 'lucide-react';

interface ModalProps {
  abierto: boolean;
  onCerrar: () => void;
  onGuardado: () => void;
  productoEditar?: Producto | null;
  marcas: Marca[];
  categorias: Categoria[];
}

export function ProductoFormModal({
  abierto,
  onCerrar,
  onGuardado,
  productoEditar,
  marcas,
  categorias,
}: ModalProps) {
  const [nombre, setNombre] = useState('');
  const [codigoRef, setCodigoRef] = useState('');
  const [marcaId, setMarcaId] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [precioRegular, setPrecioRegular] = useState('0');
  const [precioOferta, setPrecioOferta] = useState('');
  const [stock, setStock] = useState('10');
  const [descripcion, setDescripcion] = useState('');
  const [imagenPrincipal, setImagenPrincipal] = useState('');
  const [esDestacado, setEsDestacado] = useState(false);
  const [esNuevo, setEsNuevo] = useState(true);
  const [activo, setActivo] = useState(true);

  // Variantes
  const [variantes, setVariantes] = useState<{ id?: string; nombre: string; codigo_hex: string; stock: number; codigo_tono?: string }[]>([]);

  const [guardando, setGuardando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Efecto crucial: sincronizar todos los datos cuando se abre el modal o cambia el producto a editar
  useEffect(() => {
    if (!abierto) return;

    if (productoEditar) {
      // 1. Cargar datos del producto existente
      setNombre(productoEditar.nombre || '');
      setCodigoRef(productoEditar.codigo_referencia || '');
      
      const mId = productoEditar.marca_id || productoEditar.marca?.id || (marcas.length > 0 ? marcas[0].id : '');
      setMarcaId(mId);

      const cId = productoEditar.categoria_id || productoEditar.categoria?.id || (categorias.length > 0 ? categorias[0].id : '');
      setCategoriaId(cId);

      setPrecioRegular(
        productoEditar.precio_regular !== undefined && productoEditar.precio_regular !== null
          ? String(productoEditar.precio_regular)
          : '0'
      );
      setPrecioOferta(
        productoEditar.precio_oferta !== undefined && productoEditar.precio_oferta !== null
          ? String(productoEditar.precio_oferta)
          : ''
      );
      setStock(
        productoEditar.stock !== undefined && productoEditar.stock !== null
          ? String(productoEditar.stock)
          : '10'
      );
      setDescripcion(productoEditar.descripcion || '');
      setImagenPrincipal(productoEditar.imagen_principal || '');
      setEsDestacado(Boolean(productoEditar.es_destacado));
      setEsNuevo(Boolean(productoEditar.es_nuevo));
      setActivo(productoEditar.activo !== false);

      if (productoEditar.variantes && productoEditar.variantes.length > 0) {
        setVariantes(
          productoEditar.variantes.map((v) => ({
            id: v.id,
            nombre: v.nombre,
            codigo_hex: v.codigo_hex || '#BA000D',
            codigo_tono: v.codigo_tono || '',
            stock: v.stock ?? 5,
          }))
        );
      } else {
        setVariantes([]);
      }
    } else {
      // 2. Modo nuevo producto: limpiar campos
      setNombre('');
      setCodigoRef('');
      setMarcaId(marcas.length > 0 ? marcas[0].id : '');
      setCategoriaId(categorias.length > 0 ? categorias[0].id : '');
      setPrecioRegular('0');
      setPrecioOferta('');
      setStock('15');
      setDescripcion('');
      setImagenPrincipal('');
      setEsDestacado(false);
      setEsNuevo(true);
      setActivo(true);
      setVariantes([]);
    }

    setErrorMsg('');
  }, [abierto, productoEditar, marcas, categorias]);

  if (!abierto) return null;

  const agregarVariante = () => {
    setVariantes((prev) => [
      ...prev,
      { nombre: 'Nuevo Tono', codigo_hex: '#BA000D', stock: 10, codigo_tono: `TONO-${prev.length + 1}` },
    ]);
  };

  const quitarVariante = (index: number) => {
    setVariantes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuardando(true);
    setErrorMsg('');

    try {
      const slugGenerado = nombre
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const payload = {
        nombre: nombre.trim(),
        codigo_referencia: codigoRef.trim() || null,
        slug: productoEditar?.slug ?? `${slugGenerado}-${Math.floor(1000 + Math.random() * 9000)}`,
        marca_id: marcaId || null,
        categoria_id: categoriaId || null,
        precio_regular: parseFloat(precioRegular) || 0,
        precio_oferta: precioOferta ? parseFloat(precioOferta) : null,
        stock: parseInt(stock) || 0,
        descripcion: descripcion.trim() || null,
        imagen_principal: imagenPrincipal.trim() || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
        es_destacado: esDestacado,
        es_nuevo: esNuevo,
        activo,
        updated_at: new Date().toISOString(),
      };

      const esEdicion = Boolean(productoEditar);
      let guardadoExitoso = false;

      // 1. Intentar guardar a través de la API interna (evita 401 RLS)
      try {
        const apiRes = await fetch('/api/productos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: esEdicion ? 'update' : 'create',
            productoId: productoEditar?.id,
            payload,
            variantes,
          }),
        });

        if (apiRes.ok) {
          guardadoExitoso = true;
        } else {
          const errData = await apiRes.json();
          console.warn('API /api/productos retornó error:', errData.error);
        }
      } catch (apiErr) {
        console.warn('Fallo conectando a /api/productos, probando cliente directo:', apiErr);
      }

      // 2. Si la API no respondió o falló, fallback directo con Supabase
      if (!guardadoExitoso && supabase) {
        if (esEdicion && productoEditar) {
          const { error: updErr } = await supabase
            .from('productos')
            .update(payload)
            .eq('id', productoEditar.id);

          if (updErr) throw updErr;

          if (variantes.length > 0) {
            await supabase.from('producto_variantes').delete().eq('producto_id', productoEditar.id);
            const varPayload = variantes.map((v, idx) => ({
              producto_id: productoEditar.id,
              nombre: v.nombre,
              codigo_tono: v.codigo_tono || `TONO-${idx + 1}`,
              codigo_hex: v.codigo_hex,
              stock: v.stock,
              activo: true,
            }));
            await supabase.from('producto_variantes').insert(varPayload);
          }
        } else {
          const { data, error: insErr } = await supabase
            .from('productos')
            .insert(payload)
            .select('id')
            .single();

          if (insErr) throw insErr;

          if (data && variantes.length > 0) {
            const varPayload = variantes.map((v, idx) => ({
              producto_id: data.id,
              nombre: v.nombre,
              codigo_tono: v.codigo_tono || `TONO-${idx + 1}`,
              codigo_hex: v.codigo_hex,
              stock: v.stock,
              activo: true,
            }));
            await supabase.from('producto_variantes').insert(varPayload);
          }
        }
        guardadoExitoso = true;
      }

      if (!guardadoExitoso) {
        throw new Error('No se pudo guardar el producto. Revisa la conexión.');
      }

      onGuardado();
      onCerrar();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar producto';
      setErrorMsg(msg);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-5 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {productoEditar ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <p className="text-xs text-slate-500">
              {productoEditar ? `Modificando: ${productoEditar.nombre}` : 'Completa los datos para registrar un nuevo producto en LuKa.'}
            </p>
          </div>
          <button
            onClick={onCerrar}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-slate-800 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Nombre del Producto *</label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Labial Mate Studio Look"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-600 bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Código de Referencia / Catálogo</label>
              <input
                type="text"
                value={codigoRef}
                onChange={(e) => setCodigoRef(e.target.value)}
                placeholder="Ej: CYZ-LAB-01"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-600 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Marca *</label>
              <select
                value={marcaId}
                onChange={(e) => setMarcaId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-600 bg-white"
              >
                {marcas.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Categoría</label>
              <select
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-600 bg-white"
              >
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Precio Regular (S/) *</label>
              <input
                type="number"
                step="0.10"
                required
                value={precioRegular}
                onChange={(e) => setPrecioRegular(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-600 bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-rose-600">Precio Oferta (S/)</label>
              <input
                type="number"
                step="0.10"
                value={precioOferta}
                onChange={(e) => setPrecioOferta(e.target.value)}
                placeholder="Opcional"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-rose-500 bg-rose-50/30"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Stock Total *</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-600 bg-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">URL de Imagen Principal *</label>
            <div className="flex gap-2">
              <input
                type="url"
                required
                value={imagenPrincipal}
                onChange={(e) => setImagenPrincipal(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-600 bg-white"
              />
              {imagenPrincipal && (
                <div className="w-9 h-9 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-slate-100">
                  <img src={imagenPrincipal} alt="Previa" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Descripción del Producto</label>
            <textarea
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Detalle o características del producto..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-600 bg-white"
            />
          </div>

          {/* Variantes de Tono */}
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Variantes / Tonos de Maquillaje</h4>
                <p className="text-[11px] text-slate-500">Agrega tonos con su color visual (código hex) o stock específico.</p>
              </div>
              <button
                type="button"
                onClick={agregarVariante}
                className="flex items-center gap-1 text-[11px] font-semibold bg-white border border-slate-200 text-blue-600 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Plus className="w-3 h-3" /> Agregar Tono
              </button>
            </div>

            {variantes.map((v, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                <input
                  type="color"
                  value={v.codigo_hex}
                  onChange={(e) => {
                    const copia = [...variantes];
                    copia[idx].codigo_hex = e.target.value;
                    setVariantes(copia);
                  }}
                  className="w-7 h-7 rounded-lg border-0 cursor-pointer p-0 shrink-0"
                />
                <input
                  type="text"
                  placeholder="Nombre Tono (ej: Rojo Pasión)"
                  value={v.nombre}
                  onChange={(e) => {
                    const copia = [...variantes];
                    copia[idx].nombre = e.target.value;
                    setVariantes(copia);
                  }}
                  className="flex-1 px-2 py-1 border border-slate-200 rounded-lg text-xs"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={v.stock}
                  onChange={(e) => {
                    const copia = [...variantes];
                    copia[idx].stock = parseInt(e.target.value) || 0;
                    setVariantes(copia);
                  }}
                  className="w-16 px-2 py-1 border border-slate-200 rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={() => quitarVariante(idx)}
                  className="text-slate-400 hover:text-red-500 p-1"
                  aria-label="Eliminar tono"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Opciones booleanas */}
          <div className="flex gap-4 pt-1 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={esDestacado}
                onChange={(e) => setEsDestacado(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="font-semibold text-slate-700">Producto Destacado</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={esNuevo}
                onChange={(e) => setEsNuevo(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="font-semibold text-slate-700">Nuevo Lanzamiento</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="font-semibold text-slate-700">Visible en Catálogo</span>
            </label>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCerrar}
              className="px-4 py-2 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{guardando ? 'Guardando...' : 'Guardar Producto'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
