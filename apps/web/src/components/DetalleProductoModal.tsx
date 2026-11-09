'use client';

import { useState, useEffect } from 'react';
import { Producto, VarianteProducto } from '@/types/catalogo';
import { useCarrito } from '@/context/CarritoContext';
import { 
  X, 
  MessageCircle, 
  Plus, 
  Check, 
  Share2, 
  CheckCheck, 
  ShieldCheck, 
  Truck, 
  Sparkles,
  Minus
} from 'lucide-react';

interface Props {
  producto: Producto | null;
  abierto: boolean;
  onCerrar: () => void;
  productosRelacionados?: Producto[];
  onSeleccionarRelacionado?: (producto: Producto) => void;
}

export function DetalleProductoModal({ 
  producto, 
  abierto, 
  onCerrar,
  productosRelacionados = [],
  onSeleccionarRelacionado,
}: Props) {
  const { agregarProducto } = useCarrito();
  const [varianteSeleccionada, setVarianteSeleccionada] = useState<VarianteProducto | undefined>(undefined);
  const [cantidad, setCantidad] = useState(1);
  const [agregadoAnim, setAgregadoAnim] = useState(false);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (producto?.variantes && producto.variantes.length > 0) {
      setVarianteSeleccionada(producto.variantes[0]);
    } else {
      setVarianteSeleccionada(undefined);
    }
    setCantidad(1);
  }, [producto]);

  if (!abierto || !producto) return null;

  const handleAgregar = () => {
    for (let i = 0; i < cantidad; i++) {
      agregarProducto(producto, varianteSeleccionada);
    }
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

  const handleConsultarWhatsAppDirecto = () => {
    const telefono = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '51997491793';
    let mensaje = `¡Hola LuKa! Me interesa consultar el precio y disponibilidad de campaña de este producto:\n\n`;
    mensaje += `*Producto:* ${producto.nombre}\n`;
    if (cantidad > 1) {
      mensaje += `*Cantidad deseada:* ${cantidad} unidades\n`;
    }
    if (producto.marca?.nombre) {
      mensaje += `*Marca:* ${producto.marca.nombre}\n`;
    }
    if (varianteSeleccionada) {
      mensaje += `*Tono/Variante seleccionada:* ${varianteSeleccionada.nombre}\n`;
    }
    if (producto.codigo_referencia) {
      mensaje += `*Referencia catálogo:* ${producto.codigo_referencia}\n`;
    }
    mensaje += `\n¿Podrían brindarme el precio oficial y detalles de entrega? Muchas gracias.`;

    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  const imagenMostrar = varianteSeleccionada?.imagen_url || producto.imagen_principal;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onCerrar} />

      <div className="relative bg-white max-w-xl w-full max-h-[94vh] sm:max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-neutral-200 z-10 text-neutral-900 rounded-none sm:rounded-xs">
        {/* Barra superior flotante de acciones rápidas */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
          <button
            onClick={handleCompartir}
            title="Copiar enlace de este producto"
            className="p-2 bg-white/95 backdrop-blur-xs text-black border border-neutral-300 hover:bg-neutral-100 transition-all flex items-center gap-1 text-xs font-semibold shadow-xs cursor-pointer"
            aria-label="Compartir producto"
          >
            {copiado ? <CheckCheck className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline text-[11px]">{copiado ? 'Enlace copiado' : 'Compartir'}</span>
          </button>

          <button
            onClick={onCerrar}
            className="p-2 bg-white/95 backdrop-blur-xs text-black border border-neutral-300 hover:bg-neutral-100 transition-all shadow-xs cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cuerpo del Producto Scrolleable */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
          {/* Imagen Principal */}
          <div className="relative aspect-square w-full bg-neutral-100 border border-neutral-200 overflow-hidden">
            <img
              src={imagenMostrar}
              alt={producto.nombre}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/hero-cyzone.jpg';
              }}
            />
            {producto.es_destacado && (
              <span className="absolute bottom-3 left-3 bg-black text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 shadow-md">
                Destacado LuKa
              </span>
            )}
            {producto.es_nuevo && (
              <span className="absolute top-3 left-3 bg-neutral-900 text-white text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 shadow-md">
                Nuevo Lanzamiento
              </span>
            )}
          </div>

          {/* Info Principal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-900">
                  {producto.marca?.nombre ?? 'LuKa'}
                </span>
                <span className="text-[10px] text-neutral-400 font-medium border-l border-neutral-300 pl-2">
                  Catálogo Oficial
                </span>
              </div>
              {producto.codigo_referencia && (
                <span className="text-[11px] text-neutral-400 font-mono">
                  REF: {producto.codigo_referencia}
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-2xl font-black tracking-tight text-black leading-tight sm:leading-snug">
              {producto.nombre}
            </h2>

            {/* Aviso de Precios por WhatsApp */}
            <div className="p-3 bg-neutral-50 border border-neutral-200 text-xs text-neutral-700 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <span className="font-medium text-neutral-500">Precio y promociones de campaña:</span>
              <span className="font-black text-black uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Coordinar con LuKa por WhatsApp
              </span>
            </div>
          </div>

          {/* Selector de Tonos / Variantes si existen */}
          {producto.variantes && producto.variantes.length > 0 && (
            <div className="p-3.5 sm:p-4 bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-700 uppercase tracking-wider text-[10px]">
                  Tono o Variante Seleccionada:
                </span>
                <span className="font-black text-black">
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
                      className={`flex items-center gap-2 py-1.5 px-3 text-xs font-semibold border transition-all cursor-pointer ${
                        esActivo
                          ? 'border-black bg-black text-white shadow-xs'
                          : 'border-neutral-300 bg-white text-neutral-800 hover:border-black'
                      }`}
                    >
                      {v.codigo_hex && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-neutral-300 shrink-0"
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

          {/* Selector de Cantidad Ergonomico */}
          <div className="flex items-center justify-between p-3 border border-neutral-200 bg-white">
            <div>
              <span className="text-xs font-bold text-neutral-800 block">Cantidad a consultar:</span>
              <span className="text-[10px] text-neutral-500 font-medium">Unidades para cotizar en tu lista</span>
            </div>
            <div className="flex items-center border border-neutral-300 bg-neutral-50">
              <button
                type="button"
                onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
                className="w-8 h-8 flex items-center justify-center text-neutral-700 hover:text-black font-bold text-sm hover:bg-neutral-200 transition-colors cursor-pointer"
                aria-label="Restar una unidad"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-xs font-black text-neutral-900 select-none">
                {cantidad}
              </span>
              <button
                type="button"
                onClick={() => setCantidad((prev) => prev + 1)}
                className="w-8 h-8 flex items-center justify-center text-neutral-700 hover:text-black font-bold text-sm hover:bg-neutral-200 transition-colors cursor-pointer"
                aria-label="Sumar una unidad"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Descripción del Producto */}
          {producto.descripcion && (
            <div className="space-y-1 pt-1 border-t border-neutral-100">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Detalles del Producto
              </h4>
              <p className="text-xs text-neutral-700 leading-relaxed font-normal">
                {producto.descripcion}
              </p>
            </div>
          )}

          {/* Productos Relacionados */}
          {productosRelacionados && productosRelacionados.length > 0 && (
            <div className="pt-3 border-t border-neutral-100 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                Más de {producto.marca?.nombre ?? 'esta categoría'}
              </span>
              <div className="grid grid-cols-3 gap-2">
                {productosRelacionados.slice(0, 3).map((rel) => (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => onSeleccionarRelacionado && onSeleccionarRelacionado(rel)}
                    className="text-left border border-neutral-200 hover:border-black p-1.5 transition-all bg-white group/rel cursor-pointer"
                  >
                    <div className="aspect-square w-full bg-neutral-100 overflow-hidden mb-1">
                      <img
                        src={rel.imagen_principal}
                        alt={rel.nombre}
                        className="w-full h-full object-cover group-hover/rel:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[8px] font-bold text-neutral-400 uppercase block truncate">
                      {rel.marca?.nombre}
                    </span>
                    <span className="text-[10px] font-semibold text-neutral-900 line-clamp-1 block leading-tight">
                      {rel.nombre}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pilares de Confianza LuKa */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 text-[10px] text-neutral-600">
            <div className="flex items-center gap-1.5 p-2 bg-neutral-50 border border-neutral-200/80">
              <ShieldCheck className="w-4 h-4 text-black shrink-0" />
              <span>100% Original de Catálogo</span>
            </div>
            <div className="flex items-center gap-1.5 p-2 bg-neutral-50 border border-neutral-200/80">
              <Truck className="w-4 h-4 text-black shrink-0" />
              <span>Envíos a todo el Perú</span>
            </div>
          </div>
        </div>

        {/* Footer Actions Ergonómico */}
        <div className="p-3.5 sm:p-5 bg-neutral-50 border-t border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={handleAgregar}
            className={`flex-1 flex items-center justify-center gap-2 font-bold py-3 px-4 text-xs tracking-wider uppercase border transition-all cursor-pointer min-h-[44px] ${
              agregadoAnim
                ? 'bg-neutral-800 text-white border-neutral-800'
                : 'bg-white border-black text-black hover:bg-neutral-100'
            }`}
          >
            {agregadoAnim ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Agregado ({cantidad})</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Agregar a mi Lista {cantidad > 1 ? `(${cantidad})` : ''}</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              onCerrar();
              handleConsultarWhatsAppDirecto();
            }}
            className="flex-1 flex items-center justify-center gap-2 bg-black hover:bg-neutral-800 text-white font-bold py-3 px-5 text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer min-h-[44px] active:scale-98"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
            <span>Consultar por WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
