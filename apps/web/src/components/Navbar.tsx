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
  categoriaActiva?: string;
}

export function Navbar({ 
  onAbrirCarrito, 
  busqueda, 
  onCambioBusqueda,
  onFiltrarCategoria,
  categoriaActiva = 'todas'
}: NavbarProps) {
  const { totalItems } = useCarrito();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [mostrarBuscador, setMostrarBuscador] = useState(false);

  const categoriasMenu = [
    { label: 'Maquillaje', slug: 'maquillaje' },
    { label: 'Perfumes', slug: 'fragancias' },
    { label: 'Skincare', slug: 'cuidado-facial' },
    { label: 'Electro Belleza & Hogar', slug: 'electro-hogar' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      {/* Top Strip Announcement LuKa */}
      <div className="bg-black text-white text-[9px] sm:text-[10px] tracking-widest uppercase font-semibold py-1.5 px-3 sm:px-4 text-center">
        <span className="hidden sm:inline">LuKa • Catálogo Oficial de Belleza & Cuidado Personal • Pedidos y Precios por WhatsApp</span>
        <span className="sm:hidden inline">LuKa • Catálogo Oficial • Precios y Pedidos por WhatsApp</span>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
        {/* Izquierda: Menú Hamburguesa & Logo LuKa */}
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="p-1.5 text-black hover:opacity-70 transition-opacity lg:hidden"
            aria-label="Abrir menu"
          >
            {menuAbierto ? <X className="w-6 h-6 stroke-[2.2]" /> : <Menu className="w-6 h-6 stroke-[2.2]" />}
          </button>

          {/* Logo Principal LuKa */}
          <Link href="/" className="flex items-baseline gap-2 group">
            <span className="text-2xl sm:text-3xl font-black tracking-tight text-black uppercase font-sans">
              LuKa
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 border-l border-neutral-300 pl-2 hidden sm:inline-block leading-none">
              Cosméticos
            </span>
          </Link>

          {/* Enlaces de Categorías con separador vertical estilo Cyzone */}
          <nav className="hidden lg:flex items-center text-xs font-semibold tracking-wide text-neutral-800 ml-2">
            {categoriasMenu.map((cat, idx) => (
              <div key={cat.slug} className="flex items-center">
                <button
                  onClick={() => onFiltrarCategoria && onFiltrarCategoria(cat.slug)}
                  className={`px-3 py-1.5 hover:text-black transition-colors ${
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

        {/* Centro: Sellos de Marcas */}
        <div className="hidden xl:flex items-center gap-2.5 text-xs">
          <span className="font-serif tracking-widest text-neutral-400 text-xs font-semibold">
            L&apos;BEL
          </span>
          <span className="text-neutral-300 font-light">|</span>
          <span className="font-sans tracking-wider text-neutral-400 text-[11px] font-bold uppercase">
            ÉSIKA
          </span>
          <span className="text-neutral-300 font-light">|</span>
          <div className="bg-[#780050] text-white px-2 py-0.5 text-xs font-black tracking-tight rounded-xs">
            cyzone<span className="text-[9px] align-super">[]</span>
          </div>
          <span className="text-neutral-300 font-light">|</span>
          <span className="text-neutral-400 text-[11px] font-bold tracking-wider uppercase">
            YANBAL
          </span>
          <span className="text-neutral-300 font-light">|</span>
          <span className="text-neutral-400 text-[11px] font-bold tracking-wider uppercase">
            NATURA
          </span>
        </div>

        {/* Derecha: Buscador, Admin, Lista de Consulta */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium text-neutral-800">
          {/* Boton Buscador toggle */}
          <button
            onClick={() => setMostrarBuscador(!mostrarBuscador)}
            className="flex items-center gap-1.5 p-1.5 hover:text-black transition-colors border border-transparent hover:border-neutral-200"
            aria-label="Buscar"
          >
            <Search className="w-5 h-5 stroke-[2]" />
            <span className="hidden md:inline text-xs font-medium text-neutral-600">Buscar</span>
          </button>

          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 hover:text-black transition-colors font-medium text-[11px] py-1 px-2 border border-neutral-200 hover:border-black"
          >
            <User className="w-3.5 h-3.5 stroke-[2]" />
            <span>Admin</span>
          </Link>

          {/* Lista de Consulta */}
          <button
            onClick={onAbrirCarrito}
            className="relative flex items-center gap-1.5 py-1 px-2 bg-neutral-100 hover:bg-neutral-200 transition-colors border border-neutral-300"
            aria-label="Abrir lista de consulta"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2] text-black" />
            <span className="hidden sm:inline text-xs font-bold text-black uppercase tracking-wider">
              Mi Lista
            </span>
            {totalItems > 0 && (
              <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Barra de Búsqueda Desplegable */}
      {mostrarBuscador && (
        <div className="border-t border-neutral-200 bg-neutral-50 px-4 py-3 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="max-w-2xl mx-auto relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              autoFocus
              value={busqueda}
              onChange={(e) => onCambioBusqueda(e.target.value)}
              placeholder="Buscar en LuKa por producto, marca o fragancia..."
              className="w-full pl-10 pr-10 py-2.5 text-xs bg-white border border-neutral-300 rounded-none outline-none focus:border-black transition-all placeholder:text-neutral-400"
            />
            {busqueda && (
              <button
                onClick={() => onCambioBusqueda('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black text-xs font-bold p-1"
                aria-label="Limpiar busqueda"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Menú Desplegable Móvil */}
      {menuAbierto && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-4 py-4 space-y-3 shadow-lg">
          <div className="pb-2 border-b border-neutral-100">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-2">
              Categorías
            </span>
            <div className="grid grid-cols-2 gap-2">
              {categoriasMenu.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => {
                    onFiltrarCategoria && onFiltrarCategoria(cat.slug);
                    setMenuAbierto(false);
                  }}
                  className={`text-left py-2 px-3 text-xs font-semibold tracking-wide border transition-all ${
                    categoriaActiva === cat.slug
                      ? 'bg-black text-white border-black'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-xs">
            <Link
              href="/admin"
              onClick={() => setMenuAbierto(false)}
              className="inline-flex items-center gap-2 font-semibold text-neutral-700 hover:text-black py-2"
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
