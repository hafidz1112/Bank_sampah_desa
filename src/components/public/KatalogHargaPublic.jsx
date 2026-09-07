import React, { useState } from 'react';
import { Search, Filter, Calculator, Scale, Info, CheckCircle2, Tag, Wallet } from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';
import { formatRupiah } from '../../lib/utils';
import { Select } from '../ui/Select';

export const KatalogHargaPublic = () => {
  const { katalogList } = useBankSampah();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Calculator states
  const [calcKategoriId, setCalcKategoriId] = useState(katalogList[0]?.id || 1);
  const [calcBeratKg, setCalcBeratKg] = useState(10);

  // Filtered list
  const filteredKatalog = katalogList.filter(item => {
    const matchSearch = item.nama_kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (item.deskripsi && item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchType = selectedType === 'all' || item.tipe === selectedType;
    return matchSearch && matchType;
  });

  const selectedCalcItem = katalogList.find(k => k.id === Number(calcKategoriId)) || katalogList[0];
  const simulatedTotal = selectedCalcItem ? (parseFloat(calcBeratKg) || 0) * selectedCalcItem.harga_per_kg : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
          <Tag className="w-3.5 h-3.5" />
          Tarif 4 Kategori Sampah Bank Sampah Desa Mekarjaya
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Katalog Sampah & Harga Jual per Kilogram
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed">
          Harga acuan penjualan sampah dari 4 wadah pemilahan di pos RA ke pengepul daur ulang. Hasil penjualan 100% masuk ke tabungan kas warga RT!
        </p>
      </div>

      {/* Interactive Calculator Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-white shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
          <div className="lg:col-span-6 space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-300 text-[11px] sm:text-xs font-bold uppercase">
              <Calculator className="w-3.5 h-3.5" />
              <span>Simulasi Cepat Tabungan RT</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Kalkulator Hasil Penjualan Sampah RA
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Pilih kategori dari 4 wadah dan masukkan berat timbangan untuk melihat estimasi rupiah yang masuk ke kas tabungan warga RT Anda.
            </p>
          </div>

          <div className="lg:col-span-6 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-slate-800 shadow-md space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                  Pilih Wadah Sampah di RA
                </label>
                <Select
                  value={calcKategoriId}
                  onChange={(val) => setCalcKategoriId(Number(val))}
                  options={katalogList.filter(k => k.is_active).map(k => ({
                    value: k.id,
                    label: `${k.nama_kategori} (${formatRupiah(k.harga_per_kg)}/kg)`
                  }))}
                  size="sm"
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                  Estimasi Berat Terkumpul (Kg)
                </label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={calcBeratKg}
                  onChange={(e) => setCalcBeratKg(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                />
              </div>
            </div>

            <div className="p-3 sm:p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold block">Estimasi Dana Masuk ke Kas RT:</span>
                <span className="text-lg sm:text-2xl font-extrabold text-emerald-800 font-sans">
                  {formatRupiah(simulatedTotal)}
                </span>
              </div>
              <div className="text-right text-[10px] sm:text-xs text-emerald-600 font-medium">
                {calcBeratKg} kg x {formatRupiah(selectedCalcItem?.harga_per_kg || 0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of 4 Catalog Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Daftar 4 Wadah Pemilahan Sampah Terdaftar ({filteredKatalog.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredKatalog.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                    Wadah Resmi RA
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Diterima
                  </span>
                </div>

                <h4 className="text-base font-bold text-slate-900 leading-snug">{item.nama_kategori}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.deskripsi || 'Pilah bersih dan buang ke tong yang sesuai di RA Mekarjaya.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-end justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block">Harga Jual Acuan</span>
                  <div className="text-lg font-black text-slate-900 font-sans">
                    {formatRupiah(item.harga_per_kg)}
                    <span className="text-[11px] font-normal text-slate-400"> /kg</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCalcKategoriId(item.id);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-bold transition flex items-center gap-1"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  Hitung
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guide & Sorting Tips */}
      <div className="bg-slate-100/80 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-800 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>Petunjuk Pemilahan Sampah 4 Wadah di RA Mekarjaya</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed">
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-800 text-sky-800">1. Wadah Botol Plastik & 2. Wadah Plastik</h4>
            <p>• Botol air mineral/teh dikosongkan airnya dan dilepas tutupnya.</p>
            <p>• Kempeskan botol agar tempat sampah di RA tidak cepat penuh.</p>
            <p>• Gelas plastik kemasan (PP) dan kantong kresek dipastikan dalam keadaan kering.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-800 text-amber-800">3. Wadah Kardus/Kertas & 4. Wadah Besi/Kaca</h4>
            <p>• Kardus dilipat rapi sebelum dimasukkan ke wadah karton.</p>
            <p>• Kaleng minuman soda, susu, dan potongan seng dimasukkan ke wadah besi & kaca.</p>
            <p>• Botol kaca sirup/kecap dimasukkan hati-hati agar tidak pecah.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
