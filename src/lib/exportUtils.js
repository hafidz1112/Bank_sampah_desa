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

// Export Nasabah Table to PDF
export const exportNasabahPDF = (nasabahList) => {
  const doc = new jsPDF();

  // Header Desa Mekarjaya
  doc.setFontSize(16);
  doc.setTextColor(22, 101, 52); // Brand green
  doc.text('SI-BSDes MEKARJAYA', 14, 15);
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('Bank Sampah Desa Terintegrasi - Kec. Ciawigebang, Kab. Kuningan', 14, 21);
  doc.text('Program Kerja Individu KKM Informatika UMC 2026', 14, 26);
  doc.setLineWidth(0.5);
  doc.setDrawColor(203, 213, 225);
  doc.line(14, 29, 196, 29);

  // Title
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('REKAPITULASI DATA NASABAH BANK SAMPAH', 14, 37);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 42);

  const tableData = nasabahList.map((n, i) => [
    i + 1,
    n.no_rekening,
    n.nik,
    n.nama,
    n.dusun,
    `RT ${n.rt} / RW ${n.rw}`,
    n.no_hp || '-',
    formatRupiah(n.saldo_aktif)
  ]);

  autoTable(doc, {
    startY: 46,
    head: [['No', 'No Rekening', 'NIK', 'Nama Nasabah', 'Dusun', 'RT/RW', 'No HP', 'Saldo Aktif']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [22, 163, 74], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      7: { halign: 'right', fontStyle: 'bold' }
    }
  });

  doc.save(`Rekap_Nasabah_BSDes_Mekarjaya_${new Date().toISOString().slice(0, 10)}.pdf`);
};

// Export Transaksi Ledger to PDF
export const exportTransaksiPDF = (transaksiList, filterInfo = 'Semua Periode') => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.setTextColor(22, 101, 52);
  doc.text('SI-BSDes MEKARJAYA', 14, 15);
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('Bank Sampah Desa Terintegrasi - Kec. Ciawigebang, Kab. Kuningan', 14, 21);
  doc.text('Program Kerja Individu KKM Informatika UMC 2026', 14, 26);
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
    t.nasabah_nama,
    t.jenis.toUpperCase(),
    t.jenis === 'setor' ? formatWeight(t.total_berat_kg) : '-',
    formatRupiah(t.total_nominal),
    t.keterangan || '-'
  ]);

  autoTable(doc, {
    startY: 46,
    head: [['No', 'Kode TRX', 'Waktu', 'Nasabah', 'Jenis', 'Berat', 'Nominal', 'Keterangan']],
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

  doc.save(`Laporan_Transaksi_BSDes_Mekarjaya_${new Date().toISOString().slice(0, 10)}.pdf`);
};

// Export Maggot Circular Organic Log to PDF
export const exportLogMaggotPDF = (logList) => {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.setTextColor(180, 83, 9); // Maggot amber color
  doc.text('SI-BSDes MEKARJAYA - SIRKULAR BIOPOND MAGGOT BSF', 14, 15);
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('Integrasi Sampah Organik Desa & Pakan Bebek Petelur BUMDes Mekarjaya', 14, 21);
  doc.line(14, 27, 196, 27);

  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('LOG ALIRAN SAMPAH ORGANIK KE BIOPOND MAGGOT BSF', 14, 35);
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Dicetak pada: ${new Date().toLocaleString('id-ID')}`, 14, 40);

  const tableData = logList.map((l, i) => [
    i + 1,
    formatDate(l.tanggal, false),
    formatWeight(l.volume_sampah_organik_kg),
    l.tujuan_biopond,
    formatWeight(l.est_maggot_panen_kg),
    l.target_alokasi,
    l.keterangan || '-'
  ]);

  autoTable(doc, {
    startY: 44,
    head: [['No', 'Tanggal', 'Sampah Organik', 'Unit Biopond', 'Est. Panen Maggot', 'Alokasi Pakan', 'Catatan']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [217, 119, 6], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      2: { halign: 'right', fontStyle: 'bold' },
      4: { halign: 'right', fontStyle: 'bold' }
    }
  });

  doc.save(`Log_Sirkular_Maggot_BSF_Mekarjaya_${new Date().toISOString().slice(0, 10)}.pdf`);
};

// Generate Single Digital Receipt PDF
export const exportSingleReceiptPDF = (tx, nasabah, items = []) => {
  const doc = new jsPDF({
    unit: 'mm',
    format: [80, 160] // Thermal receipt dimensions 80mm
  });

  doc.setFontSize(10);
  doc.setTextColor(22, 101, 52);
  doc.text('BANK SAMPAH DESA MEKARJAYA', 40, 8, { align: 'center' });
  
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Kec. Ciawigebang, Kab. Kuningan', 40, 12, { align: 'center' });
  doc.text('KKM Informatika UMC 2026', 40, 15, { align: 'center' });
  doc.line(4, 18, 76, 18);

  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`Kode: ${tx.kode_transaksi}`, 4, 23);
  doc.text(`Waktu: ${formatDate(tx.created_at, true)}`, 4, 27);
  doc.text(`Nasabah: ${nasabah ? nasabah.nama : tx.nasabah_nama}`, 4, 31);
  doc.text(`No. Rek: ${nasabah ? nasabah.no_rekening : tx.nasabah_no_rekening}`, 4, 35);
  doc.text(`Jenis: ${tx.jenis.toUpperCase() === 'SETOR' ? 'SETORAN SAMPAH' : 'PENARIKAN TABUNGAN'}`, 4, 39);
  doc.line(4, 41, 76, 41);

  let currentY = 46;

  if (tx.jenis === 'setor' && items && items.length > 0) {
    doc.setFontSize(7);
    doc.text('Item', 4, currentY);
    doc.text('Kg x Tarif', 40, currentY);
    doc.text('Subtotal', 76, currentY, { align: 'right' });
    currentY += 4;
    doc.line(4, currentY - 1, 76, currentY - 1);

    items.forEach(item => {
      doc.text(item.nama_kategori.substring(0, 18), 4, currentY);
      doc.text(`${item.berat_kg}kg @${item.harga_per_kg}`, 40, currentY);
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
  doc.text('TOTAL NOMINAL:', 4, currentY);
  doc.text(formatRupiah(tx.total_nominal), 76, currentY, { align: 'right' });
  currentY += 6;

  if (nasabah && nasabah.saldo_aktif !== undefined) {
    doc.setFontSize(8);
    doc.text('Saldo Akhir:', 4, currentY);
    doc.text(formatRupiah(nasabah.saldo_aktif), 76, currentY, { align: 'right' });
    currentY += 5;
  }

  doc.line(4, currentY, 76, currentY);
  currentY += 4;
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Terima kasih atas kontribusi Anda', 40, currentY, { align: 'center' });
  doc.text('mewujudkan Desa Mekarjaya Bersih & Mandiri!', 40, currentY + 3.5, { align: 'center' });

  doc.save(`Struk_${tx.kode_transaksi}.pdf`);
};
