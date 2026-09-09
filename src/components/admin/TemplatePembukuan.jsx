import React, { useState } from 'react';
import { 
  BookOpen, 
  Download, 
  ExternalLink, 
  Search, 
  FileText, 
  CheckCircle2, 
  Wallet, 
  Scale, 
  Users, 
  Layers, 
  Calendar, 
  Printer,
  Sparkles,
  ArrowDownToLine,
  Tag
} from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';

export const TEMPLATES_DATA = [
  {
    id: 'buku-kas',
    nama: 'Buku Kas Bank Sampah',
    kategori: 'Keuangan',
    filename: 'BUKU KAS BANK SAMPAH_DESA MEKARJAYA.pdf',
    ukuran: '16.2 KB',
    deskripsi: 'Format standar pencatatan mutasi arus kas masuk (hasil penjualan sampah ke pengepul) dan pengeluaran kas (penyaluran tabungan warga RT) di Desa Mekarjaya.',
    icon: Wallet,
    colorClass: 'from-emerald-500 to-teal-600',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    fitur: ['Arus Kas Masuk & Keluar', 'Saldo Berjalan Kas RT', 'Kolom Tanda Tangan Bendahara']
  },
  {
    id: 'buku-penerimaan',
    nama: 'Buku Penerimaan Sampah',
    kategori: 'Operasional',
    filename: 'BUKU PENERIMAAN SAMPAH_BANK SAMPAH DESA MEKARJAYA.pdf',
    ukuran: '19.9 KB',
    deskripsi: 'Buku formulir operasional untuk mencatat penerimaan sampah terpilah dari masing-masing unit RT warga sebelum dikelompokkan ke wadah tampung.',
    icon: Scale,
    colorClass: 'from-blue-500 to-cyan-600',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    fitur: ['Pencatatan RT / Dusun', '4 Kategori Sampah Terpilah', 'Paraf Petugas Penerima']
  },
  {
    id: 'buku-penjualan',
    nama: 'Buku Penjualan Sampah',
    kategori: 'Operasional',
    filename: 'BUKU PENJUALAN SAMPAH_BANK SAMPAH DESA MEKARJAYA.pdf',
    ukuran: '16.2 KB',
    deskripsi: 'Format rekapitulasi bukti penjualan sampah dari 4 wadah pilah bank sampah kepada pengepul rekanan lengkap dengan harga per kg dan total nominal.',
    icon: Layers,
    colorClass: 'from-teal-500 to-emerald-600',
    badgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
    fitur: ['Tarif Pengepul Terkini', 'Rincian Tonase (Kg)', 'Bukti Pembayaran Pengepul']
  },
  {
    id: 'buku-daftar-harga',
    nama: 'Buku Daftar Harga Sampah',
    kategori: 'Operasional',
    filename: 'BUKU DAFTAR HARGA SAMPAH.pdf',
    ukuran: '75.0 KB',
    deskripsi: 'Format tabel resmi daftar harga sampah terpilah per kilogram (Jenis Sampah, Satuan, Harga Jual/Kg, dan Keterangan) untuk transparansi tarif ke warga dan lapak/pengepul.',
    icon: Tag,
    colorClass: 'from-amber-500 to-emerald-600',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    fitur: ['Tabel Jenis Sampah & Satuan', 'Tarif Harga Jual/Kg', 'Kolom Syarat / Keterangan']
  },
  {
    id: 'buku-register',
    nama: 'Buku Register Nasabah / Unit RT',
    kategori: 'Administrasi',
    filename: 'BUKU REGISTER NASABAH_BANK SAMPAH DESA MEKARJAYA.pdf',
    ukuran: '20.3 KB',
    deskripsi: 'Buku induk pendaftaran dan pendataan seluruh unit RT, nomor register kode RT, nama penanggung jawab, dusun, dan kontak di Desa Mekarjaya.',
    icon: Users,
    colorClass: 'from-indigo-500 to-blue-600',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    fitur: ['Kode Unik RT & Dusun', 'Identitas Ketua RT', 'Status Keaktifan Warga']
  },
  {
    id: 'buku-rekap-bulanan',
    nama: 'Buku Rekapitulasi Bulanan',
    kategori: 'Laporan',
    filename: 'BUKU REKAPITULASI BULANAN_DESA MEKARJAYA.pdf',
    ukuran: '17.8 KB',
    deskripsi: 'Rekap laporan bulanan total akumulasi volume sampah yang berhasil dipilah, omzet penjualan, dan posisi saldo kas tabungan per RT.',
    icon: Calendar,
    colorClass: 'from-amber-500 to-orange-600',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    fitur: ['Total Kg Terjual Bulanan', 'Pertumbuhan Kas per RT', 'Evaluasi Kinerja Pos']
  },
  {
    id: 'buku-tabungan',
    nama: 'Buku Tabungan Nasabah',
    kategori: 'Administrasi',
    filename: 'BUKU TABUNGAN NASABAH_BANK SAMPAH DESA MEKARJAYA.pdf',
    ukuran: '23.4 KB',
    deskripsi: 'Format kartu / buku tabungan fisik untuk dipegang oleh perwakilan RT atau kader lingkungan sebagai transparansi pencatatan kas bersama.',
    icon: BookOpen,
    colorClass: 'from-purple-500 to-pink-600',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
    fitur: ['Format Buku Saku Fisik', 'Tabel Mutasi Debit/Kredit', 'Tanda Tangan Pengurus']
  },
  {
    id: 'laporan-kas-rt-1',
    nama: 'Laporan Transaksi Kas RT (Model A)',
    kategori: 'Laporan',
    filename: 'Laporan_Transaksi_Kas_RT_Mekarjaya_2026-09-08 (1).pdf',
    ukuran: '10.1 KB',
    deskripsi: 'Template dokumen cetak resmi laporan riwayat transaksi dan kas RT Desa Mekarjaya dengan tabel rincian transaksi penjualan dan penyaluran.',
    icon: FileText,
    colorClass: 'from-sky-500 to-blue-600',
    badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    fitur: ['Header Resmi Mekarjaya', 'Tabel Transaksi Kas', 'Format Siap Cetak A4']
  },
  {
    id: 'laporan-kas-rt-ringkas',
    nama: 'Laporan Transaksi Kas RT (Model B)',
    kategori: 'Laporan',
    filename: 'Laporan_Transaksi_Kas_RT_Mekarjaya_2026-09-08.pdf',
    ukuran: '6.0 KB',
    deskripsi: 'Template ringkas laporan mutasi saldo kas RT yang efisien untuk arsip bulanan pengurus RT atau ditempel pada papan informasi dusun.',
    icon: Printer,
    colorClass: 'from-slate-600 to-slate-800',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    fitur: ['Desain Hemat Tinta', 'Ringkasan Cepat Saldo', 'Pengarsipan Praktis']
  }
];

