import React from 'react';
import { Menu, ShieldCheck, RefreshCw } from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';
import { useAuth } from '../../context/AuthContext';

export const AdminHeader = ({ onToggleSidebar, activeTab }) => {
  const { loadData, loading } = useBankSampah();
  const { user } = useAuth();

  const tabTitles = {
    dashboard: 'Ringkasan Statistik & Kas RT',
    setor: 'Form Penimbangan & Penjualan Sampah RA',
    tarik: 'Form Penyaluran / Pengeluaran Kas RT',
    nasabah: 'Manajemen Data RT & Tabungan Warga',
    transaksi: 'Buku Jurnal Mutasi Kas RT',
    katalog: 'Katalog 4 Wadah Sampah Terpilah',
    laporan: 'Laporan Rekapitulasi & Ekspor Data',
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-extrabold text-slate-800 tracking-tight">
            {tabTitles[activeTab] || 'Dashboard Pengurus'}
          </h1>
          <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
            Bank Sampah Desa Mekarjaya • Pos Pemilahan 4 Wadah di RA & Kas Warga RT
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Sync / Refresh Button */}
        <button
          onClick={loadData}
          disabled={loading}
          title="Sinkronisasi Data"
          className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-slate-100 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
        </button>

        {/* User badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="hidden md:block text-left">
            <div className="text-xs font-bold text-slate-800">
              {user?.user_metadata?.full_name || 'Operator RA'}
            </div>
            <div className="text-[10px] text-slate-400">Pengurus Bank Sampah</div>
          </div>
        </div>
      </div>
    </header>
  );
};
