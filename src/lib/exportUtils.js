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
