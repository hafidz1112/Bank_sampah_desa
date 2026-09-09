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
  Printer, 
  Sparkles, 
  HelpCircle, 
  Lightbulb, 
  Check,
  PhoneCall,
  FileText,
  Download,
  KeyRound,
  Copy,
  Lock,
  Mail
} from 'lucide-react';
import { exportPanduanPDF } from '../../lib/exportUtils';

export const BukuPanduan = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Panduan ringkas berbasis tugas harian
  const quickTasks = [
    {
      id: 'task-login',
      tabKey: 'dashboard',
      judul: 'Cara Masuk / Login ke Dashboard Akun Pengurus',
      kategori: 'Akses',
      warna: 'from-blue-600 to-indigo-700',
      badgeBg: 'bg-blue-100 text-blue-800',
      menuAsal: 'Tombol: Login Pengurus (Kanan Atas Layar)',
      icon: KeyRound,
      isLoginTask: true,
      langkah: [
        'Buka website Bank Sampah Desa Mekarjaya di browser HP atau laptop.',
        'Klik tombol hitam "Login Pengurus" yang ada di pojok kanan atas layar (atau buka menu bilah di HP).',
        'Ketik Email Pengurus: admin@mekarjaya.desa.id',
        'Ketik Kata Sandi (Password): admin123',
        'Klik tombol "Masuk Dashboard". Anda langsung masuk ke panel pengurus dan siap bertugas mencatat penimbangan sampah warga.'
      ],
      tipsMudah: 'Simpan email dan kata sandi ini. Warga umum / nasabah RT tidak butuh login dan bebas melihat kas RT lewat menu Transparansi Kas RT.'
    },
    {
      id: 'task-setor',
      tabKey: 'setor',
      judul: 'Cara Mencatat Sampah yang Dijual (Uang Masuk ke Kas RT)',
      kategori: 'Harian',
      warna: 'from-emerald-500 to-teal-600',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      menuAsal: 'Menu: Timbang & Jual Sampah',
      icon: Scale,
      langkah: [
        'Pilih nama RT yang sampahnya dijual (misal: RT 01 Dusun Cimenang).',
        'Pilih wadah sampah (Botol Plastik, Kardus, dll), lalu ketik beratnya berapa Kilogram (Kg). Harganya otomatis dihitung.',
        'Kalau ada jenis sampah lain, klik tombol "+ Tambah Kategori Sampah".',
        'Klik tombol hijau "Simpan & Cetak Bukti". Uang kas RT otomatis bertambah dan nota bukti langsung muncul!'
      ],
      tipsMudah: 'Gunakan timbangan kiloan biasa di pos wadah. Setelah selesai, nota struk bisa langsung disimpan ke HP atau dicetak.'
    },
    {
      id: 'task-tarik',

      tabKey: 'tarik',
      judul: 'Cara Mencatat Pengeluaran Uang Kas RT (Uang Keluar)',
      kategori: 'Harian',
      warna: 'from-amber-500 to-yellow-600',
      badgeBg: 'bg-amber-100 text-amber-800',
      menuAsal: 'Menu: Penyaluran Dana Kas',
      icon: Wallet,
      langkah: [
        'Pilih nama RT yang ingin mencairkan uang kas tabungannya.',
        'Ketik jumlah uang yang mau diambil. Tidak perlu repot ketik titik, titik otomatis muncul sendiri (misal ketik 50000 langsung jadi 50.000).',
        'Tulis uangnya untuk apa pada kolom catatan (contoh: "Beli lampu jalan gang RT 01").',
        'Klik tombol "Proses Penyaluran Kas". Selesai! Uang kas RT otomatis terpotong secara transparan.'
      ],
      tipsMudah: 'Sistem otomatis menolak jika uang yang mau diambil melebihi sisa tabungan RT, jadi sangat aman.'
    },
    {
      id: 'task-cek',
      tabKey: 'transaksi',
      judul: 'Cara Melihat Catatan Uang & Cetak Ulang Nota Struk',
      kategori: 'Pemeriksaan',
      warna: 'from-blue-500 to-indigo-600',
      badgeBg: 'bg-blue-100 text-blue-800',
      menuAsal: 'Menu: Buku Jurnal Mutasi',
      icon: Receipt,
      langkah: [
        'Buka menu "Buku Jurnal Mutasi". Di sini terlihat semua daftar uang masuk (tanda + hijau) dan uang keluar (tanda - kuning).',
        'Klik pada baris transaksi untuk melihat rincian berapa kilogram botol atau kardus yang dulu ditimbang.',
        'Klik gambar kertas/printer di sebelah kanan jika ingin melihat atau mencetak ulang nota struk bukti warga.'
      ],
      tipsMudah: 'Semua catatan mutasi tersimpan rapi dan tidak akan hilang meskipun komputer atau HP dimatikan.'
    },
    {
      id: 'task-harga',
      tabKey: 'katalog',
      judul: 'Cara Mengganti Harga Sampah Kalau Ada Kenaikan/Penurunan',
      kategori: 'Pengaturan',
      warna: 'from-teal-500 to-emerald-600',
      badgeBg: 'bg-teal-100 text-teal-800',
      menuAsal: 'Menu: Katalog 4 Wadah',
      icon: Tag,
      langkah: [
        'Buka menu "Katalog 4 Wadah". Di situ terlihat 4 jenis wadah: Botol Plastik, Plastik Keras / Emberan, Kardus/Kertas, dan Besi/Kaca.',
        'Klik tombol "Edit" pada jenis sampah yang harganya mau diganti.',
        'Ketik harga baru per kilo dari pengepul (misal ganti jadi 3500).',
        'Klik "Simpan Perubahan". Penimbangan selanjutnya otomatis memakai harga baru tersebut.'
      ],
      tipsMudah: 'Harga acuan ini bisa disesuaikan kapan saja mengikuti kesepakatan dengan bakul/pengepul sampah desa.'
    },
    {
      id: 'task-rt',
      tabKey: 'nasabah',
      judul: 'Cara Menambah RT Baru atau Mengganti Nama Ketua RT',
      kategori: 'Pengaturan',
      warna: 'from-purple-500 to-pink-600',
      badgeBg: 'bg-purple-100 text-purple-800',
      menuAsal: 'Menu: Data RT & Tabungan',
      icon: Building2,
      langkah: [
        'Buka menu "Data RT & Tabungan" untuk melihat seluruh RT di Dusun Cimenang, Ciganda, dan Cimuda.',
        'Kalau ada pergantian ketua RT, cukup klik gambar Pensil (Edit) di samping nama RT, ganti namanya, lalu simpan.',
        'Kalau mau menambah RT baru, klik tombol "+ Tambah Unit RT Baru" di pojok atas.',
        'Klik gambar Kartu untuk melihat "Kartu Digital Kas RT" yang ada barcode-nya untuk ditunjukkan ke ketua RT.'
      ],
      tipsMudah: 'Pastikan nomor HP/WhatsApp ketua RT dicatat agar mudah dihubungi saat pembagian hasil kas.'
    },
    {
      id: 'task-template',
      tabKey: 'template',
      judul: 'Cara Download Kertas / Buku Formulir untuk Ditulis Tangan',
      kategori: 'Dokumen',
      warna: 'from-sky-500 to-blue-600',
      badgeBg: 'bg-sky-100 text-sky-800',
      menuAsal: 'Menu: Template Pembukuan',
      icon: FileDown,
      langkah: [
        'Buka menu "Template Pembukuan". Di situ ada 8 pilihan buku siap pakai (Buku Kas, Buku Timbang, Buku Register, dll).',
        'Pilih buku yang Anda mau, lalu klik tombol hijau "Unduh Template (PDF)".',
        'File PDF akan tersimpan di komputer Anda. Silakan buka dan cetak di kertas biasa (A4 atau Folio).',
        'Buku cetak ini bisa ditaruh di pos sampah untuk dicatat pakai pulpen saat warga mengantar sampah.'
      ],
      tipsMudah: 'Buku Tabungan Nasabah dan Buku Penerimaan Sampah sangat bagus dicetak untuk pegangan masing-masing ketua RT.'
    },
    {
      id: 'task-laporan',
      tabKey: 'laporan',
      judul: 'Cara Mencetak Rekapitulasi Laporan Bulanan untuk Desa',
      kategori: 'Dokumen',
      warna: 'from-slate-600 to-slate-800',
      badgeBg: 'bg-slate-200 text-slate-800',
      menuAsal: 'Menu: Laporan & Ekspor Data',
      icon: FileSpreadsheet,
      langkah: [
        'Buka menu "Laporan & Ekspor Data".',
        'Klik tombol "Unduh PDF Rekap Kas RT" untuk mencetak daftar saldo seluruh RT di kertas rapi ber-kop resmi.',
        'Klik tombol "Unduh PDF Jurnal Mutasi" untuk mencetak bukti semua uang masuk dan keluar.',
        'Kalau mau dibuka di laptop pakai Excel, klik tombol "Unduh Format Excel (CSV)".'
      ],
      tipsMudah: 'Laporan PDF ini sudah rapi dan siap ditandatangani untuk laporan ke Kepala Desa atau rapat RT.'
    }
  ];

  // Daftar Semua Menu Ringkas
  const menuListSimple = [
    {
      nama: 'Ringkasan & Kas RT',
      icon: LayoutDashboard,
      kegunaan: 'Melihat jumlah uang kas desa saat ini, total kilo sampah, dan dusun mana yang paling aktif.',
      tab: 'dashboard'
    },
    {
      nama: 'Timbang & Jual Sampah',
      icon: Scale,
      kegunaan: 'Mencatat sampah yang dijual ke pengepul agar uangnya otomatis masuk ke tabungan kas RT warga.',
      tab: 'setor'
    },
    {
      nama: 'Penyaluran Dana Kas',
      icon: Wallet,
      kegunaan: 'Mencatat uang kas yang diambil oleh RT untuk keperluan warga (seperti kerja bakti, beli lampu jalan, dll).',
      tab: 'tarik'
    },
    {
      nama: 'Data RT & Tabungan',
      icon: Building2,
      kegunaan: 'Daftar nama ketua RT, nomor telepon warga, saldo kas per RT, dan kartu kas digital.',
      tab: 'nasabah'
    },
    {
      nama: 'Buku Jurnal Mutasi',
      icon: Receipt,
      kegunaan: 'Buku catatan semua uang masuk dan uang keluar lengkap dengan tombol cetak ulang nota.',
      tab: 'transaksi'
    },
    {
      nama: 'Katalog 4 Wadah',
      icon: Tag,
      kegunaan: 'Tempat mengecek dan mengganti harga sampah per kilo (Botol Plastik, Kardus, Besi, dll).',
      tab: 'katalog'
    },
    {
      nama: 'Laporan & Ekspor Data',
      icon: FileSpreadsheet,
      kegunaan: 'Tempat mencetak surat laporan resmi ke kertas PDF atau mengunduh data ke file Excel.',
      tab: 'laporan'
    },
    {
      nama: 'Template Pembukuan',
      icon: FileDown,
      kegunaan: 'Tempat download kertas formulir kosong (PDF) untuk dicetak dan ditulis tangan pakai pulpen.',
      tab: 'template'
    }
  ];

  // FAQ Bahasa Ramah
  const easyFaq = [
    {
      tanya: 'Saya gaptek dan takut salah pencet tombol, apakah datanya bisa rusak?',
      jawab: 'Tenang saja! Aplikasi ini sangat aman. Jika salah ketik angka, Anda bisa membatalkannya sebelum menekan tombol simpan. Kalau ada salah catat, uang kas bisa disesuaikan kapan saja lewat transaksi baru.'
    },
    {
      tanya: 'Bagaimana cara warga biasa mengecek uang kas RT-nya sendiri?',
      jawab: 'Sangat gampang! Warga cukup membuka website ini dari HP masing-masing tanpa perlu kata sandi (password). Lalu klik menu "Buku Tabungan Kas RT", pilih nomor RT mereka, dan saldo kas beserta catatan uang masuk langsung terlihat jelas.'
    },
    {
      tanya: 'Kalau saya tidak punya mesin printer kasir, apakah tetap bisa kasih bukti ke warga?',
      jawab: 'Tentu bisa! Saat selesai menimbang, klik tombol "Unduh PDF" pada nota. File nota itu bisa langsung Anda kirim lewat WhatsApp ke nomor ketua RT atau grup warga.'
    },
    {
      tanya: 'Waktu mengetik uang penyaluran kas, apakah saya harus ketik tanda titiknya?',
      jawab: 'Tidak usah repot! Cukup ketik angkanya saja. Misalnya ketik 50000, sistem otomatis menampilkan 50.000 dengan titik pemisah ribuan secara rapi dan ada tulisan "Terbaca: Rp 50.000" di bawahnya.'
    }
  ];

  const filteredTasks = quickTasks.filter((t) => {
    const matchCat = selectedCategory === 'semua' || t.kategori.toLowerCase() === selectedCategory.toLowerCase();
    const matchQuery = 
      t.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.menuAsal.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.langkah.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchQuery;
  });

  return (
    <div id="printable-panduan" className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header Ramah & Menenangkan */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Panduan Santai • Mudah Dipahami & Anti-Ribet</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Buku Panduan Pengurus Bank Sampah
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            Tidak perlu khawatir jika merasa gaptek atau baru pertama kali memegang sistem ini. Ikuti panduan praktis langkah demi langkah di bawah ini sesuai hal yang ingin Anda kerjakan.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs no-print">
            <button
              onClick={exportPanduanPDF}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-extrabold shadow-sm transition cursor-pointer"
              title="Unduh Dokumen PDF Resmi Buku Panduan"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Berkas PDF Resmi</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold border border-white/20 shadow-sm transition cursor-pointer"
              title="Cetak Panduan ke Kertas Printer"
            >
              <Printer className="w-4 h-4 text-white" />
              <span>Cetak ke Kertas (Printer)</span>
            </button>

            <div className="text-[11px] text-emerald-200">
              💡 <em>Dokumen resmi siap cetak format A4 / Folio.</em>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Akun Login Resmi Pengurus */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 rounded-3xl p-5 sm:p-6 text-white border border-slate-700 shadow-md break-inside-avoid space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Akun Login Resmi Pengurus & Operator Pos
                </h3>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  Data Akses
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Gunakan email dan kata sandi di bawah ini untuk masuk ke dashboard admin pos sampah:
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Box Email */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                <span>Email Pengurus:</span>
              </div>
              <div className="font-mono font-bold text-xs sm:text-sm text-white mt-1 truncate select-all">
                admin@mekarjaya.desa.id
              </div>
            </div>
            <button
              onClick={() => handleCopy('admin@mekarjaya.desa.id', 'email')}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition flex-shrink-0 cursor-pointer no-print"
              title="Salin Email"
            >
              {copiedField === 'email' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-[11px]">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-300" />
                  <span className="text-slate-300 text-[11px]">Salin</span>
                </>
              )}
            </button>
          </div>

          {/* Box Password */}
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-3.5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Kata Sandi (Password):</span>
              </div>
              <div className="font-mono font-bold text-xs sm:text-sm text-white mt-1 select-all">
                admin123
              </div>
            </div>
            <button
              onClick={() => handleCopy('admin123', 'pass')}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition flex-shrink-0 cursor-pointer no-print"
              title="Salin Kata Sandi"
            >
              {copiedField === 'pass' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-[11px]">Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-300" />
                  <span className="text-slate-300 text-[11px]">Salin</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-[11px] text-slate-300 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Cara Masuk: </strong>
            Buka website di HP/komputer &gt; Klik tombol <strong>"Login Pengurus"</strong> di pojok kanan atas &gt; Masukkan email dan password di atas &gt; Klik <strong>"Masuk Dashboard"</strong>. Warga RT tidak butuh login dan bebas memantau kas lewat menu <em>Transparansi Kas RT</em>.
          </span>
        </div>
      </div>

      {/* Bagian 1: Ringkasan Cepat Fungsi Semua Menu (8 Kotak Sederhana) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4 break-inside-avoid">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <BookCheck className="w-5 h-5 text-emerald-600" />
            <span>Fungsi Singkat Setiap Menu di Bilah Samping (Sidebar)</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Klik tombol biru di sebelah kanan untuk langsung membuka menu yang Anda tuju:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {menuListSimple.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 transition flex items-center justify-between gap-3 group break-inside-avoid"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-emerald-700 flex items-center justify-center flex-shrink-0 shadow-xs group-hover:bg-emerald-600 group-hover:text-white transition">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-800">
                      {idx + 1}. {item.nama}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                      {item.kegunaan}
                    </p>
                  </div>
                </div>

                {onNavigate && (
                  <button
                    onClick={() => onNavigate(item.tab)}
                    title={`Buka menu ${item.nama}`}
                    className="p-2 rounded-xl bg-white hover:bg-emerald-600 hover:text-white text-slate-500 border border-slate-200 transition flex-shrink-0 cursor-pointer text-[11px] font-bold no-print"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bagian 2: Panduan Berbasis Tugas ("Saya Mau Ngapain?") */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span>Panduan Langkah Demi Langkah (Paling Sering Digunakan)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Pilih aktivitas yang ingin Anda kerjakan di bawah ini:
            </p>
          </div>

          {/* Search bar santai */}
          <div className="relative w-full sm:w-64 no-print">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari: jual, uang keluar, cetak..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Daftar Kartu Langkah Praktis */}
        <div className="space-y-4">
          {filteredTasks.map((task, idx) => {
            const Icon = task.icon;

            return (
              <div
                key={task.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition overflow-hidden break-inside-avoid"
              >
                {/* Header Kartu */}
                <div className="p-3.5 sm:p-5 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${task.warna} text-white flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5 sm:mt-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug">
                          {task.judul}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${task.badgeBg} flex-shrink-0`}>
                          {task.kategori}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                        📍 {task.menuAsal}
                      </div>
                    </div>
                  </div>

                  {onNavigate && (
                    <button
                      onClick={() => onNavigate(task.tabKey)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition flex-shrink-0 cursor-pointer no-print"
                    >
                      <span>Buka Menu Ini</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Langkah-Langkah (1, 2, 3, 4) */}
                <div className="p-5 sm:p-6 space-y-4">
                  <div className="space-y-2.5">
                    {task.langkah.map((l, lIdx) => (
                      <div key={lIdx} className="flex items-start gap-3 text-xs text-slate-700">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-200">
                          {lIdx + 1}
                        </span>
                        <span className="leading-relaxed">{l}</span>
                      </div>
                    ))}
                  </div>

                  {task.isLoginTask && (
                    <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2.5 break-inside-avoid">
                      <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Kredensial Login Pengurus:</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Email Pengurus:</span>
                            <span className="text-xs font-mono font-bold text-emerald-300 select-all">admin@mekarjaya.desa.id</span>
                          </div>
                          <button
                            onClick={() => handleCopy('admin@mekarjaya.desa.id', 'email_task')}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition no-print cursor-pointer"
                            title="Salin Email"
                          >
                            {copiedField === 'email_task' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                          </button>
                        </div>
                        <div className="bg-slate-800 p-2.5 rounded-xl border border-slate-700 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Kata Sandi (Password):</span>
                            <span className="text-xs font-mono font-bold text-amber-300 select-all">admin123</span>
                          </div>
                          <button
                            onClick={() => handleCopy('admin123', 'pass_task')}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition no-print cursor-pointer"
                            title="Salin Kata Sandi"
                          >
                            {copiedField === 'pass_task' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tips Mudah */}
                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Tips Pengurus: </strong>
                      <span>{task.tipsMudah}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bagian 3: Pertanyaan yang Sering Muncul (FAQ Santai) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4 break-inside-avoid">
        <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-purple-600" />
          <span>Pertanyaan yang Sering Ditanyakan (Anti-Bingung)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {easyFaq.map((faq, fIdx) => (
            <div key={fIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 break-inside-avoid">
              <div className="font-bold text-xs text-slate-900 flex items-start gap-1.5">
                <span className="text-emerald-700 font-black">T:</span>
                <span>{faq.tanya}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed pl-4">
                <strong className="text-emerald-800">Jawab: </strong>{faq.jawab}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Catatan Semangat */}
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1 break-inside-avoid">
        <div className="text-xs font-bold text-emerald-900">
          🌱 Semangat Menjaga Kebersihan & Kesejahteraan Kas RT Desa Mekarjaya!
        </div>
        <p className="text-[11px] text-emerald-700">
          Jika masih ada yang kurang jelas atau butuh pendampingan, jangan ragu untuk berdiskusi bersama sesama pengurus atau tim KKM Informatika UMC.
        </p>
      </div>
    </div>
  );
};
