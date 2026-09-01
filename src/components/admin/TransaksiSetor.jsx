import React, { useState } from 'react';
import { 
  Scale, 
  Plus, 
  Trash2, 
  Calculator, 
  UserCheck, 
  Search, 
  Save, 
  Printer, 
  Sparkles, 
  AlertCircle,
  Coins,
  CheckCircle2
} from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';
import { formatRupiah, formatWeight } from '../../lib/utils';
import { ReceiptModal } from '../common/ReceiptModal';

export const TransaksiSetor = () => {
  const { nasabahList, katalogList, processSetoran } = useBankSampah();

  const [selectedNasabahId, setSelectedNasabahId] = useState('');
  const [searchNasabahQuery, setSearchNasabahQuery] = useState('');
  const [items, setItems] = useState([
    { id: 1, kategori_id: katalogList[0]?.id || 1, berat_kg: '', harga_per_kg: katalogList[0]?.harga_per_kg || 2500, subtotal: 0 }
  ]);
  const [keterangan, setKeterangan] = useState('Setoran sampah rutin');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Receipt Modal state
  const [completedTx, setCompletedTx] = useState(null);
  const [completedNasabah, setCompletedNasabah] = useState(null);

  // Active Catalog
  const activeKatalog = katalogList.filter(k => k.is_active);

  // Selected Nasabah object
  const selectedNasabah = nasabahList.find(n => n.id === Number(selectedNasabahId));

  // Filtered Nasabah dropdown
  const filteredNasabah = nasabahList.filter(n =>
    n.nama.toLowerCase().includes(searchNasabahQuery.toLowerCase()) ||
    n.nik.includes(searchNasabahQuery) ||
    n.no_rekening.toLowerCase().includes(searchNasabahQuery.toLowerCase())
  );

  // Handle Item Row changes
  const handleKategoriChange = (index, katId) => {
    const kat = katalogList.find(k => k.id === Number(katId));
    const newItems = [...items];
    const berat = parseFloat(newItems[index].berat_kg) || 0;
    const harga = kat ? kat.harga_per_kg : 0;
    
    newItems[index] = {
      ...newItems[index],
      kategori_id: Number(katId),
      harga_per_kg: harga,
      subtotal: berat * harga
    };
    setItems(newItems);
  };

  const handleBeratChange = (index, beratVal) => {
    const newItems = [...items];
    const berat = parseFloat(beratVal) || 0;
    const harga = newItems[index].harga_per_kg || 0;

    newItems[index] = {
      ...newItems[index],
      berat_kg: beratVal,
      subtotal: berat * harga
    };
    setItems(newItems);
  };

  const handleAddItem = () => {
    const firstKat = activeKatalog[0] || { id: 1, harga_per_kg: 2500 };
    setItems([
      ...items,
      {
        id: Date.now(),
        kategori_id: firstKat.id,
        berat_kg: '',
        harga_per_kg: firstKat.harga_per_kg,
        subtotal: 0
      }
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculations
  const totalBerat = items.reduce((acc, curr) => acc + (parseFloat(curr.berat_kg) || 0), 0);
  const totalNominal = items.reduce((acc, curr) => acc + (parseFloat(curr.subtotal) || 0), 0);
  const projectedSaldo = selectedNasabah ? (parseFloat(selectedNasabah.saldo_aktif) || 0) + totalNominal : totalNominal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedNasabahId) {
      setErrorMsg('Pilih nasabah penyetor terlebih dahulu.');
      return;
    }

    const validItems = items.filter(it => parseFloat(it.berat_kg) > 0);
    if (validItems.length === 0) {
      setErrorMsg('Masukkan berat sampah yang valid (> 0 kg).');
      return;
    }

    setLoading(true);
    const res = await processSetoran({
      nasabahId: selectedNasabahId,
      items: validItems,
      keterangan
    });
    setLoading(false);

    if (res.success) {
      setCompletedTx(res.transaksi);
      setCompletedNasabah(res.nasabah);
      // Reset form
      setItems([{ id: Date.now(), kategori_id: activeKatalog[0]?.id || 1, berat_kg: '', harga_per_kg: activeKatalog[0]?.harga_per_kg || 2500, subtotal: 0 }]);
      setKeterangan('Setoran sampah rutin');
    } else {
      setErrorMsg(res.error || 'Gagal memproses setoran.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Form Penimbangan & Setoran Sampah
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Timbang sampah warga secara realtime, hitung subtotal otomatis, dan tambahkan saldo nasabah seketika
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Section 1: Pilih Nasabah */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
            <UserCheck className="w-4 h-4" />
            Langkah 1: Identifikasi Nasabah Warga
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Cari / Pilih Nasabah Desa *
              </label>
              <select
                required
                value={selectedNasabahId}
                onChange={(e) => setSelectedNasabahId(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              >
                <option value="">-- Pilih Nama Warga / No Rekening --</option>
                {nasabahList.map(n => (
                  <option key={n.id} value={n.id}>
                    {n.nama} [{n.no_rekening}] - {n.dusun} (Saldo: {formatRupiah(n.saldo_aktif)})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Nasabah Preview Card */}
            {selectedNasabah ? (
              <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs animate-fade-in">
                <div>
                  <div className="font-extrabold text-sm text-emerald-950">{selectedNasabah.nama}</div>
                  <div className="text-[11px] text-emerald-700">
                    {selectedNasabah.dusun} • RT {selectedNasabah.rt}/RW {selectedNasabah.rw}
                  </div>
                  <div className="font-mono text-[10px] text-slate-500">NIK: {selectedNasabah.nik}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-600 block">Saldo Saat Ini:</span>
                  <span className="text-base font-extrabold text-emerald-800 font-sans">
                    {formatRupiah(selectedNasabah.saldo_aktif)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400 flex items-center justify-center">
                Pilih nasabah di atas untuk melihat saldo dan wilayah dusun
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Penimbangan Multi-Item */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
              <Scale className="w-4 h-4" />
              Langkah 2: Penimbangan Sampah per Kategori
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition flex items-center gap-1 border border-emerald-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tambah Baris Sampah</span>
            </button>
          </div>

          <div className="space-y-3">
            {items.map((row, idx) => {
              const selectedKat = katalogList.find(k => k.id === Number(row.kategori_id));
              const isOrganik = selectedKat?.tipe === 'organik';

              return (
                <div
                  key={row.id || idx}
                  className={`p-4 rounded-2xl border transition grid grid-cols-1 sm:grid-cols-12 gap-3 items-center ${
                    isOrganik ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50/60 border-slate-200'
                  }`}
                >
                  {/* Category Selector (5 cols) */}
                  <div className="sm:col-span-5">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Kategori Sampah #{idx + 1}
                    </label>
                    <select
                      value={row.kategori_id}
                      onChange={(e) => handleKategoriChange(idx, e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      {activeKatalog.map(k => (
                        <option key={k.id} value={k.id}>
                          [{k.tipe.toUpperCase()}] {k.nama_kategori} - {formatRupiah(k.harga_per_kg)}/kg
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Weight Input (3 cols) */}
                  <div className="sm:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Berat Timbangan (Kg) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        required
                        value={row.berat_kg}
                        onChange={(e) => handleBeratChange(idx, e.target.value)}
                        placeholder="0.00"
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-mono"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        kg
                      </span>
                    </div>
                  </div>

                  {/* Subtotal (3 cols) */}
                  <div className="sm:col-span-3 text-right">
                    <span className="block text-[10px] text-slate-400 font-semibold">Subtotal</span>
                    <span className="text-base font-extrabold text-slate-900 font-sans">
                      {formatRupiah(row.subtotal)}
                    </span>
                  </div>

                  {/* Remove Button (1 col) */}
                  <div className="sm:col-span-1 text-center">
                    <button
                      type="button"
                      disabled={items.length <= 1}
                      onClick={() => handleRemoveItem(idx)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition disabled:opacity-30"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Catatan / Keterangan Transaksi
            </label>
            <input
              type="text"
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Contoh: Setoran kardus warung & sayur sisa dapur"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Section 3: Ringkasan Kalkulasi & Tombol Simpan */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Ringkasan Kalkulasi Realtime
            </span>
            <div className="flex items-baseline gap-4">
              <div>
                <span className="text-[11px] text-emerald-200 block">Total Berat:</span>
                <span className="text-2xl font-extrabold font-sans text-white">{formatWeight(totalBerat)}</span>
              </div>
              <div className="h-8 w-px bg-white/20" />
              <div>
                <span className="text-[11px] text-emerald-200 block">Total Nominal:</span>
                <span className="text-3xl font-black font-sans text-emerald-300">{formatRupiah(totalNominal)}</span>
              </div>
            </div>
            {selectedNasabah && (
              <p className="text-xs text-emerald-100 pt-1">
                Estimasi Saldo Akhir {selectedNasabah.nama}: <strong>{formatRupiah(projectedSaldo)}</strong>
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading || totalNominal <= 0}
              className="w-full md:w-auto px-8 py-4 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-black text-sm shadow-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              <span>{loading ? 'Memproses...' : 'Simpan & Cetak Nota'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Digital Receipt Modal when transaction succeeds */}
      <ReceiptModal
        isOpen={Boolean(completedTx)}
        onClose={() => setCompletedTx(null)}
        transaksi={completedTx}
        nasabah={completedNasabah}
      />
    </div>
  );
};
