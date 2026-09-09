import React from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  Building2, 
  Receipt, 
  Tag,
  BookOpen,
  Award,
  Layers,
  Coins,
  Scale
} from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';
import { formatRupiah, formatWeight } from '../../lib/utils';
import { exportRtPDF, exportTransaksiPDF, exportToCSV } from '../../lib/exportUtils';

export const LaporanEkspor = ({ onNavigate }) => {
  const { rtList, transaksiList, katalogList, getStats } = useBankSampah();
  const stats = getStats();

  const handleExportAllPDF = () => {
    exportTransaksiPDF(transaksiList, 'Laporan Lengkap Mutasi Kas RT KKM UMC 2026');
    setTimeout(() => {
      exportRtPDF(rtList);
    }, 600);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Laporan Rekapitulasi & Ekspor Data Bank Sampah
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Ekspor data resmi kas RT, buku mutasi, dan tarif 4 wadah terpilah ke format PDF siap cetak maupun spreadsheet Excel (CSV).
        </p>
      </div>

      {/* Banner Shortcut to Template Pembukuan */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 flex-shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-white">
              Template Dokumen & Pembukuan PDF (8 File Tersedia)
            </h3>
            <p className="text-xs text-purple-200/80 mt-0.5">
              Unduh master cetak Buku Kas, Buku Penerimaan, Penjualan, Register Nasabah, dan Rekapitulasi Bulanan satu per satu.
            </p>
          </div>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate('template')}
            className="px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-extrabold text-xs shadow-md transition flex items-center gap-2 flex-shrink-0 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Buka Menu Template PDF</span>
          </button>
        )}
      </div>

      {/* Program Summary Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              Laporan Eksekutif Program Kerja KKM UMC 2026
            </span>
            <h3 className="text-2xl font-black">
              Bank Sampah Aktif Desa Mekarjaya
            </h3>
            <p className="text-xs text-emerald-100">
              Kec. Ciawigebang, Kab. Kuningan • 4 Wadah Terpilah & Kas RT Dusun Cimenang, Ciganda, Cimuda
            </p>
          </div>

          <button
            onClick={handleExportAllPDF}
            className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs shadow-lg transition flex items-center gap-2 self-start sm:self-auto"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Semua Berkas PDF</span>
          </button>
        </div>

        {/* Aggregate KPI Grid in Report */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <span className="text-[10px] text-emerald-200 uppercase font-semibold">Unit RT Terdaftar</span>
            <div className="text-xl font-extrabold text-white mt-1">{stats.totalRt || rtList.length} RT</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <span className="text-[10px] text-emerald-200 uppercase font-semibold">Total Sampah Terjual</span>
            <div className="text-xl font-extrabold text-white mt-1">{formatWeight(stats.totalBeratSampahKg)}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <span className="text-[10px] text-emerald-200 uppercase font-semibold">Total Saldo Kas RT</span>
            <div className="text-xl font-extrabold text-emerald-300 mt-1">{formatRupiah(stats.totalSaldoKas)}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <span className="text-[10px] text-emerald-200 uppercase font-semibold">Kas Disalurkan</span>
            <div className="text-xl font-extrabold text-amber-300 mt-1">{formatRupiah(stats.totalUangPenyaluran)}</div>
          </div>
        </div>
      </div>

      {/* 3 Report Download Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Report 1: RT Savings */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-base text-slate-900">
              Rekap Kas & Tabungan RT
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Daftar seluruh unit RT di Dusun Cimenang, Ciganda, dan Cimuda dengan rincian ketua RT, kontak, total sampah, dan saldo kas tabungan warga.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => exportRtPDF(rtList)}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh PDF Rekap Kas RT
            </button>
            <button
              onClick={() => {
                const headers = ['Kode RT', 'Nama RT', 'Dusun', 'RW', 'RT', 'Ketua RT', 'Kontak HP', 'Total Sampah (kg)', 'Saldo Kas (Rp)'];
                const rows = rtList.map(r => [r.kode_rt, r.nama_rt, r.dusun, r.rw, r.rt, r.ketua_rt || '', r.kontak || r.no_telepon || '', r.total_sampah_terkumpul_kg || 0, r.saldo_kas]);
                exportToCSV('Rekap_Kas_RT_Mekarjaya', rows, headers);
              }}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-teal-600" />
              Unduh Format Excel (CSV)
            </button>
          </div>
        </div>

        {/* Report 2: Jurnal Transaksi */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-base text-slate-900">
              Buku Jurnal Mutasi Kas
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Arsip mutasi transaksi penjualan sampah ke pengepul (pemasukan) dan penyaluran dana kas RT (pengeluaran) untuk transparansi warga.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => exportTransaksiPDF(transaksiList, 'Semua Periode')}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh PDF Jurnal Mutasi
            </button>
            <button
              onClick={() => {
                const headers = ['Kode TRX', 'Waktu', 'Unit RT', 'Jenis', 'Berat (Kg)', 'Nominal (Rp)', 'Keterangan'];
                const rows = transaksiList.map(t => [t.kode_transaksi, t.created_at, t.rt_nama || t.nasabah_nama || '', t.jenis, t.total_berat_kg, t.total_nominal, t.keterangan]);
                exportToCSV('Jurnal_Mutasi_Kas_RT_Mekarjaya', rows, headers);
              }}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Unduh Format Excel (CSV)
            </button>
          </div>
        </div>

        {/* Report 3: Katalog 4 Wadah Terpilah */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Tag className="w-5 h-5 text-amber-600" />
            </div>
            <h4 className="font-extrabold text-base text-slate-900">
              Katalog 4 Wadah & Tarif
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Daftar tarif acuan harga jual 4 wadah sampah terpilah Bank Sampah Aktif ke pengepul (Botol Plastik, Plastik, Kardus/Kertas, Besi & Kaca).
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                const headers = ['Nama Kategori Wadah', 'Tipe Kode', 'Tarif ke Pengepul / Kg (Rp)', 'Status', 'Deskripsi Pemilahan'];
                const rows = katalogList.map(k => [k.nama_kategori, k.tipe || 'WADAH', k.harga_per_kg, k.is_active ? 'Aktif' : 'Nonaktif', k.deskripsi || '-']);
                exportToCSV('Katalog_4_Wadah_Mekarjaya', rows, headers);
              }}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh Katalog 4 Wadah (CSV)
            </button>
            <div className="p-2 rounded-xl bg-slate-50 text-[11px] text-slate-500 text-center font-medium border border-slate-100">
              {katalogList.length} Kategori Wadah Terpilah
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
