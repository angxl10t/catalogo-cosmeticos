'use client';

import { useState } from 'react';
import { useCarrito } from '@/context/CarritoContext';
import { ShoppingBag, Search, Sparkles } from 'lucide-react';

interface NavbarProps {
  onAbrirCarrito: () => void;
  busqueda: string;
  onCambioBusqueda: (val: string) => void;
}

export function Navbar({ onAbrirCarrito, busqueda, onCambioBusqueda }: NavbarProps) {
  const { totalItems } = useCarrito();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 tracking-tight text-lg block leading-none">
              Catálogo<span className="text-blue-600">Cosméticos</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wide">
              Unique • Cyzone • Ésika • Hogar
            </span>
          </div>
        </div>

        {/* Buscador */}
        <div className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => onCambioBusqueda(e.target.value)}
              placeholder="Buscar perfume, labial, freidora..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100 focus:bg-white rounded-full text-xs outline-none border border-transparent focus:border-blue-500 transition-all text-slate-800"
            />
          </div>
        </div>

        {/* Botón Carrito */}
        <button
          onClick={onAbrirCarrito}
          className="relative flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-transform active:scale-95"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="hidden sm:inline">Pedido</span>
          {totalItems > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Buscador Mobile */}
      <div className="p-2 border-t border-slate-50 sm:hidden px-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => onCambioBusqueda(e.target.value)}
            placeholder="Buscar en el catálogo..."
            className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-full text-xs outline-none text-slate-800"
          />
        </div>
      </div>
    </header>
  );
}
