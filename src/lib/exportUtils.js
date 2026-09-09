import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatRupiah, formatWeight, formatDate } from './utils';

// Helper to trigger browser CSV download
export const exportToCSV = (filename, rows, headers) => {
  if (!rows || !rows.length) {
    alert('Tidak ada data untuk diekspor.');
    return;
  }

  const separator = ',';
  const csvContent = [
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(separator),
    ...rows.map(row =>
      row
        .map(cell => {
          const formatted = cell === null || cell === undefined ? '' : String(cell);
          return `"${formatted.replace(/"/g, '""')}"`;
        })
        .join(separator)
    ),
  ].join('\r\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export RT Savings Summary Table to PDF
export const exportRtPDF = (rtList) => {
  const doc = new jsPDF();

  // Header Desa Mekarjaya
  doc.setFontSize(16);
  doc.setTextColor(22, 101, 52); // Brand green
  doc.text('BANK SAMPAH AKTIF MEKARJAYA', 14, 15);
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('Program Bank Sampah Aktif Desa Mekarjaya • 4 Wadah Terpilah & Kas RT', 14, 21);
  doc.text('Program Kerja Individu KKM Informatika UMC 2026 - Kec. Ciawigebang, Kuningan', 14, 26);
  doc.setLineWidth(0.5);
  doc.setDrawColor(203, 213, 225);
  doc.line(14, 29, 196, 29);

  // Title
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('REKAPITULASI TABUNGAN & KAS RT DARI PENJUALAN SAMPAH', 14, 37);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 42);

  const tableData = rtList.map((r, i) => [
    i + 1,
    r.kode_rt,
    r.nama_rt,
    r.dusun,
    r.ketua_rt || '-',
    r.kontak || '-',
    formatWeight(r.total_sampah_terkumpul_kg || 0),
    formatRupiah(r.saldo_kas)
  ]);

  autoTable(doc, {
    startY: 46,
    head: [['No', 'Kode RT', 'Nama RT', 'Dusun', 'Ketua RT / Pengurus', 'Kontak', 'Sampah Terkumpul', 'Saldo Kas RT']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [22, 163, 74], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      6: { halign: 'right' },
      7: { halign: 'right', fontStyle: 'bold' }
    }
  });

  doc.save(`Rekap_Kas_RT_Bank_Sampah_Aktif_${new Date().toISOString().slice(0, 10)}.pdf`);
};

// Export Transaksi Ledger to PDF
export const exportTransaksiPDF = (transaksiList, filterInfo = 'Semua Periode') => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.setTextColor(22, 101, 52);
  doc.text('BANK SAMPAH AKTIF MEKARJAYA', 14, 15);
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('Program Bank Sampah Aktif Desa Mekarjaya • 4 Wadah Terpilah & Kas RT', 14, 21);
  doc.text('Program Kerja Individu KKM Informatika UMC 2026 - Kec. Ciawigebang, Kuningan', 14, 26);
  doc.line(14, 29, 196, 29);

  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(`LAPORAN BUKU TRANSAKSI (${filterInfo.toUpperCase()})`, 14, 37);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Total Transaksi: ${transaksiList.length} | Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 42);

  const tableData = transaksiList.map((t, i) => [
    i + 1,
    t.kode_transaksi,
    formatDate(t.created_at, true),
    t.rt_nama || t.nasabah_nama || '-',
    t.jenis === 'penjualan' ? 'PENJUALAN (+)' : 'PENYALURAN (-)',
    t.jenis === 'penjualan' ? formatWeight(t.total_berat_kg) : '-',
    formatRupiah(t.total_nominal),
    t.keterangan || '-'
  ]);

  autoTable(doc, {
    startY: 46,
    head: [['No', 'Kode TRX', 'Waktu', 'Alokasi RT', 'Jenis Mutasi', 'Berat Sampah', 'Nominal', 'Keterangan']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [22, 163, 74], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      4: { halign: 'center' },
      5: { halign: 'right' },
      6: { halign: 'right', fontStyle: 'bold' }
    }
  });

  doc.save(`Laporan_Transaksi_Kas_RT_Mekarjaya_${new Date().toISOString().slice(0, 10)}.pdf`);
};

