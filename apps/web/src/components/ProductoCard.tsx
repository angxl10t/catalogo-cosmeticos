'use client';

import { useState } from 'react';
import { Producto, VarianteProducto } from '@/types/catalogo';
import { useCarrito } from '@/context/CarritoContext';
import { obtenerImagenProducto } from '@/lib/imagenesVariantes';
import { MessageCircle, Plus, Check } from 'lucide-react';

interface Props {
  producto: Producto;
  onVerDetalle: (producto: Producto) => void;
}

export function ProductoCard({ producto, onVerDetalle }: Props) {
  const { agregarProducto, consultarProductoDirecto } = useCarrito();
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<VarianteProducto | undefined>(
    producto.variantes && producto.variantes.length > 0 ? producto.variantes[0] : undefined
  );
  const [agregadoAnim, setAgregadoAnim] = useState(false);

  const handleAgregar = (e: React.MouseEvent) => {
    e.stopPropagation();
    agregarProducto(producto, varianteSeleccionada);
    setAgregadoAnim(true);
    setTimeout(() => setAgregadoAnim(false), 900);
  };

  const imagenActual = obtenerImagenProducto(producto, varianteSeleccionada);

  return (
    <div
      onClick={() => onVerDetalle(producto)}
      className="group bg-white overflow-hidden border border-neutral-200/90 hover:border-black transition-all duration-200 flex flex-col cursor-pointer relative"
    >
      {/* Imagen Principal */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        <img
          key={imagenActual}
          src={imagenActual}
          alt={producto.nombre}
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300 ease-out"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/hero-cyzone.jpg';
          }}
        />

        {/* Badges de Estado */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {producto.es_nuevo && (
            <span className="bg-black text-white text-[9px] font-bold px-2 py-0.5 tracking-widest uppercase">
              Nuevo
            </span>
          )}
          {producto.es_destacado && (
            <span className="bg-neutral-800 text-white text-[9px] font-semibold px-2 py-0.5 tracking-wider uppercase">
              Destacado
            </span>
          )}
        </div>

        {/* Badge de Tono Seleccionado sobre la imagen */}
        {varianteSeleccionada && (
          <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-xs text-white px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-sm pointer-events-none">
            {varianteSeleccionada.codigo_hex && (
              <span
                className="w-2 h-2 rounded-full border border-white/50 shrink-0"
                style={{ backgroundColor: varianteSeleccionada.codigo_hex }}
              />
            )}
            <span className="truncate max-w-[80px] sm:max-w-[100px]">{varianteSeleccionada.nombre}</span>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-3 bg-white">
        <div>
          {/* Marca & Referencia */}
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-0.5">
            <span className="truncate max-w-[90px] sm:max-w-none">{producto.marca?.nombre ?? 'LUKA'}</span>
            {producto.codigo_referencia && (
              <span className="font-mono text-neutral-400 font-normal text-[9px]">
                {producto.codigo_referencia}
              </span>
            )}
          </div>

          {/* Nombre */}
          <h3 className="font-semibold text-neutral-900 text-[11px] sm:text-xs md:text-sm line-clamp-2 leading-tight sm:leading-snug group-hover:text-neutral-600 transition-colors">
            {producto.nombre}
          </h3>

          {/* Swatches de Tonos si existen */}
          {producto.variantes && producto.variantes.length > 0 && (
            <div className="mt-1.5 sm:mt-2" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-neutral-500 mb-1">
                <span>Tono:</span>
                <span className="font-semibold text-neutral-800 truncate max-w-[80px] sm:max-w-[110px]">
                  {varianteSeleccionada?.nombre}
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                {producto.variantes.slice(0, 4).map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVarianteSeleccionada(v)}
                    title={v.nombre}
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border transition-all cursor-pointer ${
                      varianteSeleccionada?.id === v.id
                        ? 'ring-2 ring-black ring-offset-1 scale-110'
                        : 'border-black/20 hover:scale-105'
                    }`}
                    style={{ backgroundColor: v.codigo_hex ?? '#171717' }}
                  />
                ))}
                {producto.variantes.length > 4 && (
                  <span className="text-[9px] text-neutral-400 font-bold">
                    +{producto.variantes.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Acciones: Consultar Precio y Agregar a Lista */}
        <div className="pt-2 sm:pt-2.5 border-t border-neutral-100 flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              consultarProductoDirecto(producto, varianteSeleccionada);
            }}
            className="flex-1 min-w-0 flex items-center justify-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] font-bold py-2 sm:py-2.5 px-2 bg-black hover:bg-neutral-800 text-white transition-all uppercase tracking-wider min-h-[38px] sm:min-h-[40px] cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              <span className="sm:inline hidden">Consultar Precio</span>
              <span className="sm:hidden">Consultar</span>
            </span>
          </button>

          <button
            onClick={handleAgregar}
            title="Agregar a mi lista para consultar varios"
            className={`p-2 sm:p-2.5 min-w-[38px] min-h-[38px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center border transition-all shrink-0 cursor-pointer ${
              agregadoAnim
                ? 'bg-neutral-800 text-white border-neutral-800'
                : 'border-neutral-300 hover:border-black text-black bg-white'
            }`}
          >
            {agregadoAnim ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
