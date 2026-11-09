'use client';

import { useCarrito } from '@/context/CarritoContext';
import { ShoppingBag, Search, Sparkles, Heart } from 'lucide-react';
import Link from 'next/link';

interface NavbarProps {
  onAbrirCarrito: () => void;
  busqueda: string;
  onCambioBusqueda: (val: string) => void;
}

export function Navbar({ onAbrirCarrito, busqueda, onCambioBusqueda }: NavbarProps) {
  const { totalItems } = useCarrito();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100/70 shadow-2xs">
      {/* Barra superior de anuncios estilo Cyzone Belcorp */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white text-[11px] font-bold py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
        <span>¡CYBER LOOK & CATÁLOGO 2026! Hasta -40% OFF en Maquillaje y Fragancias • Pedidos por WhatsApp</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo al estilo Cyzone / Belcorp */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-rose-500/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-xl tracking-tight text-slate-900 block leading-none">
              cy<span className="text-rose-600">zone</span><span className="text-slate-400 font-light text-base"> & beauty</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest uppercase text-slate-400 block mt-0.5">
              Belcorp • Unique • Natura
            </span>
          </div>
        </Link>

        {/* Buscador central amplio estilo e-commerce */}
        <div className="flex-1 max-w-lg hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => onCambioBusqueda(e.target.value)}
              placeholder="Buscar labial Studio Look, Sweet Black, perfume Ccori..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 focus:bg-white rounded-full text-xs font-medium outline-none border border-transparent focus:border-rose-400 focus:ring-2 focus:ring-rose-500/15 transition-all text-slate-800 placeholder:text-slate-400 shadow-inner"
            />
          </div>
        </div>

        {/* Acciones Derecha */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/admin"
            className="hidden md:flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-rose-600 px-3 py-2 rounded-full hover:bg-rose-50 transition-colors"
          >
            <span>Panel Admin</span>
          </Link>

          {/* Botón Carrito con badge */}
          <button
            onClick={onAbrirCarrito}
            className="relative flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-md shadow-rose-600/25 transition-all active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Mi Pedido</span>
            {totalItems > 0 && (
              <span className="bg-white text-rose-600 text-[10px] font-black px-1.5 py-0.2 rounded-full min-w-4 text-center shadow-xs">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Buscador Mobile */}
      <div className="p-2.5 border-t border-rose-100/60 sm:hidden px-4 bg-slate-50/50">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => onCambioBusqueda(e.target.value)}
            placeholder="Buscar por producto, marca o tono..."
            className="w-full pl-10 pr-4 py-2 bg-white rounded-full text-xs font-medium outline-none text-slate-800 border border-slate-200/80 shadow-2xs"
          />
        </div>
      </div>
    </header>
  );
}
