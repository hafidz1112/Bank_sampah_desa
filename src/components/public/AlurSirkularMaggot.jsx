import React, { useState } from 'react';
import { 
  Sparkles, 
  Leaf, 
  ArrowRight, 
  TrendingUp, 
  Calculator, 
  Layers, 
  Award,
  Info,
  CheckCircle2,
  XCircle,
  Scale,
  Wallet,
  Building2,
  Trash2
} from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';
import { formatWeight, formatRupiah, KATEGORI_SAMPAH_4 } from '../../lib/utils';

export const AlurSirkularMaggot = () => {
  const { getStats, rtList } = useBankSampah();
  const stats = getStats();

  const [calcBeratBotol, setCalcBeratBotol] = useState(15);
  const [calcBeratPlastik, setCalcBeratPlastik] = useState(10);
  const [calcBeratKardus, setCalcBeratKardus] = useState(25);
  const [calcBeratBesiKaca, setCalcBeratBesiKaca] = useState(10);

  // Estimasi pendapatan rupiah
  const totalEstimasiRupiah = 
    (parseFloat(calcBeratBotol) || 0) * 3500 +
    (parseFloat(calcBeratPlastik) || 0) * 2200 +
    (parseFloat(calcBeratKardus) || 0) * 2500 +
    (parseFloat(calcBeratBesiKaca) || 0) * 3000;

  const totalBeratSimulasi = 
    (parseFloat(calcBeratBotol) || 0) +
    (parseFloat(calcBeratPlastik) || 0) +
    (parseFloat(calcBeratKardus) || 0) +
    (parseFloat(calcBeratBesiKaca) || 0);

  const wadahList = [
    {
      nama: '1. Wadah Botol Plastik',
      badge: 'PET Bening',
      color: 'border-sky-300 bg-sky-50/60',
      tagColor: 'bg-sky-100 text-sky-800 border-sky-200',
      icon: '🧴',
      tarif: 'Rp 3.500 /kg',
      contoh: 'Botol air mineral, botol teh bening, botol deterjen/shampo bersih.',
      tips: 'Kempeskan botol dan lepaskan tutup botol agar hemat tempat wadah.'
    },
    {
      nama: '2. Wadah Plastik Keras / Emberan',
      badge: 'Ember, Baskom & Jerigen',
      color: 'border-teal-300 bg-teal-50/60',
      tagColor: 'bg-teal-100 text-teal-800 border-teal-200',
      icon: '🪣',
      tarif: 'Rp 2.200 /kg',
      contoh: 'Ember bekas, baskom, gayung pecah, jerigen, botol sabun/shampo tebal, pot bunga plastik.',
      tips: 'Bersihkan dari sisa kotoran semen atau tanah agar dihargai maksimal oleh pengepul.'
    },
    {
      nama: '3. Wadah Kardus & Kertas',
      badge: 'Box & Karton',
      color: 'border-amber-300 bg-amber-50/60',
      tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: '📦',
      tarif: 'Rp 2.500 /kg',
      contoh: 'Kardus box cokelat, kertas HVS bekas, koran, buku tulis tanpa plastik.',
      tips: 'Lipat kardus hingga pipih dan ikat rapi saat disimpan di penampungan.'
    },
    {
      nama: '4. Wadah Besi & Kaca',
      badge: 'Kaleng & Beling',
      color: 'border-rose-300 bg-rose-50/60',
      tagColor: 'bg-rose-100 text-rose-800 border-rose-200',
      icon: '🥫',
      tarif: 'Rp 3.000 /kg',
      contoh: 'Kaleng susu/soda, seng, potongan besi, serta botol beling sirup/kecap.',
      tips: 'Hati-hati dengan pecahan kaca, simpan botol beling dalam posisi tegak.'
    }
  ];

  const flowSteps = [
    {
      step: '01',
      title: 'Pembuangan Terpilah',
      desc: 'Warga membuang sampah langsung ke salah satu dari 4 wadah yang tersedia di pos Bank Sampah Aktif Mekarjaya.',
      icon: '🗑️'
    },
    {
      step: '02',
      title: 'Penyimpanan Sementara',
      desc: 'Pengurus mengumpulkan sampah terpilah dari 4 wadah ke pos penyimpanan sementara agar volume cukup untuk dijual.',
      icon: '📦'
    },
    {
      step: '03',
      title: 'Penimbangan & Penjualan',
      desc: 'Sampah yang terkumpul ditimbang bersama pengepul/lapak dengan harga transparan per kilogram.',
      icon: '⚖️'
    },
    {
      step: '04',
      title: 'Masuk Kas / Tabungan RT',
      desc: 'Hasil penjualan langsung dicatat ke sistem dan dialokasikan ke saldo kas RT untuk kegiatan sosial & kebersihan warga.',
      icon: '💰'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 sm:space-y-14">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2 sm:space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Bank Sampah Aktif Desa Mekarjaya
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Panduan 4 Wadah Sampah Terpilah Bank Sampah Aktif
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-slate-600 leading-relaxed">
          Program Bank Sampah Aktif Desa Mekarjaya menyediakan sarana pemilahan <strong>4 wadah tematik</strong>. Siapa pun dapat langsung membuang sampah terpilah tanpa prosedur pendaftaran perorangan. Sampah yang terkumpul dijual berkala ke pengepul dan seluruh hasilnya menjadi <strong>tabungan kas RT</strong>!
        </p>
      </div>

      {/* Ringkasan Dampak Kas RT Saat Ini */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-5 sm:p-8 text-white shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center sm:text-left">
          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 min-w-0">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block truncate">Total Sampah Terjual</span>
            <div className="mt-2 text-xl sm:text-3xl font-black font-sans text-white truncate">
              {formatWeight(stats.totalBeratSampahKg)}
            </div>
            <p className="text-[11px] text-emerald-100 mt-1 truncate">
              Dari 4 wadah pilah Bank Sampah Aktif
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 min-w-0">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block truncate">Total Kas RT Terhimpun</span>
            <div className="mt-2 text-xl sm:text-3xl font-black font-sans text-emerald-300 truncate">
              {formatRupiah(stats.totalSaldoKas)}
            </div>
            <p className="text-[11px] text-emerald-100 mt-1 truncate">
              Saldo aktif milik warga di seluruh RT
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/10 border border-white/10 min-w-0">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block truncate">Cakupan Wilayah Penerima</span>
            <div className="mt-2 text-xl sm:text-3xl font-black font-sans text-white truncate">
              {stats.totalRt} RT
            </div>
            <p className="text-[11px] text-emerald-100 mt-1 truncate">
              Dusun Cimenang, Ciganda, & Cimuda
            </p>
          </div>
        </div>
      </div>

      {/* 4 Wadah Tempat Sampah Visualizer */}
      <div className="space-y-4">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Kenali 4 Tempat Sampah Terpilah Bank Sampah Aktif
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Setiap jenis sampah memiliki wadah khusus dan harga jual berbeda yang menguntungkan kas RT
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {wadahList.map((w, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-5 border-2 ${w.color} shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{w.icon}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${w.tagColor}`}>
                    {w.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{w.nama}</h3>
                  <div className="font-black text-sm text-emerald-700 font-sans mt-0.5">
                    Tarif Acuan: {w.tarif}
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p><strong>Contoh Sampah:</strong> {w.contoh}</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 text-[11px] font-semibold text-slate-500">
                💡 <strong>Tips:</strong> {w.tips}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alur Kerja 4 Tahap */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Alur Pengelolaan Praktis</span>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
            Bagaimana Sampah Menjadi Tabungan Kas RT?
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Warga tidak perlu repot membuka rekening tabungan sendiri. Cukup pilah saat membuang ke 4 wadah Bank Sampah Aktif.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {flowSteps.map((f, i) => (
            <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{f.icon}</span>
                  <span className="font-mono font-black text-slate-400 text-sm">LANGKAH {f.step}</span>
                </div>
                <h4 className="font-bold text-sm text-slate-900">{f.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulator: Kalkulator Potensi Kas RT */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
              <Calculator className="w-3.5 h-3.5" />
              Simulasi Pendapatan Kas RT
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Kalkulator Potensi Tabungan Kas RT
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Ketahui estimasi dana kas yang terkumpul untuk warga RT jika sampah dari 4 wadah Bank Sampah Aktif berhasil dikumpulkan setiap bulan.
            </p>
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 text-slate-900 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Botol Plastik (Kg)</label>
                <input
                  type="number"
                  min="0"
                  value={calcBeratBotol}
                  onChange={(e) => setCalcBeratBotol(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Plastik Cup/Kresek (Kg)</label>
                <input
                  type="number"
                  min="0"
                  value={calcBeratPlastik}
                  onChange={(e) => setCalcBeratPlastik(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Kardus/Kertas (Kg)</label>
                <input
                  type="number"
                  min="0"
                  value={calcBeratKardus}
                  onChange={(e) => setCalcBeratKardus(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">Besi & Kaca (Kg)</label>
                <input
                  type="number"
                  min="0"
                  value={calcBeratBesiKaca}
                  onChange={(e) => setCalcBeratBesiKaca(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="p-3.5 sm:p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <div className="min-w-0">
                <span className="text-[11px] text-emerald-700 font-bold block">
                  Total Estimasi Dana Kas Masuk ke RT:
                </span>
                <span className="text-xl sm:text-3xl font-black text-emerald-800 font-sans truncate block">
                  {formatRupiah(totalEstimasiRupiah)}
                </span>
              </div>
              <div className="text-left sm:text-right pt-2 sm:pt-0 border-t sm:border-t-0 border-emerald-200 w-full sm:w-auto">
                <span className="text-[10px] text-slate-500 block">Total Bobot:</span>
                <span className="font-bold text-xs sm:text-sm text-slate-800">{formatWeight(totalBeratSimulasi)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
