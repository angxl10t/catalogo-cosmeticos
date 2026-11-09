'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Tag, Layers, ArrowLeft, Sparkles, LogOut, Menu, X } from 'lucide-react';
import { useAdminAuth } from '@/components/admin/AdminGuard';

const NAV_ITEMS = [
  { href: '/admin', label: 'Productos', icon: Package },
  { href: '/admin/promociones', label: 'Promociones', icon: Tag },
  { href: '/admin/marcas', label: 'Marcas', icon: Layers },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAdminAuth();
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  return (
    <>
      {/* Barra Superior Móvil (< md) */}
      <header className="md:hidden bg-slate-900 text-white border-b border-slate-800 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-extrabold text-sm text-white">
              LuKa<span className="text-blue-400">Admin</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Abrir menu de navegacion admin"
            >
              {menuMovilAbierto ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desplegable Móvil */}
        {menuMovilAbierto && (
          <nav className="mt-3 pt-3 border-t border-slate-800 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuMovilAbierto(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{label}</span>
                </Link>
              );
            })}

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <Link
                href="/"
                className="flex items-center gap-1.5 py-1.5 text-slate-400 hover:text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Ver Tienda</span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 py-1.5 text-rose-400 hover:text-rose-300"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Salir</span>
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Barra Lateral Escritorio (>= md) */}
      <aside className="hidden md:flex w-56 bg-slate-900 min-h-screen flex-col py-5 px-3 shrink-0 border-r border-slate-800">
        {/* Brand */}
        <div className="flex items-center gap-2 px-3 mb-6">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-white leading-none block">
              LuKa<span className="text-blue-400">Admin</span>
            </span>
            <span className="text-[9px] text-slate-500 leading-none">Cosméticos & Belleza</span>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer: Volver al Catálogo y Cerrar Sesión */}
        <div className="pt-3 border-t border-slate-800/80 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Ver Catálogo</span>
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
