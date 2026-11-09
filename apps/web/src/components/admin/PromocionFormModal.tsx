'use client';

import { useState, useEffect, useMemo } from 'react';
import { Producto, Marca, Categoria, Promocion, TipoPromocion } from '@/types/catalogo';
import { 
  X, 
  Save, 
  Search, 
  Check, 
  Percent, 
  ArrowUpDown, 
  Gift, 
  Layers, 
  Filter, 
  Calendar, 
  Tag, 
  AlertCircle,
  Plus
} from 'lucide-react';

interface PromocionFormModalProps {
  abierto: boolean;
  onCerrar: () => void;
  onGuardado: () => void;
  promocionEditar?: Promocion | null;
  productos: Producto[];
  marcas: Marca[];
  categorias: Categoria[];
}

type AlcanceTipo = 'PRODUCTO' | 'CATEGORIA' | 'MARCA' | 'TODO';

const TIPO_CONFIG: Record<TipoPromocion, { label: string; desc: string; icon: React.ElementType; color: string }> = {
  PORCENTAJE: {
    label: '% Descuento',
    desc: 'Descuento porcentual aplicable a productos, marcas o categorías',
    icon: Percent,
    color: 'border-blue-600 bg-blue-50 text-blue-700',
  },
  MONTO_FIJO: {
    label: 'Monto Fijo',
    desc: 'Descuento en soles (S/) directo en el valor del producto',
    icon: ArrowUpDown,
    color: 'border-violet-600 bg-violet-50 text-violet-700',
  },
  DOS_POR_UNO: {
    label: '2×1 Oferta',
    desc: 'Promoción 2 por 1 sobre los productos seleccionados',
    icon: Gift,
    color: 'border-rose-600 bg-rose-50 text-rose-700',
  },
  COMBO: {
    label: 'Combo Especial',
    desc: 'Paquete o combo armado con múltiples productos',
    icon: Layers,
    color: 'border-amber-600 bg-amber-50 text-amber-700',
  },
};

