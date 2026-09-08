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

// 4 Tempat Sampah Realistis Tematik Bank Sampah Aktif
const REAL_TRASH_BINS = [
  {
    id: 'botol_plastik',
    title: 'Botol Plastik',
    shortTitle: 'BOTOL PET',
    subtitle: 'Wadah 1 (Aktif)',
    mainColor: '#0284c7', // Sky 600
    darkColor: '#0c4a6e', // Sky 900
    lightColor: '#38bdf8', // Sky 400
    iconEmoji: '🧴',
    badgeText: 'Rp 3.500/kg',
    desc: 'Botol air mineral PET bening, botol teh/jus bersih'
  },
  {
    id: 'plastik',
    title: 'Plastik',
    shortTitle: 'PLASTIK',
    subtitle: 'Wadah 2 (Aktif)',
    mainColor: '#0d9488', // Teal 600
    darkColor: '#134e4a', // Teal 900
    lightColor: '#2dd4bf', // Teal 400
    iconEmoji: '🥤',
    badgeText: 'Rp 2.200/kg',
    desc: 'Gelas plastik PP, kantong kresek, kemasan plastik bersih'
  },
  {
    id: 'kardus_kertas',
    title: 'Kardus & Kertas',
    shortTitle: 'KERTAS/BOX',
    subtitle: 'Wadah 3 (Aktif)',
    mainColor: '#eab308', // Yellow 500
    darkColor: '#78350f', // Amber 900
    lightColor: '#fde047', // Yellow 300
    iconEmoji: '📦',
    badgeText: 'Rp 2.500/kg',
    desc: 'Kardus box karton, kertas putih HVS, koran, buku tulis'
  },
  {
    id: 'besi_kaca',
    title: 'Besi & Kaca',
    shortTitle: 'BESI & BELING',
    subtitle: 'Wadah 4 (Aktif)',
    mainColor: '#e11d48', // Rose 600
    darkColor: '#881337', // Rose 900
    lightColor: '#fb7185', // Rose 400
    iconEmoji: '🥫',
    badgeText: 'Rp 3.000/kg',
    desc: 'Kaleng soda/susu, botol kaca kecap/sirup, paku, seng'
  }
];

