import React, { useState } from 'react';
import { 
  Recycle, 
  TrendingUp, 
  Users, 
  Coins, 
  ArrowRight, 
  Sparkles, 
  Leaf, 
  ShieldCheck, 
  CheckCircle2, 
  Search,
  Scale,
  Egg,
  Building2,
  MapPin,
  ChevronRight,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';
import { formatRupiah, formatWeight } from '../../lib/utils';

export const LandingPage = ({ onNavigate, onQuickCheck }) => {
  const { getStats, katalogList } = useBankSampah();
  const stats = getStats();
  const [quickNik, setQuickNik] = useState('');

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (quickNik.trim()) {
      onQuickCheck(quickNik.trim());
    }
  };

  // Top anorganic & organic items
  const popularItems = katalogList.filter(k => k.is_active).slice(0, 6);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 bg-gradient-to-b from-emerald-50/70 via-white to-slate-50">
        {/* Background decorative blurs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-emerald-300/20 to-teal-300/20 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Program Kerja Individu KKM Informatika UMC 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Sistem Informasi Bank Sampah Desa{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-500">
                Terintegrasi Mekarjaya
              </span>
            </h1>

            {/* Sub-description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Transformasi pengelolaan sampah modern di <strong>Desa Mekarjaya, Ciawigebang, Kuningan</strong>. Memadukan tabungan sampah anorganik bernilai rupiah dan ekonomi sirkular sampah organik ke <strong>Biopond Maggot BSF</strong> untuk efisiensi pakan bebek petelur BUMDes.
            </p>

            {/* Quick Balance Search Form in Hero */}
            <div className="pt-2 max-w-xl mx-auto">
              <form
                onSubmit={handleQuickSubmit}
                className="flex flex-col sm:flex-row items-center gap-2 p-2 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200"
              >
                <div className="flex items-center gap-2 w-full px-3 py-2">
                  <Search className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <input
                    type="text"
                    value={quickNik}
                    onChange={(e) => setQuickNik(e.target.value)}
                    placeholder="Masukkan NIK / No. Rekening Warga..."
                    className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <span>Cek Saldo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <p className="text-[11px] text-slate-400 mt-2 text-center">
                Contoh uji coba: NIK <span className="font-mono text-emerald-700 font-semibold cursor-pointer hover:underline" onClick={() => setQuickNik('3208051204850001')}>3208051204850001</span> atau Rekening <span className="font-mono text-emerald-700 font-semibold cursor-pointer hover:underline" onClick={() => setQuickNik('BSDES-MJ-001')}>BSDES-MJ-001</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => onNavigate('katalog-public')}
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md transition flex items-center gap-2"
              >
                <Scale className="w-4 h-4 text-emerald-400" />
                Katalog & Tarif Sampah Terkini
              </button>
              <button
                onClick={() => onNavigate('sirkular')}
                className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow-md shadow-amber-500/20 transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Pelajari Sirkular Maggot BSF
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Statistik Dampak Nyata Desa Mekarjaya
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Data terkelola realtime dari seluruh nasabah Dusun Cimenang, Ciganda, dan Cimuda
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Sampah Terkelola */}
          <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sampah Terkelola</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 text-3xl font-extrabold text-slate-900 font-sans">
              {formatWeight(stats.totalBeratSampahKg)}
            </div>
            <p className="mt-1 text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5" /> Berhasil dialihkan dari TPS liar
            </p>
          </div>

          {/* Total Saldo Tabungan */}
          <div className="bg-white rounded-2xl p-6 border border-blue-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saldo Warga Tersimpan</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Coins className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 text-3xl font-extrabold text-slate-900 font-sans">
              {formatRupiah(stats.totalSaldoAktif)}
            </div>
            <p className="mt-1 text-xs text-blue-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Siap ditarik atau ditabung warga
            </p>
          </div>

          {/* Nasabah Terdaftar */}
          <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nasabah Aktif</span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 text-3xl font-extrabold text-slate-900 font-sans">
              {stats.totalNasabah} <span className="text-base font-medium text-slate-500">KK / Warga</span>
            </div>
            <p className="mt-1 text-xs text-purple-600 font-semibold">
              3 Dusun: Cimenang, Ciganda, Cimuda
            </p>
          </div>

          {/* Organik ke Maggot BSF */}
          <div className="bg-white rounded-2xl p-6 border border-amber-100 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Organik ke Maggot</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 text-3xl font-extrabold text-slate-900 font-sans">
              {formatWeight(stats.totalSampahOrganikLogKg)}
            </div>
            <p className="mt-1 text-xs text-amber-700 font-semibold flex items-center gap-1">
              <Egg className="w-3.5 h-3.5 text-amber-600" /> Pakan Bebek Petelur BUMDes
            </p>
          </div>
        </div>
      </section>

      {/* Dusun Coverage Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Cakupan Wilayah Implementasi</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Pelayanan Terpadu di 3 Dusun Desa Mekarjaya
            </h3>
            <p className="text-sm text-emerald-100 leading-relaxed">
              SI-BSDes memfasilitasi pendataan nasabah berbasis RT/RW dan pos penimbangan terdekat di setiap dusun untuk kemudahan akses seluruh masyarakat.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 relative z-10">
            {Object.entries(stats.dusunStats).map(([dusunName, dData]) => (
              <div key={dusunName} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition">
                <div className="flex items-center gap-2 font-bold text-base text-white">
                  <MapPin className="w-4 h-4 text-emerald-300" />
                  {dusunName}
                </div>
                <div className="mt-3 flex justify-between text-xs text-emerald-100">
                  <span>Nasabah Terdaftar:</span>
                  <span className="font-bold text-white">{dData.count} Orang</span>
                </div>
                <div className="mt-1 flex justify-between text-xs text-emerald-100">
                  <span>Tabungan Terkumpul:</span>
                  <span className="font-bold text-emerald-300">{formatRupiah(dData.saldo)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Waste Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Daftar Harga Transparan</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight mt-1">
              Katalog Sampah Terpopuler
            </h2>
          </div>
          <button
            onClick={() => onNavigate('katalog-public')}
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700"
          >
            <span>Lihat Semua Katalog ({katalogList.length} Kategori)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularItems.map((item) => {
            const isOrganik = item.tipe === 'organik';
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isOrganik
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-sky-100 text-sky-800 border border-sky-200'
                    }`}>
                      {item.tipe}
                    </span>
                    <span className="text-xs font-bold text-emerald-600">
                      Aktif Diterima
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-slate-900">{item.nama_kategori}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {item.deskripsi || 'Pilah bersih dan pastikan dalam kondisi kering saat disetor.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Tarif Warga:</span>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-emerald-700 font-sans">
                      {formatRupiah(item.harga_per_kg)}
                    </span>
                    <span className="text-xs text-slate-500 font-medium"> / kg</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Circular Economy Flow Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50/60 rounded-3xl p-6 sm:p-10 border border-amber-200/70">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/60 text-amber-900 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                Inovasi Unggulan KKM UMC 2026
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Ekonomi Sirkular: Dari Sampah Dapur Menjadi Telur Bebek BUMDes
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Sampah organik warga Desa Mekarjaya tidak dibuang begitu saja. Melalui biopond Maggot BSF, sampah diubah menjadi pakan alami berprotein tinggi (~40%) untuk unit peternakan bebek BUMDes, memangkas biaya operasional pakan pabrikan secara signifikan.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-white rounded-xl border border-amber-100 shadow-sm">
                  <div className="text-xs text-slate-500">Kebutuhan Pakan</div>
                  <div className="font-bold text-sm text-amber-900">Hemat Hingga 45%</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-amber-100 shadow-sm">
                  <div className="text-xs text-slate-500">Residu Kasgot</div>
                  <div className="font-bold text-sm text-emerald-800">Pupuk Organik Padat</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-amber-100 shadow-sm col-span-2 sm:col-span-1">
                  <div className="text-xs text-slate-500">Emisi Metana</div>
                  <div className="font-bold text-sm text-blue-800">Reduksi 80%</div>
                </div>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('sirkular')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition"
                >
                  <span>Lihat Diagram Alur Sirkular Lengkap</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Flow Illustration */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-amber-100 shadow-md space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">1</div>
                <div className="text-xs font-semibold text-slate-700">Warga setor sampah organik sisa dapur</div>
              </div>
              <div className="w-0.5 h-4 bg-amber-200 ml-4" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">2</div>
                <div className="text-xs font-semibold text-slate-700">Biokonversi cepat 14 hari di Biopond Maggot</div>
              </div>
              <div className="w-0.5 h-4 bg-amber-200 ml-4" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold text-xs">3</div>
                <div className="text-xs font-semibold text-slate-700">Panen larva maggot fresh pakan bebek BUMDes</div>
              </div>
              <div className="w-0.5 h-4 bg-amber-200 ml-4" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">4</div>
                <div className="text-xs font-semibold text-slate-700">Hasil telur bergizi & pupuk kasgot untuk pertanian</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
