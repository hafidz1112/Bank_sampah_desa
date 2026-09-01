import React from 'react';
import { MapPin, Heart, BookOpen, Shield, ArrowRight } from 'lucide-react';

export const Footer = ({ onOpenLogin }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Location */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <img 
                src="/kab_kuningan.png" 
                alt="Logo Kabupaten Kuningan" 
                className="w-11 h-11 object-contain drop-shadow-sm flex-shrink-0"
              />
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight">
                  SI-BSDes <span className="text-emerald-400">Mekarjaya</span>
                </span>
                <p className="text-xs text-slate-400 mt-0.5">Sistem Informasi Bank Sampah Desa Terintegrasi</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              Platform tata kelola bank sampah digital dan ekosistem ekonomi sirkular terpadu: memadukan penimbangan sampah anorganik berbayar dengan biokonversi sampah organik Maggot BSF guna mendukung efisiensi pakan bebek petelur BUMDes Mekarjaya.
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 text-emerald-300 border border-slate-700">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Dusun Cimenang
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 text-emerald-300 border border-slate-700">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Dusun Ciganda
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 text-emerald-300 border border-slate-700">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Dusun Cimuda
              </span>
            </div>
          </div>

          {/* Program & Kampus */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Program Kerja KKM
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• KKM Universitas Muhammadiyah Cirebon (UMC) 2026</li>
              <li>• Program Studi Teknik Informatika</li>
              <li>• Lokasi: Desa Mekarjaya, Kec. Ciawigebang, Kab. Kuningan</li>
              <li>• Fokus: Digitalisasi Desa & Circular Economy</li>
            </ul>
          </div>

          {/* Admin Link */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              Akses Pengurus
            </h4>
            <div className="space-y-2 text-xs">
              <button
                onClick={onOpenLogin}
                className="w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
              >
                <span>Login Karang Taruna / BUMDes</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 KKM Informatika UMC • Desa Mekarjaya, Ciawigebang, Kuningan. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> untuk Kemandirian Lingkungan & Ekonomi Warga
          </p>
        </div>
      </div>
    </footer>
  );
};
