import React, { useState } from 'react';
import { Search, Filter, Calculator, Scale, Info, CheckCircle2, Tag } from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';
import { formatRupiah } from '../../lib/utils';

export const KatalogHargaPublic = () => {
  const { katalogList } = useBankSampah();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // all, organik, anorganik
  const [sortBy, setSortBy] = useState('default'); // default, price-desc, price-asc

  // Calculator states
  const [calcKategoriId, setCalcKategoriId] = useState(katalogList[0]?.id || 1);
  const [calcBeratKg, setCalcBeratKg] = useState(5);

  // Filtered and sorted list
  const filteredKatalog = katalogList
    .filter(item => {
      const matchSearch = item.nama_kategori.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.deskripsi && item.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchType = selectedType === 'all' || item.tipe === selectedType;
      return matchSearch && matchType;
    })
    .sort((a, b) => {
      if (sortBy === 'price-desc') return b.harga_per_kg - a.harga_per_kg;
      if (sortBy === 'price-asc') return a.harga_per_kg - b.harga_per_kg;
      return a.id - b.id;
    });

  // Calculate simulated earnings
  const selectedCalcItem = katalogList.find(k => k.id === Number(calcKategoriId)) || katalogList[0];
  const simulatedTotal = selectedCalcItem ? (parseFloat(calcBeratKg) || 0) * selectedCalcItem.harga_per_kg : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
          <Tag className="w-3.5 h-3.5" />
          Tarif Resmi Bank Sampah Mekarjaya
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Katalog Sampah & Harga per Kilogram
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed">
          Harga acuan transparan untuk warga Dusun Cimenang, Ciganda, dan Cimuda. Pilah sampah dari rumah, timbang di bank sampah desa, dan raih tabungan aktif!
        </p>
      </div>

      {/* Interactive Calculator Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 text-white shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
          <div className="lg:col-span-6 space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-300 text-[11px] sm:text-xs font-bold uppercase">
              <Calculator className="w-3.5 h-3.5" />
              <span>Simulasi Cepat</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Kalkulator Tabungan Sampah
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Pilih jenis sampah dan masukkan perkiraan berat untuk melihat estimasi rupiah yang masuk ke rekening tabungan Anda.
            </p>
          </div>

          <div className="lg:col-span-6 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 text-slate-800 shadow-md space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                  Pilih Kategori Sampah
                </label>
                <select
                  value={calcKategoriId}
                  onChange={(e) => setCalcKategoriId(Number(e.target.value))}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium bg-white"
                >
                  {katalogList.filter(k => k.is_active).map(k => (
                    <option key={k.id} value={k.id}>
                      [{k.tipe.toUpperCase()}] {k.nama_kategori} ({formatRupiah(k.harga_per_kg)}/kg)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                  Estimasi Berat (Kg)
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
                <span className="text-[10px] sm:text-[11px] text-emerald-700 font-semibold block">Estimasi Saldo yang Masuk:</span>
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

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs space-y-3 sm:space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari jenis kardus, botol, jelantah..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedType === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({katalogList.length})
            </button>
            <button
              onClick={() => setSelectedType('anorganik')}
              className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedType === 'anorganik'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200'
              }`}
            >
              Anorganik ({katalogList.filter(k => k.tipe === 'anorganik').length})
            </button>
            <button
              onClick={() => setSelectedType('organik')}
              className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedType === 'organik'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              Organik Maggot ({katalogList.filter(k => k.tipe === 'organik').length})
            </button>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 justify-end">
            <span className="text-[11px] sm:text-xs text-slate-500 font-semibold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Urutkan:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-700 bg-white"
            >
              <option value="default">Bawaan</option>
              <option value="price-desc">Harga Tertinggi</option>
              <option value="price-asc">Harga Terendah</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Catalog Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
        {filteredKatalog.map((item) => {
          const isOrganik = item.tipe === 'organik';
          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all duration-200 flex flex-col justify-between hover:shadow-md ${
                isOrganik ? 'border-emerald-200/80 hover:border-emerald-400' : 'border-slate-200/80 hover:border-sky-300'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isOrganik
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-sky-100 text-sky-800 border border-sky-200'
                  }`}>
                    {item.tipe}
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Diterima
                  </span>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">{item.nama_kategori}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {item.deskripsi || 'Pastikan bersih, terpisah dari bahan terkontaminasi, dan siap ditimbang di pos bank sampah.'}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
                <div>
                  <span className="text-[10px] sm:text-[11px] text-slate-400 font-semibold block">Harga Beli Warga</span>
                  <div className="text-lg sm:text-xl font-extrabold text-slate-900 font-sans">
                    {formatRupiah(item.harga_per_kg)}
                    <span className="text-[11px] font-normal text-slate-500"> /kg</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCalcKategoriId(item.id);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-bold transition flex items-center gap-1 active:scale-95"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  Hitung
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredKatalog.length === 0 && (
        <div className="text-center py-12 sm:py-16 bg-white rounded-2xl border border-dashed border-slate-200 space-y-2.5">
          <Scale className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm sm:text-base font-bold text-slate-700">Kategori sampah tidak ditemukan</h3>
          <p className="text-xs text-slate-400">Coba ubah kata kunci pencarian atau filter kategori.</p>
        </div>
      )}

      {/* Guide & Sorting Tips */}
      <div className="bg-slate-100/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200/60">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
          <span>Panduan Penimbangan & Kualitas Sampah Desa Mekarjaya</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs text-slate-600 leading-relaxed">
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-800 text-xs sm:text-sm text-sky-800">Sampah Anorganik (Kardus, Plastik, Logam)</h4>
            <p>• Kardus sebaiknya dilipat rapi dan diikat agar mudah ditimbang.</p>
            <p>• Botol plastik PET mohon dikosongkan isinya dan dilepas tutupnya.</p>
            <p>• Minyak jelantah disimpan dalam wadah botol atau jeriken tertutup tanpa endapan air.</p>
          </div>
          <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 space-y-1">
            <h4 className="font-bold text-slate-800 text-xs sm:text-sm text-emerald-800">Sampah Organik (Pakan Maggot BSF)</h4>
            <p>• Sisa sayuran, buah, nasi, dan ampas tahu sangat disukai larva maggot.</p>
            <p>• <strong>Wajib:</strong> Jangan mencampurkan plastik, puntung rokok, kaca, atau tulang keras.</p>
            <p>• Sampah organik disetor ke petugas setiap jadwal pos agar kondisi tetap segar.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
