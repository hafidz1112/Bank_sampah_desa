import React, { useState, useEffect } from 'react';
import { 
  Gamepad2, 
  RotateCcw, 
  Trophy, 
  Sparkles, 
  Heart, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Award, 
  Info, 
  Zap, 
  FileText, 
  HelpCircle,
  ArrowDown
} from 'lucide-react';
import confetti from 'canvas-confetti';

// 4 Tempat Sampah Realistis Tematik Desa Mekarjaya
const REAL_TRASH_BINS = [
  {
    id: 'organik',
    title: 'Organik',
    shortTitle: 'ORGANIK',
    subtitle: 'Maggot BSF',
    mainColor: '#16a34a', // Emerald 600
    darkColor: '#14532d', // Emerald 900
    lightColor: '#4ade80', // Emerald 400
    iconEmoji: '🥬',
    badgeText: 'Pakan Maggot',
    desc: 'Sisa sayur, buah, nasi basi, ampas kelapa, daun'
  },
  {
    id: 'plastik',
    title: 'Plastik',
    shortTitle: 'PLASTIK',
    subtitle: 'Daur Ulang',
    mainColor: '#0284c7', // Sky 600
    darkColor: '#0c4a6e', // Sky 900
    lightColor: '#38bdf8', // Sky 400
    iconEmoji: '🧴',
    badgeText: 'Daur Ulang',
    desc: 'Botol PET, gelas plastik, kresek, tutup botol'
  },
  {
    id: 'kertas',
    title: 'Kertas',
    shortTitle: 'KERTAS',
    subtitle: 'Karton / Box',
    mainColor: '#eab308', // Yellow 500
    darkColor: '#78350f', // Amber 900
    lightColor: '#fde047', // Yellow 300
    iconEmoji: '📦',
    badgeText: 'Bank Sampah',
    desc: 'Kardus, buku bekas, koran, kertas HVS'
  },
  {
    id: 'logam_kaca',
    title: 'Logam & Kaca',
    shortTitle: 'LOGAM/KACA',
    subtitle: 'Beling & Kaleng',
    mainColor: '#e11d48', // Rose 600
    darkColor: '#881337', // Rose 900
    lightColor: '#fb7185', // Rose 400
    iconEmoji: '🥫',
    badgeText: 'Nilai Tinggi',
    desc: 'Kaleng soda, botol kaca sirup/kecap, paku, besi'
  }
];