export function PromocionFormModal({
  abierto,
  onCerrar,
  onGuardado,
  promocionEditar,
  productos,
  marcas,
  categorias,
}: PromocionFormModalProps) {
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState<TipoPromocion>('PORCENTAJE');
  const [valor, setValor] = useState('15');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [activa, setActiva] = useState(true);

  // Alcance para % y Monto Fijo
  const [alcance, setAlcance] = useState<AlcanceTipo>('PRODUCTO');
  const [marcaSeleccionadaId, setMarcaSeleccionadaId] = useState('');
  const [categoriaSeleccionadaId, setCategoriaSeleccionadaId] = useState('');

  // IDs de productos seleccionados (para alcance PRODUCTO, 2x1 y COMBO)
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  // Filtros del buscador interno de productos
  const [busquedaProducto, setBusquedaProducto] = useState('');
  const [filtroMarca, setFiltroMarca] = useState('TODAS');
  const [filtroCategoria, setFiltroCategoria] = useState('TODAS');

  const [guardando, setGuardando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Carga o reinicio de estado al abrir el modal o cambiar la promoción
  useEffect(() => {
    if (!abierto) return;

    if (promocionEditar) {
      setTitulo(promocionEditar.titulo || '');
      setTipo(promocionEditar.tipo || 'PORCENTAJE');
      setValor(promocionEditar.valor_descuento !== undefined ? String(promocionEditar.valor_descuento) : '0');
      setFechaInicio(promocionEditar.fecha_inicio ? promocionEditar.fecha_inicio.slice(0, 10) : '');
      setFechaFin(promocionEditar.fecha_fin ? promocionEditar.fecha_fin.slice(0, 10) : '');
      setBannerUrl(promocionEditar.banner_url || '');
      setActiva(promocionEditar.activa ?? true);

      // Cargar productos asociados existentes
      const linkedIds = (promocionEditar.productos || [])
        .map((p) => (p as { producto?: { id: string }; producto_id?: string }).producto?.id || (p as { producto_id?: string }).producto_id)
        .filter(Boolean) as string[];

      setSelectedProductIds(linkedIds);

      if (promocionEditar.tipo === 'DOS_POR_UNO' || promocionEditar.tipo === 'COMBO') {
        setAlcance('PRODUCTO');
      } else {
        setAlcance(linkedIds.length > 0 ? 'PRODUCTO' : 'TODO');
      }
    } else {
      // Nueva promoción: valores iniciales limpios
      setTitulo('');
      setTipo('PORCENTAJE');
      setValor('15');
      setFechaInicio(new Date().toISOString().slice(0, 10));
      setFechaFin('');
      setBannerUrl('');
      setActiva(true);
      setAlcance('PRODUCTO');
      setMarcaSeleccionadaId(marcas.length > 0 ? marcas[0].id : '');
      setCategoriaSeleccionadaId(categorias.length > 0 ? categorias[0].id : '');
      setSelectedProductIds([]);
      setBusquedaProducto('');
      setFiltroMarca('TODAS');
      setFiltroCategoria('TODAS');
    }
    setErrorMsg('');
  }, [abierto, promocionEditar, marcas, categorias]);

  // Si cambia a tipo 2x1 o Combo, el alcance siempre es PRODUCTO
  const esComboO2x1 = tipo === 'DOS_POR_UNO' || tipo === 'COMBO';

  // Productos filtrados para el selector
  const productosFiltrados = useMemo(() => {
    const q = busquedaProducto.toLowerCase().trim();
    return productos.filter((p) => {
      // Filtro de búsqueda
      if (q) {
        const coincideNombre = p.nombre.toLowerCase().includes(q);
        const coincideRef = p.codigo_referencia?.toLowerCase().includes(q);
        const coincideMarca = p.marca?.nombre.toLowerCase().includes(q);
        if (!coincideNombre && !coincideRef && !coincideMarca) return false;
      }
      // Filtro de marca
      if (filtroMarca !== 'TODAS') {
        const prodMarcaId = p.marca_id || p.marca?.id;
        if (prodMarcaId !== filtroMarca) return false;
      }
      // Filtro de categoría
      if (filtroCategoria !== 'TODAS') {
        const prodCatId = p.categoria_id || p.categoria?.id;
        if (prodCatId !== filtroCategoria) return false;
      }
      return true;
    });
  }, [productos, busquedaProducto, filtroMarca, filtroCategoria]);

  // Lista de objetos de productos actualmente seleccionados
  const productosSeleccionadosList = useMemo(() => {
    const map = new Map(productos.map((p) => [p.id, p]));
    return selectedProductIds.map((id) => map.get(id)).filter(Boolean) as Producto[];
  }, [productos, selectedProductIds]);

  const toggleProductoSeleccionado = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]
    );
  };

  const seleccionarTodosVisibles = () => {
    const idsVisibles = productosFiltrados.slice(0, 50).map((p) => p.id);
    setSelectedProductIds((prev) => Array.from(new Set([...prev, ...idsVisibles])));
  };

  const limpiarSeleccion = () => {
    setSelectedProductIds([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!titulo.trim()) {
      setErrorMsg('Debes ingresar un título para la promoción');
      return;
    }

    // Validaciones específicas
    if (esComboO2x1 && selectedProductIds.length === 0) {
      setErrorMsg(`Debes seleccionar al menos un producto para la promoción de ${TIPO_CONFIG[tipo].label}`);
      return;
    }

    if (!esComboO2x1 && alcance === 'PRODUCTO' && selectedProductIds.length === 0) {
      setErrorMsg('Seleccionaste aplicar a productos específicos, pero no has elegido ningún producto');
      return;
    }

    if (!esComboO2x1 && alcance === 'MARCA' && !marcaSeleccionadaId) {
      setErrorMsg('Debes seleccionar una marca para la promoción');
      return;
    }

    if (!esComboO2x1 && alcance === 'CATEGORIA' && !categoriaSeleccionadaId) {
      setErrorMsg('Debes seleccionar una categoría para la promoción');
      return;
    }

    setGuardando(true);

    try {
      const payload = {
        titulo: titulo.trim(),
        tipo,
        valor_descuento: esComboO2x1 ? 0 : parseFloat(valor) || 0,
        fecha_inicio: fechaInicio ? `${fechaInicio}T00:00:00+00:00` : null,
        fecha_fin: fechaFin ? `${fechaFin}T23:59:59+00:00` : null,
        banner_url: bannerUrl.trim() || null,
        activa,
      };

      const res = await fetch('/api/promociones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: promocionEditar ? 'update' : 'create',
          promocionId: promocionEditar?.id,
          payload,
          alcance: esComboO2x1 ? 'PRODUCTO' : alcance,
          marcaId: alcance === 'MARCA' ? marcaSeleccionadaId : undefined,
          categoriaId: alcance === 'CATEGORIA' ? categoriaSeleccionadaId : undefined,
          productoIds: (esComboO2x1 || alcance === 'PRODUCTO') ? selectedProductIds : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Error al guardar la promoción');
      }

      onGuardado();
      onCerrar();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar la promoción';
      setErrorMsg(msg);
    } finally {
      setGuardando(false);
    }
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 block">
              LuKa Administración
            </span>
            <h2 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
              {promocionEditar ? 'Editar Promoción' : 'Nueva Promoción Comercial'}
            </h2>
          </div>
          <button
            onClick={onCerrar}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario scrolleable */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 text-xs text-slate-800">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Título */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Título de la Promoción *
            </label>
            <input
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: 2×1 en Fragancias Cyzone o 20% OFF en Maquillaje Yanbal"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:bg-white text-xs font-medium"
            />
          </div>

          {/* 2. Tipo de Promoción */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              Tipo de Promoción *
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {(Object.entries(TIPO_CONFIG) as [TipoPromocion, typeof TIPO_CONFIG[TipoPromocion]][]).map(
                ([key, { label, desc, icon: Icon, color }]) => {
                  const seleccionada = tipo === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTipo(key)}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        seleccionada
                          ? `${color} ring-2 ring-blue-600 shadow-xs font-semibold`
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`p-1.5 rounded-lg border ${seleccionada ? 'bg-white' : 'bg-slate-100 border-slate-200'}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-bold text-xs">{label}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-snug">{desc}</p>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* 3. Valor de Descuento (Sólo si es Porcentaje o Monto Fijo) */}
          {!esComboO2x1 && (
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-1">
              <label className="font-bold text-slate-700 text-xs">
                {tipo === 'PORCENTAJE' ? 'Porcentaje de Descuento (%)' : 'Monto Fijo de Descuento (S/)'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max={tipo === 'PORCENTAJE' ? '100' : '9999'}
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className="w-32 px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-600 font-bold text-sm text-slate-900"
                />
                <span className="text-xs text-slate-500 font-medium">
                  {tipo === 'PORCENTAJE' ? '% de descuento aplicado al producto' : 'soles menos por unidad'}
                </span>
              </div>
            </div>
          )}

          {/* 4. Selector de Alcance (Para % y Monto Fijo) */}
          {!esComboO2x1 && (
            <div className="space-y-2">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                ¿A qué aplica este descuento? *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setAlcance('PRODUCTO')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    alcance === 'PRODUCTO'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Productos específicos
                </button>
                <button
                  type="button"
                  onClick={() => setAlcance('MARCA')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    alcance === 'MARCA'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Marca completa
                </button>
                <button
                  type="button"
                  onClick={() => setAlcance('CATEGORIA')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    alcance === 'CATEGORIA'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Categoría completa
                </button>
                <button
                  type="button"
                  onClick={() => setAlcance('TODO')}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                    alcance === 'TODO'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Toda la tienda
                </button>
              </div>

              {/* Sub-opción Marca */}
              {alcance === 'MARCA' && (
                <div className="p-4 bg-blue-50/50 border border-blue-200/60 rounded-2xl space-y-2">
                  <label className="font-bold text-blue-900 block text-xs">
                    Selecciona la Marca participante:
                  </label>
                  <select
                    value={marcaSeleccionadaId}
                    onChange={(e) => setMarcaSeleccionadaId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-xs font-semibold text-slate-800"
                  >
                    {marcas.map((m) => {
                      const count = productos.filter((p) => (p.marca_id || p.marca?.id) === m.id).length;
                      return (
                        <option key={m.id} value={m.id}>
                          {m.nombre} ({count} productos en catálogo)
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-[11px] text-blue-800">
                    Todos los productos de esta marca tendrán asignada automáticamente esta promoción comercial.
                  </p>
                </div>
              )}

              {/* Sub-opción Categoría */}
              {alcance === 'CATEGORIA' && (
                <div className="p-4 bg-blue-50/50 border border-blue-200/60 rounded-2xl space-y-2">
                  <label className="font-bold text-blue-900 block text-xs">
                    Selecciona la Categoría participante:
                  </label>
                  <select
                    value={categoriaSeleccionadaId}
                    onChange={(e) => setCategoriaSeleccionadaId(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-xs font-semibold text-slate-800"
                  >
                    {categorias.map((c) => {
                      const count = productos.filter((p) => (p.categoria_id || p.categoria?.id) === c.id).length;
                      return (
                        <option key={c.id} value={c.id}>
                          {c.nombre} ({count} productos en catálogo)
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-[11px] text-blue-800">
                    Todos los productos de esta categoría tendrán asignada automáticamente esta promoción comercial.
                  </p>
                </div>
              )}

              {/* Sub-opción Todo */}
              {alcance === 'TODO' && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                  <p className="text-xs text-slate-700 font-medium">
                    Esta promoción general aplicará a todos los productos activos de la tienda LuKa.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 5. Selector de Productos Específicos (Obligatorio en 2x1 y Combo, u opcional si alcance === 'PRODUCTO') */}
          {(esComboO2x1 || alcance === 'PRODUCTO') && (
            <div className="space-y-3 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">
                    {tipo === 'DOS_POR_UNO'
                      ? 'Seleccionar productos para el 2×1'
                      : tipo === 'COMBO'
                      ? 'Seleccionar productos que componen el Combo'
                      : 'Seleccionar productos con descuento'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {tipo === 'DOS_POR_UNO'
                      ? 'Elige los productos entre los cuales el cliente podrá llevar 2 pagando 1.'
                      : tipo === 'COMBO'
                      ? 'Elige los productos que se venden juntos en este paquete promocional.'
                      : 'Elige los productos específicos a los que se aplicará el descuento.'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg">
                    {selectedProductIds.length} seleccionados
                  </span>
                  {selectedProductIds.length > 0 && (
                    <button
                      type="button"
                      onClick={limpiarSeleccion}
                      className="text-[11px] font-semibold text-rose-600 hover:underline"
                    >
                      Limpiar
                    </button>
                  )}
                </div>
              </div>

              {/* Pills de productos ya seleccionados */}
              {productosSeleccionadosList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-2 bg-white rounded-xl border border-slate-200 max-h-28 overflow-y-auto">
                  {productosSeleccionadosList.map((p) => (
                    <span
                      key={p.id}
                      className="inline-flex items-center gap-1.5 pl-1.5 pr-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[10px] font-medium transition-colors"
                    >
                      {p.imagen_principal && (
                        <img
                          src={p.imagen_principal}
                          alt=""
                          className="w-3.5 h-3.5 rounded object-cover"
                        />
                      )}
                      <span className="truncate max-w-[120px]">{p.nombre}</span>
                      <button
                        type="button"
                        onClick={() => toggleProductoSeleccionado(p.id)}
                        className="text-slate-400 hover:text-rose-600 font-bold ml-0.5"
                        title="Quitar"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Buscador y filtros de productos */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2 relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={busquedaProducto}
                    onChange={(e) => setBusquedaProducto(e.target.value)}
                    placeholder="Buscar por nombre o referencia..."
                    className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-xs"
                  />
                </div>
                <select
                  value={filtroMarca}
                  onChange={(e) => setFiltroMarca(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-xs font-medium text-slate-700"
                >
                  <option value="TODAS">Todas las marcas</option>
                  {marcas.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Acciones rápidas de selección */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                <span>Mostrando {Math.min(productosFiltrados.length, 50)} de {productosFiltrados.length} encontrados</span>
                <button
                  type="button"
                  onClick={seleccionarTodosVisibles}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Seleccionar los 50 visibles
                </button>
              </div>

              {/* Lista scrolleable de productos para seleccionar */}
              <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100 bg-white rounded-xl border border-slate-200 p-2">
                {productosFiltrados.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 text-xs">
                    No se encontraron productos con ese filtro.
                  </div>
                ) : (
                  productosFiltrados.slice(0, 50).map((p) => {
                    const estaSeleccionado = selectedProductIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleProductoSeleccionado(p.id)}
                        className={`pt-1.5 first:pt-0 flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                          estaSeleccionado
                            ? 'bg-blue-50 text-blue-950 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                            {p.imagen_principal ? (
                              <img src={p.imagen_principal} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-400">
                                S/I
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs truncate font-bold">{p.nombre}</p>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                              <span>{p.marca?.nombre || 'Marca'}</span>
                              {p.codigo_referencia && (
                                <>
                                  <span>•</span>
                                  <span className="font-mono text-slate-400">Ref: {p.codigo_referencia}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ml-2 transition-all ${
                            estaSeleccionado
                              ? 'bg-blue-600 border-blue-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {estaSeleccionado && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* 6. Vigencia */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 text-xs flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Fecha de Inicio (opcional)
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="font-bold text-slate-700 text-xs flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Fecha de Fin (opcional)
              </label>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-xs"
              />
            </div>
          </div>

          {/* 7. Banner URL */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700 text-xs">
              URL del Banner Promocional (opcional)
            </label>
            <input
              type="url"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-600 text-xs"
            />
          </div>

          {/* 8. Estado Activo */}
          <label className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer">
            <input
              type="checkbox"
              checked={activa}
              onChange={(e) => setActiva(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
            />
            <div>
              <span className="font-bold text-slate-900 block text-xs">
                Promoción activa de inmediato
              </span>
              <span className="text-[11px] text-slate-500 block">
                Al estar activa, se reflejará en el catálogo comercial de LuKa.
              </span>
            </div>
          </label>

          {/* Footer de Acciones */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onCerrar}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {guardando ? 'Guardando...' : promocionEditar ? 'Guardar Cambios' : 'Crear Promoción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
