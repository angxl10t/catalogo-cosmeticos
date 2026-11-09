---
name: ecommerce-beauty-ui-ux
description: Guía y sistema de diseño visual de alta fidelidad especializado en e-commerce y catálogos de cosméticos, belleza y electrodomésticos (Cyzone, Unique, Ésika, Natura). Define directrices de layout, microinteracciones, jerarquía tipográfica, estética moderna (Fintech/Beauty Minimal), ergonomía móvil, tarjetas de producto con swatches de tono y checkout ágil por WhatsApp.
---

# Sistema de Diseño UI/UX: Catálogo Cosméticos & Hogar

Este skill define los estándares estéticos, directrices de interacción y tokens visuales para el Catálogo Web y la Aplicación Móvil en Flutter.

---

## 1. Arquetipo & Voz Visual de Marca
- **Esencia:** *Beauty Modernism & Frictionless Shopping*. Limpio, luminoso, aspiracional y altamente legible en dispositivos móviles de cualquier gama.
- **Enfoque:** Orientado a la conversión rápida (navegación visual tipo feed + cierre directo por WhatsApp).
- **Fotografía & Productos:** Foco absoluto en la textura del producto, swatches de color real y jerarquía de precios (destacando ofertas en tonos energéticos pero sofisticados).

---

## 2. Paleta de Color & Tokens Semánticos

### A. Superficies & Fondos (Light Canvas Principal)
- **Fondo Base (Page Canvas):** `#F8FAFC` (Slate 50) o `#FAF9F6` (Porcelain Warm) para evitar blanco puro estridente.
- **Tarjetas & Contenedores:** `#FFFFFF` (Pure White) con bordes ultra sutiles `#F1F5F9` o `#E2E8F0` (1px clean border).
- **Elevación / Sombras:** `box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);` (sombras suaves, difusas, nunca negras o pesadas).

### B. Colores Primarios y Acento
- **Primary Rose-Plum (Acento Cosméticos):** `#E11D48` (Rose 600) / `#BE123C` (Rose 700) para ofertas, badges de liquidación y botones de compra femenina.
- **Electric Cobalt (Identidad Admin & Confianza):** `#2563EB` (Blue 600) / `#1D4ED8` (Blue 700) para llamadas a la acción primarias y estados seleccionados.
- **WhatsApp Emerald (Conversión & Pedidos):** `#16A34A` (Green 600) / `#15803D` (Green 700) con glow suave para el botón de pedido final.
- **Slate Text Hierarchy:**
  - Títulos principales: `#0F172A` (Slate 900) con peso `font-black` o `font-extrabold`.
  - Nombres de producto & precios: `#1E293B` (Slate 800) `font-bold`.
  - Marcas / Categorías: `#64748B` (Slate 500) `text-xs uppercase tracking-wider font-semibold`.

---

## 3. Tipografía & Jerarquía de Información
1. **Titulares, Banners & Precios:** `Outfit` o `Inter` (`font-bold` / `font-extrabold`). Números en cifras tabulares para evitar saltos de línea al sumar precios.
2. **Cuerpo, Etiquetas & Filtros:** `Plus Jakarta Sans` o `Inter` (`font-medium` / `font-semibold`).
3. **Escala de Texto en Móvil:**
   - Precios actuales: `16px - 18px` (`font-black`).
   - Precios tachados de oferta: `12px` (`text-slate-400 line-through`).
   - Nombre de producto: `13px - 14px` (`line-clamp-2` con `leading-snug`).
   - Variantes / Tonos: `10px - 11px` con muestras de color circulares (`14px` de diámetro con borde contrastante).

---

## 4. Ergonomía de Componentes E-Commerce

### Tarjetas de Producto (Product Cards)
- **Proporción de Imagen:** `aspect-square` (1:1) con `object-cover` y zoom suave en hover (`scale-105` con transición de 400ms).
- **Selector Rápido de Tono:** Si el producto cuenta con tonos (labiales, bases, esmaltes), mostrar chips circulares o píldoras con swatch de color (`#HEX`) seleccionable directamente en la tarjeta sin forzar a entrar al detalle.
- **Badge de Estado:**
  - *Oferta:* Pastilla roja/rosada `bg-rose-500 text-white font-extrabold text-[10px]`.
  - *Nuevo:* Pastilla azul `bg-blue-600 text-white font-bold text-[10px]`.
  - *Poco Stock:* `text-amber-600 font-semibold text-[10px]` para generar urgencia.

### Carrito & Checkout por WhatsApp
- **Drawer Lateral / Bottom Sheet:** Acceso visible con contador de badge flotante.
- **Formateo de Mensaje:** Cada producto debe desglosar marca, nombre, tono elegido, cantidad y subtotal en Soles (`S/`).
- **Botón Flotante (Sticky Bottom Bar en Móvil):** Si hay ítems en el carrito, una barra inferior con el total y botón directo "Pedir por WhatsApp" facilita la compra sin necesidad de buscar el carrito arriba.

---

## 5. Reglas de Responsive & Rendimiento
- **Lazy Loading de Imágenes:** Usar `loading="lazy"` o componentes de optimización con fallback suave para fotos pesadas de catálogo.
- **Filtros Horizontales Sticky:** Las píldoras de marcas (Cyzone, Unique, Ésika, Natura, Electro) deben tener scroll horizontal táctil con `scrollbar-none` y feedback táctil instantáneo (`active:scale-95`).
