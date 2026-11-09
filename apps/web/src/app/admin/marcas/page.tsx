'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Marca } from '@/types/catalogo';
import { Layers, Plus, Edit3, Eye, EyeOff, Trash2, X, Save } from 'lucide-react';

function MarcaFormModal({
  abierto,
  onCerrar,
  onGuardado,
  marcaEditar,
}: {
  abierto: boolean;
  onCerrar: () => void;
  onGuardado: () => void;
  marcaEditar?: Marca | null;
}) {
  const [nombre, setNombre] = useState(marcaEditar?.nombre ?? '');
  const [logoUrl, setLogoUrl] = useState(marcaEditar?.logo_url ?? '');
  const [categoria, setCategoria] = useState<'COSMETICOS' | 'ELECTRO'>(
    marcaEditar?.categoria_principal ?? 'COSMETICOS'
  );
  const [guardando, setGuardando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!abierto) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setGuardando(true);
    setErrorMsg('');

    try {
      const slug = nombre
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const payload = {
        nombre,
        slug: marcaEditar?.slug ?? slug,
        logo_url: logoUrl || null,
        categoria_principal: categoria,
      };

      if (marcaEditar) {
        const { error } = await supabase.from('marcas').update(payload).eq('id', marcaEditar.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('marcas').insert({ ...payload, activo: true });
        if (error) throw error;
      }

      onGuardado();
      onCerrar();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-100">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="font-bold text-slate-900">{marcaEditar ? 'Editar Marca' : 'Nueva Marca'}</h2>
            <p className="text-xs text-slate-500">Agrega la marca al catálogo para vincular productos.</p>
          </div>
          <button onClick={onCerrar} className="p-2 rounded-full hover:bg-slate-200 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs text-slate-800">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl">{errorMsg}</div>
          )}

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Nombre de Marca *</label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Cyzone, Unique, Oster..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-600"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Categoría Principal *</label>
            <div className="grid grid-cols-2 gap-3">
              {(['COSMETICOS', 'ELECTRO'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoria(cat)}
                  className={`py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                    categoria === cat
                      ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-400'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat === 'COSMETICOS' ? '💄 Cosméticos' : '🔌 Electro Hogar'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">URL de Logo (opcional)</label>
            <div className="flex gap-2 items-center">
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-600"
              />
              {logoUrl && (
                <div className="w-9 h-9 rounded-xl border border-slate-200 overflow-hidden shrink-0 bg-white p-0.5">
                  <img src={logoUrl} alt="logo" className="w-full h-full object-contain" />
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onCerrar} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-xl shadow-md disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {guardando ? 'Guardando...' : 'Guardar Marca'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MarcasPage() {
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<Marca | null>(null);

  const cargar = async () => {
    if (!supabase) return;
    setCargando(true);
    const { data } = await supabase.from('marcas').select('*').order('nombre');
    if (data) setMarcas(data as Marca[]);
    setCargando(false);
  };

  useEffect(() => { cargar(); }, []);

  const toggleActivo = async (marca: Marca) => {
    if (!supabase) return;
    const nuevo = !marca.activo;
    setMarcas((prev) => prev.map((m) => m.id === marca.id ? { ...m, activo: nuevo } : m));
    await supabase.from('marcas').update({ activo: nuevo }).eq('id', marca.id);
  };

  const eliminar = async (id: string) => {
    if (!confirm('¿Eliminar esta marca? Los productos vinculados perderán su marca.')) return;
    if (!supabase) return;
    setMarcas((prev) => prev.filter((m) => m.id !== id));
    await supabase.from('marcas').delete().eq('id', id);
  };

  const cosmeticos = marcas.filter((m) => m.categoria_principal === 'COSMETICOS');
  const electro = marcas.filter((m) => m.categoria_principal === 'ELECTRO');

  return (
    <div className="p-3 sm:p-6 md:p-8 space-y-4 sm:space-y-6 text-slate-800 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-lg sm:text-xl text-slate-900">Marcas del Catálogo</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Gestiona las marcas disponibles: Cyzone, Unique, Ésika, Natura y electrodomésticos.
          </p>
        </div>
        <button
          onClick={() => { setMarcaSeleccionada(null); setModalAbierto(true); }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Nueva Marca
        </button>
      </div>

      {/* Contadores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-200 flex items-center justify-center text-pink-700 shrink-0 font-bold text-xs">
            COS
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Marcas de Cosméticos</span>
            <p className="text-xl font-extrabold text-slate-900">{cosmeticos.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 font-bold text-xs">
            ELEC
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium">Marcas de Electro Hogar</span>
            <p className="text-xl font-extrabold text-slate-900">{electro.length}</p>
          </div>
        </div>
      </div>

      {/* Tabla de Marcas */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100">
          <h2 className="font-bold text-slate-900 text-sm sm:text-base">Todas las Marcas</h2>
        </div>

        {cargando ? (
          <div className="p-10 text-center text-slate-400 text-sm">Cargando marcas de Supabase...</div>
        ) : marcas.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <Layers className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No hay marcas registradas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 min-w-[500px]">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-5">Marca</th>
                <th className="py-3 px-5">Categoría</th>
                <th className="py-3 px-5">Slug</th>
                <th className="py-3 px-5">Estado</th>
                <th className="py-3 px-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {marcas.map((marca) => (
                <tr key={marca.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      {marca.logo_url ? (
                        <div className="w-9 h-9 rounded-xl border border-slate-200 overflow-hidden bg-white p-0.5 shrink-0">
                          <img src={marca.logo_url} alt={marca.nombre} className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center shrink-0 text-slate-300">
                          <Layers className="w-4 h-4" />
                        </div>
                      )}
                      <span className="font-bold text-slate-900">{marca.nombre}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-semibold ${
                      marca.categoria_principal === 'COSMETICOS'
                        ? 'bg-pink-50 text-pink-700 border-pink-200'
                        : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                    }`}>
                      {marca.categoria_principal === 'COSMETICOS' ? '💄 Cosméticos' : '🔌 Electro Hogar'}
                    </span>
                  </td>
                  <td className="py-3 px-5">
                    <code className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                      {marca.slug}
                    </code>
                  </td>
                  <td className="py-3 px-5">
                    <button
                      onClick={() => toggleActivo(marca)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border transition-all ${
                        marca.activo
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {marca.activo ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {marca.activo ? 'Activa' : 'Oculta'}
                    </button>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setMarcaSeleccionada(marca); setModalAbierto(true); }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => eliminar(marca.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>

      <MarcaFormModal
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        onGuardado={cargar}
        marcaEditar={marcaSeleccionada}
      />
    </div>
  );
}
