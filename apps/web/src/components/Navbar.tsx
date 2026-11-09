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
    { label: 'Hogar & Electro', slug: 'electro-hogar' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Izquierda: Menú Hamburguesa & Categorías */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="p-1.5 text-black hover:opacity-70 transition-opacity"
            aria-label="Abrir menu"
          >
            {menuAbierto ? <X className="w-6 h-6 stroke-[2.2]" /> : <Menu className="w-6 h-6 stroke-[2.2]" />}
          </button>

          {/* Enlaces de Categorías con separador vertical estilo Cyzone */}
          <nav className="hidden lg:flex items-center text-xs font-semibold tracking-wide text-neutral-800">
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

        {/* Centro: Logos de Marcas Belcorp */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="font-serif tracking-widest text-neutral-400 text-sm font-semibold hidden md:inline">
              L&apos;BEL
            </span>
            <span className="text-neutral-300 hidden md:inline font-light">|</span>
            <span className="font-sans tracking-wider text-neutral-400 text-xs font-bold uppercase hidden sm:inline">
              ÉSIKA
            </span>
            <span className="text-neutral-300 hidden sm:inline font-light">|</span>
            <div className="bg-[#780050] text-white px-2.5 py-1 text-sm font-black tracking-tight rounded-xs shadow-xs">
              cyzone<span className="text-[10px] align-super">[]</span>
            </div>
          </Link>
        </div>

        {/* Derecha: Buscador, Admin, Lista de Consulta */}
        <div className="flex items-center gap-4 text-xs font-medium text-neutral-800">
          <Link
            href="/admin"
            className="hidden sm:inline-flex items-center gap-1.5 hover:text-black transition-colors font-medium text-[11px]"
          >
            <User className="w-4 h-4 stroke-[1.8]" />
            <span>Admin</span>
          </Link>

          {/* Boton Buscador toggle */}
          <button
            onClick={() => setMostrarBuscador(!mostrarBuscador)}
            className="p-1 hover:text-black transition-colors"
            aria-label="Buscar"
          >
            <Search className="w-5 h-5 stroke-[2]" />
          </button>

          {/* Lista de Consulta */}
          <button
            onClick={onAbrirCarrito}
            className="relative flex items-center p-1 hover:opacity-80 transition-opacity"
            aria-label="Abrir lista de consulta"
          >
            <ShoppingBag className="w-5 h-5 stroke-[2] text-black" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Barra de Búsqueda Desplegable */}
      {mostrarBuscador && (
        <div className="border-t border-neutral-100 bg-neutral-50 px-4 py-3">
          <div className="max-w-2xl mx-auto relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              autoFocus
              value={busqueda}
              onChange={(e) => onCambioBusqueda(e.target.value)}
              placeholder="Buscar por producto, marca o fragancia..."
              className="w-full pl-10 pr-10 py-2 text-xs bg-white border border-neutral-300 rounded-none outline-none focus:border-black transition-all"
            />
            {busqueda && (
              <button
                onClick={() => onCambioBusqueda('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      )}

      {/* Menú Desplegable Móvil */}
      {menuAbierto && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-4 py-3 space-y-2">
          {categoriasMenu.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => {
                onFiltrarCategoria && onFiltrarCategoria(cat.slug);
                setMenuAbierto(false);
              }}
              className="block w-full text-left py-2 text-xs font-semibold tracking-wide text-neutral-800 hover:text-black border-b border-neutral-100"
            >
              {cat.label}
            </button>
          ))}
          <Link
            href="/admin"
            className="block w-full text-left py-2 text-xs font-bold text-neutral-900"
          >
            Ingresar a Panel de Administración
          </Link>
        </div>
      )}
    </header>
  );
}