// Generate Single Digital Receipt PDF
export const exportSingleReceiptPDF = (tx, rt, items = []) => {
  const doc = new jsPDF({
    unit: 'mm',
    format: [80, 160] // Thermal receipt dimensions 80mm
  });

  doc.setFontSize(10);
  doc.setTextColor(22, 101, 52);
  doc.text('BANK SAMPAH AKTIF MEKARJAYA', 40, 8, { align: 'center' });
  
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Pos Pemilahan 4 Wadah Terpilah', 40, 12, { align: 'center' });
  doc.text('Tabungan Kas Warga RT • KKM UMC 2026', 40, 15, { align: 'center' });
  doc.line(4, 18, 76, 18);

  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`Kode: ${tx.kode_transaksi}`, 4, 23);
  doc.text(`Waktu: ${formatDate(tx.created_at, true)}`, 4, 27);
  doc.text(`Alokasi RT: ${rt ? rt.nama_rt : tx.rt_nama}`, 4, 31);
  if (rt?.dusun) {
    doc.text(`Dusun: ${rt.dusun}`, 4, 35);
  }
  const isPenjualan = tx.jenis === 'penjualan' || tx.jenis === 'setor';
  doc.text(`Jenis: ${isPenjualan ? 'HASIL PENJUALAN SAMPAH' : 'PENYALURAN DANA KAS RT'}`, 4, 39);
  doc.line(4, 41, 76, 41);

  let currentY = 46;

  if (isPenjualan && items && items.length > 0) {
    doc.setFontSize(7);
    doc.text('Kategori', 4, currentY);
    doc.text('Kg x Tarif', 40, currentY);
    doc.text('Subtotal', 76, currentY, { align: 'right' });
    currentY += 4;
    doc.line(4, currentY - 1, 76, currentY - 1);

    items.forEach(item => {
      doc.text(String(item.nama_kategori || '').substring(0, 18), 4, currentY);
      doc.text(`${item.berat_kg}kg @${(item.harga_per_kg || 0).toLocaleString()}`, 40, currentY);
      doc.text(formatRupiah(item.subtotal), 76, currentY, { align: 'right' });
      currentY += 4;
    });

    doc.line(4, currentY, 76, currentY);
    currentY += 4;
    doc.setFontSize(8);
    doc.text(`Total Berat: ${formatWeight(tx.total_berat_kg)}`, 4, currentY);
    currentY += 4;
  }

  doc.setFontSize(9);
  doc.text(isPenjualan ? 'DANA MASUK KAS:' : 'TOTAL DANA DISALURKAN:', 4, currentY);
  doc.text(formatRupiah(tx.total_nominal), 76, currentY, { align: 'right' });
  currentY += 6;

  if (rt && rt.saldo_kas !== undefined) {
    doc.setFontSize(8);
    doc.text('Saldo Kas RT Terkini:', 4, currentY);
    doc.text(formatRupiah(rt.saldo_kas), 76, currentY, { align: 'right' });
    currentY += 5;
  }

  doc.line(4, currentY, 76, currentY);
  currentY += 4;
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Pilah Sampahmu di 4 Wadah Bank Sampah Aktif', 40, currentY, { align: 'center' });
  doc.text('Menjadi Tabungan Nyata Kesejahteraan Warga RT!', 40, currentY + 3.5, { align: 'center' });

  doc.save(`Struk_${tx.kode_transaksi}.pdf`);
};

