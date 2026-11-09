'use client';

import { useState } from 'react';
import { Producto, VarianteProducto } from '@/types/catalogo';
import { useCarrito } from '@/context/CarritoContext';
import { ShoppingBag, Check, Eye } from 'lucide-react';

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
      className="group bg-white rounded-3xl overflow-hidden border border-slate-100/80 shadow-xs hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Imagen Principal */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
        <img
          src={imagenActual}
          alt={producto.nombre}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Badges de Oferta o Nuevo */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {tieneOferta && (
            <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider">
              -{porcentajeDescuento}% OFF
            </span>
          )}
          {producto.es_nuevo && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wide">
              Nuevo
            </span>
          )}
        </div>

        {/* Overlay Botón Ver Detalle en Hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-white/90 backdrop-blur-xs text-slate-900 text-xs font-bold py-1.5 px-3 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Ver detalle</span>
          </span>
        </div>
      </div>

      {/* Contenido / Datos */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Marca */}
          {producto.marca && (
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded-md inline-block mb-1">
              {producto.marca.nombre}
            </span>
          )}

          {/* Título */}
          <h3 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {producto.nombre}
          </h3>

          {/* Selector de Variantes / Tonos si tiene */}
          {producto.variantes && producto.variantes.length > 0 && (
            <div className="mt-2" onClick={(e) => e.stopPropagation()}>
              <span className="text-[10px] text-slate-400 font-medium block mb-1 truncate">
                Tono: <strong className="text-slate-700">{varianteSeleccionada?.nombre}</strong>
              </span>
              <div className="flex flex-wrap gap-1">
                {producto.variantes.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVarianteSeleccionada(v)}
                    title={v.nombre}
                    className={`h-5 px-1.5 rounded-full text-[9px] font-medium flex items-center gap-1 border transition-all ${
                      varianteSeleccionada?.id === v.id
                        ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50 text-blue-700 font-bold'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                    }`}
                  >
                    {v.codigo_hex && (
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/15 inline-block shrink-0"
                        style={{ backgroundColor: v.codigo_hex }}
                      />
                    )}
                    <span className="max-w-[70px] truncate">{v.nombre}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Precios & Botón Agregar */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            {tieneOferta && (
              <span className="text-[11px] text-slate-400 line-through block leading-none">
                S/ {producto.precio_regular.toFixed(2)}
              </span>
            )}
            <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
              S/ {precioActual.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAgregar}
            className={`flex items-center gap-1 text-[11px] font-bold py-2 px-3 rounded-xl transition-all shadow-xs active:scale-95 shrink-0 ${
              agregadoAnim
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-slate-900 hover:bg-blue-600 text-white'
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
