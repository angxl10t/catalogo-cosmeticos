'use client';

import { useState, useEffect } from 'react';
import { Producto, VarianteProducto } from '@/types/catalogo';
import { useCarrito } from '@/context/CarritoContext';
import { X, MessageCircle, Plus, Check, Share2, CheckCheck, Sparkles } from 'lucide-react';

interface Props {
  producto: Producto | null;
  abierto: boolean;
  onCerrar: () => void;
}

export function DetalleProductoModal({ producto, abierto, onCerrar }: Props) {
  const { agregarProducto, consultarProductoDirecto } = useCarrito();
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<VarianteProducto | undefined>(undefined);
  const [agregadoAnim, setAgregadoAnim] = useState(false);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (producto?.variantes && producto.variantes.length > 0) {
      setVarianteSeleccionada(producto.variantes[0]);
    } else {
      setVarianteSeleccionada(undefined);
    }
  }, [producto]);

  if (!abierto || !producto) return null;

  const handleAgregar = () => {
    agregarProducto(producto, varianteSeleccionada);
    setAgregadoAnim(true);
    setTimeout(() => setAgregadoAnim(false), 900);
  };

  const handleCompartir = async () => {
    const url = `${window.location.origin}?p=${producto.slug}`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  const imagenMostrar = varianteSeleccionada?.imagen_url || producto.imagen_principal;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onCerrar} />

      <div className="relative bg-white max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-neutral-200 z-10 text-neutral-900">
        {/* Barra superior de acciones */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          <button
            onClick={handleCompartir}
            title="Copiar enlace de este producto"
            className="p-2 bg-white text-black border border-neutral-200 hover:bg-neutral-100 transition-all flex items-center gap-1 text-xs font-semibold"
            aria-label="Compartir producto"
          >
            {copiado ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline text-[11px]">{copiado ? 'Enlace copiado' : 'Compartir'}</span>
          </button>

          <button
            onClick={onCerrar}
            className="p-2 bg-white text-black border border-neutral-200 hover:bg-neutral-100 transition-all"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6 space-y-5">
          {/* Imagen Hero */}
          <div className="relative aspect-square w-full bg-neutral-100 border border-neutral-200 overflow-hidden">
            <img
              src={imagenMostrar}
              alt={producto.nombre}
              className="w-full h-full object-cover object-center"
            />
            {producto.es_destacado && (
              <span className="absolute bottom-3 left-3 bg-black text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1">
                Destacado LuKa
              </span>
            )}
          </div>

          {/* Info Principal */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-900">
                  {producto.marca?.nombre ?? 'LuKa'}
                </span>
                <span className="text-[10px] text-neutral-400 font-medium border-l border-neutral-300 pl-2">
                  Catálogo LuKa
                </span>
              </div>
              {producto.codigo_referencia && (
                <span className="text-[11px] text-neutral-400 font-mono">
                  REF: {producto.codigo_referencia}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black leading-snug">
              {producto.nombre}
            </h2>

            {/* Aviso de precio por WhatsApp LuKa */}
            <div className="p-3 bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 flex items-center justify-between">
              <span>Precio y promociones vigentes:</span>
              <span className="font-bold text-black uppercase tracking-wider text-[11px]">
                Coordinar con LuKa por WhatsApp
              </span>
            </div>
          </div>

          {/* Variantes / Swatches */}
          {producto.variantes && producto.variantes.length > 0 && (
            <div className="p-4 bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-700 uppercase tracking-wider text-[11px]">
                  Tono seleccionado:
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
            <div className="space-y-1 pt-1">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
                Detalles del Producto
              </h4>
              <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                {producto.descripcion}
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-5 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <button
            onClick={handleAgregar}
            className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 px-4 text-xs tracking-wider uppercase border transition-all cursor-pointer ${
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
            className="flex-1 flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white font-bold py-3.5 px-5 text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Consultar por WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
