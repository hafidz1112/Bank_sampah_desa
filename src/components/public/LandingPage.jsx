import React, { useState } from 'react';
import { 
  Recycle, 
  TrendingUp, 
  Users, 
  Coins, 
  ArrowRight, 
  Sparkles, 
  Leaf, 
  Search,
  Scale,
  MapPin, 
  ChevronRight, 
  Gamepad2, 
  CheckCircle2, 
  Wallet, 
  BookOpen,
  Building2,
  ChevronDown
} from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';
import { formatRupiah, formatWeight } from '../../lib/utils';
import { Select } from '../ui/Select';

export const LandingPage = ({ onNavigate, onQuickCheck }) => {
  const { getStats, katalogList, rtList } = useBankSampah();
  const stats = getStats();
  const [selectedQuickRtId, setSelectedQuickRtId] = useState(rtList[0]?.id || 1);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const scrollToPanduan = () => {
    document.getElementById('panduan-warga')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (selectedQuickRtId) {
      onQuickCheck(String(selectedQuickRtId));
    }
  };

  const rtOptions = rtList.map(r => ({
    value: r.id,
    label: `${r.nama_rt} (${r.dusun})`,
    sublabel: `Ketua: ${r.ketua_rt} • Kas: ${formatRupiah(r.saldo_kas)}`
  }));

  return (
    <div className="space-y-12 sm:space-y-20 pb-16 sm:pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 sm:pt-12 pb-10 sm:pb-16 bg-gradient-to-b from-emerald-50/60 via-white to-slate-50">
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-gradient-to-r from-emerald-300/20 to-teal-300/20 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-[11px] sm:text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Program Kerja Individu KKM Informatika UMC 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.2]">
              Bank Sampah{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                Desa Mekarjaya
              </span>
            </h1>

            {/* Sub-description */}
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Inisiatif Bank Sampah Desa Mekarjaya dengan titik pemilahan <strong>4 wadah</strong> yang berlokasi di <strong>RA (Raudhatul Athfal)</strong>. Warga tidak perlu mendaftar akun perorangan—cukup buang sampah terpilah ke wadahnya. Sampah dijual berkala dan seluruh hasilnya menjadi <strong>tabungan kas warga per RT</strong>!
            </p>

            {/* Quick Balance Search Form in Hero */}
            <div className="pt-2 max-w-xl mx-auto w-full">
              <form
                onSubmit={handleQuickSubmit}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 sm:p-2 bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200"
              >
                <div className="flex-1 px-2 py-1">
                  <Select
                    value={selectedQuickRtId}
                    onChange={(val) => setSelectedQuickRtId(val)}
                    options={rtOptions}
                    placeholder="Pilih RT Anda untuk Cek Kas..."
                    size="sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2 whitespace-nowrap min-h-[42px]"
                >
                  <span>Cek Tabungan RT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-2 text-center">
                Pilih lingkungan RT Anda (Dusun Cimenang, Ciganda, atau Cimuda) untuk melihat transparansi saldo kas.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 pt-2 w-full max-w-md sm:max-w-none mx-auto">
              <button
                onClick={scrollToPanduan}
                className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2 min-h-[42px]"
              >
                <BookOpen className="w-4 h-4 text-emerald-300" />
                <span>Panduan 4 Wadah di RA</span>
              </button>
              <button
                onClick={() => onNavigate('katalog-public')}
                className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2 min-h-[42px]"
              >
                <Scale className="w-4 h-4 text-emerald-400" />
                <span>Tarif 4 Kategori Sampah</span>
              </button>
              <button
                onClick={() => onNavigate('portal-nasabah')}
                className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2 min-h-[42px]"
              >
                <Wallet className="w-4 h-4" />
                <span>Transparansi Kas RT</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight">
            Statistik Capaian Bank Sampah RA
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Akumulasi timbangan sampah terpilah dan saldo tabungan kas warga seluruh RT Desa Mekarjaya
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {/* Total Sampah Terjual */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-emerald-100 shadow-xs hover:shadow-sm transition flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider line-clamp-1">Sampah Terjual</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Scale className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
                {formatWeight(stats.totalBeratSampahKg)}
              </div>
              <p className="mt-1 text-[10px] sm:text-xs text-emerald-600 font-semibold flex items-center gap-1 line-clamp-1">
                <Leaf className="w-3 h-3 flex-shrink-0" /> Dari 4 wadah di RA
              </p>
            </div>
          </div>

          {/* Total Kas Tabungan RT */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-blue-100 shadow-xs hover:shadow-sm transition flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider line-clamp-1">Total Kas Seluruh RT</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-sans tracking-tight truncate">
                {formatRupiah(stats.totalSaldoKas)}
              </div>
              <p className="mt-1 text-[10px] sm:text-xs text-blue-600 font-semibold flex items-center gap-1 line-clamp-1">
                <TrendingUp className="w-3 h-3 flex-shrink-0" /> Tabungan aktif warga
              </p>
            </div>
          </div>

          {/* RT Terfasilitasi */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-purple-100 shadow-xs hover:shadow-sm transition flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider line-clamp-1">RT Terfasilitasi</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
                {stats.totalRt} <span className="text-xs sm:text-sm font-normal text-slate-500">Rukun Tetangga</span>
              </div>
              <p className="mt-1 text-[10px] sm:text-xs text-purple-600 font-semibold truncate">
                3 Dusun Mekarjaya
              </p>
            </div>
          </div>

          {/* Total Penyaluran Kas */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-amber-100 shadow-xs hover:shadow-sm transition flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider line-clamp-1">Kas Tersalurkan</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-sans tracking-tight truncate">
                {formatRupiah(stats.totalUangPenyaluran || 0)}
              </div>
              <p className="mt-1 text-[10px] sm:text-xs text-amber-700 font-semibold flex items-center gap-1 line-clamp-1">
                <Sparkles className="w-3 h-3 flex-shrink-0" /> Kegiatan & sosial RT
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dusun Coverage Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-2 sm:space-y-3">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300">Cakupan Wilayah Tabungan</span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold">
              Transparansi Saldo Kas RT di 3 Dusun
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Seluruh hasil penjualan sampah terpilah di RA dialokasikan secara adil dan transparan untuk kas masing-masing RT di Dusun Cimenang, Ciganda, dan Cimuda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8 relative z-10">
            {Object.entries(stats.dusunStats).map(([dusunName, dData]) => (
              <div key={dusunName} className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3.5 sm:p-4 border border-white/10 hover:bg-white/15 transition">
                <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-white">
                  <MapPin className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                  <span>{dusunName}</span>
                </div>
                <div className="mt-2.5 flex justify-between text-xs text-emerald-100">
                  <span>Unit RT Terdaftar:</span>
                  <span className="font-bold text-white">{dData.count} RT</span>
                </div>
                <div className="mt-1 flex justify-between text-xs text-emerald-100">
                  <span>Akumulasi Kas RT:</span>
                  <span className="font-bold text-emerald-300">{formatRupiah(dData.saldo)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 Wadah Sampah di RA Section */}
      <section id="panduan-warga" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-8 sm:space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-bold border border-emerald-200">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            Konsep Pemilahan Praktis Tanpa Registrasi
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Cukup Buang ke 4 Tempat Sampah di RA
          </h2>
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
            Warga dan siswa tidak dibebani buku tabungan individu. Cukup pisahkan sampah Anda ke <strong>4 wadah tematik</strong> di bawah ini saat berada di lingkungan RA Mekarjaya:
          </p>
        </div>

        {/* 4 Bins Roadmap */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Wadah 1 */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-sky-100 hover:border-sky-300 shadow-sm transition flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 font-black text-xs flex items-center justify-center">01</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">Rp 3.500/kg</span>
              </div>
              <div className="text-3xl">🧴</div>
              <h3 className="font-extrabold text-base text-slate-900">Botol Plastik (PET)</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Botol air mineral bening, botol teh, jus, dan botol kemasan plastik bersih.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-[11px] font-semibold text-sky-700">
              💡 Kempeskan botol dan lepas tutupnya agar hemat wadah.
            </div>
          </div>

          {/* Wadah 2 */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-teal-100 hover:border-teal-300 shadow-sm transition flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 font-black text-xs flex items-center justify-center">02</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">Rp 2.200/kg</span>
              </div>
              <div className="text-3xl">🥤</div>
              <h3 className="font-extrabold text-base text-slate-900">Plastik & Gelas PP</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Gelas plastik minuman kemasan, sedotan, kantong kresek, dan lembaran bersih.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-[11px] font-semibold text-teal-700">
              💡 Buang sisa cairan manis sebelum dimasukkan ke tong.
            </div>
          </div>

          {/* Wadah 3 */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-amber-100 hover:border-amber-300 shadow-sm transition flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">03</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">Rp 2.500/kg</span>
              </div>
              <div className="text-3xl">📦</div>
              <h3 className="font-extrabold text-base text-slate-900">Kardus & Kertas</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kardus box gelombang kering, kertas putih HVS ujian, buku tulis bekas, dan koran.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-[11px] font-semibold text-amber-700">
              💡 Lipat kardus hingga pipih agar rapi saat dikumpulkan.
            </div>
          </div>

          {/* Wadah 4 */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-rose-100 hover:border-rose-300 shadow-sm transition flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 font-black text-xs flex items-center justify-center">04</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">Rp 3.000/kg</span>
              </div>
              <div className="text-3xl">🥫</div>
              <h3 className="font-extrabold text-base text-slate-900">Besi & Kaca</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kaleng minuman soda/susu, potongan seng besi, serta botol beling/kaca kecap/sirup.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-[11px] font-semibold text-rose-700">
              💡 Masukkan botol beling secara perlahan agar tidak pecah.
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-600 block">
              Pertanyaan yang Sering Diajukan Warga
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Tanya Jawab Seputar Bank Sampah Terpilah RA
            </h3>
          </div>

          <div className="space-y-2.5 pt-1">
            {[
              {
                q: 'Apakah warga harus mendaftarkan NIK atau nomor rekening pribadi?',
                a: 'Sama sekali TIDAK PERLU. Pada sistem bank sampah terpilah di RA ini, warga maupun siswa cukup membuang sampah ke wadah yang sesuai. Tidak ada administrasi perorangan yang membingungkan.'
              },
              {
                q: 'Kemana uang hasil penjualan sampah disalurkan?',
                a: 'Seluruh uang hasil penjualan 4 jenis sampah terpilah ini 100% masuk ke kas tabungan lingkungan RT warga (RT 01, RT 02 Dusun Cimenang, Ciganda, dan Cimuda). Dana ini digunakan untuk kegiatan sosial, kerja bakti, sarana kebersihan, dan kemaslahatan warga RT.'
              },
              {
                q: 'Kapan sampah dari 4 wadah di RA ditimbang dan dijual?',
                a: 'Pengurus secara berkala mengumpulkan sampah dari wadah RA ke pos penampungan sementara, kemudian memanggil pengepul/lapak saat volume sudah mencukupi untuk ditimbang dan dijual dengan harga terbaik.'
              },
              {
                q: 'Bagaimana warga bisa memantau saldo kas tabungan RT-nya?',
                a: 'Sangat mudah! Buka menu "Transparansi Kas RT" di website ini, lalu pilih nomor RT Anda. Saldo terkini, riwayat penjualan timbangan sampah, dan bukti penyaluran dana kas dapat dilihat secara terbuka kapan saja.'
              },
              {
                q: 'Apa saja 4 jenis sampah yang boleh dibuang di RA Mekarjaya?',
                a: 'Hanya 4 kategori: (1) Botol Plastik PET bening, (2) Plastik campur & gelas PP, (3) Kardus & kertas, serta (4) Kaleng besi & botol kaca/beling.'
              }
            ].map((faq, fIdx) => {
              const isOpen = openFaqIndex === fIdx;
              return (
                <div key={fIdx} className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all">
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : fIdx)}
                    className="w-full text-left px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between gap-3 bg-slate-50/70 hover:bg-slate-100 transition"
                  >
                    <span className="font-bold text-xs sm:text-sm text-slate-800">
                      {faq.q}
                    </span>
                    <span className={`w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-500 transition-transform ${isOpen ? 'rotate-180 text-emerald-600' : ''}`}>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 py-3.5 sm:px-5 sm:py-4 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-fade-in">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Educational Game Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] sm:text-xs font-bold border border-emerald-400/30">
              <Gamepad2 className="w-3.5 h-3.5" />
              Game Edukasi 4 Wadah Pilah
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              Ayo Latihan: Game 4 Wadah Pilah RA Mekarjaya!
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Uji ketangkasan memilah botol plastik, gelas kemasan, kardus karton, serta kaleng & botol beling ke tempat sampah yang benar. Main langsung di HP Anda!
            </p>
          </div>

          <div className="relative z-10 flex-shrink-0">
            <button
              onClick={() => onNavigate('game-edukasi')}
              className="px-6 py-3.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 group"
            >
              <Gamepad2 className="w-4 h-4 text-emerald-900 group-hover:scale-110 transition-transform" />
              <span>Mainkan Game Sekarang</span>
              <ArrowRight className="w-4 h-4 text-emerald-900 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