// Bank Data Sampah Terpilah 4 Kategori (24 item khas sekolah & rumah tangga desa)
const ALL_TRASH_ITEMS = [
  // 1. Botol Plastik
  { id: 'bp1', name: 'Botol Air Mineral 600ml', category: 'botol_plastik', emoji: '🧴', hint: 'Botol PET Bening', tip: 'Masukkan ke Wadah Botol Plastik. Kempeskan botol agar hemat ruang.' },
  { id: 'bp2', name: 'Botol Teh Kemasan Plastik', category: 'botol_plastik', emoji: '🧴', hint: 'Botol Plastik Bening', tip: 'Kocok dan buang sisa cairan manisnya sebelum dibuang ke tong.' },
  { id: 'bp3', name: 'Botol Minyak Goreng Plastik', category: 'botol_plastik', emoji: '🛢️', hint: 'Plastik PET Bening', tip: 'Tiriskan minyak terlebih dahulu agar tidak mengotori botol lain.' },
  { id: 'bp4', name: 'Botol Minuman Isotonik', category: 'botol_plastik', emoji: '🧴', hint: 'Botol Plastik PET', tip: 'Lepaskan label plastik luarnya jika memungkinkan untuk harga jual maksimal.' },
  { id: 'bp5', name: 'Botol Saus Sambal Plastik', category: 'botol_plastik', emoji: '🍶', hint: 'Botol Plastik Bening', tip: 'Bilas bersih sisa saus agar tidak mengundang semut.' },
  { id: 'bp6', name: 'Botol Shampo / Sabun Cair', category: 'botol_plastik', emoji: '🧴', hint: 'Botol Plastik Tebal HDPE', tip: 'Plastik HDPE tebal bernilai timbangan tinggi di pengepul.' },
  
  // 2. Plastik Campur & Gelas PP
  { id: 'p1', name: 'Gelas Minuman Teh Poci (PP)', category: 'plastik', emoji: '🥤', hint: 'Gelas Plastik Bersih', tip: 'Masukkan ke Wadah Plastik. Lepaskan sedotan & tutup segelnya.' },
  { id: 'p2', name: 'Kantong Kresek Belanja', category: 'plastik', emoji: '🛍️', hint: 'Plastik Lembaran', tip: 'Pastikan kresek kering dan tidak bercampur tanah/sisa sayur.' },
  { id: 'p3', name: 'Sedotan Plastik Minuman', category: 'plastik', emoji: '🥤', hint: 'Plastik Kecil', tip: 'Dapat didaur ulang bersama gelas plastik kemasan.' },
  { id: 'p4', name: 'Gelas Kopi Plastik Bening', category: 'plastik', emoji: '☕', hint: 'Plastik PP Bersih', tip: 'Bilas sisa es kopi dan buang ke tong plastik.' },
  { id: 'p5', name: 'Wadah Thinwall Mika Makanan', category: 'plastik', emoji: '🍱', hint: 'Plastik PP Bening', tip: 'Bilas bersih minyak makanan sebelum dibuang ke tong.' },
  { id: 'p6', name: 'Bungkus Plastik Roti / Snack', category: 'plastik', emoji: '🍬', hint: 'Plastik Kemasan Kering', tip: 'Kumpulkan dalam wadah plastik agar mudah dipress.' },

  // 3. Kardus & Kertas
  { id: 'k1', name: 'Kardus Box Paket Belanja', category: 'kardus_kertas', emoji: '📦', hint: 'Karton Gelombang', tip: 'Masukkan ke Wadah Kardus & Kertas. Lipat pipih agar muat banyak.' },
  { id: 'k2', name: 'Kertas HVS Bekas Ujian/Tugas', category: 'kardus_kertas', emoji: '📄', hint: 'Kertas Putih Bersih', tip: 'Kertas putih bersih memiliki harga timbangan paling tinggi.' },
  { id: 'k3', name: 'Buku Tulis Bekas Sekolah', category: 'kardus_kertas', emoji: '📚', hint: 'Kertas Buku', tip: 'Lepaskan sampul plastik mika sebelum dimasukkan ke tong.' },
  { id: 'k4', name: 'Koran Bekas & Majalah', category: 'kardus_kertas', emoji: '📰', hint: 'Kertas Cetak', tip: 'Koran kering rapi sangat disukai pabrik bubur kertas daur ulang.' },
  { id: 'k5', name: 'Paper Bag / Tas Kertas Belanja', category: 'kardus_kertas', emoji: '🛍️', hint: 'Kertas Kraft Cokelat', tip: 'Bahan serat kraft mudah didaur ulang menjadi kertas baru.' },
  { id: 'k6', name: 'Karton Rak Telur Bebek', category: 'kardus_kertas', emoji: '📦', hint: 'Karton Cetak Telur', tip: 'Terbuat dari bubur kertas daur ulang ramah lingkungan.' },

  // 4. Besi & Kaca
  { id: 'm1', name: 'Kaleng Minuman Soda / Susu', category: 'besi_kaca', emoji: '🥫', hint: 'Kaleng Aluminium Logam', tip: 'Masukkan ke Wadah Besi & Kaca. Kaleng aluminium sangat berharga.' },
  { id: 'm2', name: 'Botol Kaca Sirup / Kecap', category: 'besi_kaca', emoji: '🍾', hint: 'Beling Kaca Bening', tip: 'Masukkan perlahan agar botol kaca tidak pecah dan melukai.' },
  { id: 'm3', name: 'Kaleng Biskuit Lebaran', category: 'besi_kaca', emoji: '🥫', hint: 'Plat Seng Kaleng', tip: 'Plat kaleng seng bernilai jual tinggi untuk dilebur kembali.' },
  { id: 'm4', name: 'Paku & Kawat Bekas Bangunan', category: 'besi_kaca', emoji: '🔩', hint: 'Besi Logam Tajam', tip: 'Kumpulkan dalam wadah kaleng agar aman bagi petugas pos.' },
  { id: 'm5', name: 'Tutup Botol Seng (Crown Cap)', category: 'besi_kaca', emoji: '🪙', hint: 'Tutup Logam Seng', tip: 'Logam besi yang siap dilebur kembali di pabrik baja.' },
  { id: 'm6', name: 'Toples Kaca Bekas Selai', category: 'besi_kaca', emoji: '🫙', hint: 'Wadah Kaca Tebal', tip: 'Bilas bersih toples kaca dan buang bersama tutup logamnya.' }
];

const GAME_TOTAL_ITEMS = 12;

