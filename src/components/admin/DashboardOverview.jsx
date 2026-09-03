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
  Leaf,
  ExternalLink,
  Info
} from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';
import { formatRupiah, formatWeight, formatDate, MAGGOT_MONITORING_URL } from '../../lib/utils';

export const DashboardOverview = ({ onNavigate, onSelectTx }) => {
  const { getStats, transaksiList, nasabahList } = useBankSampah();
  const stats = getStats();

  const recentTx = transaksiList.slice(0, 6);

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
            Kelola penimbangan sampah harian warga, pembukuan saldo tabungan rupiah, dan penyediaan data suplai sampah organik desa secara terintegrasi.
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
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Suplai Sampah Organik</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-extrabold text-amber-800 font-sans">
            {formatWeight(stats.totalSampahOrganikKg || 0)}
          </div>
          <div className="mt-1 text-xs text-amber-700 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Dihimpun untuk Pakan Maggot
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

        {/* Sinergi Budidaya Maggot & Komposisi Sampah (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-amber-50 via-orange-50/40 to-emerald-50/50 rounded-3xl p-6 border border-amber-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Sinergi Sampah Organik</h3>
                  <p className="text-xs text-amber-800">Diteruskan ke Unit Maggot BSF Desa</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-200/60 text-amber-900 border border-amber-300">
                Sistem Terpisah
              </span>
            </div>

            {/* Komposisi Sampah Masuk Bank Sampah */}
            <div className="p-4 bg-white rounded-2xl border border-amber-100 shadow-xs space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Komposisi Sampah Terkumpul di Pos
              </span>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600 font-medium">Sampah Anorganik (Kardus/Plastik/Logam)</span>
                    <span className="font-bold text-slate-900 font-sans">{formatWeight(stats.totalSampahAnorganikKg || (stats.totalBeratSampahKg * 0.7))}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-sky-500 h-full rounded-full" style={{ width: '70%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-emerald-800 font-medium">Sampah Organik (Pakan Biopond)</span>
                    <span className="font-bold text-emerald-800 font-sans">{formatWeight(stats.totalSampahOrganikKg || (stats.totalBeratSampahKg * 0.3))}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box Rekan KKM */}
            <div className="p-4 bg-amber-100/50 rounded-2xl border border-amber-200/60 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <Info className="w-4 h-4 text-amber-700 flex-shrink-0" />
                <span>Monitoring Budidaya Maggot BSF</span>
              </div>
              <p className="text-[11px] text-amber-800/90 leading-relaxed">
                Manajemen biopond, pemantauan sensor suhu/kelembapan, konversi larva, dan jadwal alokasi pakan bebek petelur BUMDes dikelola di platform website khusus rekan KKM.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={MAGGOT_MONITORING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/20 transition flex items-center justify-center gap-2 group"
            >
              <span>Buka Website Monitoring Maggot</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
