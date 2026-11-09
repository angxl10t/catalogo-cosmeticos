'use client';

import { useCarrito } from '@/context/CarritoContext';
import { ShoppingBag, Send } from 'lucide-react';

interface Props {
  onAbrirCarrito: () => void;
}

export function StickyBottomBar({ onAbrirCarrito }: Props) {
  const { totalItems, totalPrecio, enviarPedidoWhatsApp } = useCarrito();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 p-3 sm:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-2xl animate-in slide-in-from-bottom duration-300">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <button
          onClick={onAbrirCarrito}
          className="flex items-center gap-2.5 text-left bg-slate-100 hover:bg-slate-200 py-2 px-3 rounded-2xl transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-slate-800" />
            <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white font-extrabold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium block leading-none">Total</span>
            <span className="text-sm font-extrabold text-slate-900 leading-tight">
              S/ {totalPrecio.toFixed(2)}
            </span>
          </div>
        </button>

        <button
          onClick={() => enviarPedidoWhatsApp()}
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold py-2.5 px-4 rounded-2xl text-xs shadow-md shadow-emerald-600/25 transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Pedir por WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
