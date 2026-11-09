'use client';

import { useState } from 'react';
import { Producto, VarianteProducto } from '@/types/catalogo';
import { useCarrito } from '@/context/CarritoContext';
import { X, MessageCircle, Plus, Check } from 'lucide-react';

interface Props {
  producto: Producto | null;
  abierto: boolean;
  onCerrar: () => void;
}

export function DetalleProductoModal({ producto, abierto, onCerrar }: Props) {
  const { agregarProducto, consultarProductoDirecto } = useCarrito();
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<VarianteProducto | undefined>(
    producto?.variantes && producto.variantes.length > 0 ? producto.variantes[0] : undefined
  );
  const [agregadoAnim, setAgregadoAnim] = useState(false);

  if (!abierto || !producto) return null;

  const handleAgregar = () => {
    agregarProducto(producto, varianteSeleccionada);
    setAgregadoAnim(true);
    setTimeout(() => setAgregadoAnim(false), 900);
  };

  const imagenMostrar = varianteSeleccionada?.imagen_url || producto.imagen_principal;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onCerrar} />

      <div className="relative bg-white max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-neutral-200 z-10 text-neutral-900">
        {/* Boton cerrar */}
        <button
          onClick={onCerrar}
          className="absolute top-3.5 right-3.5 z-20 p-2 bg-white text-black border border-neutral-200 hover:bg-neutral-100 transition-all"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Imagen Hero */}
          <div className="relative aspect-square w-full bg-neutral-100 border border-neutral-200">
            <img
              src={imagenMostrar}
              alt={producto.nombre}
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Info Principal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                {producto.marca?.nombre ?? 'CYZONE'}
              </span>
              {producto.codigo_referencia && (
                <span className="text-[11px] text-neutral-400 font-mono">
                  COD: {producto.codigo_referencia}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black leading-snug">
              {producto.nombre}
            </h2>

            {/* Aviso de precio por WhatsApp */}
            <div className="p-3 bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 flex items-center justify-between">
              <span>Precio y promocion de campana:</span>
              <span className="font-bold text-black uppercase tracking-wider text-[11px]">
                A consultar por WhatsApp
              </span>
            </div>
          </div>

          {/* Variantes / Swatches */}
          {producto.variantes && producto.variantes.length > 0 && (
            <div className="p-4 bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-700 uppercase tracking-wider text-[11px]">
                  Tono o Presentacion:
                </span>
                <span className="font-bold text-black">
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
                      className={`flex items-center gap-2 py-1.5 px-3 text-xs font-semibold border transition-all ${
                        esActivo
                          ? 'border-black bg-black text-white'
                          : 'border-neutral-300 bg-white text-neutral-800 hover:border-black'
                      }`}
                    >
                      {v.codigo_hex && (
                        <span
                          className="w-3 h-3 rounded-full border border-neutral-300 shrink-0"
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

          {/* Descripcion */}
          {producto.descripcion && (
            <div className="space-y-1">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                Descripcion del Producto
              </h4>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                {producto.descripcion}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-neutral-50 border-t border-neutral-200 flex items-center gap-3">
          <button
            onClick={handleAgregar}
            className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 px-4 text-xs tracking-wider uppercase border transition-all ${
              agregadoAnim
                ? 'bg-neutral-800 text-white border-neutral-800'
                : 'bg-white border-black text-black hover:bg-neutral-100'
            }`}
          >
            {agregadoAnim ? (
              <>
                <Check className="w-4 h-4" />
                <span>Agregado a la Lista</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Agregar a mi Lista</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onCerrar();
              consultarProductoDirecto(producto, varianteSeleccionada);
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white font-bold py-3 px-5 text-xs tracking-wider uppercase transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Consultar por WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
