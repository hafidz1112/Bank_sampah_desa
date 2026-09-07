import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Scale, 
  Wallet, 
  Receipt, 
  Tag, 
  FileSpreadsheet, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const { logout, user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Ringkasan & Kas RT', icon: LayoutDashboard },
    { id: 'setor', label: 'Timbang & Jual Sampah', icon: Scale, highlight: true },
    { id: 'tarik', label: 'Penyaluran Dana Kas', icon: Wallet },
    { id: 'nasabah', label: 'Data RT & Tabungan', icon: Building2 },
    { id: 'transaksi', label: 'Buku Jurnal Mutasi', icon: Receipt },
    { id: 'katalog', label: 'Katalog 4 Wadah', icon: Tag },
    { id: 'laporan', label: 'Laporan & Ekspor Data', icon: FileSpreadsheet },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 h-full border-r border-slate-800 select-none">
      {/* Sidebar Header */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <img 
            src="/kab_kuningan.png" 
            alt="Logo Kabupaten Kuningan" 
            className="w-9 h-9 object-contain drop-shadow-sm flex-shrink-0"
          />
          <div>
            <h2 className="text-sm font-black text-white tracking-tight leading-none">
              Bank Sampah <span className="text-emerald-400">Desa</span>
            </h2>
            <p className="text-[10px] text-slate-400 mt-1">Desa Mekarjaya • Operator</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-2">
          Menu Operasional
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              } ${item.highlight && !isActive ? 'border border-emerald-500/30 text-emerald-400 bg-emerald-950/30' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
            </button>
          );
        })}

        {/* Info RA Section */}
        <div className="pt-4 mt-3 border-t border-slate-800">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 pb-2">
            Pos Wadah Pilah
          </div>
          <div className="px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-emerald-300">
            <div className="font-bold flex items-center gap-1.5 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Lokasi: Pos RA Mekarjaya</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              4 Wadah: Botol PET, Plastik, Kardus, Besi & Kaca
            </p>
          </div>
        </div>
      </nav>

      {/* User Info & Logout Button */}
      <div className="p-3 border-t border-slate-800 space-y-2 flex-shrink-0 bg-slate-900">
        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-between text-xs">
          <div className="truncate pr-2">
            <div className="font-bold text-white truncate text-[11px]">
              {user?.user_metadata?.full_name || user?.email || 'Pengurus RA Mekarjaya'}
            </div>
            <div className="text-[10px] text-emerald-400 font-medium">Operator Bank Sampah</div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs font-semibold transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Dashboard</span>
        </button>
      </div>
    </aside>
  );
};
