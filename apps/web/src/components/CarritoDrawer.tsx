'use client';

import { useCarrito } from '@/context/CarritoContext';
import { X, Trash2, ShoppingBag, MessageCircle, ArrowRight } from 'lucide-react';

interface DrawerProps {
  abierto: boolean;
  onCerrar: () => void;
}

export function CarritoDrawer({ abierto, onCerrar }: DrawerProps) {
  const { items, totalItems, cambiarCantidad, eliminarItem, limpiarCarrito, consultarWhatsApp } = useCarrito();

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
              <div>
                <h2 className="font-black text-xs tracking-wider uppercase text-black">
                  Lista de Consulta LuKa
                </h2>
                <span className="text-[10px] text-neutral-500 font-medium block">
                  {totalItems} producto{totalItems === 1 ? '' : 's'} seleccionado{totalItems === 1 ? '' : 's'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={limpiarCarrito}
                  className="text-[10px] uppercase font-bold text-neutral-500 hover:text-rose-600 transition-colors px-2 py-1"
                  title="Vaciar lista"
                >
                  Vaciar
                </button>
              )}
              <button
                onClick={onCerrar}
                className="p-1.5 hover:bg-neutral-200 text-neutral-500 transition-colors"
                aria-label="Cerrar lista"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lista de productos */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-400">
                <ShoppingBag className="w-12 h-12 mb-3 stroke-[1.2] text-neutral-300" />
                <p className="font-bold text-neutral-800 text-sm">Tu lista de consulta está vacía</p>
                <p className="text-xs mt-1.5 max-w-xs text-neutral-500">
                  Explora el catálogo de LuKa y agrega los productos de belleza que te interesan para consultar precios de campaña.
                </p>
                <button
                  onClick={onCerrar}
                  className="mt-4 inline-flex items-center gap-1.5 bg-black text-white text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-neutral-800 transition-all"
                >
                  <span>Explorar Catálogo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              items.map((it) => {
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
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-bold tracking-widest uppercase text-neutral-500">
                          {it.producto.marca?.nombre}
                        </span>
                        {it.producto.codigo_referencia && (
                          <span className="text-[9px] font-mono text-neutral-400">
                            {it.producto.codigo_referencia}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-black truncate">{it.producto.nombre}</h4>
                      {it.varianteSeleccionada && (
                        <p className="text-[11px] text-neutral-600 flex items-center gap-1.5 mt-0.5 font-medium">
                          {it.varianteSeleccionada.codigo_hex && (
                            <span 
                              className="w-2.5 h-2.5 rounded-full border border-neutral-300 inline-block shrink-0" 
                              style={{ backgroundColor: it.varianteSeleccionada.codigo_hex }}
                            />
                          )}
                          <span>Tono: {it.varianteSeleccionada.nombre}</span>
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-200/60">
                        <span className="text-[10px] font-semibold text-neutral-500">
                          Cantidad:
                        </span>
                        <div className="flex items-center gap-2 border border-neutral-300 bg-white px-2 py-0.5">
                          <button
                            onClick={() => cambiarCantidad(it.producto.id, it.cantidad - 1, it.varianteSeleccionada?.id)}
                            className="text-neutral-600 hover:text-black text-xs font-bold px-1"
                            aria-label="Disminuir cantidad"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{it.cantidad}</span>
                          <button
                            onClick={() => cambiarCantidad(it.producto.id, it.cantidad + 1, it.varianteSeleccionada?.id)}
                            className="text-neutral-600 hover:text-black text-xs font-bold px-1"
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => eliminarItem(it.producto.id, it.varianteSeleccionada?.id)}
                      className="text-neutral-400 hover:text-black self-start p-1 transition-colors"
                      aria-label="Eliminar producto"
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
              <div className="text-[11px] text-neutral-600 bg-white p-2.5 border border-neutral-200">
                Se enviará a <strong>LuKa</strong> tu lista con los <strong>{totalItems}</strong> productos y sus tonos para cotizar precios y coordinar entrega.
              </div>
              <button
                onClick={() => consultarWhatsApp()}
                className="w-full flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white font-bold py-3.5 px-4 text-xs tracking-widest uppercase transition-all shadow-md active:scale-98"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consultar Lista por WhatsApp</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
