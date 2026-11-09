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
import { Sparkles, Tag, AlertCircle, TrendingUp, ShieldCheck } from 'lucide-react';

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
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col font-sans text-slate-800 pb-16 sm:pb-0">
      <Navbar
        onAbrirCarrito={() => setCarritoAbierto(true)}
        busqueda={busqueda}
        onCambioBusqueda={setBusqueda}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-6 space-y-6">
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

        {/* Hero Banner Campaña */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-9 shadow-xl relative overflow-hidden border border-slate-800">
          <div className="relative z-10 max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Campaña Oficial 2026 • Cosméticos & Hogar</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Tus marcas favoritas con pedido directo a WhatsApp
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
              Explora las mejores fragancias, labiales con swatches reales y electrodomésticos para el hogar. Agrega a tu carrito y coordina la entrega en un toque.
            </p>
          </div>

          {/* Decoración de fondo */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-radial from-blue-500/15 via-transparent to-transparent pointer-events-none" />
        </section>

        {/* Selector de Marcas */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Marcas del Catálogo
            </span>
            <span className="text-[11px] text-slate-400">
              {productosFiltrados.length} productos disponibles
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
            <button
              onClick={() => setMarcaSeleccionada('todas')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all ${
                marcaSeleccionada === 'todas'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-100'
              }`}
            >
              Todas las marcas
            </button>
            {marcas.map((m) => (
              <button
                key={m.id}
                onClick={() => setMarcaSeleccionada(m.slug)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                  marcaSeleccionada === m.slug
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                    : 'bg-white border border-slate-200/80 text-slate-600 hover:bg-slate-100'
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

        {/* Grid de Productos */}
        <section>
          {cargando ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="bg-white rounded-3xl h-80 animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
              <Tag className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No encontramos productos</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No hay resultados para tu búsqueda o filtro seleccionado. Intenta con otra marca.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
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

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 text-center text-xs text-slate-400 mt-12">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-600">
            Catálogo Oficial • Cyzone, Unique, Ésika, Natura & Electro Hogar
          </p>
          <p className="text-[11px] text-slate-400">
            Precios y promociones sujetos a vigencia de campaña. Pedidos y despachos coordinados directamente por WhatsApp.
          </p>
        </div>
      </footer>
    </div>
  );
}
