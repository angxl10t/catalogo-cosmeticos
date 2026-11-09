'use client';

import { useState, useEffect } from 'react';
import { getProductos, getMarcas, isSupabaseConfigured } from '@/lib/supabase';
import { Producto, Marca } from '@/types/catalogo';
import { Navbar } from '@/components/Navbar';
import { ProductoCard } from '@/components/ProductoCard';
import { CarritoDrawer } from '@/components/CarritoDrawer';
import { StickyBottomBar } from '@/components/StickyBottomBar';
import { DetalleProductoModal } from '@/components/DetalleProductoModal';
import { CarritoProvider } from '@/context/CarritoContext';
import { Sparkles, Tag, AlertCircle, Flame, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

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
  const [busqueda, setBusqueda] = useState<string>('');
  const [carritoAbierto, setCarritoAbierto] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(true);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

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

  // Filtro por marca y búsqueda
  const productosFiltrados = productos.filter((p) => {
    const coincideMarca =
      marcaSeleccionada === 'todas' ||
      p.marca?.slug === marcaSeleccionada ||
      p.marca_id === marcaSeleccionada;

    const texto = `${p.nombre} ${p.descripcion ?? ''} ${p.marca?.nombre ?? ''}`.toLowerCase();
    const coincideBusqueda = texto.includes(busqueda.toLowerCase());

    return coincideMarca && coincideBusqueda;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans text-slate-800 pb-20 sm:pb-0">
      <Navbar
        onAbrirCarrito={() => setCarritoAbierto(true)}
        busqueda={busqueda}
        onCambioBusqueda={setBusqueda}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-8">
        {/* Banner Informativo Supabase en caso de mock */}
        {!isSupabaseConfigured && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Modo Demo:</strong> Mostrando catálogo mock. Conecta tu Supabase para sincronizar datos reales.
              </span>
            </div>
          </div>
        )}

        {/* Hero Banner Vibrante estilo Cyzone "Crea tu Look" */}
        <section className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-700 text-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-rose-600/15 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white border border-white/20">
              <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Campaña Belcorp & Tendencias 2026</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Todo lo que necesitas para armar tu look ✨
            </h1>
            <p className="text-xs sm:text-base text-rose-100 font-medium leading-relaxed max-w-lg">
              Descubre las líneas top como <strong>Studio Look</strong> de Cyzone, fragancias <strong>Ccori</strong> de Unique y cuidado <strong>Ekos</strong> de Natura con promociones exclusivas.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href="#catalogo-seccion"
                className="bg-white text-rose-600 hover:bg-rose-50 text-xs sm:text-sm font-black px-6 py-3 rounded-full shadow-lg transition-transform active:scale-95 inline-flex items-center gap-2"
              >
                <span>Explorar Productos</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <div className="inline-flex items-center gap-2 text-white/90 text-xs font-semibold px-3 py-2 bg-black/10 backdrop-blur-xs rounded-full">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Productos 100% Originales</span>
              </div>
            </div>
          </div>

          {/* Decoración de fondo */}
          <div className="absolute right-0 top-0 bottom-0 w-2/5 bg-radial from-white/10 via-transparent to-transparent pointer-events-none" />
        </section>

        {/* Círculos de Categorías / Marcas Estilo Stories de Instagram / Cyzone */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Marcas & Líneas Destacadas
            </h2>
            <span className="text-[11px] font-bold text-rose-600">
              {productosFiltrados.length} productos
            </span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
            <button
              onClick={() => setMarcaSeleccionada('todas')}
              className={`px-5 py-2.5 rounded-full text-xs font-black shrink-0 transition-all ${
                marcaSeleccionada === 'todas'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/25'
                  : 'bg-white border border-slate-200/90 text-slate-700 hover:bg-rose-50/50'
              }`}
            >
              💖 Todo el Catálogo
            </button>
            {marcas.map((m) => (
              <button
                key={m.id}
                onClick={() => setMarcaSeleccionada(m.slug)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  marcaSeleccionada === m.slug
                    ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md shadow-rose-600/25'
                    : 'bg-white border border-slate-200/90 text-slate-700 hover:bg-rose-50/50'
                }`}
              >
                <span>{m.nombre}</span>
                {m.categoria_principal === 'ELECTRO' && (
                  <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-md font-bold">
                    Hogar
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Sección de Catálogo */}
        <section id="catalogo-seccion" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-600" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                {marcaSeleccionada === 'todas'
                  ? 'Colección & Ofertas de Temporada'
                  : `Productos de ${marcas.find((m) => m.slug === marcaSeleccionada)?.nombre ?? 'la marca'}`}
              </h2>
            </div>
          </div>

          {cargando ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <div key={n} className="bg-white rounded-3xl h-80 animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-rose-100 space-y-3">
              <Tag className="w-12 h-12 text-rose-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No encontramos productos</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No hay resultados para tu búsqueda o filtro seleccionado. Intenta con otra marca o término.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {productosFiltrados.map((prod) => (
                <ProductoCard
                  key={prod.id}
                  producto={prod}
                  onVerDetalle={(p) => setProductoSeleccionado(p)}
                />
              ))}
            </div>
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

      {/* Footer Estilo Belcorp */}
      <footer className="bg-white border-t border-rose-100/80 py-10 text-center text-xs text-slate-500 mt-16">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <div className="flex items-center justify-center gap-2 font-black text-slate-900 text-sm">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span>Cyzone • Ésika • Unique Yanbal • Natura • Electro Hogar</span>
          </div>
          <p className="text-[11px] text-slate-400 max-w-md mx-auto leading-relaxed">
            Catálogo digital de productos y promociones oficiales. Las marcas y nombres comerciales pertenecen a sus respectivos fabricantes.
          </p>
          <div className="pt-2 text-[10px] text-slate-400">
            © 2026 Todos los derechos reservados • Pedidos directos y seguros por WhatsApp
          </div>
        </div>
      </footer>
    </div>
  );
}
