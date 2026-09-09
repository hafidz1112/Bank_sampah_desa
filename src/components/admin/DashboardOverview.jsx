import React from 'react';
import { 
  Building2, 
  Scale, 
  Wallet, 
  Sparkles, 
  TrendingUp, 
  ArrowDownLeft, 
  ArrowUpRight, 
  FileText, 
  MapPin, 
  ChevronRight, 
  Coins,
  Leaf,
  Download
} from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';
import { formatRupiah, formatWeight, formatDate } from '../../lib/utils';

export const DashboardOverview = ({ onNavigate, onSelectTx }) => {
  const { getStats, transaksiList, rtList } = useBankSampah();
  const stats = getStats();

  const recentTx = transaksiList.slice(0, 6);

  return (
    <div className="p-3.5 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-5 sm:p-8 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300">
            Panel Pengurus Bank Sampah Aktif
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
            Selamat Bertugas di Bank Sampah Aktif Mekarjaya!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
            Kelola penimbangan sampah terpilah dari 4 wadah, catat penjualan ke pengepul daur ulang, dan kelola saldo tabungan kas warga per RT.
          </p>
        </div>

        {/* Action Quick Buttons */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button
            onClick={() => onNavigate('setor')}
            className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-1.5"
          >
            <Scale className="w-4 h-4" />
            <span>+ Timbang & Jual</span>
          </button>
          <button
            onClick={() => onNavigate('tarik')}
            className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-1.5"
          >
            <Wallet className="w-4 h-4" />
            <span>Penyaluran Kas</span>
          </button>
          <button
            onClick={() => onNavigate('nasabah')}
            className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition flex items-center justify-center gap-1.5"
          >
            <Building2 className="w-4 h-4" />
            <span>Data RT</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Kas Seluruh RT</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xl sm:text-2xl font-black text-emerald-800 font-sans truncate">
            {formatRupiah(stats.totalSaldoKas)}
          </div>
          <div className="mt-1 text-xs text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" /> Tabungan aktif warga
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sampah Terjual</span>
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
              <Scale className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xl sm:text-2xl font-extrabold text-slate-900 font-sans truncate">
            {formatWeight(stats.totalBeratSampahKg)}
          </div>
          <div className="mt-1 text-xs text-sky-600 font-semibold truncate">
            Dari 4 Wadah Pemilahan Aktif
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Unit RT Terfasilitasi</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xl sm:text-2xl font-extrabold text-slate-900 font-sans truncate">
            {stats.totalRt} <span className="text-xs sm:text-sm font-normal text-slate-500">Rukun Tetangga</span>
          </div>
          <div className="mt-1 text-xs text-purple-600 font-semibold truncate">
            3 Dusun Mekarjaya
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Kas Tersalurkan ke RT</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Coins className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xl sm:text-2xl font-extrabold text-amber-800 font-sans truncate">
            {formatRupiah(stats.totalUangPenyaluran || 0)}
          </div>
          <div className="mt-1 text-xs text-amber-700 font-semibold flex items-center gap-1 truncate">
            <Sparkles className="w-3.5 h-3.5 flex-shrink-0" /> Untuk kegiatan warga
          </div>
        </div>
      </div>

      {/* Dusun Breakdown Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-emerald-600" />
          Distribusi Tabungan Kas per Wilayah Dusun
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {Object.entries(stats.dusunStats).map(([dusunName, dData]) => (
            <div key={dusunName} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-emerald-300 transition space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">{dusunName}</h4>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  {dData.count} Unit RT
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-xs text-slate-600">
                <span>Akumulasi Saldo Kas:</span>
                <span className="font-bold text-emerald-700">{formatRupiah(dData.saldo)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of Two Columns: Recent Transactions + 4 Categories Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Transactions (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Mutasi Kas Terkini</h3>
              <p className="text-xs text-slate-400">Aktivitas penjualan sampah dan penyaluran kas RT</p>
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
              const isPenjualan = tx.jenis === 'penjualan' || tx.jenis === 'setor';
              return (
                <div key={tx.id} className="py-3 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-3">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      isPenjualan ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {isPenjualan ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-slate-800 truncate">
                        {tx.rt_nama}
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-slate-400 font-mono truncate">
                        {tx.kode_transaksi} • {formatDate(tx.created_at, false)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <div>
                      <div className={`text-xs sm:text-sm font-bold ${isPenjualan ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {isPenjualan ? '+' : '-'} {formatRupiah(tx.total_nominal)}
                      </div>
                      {isPenjualan && tx.total_berat_kg > 0 && (
                        <div className="text-[10px] text-slate-400">
                          {formatWeight(tx.total_berat_kg)}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onSelectTx(tx)}
                      title="Lihat Bukti"
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 Wadah Sampah Terpilah Breakdown (5 Cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-emerald-950 rounded-3xl p-6 text-white shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">4 Wadah Sampah Terpilah</h3>
                  <p className="text-xs text-emerald-300">Bank Sampah Aktif Mekarjaya</p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5 pt-1">
              <div className="p-3 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🧴</span>
                  <div>
                    <div className="font-bold text-xs text-white">1. Botol Plastik (PET)</div>
                    <div className="text-[10px] text-emerald-300">Rp 3.500 /kg</div>
                  </div>
                </div>
                <span className="font-bold text-xs text-white">
                  {formatWeight(stats.categoryStats?.botol_plastik || 0)}
                </span>
              </div>

              <div className="p-3 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🥤</span>
                  <div>
                    <div className="font-bold text-xs text-white">2. Plastik & Gelas PP</div>
                    <div className="text-[10px] text-emerald-300">Rp 2.200 /kg</div>
                  </div>
                </div>
                <span className="font-bold text-xs text-white">
                  {formatWeight(stats.categoryStats?.plastik || 0)}
                </span>
              </div>

              <div className="p-3 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">📦</span>
                  <div>
                    <div className="font-bold text-xs text-white">3. Kardus & Kertas</div>
                    <div className="text-[10px] text-emerald-300">Rp 2.500 /kg</div>
                  </div>
                </div>
                <span className="font-bold text-xs text-white">
                  {formatWeight(stats.categoryStats?.kardus_kertas || 0)}
                </span>
              </div>

              <div className="p-3 bg-white/10 rounded-2xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🥫</span>
                  <div>
                    <div className="font-bold text-xs text-white">4. Besi & Kaca (Beling)</div>
                    <div className="text-[10px] text-emerald-300">Rp 3.000 /kg</div>
                  </div>
                </div>
                <span className="font-bold text-xs text-white">
                  {formatWeight(stats.categoryStats?.besi_kaca || 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-emerald-200/90 font-medium border-t border-white/10 mt-3">
            <span>Sampah terkumpul dijual ke pengepul dan masuk kas RT.</span>
            <a
              href={encodeURI('/pembukuan template/BUKU DAFTAR HARGA SAMPAH.pdf')}
              download="BUKU DAFTAR HARGA SAMPAH.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-[11px] transition shadow-xs flex-shrink-0 cursor-pointer"
              title="Unduh Formulir Cetak Buku Daftar Harga Sampah"
            >
              <Download className="w-3.5 h-3.5 text-emerald-300" />
              <span>Unduh Buku Daftar Harga (PDF)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
