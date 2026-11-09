'use client';

import { useState } from 'react';
import { Producto, VarianteProducto } from '@/types/catalogo';
import { useCarrito } from '@/context/CarritoContext';
import { ShoppingBag, Check, Eye, Heart } from 'lucide-react';

interface Props {
  producto: Producto;
  onVerDetalle: (producto: Producto) => void;
}

export function ProductoCard({ producto, onVerDetalle }: Props) {
  const { agregarProducto } = useCarrito();
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<VarianteProducto | undefined>(
    producto.variantes && producto.variantes.length > 0 ? producto.variantes[0] : undefined
  );
  const [agregadoAnim, setAgregadoAnim] = useState(false);
  const [esFavorito, setEsFavorito] = useState(false);

  const tieneOferta = Boolean(producto.precio_oferta && producto.precio_oferta < producto.precio_regular);
  const precioActual = (producto.precio_oferta ?? producto.precio_regular) + (varianteSeleccionada?.precio_adicional ?? 0);
  const porcentajeDescuento = tieneOferta
    ? Math.round(((producto.precio_regular - (producto.precio_oferta ?? 0)) / producto.precio_regular) * 100)
    : 0;

  const handleAgregar = (e: React.MouseEvent) => {
    e.stopPropagation();
    agregarProducto(producto, varianteSeleccionada);
    setAgregadoAnim(true);
    setTimeout(() => setAgregadoAnim(false), 900);
  };

  const imagenActual = varianteSeleccionada?.imagen_url || producto.imagen_principal;

  return (
    <div
      onClick={() => onVerDetalle(producto)}
      className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Botón Favorito Estilo Cyzone */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setEsFavorito(!esFavorito);
        }}
        className={`absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
          esFavorito
            ? 'bg-rose-50 text-rose-600 shadow-sm'
            : 'bg-white/80 hover:bg-white text-slate-400 hover:text-rose-500 shadow-2xs'
        }`}
      >
        <Heart className={`w-4 h-4 ${esFavorito ? 'fill-rose-500 text-rose-500' : ''}`} />
      </button>

      {/* Imagen Principal con zoom suave */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-b from-rose-50/30 to-slate-50">
        <img
          src={imagenActual}
          alt={producto.nombre}
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Badges de Oferta y Studio Look al estilo Cyzone */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {tieneOferta && (
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-md uppercase tracking-wider">
              -{porcentajeDescuento}% OFF
            </span>
          )}
          {producto.es_nuevo && (
            <span className="bg-purple-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wide">
              Top Look
            </span>
          )}
        </div>

        {/* Vista rápida en hover */}
        <div className="absolute inset-x-0 bottom-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
          <span className="w-full bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-bold py-1.5 rounded-full shadow-md text-center flex items-center justify-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-rose-600" />
            <span>Ver detalles & swatches</span>
          </span>
        </div>
      </div>

      {/* Contenido / Datos del producto */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Marca / Línea */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-rose-600">
              {producto.marca?.nombre ?? 'CYZONE'}
            </span>
            {producto.codigo_referencia && (
              <span className="text-[9px] text-slate-400 font-mono">
                {producto.codigo_referencia}
              </span>
            )}
          </div>

          {/* Título de producto */}
          <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-rose-600 transition-colors">
            {producto.nombre}
          </h3>

          {/* Selector de Variantes / Swatches de color */}
          {producto.variantes && producto.variantes.length > 0 && (
            <div className="mt-2.5" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="text-slate-400 font-medium">Tono:</span>
                <span className="font-bold text-slate-700 truncate max-w-[110px]">
                  {varianteSeleccionada?.nombre}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {producto.variantes.slice(0, 5).map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVarianteSeleccionada(v)}
                    title={v.nombre}
                    className={`w-4 h-4 rounded-full border transition-all ${
                      varianteSeleccionada?.id === v.id
                        ? 'ring-2 ring-rose-500 ring-offset-1 scale-110'
                        : 'border-black/15 hover:scale-105'
                    }`}
                    style={{ backgroundColor: v.codigo_hex ?? '#e11d48' }}
                  />
                ))}
                {producto.variantes.length > 5 && (
                  <span className="text-[9px] text-slate-400 font-bold ml-0.5">
                    +{producto.variantes.length - 5}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Precios & Botón de Compra */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            {tieneOferta && (
              <span className="text-[11px] text-slate-400 line-through block leading-none font-medium">
                S/ {producto.precio_regular.toFixed(2)}
              </span>
            )}
            <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none block">
              S/ {precioActual.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAgregar}
            className={`flex items-center gap-1.5 text-xs font-bold py-2 px-3 sm:px-3.5 rounded-full transition-all shadow-xs active:scale-95 shrink-0 ${
              agregadoAnim
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
            }`}
          >
            {agregadoAnim ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">¡Listo!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
