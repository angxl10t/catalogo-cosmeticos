'use client';

import { useState, useEffect, useMemo } from 'react';
import { getProductos, getMarcas, isSupabaseConfigured } from '@/lib/supabase';
import { Producto, Marca } from '@/types/catalogo';
import { Navbar } from '@/components/Navbar';
import { ProductoCard } from '@/components/ProductoCard';
import { CarritoDrawer } from '@/components/CarritoDrawer';
import { StickyBottomBar } from '@/components/StickyBottomBar';
import { DetalleProductoModal } from '@/components/DetalleProductoModal';
import { CarritoProvider } from '@/context/CarritoContext';
import { AlertCircle, ChevronDown } from 'lucide-react';
import Image from 'next/image';

const PASO_PAGINACION = 40;

export default function HomePage() {
  return (
    <CarritoProvider>
      <CatalogoPrincipal />
    </CarritoProvider>
  );
}

function CatalogoPrincipal() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
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
      const [prodsData, marcasData] = await Promise.all([
        getProductos(),
        getMarcas(),
      ]);
      setProductos(prodsData);
      setMarcas(marcasData);
      setCargando(false);
    }
    cargarDatos();
  }, []);

  // Reiniciar paginación cuando cambia cualquier filtro
  useEffect(() => {
    setLimiteVisible(PASO_PAGINACION);
  }, [marcaSeleccionada, categoriaSeleccionada, busqueda]);

  // Filtro compuesto: marca + categoría del topbar + búsqueda
  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
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
  }, [productos, marcaSeleccionada, categoriaSeleccionada, busqueda]);

  const productosVisibles = useMemo(() => {
    return productosFiltrados.slice(0, limiteVisible);
  }, [productosFiltrados, limiteVisible]);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-neutral-900 pb-20 sm:pb-0">
      {/* Topbar estilo Cyzone con enlaces y logos de Belcorp */}
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

        {/* Hero Banner Oficial Cyzone - "IN LOVE POTION ENCIENDE LA MAGIA" */}
        <section className="relative w-full bg-black overflow-hidden aspect-16/7 sm:aspect-21/9 max-h-[560px]">
          <Image
            src="/hero-cyzone.jpg"
            alt="Cyzone In Love Potion - Enciende la magia"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Botón flotante para interactuar directamente al hacer click */}
          <a
            href="#catalogo-seccion"
            className="absolute left-1/2 bottom-8 -translate-x-1/2 bg-white hover:bg-neutral-100 text-black font-bold uppercase tracking-widest text-xs px-8 py-3 transition-transform hover:scale-105 active:scale-95 shadow-2xl hidden sm:inline-block"
          >
            compra aquí
          </a>
        </section>

        {/* Filtros de Marcas con diseño editorial y limpio */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-900">
                Seleccionar Marca
              </span>
              {categoriaSeleccionada !== 'todas' && (
                <span className="text-[11px] bg-black text-white px-2 py-0.5 uppercase tracking-wider font-semibold">
                  Categoría: {categoriaSeleccionada}
                </span>
              )}
            </div>
            <span className="text-xs text-neutral-500 font-medium">
              {productosFiltrados.length} productos disponibles
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setMarcaSeleccionada('todas')}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider shrink-0 transition-all border ${
                marcaSeleccionada === 'todas'
                  ? 'bg-black text-white border-black'
                  : 'bg-white border-neutral-300 text-neutral-800 hover:border-black'
              }`}
            >
              Todas las Marcas ({productos.length})
            </button>
            {marcas.map((m) => (
              <button
                key={m.id}
                onClick={() => setMarcaSeleccionada(m.slug)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider shrink-0 transition-all border ${
                  marcaSeleccionada === m.slug
                    ? 'bg-black text-white border-black'
                    : 'bg-white border-neutral-300 text-neutral-800 hover:border-black'
                }`}
              >
                {m.nombre}
              </button>
            ))}
          </div>
        </section>

        {/* Grilla de Productos */}
        <section id="catalogo-seccion" className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          {cargando ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <div key={n} className="bg-neutral-100 aspect-square animate-pulse border border-neutral-200" />
              ))}
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="bg-neutral-50 border border-neutral-200 p-16 text-center space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                No se encontraron productos
              </h3>
              <p className="text-xs text-neutral-500">
                Intenta seleccionando otra marca o limpiando los filtros de búsqueda.
              </p>
              <button
                onClick={() => {
                  setMarcaSeleccionada('todas');
                  setCategoriaSeleccionada('todas');
                  setBusqueda('');
                }}
                className="mt-3 inline-block bg-black text-white text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-neutral-800"
              >
                Ver todos los productos
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {productosVisibles.map((prod) => (
                  <ProductoCard
                    key={prod.id}
                    producto={prod}
                    onVerDetalle={(p) => setProductoSeleccionado(p)}
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

      {/* Modal Detalle de Producto */}
      <DetalleProductoModal
        producto={productoSeleccionado}
        abierto={Boolean(productoSeleccionado)}
        onCerrar={() => setProductoSeleccionado(null)}
      />

      {/* Drawer Carrito */}
      <CarritoDrawer abierto={carritoAbierto} onCerrar={() => setCarritoAbierto(false)} />

      {/* Sticky Bottom Bar en Móvil */}
      <StickyBottomBar onAbrirCarrito={() => setCarritoAbierto(true)} />

      {/* Footer Minimalista Elegante */}
      <footer className="bg-neutral-900 text-white py-12 mt-20 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-neutral-800 pb-6">
            <div className="text-center sm:text-left">
              <span className="text-lg font-black tracking-widest uppercase block">
                Catálogo Digital
              </span>
              <span className="text-xs text-neutral-400 font-light">
                Cyzone • Ésika • L&apos;Bel • Unique • Natura
              </span>
            </div>
            <div className="text-xs text-neutral-400 text-center sm:text-right">
              Pedidos y entregas coordinados directamente por WhatsApp
            </div>
          </div>
          <div className="text-[11px] text-neutral-500 text-center">
            © 2026 Catálogo de Cosméticos & Belleza. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
