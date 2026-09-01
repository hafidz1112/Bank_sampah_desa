import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Scale, 
  Wallet, 
  Receipt, 
  Tag, 
  Sparkles, 
  FileSpreadsheet, 
  LogOut, 
  Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar = ({ activeTab, setActiveTab, onNavigateHome }) => {
  const { logout, user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Ringkasan & Statistik', icon: LayoutDashboard },
    { id: 'setor', label: 'Penimbangan Setoran', icon: Scale, highlight: true },
    { id: 'tarik', label: 'Penarikan Saldo Warga', icon: Wallet },
    { id: 'nasabah', label: 'Data Nasabah Desa', icon: Users },
    { id: 'transaksi', label: 'Buku Jurnal Mutasi', icon: Receipt },
    { id: 'katalog', label: 'Katalog & Tarif Sampah', icon: Tag },
    { id: 'maggot', label: 'Log Sirkular Maggot BSF', icon: Sparkles, badge: 'Sirkular' },
    { id: 'laporan', label: 'Laporan & Ekspor Data', icon: FileSpreadsheet },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 min-h-screen border-r border-slate-800">
      {/* Sidebar Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white tracking-tight leading-none">
              SI-BSDes <span className="text-emerald-400">Admin</span>
            </h2>
            <p className="text-[10px] text-slate-400 mt-1">Desa Mekarjaya, Kuningan</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
              {item.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Info & Footer */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-between text-xs">
          <div className="truncate pr-2">
            <div className="font-bold text-white truncate text-[11px]">
              {user?.user_metadata?.full_name || user?.email || 'Operator Karang Taruna'}
            </div>
            <div className="text-[10px] text-emerald-400 font-medium">Pengurus Terotorisasi</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={onNavigateHome}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Portal Publik</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-[11px] font-semibold transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
