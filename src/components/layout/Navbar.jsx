import React, { useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ activeTab, setActiveTab, onOpenLogin }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand with Logo Kabupaten Kuningan */}
          <div
            onClick={() => handleNavClick('landing')}
            className="cursor-pointer group flex items-center gap-2.5 sm:gap-3 select-none"
          >
            <img 
              src="/kab_kuningan.png" 
              alt="Logo Kabupaten Kuningan" 
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-xs group-hover:scale-105 transition-transform flex-shrink-0"
            />
            <div className="flex flex-col justify-center min-w-0">
              <div className="text-sm sm:text-base lg:text-lg font-bold text-slate-950 tracking-tight leading-tight group-hover:text-emerald-700 transition-colors truncate">
                SI-BSDes Mekarjaya
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 font-normal tracking-tight sm:tracking-wide truncate">
                Bank Sampah Desa Terintegrasi
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            <button
              onClick={() => handleNavClick('landing')}
              className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors ${
                activeTab === 'landing'
                  ? 'text-slate-950 bg-slate-100 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Beranda
            </button>

            <button
              onClick={() => handleNavClick('katalog-public')}
              className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors ${
                activeTab === 'katalog-public'
                  ? 'text-slate-950 bg-slate-100 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Katalog & Tarif
            </button>

            <button
              onClick={() => handleNavClick('sirkular')}
              className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors ${
                activeTab === 'sirkular'
                  ? 'text-slate-950 bg-slate-100 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Sirkular Maggot
            </button>

            <button
              onClick={() => handleNavClick('portal-nasabah')}
              className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors ${
                activeTab === 'portal-nasabah'
                  ? 'text-slate-950 bg-slate-100 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Cek Saldo Warga
            </button>
          </div>

          {/* Right Action Button (Desktop) */}
          <div className="hidden md:flex items-center">
            {user ? (
              <button
                onClick={() => handleNavClick('admin')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all shadow-xs ${
                  activeTab === 'admin'
                    ? 'bg-slate-950 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                Dashboard Pengurus
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold tracking-wide transition-colors shadow-xs"
              >
                Login Pengurus
              </button>
            )}
          </div>

          {/* Mobile Actions: Quick Saldo Button + Clean Hamburger */}
          <div className="flex items-center md:hidden gap-1.5">
            <button
              onClick={() => handleNavClick('portal-nasabah')}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/70 active:scale-95 transition-transform"
            >
              Cek Saldo
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Menu"
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Clean, touch-friendly, standard typography) */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white px-4 pt-3 pb-6 space-y-1.5 shadow-xl animate-fade-in">
          <button
            onClick={() => handleNavClick('landing')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === 'landing'
                ? 'bg-slate-100 text-slate-950 font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>Beranda</span>
            {activeTab === 'landing' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
          </button>

          <button
            onClick={() => handleNavClick('katalog-public')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === 'katalog-public'
                ? 'bg-slate-100 text-slate-950 font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>Katalog & Tarif Sampah</span>
            {activeTab === 'katalog-public' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
          </button>

          <button
            onClick={() => handleNavClick('sirkular')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === 'sirkular'
                ? 'bg-slate-100 text-slate-950 font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>Sirkular Maggot BSF</span>
            {activeTab === 'sirkular' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
          </button>

          <button
            onClick={() => handleNavClick('portal-nasabah')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === 'portal-nasabah'
                ? 'bg-slate-100 text-slate-950 font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>Cek Saldo Warga (Buku Tabungan)</span>
            {activeTab === 'portal-nasabah' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
          </button>

          <div className="pt-3 mt-2 border-t border-slate-100">
            {user ? (
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full py-3 rounded-xl bg-slate-950 text-white font-bold text-sm text-center shadow-sm active:scale-98 transition"
              >
                Buka Dashboard Pengurus
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenLogin();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm text-center shadow-sm active:scale-98 transition"
              >
                <span>Login Pengurus</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
