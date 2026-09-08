import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  Home, 
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
  const { rtList, processPenyaluran } = useBankSampah();

  const [selectedRtId, setSelectedRtId] = useState('');
  const [nominal, setNominal] = useState('');
  const [keterangan, setKeterangan] = useState('Penyaluran dana kas untuk kegiatan warga');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Receipt Modal
  const [completedTx, setCompletedTx] = useState(null);
  const [completedRt, setCompletedRt] = useState(null);

  const selectedRt = rtList.find(r => r.id === Number(selectedRtId));
  const withdrawAmount = parseFloat(nominal) || 0;

  const rtOptions = rtList.map(r => ({
    value: r.id,
    label: `${r.nama_rt} [${r.kode_rt}]`,
    sublabel: `${r.dusun} • Ketua: ${r.ketua_rt} • Saldo Kas: ${formatRupiah(r.saldo_kas)}`,
    searchValue: `${r.nama_rt} ${r.kode_rt} ${r.dusun} ${r.ketua_rt}`
  }));

  const currentSaldo = selectedRt ? (parseFloat(selectedRt.saldo_kas) || 0) : 0;
  const remainingSaldo = currentSaldo - withdrawAmount;
  const isInsufficient = selectedRt && withdrawAmount > currentSaldo;

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

    if (!selectedRtId) {
      setErrorMsg('Pilih RT yang akan menyalurkan dana kas.');
      return;
    }

    if (withdrawAmount <= 0) {
      setErrorMsg('Nominal penyaluran harus lebih dari Rp 0.');
      return;
    }

    if (isInsufficient) {
      setErrorMsg(`Saldo kas RT tidak mencukupi. Saldo saat ini: ${formatRupiah(currentSaldo)}`);
      return;
    }

    setLoading(true);
    const res = await processPenyaluran({
      rtId: selectedRtId,
      nominal: withdrawAmount,
      keterangan
    });
    setLoading(false);

    if (res.success) {
      setCompletedTx(res.transaksi);
      setCompletedRt(res.rt);
      setNominal('');
      setKeterangan('Penyaluran dana kas untuk kegiatan warga');
    } else {
      setErrorMsg(res.error || 'Gagal memproses penyaluran kas.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Form Penyaluran Dana Kas Tabungan RT
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Catat pengeluaran saldo tabungan kas warga RT dari hasil penjualan sampah Bank Sampah Aktif untuk kebutuhan fasilitas lingkungan, kegiatan sosial, atau kerja bakti.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* RT Selection */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-amber-800">
            1. Pilih Unit RT yang Menyalurkan Dana
          </label>

          <Select
            value={selectedRtId}
            onChange={(val) => setSelectedRtId(val)}
            options={rtOptions}
            placeholder="-- Pilih Unit RT / Dusun --"
            searchable={true}
            searchPlaceholder="Ketik nomor RT, dusun, atau nama ketua..."
            size="md"
          />

          {/* Balance card */}
          {selectedRt && (
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 flex items-center justify-between text-xs animate-fade-in">
              <div>
                <div className="font-extrabold text-sm text-amber-950">{selectedRt.nama_rt}</div>
                <div className="text-[11px] text-amber-800">
                  {selectedRt.dusun} • RW {selectedRt.rw}
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Ketua RT: <strong>{selectedRt.ketua_rt}</strong> {(selectedRt.kontak || selectedRt.no_telepon) ? `(${selectedRt.kontak || selectedRt.no_telepon})` : ''}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-amber-700 block font-semibold">Saldo Kas Tersedia:</span>
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
            2. Nominal Penyaluran / Pengeluaran Kas
          </label>

          <div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                Rp
              </span>
              <input
                type="number"
                min="1"
                step="any"
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
                <AlertCircle className="w-3.5 h-3.5" /> Nominal pengeluaran melebihi saldo kas RT!
              </p>
            )}
          </div>

          {/* Quick preset amount chips */}
          {selectedRt && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-500">Pilihan Cepat Nominal:</span>
              <div className="flex flex-wrap gap-2">
                {[50000, 100000, 250000, 500000, 1000000].map(amt => (
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
                  Salurkan Semua ({formatRupiah(currentSaldo)})
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Peruntukan / Keterangan Penyaluran Kas
            </label>
            <input
              type="text"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Contoh: Pembelian lampu penerangan jalan gang RT / Kas santunan duka"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Summary & Submit */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-800 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200">
              Sisa Saldo Kas RT Setelah Penyaluran
            </span>
            <div className="text-2xl sm:text-3xl font-black font-sans text-white mt-1">
              {formatRupiah(selectedRt ? Math.max(0, remainingSaldo) : 0)}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedRtId || withdrawAmount <= 0 || isInsufficient}
            className="px-8 py-3.5 rounded-2xl bg-white hover:bg-amber-50 text-amber-950 font-black text-sm shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5 text-amber-700" />
            <span>{loading ? 'Memproses...' : 'Proses Penyaluran Kas'}</span>
          </button>
        </div>
      </form>

      {/* Digital Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(completedTx)}
        onClose={() => setCompletedTx(null)}
        transaksi={completedTx}
        nasabah={completedRt}
      />
    </div>
  );
};
