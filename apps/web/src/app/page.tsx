'use client';

import { useState, useEffect } from 'react';
import { getProductos, getMarcas, isSupabaseConfigured } from '@/lib/supabase';
import { Producto, Marca } from '@/types/catalogo';
import { Navbar } from '@/components/Navbar';
import { ProductoCard } from '@/components/ProductoCard';
import { CarritoDrawer } from '@/components/CarritoDrawer';
import { CarritoProvider } from '@/context/CarritoContext';
import { Sparkles, Tag, CheckCircle2, AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        onAbrirCarrito={() => setCarritoAbierto(true)}
        busqueda={busqueda}
        onCambioBusqueda={setBusqueda}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Banner Indicador de Estado (Informativo Supabase) */}
        {!isSupabaseConfigured && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-3.5 flex items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Modo Demo Activo:</strong> Viendo catálogo con datos de prueba. Cuando configures tu proyecto en Supabase, se conectará en tiempo real.
              </span>
            </div>
            <span className="hidden sm:inline bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-md text-[10px] uppercase">
              Mock Ready
            </span>
          </div>
        )}

        {/* Hero Banner Campaña */}
        <section className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-lg space-y-2">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Campaña Actual 2026
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Belleza & Confort a un toque de WhatsApp
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 font-normal">
              Descubre los últimos lanzamientos de Cyzone, Unique, Ésika y electrodomésticos seleccionados con ofertas exclusivas.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-radial from-blue-400/20 to-transparent pointer-events-none" />
        </section>

        {/* Barra de Filtros de Marcas */}
        <section className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setMarcaSeleccionada('todas')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              marcaSeleccionada === 'todas'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todas las marcas
          </button>
          {marcas.map((m) => (
            <button
              key={m.id}
              onClick={() => setMarcaSeleccionada(m.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                marcaSeleccionada === m.slug
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{m.nombre}</span>
              {m.categoria_principal === 'ELECTRO' && (
                <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-sm font-bold">
                  Hogar
                </span>
              )}
            </button>
          ))}
        </section>

        {/* Grid de Productos */}
        <section>
          {cargando ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded-2xl h-72 animate-pulse border border-slate-100" />
              ))}
            </div>
          ) : productosFiltrados.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 space-y-2">
              <Tag className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No encontramos productos</h3>
              <p className="text-xs text-slate-400">Intenta con otro término de búsqueda o selecciona otra marca.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {productosFiltrados.map((prod) => (
                <ProductoCard key={prod.id} producto={prod} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Drawer Carrito */}
      <CarritoDrawer abierto={carritoAbierto} onCerrar={() => setCarritoAbierto(false)} />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        <p>© 2026 Catálogo Cosméticos & Electrodomésticos. Todos los derechos reservados.</p>
        <p className="mt-1 text-[11px]">Pedidos y entregas coordinados directamente por WhatsApp.</p>
      </footer>
    </div>
  );
}
