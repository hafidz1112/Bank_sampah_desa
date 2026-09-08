/**
 * Formatting and utility helpers for SI-BSDes Bank Sampah Aktif Mekarjaya
 * Bank Sampah Terpilah 4 Wadah & Tabungan Kas RT
 */

// Format number to IDR currency
export const formatRupiah = (number) => {
  if (number === null || number === undefined || isNaN(number)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

// Format weight to Indonesian decimal format (e.g., 2,5 kg)
export const formatWeight = (kg) => {
  if (kg === null || kg === undefined || isNaN(kg)) return '0 kg';
  const num = parseFloat(kg);
  return `${num.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} kg`;
};

// Format standard Date (WIB format)
export const formatDate = (dateString, includeTime = true) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {})
  };
  return date.toLocaleDateString('id-ID', options);
};

// Generate unique transaction code: PJL-YYYYMMDD-XXXX or SLR-YYYYMMDD-XXXX
export const generateTxCode = (type = 'PENJUALAN') => {
  const isPenyaluran = type.toUpperCase() === 'PENYALURAN' || type.toUpperCase() === 'TARIK';
  const prefix = isPenyaluran ? 'SLR' : 'PJL';
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${y}${m}${d}-${random}`;
};

// Generate unique RT Code: RT-0X-DUSUN
export const generateKodeRt = (arg1, arg2, arg3) => {
  let rtNum = '01';
  let dusun = 'CIMENANG';

  // If first arg looks like dusun (contains 'dusun' or matches dusun name)
  if (typeof arg1 === 'string' && (arg1.toLowerCase().includes('dusun') || arg1.toLowerCase().includes('ci'))) {
    dusun = arg1;
    rtNum = arg2 || '01';
  } else {
    rtNum = arg1 || '01';
    dusun = arg3 || arg2 || 'CIMENANG';
  }

  const cleanDusun = String(dusun || 'CIMENANG')
    .replace(/dusun /i, '')
    .toUpperCase()
    .trim();
  const rtFormatted = String(rtNum).replace(/\D/g, '').padStart(2, '0') || '01';
  return `RT-${rtFormatted}-${cleanDusun}`;
};

// Dusun list in Desa Mekarjaya
export const DUSUN_LIST = [
  'Dusun Cimenang',
  'Dusun Ciganda',
  'Dusun Cimuda'
];

// 4 Kategori Sampah Resmi Wadah Pilah Bank Sampah Aktif
export const KATEGORI_SAMPAH_4 = [
  {
    id: 'botol_plastik',
    label: 'Botol Plastik',
    sublabel: 'PET Bening, Botol Air Mineral & Minuman Bersih',
    color: '#0284c7',
    icon: '🧴'
  },
  {
    id: 'plastik',
    label: 'Plastik',
    sublabel: 'Gelas Plastik PP, Kantong Kresek & Lembaran Bersih',
    color: '#0ea5e9',
    icon: '🥤'
  },
  {
    id: 'kardus_kertas',
    label: 'Kardus & Kertas',
    sublabel: 'Box Karton Gelombang, HVS, Koran, Buku Bekas',
    color: '#eab308',
    icon: '📦'
  },
  {
    id: 'besi_kaca',
    label: 'Besi & Kaca',
    sublabel: 'Kaleng Soda/Susu, Besi Seng, dan Botol Beling/Kaca',
    color: '#e11d48',
    icon: '🥫'
  }
];
