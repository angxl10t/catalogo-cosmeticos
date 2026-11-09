'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Promocion } from '@/types/catalogo';
import { ChevronLeft, ChevronRight, Sparkles, Tag, ArrowRight } from 'lucide-react';

interface HeroBannerCarouselProps {
  promociones: Promocion[];
  onSeleccionarPromocion?: (promo: Promocion | null) => void;
}

interface BannerSlide {
  id: string;
  tipoSlide: 'DEFAULT' | 'PROMO';
  imageUrl: string;
  badge: string;
  titulo: string;
  subtitulo?: string;
  ctaText: string;
  promo?: Promocion;
}

export function HeroBannerCarousel({
  promociones,
  onSeleccionarPromocion,
}: HeroBannerCarouselProps) {
  const [slideActual, setSlideActual] = useState(0);
  const [pausado, setPausado] = useState(false);

  // Filtrar solo promociones activas y vigentes
  const promosActivas = promociones.filter((p) => {
    if (!p.activa) return false;
    const ahora = new Date();
    if (p.fecha_inicio && new Date(p.fecha_inicio) > ahora) return false;
    if (p.fecha_fin && new Date(p.fecha_fin) < ahora) return false;
    return true;
  });

  // Construir lista de slides:
  // Slide 0: Banner oficial de LuKa
  // Slide 1..N: Promociones activas (si las hay)
  const slides: BannerSlide[] = [
    {
      id: 'luka-hero-default',
      tipoSlide: 'DEFAULT',
      imageUrl: '/hero-cyzone.jpg',
      badge: 'LuKa • Catálogo Oficial de Campaña',
      titulo: 'Catálogo de Cosméticos, Perfumería y Belleza',
      subtitulo: 'Cyzone, Unique (Yanbal), Ésika, Natura, L\'BEL y Electro Hogar',
      ctaText: 'Ver Catálogo Completo',
    },
    ...promosActivas.map((p): BannerSlide => {
      // Determinar imagen: banner_url, o imagen del primer producto vinculado, o fallback
      const primerProductoImg = p.productos && p.productos[0]?.producto?.imagen_principal;
      const imagen = p.banner_url || primerProductoImg || '/hero-cyzone.jpg';

      // Badge según tipo
      let badge = 'Promoción Comercial';
      if (p.tipo === 'PORCENTAJE') {
        badge = `Oferta Especial • ${p.valor_descuento}% OFF`;
      } else if (p.tipo === 'MONTO_FIJO') {
        badge = `Descuento Directo • S/ ${p.valor_descuento.toFixed(2)} OFF`;
      } else if (p.tipo === 'DOS_POR_UNO') {
        badge = 'Oferta Exclusiva • 2×1';
      } else if (p.tipo === 'COMBO') {
        badge = 'Combo Especial LuKa';
      }

      // Subtítulo
      let subtitulo = 'Aprovecha esta campaña por tiempo limitado';
      const cantProductos = p.productos?.length || 0;
      if (cantProductos === 1 && p.productos?.[0]?.producto?.nombre) {
        subtitulo = `Aplica en: ${p.productos[0].producto.nombre}`;
      } else if (cantProductos > 1) {
        subtitulo = `${cantProductos} productos seleccionados participan en esta promoción`;
      } else {
        subtitulo = 'Promoción aplicable en catálogo LuKa';
      }

      return {
        id: p.id,
        tipoSlide: 'PROMO',
        imageUrl: imagen,
        badge,
        titulo: p.titulo,
        subtitulo,
        ctaText: 'Ver Productos en Promoción',
        promo: p,
      };
    }),
  ];

  const hayMultiplesSlides = slides.length > 1;

  const irASiguiente = useCallback(() => {
    setSlideActual((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const irAAnterior = useCallback(() => {
    setSlideActual((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Temporizador para auto-reproducir carrusel cada 5 segundos si hay más de 1 slide
  useEffect(() => {
    if (!hayMultiplesSlides || pausado) return;

    const intervalo = setInterval(() => {
      irASiguiente();
    }, 5200);

    return () => clearInterval(intervalo);
  }, [hayMultiplesSlides, pausado, irASiguiente]);

  // Si cambia el número de slides y el slide actual queda fuera de rango
  useEffect(() => {
    if (slideActual >= slides.length) {
      setSlideActual(0);
    }
  }, [slides.length, slideActual]);

  const handleCtaClick = (slide: BannerSlide) => {
    if (slide.tipoSlide === 'PROMO' && slide.promo) {
      if (onSeleccionarPromocion) {
        onSeleccionarPromocion(slide.promo);
      }
    } else {
      if (onSeleccionarPromocion) {
        onSeleccionarPromocion(null);
      }
    }

    const catalogoEl = document.getElementById('catalogo-seccion');
    if (catalogoEl) {
      catalogoEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="relative w-full bg-black overflow-hidden min-h-[290px] sm:min-h-[360px] md:min-h-[420px] max-h-[560px] aspect-[4/3] sm:aspect-[21/9] select-none"
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      aria-label="Carrusel de promociones y portada LuKa"
    >
      {/* Slides */}
      {slides.map((slide, index) => {
        const esActivo = index === slideActual;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              esActivo ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Imagen de Fondo */}
            <div className="relative w-full h-full bg-neutral-950">
              <Image
                src={slide.imageUrl}
                alt={slide.titulo}
                fill
                priority={index === 0}
                unoptimized={slide.imageUrl.startsWith('http')}
                className="object-cover object-center"
                sizes="100vw"
              />

              {/* Degradado oscuro para legibilidad impecable en desktop y móvil */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent sm:from-black/90 sm:via-black/60 sm:to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
            </div>

            {/* Contenido Editorial del Slide */}
            <div className="absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-8 md:p-12 text-white">
              {/* Badge superior */}
              <div className="flex items-center justify-between">
                <div className="bg-black/90 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase px-3 py-1.5 border border-white/20 flex items-center gap-2 shadow-xl">
                  {slide.tipoSlide === 'PROMO' ? (
                    <Tag className="w-3.5 h-3.5 text-blue-400" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-neutral-300" />
                  )}
                  <span>{slide.badge}</span>
                </div>

                {/* Contador de slides sutil si hay múltiples */}
                {hayMultiplesSlides && (
                  <div className="hidden sm:flex items-center gap-1.5 bg-black/70 backdrop-blur-md text-white/80 text-[11px] font-mono px-3 py-1 border border-white/10 rounded-full">
                    <span className="font-bold text-white">{slideActual + 1}</span>
                    <span className="text-white/40">/</span>
                    <span>{slides.length}</span>
                  </div>
                )}
              </div>

              {/* Título y llamado a la acción */}
              <div className="max-w-2xl space-y-2 sm:space-y-3 pb-2 sm:pb-0">
                <h2 className="text-lg sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md">
                  {slide.titulo}
                </h2>

                {slide.subtitulo && (
                  <p className="text-xs sm:text-sm md:text-base text-neutral-200 font-medium line-clamp-2 max-w-xl drop-shadow-sm">
                    {slide.subtitulo}
                  </p>
                )}

                <div className="pt-2 sm:pt-4">
                  <button
                    onClick={() => handleCtaClick(slide)}
                    className="inline-flex items-center gap-2 bg-white hover:bg-neutral-100 text-black font-extrabold uppercase tracking-widest text-[11px] sm:text-xs px-5 sm:px-8 py-2.5 sm:py-3.5 transition-all hover:scale-105 active:scale-95 shadow-2xl border border-neutral-200 cursor-pointer"
                  >
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Espacio inferior de alineación */}
              <div className="h-2" />
            </div>
          </div>
        );
      })}

      {/* Flechas de navegación (solo se muestran si hay más de 1 slide) */}
      {hayMultiplesSlides && (
        <>
          <button
            onClick={irAAnterior}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 backdrop-blur-xs transition-all hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
            title="Slide anterior"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={irASiguiente}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center border border-white/20 backdrop-blur-xs transition-all hover:scale-110 active:scale-95 shadow-xl cursor-pointer"
            title="Siguiente slide"
            aria-label="Siguiente slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Indicadores de barra / puntos inferiores */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {slides.map((slide, idx) => {
              const activo = idx === slideActual;
              return (
                <button
                  key={slide.id}
                  onClick={() => setSlideActual(idx)}
                  className={`h-1.5 transition-all rounded-full cursor-pointer ${
                    activo ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  title={`Ir al slide ${idx + 1}`}
                  aria-label={`Ir al slide ${idx + 1}`}
                />
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
