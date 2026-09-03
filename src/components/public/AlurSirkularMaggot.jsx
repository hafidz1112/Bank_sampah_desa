import React, { useState } from 'react';
import { 
  Sparkles, 
  Leaf, 
  Egg, 
  ArrowRight, 
  TrendingUp, 
  Calculator, 
  Layers, 
  Award,
  ExternalLink,
  Info,
  CheckCircle2,
  XCircle,
  Scale
} from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';
import { formatWeight, formatRupiah, MAGGOT_MONITORING_URL } from '../../lib/utils';

export const AlurSirkularMaggot = () => {
  const { getStats } = useBankSampah();
  const stats = getStats();
  const [calcOrganikKg, setCalcOrganikKg] = useState(100);

  // Conversion formulas for educational simulation
  const estMaggot = (parseFloat(calcOrganikKg) || 0) * 0.20;
  const estKasgot = (parseFloat(calcOrganikKg) || 0) * 0.25;
  const estHematPakan = estMaggot * 0.75 * 8500;
  const estReduksiCO2 = (parseFloat(calcOrganikKg) || 0) * 0.25;

  const steps = [
    {
      num: '01',
      title: 'Pemilahan Organik di Rumah',
      desc: 'Warga memilah sisa sayur, buah, nasi, dan limbah dapur rumah tangga terpisah dari sampah anorganik.',
      badge: 'Langkah Warga',
      color: 'border-emerald-200 bg-emerald-50/50'
    },
    {
      num: '02',
      title: 'Penimbangan di Bank Sampah',
      desc: 'Sampah organik disetor ke pos penimbangan bank sampah desa dan dikonversi menjadi saldo tabungan rupiah warga.',
      badge: 'Insentif Saldo',
      color: 'border-blue-200 bg-blue-50/50'
    },
    {
      num: '03',
      title: 'Penyaluran ke Biopond Maggot',
      desc: 'Data volume pasokan dicatat di bank sampah, kemudian sampah dialirkan ke unit Biopond Maggot BSF (Hermetia illucens).',
      badge: 'Biokonversi Alami',
      color: 'border-amber-200 bg-amber-50/50'
    },
    {
      num: '04',
      title: 'Pakan Bebek Petelur BUMDes',
      desc: 'Larva maggot segar berprotein tinggi (~40%) menjadi pakan alami untuk menekan biaya pakan pabrik bebek petelur BUMDes.',
      badge: 'Efisiensi Pakan',
      color: 'border-yellow-200 bg-yellow-50/50'
    },
    {
      num: '05',
      title: 'Telur Berkualitas & Kasgot',
      desc: 'BUMDes menghasilkan telur bebek bermutu tinggi, sementara residu kasgot (bekas maggot) menjadi pupuk organik pertanian desa.',
      badge: 'Zero Waste',
      color: 'border-purple-200 bg-purple-50/50'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 sm:space-y-14">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Sistem Informasi & Edukasi Alur Sirkular
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Alur Sirkular Sampah Organik ke Maggot BSF
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed">
          Edukasi tata kelola sampah organik terpadu Desa Mekarjaya. Bank Sampah berperan menghimpun sampah organik warga berbasis saldo, yang kemudian disalurkan sebagai pakan biopond Maggot BSF guna mendukung unit bebek petelur BUMDes.
        </p>
      </div>

      {/* Prominent Partner Redirection Card */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Sinergi Program KKM Informatika UMC 2026</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight">
              Website Monitoring Budidaya Maggot BSF
            </h2>
            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
              Untuk pemantauan harian unit biopond, data sensor lingkungan (suhu & kelembapan), siklus hidup larva/lalat BSF, serta manajemen panen pakan bebek petelur BUMDes Mekarjaya, silakan akses website khusus yang dikembangkan oleh rekan tim KKM kami.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-amber-200 pt-1">
              <span>• Sensor Suhu & Kelembapan</span>
              <span>• Siklus Metamorfosis Larva</span>
              <span>• Jadwal Pemberian Pakan Bebek BUMDes</span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col items-center lg:items-end justify-center">
            <a
              href={MAGGOT_MONITORING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-50 active:scale-95 text-amber-950 font-black text-xs sm:text-sm shadow-xl transition flex items-center justify-center gap-2.5 group text-center min-h-[46px]"
            >
              <span>Kunjungi Web Monitoring Maggot</span>
              <ExternalLink className="w-4 h-4 text-amber-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <span className="text-[11px] text-amber-200/90 mt-2 text-center lg:text-right">
              Membuka platform terintegrasi rekan KKM ↗
            </span>
          </div>
        </div>
      </div>

      {/* Ringkasan Data Sampah Organik Terkumpul di Bank Sampah */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Organik Terhimpun di Pos</span>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-950 font-sans">
              {formatWeight(stats.totalSampahOrganikKg || 0)}
            </div>
            <p className="text-[11px] text-emerald-700 mt-1">
              Dari setoran dapur warga 3 dusun
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 flex flex-col justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Potensi Konversi Maggot Fresh</span>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-amber-950 font-sans">
              ~{formatWeight(stats.totalEstMaggotKg || 0)}
            </div>
            <p className="text-[11px] text-amber-700 mt-1">
              Estimasi pakan alami protein tinggi (~20%)
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex flex-col justify-between">
            <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">Potensi Pupuk Organik Kasgot</span>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-purple-950 font-sans">
              ~{formatWeight((stats.totalSampahOrganikKg || 0) * 0.25)}
            </div>
            <p className="text-[11px] text-purple-700 mt-1">
              Subur untuk lahan pertanian warga desa
            </p>
          </div>
        </div>
      </div>

      {/* 5-Step Process Visualizer */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
              <span>Rantai 5 Tahap Ekonomi Sirkular Desa Mekarjaya</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Alur pemanfaatan limbah dapur rumah tangga menjadi nilai ekonomi bernilai tinggi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`rounded-2xl p-4 sm:p-5 border ${step.color} shadow-xs relative flex flex-col justify-between hover:shadow-sm transition`}
            >
              <div>
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="text-xl sm:text-2xl font-black text-slate-800 font-mono tracking-wider">{step.num}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-xs border border-slate-200">
                    {step.badge}
                  </span>
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">{step.title}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{step.desc}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 border border-slate-200 text-slate-400">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Simulator: Impact Calculator */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 text-white shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="lg:col-span-5 space-y-2.5 sm:space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-xs font-bold border border-emerald-400/30">
              <Calculator className="w-3.5 h-3.5" />
              <span>Simulasi Edukasi Manfaat</span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold leading-tight text-white">
              Kalkulator Potensi Manfaat Sampah Organik
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Ketahui perkiraan hasil konversi biopond Maggot BSF dan penghematan biaya pakan ternak bebek petelur BUMDes dari berat sampah organik yang disetor.
            </p>

            <div className="pt-2">
              <label className="block text-[11px] sm:text-xs font-bold text-emerald-200 mb-1">
                Volume Sampah Organik (Kg):
              </label>
              <div className="flex items-center gap-2 sm:gap-3">
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={calcOrganikKg}
                  onChange={(e) => setCalcOrganikKg(e.target.value)}
                  className="w-32 sm:w-36 p-2.5 sm:p-3 rounded-xl bg-white text-slate-900 font-extrabold text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 min-h-[44px]"
                />
                <span className="font-bold text-sm sm:text-base text-white">kg sampah dapur</span>
              </div>
            </div>
          </div>

          {/* Results cards */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-2.5 sm:gap-4 text-slate-900">
            {/* Panen Maggot */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4 shadow-sm border border-emerald-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-amber-800">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span className="truncate">Panen Maggot Fresh</span>
                </div>
                <div className="mt-2 text-lg sm:text-2xl font-extrabold text-slate-900 font-sans tracking-tight">
                  {formatWeight(estMaggot)}
                </div>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 line-clamp-2">
                Kaya protein (~40%) pakan bebek
              </p>
            </div>

            {/* Penghematan Pakan */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4 shadow-sm border border-emerald-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-emerald-800">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">Hemat Pakan Bebek</span>
                </div>
                <div className="mt-2 text-lg sm:text-2xl font-extrabold text-emerald-700 font-sans tracking-tight truncate">
                  {formatRupiah(estHematPakan)}
                </div>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 line-clamp-2">
                Efisiensi biaya ternak BUMDes
              </p>
            </div>

            {/* Pupuk Kasgot */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4 shadow-sm border border-purple-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-purple-800">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">Pupuk Kasgot</span>
                </div>
                <div className="mt-2 text-lg sm:text-2xl font-extrabold text-purple-900 font-sans tracking-tight">
                  {formatWeight(estKasgot)}
                </div>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 line-clamp-2">
                Menyuburkan pertanian desa
              </p>
            </div>

            {/* Reduksi Emisi */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-4 shadow-sm border border-blue-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-blue-800">
                  <Award className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span className="truncate">Reduksi Gas Metana</span>
                </div>
                <div className="mt-2 text-lg sm:text-2xl font-extrabold text-blue-900 font-sans tracking-tight">
                  ~{estReduksiCO2.toFixed(1)} kg
                </div>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 line-clamp-2">
                Mencegah tumpukan sampah busuk
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Panduan Pemilahan Sampah Organik untuk Warga Desa */}
      <div className="bg-slate-100/80 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200/80 space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <h3 className="text-base sm:text-lg font-extrabold text-slate-800">
            Panduan Pemilahan Sampah Organik Layak Biopond
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white p-4 rounded-2xl border border-emerald-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Bahan yang SANGAT DISUKAI Larva Maggot (DITERIMA):</span>
            </div>
            <ul className="space-y-1.5 text-slate-600 pl-6 list-disc">
              <li>Sisa potongan sayuran mentah (sawi, bayam, kol, wortel).</li>
              <li>Kulit dan potongan buah lunak (pepaya, pisang, semangka, melon).</li>
              <li>Sisa nasi putih, ampas kelapa, dan ampas tahu dari dapur atau warung.</li>
              <li>Limbah roti tawar, kue basah, dan olahan tepung yang sudah basi.</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-rose-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-800">
              <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>Bahan yang DILARANG DICAMPURKAN (DITOLAK):</span>
            </div>
            <ul className="space-y-1.5 text-slate-600 pl-6 list-disc">
              <li>Kantong kresek, plastik bungkus, kawat, steples, dan sendok plastik.</li>
              <li>Tulang sapi/kambing yang keras, batok kelapa, dan kayu keras.</li>
              <li>Puntung rokok, baterai, abu obat nyamuk, dan bahan kimia rumah tangga.</li>
              <li>Minyak goreng jelantah pekat (harus disetor terpisah ke pos jelantah).</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
