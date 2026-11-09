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
import { CarritoProvider } from '@/context/CarritoContext';
import { AlertCircle, ChevronDown, MessageCircle, X, Sparkles, Tag } from 'lucide-react';
import Image from 'next/image';

const PASO_PAGINACION = 40;

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
  const [productos, setProductos] = useState<Producto[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [promocionActivaFiltro, setPromocionActivaFiltro] = useState<Promocion | null>(null);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<string>('todas');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('todas');
  const [busqueda, setBusqueda] = useState<string>('');
  const [carritoAbierto, setCarritoAbierto] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(true);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [limiteVisible, setLimiteVisible] = useState<number>(PASO_PAGINACION);

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
  }, [marcaSeleccionada, categoriaSeleccionada, busqueda, promocionActivaFiltro]);

  // Conteo de productos por marca para mostrar en los botones
  const conteoPorMarca = useMemo(() => {
    const map: Record<string, number> = {};
    productos.forEach((p) => {
      const slug = p.marca?.slug || p.marca_id || 'otra';
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

  // Filtro compuesto: promoción + marca + categoría del topbar + búsqueda
  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      // Si hay filtro de promoción activa
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

      const texto = `${p.nombre} ${p.descripcion ?? ''} ${p.marca?.nombre ?? ''} ${p.codigo_referencia ?? ''}`.toLowerCase();
      const coincideBusqueda = texto.includes(busqueda.toLowerCase());

      return coincideMarca && coincideCategoria && coincideBusqueda;
    });
  }, [productos, marcaSeleccionada, categoriaSeleccionada, busqueda, promoProductIdsSet]);

  const productosVisibles = useMemo(() => {
    return productosFiltrados.slice(0, limiteVisible);
  }, [productosFiltrados, limiteVisible]);

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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-widest text-neutral-900">
                Catálogo LuKa
              </span>
              <span className="text-neutral-300 hidden sm:inline">|</span>
              <span className="text-xs text-neutral-500 font-semibold uppercase tracking-wider hidden sm:inline">
                Filtrar por Marca
              </span>
              {categoriaSeleccionada !== 'todas' && (
                <div className="flex items-center gap-1.5 bg-black text-white px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider">
                  <span>Categoría: {categoriaSeleccionada}</span>
                  <button
                    onClick={() => setCategoriaSeleccionada('todas')}
                    className="hover:text-neutral-300 ml-1 font-bold"
                    title="Quitar filtro de categoría"
                  >
                    <X className="w-3 h-3 inline" />
                  </button>
                </div>
              )}
              {promocionActivaFiltro && (
                <div className="flex items-center gap-1.5 bg-blue-600 text-white px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider shadow-xs">
                  <Tag className="w-3 h-3 inline" />
                  <span>Promo: {promocionActivaFiltro.titulo}</span>
                  <button
                    onClick={() => setPromocionActivaFiltro(null)}
                    className="hover:text-blue-200 ml-1 font-bold"
                    title="Quitar filtro de promoción"
                  >
                    <X className="w-3 h-3 inline" />
                  </button>
                </div>
              )}
            </div>
            <span className="text-xs text-neutral-500 font-semibold">
              {productosFiltrados.length} de {productos.length} productos
            </span>
          </div>

          {/* Pills de marcas horizontales con contadores reales */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setMarcaSeleccionada('todas')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider shrink-0 transition-all border ${
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
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider shrink-0 transition-all border ${
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
                <div key={n} className="bg-neutral-100 aspect-square animate-pulse border border-neutral-200" />
              ))}
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="bg-neutral-50 border border-neutral-200 p-8 sm:p-16 text-center space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                No se encontraron productos en LuKa
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                No hay coincidencias para los filtros aplicados. Intenta seleccionando otra marca o limpiando la búsqueda.
              </p>
              <button
                onClick={() => {
                  setMarcaSeleccionada('todas');
                  setCategoriaSeleccionada('todas');
                  setBusqueda('');
                }}
                className="mt-3 inline-block bg-black text-white text-xs font-bold uppercase tracking-widest px-6 py-2.5 hover:bg-neutral-800 transition-all cursor-pointer"
              >
                Ver todo el catálogo LuKa
              </button>
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
                    className="flex items-center gap-2 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 transition-all shadow-md active:scale-98"
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

      {/* Modal Detalle de Producto */}
      <DetalleProductoModal
        producto={productoSeleccionado}
        abierto={Boolean(productoSeleccionado)}
        onCerrar={cerrarModalProducto}
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