// Bank Data Sampah Random (24 item khas rumah tangga desa)
const ALL_TRASH_ITEMS = [
  // Organik
  { id: 'o1', name: 'Sisa Sayur Kangkung', category: 'organik', emoji: '🥬', hint: 'Limbah Dapur Basah', tip: 'Sangat disukai larva Maggot BSF dan cepat terurai.' },
  { id: 'o2', name: 'Kulit Pisang Ambon', category: 'organik', emoji: '🍌', hint: 'Kulit Buah Manis', tip: 'Kaya kalium untuk nutrisi konversi biopond organik.' },
  { id: 'o3', name: 'Nasi Basi Sisa Makan', category: 'organik', emoji: '🍚', hint: 'Sisa Makanan Karbo', tip: 'Mengandung karbohidrat tinggi untuk pakan larva maggot.' },
  { id: 'o4', name: 'Ampas Kelapa Parut', category: 'organik', emoji: '🥥', hint: 'Ampas Dapur Tradisional', tip: 'Sumber serat alami pakan alternatif maggot BUMDes.' },
  { id: 'o5', name: 'Kulit Semangka Segar', category: 'organik', emoji: '🍉', hint: 'Limbah Buah Segar', tip: 'Kadar air tinggi yang cepat dicerna larva maggot.' },
  { id: 'o6', name: 'Daun Kering Pekarangan', category: 'organik', emoji: '🍂', hint: 'Sampah Kebun', tip: 'Bagus untuk campuran kompos dan kasgot bernutrisi.' },
  
  // Plastik
  { id: 'p1', name: 'Botol Air Mineral PET', category: 'plastik', emoji: '🧴', hint: 'Plastik PET Bening', tip: 'Harga jual tinggi di Bank Sampah Mekarjaya saat bersih.' },
  { id: 'p2', name: 'Gelas Plastik Bersih (PP)', category: 'plastik', emoji: '🥤', hint: 'Gelas Minuman Ringan', tip: 'Bersihkan sisa air agar ditimbang dengan bobot akurat.' },
  { id: 'p3', name: 'Kantong Kresek Belanja', category: 'plastik', emoji: '🛍️', hint: 'Plastik Film', tip: 'Dapat didaur ulang menjadi biji plastik jika tidak kotor.' },
  { id: 'p4', name: 'Tutup Botol Minuman', category: 'plastik', emoji: '🔘', hint: 'Plastik Keras HDPE', tip: 'Plastik jenis HDPE bernilai daur ulang tinggi.' },
  { id: 'p5', name: 'Wadah Sabun / Shampo', category: 'plastik', emoji: '🧼', hint: 'Botol Tebal', tip: 'Bilas bersih terlebih dahulu sebelum disetor ke pos.' },
  { id: 'p6', name: 'Sedotan Minuman Plastik', category: 'plastik', emoji: '🥤', hint: 'Plastik Pipih', tip: 'Kumpulkan dalam jumlah banyak untuk daur ulang ecobrick.' },

  // Kertas & Karton
  { id: 'k1', name: 'Kardus Box Paket Belanja', category: 'kertas', emoji: '📦', hint: 'Karton Gelombang', tip: 'Lipat rapi dan pipihkan agar mudah ditimbang.' },
  { id: 'k2', name: 'Kertas HVS Bekas Kantor', category: 'kertas', emoji: '📄', hint: 'Kertas Putih', tip: 'Kertas putih bersih bernilai timbangan paling tinggi.' },
  { id: 'k3', name: 'Koran & Tabloid Lawas', category: 'kertas', emoji: '📰', hint: 'Kertas Koran', tip: 'Ikat per kilogram untuk memudahkan pencatatan saldo.' },
  { id: 'k4', name: 'Buku Tulis Bekas Sekolah', category: 'kertas', emoji: '📚', hint: 'Kertas Jilid', tip: 'Lepaskan klip staples logam sebelum ditimbang.' },
  { id: 'k5', name: 'Paper Bag / Kantong Kertas', category: 'kertas', emoji: '🛍️', hint: 'Kertas Kraft', tip: 'Serat kertas kraft ramah daur ulang bubur kertas.' },
  { id: 'k6', name: 'Karton Rak Telur Ayam', category: 'kertas', emoji: '📦', hint: 'Karton Bubur Kertas', tip: 'Karton wadah telur terbuat dari bubur kertas daur ulang.' },

  // Logam & Kaca
  { id: 'm1', name: 'Kaleng Minuman Soda', category: 'logam_kaca', emoji: '🥫', hint: 'Aluminium Kaleng', tip: 'Aluminium ringan dengan harga timbangan per kg sangat baik.' },
  { id: 'm2', name: 'Botol Kaca Kecap / Sirup', category: 'logam_kaca', emoji: '🍾', hint: 'Beling / Kaca Tebal', tip: 'Bisa dicuci ulang atau dilebur kembali di pabrik daur ulang.' },
  { id: 'm3', name: 'Kaleng Wadah Biskuit', category: 'logam_kaca', emoji: '🥫', hint: 'Wadah Plat Seng Logam', tip: 'Wadah kaleng biskuit terbuat dari plat seng logam yang bernilai jual dan dapat dilebur kembali.' },
  { id: 'm4', name: 'Potongan Kawat & Paku', category: 'logam_kaca', emoji: '🔩', hint: 'Besi / Logam Tajam', tip: 'Pisahkan wadah khusus agar tidak melukai petugas pos.' },
  { id: 'm5', name: 'Tutup Botol Kaleng / Crown', category: 'logam_kaca', emoji: '🪙', hint: 'Tutup Logam', tip: 'Logam besi yang dapat dilebur kembali secara efisien.' },
  { id: 'm6', name: 'Gelas Kaca Retak', category: 'logam_kaca', emoji: '🍶', hint: 'Pecahan Kaca Bening', tip: 'Kaca bening dapat diolah menjadi bahan baku kaca baru.' }
];

