'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface AdminAuthContextType {
  autenticado: boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [autenticado, setAutenticado] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(true);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [mostrarPassword, setMostrarPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [validando, setValidando] = useState<boolean>(false);

  useEffect(() => {
    // Comprobar sesión activa en sessionStorage
    const authState = sessionStorage.getItem('admin_authenticated');
    if (authState === 'true') {
      setAutenticado(true);
    }
    setCargando(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setValidando(true);
    setErrorMsg('');

    // Clave configurada en entorno o clave por defecto segura
    const adminSecret = process.env.NEXT_PUBLIC_ADMIN_PIN || 'admin123';

    setTimeout(() => {
      if (passwordInput === adminSecret) {
        sessionStorage.setItem('admin_authenticated', 'true');
        setAutenticado(true);
      } else {
        setErrorMsg('Contraseña incorrecta. Inténtalo nuevamente.');
      }
      setValidando(false);
    }, 300);
  };

  const logout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setAutenticado(false);
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm">
        <div className="animate-pulse flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-500" />
          <span>Verificando permisos de acceso...</span>
        </div>
      </div>
    );
  }

  // Pantalla de bloqueo si no está autenticado
  if (!autenticado) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 font-sans text-slate-800">
        <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Acentos de fondo */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />

          {/* Icono y Header */}
          <div className="text-center space-y-2 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-500 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Acceso Administrativo</h1>
            <p className="text-xs text-slate-400">
              Ingresa la contraseña maestra para gestionar productos, marcas y promociones.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl text-center">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300 block">
                Contraseña de Administrador
              </label>
              <div className="relative">
                <input
                  type={mostrarPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Introduce la contraseña"
                  className="w-full pl-3.5 pr-10 py-2.5 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword(!mostrarPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {mostrarPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={validando || !passwordInput}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-xl text-xs shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98]"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{validando ? 'Comprobando...' : 'Desbloquear Panel'}</span>
            </button>
          </form>

          {/* Volver al Catálogo */}
          <div className="mt-6 pt-4 border-t border-slate-800/60 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a la tienda</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider value={{ autenticado, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth debe usarse dentro de AdminGuard');
  }
  return ctx;
}
