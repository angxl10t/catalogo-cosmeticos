'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ItemCarrito, Producto, VarianteProducto } from '@/types/catalogo';

interface CarritoContextType {
  items: ItemCarrito[];
  agregarProducto: (producto: Producto, variante?: VarianteProducto) => void;
  eliminarItem: (productoId: string, varianteId?: string) => void;
  cambiarCantidad: (productoId: string, cantidad: number, varianteId?: string) => void;
  totalItems: number;
  totalPrecio: number;
  limpiarCarrito: () => void;
  enviarPedidoWhatsApp: (telefono?: string) => void;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);

  // Cargar carrito de localStorage
  useEffect(() => {
    const guardado = localStorage.getItem('catalogo_carrito');
    if (guardado) {
      try {
        setItems(JSON.parse(guardado));
      } catch (e) {
        console.error('Error parseando carrito de storage', e);
      }
    }
  }, []);

  // Guardar cambios
  useEffect(() => {
    localStorage.setItem('catalogo_carrito', JSON.stringify(items));
  }, [items]);

  const agregarProducto = (producto: Producto, variante?: VarianteProducto) => {
    setItems((prev) => {
      const index = prev.findIndex(
        (it) => it.producto.id === producto.id && it.varianteSeleccionada?.id === variante?.id
      );

      if (index > -1) {
        const nuevo = [...prev];
        nuevo[index].cantidad += 1;
        return nuevo;
      }

      return [...prev, { producto, varianteSeleccionada: variante, cantidad: 1 }];
    });
  };

  const eliminarItem = (productoId: string, varianteId?: string) => {
    setItems((prev) =>
      prev.filter(
        (it) => !(it.producto.id === productoId && it.varianteSeleccionada?.id === varianteId)
      )
    );
  };

  const cambiarCantidad = (productoId: string, cantidad: number, varianteId?: string) => {
    if (cantidad <= 0) {
      eliminarItem(productoId, varianteId);
      return;
    }

    setItems((prev) =>
      prev.map((it) => {
        if (it.producto.id === productoId && it.varianteSeleccionada?.id === varianteId) {
          return { ...it, cantidad };
        }
        return it;
      })
    );
  };

  const limpiarCarrito = () => setItems([]);

  const totalItems = items.reduce((acc, it) => acc + it.cantidad, 0);

  const totalPrecio = items.reduce((acc, it) => {
    const precioBase = it.producto.precio_oferta ?? it.producto.precio_regular;
    const precioAdicional = it.varianteSeleccionada?.precio_adicional ?? 0;
    return acc + (precioBase + precioAdicional) * it.cantidad;
  }, 0);

  const enviarPedidoWhatsApp = (telefonoConfigurado?: string) => {
    const telefono = telefonoConfigurado || process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '51999999999';

    if (items.length === 0) return;

    let mensaje = `👋 *¡Hola! Deseo realizar un pedido desde su catálogo:*\n\n`;

    items.forEach((it, idx) => {
      const precioUnit = (it.producto.precio_oferta ?? it.producto.precio_regular) + (it.varianteSeleccionada?.precio_adicional ?? 0);
      const subtotal = precioUnit * it.cantidad;
      
      const marcaStr = it.producto.marca ? `[${it.producto.marca.nombre}] ` : '';
      const varianteStr = it.varianteSeleccionada ? ` - Tono/Opción: ${it.varianteSeleccionada.nombre}` : '';

      mensaje += `${idx + 1}. *${marcaStr}${it.producto.nombre}*${varianteStr}\n`;
      mensaje += `   • Cantidad: ${it.cantidad} x S/ ${precioUnit.toFixed(2)} = *S/ ${subtotal.toFixed(2)}*\n\n`;
    });

    mensaje += `💰 *TOTAL ESTIMADO: S/ ${totalPrecio.toFixed(2)}*\n\n`;
    mensaje += `¿Tienen disponibilidad para coordinar la entrega y el pago? Muchas gracias.`;

    const encoded = encodeURIComponent(mensaje);
    const url = `https://wa.me/${telefono}?text=${encoded}`;
    window.open(url, '_blank');
  };

  return (
    <CarritoContext.Provider
      value={{
        items,
        agregarProducto,
        eliminarItem,
        cambiarCantidad,
        totalItems,
        totalPrecio,
        limpiarCarrito,
        enviarPedidoWhatsApp,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider');
  }
  return ctx;
}
