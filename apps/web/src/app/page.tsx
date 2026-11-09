'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { getProductos, getMarcas, isSupabaseConfigured } from '@/lib/supabase';
import { Producto, Marca, Promocion } from '@/types/catalogo';
import { Navbar } from '@/components/Navbar';
import { ProductoCard } from '@/components/ProductoCard';
import { CarritoDrawer } from '@/components/CarritoDrawer';
import { StickyBottomBar } from '@/components/StickyBottomBar';
import { DetalleProductoModal } from '@/components/DetalleProductoModal';
import { HeroBannerCarousel } from '@/components/HeroBannerCarousel';
import { CarritoProvider, useCarrito } from '@/context/CarritoContext';
import { 
  AlertCircle, 
  ChevronDown, 
  MessageCircle, 
  X, 
  Sparkles, 
  Tag, 
  ArrowUp, 
  ArrowUpDown, 
  Filter, 
  RotateCcw, 
  ShoppingBag, 
  Check 
} from 'lucide-react';
import Image from 'next/image';

const PASO_PAGINACION = 40;
type Ordenamiento = 'destacados' | 'nombre-asc' | 'nombre-desc' | 'marca-asc';

export default function HomePage() {
  return (
    <CarritoProvider>
      <Suspense fallback={<div className="min-h-screen bg-white" />}>
        <CatalogoPrincipal />
      </Suspense>
    </CarritoProvider>
  );
}