// Komponen Ilustrasi Tempat Sampah Sungguhan 4 Wadah
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
      title={`Masukkan ke ${bin.title} (${bin.badgeText})`}
    >
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

          {/* Badan Tong Sampah */}
          <path
            d="M 16 38 L 24 117 Q 25 119 28 119 L 72 119 Q 75 119 76 117 L 84 38 Z"
            fill={`url(#grad-body-${bin.id})`}
          />

          <rect x="13" y="34" width="74" height="6" rx="2" fill={bin.darkColor} />

          <line x1="38" y1="46" x2="41" y2="110" stroke="rgba(0,0,0,0.18)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="50" y1="46" x2="50" y2="110" stroke="rgba(0,0,0,0.18)" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="62" y1="46" x2="59" y2="110" stroke="rgba(0,0,0,0.18)" strokeWidth="2.5" strokeLinecap="round" />

          {/* Label Tengah */}
          <g transform="translate(50, 75)">
            <rect x="-24" y="-17" width="48" height="34" rx="6" fill="rgba(255,255,255,0.95)" stroke="rgba(0,0,0,0.06)" strokeWidth="1" />
            <text x="0" y="-1" textAnchor="middle" dominantBaseline="middle" fontSize="13">
              {bin.iconEmoji}
            </text>
            <text x="0" y="10" textAnchor="middle" dominantBaseline="middle" fontSize="6" fontWeight="900" fill={bin.darkColor} letterSpacing="0.3">
              {bin.shortTitle}
            </text>
          </g>

          {/* Tutup Tong Interaktif */}
          <g
            className={`transition-transform duration-200 origin-bottom-left ${
              isLidOpen ? '-translate-y-3.5 -rotate-14' : 'translate-y-0 rotate-0'
            }`}
          >
            <rect x="42" y="8" width="16" height="6" rx="2" fill={bin.darkColor} />
            <path
              d="M 18 30 L 26 14 Q 28 12 32 12 L 68 12 Q 72 12 74 14 L 82 30 Z"
              fill={`url(#grad-lid-${bin.id})`}
            />
            <rect x="11" y="28" width="78" height="8" rx="3.5" fill={bin.darkColor} />
            <line x1="28" y1="16" x2="72" y2="16" stroke={bin.lightColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          </g>
        </svg>
      </div>

      <div className="mt-1.5 sm:mt-2 text-center">
        <span className="block text-[11px] sm:text-xs font-black text-slate-800 leading-tight">
          {bin.title}
        </span>
        <span className="block text-[9px] sm:text-[10px] font-bold text-emerald-700">
          {bin.badgeText}
        </span>
      </div>
    </button>
  );
};

export const GamePilahSampah = ({ onNavigate }) => {
  const [trashQueue, setTrashQueue] = useState([]);
  const [currentTrash, setCurrentTrash] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [gameFinished, setGameFinished] = useState(false);
  const [sortedCount, setSortedCount] = useState(0);
  const [animatingBin, setAnimatingBin] = useState(null);

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
        message: `${currentTrash.name} tepat masuk ke wadah ${targetBin.title}.`,
        tip: currentTrash.tip,
        points: pointsEarned
      });

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
        message: `${currentTrash.name} seharusnya dimasukkan ke wadah ${correctBin.title}.`,
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
      {/* 1. Header & HUD Terpadu */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 text-white shadow-lg flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0 border border-emerald-400/30">
            <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white leading-tight">
              Game 4 Wadah Pilah - Bank Sampah Desa Mekarjaya
            </h1>
            <p className="text-[10px] sm:text-xs text-emerald-200/90 line-clamp-1">
              Sentuh wadah yang tepat di bawah untuk memilah sampah
            </p>
          </div>
        </div>

        {/* HUD: Skor, Nyawa, Sisa */}
        <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/15">
          <div className="text-center px-1">
            <span className="text-[9px] uppercase font-bold text-emerald-300 block">Skor</span>
            <span className="text-sm sm:text-base font-black font-sans text-white">{score}</span>
          </div>

          <div className="w-px h-6 bg-white/20" />

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
          {/* 2. AREA SAMPAH AKTIF */}
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

              <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-emerald-700 mt-2">
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                <span>Sentuh salah satu dari 4 wadah di bawah:</span>
                <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              </div>
            </div>
          )}

          {/* 3. 4 TEMPAT SAMPAH REALISTIS */}
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

          {/* 4. Feedback Notifikasi */}
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

          {/* 5. Progress Titik Sisa Sampah */}
          <div className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
            <span className="text-[11px] font-semibold">
              Progres ({sortedCount}/{GAME_TOTAL_ITEMS} Sampah Terpilah)
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
        /* Layar Hasil Permainan */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl text-center space-y-5 animate-scale-in">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {lives > 0 ? 'Permainan Selesai!' : 'Kesempatan Habis!'}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {lives > 0 ? 'Pahlawan Pilah Sampah Desa Mekarjaya! 🌟' : 'Terus Berlatih Memilah Sampah! 💪'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              {lives > 0
                ? `Hebat! Anda berhasil memilah ${sortedCount} sampah ke 4 wadah Bank Sampah Aktif dengan total skor ${score} poin.`
                : `Terus semangat! Anda telah mengumpulkan ${score} poin dari ${sortedCount} sampah yang terpilah.`}
            </p>
          </div>

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
                <span>Lihat Tarif 4 Kategori</span>
              </button>
            )}
          </div>
        </div>
      )}

      <div className="bg-slate-100/80 rounded-xl p-3 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>Game ini mengajarkan cara memilah sampah ke 4 wadah Bank Sampah Aktif Mekarjaya.</span>
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
