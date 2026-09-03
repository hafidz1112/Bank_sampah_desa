import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  ArrowRight, 
  Gamepad2, 
  BookOpen, 
  ChevronDown, 
  Sparkles, 
  Scale, 
  Search, 
  Layers,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar = ({ activeTab, setActiveTab, onOpenLogin }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [edukasiDropdownOpen, setEdukasiDropdownOpen] = useState(false);
  const edukasiDropdownRef = useRef(null);
  const { user } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (edukasiDropdownRef.current && !edukasiDropdownRef.current.contains(e.target)) {
        setEdukasiDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileOpen(false);
    setEdukasiDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePanduanClick = () => {
    setMobileOpen(false);
    setEdukasiDropdownOpen(false);
    if (activeTab !== 'landing') {
      setActiveTab('landing');
      setTimeout(() => {
        document.getElementById('panduan-warga')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      document.getElementById('panduan-warga')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isEdukasiActive = activeTab === 'sirkular' || activeTab === 'game-edukasi';

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

          {/* Desktop Navigation Links (Rapi & Ringkas dengan Dropdown Edukasi) */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => handleNavClick('landing')}
              className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors ${
                activeTab === 'landing'
                  ? 'text-slate-950 bg-slate-100 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Beranda
            </button>

            <button
              onClick={() => handleNavClick('katalog-public')}
              className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors ${
                activeTab === 'katalog-public'
                  ? 'text-slate-950 bg-slate-100 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Katalog & Tarif
            </button>

            <button
              onClick={() => handleNavClick('portal-nasabah')}
              className={`px-3.5 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-colors ${
                activeTab === 'portal-nasabah'
                  ? 'text-slate-950 bg-slate-100 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Cek Saldo Warga
            </button>

            {/* Dropdown Edukasi & Inovasi (Minimalis, Rapi, & Tidak Numpuk) */}
            <div className="relative" ref={edukasiDropdownRef}>
              <button
                type="button"
                onClick={() => setEdukasiDropdownOpen(!edukasiDropdownOpen)}
                className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  isEdukasiActive || edukasiDropdownOpen
                    ? 'text-emerald-950 bg-emerald-100/70 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>Edukasi</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-400 ${edukasiDropdownOpen ? 'rotate-180 text-emerald-700' : ''}`} />
              </button>

              {edukasiDropdownOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-52 bg-white rounded-xl p-1 shadow-lg border border-slate-200/90 z-50 animate-scale-in space-y-0.5">
                  <button
                    type="button"
                    onClick={handlePanduanClick}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-900 flex items-center gap-2.5 transition"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Panduan Warga</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEdukasiDropdownOpen(false);
                      handleNavClick('sirkular');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-2.5 ${
                      activeTab === 'sirkular'
                        ? 'bg-amber-50 text-amber-900 font-bold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-amber-900'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>Sirkular Maggot</span>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    type="button"
                    onClick={() => {
                      setEdukasiDropdownOpen(false);
                      handleNavClick('game-edukasi');
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center justify-between ${
                      activeTab === 'game-edukasi'
                        ? 'bg-emerald-50 text-emerald-900 font-bold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-900'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Gamepad2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Game Pilah</span>
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Game
                    </span>
                  </button>
                </div>
              )}
            </div>
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

      {/* Mobile Drawer (Clean, Flat, Ringkas) */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white px-4 py-3 space-y-1 shadow-xl animate-fade-in">
          <button
            onClick={() => handleNavClick('landing')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
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
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'katalog-public'
                ? 'bg-slate-100 text-slate-950 font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>Katalog & Tarif</span>
            {activeTab === 'katalog-public' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
          </button>

          <button
            onClick={() => handleNavClick('portal-nasabah')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'portal-nasabah'
                ? 'bg-slate-100 text-slate-950 font-bold'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>Cek Saldo Warga</span>
            {activeTab === 'portal-nasabah' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
          </button>

          <div className="pt-2 pb-0.5 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Edukasi
          </div>

          <button
            onClick={handlePanduanClick}
            className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>Panduan Alur Warga</span>
          </button>

          <button
            onClick={() => handleNavClick('sirkular')}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'sirkular' ? 'bg-amber-50 text-amber-950 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span>Sirkular Maggot BSF</span>
            </span>
            {activeTab === 'sirkular' && <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />}
          </button>

          <button
            onClick={() => handleNavClick('game-edukasi')}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'game-edukasi' ? 'bg-emerald-50 text-emerald-950 font-bold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Gamepad2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Game Pilah Sampah</span>
            </span>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
              Game
            </span>
          </button>

          {/* Login Pengurus */}
          <div className="pt-2.5 mt-1 border-t border-slate-100">
            {user ? (
              <button
                onClick={() => handleNavClick('admin')}
                className="w-full py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs text-center shadow-sm active:scale-98 transition"
              >
                Buka Dashboard Pengurus
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  onOpenLogin();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center shadow-sm active:scale-98 transition"
              >
                <span>Login Pengurus</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
