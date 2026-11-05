'use client';

import { useState } from 'react';
import { Producto, VarianteProducto } from '@/types/catalogo';
import { useCarrito } from '@/context/CarritoContext';
import { ShoppingBag, Check } from 'lucide-react';

export function ProductoCard({ producto }: { producto: Producto }) {
  const { agregarProducto } = useCarrito();
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<VarianteProducto | undefined>(
    producto.variantes && producto.variantes.length > 0 ? producto.variantes[0] : undefined
  );
  const [agregadoAnim, setAgregadoAnim] = useState(false);

  const tieneOferta = Boolean(producto.precio_oferta && producto.precio_oferta < producto.precio_regular);
  const precioActual = (producto.precio_oferta ?? producto.precio_regular) + (varianteSeleccionada?.precio_adicional ?? 0);

  const handleAgregar = () => {
    agregarProducto(producto, varianteSeleccionada);
    setAgregadoAnim(true);
    setTimeout(() => setAgregadoAnim(false), 900);
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Imagen Principal */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
        <img
          src={varianteSeleccionada?.imagen_url || producto.imagen_principal}
          alt={producto.nombre}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges de Oferta o Nuevo */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {tieneOferta && (
            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wide">
              Oferta
            </span>
          )}
          {producto.es_nuevo && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wide">
              Nuevo
            </span>
          )}
        </div>
      </div>

      {/* Contenido / Datos */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Marca */}
          {producto.marca && (
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              {producto.marca.nombre}
            </span>
          )}

          {/* Título */}
          <h3 className="font-semibold text-slate-800 text-sm mt-0.5 line-clamp-2 leading-snug">
            {producto.nombre}
          </h3>

          {/* Selector de Variantes / Tonos si tiene */}
          {producto.variantes && producto.variantes.length > 0 && (
            <div className="mt-2.5">
              <span className="text-[10px] text-slate-400 font-medium block mb-1">
                Tono / Variedad: <strong className="text-slate-700">{varianteSeleccionada?.nombre}</strong>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {producto.variantes.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVarianteSeleccionada(v)}
                    title={v.nombre}
                    className={`h-5 px-2 rounded-full text-[10px] font-medium flex items-center gap-1 border transition-all ${
                      varianteSeleccionada?.id === v.id
                        ? 'border-blue-600 ring-1 ring-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                    }`}
                  >
                    {v.codigo_hex && (
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/15 inline-block shrink-0"
                        style={{ backgroundColor: v.codigo_hex }}
                      />
                    )}
                    <span>{v.nombre}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Precios & Botón Agregar */}
        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
          <div>
            {tieneOferta && (
              <span className="text-xs text-slate-400 line-through block leading-none">
                S/ {producto.precio_regular.toFixed(2)}
              </span>
            )}
            <span className="text-base font-extrabold text-slate-900">
              S/ {precioActual.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleAgregar}
            className={`flex items-center gap-1.5 text-xs font-semibold py-2 px-3.5 rounded-xl transition-all active:scale-95 ${
              agregadoAnim
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
            }`}
          >
            {agregadoAnim ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Agregado</span>
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
