import React from 'react';
import { Printer, Download, X, CheckCircle2, Recycle, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import { formatRupiah, formatWeight, formatDate } from '../../lib/utils';
import { exportSingleReceiptPDF } from '../../lib/exportUtils';

export const ReceiptModal = ({ isOpen, onClose, transaksi, nasabah }) => {
  if (!isOpen || !transaksi) return null;

  const isPenjualan = transaksi.jenis === 'penjualan' || transaksi.jenis === 'setor';
  const targetRt = nasabah || transaksi.rt || {};
  const rtName = targetRt.nama_rt || targetRt.nama || transaksi.rt_nama || transaksi.nasabah_nama || 'Unit RT Mekarjaya';
  const rtKode = targetRt.kode_rt || targetRt.no_rekening || transaksi.rt_kode || transaksi.nasabah_no_rekening || '-';
  const dusun = targetRt.dusun || '';
  const ketua = targetRt.ketua_rt || '';
  const saldoKas = targetRt.saldo_kas ?? targetRt.saldo_aktif;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    exportSingleReceiptPDF(transaksi, targetRt, transaksi.items || []);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-scale-in">
        {/* Top Action Bar (hidden on print) */}
        <div className="no-print bg-slate-50 px-6 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">Bukti Transaksi Kas RT</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${
              isPenjualan ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {isPenjualan ? 'Penjualan' : 'Penyaluran'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Canvas */}
        <div id="printable-receipt" className="p-6 bg-white font-mono text-xs text-slate-800 space-y-3">
          {/* Header */}
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300">
            <div className="flex items-center justify-center gap-1.5 font-bold text-base text-emerald-800 font-sans">
              <Recycle className="w-5 h-5 text-emerald-600 inline" />
              BANK SAMPAH DESA MEKARJAYA
            </div>
            <div className="text-[11px] font-sans text-slate-600">
              Pos Pemilahan 4 Wadah di RA & Kas RT
            </div>
            <div className="text-[10px] text-slate-500 font-sans">
              Desa Mekarjaya, Ciawigebang, Kuningan
            </div>
            <div className="text-[9px] text-slate-400 font-sans">
              KKM Informatika UMC 2026
            </div>
          </div>

          {/* Meta Info */}
          <div className="space-y-1.5 py-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">No. Transaksi:</span>
              <span className="font-bold">{transaksi.kode_transaksi}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Waktu:</span>
              <span>{formatDate(transaksi.created_at, true)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Alokasi Unit RT:</span>
              <span className="font-semibold">{rtName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Kode RT:</span>
              <span className="font-mono">{rtKode}</span>
            </div>
            {dusun && (
              <div className="flex justify-between">
                <span className="text-slate-500">Wilayah Dusun:</span>
                <span>{dusun}</span>
              </div>
            )}
            {ketua && (
              <div className="flex justify-between">
                <span className="text-slate-500">Ketua RT:</span>
                <span>{ketua}</span>
              </div>
            )}
          </div>

          {/* Details Table */}
          <div className="border-t border-b border-dashed border-slate-300 py-2.5">
            {isPenjualan && transaksi.items && transaksi.items.length > 0 ? (
              <div className="space-y-2">
                <div className="grid grid-cols-12 font-bold text-[10px] text-slate-600 uppercase">
                  <div className="col-span-6">Wadah Sampah RA</div>
                  <div className="col-span-3 text-right">Berat / Tarif</div>
                  <div className="col-span-3 text-right">Subtotal</div>
                </div>
                {transaksi.items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 text-[11px] gap-1">
                    <div className="col-span-6 truncate font-sans">{item.nama_kategori}</div>
                    <div className="col-span-3 text-right text-slate-500">
                      {item.berat_kg}kg @{(item.harga_per_kg || 0).toLocaleString()}
                    </div>
                    <div className="col-span-3 text-right font-semibold">
                      {formatRupiah(item.subtotal)}
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-100 flex justify-between text-slate-600 text-[11px]">
                  <span>Total Berat Terjual:</span>
                  <span className="font-bold">{formatWeight(transaksi.total_berat_kg)}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 py-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Jenis Transaksi:</span>
                  <span className="font-bold text-amber-700">PENYALURAN DANA KAS RT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Peruntukan:</span>
                  <span className="text-slate-700">{transaksi.keterangan || 'Kegiatan warga RT'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Grand Total */}
          <div className="space-y-1 pt-1">
            <div className="flex justify-between items-center text-sm font-bold font-sans">
              <span className="text-slate-700">TOTAL {isPenjualan ? 'HASIL PENJUALAN' : 'DANA DISALURKAN'}:</span>
              <span className={`text-base font-extrabold ${isPenjualan ? 'text-emerald-700' : 'text-amber-700'}`}>
                {formatRupiah(transaksi.total_nominal)}
              </span>
            </div>

            {saldoKas !== undefined && (
              <div className="flex justify-between items-center text-xs text-slate-600 pt-1 border-t border-slate-100">
                <span>Saldo Kas RT Terkini:</span>
                <span className="font-bold text-emerald-800 font-sans">{formatRupiah(saldoKas)}</span>
              </div>
            )}
          </div>

          {/* Barcode & Footer note */}
          <div className="pt-4 text-center space-y-2 border-t border-dashed border-slate-300">
            <div className="font-mono text-[10px] tracking-widest text-slate-400">
              *|||||||||||| {transaksi.kode_transaksi} ||||||||||||*
            </div>
            <p className="text-[10px] text-slate-500 font-sans italic leading-tight">
              Sampah terpilah 4 wadah di RA dimanfaatkan menjadi dana kas kemaslahatan warga RT Desa Mekarjaya.
            </p>
          </div>
        </div>

        {/* Action Buttons (hidden on print) */}
        <div className="no-print bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={handleDownloadPDF}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-medium text-xs shadow-sm transition"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Unduh PDF
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm shadow-emerald-600/30 transition"
          >
            <Printer className="w-4 h-4" />
            Cetak Nota
          </button>
        </div>
      </div>
    </div>
  );
};
