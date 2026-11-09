'use client';

import { useState } from 'react';
import { Producto, VarianteProducto } from '@/types/catalogo';
import { useCarrito } from '@/context/CarritoContext';
import { ShoppingBag, Check } from 'lucide-react';

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
      className="group bg-white overflow-hidden border border-neutral-200/80 hover:border-black transition-all duration-200 flex flex-col cursor-pointer relative"
    >
      {/* Imagen Principal */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        <img
          src={imagenActual}
          alt={producto.nombre}
          className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-300 ease-out"
          loading="lazy"
        />

        {/* Badges de Descuento estilo editorial */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {tieneOferta && (
            <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 tracking-wider uppercase">
              -{porcentajeDescuento}%
            </span>
          )}
          {producto.es_nuevo && (
            <span className="bg-neutral-800 text-white text-[10px] font-medium px-2 py-0.5 tracking-wide uppercase">
              Nuevo
            </span>
          )}
        </div>
      </div>

      {/* Contenido / Datos del producto */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5 bg-white">
        <div>
          {/* Marca */}
          <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-0.5">
            {producto.marca?.nombre ?? 'CYZONE'}
          </div>

          {/* Nombre */}
          <h3 className="font-semibold text-neutral-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-neutral-600 transition-colors">
            {producto.nombre}
          </h3>

          {/* Swatches de Tonos si existen */}
          {producto.variantes && producto.variantes.length > 0 && (
            <div className="mt-2" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-1.5 flex-wrap">
                {producto.variantes.slice(0, 5).map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVarianteSeleccionada(v)}
                    title={v.nombre}
                    className={`w-3.5 h-3.5 rounded-full border transition-all ${
                      varianteSeleccionada?.id === v.id
                        ? 'ring-2 ring-black ring-offset-1 scale-110'
                        : 'border-black/20 hover:scale-105'
                    }`}
                    style={{ backgroundColor: v.codigo_hex ?? '#171717' }}
                  />
                ))}
                {producto.variantes.length > 5 && (
                  <span className="text-[9px] text-neutral-400 font-bold">
                    +{producto.variantes.length - 5}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Precios & Botón de Compra */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
          <div>
            {tieneOferta && (
              <span className="text-[11px] text-neutral-400 line-through block leading-none">
                S/ {producto.precio_regular.toFixed(2)}
              </span>
            )}
            <span className="text-sm sm:text-base font-extrabold text-black tracking-tight leading-none block">
              S/ {precioActual.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAgregar}
            className={`flex items-center gap-1 text-[11px] font-bold py-2 px-3 rounded-none transition-all active:scale-95 shrink-0 uppercase tracking-wider ${
              agregadoAnim
                ? 'bg-neutral-800 text-white'
                : 'bg-black hover:bg-neutral-800 text-white'
            }`}
          >
            {agregadoAnim ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Listo</span>
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