export const TemplatePembukuan = () => {
  const { showToast } = useBankSampah();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');
  const [downloadingId, setDownloadingId] = useState(null);
  const [batchDownloading, setBatchDownloading] = useState(false);

  const kategoriList = ['Semua', 'Keuangan', 'Operasional', 'Administrasi', 'Laporan'];

  const filteredTemplates = TEMPLATES_DATA.filter((item) => {
    const matchCat = selectedKategori === 'Semua' || item.kategori === selectedKategori;
    const matchQuery = 
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.filename.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const getTemplateUrl = (filename) => {
    return encodeURI(`/pembukuan template/${filename}`);
  };

  // Unduh satu per satu
  const handleDownloadSingle = (template) => {
    setDownloadingId(template.id);
    try {
      const url = getTemplateUrl(template.filename);
      const link = document.createElement('a');
      link.href = url;
      link.download = template.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(`Mengunduh: ${template.nama}`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Gagal mengunduh file template.', 'error');
    } finally {
      setTimeout(() => {
        setDownloadingId(null);
      }, 1000);
    }
  };

  // Buka tab baru untuk pratinjau
  const handlePreviewSingle = (template) => {
    const url = getTemplateUrl(template.filename);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Unduh semua template satu per satu secara berurutan
  const handleDownloadAllSequentially = async () => {
    if (batchDownloading) return;
    setBatchDownloading(true);
    showToast('Memulai pengunduhan seluruh template satu per satu...', 'info');

    for (let i = 0; i < filteredTemplates.length; i++) {
      const item = filteredTemplates[i];
      const url = getTemplateUrl(item.filename);
      const link = document.createElement('a');
      link.href = url;
      link.download = item.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Jeda 600ms antar file agar browser tidak memblokir multi-download
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    setBatchDownloading(false);
    showToast(`Berhasil mengunduh ${filteredTemplates.length} file template!`, 'success');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Format Standar Pembukuan Desa Mekarjaya</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">
                Template Pembukuan & Dokumen PDF
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-2xl leading-relaxed">
                Unduh file master formulir administrasi, buku kas, penerimaan, register nasabah, hingga rekapitulasi bulanan secara individual untuk keperluan cetak fisik dan arsip pengurus.
              </p>
            </div>

            <button
              onClick={handleDownloadAllSequentially}
              disabled={batchDownloading || filteredTemplates.length === 0}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 active:bg-emerald-500 text-emerald-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-950/20 transition disabled:opacity-50 cursor-pointer flex-shrink-0"
            >
              <ArrowDownToLine className={`w-4 h-4 ${batchDownloading ? 'animate-bounce' : ''}`} />
              <span>
                {batchDownloading ? 'Sedang Mengunduh...' : `Unduh Semua (${filteredTemplates.length} Template)`}
              </span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-3 border-t border-white/10 text-xs">
            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10 min-w-0">
              <span className="text-[10px] sm:text-[11px] text-emerald-200 block truncate">Total Template</span>
              <span className="text-sm sm:text-lg font-black text-white truncate block">{TEMPLATES_DATA.length} File PDF</span>
            </div>
            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10 min-w-0">
              <span className="text-[10px] sm:text-[11px] text-emerald-200 block truncate">Format Cetak</span>
              <span className="text-sm sm:text-lg font-black text-white truncate block">A4 & Folio Siap</span>
            </div>
            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10 min-w-0">
              <span className="text-[10px] sm:text-[11px] text-emerald-200 block truncate">Kategori Lengkap</span>
              <span className="text-sm sm:text-lg font-black text-white truncate block">4 Pilar Buku</span>
            </div>
            <div className="bg-white/5 backdrop-blur-xs rounded-xl p-3 border border-white/10 min-w-0">
              <span className="text-[10px] sm:text-[11px] text-emerald-200 block truncate">Lokasi File</span>
              <span className="text-sm sm:text-lg font-black text-emerald-300 truncate block">public/pembukuan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
          {kategoriList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedKategori(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 cursor-pointer ${
                selectedKategori === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama template / buku..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Templates Grid (Downloadable One-by-One) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTemplates.map((template) => {
          const Icon = template.icon;
          const isDownloading = downloadingId === template.id;

          return (
            <div
              key={template.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-300 transition duration-200 flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5 sm:p-6 space-y-4">
                {/* Top Badge & Icon */}
                <div className="flex items-start justify-between gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${template.colorClass} text-white flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-105 transition`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${template.badgeClass}`}>
                      {template.kategori}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      PDF • {template.ukuran}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug group-hover:text-emerald-700 transition">
                    {template.nama}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-3">
                    {template.deskripsi}
                  </p>
                </div>

                {/* Feature Bullets */}
                <div className="space-y-1 pt-2 border-t border-slate-100">
                  {template.fitur.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Filename Tag */}
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-mono text-slate-500 truncate" title={template.filename}>
                  📁 {template.filename}
                </div>
              </div>

              {/* Action Buttons (Download & Preview) */}
              <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-100 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadSingle(template)}
                  disabled={isDownloading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-xs transition disabled:opacity-50 cursor-pointer"
                >
                  <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
                  <span>{isDownloading ? 'Mengunduh...' : 'Unduh Template (PDF)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePreviewSingle(template)}
                  title="Buka Pratinjau PDF"
                  className="p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-white text-slate-600 hover:text-emerald-700 transition cursor-pointer flex-shrink-0"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="font-bold text-sm text-slate-800">Tidak ada template yang cocok</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Tidak ditemukan file template pembukuan dengan kata kunci "{searchQuery}". Silakan periksa kembali filter kategori Anda.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedKategori('Semua'); }}
            className="px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition cursor-pointer"
          >
            Reset Filter Pencarian
          </button>
        </div>
      )}

      {/* Guidance Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-600" />
          <span>Panduan Penggunaan Dokumen & Pembukuan Fisik</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-1.5">
            <div className="font-bold text-emerald-900">1. Cetak & Penggandaan</div>
            <p className="leading-relaxed">
              Seluruh template PDF telah diatur ke ukuran standar A4 / Folio. Anda dapat mencetak langsung dari tombol <strong>Pratinjau</strong> atau setelah mengunduh file.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-1.5">
            <div className="font-bold text-blue-900">2. Pembagian ke Pengurus RT</div>
            <p className="leading-relaxed">
              <strong>Buku Tabungan Nasabah</strong> dan <strong>Buku Penerimaan Sampah</strong> dapat dibagikan kepada masing-masing koordinator RT di Dusun Cimenang, Ciganda, dan Cimuda.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 space-y-1.5">
            <div className="font-bold text-amber-900">3. Sinkronisasi Data Digital</div>
            <p className="leading-relaxed">
              Hasil catatan timbangan manual pada buku fisik dapat dimasukkan ke menu <strong>Timbang & Jual Sampah</strong> pada sistem ini agar saldo kas RT otomatis terakumulasi dan tercatat secara transparan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
