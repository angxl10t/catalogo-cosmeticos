'use client';

import { useCarrito } from '@/context/CarritoContext';
import { ShoppingBag, MessageCircle } from 'lucide-react';

interface Props {
  onAbrirCarrito: () => void;
}

export function StickyBottomBar({ onAbrirCarrito }: Props) {
  const { totalItems, consultarWhatsApp } = useCarrito();

  if (totalItems === 0) return null;

  return (
    <div 
      className="fixed bottom-0 inset-x-0 z-40 p-3 sm:hidden bg-white/95 backdrop-blur-md border-t border-neutral-300 shadow-2xl transition-all"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0.75rem))' }}
    >
      <div className="flex items-center justify-between gap-2.5 max-w-md mx-auto">
        <button
          onClick={onAbrirCarrito}
          className="flex items-center gap-2 text-left bg-neutral-100 hover:bg-neutral-200 py-2 px-2.5 border border-neutral-300 transition-colors shrink-0 cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-black" />
            <span className="absolute -top-1.5 -right-2 bg-black text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          </div>
          <div className="hidden xs:block">
            <span className="text-[10px] text-neutral-500 font-medium block leading-none">Mi Lista</span>
            <span className="text-xs font-bold text-black leading-tight">
              {totalItems} item{totalItems === 1 ? '' : 's'}
            </span>
          </div>
        </button>

        <button
          onClick={() => consultarWhatsApp()}
          className="flex-1 flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 active:scale-95 text-white font-bold py-2.5 px-3 sm:px-4 text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Consultar Lista LuKa</span>
        </button>
      </div>
    </div>
  );
}
