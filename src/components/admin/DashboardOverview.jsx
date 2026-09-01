import React from 'react';
import { 
  Users, 
  Scale, 
  Wallet, 
  Sparkles, 
  TrendingUp, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Plus, 
  FileText, 
  MapPin, 
  ChevronRight, 
  Calendar,
  Egg,
  Leaf
} from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';
import { formatRupiah, formatWeight, formatDate } from '../../lib/utils';

export const DashboardOverview = ({ onNavigate, onSelectTx }) => {
  const { getStats, transaksiList, nasabahList, logOrganikList } = useBankSampah();
  const stats = getStats();

  const recentTx = transaksiList.slice(0, 5);
  const recentLogs = logOrganikList.slice(0, 4);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            Panel Pengurus Karang Taruna & BUMDes
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            Selamat Bertugas di SI-BSDes Mekarjaya!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Kelola penimbangan sampah harian warga, mutasi saldo tabungan, dan pasokan sampah organik ke unit biopond Maggot BSF secara terintegrasi.
          </p>
        </div>

        {/* Action Quick Buttons */}
        <div className="flex flex-wrap gap-2.5 self-start md:self-center">
          <button
            onClick={() => onNavigate('setor')}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition flex items-center gap-1.5"
          >
            <Scale className="w-4 h-4" />
            + Timbang Setoran
          </button>
          <button
            onClick={() => onNavigate('tarik')}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition flex items-center gap-1.5"
          >
            <Wallet className="w-4 h-4" />
            Tarik Saldo
          </button>
          <button
            onClick={() => onNavigate('nasabah')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition flex items-center gap-1.5"
          >
            <Users className="w-4 h-4" />
            + Nasabah Baru
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nasabah Terdaftar</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-slate-900 font-sans">
            {stats.totalNasabah} <span className="text-sm font-normal text-slate-500">Warga</span>
          </div>
          <div className="mt-1 text-xs text-purple-600 font-semibold">
            3 Dusun Terintegrasi
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sampah Masuk</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-slate-900 font-sans">
            {formatWeight(stats.totalBeratSampahKg)}
          </div>
          <div className="mt-1 text-xs text-emerald-600 font-semibold">
            Anorganik & Organik
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saldo Tabungan Warga</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-blue-700 font-sans">
            {formatRupiah(stats.totalSaldoAktif)}
          </div>
          <div className="mt-1 text-xs text-blue-600 font-semibold">
            Kewajiban Bank Sampah
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Organik ke Maggot BSF</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-amber-700 font-sans">
            {formatWeight(stats.totalSampahOrganikLogKg)}
          </div>
          <div className="mt-1 text-xs text-amber-700 font-semibold flex items-center gap-1">
            <Egg className="w-3.5 h-3.5" /> Pakan Bebek BUMDes
          </div>
        </div>
      </div>

      {/* Dusun Breakdown Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600" />
          Partisipasi Bank Sampah Berdasarkan Dusun
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {Object.entries(stats.dusunStats).map(([dusunName, dData]) => (
            <div key={dusunName} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-emerald-300 transition space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">{dusunName}</h4>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  {dData.count} Nasabah
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-600">
                <span>Tabungan Warga:</span>
                <span className="font-bold text-emerald-700">{formatRupiah(dData.saldo)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of Two Columns: Recent Transactions + Maggot Log Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Transactions (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Transaksi Terkini</h3>
              <p className="text-xs text-slate-400">Aktivitas setoran dan penarikan terakhir</p>
            </div>
            <button
              onClick={() => onNavigate('transaksi')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentTx.map((tx) => {
              const isSetor = tx.jenis === 'setor';
              return (
                <div key={tx.id} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isSetor ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {isSetor ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-800">
                        {tx.nasabah_nama}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {tx.kode_transaksi} • {formatDate(tx.created_at, false)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-2">
                    <div>
                      <div className={`text-xs font-bold ${isSetor ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {isSetor ? '+' : '-'} {formatRupiah(tx.total_nominal)}
                      </div>
                      {isSetor && tx.total_berat_kg > 0 && (
                        <div className="text-[10px] text-slate-400">
                          {formatWeight(tx.total_berat_kg)}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onSelectTx(tx)}
                      title="Lihat Nota"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Maggot Log Feed & Quick Summary (5 Cols) */}
        <div className="lg:col-span-5 bg-amber-50/50 rounded-3xl p-6 border border-amber-200/70 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4 text-amber-700" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Biopond Maggot BSF</h3>
                <p className="text-xs text-amber-800">Sirkular Sampah Organik Desa</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('maggot')}
              className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1"
            >
              <span>Kelola Log</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-amber-100 shadow-xs space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Total Pasokan Organik:</span>
              <span className="font-bold text-slate-800">{formatWeight(stats.totalSampahOrganikLogKg)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Hasil Panen Maggot:</span>
              <span className="font-bold text-amber-700">~{formatWeight(stats.totalEstMaggotKg)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">Tujuan Pakan Utama:</span>
              <span className="font-semibold text-emerald-800">Bebek Petelur BUMDes</span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Pengiriman Organik Terbaru
            </span>
            <div className="space-y-2">
              {recentLogs.map((log) => (
                <div key={log.id} className="p-3 bg-white rounded-xl border border-amber-100 text-xs flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">{log.tujuan_biopond.split('(')[0]}</div>
                    <div className="text-[10px] text-slate-400">{formatDate(log.tanggal, false)}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-amber-800 font-sans">{formatWeight(log.volume_sampah_organik_kg)}</div>
                    <div className="text-[10px] text-emerald-600">Panen ~{formatWeight(log.est_maggot_panen_kg)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
