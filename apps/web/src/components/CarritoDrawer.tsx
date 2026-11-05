'use client';

import { useState } from 'react';
import { useCarrito } from '@/context/CarritoContext';
import { X, Trash2, ShoppingBag, Send } from 'lucide-react';
import Image from 'next/image';

interface DrawerProps {
  abierto: boolean;
  onCerrar: () => void;
}

export function CarritoDrawer({ abierto, onCerrar }: DrawerProps) {
  const { items, totalPrecio, totalItems, cambiarCantidad, eliminarItem, enviarPedidoWhatsApp } = useCarrito();

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Fondo oscuro */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onCerrar}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white text-slate-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-lg text-slate-900">Tu Pedido ({totalItems})</h2>
            </div>
            <button
              onClick={onCerrar}
              className="p-1 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Lista de productos */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <ShoppingBag className="w-12 h-12 mb-3 stroke-1 text-slate-300" />
                <p className="font-medium text-slate-600">Tu carrito está vacío</p>
                <p className="text-sm mt-1">Explora el catálogo y agrega cosméticos o electrodomésticos.</p>
              </div>
            ) : (
              items.map((it) => {
                const precio = (it.producto.precio_oferta ?? it.producto.precio_regular) + (it.varianteSeleccionada?.precio_adicional ?? 0);
                return (
                  <div key={`${it.producto.id}-${it.varianteSeleccionada?.id ?? 'def'}`} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-white border border-slate-200">
                      <img 
                        src={it.varianteSeleccionada?.imagen_url || it.producto.imagen_principal} 
                        alt={it.producto.nombre} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-blue-600">
                        {it.producto.marca?.nombre}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900 truncate">{it.producto.nombre}</h4>
                      {it.varianteSeleccionada && (
                        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          {it.varianteSeleccionada.codigo_hex && (
                            <span 
                              className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block" 
                              style={{ backgroundColor: it.varianteSeleccionada.codigo_hex }}
                            />
                          )}
                          <span>Opción: {it.varianteSeleccionada.nombre}</span>
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-slate-900">
                          S/ {(precio * it.cantidad).toFixed(2)}
                        </span>
                        <div className="flex items-center gap-2 border border-slate-200 bg-white rounded-lg px-2 py-0.5 shadow-2xs">
                          <button
                            onClick={() => cambiarCantidad(it.producto.id, it.cantidad - 1, it.varianteSeleccionada?.id)}
                            className="text-slate-500 hover:text-slate-800 text-sm font-bold px-1"
                          >
                            -
                          </button>
                          <span className="text-xs font-semibold w-4 text-center">{it.cantidad}</span>
                          <button
                            onClick={() => cambiarCantidad(it.producto.id, it.cantidad + 1, it.varianteSeleccionada?.id)}
                            className="text-slate-500 hover:text-slate-800 text-sm font-bold px-1"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => eliminarItem(it.producto.id, it.varianteSeleccionada?.id)}
                      className="text-slate-300 hover:text-red-500 self-start p-1 transition-colors"
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
            <div className="p-4 border-t border-slate-100 bg-slate-50 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 font-medium">Subtotal estimado</span>
                <span className="text-xl font-extrabold text-slate-900">S/ {totalPrecio.toFixed(2)}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Al enviar el pedido coordinaremos directamente la entrega y el pago por WhatsApp.
              </p>
              <button
                onClick={() => enviarPedidoWhatsApp()}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all active:scale-[0.98]"
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
