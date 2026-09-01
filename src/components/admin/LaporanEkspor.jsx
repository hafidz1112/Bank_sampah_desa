import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  Users, 
  Receipt, 
  Sparkles,
  BookOpen,
  Award,
  Layers
} from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';
import { formatRupiah, formatWeight } from '../../lib/utils';
import { exportNasabahPDF, exportTransaksiPDF, exportLogMaggotPDF, exportToCSV } from '../../lib/exportUtils';

export const LaporanEkspor = () => {
  const { nasabahList, transaksiList, logOrganikList, getStats } = useBankSampah();
  const stats = getStats();

  const [selectedReportType, setSelectedReportType] = useState('all');

  const handleExportAllPDF = () => {
    exportTransaksiPDF(transaksiList, 'Laporan Lengkap Transaksi KKM UMC 2026');
    setTimeout(() => {
      exportNasabahPDF(nasabahList);
    }, 500);
    setTimeout(() => {
      exportLogMaggotPDF(logOrganikList);
    }, 1000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Laporan Rekapitulasi & Ekspor Dokumen
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Generate dokumen PDF & CSV resmi untuk pertanggungjawaban Program Kerja KKM Informatika UMC 2026 dan Arsip Pemerintah Desa Mekarjaya
        </p>
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
              Bank Sampah Desa Mekarjaya Terintegrasi
            </h3>
            <p className="text-xs text-emerald-100">
              Kec. Ciawigebang, Kab. Kuningan • Dusun Cimenang, Ciganda, Cimuda
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
            <span className="text-[10px] text-emerald-200 uppercase font-semibold">Total Nasabah</span>
            <div className="text-xl font-extrabold text-white mt-1">{stats.totalNasabah} Warga</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <span className="text-[10px] text-emerald-200 uppercase font-semibold">Sampah Terkelola</span>
            <div className="text-xl font-extrabold text-white mt-1">{formatWeight(stats.totalBeratSampahKg)}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <span className="text-[10px] text-emerald-200 uppercase font-semibold">Tabungan Beredar</span>
            <div className="text-xl font-extrabold text-emerald-300 mt-1">{formatRupiah(stats.totalSaldoAktif)}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <span className="text-[10px] text-emerald-200 uppercase font-semibold">Organik ke Maggot</span>
            <div className="text-xl font-extrabold text-amber-300 mt-1">{formatWeight(stats.totalSampahOrganikLogKg)}</div>
          </div>
        </div>
      </div>

      {/* 3 Report Download Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Report 1: Nasabah */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-base text-slate-900">
              Rekap Data Nasabah
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Daftar seluruh nasabah warga Dusun Cimenang, Ciganda, Cimuda lengkap dengan NIK, nomor rekening, dan saldo tabungan aktif.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => exportNasabahPDF(nasabahList)}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh PDF Nasabah
            </button>
            <button
              onClick={() => {
                const headers = ['No Rekening', 'NIK', 'Nama Lengkap', 'Dusun', 'RW', 'RT', 'Saldo Aktif'];
                const rows = nasabahList.map(n => [n.no_rekening, n.nik, n.nama, n.dusun, n.rw, n.rt, n.saldo_aktif]);
                exportToCSV('Rekap_Nasabah_Mekarjaya', rows, headers);
              }}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-purple-600" />
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
              Buku Jurnal Transaksi
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Arsip mutasi transaksi penimbangan setoran dan pencairan penarikan saldo nasabah dari awal beroperasi.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => exportTransaksiPDF(transaksiList, 'Semua Periode')}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh PDF Jurnal
            </button>
            <button
              onClick={() => {
                const headers = ['Kode TRX', 'Waktu', 'Nasabah', 'No Rekening', 'Jenis', 'Berat (Kg)', 'Nominal (Rp)', 'Keterangan'];
                const rows = transaksiList.map(t => [t.kode_transaksi, t.created_at, t.nasabah_nama, t.nasabah_no_rekening, t.jenis, t.total_berat_kg, t.total_nominal, t.keterangan]);
                exportToCSV('Jurnal_Transaksi_Mekarjaya', rows, headers);
              }}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Unduh Format Excel (CSV)
            </button>
          </div>
        </div>

        {/* Report 3: Sirkular Maggot */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <h4 className="font-extrabold text-base text-slate-900">
              Log Sirkular Maggot BSF
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Laporan aliran limbah organik desa yang dikonversi menjadi maggot fresh untuk pakan bebek petelur BUMDes Mekarjaya.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={() => exportLogMaggotPDF(logOrganikList)}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Unduh PDF Sirkular Maggot
            </button>
            <button
              onClick={() => {
                const headers = ['Tanggal', 'Volume Organik (Kg)', 'Tujuan Biopond', 'Est Maggot (Kg)', 'Target Alokasi', 'Keterangan'];
                const rows = logOrganikList.map(l => [l.tanggal, l.volume_sampah_organik_kg, l.tujuan_biopond, l.est_maggot_panen_kg, l.target_alokasi, l.keterangan]);
                exportToCSV('Log_Sirkular_Maggot_Mekarjaya', rows, headers);
              }}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-600" />
              Unduh Format Excel (CSV)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
