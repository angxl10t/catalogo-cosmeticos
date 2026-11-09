'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Promocion, Producto, Marca, Categoria, TipoPromocion } from '@/types/catalogo';
import { PromocionFormModal } from '@/components/admin/PromocionFormModal';
import {
  Tag,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Percent,
  Gift,
  ArrowUpDown,
  Layers,
  Package,
  CheckCircle2,
  PauseCircle,
} from 'lucide-react';

const TIPO_LABELS: Record<TipoPromocion, { label: string; color: string; icon: React.ElementType }> = {
  PORCENTAJE: { label: '% Descuento', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Percent },
  MONTO_FIJO: { label: 'Monto Fijo', color: 'bg-violet-50 text-violet-700 border-violet-200', icon: ArrowUpDown },
  DOS_POR_UNO: { label: '2×1 Oferta', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: Gift },
  COMBO: { label: 'Combo Especial', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Layers },
};

export default function PromocionesPage() {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState(true);

  // Modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [promoSeleccionada, setPromoSeleccionada] = useState<Promocion | null>(null);

  const cargarPromociones = async () => {
    try {
      const res = await fetch('/api/promociones');
      if (res.ok) {
        const data = await res.json();
        setPromociones(data || []);
      } else if (supabase) {
        const { data } = await supabase
          .from('promociones')
          .select('*, productos:promocion_productos(producto:productos(*))')
          .order('created_at', { ascending: false });
        if (data) setPromociones(data as unknown as Promocion[]);
      }
    } catch (err) {
      console.error('Error cargando promociones:', err);
    }
  };

  const cargarCatalogData = async () => {
    try {
      const [prodsRes, marcasRes, catsRes] = await Promise.all([
        fetch('/api/productos').then((r) => (r.ok ? r.json() : [])),
        supabase ? supabase.from('marcas').select('*').order('nombre') : Promise.resolve({ data: [] }),
        supabase ? supabase.from('categorias').select('*').order('nombre') : Promise.resolve({ data: [] }),
      ]);

      if (Array.isArray(prodsRes) && prodsRes.length > 0) {
        setProductos(prodsRes as Producto[]);
      }
      if (marcasRes && marcasRes.data) {
        setMarcas(marcasRes.data as Marca[]);
      }
      if (catsRes && catsRes.data) {
        setCategorias(catsRes.data as Categoria[]);
      }
    } catch (err) {
      console.error('Error cargando catálogo para promociones:', err);
    }
  };

  const cargarTodo = async () => {
    setCargando(true);
    await Promise.all([cargarPromociones(), cargarCatalogData()]);
    setCargando(false);
  };

  useEffect(() => {
    cargarTodo();
  }, []);

  const toggleActiva = async (promo: Promocion) => {
    const nuevoEstado = !promo.activa;
    setPromociones((prev) =>
      prev.map((p) => (p.id === promo.id ? { ...p, activa: nuevoEstado } : p))
    );

    try {
      await fetch('/api/promociones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_activa',
          promocionId: promo.id,
          activa: nuevoEstado,
        }),
      });
    } catch (err) {
      console.error('Error conmutando estado de promoción:', err);
      cargarPromociones();
    }
  };

  const eliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta promoción?')) return;

    setPromociones((prev) => prev.filter((p) => p.id !== id));

    try {
      await fetch('/api/promociones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete',
          promocionId: id,
        }),
      });
    } catch (err) {
      console.error('Error eliminando promoción:', err);
      cargarPromociones();
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-widest uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
              LuKa Campañas
            </span>
            <span className="text-xs text-slate-400 font-medium">Gestión de Ofertas</span>
          </div>
          <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight mt-1">
            Promociones & Campañas
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configura descuentos en porcentaje, montos fijos, promociones 2×1 y combos con productos, marcas o categorías específicas.
          </p>
        </div>
        <button
          onClick={() => {
            setPromoSeleccionada(null);
            setModalAbierto(true);
          }}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          Nueva Promoción
        </button>
      </div>

      {/* Contadores por tipo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {(Object.entries(TIPO_LABELS) as [TipoPromocion, typeof TIPO_LABELS[TipoPromocion]][]).map(
          ([tipo, { label, color, icon: Icon }]) => (
            <div
              key={tipo}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 flex items-center gap-3 shadow-xs"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${color} shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs text-slate-400 font-medium block truncate">{label}</span>
                <span className="text-xl font-black text-slate-900">
                  {promociones.filter((p) => p.tipo === tipo).length}
                </span>
              </div>
            </div>
          )
        )}
      </div>

      {/* Grid de Promociones */}
      {cargando ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-56 animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : promociones.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Tag className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No hay promociones registradas</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Crea tu primera promoción de descuento, 2×1 o combo para destacarla en el catálogo comercial de LuKa.
          </p>
          <button
            onClick={() => {
              setPromoSeleccionada(null);
              setModalAbierto(true);
            }}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Crear primera promoción
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {promociones.map((promo) => {
            const { label, color, icon: Icon } = TIPO_LABELS[promo.tipo] || TIPO_LABELS.PORCENTAJE;
            const ahora = new Date();
            const vencida = Boolean(promo.fecha_fin && new Date(promo.fecha_fin) < ahora);
            const productosVinculados = (promo.productos || [])
              .map((p) => (p as { producto?: Producto }).producto)
              .filter(Boolean) as Producto[];

            return (
              <div
                key={promo.id}
                className={`bg-white rounded-2xl border p-5 flex flex-col justify-between gap-4 shadow-xs transition-all ${
                  promo.activa ? 'border-slate-200' : 'border-slate-200/60 opacity-65 bg-slate-50/50'
                }`}
              >
                <div className="space-y-3">
                  {/* Banner si existe */}
                  {promo.banner_url && (
                    <div className="rounded-xl overflow-hidden h-28 bg-slate-100 border border-slate-100">
                      <img
                        src={promo.banner_url}
                        alt={promo.titulo}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Header: Tipo badge y Toggle Activa */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider border px-2.5 py-1 rounded-full ${color}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                      {promo.tipo === 'PORCENTAJE' && ` ${promo.valor_descuento}% OFF`}
                      {promo.tipo === 'MONTO_FIJO' && ` S/ ${promo.valor_descuento.toFixed(2)} OFF`}
                    </span>

                    <button
                      onClick={() => toggleActiva(promo)}
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                        promo.activa
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {promo.activa ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Activa</span>
                        </>
                      ) : (
                        <>
                          <PauseCircle className="w-3 h-3 text-slate-400" />
                          <span>Pausada</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Título de la promoción */}
                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                    {promo.titulo}
                  </h3>

                  {/* Productos participantes o alcance */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-slate-400" />
                        {promo.tipo === 'DOS_POR_UNO'
                          ? 'Productos en 2×1:'
                          : promo.tipo === 'COMBO'
                          ? 'Productos del Combo:'
                          : 'Productos en promoción:'}
                      </span>
                      <span className="font-bold text-slate-800">
                        {productosVinculados.length > 0
                          ? `${productosVinculados.length} ${productosVinculados.length === 1 ? 'producto' : 'productos'}`
                          : 'Toda la tienda'}
                      </span>
                    </div>

                    {/* Mini avatares de productos participantes */}
                    {productosVinculados.length > 0 ? (
                      <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
                        {productosVinculados.slice(0, 4).map((p) => (
                          <div
                            key={p.id}
                            title={`${p.nombre} (${p.marca?.nombre || ''})`}
                            className="w-8 h-8 rounded-lg overflow-hidden bg-white border border-slate-200 shrink-0"
                          >
                            {p.imagen_principal ? (
                              <img src={p.imagen_principal} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-400">
                                S/I
                              </div>
                            )}
                          </div>
                        ))}
                        {productosVinculados.length > 4 && (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-200/80 px-1.5 py-0.5 rounded-md shrink-0">
                            +{productosVinculados.length - 4} más
                          </span>
                        )}
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 leading-tight">
                        Aplica como promoción general a todos los productos del catálogo.
                      </p>
                    )}
                  </div>

                  {/* Vigencia */}
                  {(promo.fecha_inicio || promo.fecha_fin) && (
                    <div
                      className={`flex items-center gap-1.5 text-[11px] font-medium ${
                        vencida ? 'text-rose-600' : 'text-slate-400'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {promo.fecha_inicio ? new Date(promo.fecha_inicio).toLocaleDateString('es-PE') : '—'}
                        {' → '}
                        {promo.fecha_fin ? new Date(promo.fecha_fin).toLocaleDateString('es-PE') : 'Sin límite'}
                        {vencida && <span className="ml-1 text-rose-600 font-bold">(Vencida)</span>}
                      </span>
                    </div>
                  )}
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100 mt-2">
                  <button
                    onClick={() => {
                      setPromoSeleccionada(promo);
                      setModalAbierto(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-all text-slate-700"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Editar
                  </button>
                  <button
                    onClick={() => eliminar(promo.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all"
                    title="Eliminar promoción"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Creación / Edición */}
      {modalAbierto && (
        <PromocionFormModal
          key={promoSeleccionada ? promoSeleccionada.id : 'nueva'}
          abierto={modalAbierto}
          onCerrar={() => {
            setModalAbierto(false);
            setPromoSeleccionada(null);
          }}
          onGuardado={cargarTodo}
          promocionEditar={promoSeleccionada}
          productos={productos}
          marcas={marcas}
          categorias={categorias}
        />
      )}
    </div>
  );
}
