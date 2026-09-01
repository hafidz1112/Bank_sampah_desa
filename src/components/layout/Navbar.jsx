import React, { useState } from 'react';
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
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Minimalist Aesthetic Brand */}
          <div
            onClick={() => handleNavClick('landing')}
            className="cursor-pointer group flex flex-col justify-center"
          >
            <div className="text-base sm:text-lg font-bold text-slate-950 tracking-tight leading-none group-hover:text-emerald-700 transition-colors">
              SI-BSDes Mekarjaya
            </div>
            <div className="text-[11px] text-slate-400 font-normal tracking-wide mt-1">
              Bank Sampah Desa Terintegrasi
            </div>
          </div>

          {/* Clean Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => handleNavClick('landing')}
              className={`px-3.5 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-colors ${
                activeTab === 'landing'
                  ? 'text-slate-950 font-semibold bg-slate-100/80'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Beranda
            </button>

            <button
              onClick={() => handleNavClick('katalog-public')}
              className={`px-3.5 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-colors ${
                activeTab === 'katalog-public'
                  ? 'text-slate-950 font-semibold bg-slate-100/80'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Katalog & Tarif
            </button>

            <button
              onClick={() => handleNavClick('sirkular')}
              className={`px-3.5 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-colors ${
                activeTab === 'sirkular'
                  ? 'text-slate-950 font-semibold bg-slate-100/80'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Sirkular Maggot
            </button>

            <button
              onClick={() => handleNavClick('portal-nasabah')}
              className={`px-3.5 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-colors ${
                activeTab === 'portal-nasabah'
                  ? 'text-slate-950 font-semibold bg-slate-100/80'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Cek Saldo Warga
            </button>
          </div>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center">
            {user ? (
              <button
                onClick={() => handleNavClick('admin')}
                className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  activeTab === 'admin'
                    ? 'bg-slate-950 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                }`}
              >
                Dashboard Pengurus
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium tracking-wide transition-colors"
              >
                Login Pengurus
              </button>
            )}
          </div>

          {/* Mobile Toggle Button */}
          <div className="flex items-center md:hidden gap-2">
            <button
              onClick={() => handleNavClick('portal-nasabah')}
              className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-medium"
            >
              Cek Saldo
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 rounded-md text-slate-700 hover:bg-slate-100 text-xs font-medium"
            >
              {mobileOpen ? 'Tutup' : 'Menu'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1 shadow-md">
          <button
            onClick={() => handleNavClick('landing')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
              activeTab === 'landing' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-600'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => handleNavClick('katalog-public')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
              activeTab === 'katalog-public' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-600'
            }`}
          >
            Katalog & Tarif
          </button>
          <button
            onClick={() => handleNavClick('sirkular')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
              activeTab === 'sirkular' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-600'
            }`}
          >
            Sirkular Maggot
          </button>
          <button
            onClick={() => handleNavClick('portal-nasabah')}
            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
              activeTab === 'portal-nasabah' ? 'bg-slate-100 text-slate-950 font-semibold' : 'text-slate-600'
            }`}
          >
            Cek Saldo Warga
          </button>

          <div className="pt-3 mt-2 border-t border-slate-100">
            {user ? (
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full py-2.5 rounded-lg bg-slate-950 text-white font-medium text-xs text-center"
              >
                Dashboard Pengurus
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenLogin();
                }}
                className="w-full py-2.5 rounded-lg bg-slate-900 text-white font-medium text-xs text-center"
              >
                Login Pengurus
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
