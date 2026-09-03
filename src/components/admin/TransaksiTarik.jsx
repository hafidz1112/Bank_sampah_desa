import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  UserCheck, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  Coins,
  DollarSign
} from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';
import { formatRupiah } from '../../lib/utils';
import { ReceiptModal } from '../common/ReceiptModal';
import { Select } from '../ui/Select';

export const TransaksiTarik = () => {
  const { nasabahList, processPenarikan } = useBankSampah();

  const [selectedNasabahId, setSelectedNasabahId] = useState('');
  const [nominal, setNominal] = useState('');
  const [keterangan, setKeterangan] = useState('Penarikan saldo tunai');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Receipt Modal
  const [completedTx, setCompletedTx] = useState(null);
  const [completedNasabah, setCompletedNasabah] = useState(null);

  const selectedNasabah = nasabahList.find(n => n.id === Number(selectedNasabahId));
  const withdrawAmount = parseFloat(nominal) || 0;

  const nasabahOptions = nasabahList.map(n => ({
    value: n.id,
    label: `${n.nama} [${n.no_rekening}]`,
    sublabel: `${n.dusun} • Saldo: ${formatRupiah(n.saldo_aktif)}`,
    searchValue: `${n.nama} ${n.no_rekening} ${n.nik} ${n.dusun}`
  }));
  const currentSaldo = selectedNasabah ? (parseFloat(selectedNasabah.saldo_aktif) || 0) : 0;
  const remainingSaldo = currentSaldo - withdrawAmount;
  const isInsufficient = selectedNasabah && withdrawAmount > currentSaldo;

  const handleQuickAmount = (amt) => {
    if (amt === 'all') {
      setNominal(String(currentSaldo));
    } else {
      setNominal(String(amt));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedNasabahId) {
      setErrorMsg('Pilih nasabah yang akan melakukan penarikan.');
      return;
    }

    if (withdrawAmount <= 0) {
      setErrorMsg('Nominal penarikan harus lebih dari Rp 0.');
      return;
    }

    if (isInsufficient) {
      setErrorMsg(`Saldo tidak mencukupi. Saldo aktif saat ini: ${formatRupiah(currentSaldo)}`);
      return;
    }

    setLoading(true);
    const res = await processPenarikan({
      nasabahId: selectedNasabahId,
      nominal: withdrawAmount,
      keterangan
    });
    setLoading(false);

    if (res.success) {
      setCompletedTx(res.transaksi);
      setCompletedNasabah(res.nasabah);
      setNominal('');
      setKeterangan('Penarikan saldo tunai');
    } else {
      setErrorMsg(res.error || 'Gagal memproses penarikan.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Form Penarikan Saldo Tabungan Warga
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Proses pencairan dana tabungan sampah nasabah dengan validasi kecukupan saldo otomatis
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Nasabah Selection */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-amber-800">
            1. Pilih Nasabah Penarik
          </label>

          <Select
            value={selectedNasabahId}
            onChange={(val) => setSelectedNasabahId(val)}
            options={nasabahOptions}
            placeholder="-- Pilih Nasabah / Rekening --"
            searchable={true}
            searchPlaceholder="Ketik nama, dusun, atau no rekening..."
            size="md"
          />

          {/* Balance card */}
          {selectedNasabah && (
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 flex items-center justify-between text-xs animate-fade-in">
              <div>
                <div className="font-extrabold text-sm text-amber-950">{selectedNasabah.nama}</div>
                <div className="text-[11px] text-amber-800">
                  {selectedNasabah.dusun} • RT {selectedNasabah.rt}/RW {selectedNasabah.rw}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-amber-700 block">Saldo Aktif Saat Ini:</span>
                <span className="text-xl font-black text-amber-900 font-sans">
                  {formatRupiah(currentSaldo)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Amount Input */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-amber-800">
            2. Nominal Penarikan Tunai
          </label>

          <div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                Rp
              </span>
              <input
                type="number"
                min="1000"
                step="500"
                required
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                placeholder="0"
                className={`w-full pl-12 pr-4 py-3.5 rounded-2xl border text-lg font-extrabold focus:outline-none focus:ring-2 font-mono ${
                  isInsufficient
                    ? 'border-red-400 text-red-600 focus:ring-red-500 bg-red-50/30'
                    : 'border-slate-200 text-slate-900 focus:ring-amber-500'
                }`}
              />
            </div>

            {isInsufficient && (
              <p className="text-xs text-red-600 font-semibold mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Nominal penarikan melebihi saldo aktif nasabah!
              </p>
            )}
          </div>

          {/* Quick preset amount chips */}
          {selectedNasabah && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-500">Pilihan Cepat Nominal:</span>
              <div className="flex flex-wrap gap-2">
                {[10000, 25000, 50000, 100000].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    disabled={amt > currentSaldo}
                    onClick={() => handleQuickAmount(amt)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-xs font-bold text-slate-700 transition disabled:opacity-30 disabled:pointer-events-none"
                  >
                    {formatRupiah(amt)}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={currentSaldo <= 0}
                  onClick={() => handleQuickAmount('all')}
                  className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 hover:bg-amber-200 text-xs font-bold transition disabled:opacity-30"
                >
                  Tarik Semua ({formatRupiah(currentSaldo)})
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Keterangan Penarikan
            </label>
            <input
              type="text"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Contoh: Keperluan belanja dapur / uang saku"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Summary & Submit */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-800 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Sisa Saldo Setelah Penarikan
            </span>
            <div className="text-2xl sm:text-3xl font-black font-sans text-white mt-1">
              {formatRupiah(selectedNasabah ? Math.max(0, remainingSaldo) : 0)}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedNasabahId || withdrawAmount <= 0 || isInsufficient}
            className="px-8 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-amber-950 font-black text-sm shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5 text-amber-700" />
            <span>{loading ? 'Memproses...' : 'Proses Penarikan Tunai'}</span>
          </button>
        </div>
      </form>

      {/* Digital Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(completedTx)}
        onClose={() => setCompletedTx(null)}
        transaksi={completedTx}
        nasabah={completedNasabah}
      />
    </div>
  );
};