const GAME_TOTAL_ITEMS = 12;

// Komponen Ilustrasi Tempat Sampah Sungguhan (Realistic 3D-feel Trash Can)
const RealisticTrashCan = ({ bin, isAnimating, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isLidOpen = isHovered || isAnimating;

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative w-full flex flex-col items-center justify-end transition-transform duration-200 active:scale-95 focus:outline-none select-none cursor-pointer ${
        isAnimating ? 'scale-105' : 'hover:-translate-y-1'
      }`}
      title={`Masukkan ke Tong Sampah ${bin.title} (${bin.subtitle})`}
    >
      {/* SVG Tempat Sampah Sungguhan */}
      <div className="w-full max-w-[80px] sm:max-w-[115px] lg:max-w-[130px] transition-all">
        <svg
          viewBox="0 0 100 135"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto drop-shadow-md overflow-visible"
        >
          {/* Roda Kiri */}
          <circle cx="21" cy="123" r="7.5" fill="#1e293b" />
          <circle cx="21" cy="123" r="3.5" fill="#94a3b8" />
          
          {/* Roda Kanan */}
          <circle cx="79" cy="123" r="7.5" fill="#1e293b" />
          <circle cx="79" cy="123" r="3.5" fill="#94a3b8" />

          {/* Gandar Bawah */}
          <rect x="23" y="118" width="54" height="5" rx="2" fill="#0f172a" />

          {/* Pedal Kaki */}
          <rect x="42" y="122" width="16" height="5" rx="1.5" fill="#475569" />

          {/* Gradients Warna Tong */}
          <defs>
            <linearGradient id={`grad-body-${bin.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={bin.darkColor} />
              <stop offset="28%" stopColor={bin.mainColor} />
              <stop offset="72%" stopColor={bin.mainColor} />
              <stop offset="100%" stopColor={bin.darkColor} />
            </linearGradient>
            <linearGradient id={`grad-lid-${bin.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={bin.darkColor} />
              <stop offset="35%" stopColor={bin.lightColor} />
              <stop offset="75%" stopColor={bin.mainColor} />
              <stop offset="100%" stopColor={bin.darkColor} />
            </linearGradient>
          </defs>

          {/* Badan Tong Sampah (Trapesium HDPE Tahan Banting) */}
          <path
            d="M 16 38 L 24 117 Q 25 119 28 119 L 72 119 Q 75 119 76 117 L 84 38 Z"
            fill={`url(#grad-body-${bin.id})`}
          />

          {/* Lis Kerah Atas Tong */}
          <rect x="13" y="34" width="74" height="6" rx="2" fill={bin.darkColor} />

          {/* Alur Garis Vertikal Tekstur Tong Publik */}
          <line x1="38" y1="46" x2="41" y2="110" stroke="rgba(0,0,0,0.18)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="50" y1="46" x2="50" y2="110" stroke="rgba(0,0,0,0.18)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="62" y1="46" x2="59" y2="110" stroke="rgba(0,0,0,0.18)" strokeWidth="2.5" strokeLinecap="round" />

          {/* Lambang & Teks Daur Ulang di Dada Tong */}
          <g transform="translate(50, 75)">
            {/* Latar Putih Bersih */}
            <rect x="-24" y="-17" width="48" height="34" rx="6" fill="rgba(255,255,255,0.95)" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
            {/* Emoji Kategori */}
            <text x="0" y="-1" textAnchor="middle" dominantBaseline="middle" fontSize="13">
              {bin.iconEmoji}
            </text>
            {/* Nama Singkat Kategori */}
            <text x="0" y="10" textAnchor="middle" dominantBaseline="middle" fontSize="6.5" fontWeight="900" fill={bin.darkColor} letterSpacing="0.4">
              {bin.shortTitle}
            </text>
          </g>

          {/* Tutup Tong Interaktif (Membuka Saat Hover / Klik) */}
          <g
            className={`transition-transform duration-200 origin-bottom-left ${
              isLidOpen ? '-translate-y-3.5 -rotate-14' : 'translate-y-0 rotate-0'
            }`}
          >
            {/* Gagang Tutup Atas */}
            <rect x="42" y="8" width="16" height="6" rx="2" fill={bin.darkColor} />
            {/* Kubah Tutup Tong */}
            <path
              d="M 18 30 L 26 14 Q 28 12 32 12 L 68 12 Q 72 12 74 14 L 82 30 Z"
              fill={`url(#grad-lid-${bin.id})`}
            />
            {/* Bibir Lis Tutup Menjorok */}
            <rect x="11" y="28" width="78" height="8" rx="3.5" fill={bin.darkColor} />
            {/* Garis Kilau Cahaya */}
            <line x1="28" y1="16" x2="72" y2="16" stroke={bin.lightColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          </g>
        </svg>
      </div>

      {/* Label Keterangan di Bawah Tong */}
      <div className="mt-1.5 sm:mt-2 text-center">
        <span className="block text-[11px] sm:text-xs font-black text-slate-800 leading-tight">
          {bin.title}
        </span>
        <span className="block text-[9px] sm:text-[10px] font-semibold text-slate-500 line-clamp-1">
          {bin.subtitle}
        </span>
      </div>
    </button>
  );
};

export const GamePilahSampah = ({ onNavigate }) => {
  // State murni di memori browser (tidak pakai database, hilang saat refresh)
  const [trashQueue, setTrashQueue] = useState([]);
  const [currentTrash, setCurrentTrash] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [sortedCount, setSortedCount] = useState(0);
  const [animatingBin, setAnimatingBin] = useState(null);

  // Inisialisasi game baru
  const startNewGame = () => {
    const shuffled = [...ALL_TRASH_ITEMS].sort(() => 0.5 - Math.random());
    const selectedRoundItems = shuffled.slice(0, GAME_TOTAL_ITEMS).map((item, index) => ({
      ...item,
      uniqueId: `${item.id}-${Date.now()}-${index}`
    }));

    setTrashQueue(selectedRoundItems);
    setCurrentTrash(selectedRoundItems[0] || null);
    setScore(0);
    setLives(3);
    setStreak(0);
    setFeedback(null);
    setGameFinished(false);
    setSortedCount(0);
    setAnimatingBin(null);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  // Handler memilih tempat sampah untuk sampah saat ini
  const handleSortTrash = (targetBinId) => {
    if (!currentTrash || gameFinished) return;

    setAnimatingBin(targetBinId);
    setTimeout(() => setAnimatingBin(null), 350);

    const isCorrect = currentTrash.category === targetBinId;
    const targetBin = REAL_TRASH_BINS.find(b => b.id === targetBinId);
    const correctBin = REAL_TRASH_BINS.find(b => b.id === currentTrash.category);

    if (isCorrect) {
      const bonusStreak = streak >= 2 ? (streak * 5) : 0;
      const pointsEarned = 10 + bonusStreak;
      setScore(prev => prev + pointsEarned);
      setStreak(prev => prev + 1);
      setSortedCount(prev => prev + 1);

      if (streak >= 2) {
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { y: 0.7 }
        });
      }

      setFeedback({
        status: 'correct',
        title: 'Tepat Sekali! 🎉',
        message: `${currentTrash.name} tepat masuk ke tempat sampah ${targetBin.title}.`,
        tip: currentTrash.tip,
        points: pointsEarned
      });

      // Pindah ke sampah berikutnya
      const nextQueue = trashQueue.filter(item => item.uniqueId !== currentTrash.uniqueId);
      setTrashQueue(nextQueue);

      if (nextQueue.length === 0) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.5 }
        });
        setGameFinished(true);
        setCurrentTrash(null);
      } else {
        setCurrentTrash(nextQueue[0]);
      }
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setStreak(0);

      setFeedback({
        status: 'wrong',
        title: 'Kurang Tepat! ❌',
        message: `${currentTrash.name} seharusnya dimasukkan ke tempat sampah ${correctBin.title} (${correctBin.subtitle}).`,
        tip: currentTrash.tip,
        points: 0
      });

      if (newLives <= 0) {
        setGameFinished(true);
      }
    }
  };

  const getStars = () => {
    if (score >= 140) return 3;
    if (score >= 80) return 2;
    if (score > 0) return 1;
    return 0;
  };

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 py-4 sm:py-7 space-y-4 sm:space-y-6">
      {/* 1. Header & HUD Terpadu (Ringkas, Hemat Ruang Layar HP) */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 text-white shadow-lg flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0 border border-emerald-400/30">
            <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white leading-tight">
              Pilah Sampah Mekarjaya
            </h1>
            <p className="text-[10px] sm:text-xs text-emerald-200/90 line-clamp-1">
              Sentuh tong sampah sungguhan di bawah untuk memilah
            </p>
          </div>
        </div>

        {/* HUD: Skor, Nyawa, Sisa */}
        <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/15">
          {/* Skor */}
          <div className="text-center px-1">
            <span className="text-[9px] uppercase font-bold text-emerald-300 block">Skor</span>
            <span className="text-sm sm:text-base font-black font-sans text-white">{score}</span>
          </div>

          <div className="w-px h-6 bg-white/20" />

          {/* Hati / Nyawa */}
          <div className="text-center px-1">
            <span className="text-[9px] uppercase font-bold text-rose-300 block">Nyawa</span>
            <div className="flex items-center gap-0.5 justify-center mt-0.5">
              {[1, 2, 3].map(heartIdx => (
                <Heart
                  key={heartIdx}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all ${
                    heartIdx <= lives ? 'text-rose-500 fill-rose-500 scale-100' : 'text-slate-500/40 scale-75'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="w-px h-6 bg-white/20" />

          {/* Sisa */}
          <div className="text-center px-1">
            <span className="text-[9px] uppercase font-bold text-amber-300 block">Sisa</span>
            <span className="text-sm sm:text-base font-black font-sans text-amber-200">
              {trashQueue.length}
            </span>
          </div>
        </div>
      </div>

      {!gameFinished ? (
        <div className="space-y-3.5 sm:space-y-5">
          {/* 2. AREA SAMPAH AKTIF (Tepat di atas tempat sampah - Tidak Perlu Scroll di HP) */}
          {currentTrash && (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-slate-200 shadow-sm text-center relative overflow-hidden">
              {streak >= 2 && (
                <div className="absolute top-2.5 right-3">
                  <span className="text-[10px] sm:text-xs font-black text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full animate-bounce flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-amber-500" /> Combo {streak}x!
                  </span>
                </div>
              )}

              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Pilah Sampah Ini:
              </span>

              {/* Emoji Sampah & Nama */}
              <div className="inline-flex items-center justify-center gap-3 sm:gap-4 my-1">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-xs flex items-center justify-center text-3xl sm:text-4xl flex-shrink-0 animate-scale-in">
                  {currentTrash.emoji}
                </div>
                <div className="text-left">
                  <h2 className="text-base sm:text-xl font-black text-slate-900 leading-tight">
                    {currentTrash.name}
                  </h2>
                  <span className="inline-block mt-0.5 text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {currentTrash.hint}
                  </span>
                </div>
              </div>

              {/* Indikator Panah ke Tempat Sampah */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-700 mt-2">
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                <span>Sentuh salah satu tong sampah di bawah:</span>
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              </div>
            </div>
          )}

          {/* 3. SATU-SATUNYA TEMPAT SAMPAH (Ilustrasi Tong Sampah Asli - 4 Sejajar) */}
          <div className="bg-slate-100/80 rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-slate-200/90 shadow-xs">
            <div className="grid grid-cols-4 gap-2 sm:gap-4 items-end">
              {REAL_TRASH_BINS.map((bin) => (
                <RealisticTrashCan
                  key={bin.id}
                  bin={bin}
                  isAnimating={animatingBin === bin.id}
                  onSelect={() => handleSortTrash(bin.id)}
                />
              ))}
            </div>
          </div>

          {/* 4. Feedback Notifikasi Hasil Tebakan (Kompak) */}
          {feedback && (
            <div
              className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border transition animate-fade-in flex items-start justify-between gap-2.5 text-xs sm:text-sm ${
                feedback.status === 'correct'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
              }`}
            >
              <div className="flex items-start gap-2">
                {feedback.status === 'correct' ? (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <div className="font-extrabold text-xs sm:text-sm">
                    {feedback.title} {feedback.points > 0 && `(+${feedback.points} Poin)`}
                  </div>
                  <p className="font-medium text-[11px] sm:text-xs leading-snug">{feedback.message}</p>
                  <p className="text-[10px] sm:text-[11px] opacity-85 pt-0.5">
                    💡 <strong>Tips Warga:</strong> {feedback.tip}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFeedback(null)}
                className="text-xs font-bold opacity-60 hover:opacity-100 p-0.5"
              >
                ✕
              </button>
            </div>
          )}

          {/* 5. Progress Titik Sisa Sampah Ronde Ini */}
          <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
            <span className="text-[11px] font-semibold">
              Progres Ronde ({sortedCount}/{GAME_TOTAL_ITEMS} Sampah)
            </span>
            <div className="flex items-center gap-1 sm:gap-1.5">
              {Array.from({ length: GAME_TOTAL_ITEMS }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                    idx < sortedCount
                      ? 'bg-emerald-500 scale-110'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Layar Hasil Permainan Selesai */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl text-center space-y-5 animate-scale-in">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {lives > 0 ? 'Permainan Selesai!' : 'Kesempatan Habis!'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {lives > 0 ? 'Pahlawan Lingkungan Mekarjaya! 🌟' : 'Terus Berlatih Memilah Sampah! 💪'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              {lives > 0
                ? `Luar biasa! Anda berhasil memilah ${sortedCount} sampah dengan total skor ${score} poin.`
                : `Jangan berkecil hati! Anda telah mengumpulkan ${score} poin dari ${sortedCount} sampah yang terpilah.`}
            </p>
          </div>

          {/* Bintang */}
          <div className="flex justify-center gap-1.5 text-2xl">
            {[1, 2, 3].map((starIdx) => (
              <span
                key={starIdx}
                className={starIdx <= getStars() ? 'text-amber-400 scale-110' : 'text-slate-200'}
              >
                ★
              </span>
            ))}
          </div>

          {/* Ringkasan Skor */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-sm mx-auto text-center">
            <div className="p-2.5 sm:p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-[9px] sm:text-[10px] text-emerald-800 font-bold uppercase block">Skor</span>
              <span className="text-base sm:text-lg font-black text-emerald-950 font-sans">{score}</span>
            </div>
            <div className="p-2.5 sm:p-3 bg-blue-50 rounded-2xl border border-blue-100">
              <span className="text-[9px] sm:text-[10px] text-blue-800 font-bold uppercase block">Terpilah</span>
              <span className="text-base sm:text-lg font-black text-blue-950 font-sans">{sortedCount}</span>
            </div>
            <div className="p-2.5 sm:p-3 bg-purple-50 rounded-2xl border border-purple-100">
              <span className="text-[9px] sm:text-[10px] text-purple-800 font-bold uppercase block">Sisa Hati</span>
              <span className="text-base sm:text-lg font-black text-purple-950 font-sans">{lives}/3</span>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
            <button
              onClick={startNewGame}
              className="w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Main Lagi (Acak Sampah)</span>
            </button>

            {onNavigate && (
              <button
                onClick={() => onNavigate('katalog-public')}
                className="w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Lihat Katalog Sampah</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Catatan Edukasi Bawah */}
      <div className="bg-slate-100/80 rounded-xl p-3 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>Game edukasi ini murni berjalan di browser tanpa menyimpan database.</span>
        </div>
        <button
          onClick={startNewGame}
          className="font-bold text-emerald-700 hover:underline flex items-center gap-1 flex-shrink-0"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
