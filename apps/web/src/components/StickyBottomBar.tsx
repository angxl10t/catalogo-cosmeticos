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
    <div className="fixed bottom-0 inset-x-0 z-40 p-3 sm:hidden bg-white/95 backdrop-blur-md border-t border-neutral-200 shadow-2xl">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <button
          onClick={onAbrirCarrito}
          className="flex items-center gap-2.5 text-left bg-neutral-100 hover:bg-neutral-200 py-2 px-3 transition-colors border border-neutral-300"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-black" />
            <span className="absolute -top-1.5 -right-2 bg-black text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 font-medium block leading-none">Total</span>
            <span className="text-sm font-extrabold text-black leading-tight">
              S/ {totalPrecio.toFixed(2)}
            </span>
          </div>
        </button>

        <button
          onClick={() => enviarPedidoWhatsApp()}
          className="flex-1 flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 active:scale-95 text-white font-bold py-2.5 px-4 text-xs tracking-wider uppercase transition-all"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Pedir por WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
