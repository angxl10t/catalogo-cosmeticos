export interface Marca {
  id: string;
  nombre: string;
  slug: string;
  categoria_principal: 'COSMETICOS' | 'ELECTRO';
  logo_url?: string;
  activo: boolean;
}

export interface Categoria {
  id: string;
  nombre: string;
  slug: string;
  icono?: string;
  descripcion?: string;
}

export interface VarianteProducto {
  id: string;
  producto_id: string;
  nombre: string;
  codigo_tono?: string;
  codigo_hex?: string;
  imagen_url?: string;
  stock: number;
  precio_adicional?: number;
}

export interface Producto {
  id: string;
  codigo_referencia?: string;
  nombre: string;
  slug: string;
  descripcion?: string;
  marca?: Marca;
  categoria?: Categoria;
  marca_id?: string;
  categoria_id?: string;
  precio_regular: number;
  precio_oferta?: number;
  stock: number;
  es_destacado: boolean;
  es_nuevo: boolean;
  activo: boolean;
  imagen_principal: string;
  galeria_imagenes: string[];
  variantes?: VarianteProducto[];
}

export interface ItemCarrito {
  producto: Producto;
  varianteSeleccionada?: VarianteProducto;
  cantidad: number;
}
