import React from 'react';
import { X, Printer, Recycle, MapPin, Building2, CreditCard, Scale, Phone } from 'lucide-react';
import { formatRupiah, formatWeight } from '../../lib/utils';

export const NasabahCardModal = ({ isOpen, onClose, nasabah }) => {
  if (!isOpen || !nasabah) return null;

  const handlePrint = () => {
    window.print();
  };

  const rtName = nasabah.nama_rt || nasabah.nama;
  const kodeRt = nasabah.kode_rt || '-';
  const saldoKas = nasabah.saldo_kas ?? nasabah.saldo_aktif ?? 0;
  const totalSampah = nasabah.total_sampah_terkumpul_kg ?? 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-scale-in">
        {/* Top bar */}
        <div className="no-print bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            Kartu Informasi Kas Tabungan RT
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Printable Card */}
        <div className="p-6 space-y-4">
          <div
            id="printable-receipt"
            className="bg-gradient-to-tr from-emerald-900 via-emerald-800 to-teal-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[230px]"
          >
            {/* Background watermarks */}
            <div className="absolute right-0 bottom-0 translate-x-6 translate-y-6 opacity-10 pointer-events-none">
              <Recycle className="w-48 h-48 text-white" />
            </div>

            {/* Header Card */}
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <img 
                  src="/kab_kuningan.png" 
                  alt="Logo Kabupaten Kuningan" 
                  className="w-9 h-9 object-contain drop-shadow-sm"
                />
                <div>
                  <h4 className="font-extrabold text-sm tracking-tight text-white leading-none">
                    BANK SAMPAH DESA MEKARJAYA
                  </h4>
                  <p className="text-[9px] text-emerald-200 mt-0.5">
                    Pos Pemilahan 4 Wadah & Kas Warga RT
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-white/20 text-white backdrop-blur-xs border border-white/20">
                UNIT RT
              </span>
            </div>

            {/* Account Info */}
            <div className="my-3 relative z-10 space-y-1">
              <div className="font-mono text-sm font-extrabold tracking-widest text-emerald-300">
                {kodeRt}
              </div>
              <div className="font-extrabold text-lg text-white truncate">
                {rtName}
              </div>
              <div className="text-[11px] text-emerald-100 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-300" />
                {nasabah.dusun} • RW {nasabah.rw || '01'}
              </div>
              {nasabah.ketua_rt && (
                <div className="text-[10px] text-emerald-200 flex items-center gap-1 mt-1">
                  <span>Ketua RT: <strong>{nasabah.ketua_rt}</strong></span>
                  {nasabah.no_telepon && <span>({nasabah.no_telepon})</span>}
                </div>
              )}
            </div>

            {/* Card Footer */}
            <div className="pt-3 border-t border-white/20 flex items-end justify-between relative z-10 text-[10px]">
              <div>
                <span className="text-emerald-300 block text-[8px] uppercase font-bold">Total Sampah RA Terjual</span>
                <span className="font-bold text-white text-xs">{formatWeight(totalSampah)}</span>
              </div>
              <div className="text-right">
                <span className="text-emerald-300 block text-[8px] uppercase font-bold">Saldo Kas RT Terkini</span>
                <span className="font-black text-emerald-200 text-sm">{formatRupiah(saldoKas)}</span>
              </div>
            </div>
          </div>

          <p className="no-print text-center text-[11px] text-slate-500">
            Kartu informasi alokasi tabungan kas warga RT dari hasil penjualan sampah 4 wadah di RA Mekarjaya.
          </p>
        </div>

        {/* Action button */}
        <div className="no-print bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            Cetak Kartu
          </button>
        </div>
      </div>
    </div>
  );
};
