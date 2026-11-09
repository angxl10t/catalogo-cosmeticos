'use client';

import { useState } from 'react';
import { useCarrito } from '@/context/CarritoContext';
import { X, Trash2, ShoppingBag, Send } from 'lucide-react';

interface DrawerProps {
  abierto: boolean;
  onCerrar: () => void;
}

export function CarritoDrawer({ abierto, onCerrar }: DrawerProps) {
  const { items, totalPrecio, totalItems, cambiarCantidad, eliminarItem, enviarPedidoWhatsApp } = useCarrito();

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onCerrar}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white text-neutral-900 shadow-2xl flex flex-col border-l border-neutral-200">
          {/* Header */}
          <div className="p-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-black" />
              <h2 className="font-bold text-sm tracking-wide uppercase text-black">
                Bolsa de Compras ({totalItems})
              </h2>
            </div>
            <button
              onClick={onCerrar}
              className="p-1 hover:bg-neutral-200 text-neutral-500 transition-colors"
              aria-label="Cerrar bolsa"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de productos */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                <ShoppingBag className="w-12 h-12 mb-3 stroke-[1.2] text-neutral-300" />
                <p className="font-semibold text-neutral-700 text-sm">Tu bolsa está vacía</p>
                <p className="text-xs mt-1">Explora el catálogo y añade tus productos favoritos.</p>
              </div>
            ) : (
              items.map((it) => {
                const precio = (it.producto.precio_oferta ?? it.producto.precio_regular) + (it.varianteSeleccionada?.precio_adicional ?? 0);
                return (
                  <div key={`${it.producto.id}-${it.varianteSeleccionada?.id ?? 'def'}`} className="flex gap-3 p-3 bg-neutral-50 border border-neutral-200">
                    <div className="relative w-16 h-16 bg-white border border-neutral-200 overflow-hidden shrink-0">
                      <img 
                        src={it.varianteSeleccionada?.imagen_url || it.producto.imagen_principal} 
                        alt={it.producto.nombre} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold tracking-widest uppercase text-neutral-500">
                        {it.producto.marca?.nombre}
                      </span>
                      <h4 className="text-xs font-bold text-black truncate">{it.producto.nombre}</h4>
                      {it.varianteSeleccionada && (
                        <p className="text-[11px] text-neutral-500 flex items-center gap-1.5 mt-0.5">
                          {it.varianteSeleccionada.codigo_hex && (
                            <span 
                              className="w-2.5 h-2.5 rounded-full border border-neutral-300 inline-block" 
                              style={{ backgroundColor: it.varianteSeleccionada.codigo_hex }}
                            />
                          )}
                          <span>Tono: {it.varianteSeleccionada.nombre}</span>
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-black text-black">
                          S/ {(precio * it.cantidad).toFixed(2)}
                        </span>
                        <div className="flex items-center gap-2 border border-neutral-300 bg-white px-2 py-0.5">
                          <button
                            onClick={() => cambiarCantidad(it.producto.id, it.cantidad - 1, it.varianteSeleccionada?.id)}
                            className="text-neutral-600 hover:text-black text-xs font-bold px-1"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{it.cantidad}</span>
                          <button
                            onClick={() => cambiarCantidad(it.producto.id, it.cantidad + 1, it.varianteSeleccionada?.id)}
                            className="text-neutral-600 hover:text-black text-xs font-bold px-1"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => eliminarItem(it.producto.id, it.varianteSeleccionada?.id)}
                      className="text-neutral-400 hover:text-black self-start p-1 transition-colors"
                      aria-label="Eliminar ítem"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout */}
          {items.length > 0 && (
            <div className="p-4 border-t border-neutral-200 bg-neutral-50 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-neutral-500 font-bold uppercase tracking-wider">Subtotal</span>
                <span className="text-lg font-black text-black">S/ {totalPrecio.toFixed(2)}</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Al enviar el pedido coordinaremos entrega y pago directamente por WhatsApp.
              </p>
              <button
                onClick={() => enviarPedidoWhatsApp()}
                className="w-full flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white font-bold py-3 px-4 text-xs tracking-widest uppercase transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Pedir por WhatsApp</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
