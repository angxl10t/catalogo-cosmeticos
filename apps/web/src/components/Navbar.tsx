'use client';

import { useState } from 'react';
import { useCarrito } from '@/context/CarritoContext';
import { ShoppingBag, Search, Menu, User, X } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  onAbrirCarrito: () => void;
  busqueda: string;
  onCambioBusqueda: (val: string) => void;
  onFiltrarCategoria?: (cat: string) => void;
  onFiltrarMarca?: (marcaSlug: string) => void;
  categoriaActiva?: string;
  marcaActiva?: string;
}

export function Navbar({ 
  onAbrirCarrito, 
  busqueda, 
  onCambioBusqueda,
  onFiltrarCategoria,
  onFiltrarMarca,
  categoriaActiva = 'todas',
  marcaActiva = 'todas',
}: NavbarProps) {
  const { totalItems } = useCarrito();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarBuscadorMovil, setMostrarBuscadorMovil] = useState(false);

  const categoriasMenu = [
    { label: 'Maquillaje', slug: 'maquillaje' },
    { label: 'Perfumes', slug: 'fragancias' },
    { label: 'Skincare', slug: 'cuidado-facial' },
    { label: 'Electro Belleza', slug: 'electro-hogar' },
  ];

  const marcasHeader = [
    { label: "L'BEL", slug: 'lbel', style: 'font-serif tracking-widest text-[11px]' },
    { label: 'ÉSIKA', slug: 'esika', style: 'font-sans tracking-wider text-[11px] font-bold' },
    { label: 'CYZONE', slug: 'cyzone', style: 'font-sans tracking-tight text-[11px] font-black' },
    { label: 'YANBAL', slug: 'unique-yanbal', style: 'font-sans tracking-wider text-[11px] font-bold' },
    { label: 'NATURA', slug: 'natura', style: 'font-sans tracking-wider text-[11px] font-bold' },
  ];

  const handleMarcaClick = (slug: string) => {
    if (onFiltrarMarca) {
      onFiltrarMarca(slug);
    }
    const el = document.getElementById('catalogo-seccion');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      {/* Top Strip Announcement LuKa */}
      <div className="bg-black text-white text-[9px] sm:text-[10px] tracking-widest uppercase font-semibold py-1.5 px-3 sm:px-4 text-center">
        <span className="hidden sm:inline">
          LuKa • Catálogo Oficial de Belleza & Cuidado Personal • Pedidos y Cotizaciones por WhatsApp
        </span>
        <span className="sm:hidden inline">
          LuKa • Catálogo Oficial • Precios y Pedidos por WhatsApp
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-6">
        {/* Izquierda: Menú Hamburguesa & Logo LuKa */}
        <div className="flex items-center gap-3 sm:gap-6 shrink-0">
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="p-1.5 text-black hover:opacity-70 transition-opacity lg:hidden cursor-pointer"
            aria-label="Abrir menu"
          >
            {menuAbierto ? <X className="w-5 h-5 stroke-[2.2]" /> : <Menu className="w-5 h-5 stroke-[2.2]" />}
          </button>

          {/* Logo Principal LuKa */}
          <Link href="/" className="flex items-baseline gap-2 group cursor-pointer">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-black uppercase font-sans">
              LuKa
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 border-l border-neutral-300 pl-2 hidden sm:inline-block leading-none">
              Cosméticos
            </span>
          </Link>

          {/* Enlaces de Categorías estilo Editorial Belcorp */}
          <nav className="hidden lg:flex items-center text-xs font-semibold tracking-wide text-neutral-800 ml-2">
            {categoriasMenu.map((cat, idx) => (
              <div key={cat.slug} className="flex items-center">
                <button
                  onClick={() => onFiltrarCategoria && onFiltrarCategoria(cat.slug)}
                  className={`px-3 py-1.5 hover:text-black transition-colors cursor-pointer ${
                    categoriaActiva === cat.slug ? 'font-black text-black underline underline-offset-8' : ''
                  }`}
                >
                  {cat.label}
                </button>
                {idx < categoriasMenu.length - 1 && (
                  <span className="text-neutral-300 font-light select-none">|</span>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Centro: Buscador Integrado Permanente en Desktop y Tablet */}
        <div className="hidden md:flex flex-1 max-w-md mx-auto relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => onCambioBusqueda(e.target.value)}
            placeholder="Buscar por producto, marca, tono o fragancia..."
            className="w-full pl-9 pr-8 py-2 text-xs bg-neutral-50 hover:bg-white focus:bg-white border border-neutral-300 focus:border-black rounded-none outline-none transition-all placeholder:text-neutral-400"
          />
          {busqueda && (
            <button
              onClick={() => onCambioBusqueda('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black text-xs font-bold p-1 cursor-pointer"
              title="Limpiar búsqueda"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sellos de Marcas Interactivos (Desktop XL) */}
        <div className="hidden xl:flex items-center gap-2 text-xs text-neutral-400">
          {marcasHeader.map((m, idx) => {
            const estaActiva = marcaActiva === m.slug;
            return (
              <div key={m.slug} className="flex items-center gap-2">
                <button
                  onClick={() => handleMarcaClick(m.slug)}
                  className={`transition-colors cursor-pointer ${m.style} ${
                    estaActiva ? 'text-black font-black underline' : 'hover:text-black'
                  }`}
                >
                  {m.label}
                </button>
                {idx < marcasHeader.length - 1 && (
                  <span className="text-neutral-300 font-light select-none">|</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Derecha: Botón Buscador Móvil, Admin, Lista de Consulta */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-medium text-neutral-800 shrink-0">
          {/* Boton Buscador toggle (solo móvil < md) */}
          <button
            onClick={() => setMostrarBuscadorMovil(!mostrarBuscadorMovil)}
            className="md:hidden flex items-center p-2 text-neutral-700 hover:text-black transition-colors"
            aria-label="Abrir buscador"
          >
            <Search className="w-5 h-5 stroke-[2]" />
          </button>

          {/* Enlace Admin */}
          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 hover:text-black transition-colors font-semibold text-[11px] py-1.5 px-2.5 border border-neutral-200 hover:border-black bg-white"
          >
            <User className="w-3.5 h-3.5 stroke-[2]" />
            <span>Admin</span>
          </Link>

          {/* Lista de Consulta */}
          <button
            onClick={onAbrirCarrito}
            className="relative flex items-center gap-1.5 sm:gap-2 py-1.5 px-2.5 sm:px-3 bg-neutral-900 hover:bg-black text-white transition-all shadow-xs cursor-pointer active:scale-95"
            aria-label="Abrir lista de consulta"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2]" />
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">
              Mi Lista
            </span>
            {totalItems > 0 ? (
              <span className="bg-white text-black text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-4 text-center">
                {totalItems}
              </span>
            ) : (
              <span className="text-[10px] text-neutral-400 hidden sm:inline">(0)</span>
            )}
          </button>
        </div>
      </div>

      {/* Barra de Búsqueda Desplegable Móvil (< md) */}
      {mostrarBuscadorMovil && (
        <div className="md:hidden border-t border-neutral-200 bg-neutral-50 px-3 py-2.5 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={busqueda}
              onChange={(e) => onCambioBusqueda(e.target.value)}
              placeholder="Buscar por producto, marca o fragancia..."
              className="w-full pl-9 pr-9 py-2 text-xs bg-white border border-neutral-300 rounded-none outline-none focus:border-black transition-all placeholder:text-neutral-400"
            />
            {busqueda && (
              <button
                onClick={() => onCambioBusqueda('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black text-xs font-bold p-1 cursor-pointer"
                aria-label="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Menú Desplegable Móvil */}
      {menuAbierto && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-4 py-4 space-y-4 shadow-xl">
          {/* Categorías */}
          <div className="pb-3 border-b border-neutral-100">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
              Categorías de Belleza
            </span>
            <div className="grid grid-cols-2 gap-2">
              {categoriasMenu.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => {
                    onFiltrarCategoria && onFiltrarCategoria(cat.slug);
                    setMenuAbierto(false);
                  }}
                  className={`text-left py-2 px-3 text-xs font-semibold tracking-wide border transition-all cursor-pointer ${
                    categoriaActiva === cat.slug
                      ? 'bg-black text-white border-black'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-800 hover:border-black'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Marcas Rápidas en Móvil */}
          <div className="pb-3 border-b border-neutral-100">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
              Marcas Destacadas
            </span>
            <div className="flex flex-wrap gap-1.5">
              {marcasHeader.map((m) => (
                <button
                  key={m.slug}
                  onClick={() => {
                    handleMarcaClick(m.slug);
                    setMenuAbierto(false);
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 cursor-pointer"
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-xs">
            <Link
              href="/admin"
              onClick={() => setMenuAbierto(false)}
              className="inline-flex items-center gap-2 font-semibold text-neutral-700 hover:text-black py-1"
            >
              <User className="w-4 h-4" />
              <span>Panel de Administración</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
