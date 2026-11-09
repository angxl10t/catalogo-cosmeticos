'use client';

import { useState } from 'react';
import { Producto, VarianteProducto } from '@/types/catalogo';
import { useCarrito } from '@/context/CarritoContext';
import { X, ShoppingBag, Check, ShieldCheck, Sparkles, Send } from 'lucide-react';

interface Props {
  producto: Producto | null;
  abierto: boolean;
  onCerrar: () => void;
}

export function DetalleProductoModal({ producto, abierto, onCerrar }: Props) {
  const { agregarProducto, enviarPedidoWhatsApp } = useCarrito();
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<VarianteProducto | undefined>(
    producto?.variantes && producto.variantes.length > 0 ? producto.variantes[0] : undefined
  );
  const [agregadoAnim, setAgregadoAnim] = useState(false);

  if (!abierto || !producto) return null;

  const tieneOferta = Boolean(producto.precio_oferta && producto.precio_oferta < producto.precio_regular);
  const precioUnitario = (producto.precio_oferta ?? producto.precio_regular) + (varianteSeleccionada?.precio_adicional ?? 0);
  const ahorro = tieneOferta ? producto.precio_regular - (producto.precio_oferta ?? 0) : 0;

  const handleAgregar = () => {
    agregarProducto(producto, varianteSeleccionada);
    setAgregadoAnim(true);
    setTimeout(() => setAgregadoAnim(false), 900);
  };

  const imagenMostrar = varianteSeleccionada?.imagen_url || producto.imagen_principal;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onCerrar} 
      />

      <div className="relative bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100 z-10 text-slate-800">
        {/* Botón cerrar */}
        <button
          onClick={onCerrar}
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-slate-500 shadow-md backdrop-blur-xs transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Imagen Hero */}
          <div className="relative aspect-square sm:aspect-4/3 w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
            <img
              src={imagenMostrar}
              alt={producto.nombre}
              className="w-full h-full object-cover object-center"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {tieneOferta && (
                <span className="bg-rose-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                  Ahorras S/ {ahorro.toFixed(2)}
                </span>
              )}
              {producto.es_nuevo && (
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase tracking-wide">
                  Nuevo
                </span>
              )}
            </div>
          </div>

          {/* Info Principal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              {producto.marca && (
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                  {producto.marca.nombre}
                </span>
              )}
              {producto.codigo_referencia && (
                <span className="text-[11px] text-slate-400 font-mono">
                  Ref: {producto.codigo_referencia}
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
              {producto.nombre}
            </h2>

            {/* Precios */}
            <div className="flex items-baseline gap-2.5 pt-1">
              <span className="text-2xl font-black text-slate-900">
                S/ {precioUnitario.toFixed(2)}
              </span>
              {tieneOferta && (
                <span className="text-sm text-slate-400 line-through">
                  S/ {producto.precio_regular.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Variantes / Tonos */}
          {producto.variantes && producto.variantes.length > 0 && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Selecciona Tono o Presentación:
                </span>
                <span className="text-xs text-blue-600 font-bold">
                  {varianteSeleccionada?.nombre}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {producto.variantes.map((v) => {
                  const esActivo = varianteSeleccionada?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setVarianteSeleccionada(v)}
                      className={`flex items-center gap-2 py-1.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        esActivo
                          ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {v.codigo_hex && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                          style={{ backgroundColor: v.codigo_hex }}
                        />
                      )}
                      <span>{v.nombre}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Descripción */}
          {producto.descripcion && (
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Detalles del Producto
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {producto.descripcion}
              </p>
            </div>
          )}

          {/* Garantías de confianza */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Original & Garantizado</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-600">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Coordinación directa</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
          <button
            onClick={handleAgregar}
            className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-2xl text-xs shadow-md transition-all active:scale-[0.98] ${
              agregadoAnim
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {agregadoAnim ? (
              <>
                <Check className="w-4 h-4" />
                <span>¡Agregado al Pedido!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Agregar al Pedido</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              agregarProducto(producto, varianteSeleccionada);
              onCerrar();
              enviarPedidoWhatsApp();
            }}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-2xl text-xs shadow-md transition-all active:scale-[0.98]"
            title="Pedir directamente este producto por WhatsApp"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Comprar Ya</span>
          </button>
        </div>
      </div>
    </div>
  );
}
