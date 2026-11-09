'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ItemCarrito, Producto, VarianteProducto } from '@/types/catalogo';

interface CarritoContextType {
  items: ItemCarrito[];
  agregarProducto: (producto: Producto, variante?: VarianteProducto) => void;
  eliminarItem: (productoId: string, varianteId?: string) => void;
  cambiarCantidad: (productoId: string, cantidad: number, varianteId?: string) => void;
  totalItems: number;
  limpiarCarrito: () => void;
  consultarWhatsApp: (telefono?: string) => void;
  consultarProductoDirecto: (producto: Producto, variante?: VarianteProducto) => void;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);

  useEffect(() => {
    const guardado = localStorage.getItem('catalogo_consulta_items');
    if (guardado) {
      try {
        setItems(JSON.parse(guardado));
      } catch (e) {
        console.error('Error parseando consulta de storage', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('catalogo_consulta_items', JSON.stringify(items));
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

  // Consulta consolidada por WhatsApp sin precios
  const consultarWhatsApp = (telefonoConfigurado?: string) => {
    const telefono = telefonoConfigurado || process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '51997491793';

    if (items.length === 0) return;

    let mensaje = `Hola, he revisado el catalogo online y deseo consultar disponibilidad y precio de los siguientes productos:\n\n`;

    items.forEach((it, idx) => {
      const marcaStr = it.producto.marca ? `[${it.producto.marca.nombre}] ` : '';
      const refStr = it.producto.codigo_referencia ? ` (Ref: ${it.producto.codigo_referencia})` : '';
      const varianteStr = it.varianteSeleccionada ? ` - Tono/Opcion: ${it.varianteSeleccionada.nombre}` : '';

      mensaje += `${idx + 1}. ${marcaStr}${it.producto.nombre}${refStr}${varianteStr}\n`;
      mensaje += `   Cantidad: ${it.cantidad} unidad(es)\n\n`;
    });

    mensaje += `Me podrian confirmar el precio actualizado y metodo de entrega? Muchas gracias.`;

    const encoded = encodeURIComponent(mensaje);
    const url = `https://wa.me/${telefono}?text=${encoded}`;
    window.open(url, '_blank');
  };

  // Consulta directa de un solo producto
  const consultarProductoDirecto = (producto: Producto, variante?: VarianteProducto) => {
    const telefono = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '51997491793';
    const marcaStr = producto.marca ? `[${producto.marca.nombre}] ` : '';
    const refStr = producto.codigo_referencia ? ` (Ref: ${producto.codigo_referencia})` : '';
    const varianteStr = variante ? ` en tono/opcion ${variante.nombre}` : '';

    const mensaje = `Hola, deseo consultar el precio y disponibilidad del producto: ${marcaStr}${producto.nombre}${refStr}${varianteStr}. Quedo atento a su respuesta, gracias.`;
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
        limpiarCarrito,
        consultarWhatsApp,
        consultarProductoDirecto,
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