// Export Buku Panduan Sistem to Official PDF Document
export const exportPanduanPDF = () => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryColor = [22, 101, 52]; // Dark emerald #166534
  const slateDark = [15, 23, 42]; // #0f172a
  const slateMuted = [100, 116, 139]; // #64748b
  const amberBg = [254, 243, 199]; // #fef3c7
  const amberBorder = [245, 158, 11]; // #f59e0b
  const amberText = [146, 64, 14]; // #92400e

  // Helper for automatic page breaking
  let currentY = 32;
  const checkPageBreak = (neededHeight) => {
    if (currentY + neededHeight > 275) {
      doc.addPage();
      currentY = 20;
      return true;
    }
    return false;
  };

  // 1. Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13.5);
  doc.setFont('helvetica', 'bold');
  doc.text('BUKU PANDUAN RESMI PENGURUS BANK SAMPAH', 14, 11);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Bank Sampah Aktif Desa Mekarjaya, Ciawigebang, Kuningan • KKM Informatika UMC 2026', 14, 18);

  // Subtitle / Intro Note
  doc.setTextColor(...slateDark);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.text('Buku panduan praktis dan operasional sistem pencatatan berbasis 4 Wadah Pemilahan Sampah & Kas Komunal RT.', 14, currentY);
  currentY += 7;

  // BAGIAN A: FUNGSI RINGKAS 8 MENU UTAMA
  doc.setTextColor(...primaryColor);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('A. Ringkasan Fungsi 8 Menu Utama Sistem', 14, currentY);
  currentY += 4;

  const menuRows = [
    ['1. Ringkasan & Kas RT', 'Melihat total saldo kas semua RT, total kg sampah, grafik penjualan, dan aktivitas dusun.'],
    ['2. Timbang & Jual Sampah', 'Mencatat sampah hasil pilahan 4 wadah yang dijual ke pengepul, otomatis masuk saldo kas RT.'],
    ['3. Penyaluran Dana Kas', 'Mencatat pengeluaran/pencairan uang kas RT untuk kegiatan warga (lampu jalan, santunan, dll).'],
    ['4. Data RT & Tabungan', 'Melihat daftar seluruh RT se-Desa Mekarjaya, kontak ketua RT, dan kartu digital kas RT.'],
    ['5. Buku Jurnal Mutasi', 'Buku catatan semua uang kas masuk (+) dan keluar (-) secara transparan beserta cetak ulang nota.'],
    ['6. Katalog 4 Wadah', 'Tempat mengecek dan mengubah tarif acuan harga beli/jual sampah per kg dari bakul/pengepul.'],
    ['7. Laporan & Ekspor Data', 'Mencetak berkas rekapitulasi kas RT format PDF resmi ber-kop desa dan unduh data ke Excel (CSV).'],
    ['8. Template Pembukuan', 'Mengunduh 9 master formulir cetak (buku kas, buku timbang, daftar harga, tanda terima, dll).']
  ];

  autoTable(doc, {
    startY: currentY,
    head: [['Menu Utama', 'Kegunaan & Fungsi Praktis']],
    body: menuRows,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: slateDark,
      cellPadding: 2
    },
    columnStyles: {
      0: { cellWidth: 46, fontStyle: 'bold' },
      1: { cellWidth: 136 }
    },
    margin: { left: 14, right: 14 }
  });

  currentY = doc.lastAutoTable.finalY + 9;

  // BAGIAN B: PANDUAN LANGKAH DEMI LANGKAH (7 TUGAS HARIAN)
  checkPageBreak(15);
  doc.setTextColor(...primaryColor);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('B. Panduan Praktis Langkah Demi Langkah (7 Tugas Utama Pengurus)', 14, currentY);
  currentY += 4;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...slateMuted);
  doc.text('Ikuti panduan langkah berurut di bawah ini sesuai aktivitas yang ingin Anda kerjakan:', 14, currentY);
  currentY += 6;

  const allTasks = [
    {
      num: 1,
      judul: 'Cara Mencatat Sampah yang Dijual (Uang Masuk ke Kas RT)',
      kategori: 'Harian',
      menuAsal: 'Menu: Timbang & Jual Sampah',
      langkah: [
        'Buka menu "Timbang & Jual Sampah" di bilah samping.',
        'Pilih nama RT yang sampahnya dijual (misal: RT 01 Dusun Cimenang).',
        'Pilih wadah sampah (Botol Plastik, Kardus/Kertas, Plastik Campur, Besi/Kaca), lalu ketik beratnya berapa Kilogram (Kg). Harganya otomatis dihitung.',
        'Kalau ada jenis wadah lain yang ikut ditimbang, klik tombol "+ Tambah Kategori Sampah".',
        'Klik tombol hijau "Simpan & Cetak Bukti". Uang kas RT otomatis bertambah dan nota struk bukti langsung muncul!'
      ],
      tips: 'Gunakan timbangan kiloan biasa di pos wadah. Setelah selesai, nota struk bukti bisa langsung disimpan ke HP atau dicetak.'
    },
    {
      num: 2,
      judul: 'Cara Mencatat Pengeluaran Uang Kas RT (Uang Keluar)',
      kategori: 'Harian',
      menuAsal: 'Menu: Penyaluran Dana Kas',
      langkah: [
        'Buka menu "Penyaluran Dana Kas".',
        'Pilih nama RT yang ingin mencairkan uang kas tabungannya.',
        'Ketik jumlah uang yang mau diambil. Tidak perlu repot ketik titik, titik pemisah ribuan otomatis muncul sendiri (misal ketik 50000 langsung jadi 50.000).',
        'Tulis uangnya digunakan untuk keperluan apa pada kolom catatan (contoh: "Beli lampu jalan gang RT 01").',
        'Klik tombol "Proses Penyaluran Kas". Selesai! Uang kas RT otomatis terpotong secara transparan.'
      ],
      tips: 'Sistem otomatis menolak jika uang yang mau diambil melebihi sisa tabungan RT, jadi kas tetap aman dan tidak bisa minus.'
    },
    {
      num: 3,
      judul: 'Cara Melihat Catatan Uang & Cetak Ulang Nota Struk Bukti',
      kategori: 'Pemeriksaan',
      menuAsal: 'Menu: Buku Jurnal Mutasi',
      langkah: [
        'Buka menu "Buku Jurnal Mutasi". Di sini terlihat semua daftar uang masuk (tanda + hijau) dan uang keluar (tanda - kuning).',
        'Klik pada salah satu baris transaksi untuk melihat rincian berapa kilogram botol atau kardus yang dulu ditimbang.',
        'Klik gambar kertas/printer di sebelah kanan jika ingin melihat atau mencetak ulang nota struk bukti untuk warga.'
      ],
      tips: 'Semua catatan mutasi kas tersimpan permanen secara online dan tidak akan hilang meskipun komputer atau HP dimatikan.'
    },
    {
      num: 4,
      judul: 'Cara Mengganti Harga Sampah Kalau Ada Kenaikan/Penurunan',
      kategori: 'Pengaturan',
      menuAsal: 'Menu: Katalog 4 Wadah',
      langkah: [
        'Buka menu "Katalog 4 Wadah". Di situ terlihat 4 wadah utama: Botol Plastik, Plastik Campur, Kardus/Kertas, dan Besi/Kaca.',
        'Klik tombol "Edit" pada jenis sampah yang harganya ingin diganti.',
        'Ketik harga baru per kilo dari pengepul (misal ganti jadi 3.500).',
        'Klik "Simpan Perubahan". Penimbangan selanjutnya otomatis langsung memakai harga baru tersebut.'
      ],
      tips: 'Harga acuan ini bisa disesuaikan kapan saja mengikuti kesepakatan harga terkini dengan bakul/pengepul sampah desa.'
    },
    {
      num: 5,
      judul: 'Cara Menambah RT Baru atau Mengganti Nama Ketua RT',
      kategori: 'Pengaturan',
      menuAsal: 'Menu: Data RT & Tabungan',
      langkah: [
        'Buka menu "Data RT & Tabungan" untuk melihat seluruh unit RT di Dusun Cimenang, Ciganda, dan Cimuda.',
        'Kalau ada pergantian ketua RT, cukup klik gambar Pensil (Edit) di samping nama RT, perbarui nama/nomor HP, lalu simpan.',
        'Kalau ingin menambah unit RT baru, klik tombol "+ Tambah Unit RT Baru" di pojok kanan atas.',
        'Klik gambar Kartu untuk melihat "Kartu Digital Kas RT" lengkap dengan barcode untuk ditunjukkan ke ketua RT.'
      ],
      tips: 'Pastikan nomor HP/WhatsApp ketua RT dicatat dengan benar agar mudah dihubungi saat pembagian hasil kas.'
    },
    {
      num: 6,
      judul: 'Cara Download Formulir & Buku Pembukuan untuk Ditulis Tangan',
      kategori: 'Dokumen',
      menuAsal: 'Menu: Template Pembukuan',
      langkah: [
        'Buka menu "Template Pembukuan". Di situ tersedia 9 pilihan formulir cetak (Buku Kas, Buku Timbang, Buku Register, Daftar Harga, dll).',
        'Pilih buku formulir yang Anda perlukan, lalu klik tombol hijau "Unduh Template (PDF)".',
        'File formulir PDF akan tersimpan di komputer/HP Anda. Silakan buka dan cetak di kertas biasa (A4 atau Folio).',
        'Formulir cetak ini bisa diletakkan di pos wadah untuk dicatat menggunakan pulpen saat warga menyetor sampah.'
      ],
      tips: 'Buku Tabungan Kas RT dan Buku Penerimaan Sampah sangat dianjurkan dicetak sebagai pegangan arsip fisik masing-masing ketua RT.'
    },
    {
      num: 7,
      judul: 'Cara Mencetak Rekapitulasi Laporan Bulanan untuk Desa',
      kategori: 'Dokumen',
      menuAsal: 'Menu: Laporan & Ekspor Data',
      langkah: [
        'Buka menu "Laporan & Ekspor Data".',
        'Klik tombol "Unduh PDF Rekap Kas RT" untuk mencetak daftar saldo kas seluruh RT pada lembar kertas resmi ber-kop desa.',
        'Klik tombol "Unduh PDF Jurnal Mutasi" untuk mencetak bukti rangkuman seluruh transaksi masuk dan keluar.',
        'Jika ingin mengolah laporan lebih lanjut di laptop dengan Microsoft Excel, klik tombol "Unduh Format Excel (CSV)".'
      ],
      tips: 'Laporan PDF ini sudah dilengkapi kolom tanda tangan resmi untuk diserahkan ke Kepala Desa Mekarjaya atau rapat RT.'
    }
  ];

  allTasks.forEach(task => {
    let estimatedH = 8;
    task.langkah.forEach(l => {
      const lines = doc.splitTextToSize(l, 172);
      estimatedH += lines.length * 3.5 + 1.2;
    });
    const tipLines = doc.splitTextToSize('Tips Pengurus: ' + task.tips, 172);
    estimatedH += tipLines.length * 3.2 + 8;

    checkPageBreak(estimatedH);

    // Header Box
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(14, currentY, 182, 6.5, 1, 1, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(22, 101, 52);
    doc.text(`${task.num}. ${task.judul}`, 17, currentY + 4.5);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`[${task.kategori}] • ${task.menuAsal}`, 192, currentY + 4.5, { align: 'right' });
    currentY += 9;

    // Steps
    task.langkah.forEach((l, sIdx) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(22, 101, 52);
      doc.text(`${sIdx + 1}.`, 16, currentY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(30, 41, 59);
      const stepLines = doc.splitTextToSize(l, 172);
      doc.text(stepLines, 21, currentY);
      currentY += stepLines.length * 3.5 + 1.2;
    });

    // Tips box
    const tipBoxH = tipLines.length * 3.2 + 3.5;
    doc.setFillColor(...amberBg);
    doc.setDrawColor(...amberBorder);
    doc.roundedRect(17, currentY, 179, tipBoxH, 1, 1, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...amberText);
    doc.text(tipLines, 20, currentY + 3);
    currentY += tipBoxH + 4.5;
  });

  // Section C: FAQ
  checkPageBreak(30);
  doc.setTextColor(...primaryColor);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('C. Tanya Jawab Sering Ditanyakan (Anti-Bingung)', 14, currentY);
  currentY += 6;

  const faqs = [
    {
      tanya: 'Saya gaptek dan takut salah pencet tombol, apakah datanya bisa rusak?',
      jawab: 'Tenang saja! Aplikasi ini sangat aman. Jika salah ketik angka, Anda bisa membatalkannya sebelum menekan tombol simpan. Kalau ada salah catat, uang kas bisa disesuaikan kapan saja lewat transaksi penyesuaian.'
    },
    {
      tanya: 'Bagaimana cara warga biasa mengecek uang kas RT-nya sendiri?',
      jawab: 'Sangat gampang! Warga cukup membuka website ini dari HP masing-masing tanpa perlu kata sandi (password). Lalu klik menu "Buku Tabungan Kas RT", pilih nomor RT mereka, dan saldo kas beserta catatan uang masuk langsung terlihat jelas.'
    },
    {
      tanya: 'Kalau saya tidak punya mesin printer kasir, apakah tetap bisa kasih bukti ke warga?',
      jawab: 'Tentu bisa! Saat selesai menimbang, klik tombol "Unduh PDF" pada nota. File nota bukti itu bisa langsung Anda kirim lewat WhatsApp ke nomor ketua RT atau grup warga.'
    },
    {
      tanya: 'Waktu mengetik uang penyaluran kas, apakah saya harus ketik tanda titiknya?',
      jawab: 'Tidak usah repot! Cukup ketik angkanya saja. Misalnya ketik 50000, sistem otomatis menampilkan 50.000 dengan titik pemisah ribuan secara rapi dan ada tulisan konfirmasi di bawahnya.'
    }
  ];

  faqs.forEach(faq => {
    const qLines = doc.splitTextToSize(`Tanya: ${faq.tanya}`, 178);
    const aLines = doc.splitTextToSize(`Jawab: ${faq.jawab}`, 178);
    const needed = (qLines.length + aLines.length) * 3.5 + 5;
    checkPageBreak(needed);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(22, 101, 52);
    doc.text(qLines, 14, currentY);
    currentY += qLines.length * 3.5 + 1;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(aLines, 14, currentY);
    currentY += aLines.length * 3.5 + 3.5;
  });

  // Footer on all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(...slateMuted);
    doc.text(
      `Bank Sampah Aktif Desa Mekarjaya • Buku Panduan Lengkap Sistem • Halaman ${i} dari ${pageCount}`,
      105,
      290,
      { align: 'center' }
    );
  }

  doc.save('Buku_Panduan_Bank_Sampah_Mekarjaya.pdf');
};

