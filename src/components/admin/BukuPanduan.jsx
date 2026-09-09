import React, { useState } from 'react';
import { 
  BookCheck, 
  LayoutDashboard, 
  Scale, 
  Wallet, 
  Building2, 
  Receipt, 
  Tag, 
  FileSpreadsheet, 
  FileDown, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  Printer, 
  Sparkles, 
  HelpCircle, 
  ShieldCheck, 
  Layers, 
  Lightbulb, 
  AlertTriangle,
  FileText,
  Users,
  Compass
} from 'lucide-react';

export const BukuPanduan = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('semua');

  const menuGuides = [
    {
      id: 'dashboard',
      tabKey: 'dashboard',
      menuTitle: '1. Ringkasan & Kas RT',
      icon: LayoutDashboard,
      color: 'from-emerald-600 to-teal-700',
      badge: 'Statistik & Monitoring',
      tujuan: 'Pusat pemantauan eksekutif kondisi keuangan kas RT se-Desa Mekarjaya dan tonase sampah yang berhasil diselamatkan.',
      fiturUtama: [
        {
          label: 'Kartu Statistik Utama',
          detail: 'Menampilkan 4 metrik krusial: Total Kas RT Desa (akumulasi saldo warga saat ini), Total Sampah Terjual (kg), Total Uang Penyaluran Kas, dan Total Unit RT Terdaftar.'
        },
        {
          label: 'Distribusi Kas per Dusun',
          detail: 'Grafik dan ringkasan persentase kepemilikan kas antara Dusun Cimenang, Dusun Ciganda, dan Dusun Cimuda.'
        },
        {
          label: 'Daftar Transaksi Terbaru',
          detail: 'Memantau 5 mutasi terkini baik penjualan maupun penyaluran kas lengkap dengan tombol pratinjau struk digital langsung.'
        }
      ],
      langkahKerja: [
        'Buka menu saat pertama kali login untuk melihat gambaran umum keuangan kas.',
        'Klik tombol pintasan "Timbang & Jual Sampah" jika ada penjualan baru, atau "Penyaluran Kas RT" untuk mencatat pengeluaran warga.',
        'Klik baris transaksi terkini untuk mencetak ulang tanda terima transaksi secara cepat.'
      ],
      tips: 'Periksa saldo kas per dusun secara berkala untuk memotivasi warga antar-dusun dalam keaktifan memilah sampah.'
    },
    {
      id: 'setor',
      tabKey: 'setor',
      menuTitle: '2. Timbang & Jual Sampah',
      icon: Scale,
      color: 'from-blue-600 to-cyan-700',
      badge: 'Pemasukan Kas RT',
      tujuan: 'Mencatat hasil penimbangan 4 wadah sampah terpilah yang dijual ke pihak pengepul, serta mengalokasikan hasil penjualannya langsung ke rekening kas RT warga yang bersangkutan.',
      fiturUtama: [
        {
          label: 'Pemilihan RT Alokasi',
          detail: 'Fitur pencarian RT dengan autocomplete; menampilkan nama RT, dusun, nama ketua RT, dan saldo berjalan sebelum transaksi.'
        },
        {
          label: 'Formulir Multi-Kategori Sampah Terpilah',
          detail: 'Dapat mencatat beberapa jenis wadah sekaligus dalam 1 kali penjualan (Botol Plastik PET, Plastik Campur/Kresek, Kardus/Kertas, Besi & Kaca).'
        },
        {
          label: 'Kalkulasi Otomatis & Estimasi Saldo',
          detail: 'Perhitungan otomatis berat x harga/kg = subtotal, total penerimaan uang, dan simulasi saldo kas akhir RT secara transparan.'
        },
        {
          label: 'Penerbitan Struk Digital Otomatis',
          detail: 'Begitu tombol "Simpan & Cetak Bukti" diklik, struk digital resmi langsung terbit siap dicetak (print) atau diunduh sebagai PDF.'
        }
      ],
      langkahKerja: [
        'Langkah 1: Pilih unit RT yang sampahnya ditimbang dan dijual ke pengepul.',
        'Langkah 2: Pilih kategori wadah sampah pada baris tabel (tarif per kg otomatis terpasang sesuai katalog). Masukkan berat timbangan dalam satuan kilogram (contoh: 15.5).',
        'Langkah 3: Jika menjual lebih dari satu kategori wadah, klik tombol "+ Tambah Kategori Sampah" untuk menambah baris baru.',
        'Langkah 4: Tulis catatan atau nama pengepul pada kolom keterangan (opsional).',
        'Langkah 5: Klik tombol "Simpan & Cetak Bukti". Saldo kas RT otomatis bertambah dan modal struk digital akan terbuka.'
      ],
      tips: 'Pastikan sampah dalam kondisi kering dan bersih saat ditimbang agar mendapatkan harga pengepul terbaik.'
    },
    {
      id: 'tarik',
      tabKey: 'tarik',
      menuTitle: '3. Penyaluran Dana Kas',
      icon: Wallet,
      color: 'from-amber-600 to-yellow-700',
      badge: 'Pengeluaran Kas RT',
      tujuan: 'Mencatat penyaluran atau penarikan dana kas tabungan sampah oleh unit RT untuk membiayai fasilitas umum, santunan, kerja bakti, atau kebutuhan warga.',
      fiturUtama: [
        {
          label: 'Pemisah Titik Ribuan Otomatis (Format Standar Rupiah)',
          detail: 'Kolom nominal otomatis menyisipkan titik pemisah ribuan saat diketik (contoh: 100.000, 1.500.000) sehingga meminimalisir salah input digit nol.'
        },
        {
          label: 'Indikator Konfirmasi "Terbaca"',
          detail: 'Menampilkan teks real-time di bawah kotak input (contoh: ✓ Terbaca: Rp 100.000) untuk verifikasi visual pengurus.'
        },
        {
          label: 'Proteksi Saldo Kas RT',
          detail: 'Sistem secara otomatis memblokir tombol simpan jika nominal penarikan melebihi saldo kas yang dimiliki oleh RT bersangkutan.'
        },
        {
          label: 'Pilihan Cepat Nominal',
          detail: 'Tersedia tombol nominal instan: Rp 50.000, Rp 100.000, Rp 250.000, Rp 500.000, hingga tombol "Salurkan Semua".'
        }
      ],
      langkahKerja: [
        'Langkah 1: Pilih unit RT yang mengajukan pencairan dana kas tabungan sampah.',
        'Langkah 2: Masukkan nominal yang ingin disalurkan (atau klik tombol nominal cepat). Periksa sisa saldo kas RT setelah penyaluran.',
        'Langkah 3: Ketik peruntukan dana pada kolom keterangan (contoh: "Pembelian lampu penerangan jalan gang RT 01").',
        'Langkah 4: Klik tombol "Proses Penyaluran Kas". Saldo kas RT berkurang dan struk pengeluaran resmi kas diterbitkan.'
      ],
      tips: 'Selalu cantumkan peruntukan dana yang jelas agar saat warga mengecek buku kas transparan, mereka mengetahui penggunaan dana tersebut.'
    },
    {
      id: 'nasabah',
      tabKey: 'nasabah',
      menuTitle: '4. Data RT & Tabungan',
      icon: Building2,
      color: 'from-indigo-600 to-blue-700',
      badge: 'Administrasi Nasabah',
      tujuan: 'Manajemen basis data seluruh unit RT sebagai nasabah kolektif Bank Sampah Aktif di Dusun Cimenang, Ciganda, dan Cimuda.',
      fiturUtama: [
        {
          label: 'Pencarian & Filter Dusun',
          detail: 'Menyaring data berdasarkan dusun tertentu atau mencari via nama ketua RT / kode unik RT.'
        },
        {
          label: 'Tambah & Edit Profil RT',
          detail: 'Formulir untuk memperbarui identitas ketua RT, nomor telepon/WhatsApp, dan rincian dusun.'
        },
        {
          label: 'Kartu Digital Kas RT',
          detail: 'Kartu virtual berdesain elegan lengkap dengan QR Code, nomor register, dan saldo kas terkini yang dapat ditunjukkan kepada ketua RT atau warga.'
        }
      ],
      langkahKerja: [
        'Untuk menambah RT baru: Klik tombol "+ Tambah Unit RT Baru", lengkapi dusun, RW, nomor RT, nama ketua, dan kontak telepon.',
        'Untuk memperbarui kontak/ketua: Klik ikon pensil (Edit) pada baris RT yang bersangkutan.',
        'Untuk melihat Kartu Kas RT: Klik ikon kartu identitas pada tabel untuk menampilkan kartu digital yang dapat disimpan atau dibagikan.'
      ],
      tips: 'Pastikan nomor WhatsApp ketua RT terisi dengan benar agar pengurus dapat mengirimkan kabar berkala terkait saldo kas RT.'
    },
    {
      id: 'transaksi',
      tabKey: 'transaksi',
      menuTitle: '5. Buku Jurnal Mutasi',
      icon: Receipt,
      color: 'from-purple-600 to-pink-700',
      badge: 'Buku Kas Besar',
      tujuan: 'Arsip buku jurnal mutasi transparan yang merekam seluruh arus uang masuk (penjualan sampah `+`) dan uang keluar (penyaluran kas `-`).',
      fiturUtama: [
        {
          label: 'Filter Tipe & Dusun',
          detail: 'Menyortir mutasi: Semua Transaksi, Penjualan Saja, Penyaluran Saja, serta filter per dusun.'
        },
        {
          label: 'Dropdown Rincian 4 Wadah',
          detail: 'Tiap transaksi penjualan dapat dibuka untuk melihat rincian berat per kategori sampah (berapa kg botol, kardus, dsb.) beserta harga dan subtotalnya.'
        },
        {
          label: 'Cetak Ulang Struk Digital',
          detail: 'Struk tanda terima transaksi tersimpan permanen dan dapat dicetak atau diunduh kembali kapan pun tanpa batas waktu.'
        }
      ],
      langkahKerja: [
        'Gunakan kolom pencarian jika ingin mencari transaksi berdasarkan nomor kode (misal: PJL-20260210-8821) atau nama RT.',
        'Klik baris transaksi untuk melihat rincian pemilahan wadah sampah yang dijual.',
        'Klik ikon printer/struk untuk membuka kembali dialog bukti transaksi digital.'
      ],
      tips: 'Jurnal ini dapat dijadikan acuan utama saat menyusun laporan pertanggungjawaban musyawarah desa (Musdes).'
    },
    {
      id: 'katalog',
      tabKey: 'katalog',
      menuTitle: '6. Katalog 4 Wadah & Tarif',
      icon: Tag,
      color: 'from-teal-600 to-emerald-700',
      badge: 'Standar Tarif & Wadah',
      tujuan: 'Mengelola harga beli/jual per kilogram untuk masing-masing dari 4 kategori wadah resmi Bank Sampah Aktif Mekarjaya.',
      fiturUtama: [
        {
          label: 'Penyesuaian Tarif Pasar Pengepul',
          detail: 'Admin dapat memperbarui tarif rupiah per kg sewaktu-waktu mengikuti fluktuasi harga beli dari pihak pengepul daur ulang.'
        },
        {
          label: 'Deskripsi Edukasi Wadah',
          detail: 'Menuliskan kriteria jenis sampah yang diterima pada tiap wadah agar sampah yang disetor warga tidak tercampur kontaminan.'
        },
        {
          label: 'Status Aktif Wadah',
          detail: 'Mengatur status wadah yang sedang aktif menerima sampah atau dihentikan sementara.'
        }
      ],
      langkahKerja: [
        'Untuk mengubah harga: Klik tombol "Edit" pada wadah yang ingin diubah harganya (misal: Botol Plastik PET).',
        'Ubah angka tarif per kg (Rp) sesuai harga kesepakatan terbaru dengan pengepul.',
        'Simpan perubahan. Seluruh form penimbangan sampah berikutnya akan otomatis menggunakan tarif terbaru ini.'
      ],
      tips: 'Ubah harga secara berkala jika ada kenaikan harga beli dari pabrik daur ulang agar pendapatan kas RT warga maksimal.'
    },
    {
      id: 'laporan',
      tabKey: 'laporan',
      menuTitle: '7. Laporan & Ekspor Data',
      icon: FileSpreadsheet,
      color: 'from-sky-600 to-blue-700',
      badge: 'Ekspor PDF & Excel',
      tujuan: 'Menghasilkan dokumen resmi cetak PDF dan spreadsheet Excel (CSV) untuk pelaporan formal, arsip fisik, dan evaluasi berkala.',
      fiturUtama: [
        {
          label: 'Ekspor Rekap Kas RT (PDF & CSV)',
          detail: 'Mencetak dokumen resmi daftar RT se-Desa Mekarjaya, nama ketua, total timbangan sampah terkumpul, dan saldo kas tabungan.'
        },
        {
          label: 'Ekspor Jurnal Mutasi Kas (PDF & CSV)',
          detail: 'Dokumen cetak mutasi keuangan lengkap dengan rincian penerimaan dan penyaluran untuk akuntabilitas publik.'
        },
        {
          label: 'Ekspor Katalog 4 Wadah (CSV)',
          detail: 'Daftar acuan tarif wadah terpilah ke format spreadsheet Excel.'
        }
      ],
      langkahKerja: [
        'Pilih jenis laporan yang dibutuhkan pada kartu yang tersedia.',
        'Klik tombol "Unduh PDF" untuk menghasilkan dokumen rapi ber-kop resmi yang siap ditandatangani dan dicetak.',
        'Klik tombol "Unduh Format Excel (CSV)" jika Anda ingin mengolah data lebih lanjut di Microsoft Excel atau Google Sheets.'
      ],
      tips: 'Laporan PDF resmi dapat dilampirkan dalam laporan kegiatan KKM Informatika UMC 2026 atau diserahkan ke Sekretaris Desa.'
    },
    {
      id: 'template',
      tabKey: 'template',
      menuTitle: '8. Template Pembukuan PDF',
      icon: FileDown,
      color: 'from-purple-600 to-indigo-700',
      badge: 'Master Formulir Fisik',
      tujuan: 'Pusat unduhan 8 file master formulir cetak PDF standar Desa Mekarjaya untuk keperluan administrasi meja kasir dan buku saku RT.',
      fiturUtama: [
        {
          label: 'Unduh Individual (Satu per Satu)',
          detail: 'Tiap file memiliki tombol unduh sendiri: Buku Kas, Buku Penerimaan, Penjualan, Register Nasabah, Rekap Bulanan, Buku Tabungan, dan Laporan Model A/B.'
        },
        {
          label: 'Tombol Pratinjau Langsung',
          detail: 'Membuka dokumen di tab baru browser tanpa perlu mengunduh terlebih dahulu.'
        },
        {
          label: 'Unduh Semua Sekaligus',
          detail: 'Fitur otomatis mengunduh seluruh 8 file satu demi satu dengan jeda pengaman.'
        }
      ],
      langkahKerja: [
        'Cari template yang Anda butuhkan melalui filter kategori atau kotak pencarian.',
        'Klik tombol hijau "Unduh Template (PDF)" pada kartu dokumen yang diinginkan.',
        'Buka file hasil unduhan lalu cetak pada kertas ukuran A4 atau Folio untuk dibagikan ke petugas pos atau pengurus RT.'
      ],
      tips: 'Buku Tabungan Nasabah dan Buku Penerimaan Sampah sangat direkomendasikan dicetak dan dibagikan kepada setiap perwakilan RT.'
    }
  ];

  const workflowSteps = [
    {
      step: '1',
      title: 'Warga Memilah Sampah Mandiri',
      desc: 'Warga di Dusun Cimenang, Ciganda, & Cimuda memilah sampah rumah tangganya ke 4 wadah Bank Sampah Aktif (Botol Plastik, Plastik, Kardus, Besi/Kaca).'
    },
    {
      step: '2',
      title: 'Penimbangan di Pos Wadah',
      desc: 'Pengurus menimbang sampah terpilah yang terkumpul per wadah menggunakan menu "Timbang & Jual Sampah" dan mencatat RT asal warga.'
    },
    {
      step: '3',
      title: 'Penjualan ke Pengepul Rekanan',
      desc: 'Sampah yang terkumpul dijual ke pengepul dengan tarif resmi katalog. Uang tunai dari pengepul otomatis masuk sebagai Saldo Kas RT warga.'
    },
    {
      step: '4',
      title: 'Transparansi & Cek Saldo',
      desc: 'Warga dapat mengecek saldo kas RT mereka secara terbuka melalui Portal Publik tanpa login, atau melihat papan informasi dusun.'
    },
    {
      step: '5',
      title: 'Penyaluran Kas untuk Warga',
      desc: 'Saat RT membutuhkan dana untuk fasilitas lingkungan atau santunan, pengurus mencatat pengeluaran via menu "Penyaluran Dana Kas".'
    }
  ];

  const filteredGuides = menuGuides.filter((guide) => {
    const matchesSection = selectedSection === 'semua' || guide.id === selectedSection;
    const matchesQuery = 
      guide.menuTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.tujuan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.tips.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.fiturUtama.some(f => f.label.toLowerCase().includes(searchQuery.toLowerCase()) || f.detail.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSection && matchesQuery;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Hero Banner Buku Panduan */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <BookCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Buku Panduan Pengurus & Manual Operasional SI-BSDes</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                Buku Panduan Penggunaan Sistem
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-3xl leading-relaxed">
                Pelajari kegunaan, alur kerja, langkah-langkah praktis, serta fitur-fitur lengkap pada setiap menu di dalam aplikasi Bank Sampah Aktif Desa Mekarjaya.
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-950 font-extrabold text-xs sm:text-sm shadow-lg transition flex-shrink-0 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-700" />
              <span>Cetak / Simpan PDF Panduan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Alur Kerja Sistem (5 Langkah Sirkular) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Compass className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Alur Kerja Operasional Bank Sampah Aktif Mekarjaya
            </h3>
            <p className="text-xs text-slate-500">
              Siklus perputaran pemilahan sampah menjadi tabungan kas warga yang transparan dan bermanfaat.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-2">
          {workflowSteps.map((wf, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 relative flex flex-col justify-between space-y-2 group hover:bg-emerald-50/60 hover:border-emerald-200 transition">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                  {wf.step}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Langkah</span>
              </div>
              <div>
                <h4 className="font-bold text-xs text-slate-800 leading-snug group-hover:text-emerald-900">
                  {wf.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {wf.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Section Picker */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
          <button
            onClick={() => setSelectedSection('semua')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 cursor-pointer ${
              selectedSection === 'semua'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Menu ({menuGuides.length})
          </button>
          {menuGuides.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedSection(g.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex-shrink-0 cursor-pointer ${
                selectedSection === g.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {g.menuTitle.split('. ')[1]}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari fitur, menu, atau panduan operasional..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Detail Panduan Setiap Menu */}
      <div className="space-y-6">
        {filteredGuides.map((guide) => {
          const Icon = guide.icon;

          return (
            <div
              key={guide.id}
              id={`panduan-${guide.id}`}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition overflow-hidden"
            >
              {/* Card Top Header */}
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${guide.color} text-white flex items-center justify-center shadow-md flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-lg text-slate-900 tracking-tight">
                        {guide.menuTitle}
                      </h3>
                      <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {guide.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 max-w-2xl">
                      {guide.tujuan}
                    </p>
                  </div>
                </div>

                {onNavigate && (
                  <button
                    onClick={() => onNavigate(guide.tabKey)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-xs transition flex-shrink-0 cursor-pointer"
                  >
                    <span>Buka Menu Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 space-y-6">
                {/* 1. Fitur Utama */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Fitur-Fitur Utama yang Tersedia</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {guide.fiturUtama.map((feat, fIdx) => (
                      <div key={fIdx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{feat.label}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed pl-5">
                          {feat.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Langkah-Langkah Penggunaan */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>Langkah-Langkah Praktis Penggunaan</span>
                  </h4>
                  <div className="space-y-2 bg-blue-50/40 p-4 rounded-2xl border border-blue-100/70">
                    {guide.langkahKerja.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                          {sIdx + 1}
                        </span>
                        <span className="leading-relaxed">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Tips & Catatan Penting */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex items-start gap-3 text-xs text-amber-900">
                  <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block">Tips & Saran Pengurus:</strong>
                    <span className="leading-relaxed">{guide.tips}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tanya Jawab & Troubleshooting Pengurus */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-purple-700" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-slate-900">
              Tanya Jawab & Pemecahan Masalah (FAQ Pengurus)
            </h3>
            <p className="text-xs text-slate-500">
              Jawaban atas pertanyaan umum seputar pengoperasian harian sistem bank sampah.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="text-emerald-600 font-black">Q:</span>
              <span>Bagaimana jika koneksi internet terputus saat menimbang sampah?</span>
            </div>
            <p className="text-slate-600 leading-relaxed pl-4">
              Sistem telah dilengkapi penyimpanan lokal otomatis (offline fallback). Transaksi akan tetap tersimpan di memori browser dan struk tetap dapat diterbitkan secara normal.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="text-emerald-600 font-black">Q:</span>
              <span>Apakah warga biasa bisa melihat saldo kas RT tanpa login?</span>
            </div>
            <p className="text-slate-600 leading-relaxed pl-4">
              Ya! Warga cukup membuka halaman utama publik lalu masuk ke menu <strong>Buku Tabungan Kas RT</strong>. Mereka dapat memilih nomor RT atau memasukkan kode RT untuk melihat saldo dan mutasi uang masuk secara transparan.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="text-emerald-600 font-black">Q:</span>
              <span>Bagaimana jika ada perubahan harga dari pengepul sampah?</span>
            </div>
            <p className="text-slate-600 leading-relaxed pl-4">
              Masuk ke menu <strong>Katalog 4 Wadah</strong>, klik "Edit" pada jenis sampah yang harganya berubah, masukkan tarif baru, lalu simpan. Transaksi berikutnya akan otomatis mengacu pada harga terbaru.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="text-emerald-600 font-black">Q:</span>
              <span>Apakah struk transaksi wajib dicetak di kertas printer fisik?</span>
            </div>
            <p className="text-slate-600 leading-relaxed pl-4">
              Tidak wajib. Anda dapat mencetaknya langsung jika terhubung printer, atau klik tombol <strong>Unduh PDF</strong> untuk menyimpan file struk digital atau mengirimkannya ke WhatsApp ketua RT.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
