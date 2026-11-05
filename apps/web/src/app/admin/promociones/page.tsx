'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Tag, Plus, Trash2, Edit3, Calendar, Percent, Gift, ArrowUpDown, X, Save } from 'lucide-react';

type TipoPromocion = 'PORCENTAJE' | 'MONTO_FIJO' | 'DOS_POR_UNO' | 'COMBO';

interface Promocion {
  id: string;
  titulo: string;
  tipo: TipoPromocion;
  valor_descuento: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  banner_url?: string;
  activa: boolean;
}

const TIPO_LABELS: Record<TipoPromocion, { label: string; color: string; icon: React.ElementType }> = {
  PORCENTAJE: { label: '% Descuento', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Percent },
  MONTO_FIJO: { label: 'Monto Fijo', color: 'bg-violet-50 text-violet-700 border-violet-200', icon: ArrowUpDown },
  DOS_POR_UNO: { label: '2×1 Oferta', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: Gift },
  COMBO: { label: 'Combo', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Gift },
};

function PromocionFormModal({
  abierto,
  onCerrar,
  onGuardado,
  promocionEditar,
}: {
  abierto: boolean;
  onCerrar: () => void;
  onGuardado: () => void;
  promocionEditar?: Promocion | null;
}) {
  const [titulo, setTitulo] = useState(promocionEditar?.titulo ?? '');
  const [tipo, setTipo] = useState<TipoPromocion>(promocionEditar?.tipo ?? 'PORCENTAJE');
  const [valor, setValor] = useState(promocionEditar?.valor_descuento?.toString() ?? '10');
  const [fechaInicio, setFechaInicio] = useState(promocionEditar?.fecha_inicio?.slice(0, 10) ?? '');
  const [fechaFin, setFechaFin] = useState(promocionEditar?.fecha_fin?.slice(0, 10) ?? '');
  const [bannerUrl, setBannerUrl] = useState(promocionEditar?.banner_url ?? '');
  const [activa, setActiva] = useState(promocionEditar?.activa ?? true);
  const [guardando, setGuardando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!abierto) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setGuardando(true);
    setErrorMsg('');

    try {
      const payload = {
        titulo,
        tipo,
        valor_descuento: parseFloat(valor) || 0,
        fecha_inicio: fechaInicio ? `${fechaInicio}T00:00:00+00:00` : null,
        fecha_fin: fechaFin ? `${fechaFin}T23:59:59+00:00` : null,
        banner_url: bannerUrl || null,
        activa,
      };

      if (promocionEditar) {
        const { error } = await supabase.from('promociones').update(payload).eq('id', promocionEditar.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('promociones').insert(payload);
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
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-slate-100">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="font-bold text-slate-900">
              {promocionEditar ? 'Editar Promoción' : 'Nueva Promoción'}
            </h2>
            <p className="text-xs text-slate-500">Configura los términos y la vigencia.</p>
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
            <label className="font-semibold text-slate-700">Título de la Promoción *</label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder='Ej: "2×1 en Fragancias Cyzone — Campaña C06"'
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-600"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Tipo de Promoción *</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(TIPO_LABELS) as [TipoPromocion, typeof TIPO_LABELS[TipoPromocion]][]).map(
                ([key, { label, color, icon: Icon }]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTipo(key)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      tipo === key
                        ? 'ring-2 ring-blue-600 border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                )
              )}
            </div>
          </div>

          {tipo !== 'DOS_POR_UNO' && tipo !== 'COMBO' && (
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">
                {tipo === 'PORCENTAJE' ? 'Porcentaje de Descuento (%)' : 'Monto Fijo a Descontar (S/)'}
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-600"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Inicio de Vigencia</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-600"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Fin de Vigencia</label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">URL de Banner (opcional)</label>
            <input
              type="url"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:border-blue-600"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={activa}
              onChange={(e) => setActiva(e.target.checked)}
              className="rounded text-blue-600"
            />
            <span className="font-semibold text-slate-700">Promoción activa (visible en catálogo)</span>
          </label>

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
              {guardando ? 'Guardando...' : 'Guardar Promoción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PromocionesPage() {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [promoSeleccionada, setPromoSeleccionada] = useState<Promocion | null>(null);

  const cargar = async () => {
    if (!supabase) return;
    setCargando(true);
    const { data } = await supabase.from('promociones').select('*').order('created_at', { ascending: false });
    if (data) setPromociones(data as Promocion[]);
    setCargando(false);
  };

  useEffect(() => { cargar(); }, []);

  const toggleActiva = async (promo: Promocion) => {
    if (!supabase) return;
    const nuevo = !promo.activa;
    setPromociones((prev) => prev.map((p) => p.id === promo.id ? { ...p, activa: nuevo } : p));
    await supabase.from('promociones').update({ activa: nuevo }).eq('id', promo.id);
  };

  const eliminar = async (id: string) => {
    if (!confirm('¿Eliminar esta promoción?')) return;
    if (!supabase) return;
    setPromociones((prev) => prev.filter((p) => p.id !== id));
    await supabase.from('promociones').delete().eq('id', id);
  };

  return (
    <div className="p-6 space-y-6 text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl text-slate-900">Promociones & Campañas</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Crea descuentos por porcentaje, montos fijos, 2×1 o combos. Se activan en el catálogo al instante.
          </p>
        </div>
        <button
          onClick={() => { setPromoSeleccionada(null); setModalAbierto(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          Nueva Promoción
        </button>
      </div>

      {/* Contadores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(Object.entries(TIPO_LABELS) as [TipoPromocion, typeof TIPO_LABELS[TipoPromocion]][]).map(([tipo, { label, color, icon: Icon }]) => (
          <div key={tipo} className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3 shadow-xs">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">{label}</span>
              <span className="text-lg font-extrabold text-slate-900">
                {promociones.filter((p) => p.tipo === tipo).length}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Grid de Promociones */}
      {cargando ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-48 animate-pulse border border-slate-100" />
          ))}
        </div>
      ) : promociones.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center space-y-2">
          <Tag className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700">No hay promociones registradas</h3>
          <p className="text-xs text-slate-400">Crea tu primera promoción para aplicarla al catálogo.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {promociones.map((promo) => {
            const { label, color, icon: Icon } = TIPO_LABELS[promo.tipo];
            const ahora = new Date();
            const vencida = promo.fecha_fin && new Date(promo.fecha_fin) < ahora;

            return (
              <div
                key={promo.id}
                className={`bg-white rounded-2xl border p-5 flex flex-col gap-3 shadow-xs transition-all ${
                  promo.activa ? 'border-slate-200/80' : 'border-slate-100 opacity-60'
                }`}
              >
                {/* Banner si existe */}
                {promo.banner_url && (
                  <div className="rounded-xl overflow-hidden h-28 bg-slate-100 border border-slate-100">
                    <img src={promo.banner_url} alt={promo.titulo} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Tipo badge */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide border px-2.5 py-1 rounded-full ${color}`}>
                    <Icon className="w-3 h-3" />
                    {label}
                    {promo.tipo === 'PORCENTAJE' && ` — ${promo.valor_descuento}%`}
                    {promo.tipo === 'MONTO_FIJO' && ` — S/ ${promo.valor_descuento.toFixed(2)}`}
                  </span>
                  <button
                    onClick={() => toggleActiva(promo)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                      promo.activa
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {promo.activa ? 'Activa' : 'Pausada'}
                  </button>
                </div>

                {/* Título */}
                <h3 className="font-bold text-slate-900 text-sm leading-snug">{promo.titulo}</h3>

                {/* Vigencia */}
                {(promo.fecha_inicio || promo.fecha_fin) && (
                  <div className={`flex items-center gap-1.5 text-[11px] font-medium ${vencida ? 'text-rose-500' : 'text-slate-400'}`}>
                    <Calendar className="w-3 h-3" />
                    <span>
                      {promo.fecha_inicio ? new Date(promo.fecha_inicio).toLocaleDateString('es-PE') : '—'}
                      {' → '}
                      {promo.fecha_fin ? new Date(promo.fecha_fin).toLocaleDateString('es-PE') : 'Sin fecha límite'}
                      {vencida && <span className="ml-1 text-rose-500 font-bold">(Vencida)</span>}
                    </span>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 mt-auto">
                  <button
                    onClick={() => { setPromoSeleccionada(promo); setModalAbierto(true); }}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-200 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Editar
                  </button>
                  <button
                    onClick={() => eliminar(promo.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <PromocionFormModal
        abierto={modalAbierto}
        onCerrar={() => setModalAbierto(false)}
        onGuardado={cargar}
        promocionEditar={promoSeleccionada}
      />
    </div>
  );
}
