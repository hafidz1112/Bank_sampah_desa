import React, { useState } from 'react';
import { 
  Sparkles, 
  Leaf, 
  Egg, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Scale, 
  Calculator,
  Calendar,
  Layers,
  Flame,
  Award
} from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';
import { formatWeight, formatRupiah, formatDate } from '../../lib/utils';

export const AlurSirkularMaggot = () => {
  const { logOrganikList, getStats } = useBankSampah();
  const stats = getStats();
  const [calcOrganikKg, setCalcOrganikKg] = useState(100);

  // Conversion formulas:
  // 100 kg organic waste -> ~20 kg fresh maggot (20% yield)
  // 100 kg organic waste -> ~25 kg kasgot fertilizer (25% yield)
  // 20 kg fresh maggot replaces ~15 kg commercial duck feed (saves ~Rp 8.500/kg)
  // Methane reduction: ~25 kg CO2e per 100kg organic waste diverted
  const estMaggot = (parseFloat(calcOrganikKg) || 0) * 0.20;
  const estKasgot = (parseFloat(calcOrganikKg) || 0) * 0.25;
  const estHematPakan = estMaggot * 0.75 * 8500;
  const estReduksiCO2 = (parseFloat(calcOrganikKg) || 0) * 0.25;

  const steps = [
    {
      num: '01',
      title: 'Pemilahan Organik Warga',
      desc: 'Warga Dusun Cimenang, Ciganda, dan Cimuda memilah sisa sayur, buah, nasi, dan limbah dapur dari rumah tangga.',
      badge: 'Langkah Awal',
      color: 'border-emerald-200 bg-emerald-50/50'
    },
    {
      num: '02',
      title: 'Penimbangan & Pos Bank Sampah',
      desc: 'Sampah organik disetor ke Bank Sampah Mekarjaya. Warga menerima saldo tabungan per kg sampah organik.',
      badge: 'Insentif Tabungan',
      color: 'border-blue-200 bg-blue-50/50'
    },
    {
      num: '03',
      title: 'Biokonversi di Biopond Maggot BSF',
      desc: 'Larva Black Soldier Fly (Hermetia illucens) mengurai sampah organik 3-5 kali lebih cepat dari pengomposan biasa.',
      badge: 'Teknologi Alami',
      color: 'border-amber-200 bg-amber-50/50'
    },
    {
      num: '04',
      title: 'Pakan Bebek Petelur BUMDes',
      desc: 'Larva segar kaya protein (~40%) dan asam amino esensial dijadikan pakan suplemen bebek petelur BUMDes Mekarjaya.',
      badge: 'Efisiensi Biaya',
      color: 'border-yellow-200 bg-yellow-50/50'
    },
    {
      num: '05',
      title: 'Produksi Telur & Pupuk Kasgot',
      desc: 'BUMDes panen telur bebek berkualitas tinggi, sedangkan residu kasgot (bekas maggot) jadi pupuk organik pertanian desa.',
      badge: 'Zero Waste Sirkular',
      color: 'border-purple-200 bg-purple-50/50'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Ekosistem Sirkular Desa Terpadu
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Alur Ekonomi Sirkular Maggot BSF Mekarjaya
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Mengintegrasikan penanganan sampah organik warga dengan rantai pasok pakan ternak bebek petelur BUMDes Mekarjaya dan produksi pupuk organik kasgot.
        </p>
      </div>

      {/* Interactive 5-Step Process Visualizer */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-600" />
          Rantai Sirkular 5 Tahap Pengelolaan Sampah Organik
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`rounded-2xl p-5 border ${step.color} shadow-sm relative flex flex-col justify-between hover:shadow-md transition`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-black text-slate-800 font-mono tracking-wider">{step.num}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-700 shadow-xs border border-slate-200">
                    {step.badge}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 leading-snug">{step.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{step.desc}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-1 border border-slate-200 text-slate-400">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Simulator: Impact Calculator */}
      <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
              <Calculator className="w-3.5 h-3.5" />
              Simulasi Nilai Tambah Desa
            </div>
            <h3 className="text-2xl sm:text-3xl font-black leading-tight">
              Hitung Potensi Panen & Efisiensi BUMDes
            </h3>
            <p className="text-xs sm:text-sm text-amber-100 leading-relaxed">
              Ketahui seberapa besar penghematan biaya pakan bebek petelur BUMDes dan pupuk kasgot yang dihasilkan dari pasokan sampah organik desa.
            </p>

            <div className="pt-2">
              <label className="block text-xs font-bold text-amber-100 mb-1">
                Volume Sampah Organik Warga (Kilogram):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={calcOrganikKg}
                  onChange={(e) => setCalcOrganikKg(e.target.value)}
                  className="w-36 p-3 rounded-xl bg-white text-slate-900 font-extrabold text-base focus:outline-none focus:ring-2 focus:ring-white"
                />
                <span className="font-bold text-lg text-white">kg sampah</span>
              </div>
            </div>
          </div>

          {/* Results cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-900">
            {/* Panen Maggot */}
            <div className="bg-white rounded-2xl p-4 shadow-md border border-amber-100">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Estimasi Panen Maggot Fresh
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900 font-sans">
                {formatWeight(estMaggot)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Kandungan protein tinggi ~40% siap konsumsi ternak
              </p>
            </div>

            {/* Penghematan Pakan */}
            <div className="bg-white rounded-2xl p-4 shadow-md border border-emerald-100">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                Hemat Biaya Pakan Bebek
              </div>
              <div className="mt-2 text-2xl font-extrabold text-emerald-700 font-sans">
                {formatRupiah(estHematPakan)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Substitusi konsentrat pakan bebek petelur BUMDes
              </p>
            </div>

            {/* Pupuk Kasgot */}
            <div className="bg-white rounded-2xl p-4 shadow-md border border-purple-100">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-800">
                <Leaf className="w-4 h-4 text-emerald-600" />
                Hasil Pupuk Organik Kasgot
              </div>
              <div className="mt-2 text-2xl font-extrabold text-purple-900 font-sans">
                {formatWeight(estKasgot)}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Subur untuk pertanian dan kebun sayur warga
              </p>
            </div>

            {/* Reduksi Emisi Metana */}
            <div className="bg-white rounded-2xl p-4 shadow-md border border-blue-100">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-800">
                <Award className="w-4 h-4 text-blue-600" />
                Reduksi Gas Rumah Kaca
              </div>
              <div className="mt-2 text-2xl font-extrabold text-blue-900 font-sans">
                ~{estReduksiCO2.toFixed(1)} kg CO₂e
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Mencegah pembusukan liar penghasil gas metana di TPS
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Log Aliran Organik ke Biopond */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">Log Lapangan Terkini</span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
              Aliran Sampah Organik ke Biopond Maggot BSF
            </h3>
          </div>
          <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg self-start sm:self-auto">
            Total Tercatat: {formatWeight(stats.totalSampahOrganikLogKg)}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-3">Tanggal</th>
                <th className="py-3 px-3">Volume Masuk</th>
                <th className="py-3 px-3">Unit Biopond</th>
                <th className="py-3 px-3">Est. Panen Maggot</th>
                <th className="py-3 px-3">Alokasi Sasaran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {logOrganikList.slice(0, 5).map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-semibold text-slate-700 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(log.tanggal, false)}
                  </td>
                  <td className="py-3 px-3 font-bold text-amber-800">
                    {formatWeight(log.volume_sampah_organik_kg)}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {log.tujuan_biopond}
                  </td>
                  <td className="py-3 px-3 font-bold text-emerald-700">
                    {formatWeight(log.est_maggot_panen_kg)}
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
                      <Egg className="w-3 h-3 text-amber-600" />
                      {log.target_alokasi}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
