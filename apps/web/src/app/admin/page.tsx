'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Producto, Marca, Categoria } from '@/types/catalogo';
import { ProductoFormModal } from '@/components/admin/ProductoFormModal';
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff,
  Search, 
  Phone, 
  Save,
  ShoppingBag
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);
  const [busqueda, setBusqueda] = useState<string>('');

  // Config WhatsApp
  const [whatsappPhone, setWhatsappPhone] = useState<string>('51997491793');
  const [guardandoPhone, setGuardandoPhone] = useState<boolean>(false);

  // Modal
  const [modalAbierto, setModalAbierto] = useState<boolean>(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);

  const cargarDatos = async () => {
    setCargando(true);
    if (!supabase) return;

    try {
      const [prodsRes, marcasRes, catsRes, configRes] = await Promise.all([
        supabase
          .from('productos')
          .select('*, marca:marcas(*), categoria:categorias(*), variantes:producto_variantes(*)')
          .order('created_at', { ascending: false })
          .limit(1000),
        supabase.from('marcas').select('*').order('nombre'),
        supabase.from('categorias').select('*').order('nombre'),
        supabase.from('configuracion_tienda').select('*').single(),
      ]);

      if (prodsRes.data) setProductos(prodsRes.data as Producto[]);
      if (marcasRes.data) setMarcas(marcasRes.data as Marca[]);
      if (catsRes.data) setCategorias(catsRes.data as Categoria[]);
      if (configRes.data) setWhatsappPhone(configRes.data.whatsapp_pedidos);
    } catch (e) {
      console.error('Error cargando admin data', e);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleToggleActivo = async (prod: Producto) => {
    const nuevoEstado = !prod.activo;

    setProductos((prev) =>
      prev.map((p) => (p.id === prod.id ? { ...p, activo: nuevoEstado } : p))
    );

    try {
      await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_activo', productoId: prod.id, activo: nuevoEstado }),
      });
    } catch {
      if (supabase) {
        await supabase.from('productos').update({ activo: nuevoEstado }).eq('id', prod.id);
      }
    }
  };

  const handleEliminarProducto = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto del catálogo?')) return;

    setProductos((prev) => prev.filter((p) => p.id !== id));

    try {
      await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', productoId: id }),
      });
    } catch {
      if (supabase) {
        await supabase.from('productos').delete().eq('id', id);
      }
    }
  };

  const handleGuardarTelefono = async () => {
    if (!supabase) return;
    setGuardandoPhone(true);
    try {
      await supabase
        .from('configuracion_tienda')
        .update({ whatsapp_pedidos: whatsappPhone })
        .eq('id', 1);
      alert('Número de WhatsApp actualizado con éxito.');
    } catch (e) {
      alert('Error actualizando teléfono');
    } finally {
      setGuardandoPhone(false);
    }
  };

  const productosFiltrados = productos.filter((p) =>
    `${p.nombre} ${p.codigo_referencia ?? ''} ${p.marca?.nombre ?? ''}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800">
      {/* Top Navbar */}
      <header className="bg-white sticky top-0 z-40 border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-base text-slate-900">Inventario & Productos</h1>
            <p className="text-xs text-slate-400">Gestiona precios, stock y variantes de tono en tiempo real.</p>
          </div>
          <button
            onClick={() => {
              setProductoSeleccionado(null);
              setModalAbierto(true);
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6 flex-1">
        {/* Barra de Ajuste de WhatsApp & Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Total Productos</span>
              <span className="text-xl font-extrabold text-slate-900">{productos.length}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Activos en Catálogo</span>
              <span className="text-xl font-extrabold text-slate-900">
                {productos.filter((p) => p.activo).length}
              </span>
            </div>
          </div>

          {/* Config WhatsApp Pedidos */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 flex-1">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-[11px] text-slate-400 font-medium block leading-none mb-1">
                  WhatsApp Pedidos
                </span>
                <input
                  type="text"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  className="w-full text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-green-600"
                />
              </div>
            </div>
            <button
              onClick={handleGuardarTelefono}
              disabled={guardandoPhone}
              className="bg-slate-900 hover:bg-slate-800 text-white p-2 rounded-xl text-xs font-semibold shrink-0"
              title="Guardar Teléfono"
            >
              <Save className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Buscador & Tabla de Productos */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          {/* Header de tabla */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="font-bold text-base text-slate-900">Inventario y Catálogo</h2>
              <p className="text-xs text-slate-400">
                Edita precios, variantes de tono y activa o desactiva productos al instante.
              </p>
            </div>

            <div className="w-full sm:w-72 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, código..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-xl text-xs border border-slate-200 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Producto</th>
                  <th className="py-3 px-4">Marca</th>
                  <th className="py-3 px-4">Precios</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Variantes</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cargando ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400">
                      Cargando productos de Supabase...
                    </td>
                  </tr>
                ) : productosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400">
                      No hay productos registrados con ese filtro.
                    </td>
                  </tr>
                ) : (
                  productosFiltrados.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Producto & Foto */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                            <img
                              src={prod.imagen_principal}
                              alt={prod.nombre}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate max-w-xs">
                              {prod.nombre}
                            </span>
                            <span className="text-[11px] text-slate-400 block">
                              Ref: {prod.codigo_referencia || 'S/N'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Marca */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                          {prod.marca?.nombre || 'General'}
                        </span>
                      </td>

                      {/* Precios */}
                      <td className="py-3 px-4">
                        <div>
                          {prod.precio_oferta ? (
                            <>
                              <span className="font-extrabold text-rose-600 block text-xs">
                                S/ {prod.precio_oferta.toFixed(2)}
                              </span>
                              <span className="text-[10px] text-slate-400 line-through">
                                S/ {prod.precio_regular.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="font-extrabold text-slate-900 text-xs">
                              S/ {prod.precio_regular.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold text-xs ${
                            prod.stock <= 3 ? 'text-rose-600' : 'text-slate-800'
                          }`}
                        >
                          {prod.stock} un.
                        </span>
                      </td>

                      {/* Variantes */}
                      <td className="py-3 px-4">
                        {prod.variantes && prod.variantes.length > 0 ? (
                          <div className="flex items-center gap-1">
                            {prod.variantes.slice(0, 3).map((v) => (
                              <span
                                key={v.id}
                                title={v.nombre}
                                className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                                style={{ backgroundColor: v.codigo_hex ?? '#ccc' }}
                              />
                            ))}
                            {prod.variantes.length > 3 && (
                              <span className="text-[10px] text-slate-400">
                                +{prod.variantes.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Estado */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleActivo(prod)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                            prod.activo
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                          }`}
                        >
                          {prod.activo ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          <span>{prod.activo ? 'Visible' : 'Pausado'}</span>
                        </button>
                      </td>

                      {/* Acciones */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setProductoSeleccionado(prod);
                              setModalAbierto(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEliminarProducto(prod.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal de Creación / Edición */}
      {modalAbierto && (
        <ProductoFormModal
          key={productoSeleccionado ? productoSeleccionado.id : 'nuevo'}
          abierto={modalAbierto}
          onCerrar={() => {
            setModalAbierto(false);
            setProductoSeleccionado(null);
          }}
          onGuardado={cargarDatos}
          productoEditar={productoSeleccionado}
          marcas={marcas}
          categorias={categorias}
        />
      )}
    </div>
  );
}
