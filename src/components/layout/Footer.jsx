import React from 'react';
import { MapPin, Heart, BookOpen, Shield, ArrowRight, ExternalLink } from 'lucide-react';
import { MAGGOT_MONITORING_URL } from '../../lib/utils';

export const Footer = ({ onOpenLogin }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-10 sm:pt-14 pb-6 sm:pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Brand & Location */}
          <div className="space-y-3 sm:space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <img 
                src="/kab_kuningan.png" 
                alt="Logo Kabupaten Kuningan" 
                className="w-10 h-10 object-contain drop-shadow-sm flex-shrink-0"
              />
              <div>
                <span className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                  SI-BSDes <span className="text-emerald-400">Mekarjaya</span>
                </span>
                <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Sistem Informasi Bank Sampah Desa Terintegrasi</p>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              Platform tata kelola bank sampah digital dan ekosistem ekonomi sirkular terpadu: memadukan penimbangan sampah anorganik berbayar dengan biokonversi sampah organik Maggot BSF guna mendukung efisiensi pakan bebek petelur BUMDes Mekarjaya.
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1 text-[11px] sm:text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-emerald-300 border border-slate-700">
                <MapPin className="w-3 h-3 text-emerald-400" /> Dusun Cimenang
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-emerald-300 border border-slate-700">
                <MapPin className="w-3 h-3 text-emerald-400" /> Dusun Ciganda
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-emerald-300 border border-slate-700">
                <MapPin className="w-3 h-3 text-emerald-400" /> Dusun Cimuda
              </span>
            </div>
          </div>

          {/* Program & Kampus */}
          <div className="space-y-2.5 sm:space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Program Kerja KKM
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs text-slate-400">
              <li>• KKM Universitas Muhammadiyah Cirebon 2026</li>
              <li>• Program Studi Teknik Informatika</li>
              <li>• Lokasi: Desa Mekarjaya, Ciawigebang</li>
              <li>
                • Mitra: <a href={MAGGOT_MONITORING_URL} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline font-semibold">Web Monitoring Maggot ↗</a>
              </li>
            </ul>
          </div>

          {/* Admin Link */}
          <div className="space-y-2.5 sm:space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Akses Pengurus
            </h4>
            <div>
              <button
                onClick={onOpenLogin}
                className="w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 transition text-xs font-semibold min-h-[44px]"
              >
                <span>Login Karang Taruna / BUMDes</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[11px] sm:text-xs text-slate-500 text-center sm:text-left">
          <p>© 2026 KKM Informatika UMC • Desa Mekarjaya, Ciawigebang, Kuningan.</p>
          <p className="flex items-center justify-center gap-1">
            Dibuat dengan <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> untuk Kemandirian Lingkungan & Ekonomi Warga
          </p>
        </div>
      </div>
    </footer>
  );
};
