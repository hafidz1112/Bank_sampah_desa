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
  Egg,
  MapPin,
  ChevronRight,
  ExternalLink,
  Gamepad2,
  CheckCircle2,
  HelpCircle,
  Wallet,
  Smartphone,
  UserCheck,
  Layers,
  ChevronDown,
  BookOpen
} from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';
import { formatRupiah, formatWeight, MAGGOT_MONITORING_URL } from '../../lib/utils';

export const LandingPage = ({ onNavigate, onQuickCheck }) => {
  const { getStats, katalogList } = useBankSampah();
  const stats = getStats();
  const [quickNik, setQuickNik] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const scrollToPanduan = () => {
    document.getElementById('panduan-warga')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (quickNik.trim()) {
      onQuickCheck(quickNik.trim());
    }
  };

  // Top anorganic & organic items
  const popularItems = katalogList.filter(k => k.is_active).slice(0, 6);

  return (
    <div className="space-y-12 sm:space-y-20 pb-16 sm:pb-24">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 sm:pt-12 pb-10 sm:pb-16 bg-gradient-to-b from-emerald-50/60 via-white to-slate-50">
        {/* Background subtle blur */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-5xl h-72 bg-gradient-to-r from-emerald-300/20 to-teal-300/20 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-4 sm:space-y-6">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-100/90 border border-emerald-200 text-emerald-800 text-[11px] sm:text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              <span>Program Kerja Individu KKM Informatika UMC 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2]">
              Sistem Informasi Bank Sampah Desa{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                Terintegrasi Mekarjaya
              </span>
            </h1>

            {/* Sub-description */}
            <p className="text-xs sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Transformasi tata kelola sampah di <strong>Desa Mekarjaya, Ciawigebang, Kuningan</strong>. Memadukan tabungan sampah anorganik bernilai rupiah dan biokonversi sampah organik ke <strong>Biopond Maggot BSF</strong> untuk efisiensi pakan bebek petelur BUMDes.
            </p>

            {/* Quick Balance Search Form in Hero */}
            <div className="pt-2 max-w-xl mx-auto w-full">
              <form
                onSubmit={handleQuickSubmit}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1.5 sm:p-2 bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200"
              >
                <div className="flex items-center gap-2.5 flex-1 px-3 py-2">
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
                  <input
                    type="text"
                    value={quickNik}
                    onChange={(e) => setQuickNik(e.target.value)}
                    placeholder="Masukkan NIK / No. Rekening..."
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2 whitespace-nowrap min-h-[42px]"
                >
                  <span>Cek Saldo</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-2 text-center">
                Contoh uji: NIK <span className="font-mono text-emerald-700 font-semibold cursor-pointer hover:underline" onClick={() => setQuickNik('3208051204850001')}>3208051204850001</span> atau Rekening <span className="font-mono text-emerald-700 font-semibold cursor-pointer hover:underline" onClick={() => setQuickNik('BSDES-MJ-001')}>BSDES-MJ-001</span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3 pt-2 w-full max-w-md sm:max-w-none mx-auto">
              <button
                onClick={scrollToPanduan}
                className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2 min-h-[42px]"
              >
                <BookOpen className="w-4 h-4 text-emerald-300" />
                <span>Panduan Warga Baru</span>
              </button>
              <button
                onClick={() => onNavigate('katalog-public')}
                className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2 min-h-[42px]"
              >
                <Scale className="w-4 h-4 text-emerald-400" />
                <span>Katalog & Tarif Sampah</span>
              </button>
              <button
                onClick={() => onNavigate('sirkular')}
                className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2 min-h-[42px]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Sirkular Maggot BSF</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight">
            Statistik Dampak Nyata Desa Mekarjaya
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Data terkelola realtime dari seluruh nasabah Dusun Cimenang, Ciganda, dan Cimuda
          </p>
        </div>

        {/* 2 Columns on Mobile, 4 on Desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {/* Total Sampah Terkelola */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-emerald-100/90 shadow-xs hover:shadow-sm transition flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider line-clamp-1">Sampah Terkelola</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Scale className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
                {formatWeight(stats.totalBeratSampahKg)}
              </div>
              <p className="mt-1 text-[10px] sm:text-xs text-emerald-600 font-semibold flex items-center gap-1 line-clamp-1">
                <Leaf className="w-3 h-3 flex-shrink-0" /> Dialihkan dari TPS liar
              </p>
            </div>
          </div>

          {/* Total Saldo Tabungan */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-blue-100/90 shadow-xs hover:shadow-sm transition flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider line-clamp-1">Saldo Warga</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-sans tracking-tight truncate">
                {formatRupiah(stats.totalSaldoAktif)}
              </div>
              <p className="mt-1 text-[10px] sm:text-xs text-blue-600 font-semibold flex items-center gap-1 line-clamp-1">
                <TrendingUp className="w-3 h-3 flex-shrink-0" /> Tabungan aktif warga
              </p>
            </div>
          </div>

          {/* Nasabah Terdaftar */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-purple-100/90 shadow-xs hover:shadow-sm transition flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider line-clamp-1">Nasabah Aktif</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
                {stats.totalNasabah} <span className="text-xs sm:text-sm font-normal text-slate-500">Warga</span>
              </div>
              <p className="mt-1 text-[10px] sm:text-xs text-purple-600 font-semibold truncate">
                3 Dusun Mekarjaya
              </p>
            </div>
          </div>

          {/* Organik ke Maggot BSF */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 border border-amber-100/90 shadow-xs hover:shadow-sm transition flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider line-clamp-1">Suplai Organik</span>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Leaf className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
                {formatWeight(stats.totalSampahOrganikKg || stats.totalSampahOrganikLogKg || 0)}
              </div>
              <p className="mt-1 text-[10px] sm:text-xs text-amber-700 font-semibold flex items-center gap-1 line-clamp-1">
                <Sparkles className="w-3 h-3 flex-shrink-0" /> Diteruskan ke Tim Maggot
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dusun Coverage Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-2 sm:space-y-3">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-300">Cakupan Wilayah Implementasi</span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold">
              Pelayanan Terpadu di 3 Dusun Desa Mekarjaya
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              SI-BSDes memfasilitasi pendataan nasabah berbasis RT/RW dan pos penimbangan terdekat di setiap dusun untuk kemudahan akses seluruh masyarakat.
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
                  <span>Nasabah:</span>
                  <span className="font-bold text-white">{dData.count} Orang</span>
                </div>
                <div className="mt-1 flex justify-between text-xs text-emerald-100">
                  <span>Tabungan:</span>
                  <span className="font-bold text-emerald-300">{formatRupiah(dData.saldo)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Educational Guide for Citizens & Prospective Customers */}
      <section id="panduan-warga" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 space-y-8 sm:space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] sm:text-xs font-bold border border-emerald-200">
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            Panduan Calon Nasabah Warga Desa
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Bagaimana Sistem Bank Sampah Bekerja?
          </h2>
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
            Warga Desa Mekarjaya tidak perlu bingung. Cukup ikuti <strong>4 langkah mudah</strong> berikut dari rumah hingga sampah Anda berubah menjadi tabungan saldo nyata dan berkah lingkungan!
          </p>
        </div>

        {/* 4 Step Visual Roadmap */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
          {/* Langkah 1 */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-100 hover:border-emerald-300 shadow-sm hover:shadow-md transition flex flex-col justify-between relative group">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center shadow-xs">
                  01
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Dari Rumah
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
                ♻️
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">
                Pilah Sampah Mandiri
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pisahkan sampah rumah tangga Anda menjadi 2 kelompok utama sebelum dibawa ke pos:
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Anorganik Kering:</strong> Kardus, botol/gelas plastik, kaleng soda/susu, besi (dibersihkan & dipipihkan).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Organik Dapur:</strong> Sisa sayur, sisa buah, nasi basi, ampas kelapa (jangan dicampur plastik/batu).</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-emerald-700">
              💡 Tips: Botol plastik dikempeskan agar muat banyak di kantong.
            </div>
          </div>

          {/* Langkah 2 */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-100 hover:border-blue-300 shadow-sm hover:shadow-md transition flex flex-col justify-between relative group">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-800 font-black text-sm flex items-center justify-center shadow-xs">
                  02
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Cukup 1x Saja
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
                📝
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">
                Daftar Rekening di Pos
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kunjungi pos penimbangan terdekat di dusun Anda (Dusun Cimenang, Ciganda, atau Cimuda):
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Cukup sebutkan atau tunjukkan <strong>16 Digit NIK KTP</strong> Anda kepada petugas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>Sistem otomatis menerbitkan <strong>Nomor Rekening Resmi</strong> unik (<span className="font-mono font-bold text-blue-800">BSDES-MJ-XXX</span>).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span><strong>100% Gratis</strong> tanpa biaya pendaftaran atau iuran bulanan apapun.</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-blue-700">
              💡 Pendaftaran hanya perlu dilakukan satu kali seumur hidup.
            </div>
          </div>

          {/* Langkah 3 */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-100 hover:border-amber-300 shadow-sm hover:shadow-md transition flex flex-col justify-between relative group">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-2xl bg-amber-100 text-amber-800 font-black text-sm flex items-center justify-center shadow-xs">
                  03
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Transparan
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl">
                ⚖️
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">
                Timbang & Catat Digital
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Bawa sampah Anda saat jadwal penimbangan berkala pos dusun berlangsung:
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Ditimbang secara terbuka dan jujur di hadapan nasabah.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Petugas menginput bobot ke aplikasi SI-BSDes, saldo otomatis terhitung per kg.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>Sampah organik dialirkan ke <strong>Biopond Maggot BSF</strong> pakan bebek petelur BUMDes.</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-amber-800">
              💡 Saldo langsung masuk real-time ke rekening tanpa potongan.
            </div>
          </div>

          {/* Langkah 4 */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-100 hover:border-purple-300 shadow-sm hover:shadow-md transition flex flex-col justify-between relative group">
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-800 font-black text-sm flex items-center justify-center shadow-xs">
                  04
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  Fleksibel
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl">
                💵
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-snug">
                Pantau & Tarik Tunai
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Nikmati kemudahan mengakses dan mencairkan uang tabungan sampah Anda:
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>Cek saldo mandiri kapan saja lewat HP Anda di menu <strong>"Cek Saldo Warga"</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>Cairkan uang tunai sewaktu-waktu ke pengurus pos untuk belanja dapur / uang jajan anak.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 flex-shrink-0 mt-0.5" />
                  <span>Bisa ditarik sebagian atau ditarik seluruhnya (*Tarik Semua*).</span>
                </li>
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-purple-700">
              💡 Saldo tabungan adalah uang tunai murni milik nasabah.
            </div>
          </div>
        </div>

        {/* Tanya Jawab Populer Calon Nasabah (FAQ Accordion) */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-600 block">
              Pertanyaan yang Sering Diajukan Warga
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Tanya Jawab Seputar Bank Sampah Desa Mekarjaya
            </h3>
          </div>

          <div className="space-y-2.5 pt-1">
            {[
              {
                q: 'Apakah pendaftaran nasabah dikenakan biaya admin?',
                a: 'Sama sekali TIDAK ADA biaya pendaftaran maupun potongan administrasi bulanan (100% Gratis). Setiap rupiah dari hasil penimbangan sampah adalah hak murni nasabah.'
              },
              {
                q: 'Kapan jadwal penimbangan sampah dibuka?',
                a: 'Penimbangan dibuka berkala di masing-masing pos dusun (Dusun Cimenang, Dusun Ciganda, Dusun Cimuda) yang dikoordinir oleh pengurus pos & kader pemuda desa.'
              },
              {
                q: 'Apakah sampah harus disetor setiap hari?',
                a: 'Tidak harus setiap hari. Untuk sampah anorganik (kardus, botol, kaleng) Anda bisa menyimpannya dulu di rumah dan membawanya saat sudah terkumpul banyak. Untuk sampah organik sisa dapur dianjurkan disetor rutin agar tetap segar untuk pakan larva maggot.'
              },
              {
                q: 'Berapa minimal saldo yang bisa ditarik?',
                a: 'Sangat fleksibel! Anda bisa menarik saldo mulai dari nominal kecil (seperti Rp 5.000 atau Rp 10.000) hingga mencairkan seluruh saldo yang ada di buku rekening Anda.'
              },
              {
                q: 'Bagaimana cara mengecek saldo jika saya lupa nomor rekening?',
                a: 'Sangat mudah! Buka menu "Cek Saldo Warga" di website ini, lalu cukup masukkan 16 Digit NIK KTP Anda. Sistem akan langsung menampilkan data buku tabungan, nomor rekening, dan riwayat setoran Anda.'
              },
              {
                q: 'Mengapa sampah organik dapur sangat berharga di Desa Mekarjaya?',
                a: 'Karena sampah organik Anda langsung disalurkan ke Biopond Maggot BSF. Larva maggot memakan sampah organik dan dipanen sebagai pakan protein tinggi (~40%) untuk bebek petelur BUMDes Mekarjaya, sehingga desa mampu menghasilkan telur bebek berkualitas tinggi dengan biaya pakan hemat ~45%!'
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

      {/* Popular Waste Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-600">Daftar Harga Transparan</span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-800 tracking-tight mt-0.5 sm:mt-1">
              Katalog Sampah Terpopuler
            </h2>
          </div>
          <button
            onClick={() => onNavigate('katalog-public')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 self-start sm:self-auto"
          >
            <span>Lihat Semua Katalog ({katalogList.length} Jenis)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {popularItems.map((item) => {
            const isOrganik = item.tipe === 'organik';
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-sm transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isOrganik
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-sky-100 text-sky-800 border border-sky-200'
                    }`}>
                      {item.tipe}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600">
                      Aktif Diterima
                    </span>
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">{item.nama_kategori}</h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {item.deskripsi || 'Pilah bersih dan pastikan dalam kondisi kering saat disetor.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Tarif Beli Warga:</span>
                  <div className="text-right">
                    <span className="text-base sm:text-lg font-extrabold text-emerald-700 font-sans">
                      {formatRupiah(item.harga_per_kg)}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium"> /kg</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Educational Game Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-[11px] sm:text-xs font-bold border border-emerald-400/30">
              <Gamepad2 className="w-3.5 h-3.5" />
              Game Edukasi Interaktif Warga
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              Ayo Uji Ketangkasan: Game Pilah Sampah Mekarjaya!
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Pelajari cara memilah sampah organik dapur, plastik daur ulang, kertas kardus, dan kaleng logam ke tong sampah yang tepat secara menyenangkan. Main langsung di browser!
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
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

      {/* Circular Economy Flow Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-50/70 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border border-amber-200/80 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/60 text-amber-900 text-[11px] sm:text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                Inovasi Sirkular KKM UMC 2026
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-snug">
                Ekonomi Sirkular: Dari Sampah Dapur Menjadi Telur Bebek BUMDes
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Sampah organik warga Desa Mekarjaya tidak dibuang begitu saja. Melalui biopond Maggot BSF, sampah diubah menjadi pakan alami berprotein tinggi (~40%) untuk unit peternakan bebek BUMDes, memangkas biaya pakan pabrikan secara signifikan.
              </p>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1 sm:pt-2">
                <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-amber-100 shadow-xs text-center sm:text-left">
                  <div className="text-[10px] sm:text-xs text-slate-500 truncate">Biaya Pakan</div>
                  <div className="font-bold text-xs sm:text-sm text-amber-900">Hemat ~45%</div>
                </div>
                <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-amber-100 shadow-xs text-center sm:text-left">
                  <div className="text-[10px] sm:text-xs text-slate-500 truncate">Pupuk Kasgot</div>
                  <div className="font-bold text-xs sm:text-sm text-emerald-800">Organik Subur</div>
                </div>
                <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-amber-100 shadow-xs text-center sm:text-left">
                  <div className="text-[10px] sm:text-xs text-slate-500 truncate">Emisi Gas</div>
                  <div className="font-bold text-xs sm:text-sm text-blue-800">Turun 80%</div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <button
                  onClick={() => onNavigate('sirkular')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-sm transition min-h-[42px]"
                >
                  <span>Edukasi Alur Sirkular</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <a
                  href={MAGGOT_MONITORING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-xl bg-white hover:bg-amber-50 text-amber-950 font-bold text-xs sm:text-sm shadow-sm border border-amber-200 transition min-h-[42px] group"
                >
                  <span>Web Monitoring Maggot</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-700 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Quick Flow Illustration */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-6 border border-amber-100 shadow-sm space-y-2.5 sm:space-y-3">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0">1</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 leading-tight">Warga setor sampah organik sisa dapur</div>
              </div>
              <div className="w-0.5 h-3 bg-amber-200 ml-3.5" />
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs flex-shrink-0">2</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 leading-tight">Biokonversi 14 hari di Biopond Maggot BSF</div>
              </div>
              <div className="w-0.5 h-3 bg-amber-200 ml-3.5" />
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold text-xs flex-shrink-0">3</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 leading-tight">Panen larva segar untuk pakan bebek BUMDes</div>
              </div>
              <div className="w-0.5 h-3 bg-amber-200 ml-3.5" />
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs flex-shrink-0">4</div>
                <div className="text-xs sm:text-sm font-semibold text-slate-700 leading-tight">Panen telur bergizi & pupuk organik pertanian</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