function CatalogoPrincipal() {
  const { toast, cerrarToast } = useCarrito();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [promocionActivaFiltro, setPromocionActivaFiltro] = useState<Promocion | null>(null);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<string>('todas');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todas');
  const [busqueda, setBusqueda] = useState<string>('');
  const [orden, setOrden] = useState<Ordenamiento>('destacados');
  const [filtroCurado, setFiltroCurado] = useState<'todos' | 'destacados' | 'nuevos'>('todos');
  const [carritoAbierto, setCarritoAbierto] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(true);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [limiteVisible, setLimiteVisible] = useState<number>(PASO_PAGINACION);
  const [mostrarScrollTop, setMostrarScrollTop] = useState(false);

  useEffect(() => {
    async function cargarDatos() {
      setCargando(true);
      const [prodsData, marcasData, promosData] = await Promise.all([
        getProductos(),
        getMarcas(),
        fetch('/api/promociones').then((r) => (r.ok ? r.json() : [])).catch(() => []),
      ]);
      setProductos(prodsData);
      setMarcas(marcasData);
      if (Array.isArray(promosData)) {
        setPromociones(promosData);
      }
      setCargando(false);
    }
    cargarDatos();
  }, []);

  // Listener para botón de volver arriba
  useEffect(() => {
    const onScroll = () => {
      setMostrarScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sincronizar URL para abrir producto si viene en query (?p=slug)
  useEffect(() => {
    if (typeof window !== 'undefined' && productos.length > 0) {
      const params = new URLSearchParams(window.location.search);
      const pSlug = params.get('p');
      if (pSlug) {
        const encontrado = productos.find((p) => p.slug === pSlug);
        if (encontrado) setProductoSeleccionado(encontrado);
      }
    }
  }, [productos]);

  const abrirModalProducto = (p: Producto) => {
    setProductoSeleccionado(p);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `?p=${p.slug}`);
    }
  };

  const cerrarModalProducto = () => {
    setProductoSeleccionado(null);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  // Reiniciar paginación cuando cambia cualquier filtro
  useEffect(() => {
    setLimiteVisible(PASO_PAGINACION);
  }, [marcaSeleccionada, categoriaSeleccionada, busqueda, promocionActivaFiltro, orden, filtroCurado]);

  // Conteo de productos por marca para mostrar en los botones
  const conteoPorMarca = useMemo(() => {
    const map: Record<string, number> = {};
    productos.forEach((p) => {
      const slug = p.marca?.slug || p.marca_id || 'otra';
      map[slug] = (map[slug] || 0) + 1;
    });
    return map;
  }, [productos]);

  // Conteo de productos por categoría para los selectores
  const conteoPorCategoria = useMemo(() => {
    const map: Record<string, number> = {};
    productos.forEach((p) => {
      const slug = p.categoria?.slug || p.categoria_id || 'otra';
      map[slug] = (map[slug] || 0) + 1;
    });
    return map;
  }, [productos]);

  // Set de IDs de productos en la promoción seleccionada
  const promoProductIdsSet = useMemo(() => {
    if (!promocionActivaFiltro) return null;
    const ids = (promocionActivaFiltro.productos || [])
      .map((p) => (p as { producto?: { id: string }; producto_id?: string }).producto?.id || (p as { producto_id?: string }).producto_id)
      .filter(Boolean) as string[];
    return ids.length > 0 ? new Set(ids) : null;
  }, [promocionActivaFiltro]);

  // Filtro compuesto + ordenamiento
  const productosFiltrados = useMemo(() => {
    const filtrados = productos.filter((p) => {
      if (promoProductIdsSet && !promoProductIdsSet.has(p.id)) {
        return false;
      }

      const coincideMarca =
        marcaSeleccionada === 'todas' ||
        p.marca?.slug === marcaSeleccionada ||
        p.marca_id === marcaSeleccionada;

      const coincideCategoria =
        categoriaSeleccionada === 'todas' ||
        p.categoria?.slug === categoriaSeleccionada ||
        p.categoria_id === categoriaSeleccionada;

      const coincideCurado =
        filtroCurado === 'todos' ||
        (filtroCurado === 'destacados' && p.es_destacado) ||
        (filtroCurado === 'nuevos' && p.es_nuevo);

      const texto = `${p.nombre} ${p.descripcion ?? ''} ${p.marca?.nombre ?? ''} ${p.codigo_referencia ?? ''}`.toLowerCase();
      const coincideBusqueda = texto.includes(busqueda.toLowerCase());

      return coincideMarca && coincideCategoria && coincideCurado && coincideBusqueda;
    });

    return filtrados.sort((a, b) => {
      if (orden === 'nombre-asc') {
        return a.nombre.localeCompare(b.nombre);
      }
      if (orden === 'nombre-desc') {
        return b.nombre.localeCompare(a.nombre);
      }
      if (orden === 'marca-asc') {
        const marcaA = a.marca?.nombre || '';
        const marcaB = b.marca?.nombre || '';
        return marcaA.localeCompare(marcaB);
      }
      // 'destacados': destacados y nuevos primero
      const scoreA = (a.es_destacado ? 2 : 0) + (a.es_nuevo ? 1 : 0);
      const scoreB = (b.es_destacado ? 2 : 0) + (b.es_nuevo ? 1 : 0);
      if (scoreA !== scoreB) return scoreB - scoreA;
      if (a.created_at && b.created_at) {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });
  }, [productos, marcaSeleccionada, categoriaSeleccionada, busqueda, promoProductIdsSet, orden, filtroCurado]);

  const productosVisibles = useMemo(() => {
    return productosFiltrados.slice(0, limiteVisible);
  }, [productosFiltrados, limiteVisible]);

  // Productos relacionados para el modal
  const productosRelacionados = useMemo(() => {
    if (!productoSeleccionado) return [];
    return productos
      .filter(
        (p) =>
          p.id !== productoSeleccionado.id &&
          (p.marca_id === productoSeleccionado.marca_id ||
            p.categoria_id === productoSeleccionado.categoria_id)
      )
      .slice(0, 3);
  }, [productoSeleccionado, productos]);

  const hayFiltrosActivos =
    marcaSeleccionada !== 'todas' ||
    categoriaSeleccionada !== 'todas' ||
    promocionActivaFiltro !== null ||
    busqueda.trim() !== '' ||
    filtroCurado !== 'todos';

  const limpiarTodosFiltros = () => {
    setMarcaSeleccionada('todas');
    setCategoriaSeleccionada('todas');
    setPromocionActivaFiltro(null);
    setFiltroCurado('todos');
    setBusqueda('');
  };

  const nombreMarcaActiva = useMemo(() => {
    if (marcaSeleccionada === 'todas') return null;
    const m = marcas.find((item) => item.slug === marcaSeleccionada || item.id === marcaSeleccionada);
    return m ? m.nombre : marcaSeleccionada;
  }, [marcaSeleccionada, marcas]);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-neutral-900 pb-20 sm:pb-0">
      {/* Topbar estilo Cyzone y Belcorp con LuKa */}
      <Navbar
        onAbrirCarrito={() => setCarritoAbierto(true)}
        busqueda={busqueda}
        onCambioBusqueda={setBusqueda}
        categoriaActiva={categoriaSeleccionada}
        onFiltrarCategoria={(cat) => {
          setCategoriaSeleccionada(cat === categoriaSeleccionada ? 'todas' : cat);
          const el = document.getElementById('catalogo-seccion');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        marcaActiva={marcaSeleccionada}
        onFiltrarMarca={(slug) => {
          setMarcaSeleccionada(slug === marcaSeleccionada ? 'todas' : slug);
          const el = document.getElementById('catalogo-seccion');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <main className="flex-1 w-full space-y-8">
        {/* Banner Informativo Supabase en caso de mock */}
        {!isSupabaseConfigured && (
          <div className="max-w-7xl mx-auto px-4 pt-4">
            <div className="bg-neutral-100 border border-neutral-300 text-neutral-800 p-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-neutral-600 shrink-0" />
                <span>
                  <strong>Modo Demostración:</strong> Viendo catálogo con datos locales. Conecta tu Supabase para sincronizar inventario real.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Hero Banner Oficial con Carrusel automático de promociones */}
        <HeroBannerCarousel
          promociones={promociones}
          onSeleccionarPromocion={(promo) => {
            setPromocionActivaFiltro(promo);
            if (promo) {
              setMarcaSeleccionada('todas');
              setCategoriaSeleccionada('todas');
            }
          }}
        />

        {/* Ancla para scroll suave */}
        <div id="catalogo-seccion" className="scroll-mt-6" />

        {/* Filtros de Marcas con diseño editorial y limpio */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-3 gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-widest text-neutral-900">
                Catálogo LuKa
              </span>
              <span className="text-neutral-300 hidden sm:inline">|</span>
              {/* Colecciones Rápidas Curadas */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setFiltroCurado('todos')}
                  className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                    filtroCurado === 'todos'
                      ? 'bg-black text-white border-black shadow-xs'
                      : 'bg-white border-neutral-300 text-neutral-700 hover:border-black'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setFiltroCurado(filtroCurado === 'destacados' ? 'todos' : 'destacados')}
                  className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                    filtroCurado === 'destacados'
                      ? 'bg-black text-white border-black shadow-xs'
                      : 'bg-white border-neutral-300 text-neutral-700 hover:border-black'
                  }`}
                >
                  Destacados
                </button>
                <button
                  onClick={() => setFiltroCurado(filtroCurado === 'nuevos' ? 'todos' : 'nuevos')}
                  className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                    filtroCurado === 'nuevos'
                      ? 'bg-black text-white border-black shadow-xs'
                      : 'bg-white border-neutral-300 text-neutral-700 hover:border-black'
                  }`}
                >
                  Novedades
                </button>
              </div>
            </div>

            {/* Controles de Orden y Conteo */}
            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-neutral-600">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                <label htmlFor="ordenar-por" className="hidden sm:inline font-medium text-neutral-500">
                  Ordenar:
                </label>
                <select
                  id="ordenar-por"
                  value={orden}
                  onChange={(e) => setOrden(e.target.value as Ordenamiento)}
                  className="bg-neutral-50 hover:bg-white border border-neutral-300 text-neutral-900 py-1 px-2 text-xs font-semibold focus:border-black outline-none cursor-pointer"
                >
                  <option value="destacados">Destacados & Nuevos</option>
                  <option value="nombre-asc">Nombre (A - Z)</option>
                  <option value="nombre-desc">Nombre (Z - A)</option>
                  <option value="marca-asc">Marca (A - Z)</option>
                </select>
              </div>

              <span className="text-xs text-neutral-500 font-semibold">
                {productosFiltrados.length} de {productos.length} productos
              </span>
            </div>
          </div>

          {/* Barra de Filtros Activos Removibles */}
          {hayFiltrosActivos && (
            <div className="flex items-center gap-1.5 flex-wrap py-1 text-xs animate-in fade-in duration-150">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" />
                Filtros activos:
              </span>
              {filtroCurado !== 'todos' && (
                <span className="inline-flex items-center gap-1 bg-black text-white px-2 py-0.5 text-[11px] font-semibold">
                  <span>Colección: {filtroCurado === 'destacados' ? 'Destacados LuKa' : 'Nuevos Lanzamientos'}</span>
                  <button
                    onClick={() => setFiltroCurado('todos')}
                    className="hover:text-neutral-300 ml-0.5 cursor-pointer"
                    title="Quitar filtro de colección"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {marcaSeleccionada !== 'todas' && (
                <span className="inline-flex items-center gap-1 bg-black text-white px-2 py-0.5 text-[11px] font-semibold">
                  <span>Marca: {nombreMarcaActiva}</span>
                  <button
                    onClick={() => setMarcaSeleccionada('todas')}
                    className="hover:text-neutral-300 ml-0.5 cursor-pointer"
                    title="Quitar filtro de marca"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {categoriaSeleccionada !== 'todas' && (
                <span className="inline-flex items-center gap-1 bg-neutral-900 text-white px-2 py-0.5 text-[11px] font-semibold">
                  <span>Categoría: {categoriaSeleccionada}</span>
                  <button
                    onClick={() => setCategoriaSeleccionada('todas')}
                    className="hover:text-neutral-300 ml-0.5 cursor-pointer"
                    title="Quitar filtro de categoría"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {promocionActivaFiltro && (
                <span className="inline-flex items-center gap-1 bg-blue-600 text-white px-2 py-0.5 text-[11px] font-semibold shadow-xs">
                  <Tag className="w-3 h-3" />
                  <span>Promo: {promocionActivaFiltro.titulo}</span>
                  <button
                    onClick={() => setPromocionActivaFiltro(null)}
                    className="hover:text-blue-200 ml-0.5 cursor-pointer"
                    title="Quitar filtro de promoción"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {busqueda.trim() !== '' && (
                <span className="inline-flex items-center gap-1 bg-neutral-100 border border-neutral-300 text-neutral-800 px-2 py-0.5 text-[11px] font-semibold">
                  <span>Búsqueda: &ldquo;{busqueda}&rdquo;</span>
                  <button
                    onClick={() => setBusqueda('')}
                    className="hover:text-black ml-0.5 cursor-pointer"
                    title="Limpiar búsqueda"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={limpiarTodosFiltros}
                className="text-[11px] font-bold text-neutral-500 hover:text-black underline ml-1 cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Limpiar filtros
              </button>
            </div>
          )}

          {/* Selector de Categorías */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 shrink-0 mr-1 hidden sm:inline">
              Categoría:
            </span>
            <button
              onClick={() => setCategoriaSeleccionada('todas')}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider shrink-0 transition-all border cursor-pointer ${
                categoriaSeleccionada === 'todas'
                  ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                  : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-black'
              }`}
            >
              Todas ({productos.length})
            </button>
            {[
              { slug: 'maquillaje', label: 'Maquillaje' },
              { slug: 'fragancias', label: 'Perfumes' },
              { slug: 'cuidado-facial', label: 'Skincare' },
              { slug: 'electro-hogar', label: 'Electro Belleza' },
            ].map((cat) => {
              const count = conteoPorCategoria[cat.slug] ?? 0;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setCategoriaSeleccionada(categoriaSeleccionada === cat.slug ? 'todas' : cat.slug)}
                  className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider shrink-0 transition-all border cursor-pointer ${
                    categoriaSeleccionada === cat.slug
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-black'
                  }`}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Pills de marcas horizontales con contadores reales */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 shrink-0 mr-1 hidden sm:inline">
              Marca:
            </span>
            <button
              onClick={() => setMarcaSeleccionada('todas')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider shrink-0 transition-all border cursor-pointer ${
                marcaSeleccionada === 'todas'
                  ? 'bg-black text-white border-black shadow-xs'
                  : 'bg-white border-neutral-300 text-neutral-800 hover:border-black'
              }`}
            >
              Todas ({productos.length})
            </button>
            {marcas.map((m) => {
              const count = conteoPorMarca[m.slug] ?? 0;
              return (
                <button
                  key={m.id}
                  onClick={() => setMarcaSeleccionada(m.slug)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider shrink-0 transition-all border cursor-pointer ${
                    marcaSeleccionada === m.slug
                      ? 'bg-black text-white border-black shadow-xs'
                      : 'bg-white border-neutral-300 text-neutral-800 hover:border-black'
                  }`}
                >
                  {m.nombre} ({count})
                </button>
              );
            })}
          </div>
        </section>

        {/* Grilla de Productos */}
        <section id="catalogo-seccion" className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6 sm:space-y-8">
          {cargando ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 md:gap-5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <div key={n} className="bg-white border border-neutral-200 overflow-hidden flex flex-col animate-pulse">
                  <div className="aspect-square bg-neutral-100" />
                  <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <div className="h-2.5 w-14 bg-neutral-200" />
                      <div className="h-3.5 w-full bg-neutral-200" />
                      <div className="h-3.5 w-3/4 bg-neutral-200" />
                    </div>
                    <div className="pt-2 border-t border-neutral-100 flex items-center gap-1.5">
                      <div className="h-8 flex-1 bg-neutral-200" />
                      <div className="h-8 w-8 bg-neutral-200 shrink-0" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="bg-neutral-50 border border-neutral-200 p-8 sm:p-14 text-center space-y-4 max-w-xl mx-auto my-6">
              <div className="w-12 h-12 bg-neutral-200 rounded-full flex items-center justify-center mx-auto text-neutral-600">
                <Filter className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                  No se encontraron productos en LuKa
                </h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  No hay resultados para los filtros o el texto ingresado. Prueba con otra búsqueda o una de nuestras marcas oficiales.
                </p>
              </div>

              {/* Sugerencias de búsqueda rápida */}
              <div className="pt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
                  Sugerencias populares
                </span>
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  {['Labial', 'Perfume', 'Mascara', 'Cyzone', 'Ésika', 'Yanbal', 'Natura', 'L\'Bel'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setBusqueda(tag)}
                      className="px-2.5 py-1 text-xs font-semibold bg-white border border-neutral-200 hover:border-black text-neutral-800 transition-all cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={limpiarTodosFiltros}
                  className="inline-flex items-center gap-2 bg-black text-white text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-neutral-800 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ver todo el catálogo LuKa</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-4 md:gap-5">
                {productosVisibles.map((prod) => (
                  <ProductoCard
                    key={prod.id}
                    producto={prod}
                    onVerDetalle={(p) => abrirModalProducto(p)}
                  />
                ))}
              </div>

              {/* Botón Cargar Más Productos si hay más disponibles */}
              {limiteVisible < productosFiltrados.length && (
                <div className="flex flex-col items-center justify-center pt-6 pb-4 space-y-2">
                  <button
                    onClick={() => setLimiteVisible((prev) => prev + PASO_PAGINACION)}
                    className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 transition-all shadow-md active:scale-98 cursor-pointer"
                  >
                    <span>Cargar más productos</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] text-neutral-500 font-medium">
                    Mostrando {productosVisibles.length} de {productosFiltrados.length} productos
                  </span>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Botón Volver Arriba Flotante */}
      {mostrarScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-40 bg-white/95 hover:bg-neutral-100 text-black p-3 border border-neutral-300 shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
          aria-label="Volver arriba"
          title="Volver arriba"
        >
          <ArrowUp className="w-4 h-4" />
          <span className="hidden sm:inline">Subir</span>
        </button>
      )}

      {/* Botón Flotante Permanente de WhatsApp LuKa */}
      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '51997491793'}?text=${encodeURIComponent('Hola LuKa, deseo realizar una consulta sobre el catálogo de cosméticos y belleza.')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 bg-black hover:bg-neutral-800 text-white p-3 sm:px-4 sm:py-3 shadow-2xl flex items-center gap-2 border border-white/20 transition-all hover:scale-105 active:scale-95 text-xs font-bold uppercase tracking-wider"
        aria-label="Contactar a LuKa por WhatsApp"
      >
        <MessageCircle className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
        <span className="hidden sm:inline">WhatsApp LuKa</span>
      </a>

      {/* Toast Notification Flotante */}
      {toast && (
        <div className="fixed top-20 right-4 sm:top-24 sm:right-6 z-50 bg-black text-white px-4 py-3 shadow-2xl border border-white/20 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="text-xs max-w-xs">
            <p className="font-bold uppercase tracking-wider">{toast.mensaje}</p>
            {toast.productoNombre && (
              <p className="text-[11px] text-neutral-300 truncate max-w-[180px] sm:max-w-xs">
                {toast.productoNombre}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              cerrarToast();
              setCarritoAbierto(true);
            }}
            className="text-xs font-bold uppercase underline tracking-wider hover:text-neutral-300 ml-1 shrink-0 cursor-pointer"
          >
            Ver Lista
          </button>
          <button
            onClick={cerrarToast}
            className="text-neutral-400 hover:text-white p-1 ml-1 cursor-pointer"
            aria-label="Cerrar notificación"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Modal Detalle de Producto */}
      <DetalleProductoModal
        producto={productoSeleccionado}
        abierto={Boolean(productoSeleccionado)}
        onCerrar={cerrarModalProducto}
        productosRelacionados={productosRelacionados}
        onSeleccionarRelacionado={(p) => abrirModalProducto(p)}
      />

      {/* Drawer Carrito */}
      <CarritoDrawer abierto={carritoAbierto} onCerrar={() => setCarritoAbierto(false)} />

      {/* Sticky Bottom Bar en Móvil */}
      <StickyBottomBar onAbrirCarrito={() => setCarritoAbierto(true)} />

      {/* Footer Minimalista Elegante LuKa */}
      <footer className="bg-neutral-900 text-white py-12 mt-20 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-800 pb-6">
            <div className="text-center sm:text-left">
              <span className="text-2xl font-black tracking-tight uppercase block font-sans">
                LuKa
              </span>
              <span className="text-xs text-neutral-400 font-light block mt-0.5">
                Catálogo Oficial de Cosméticos, Perfumería & Cuidado Personal
              </span>
              <span className="text-[11px] text-neutral-500 block mt-1">
                Cyzone • Ésika • L&apos;Bel • Yanbal • Natura • Electro Hogar
              </span>
            </div>
            <div className="text-xs text-neutral-400 text-center sm:text-right space-y-1">
              <div className="font-semibold text-white">Atención y Pedidos por WhatsApp</div>
              <div className="text-[11px] text-neutral-400">Precios de campaña coordinados de manera personalizada</div>
            </div>
          </div>
          <div className="text-[11px] text-neutral-500 text-center">
            © 2026 LuKa Cosméticos & Belleza. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
