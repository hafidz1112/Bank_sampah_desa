/**
 * Formatting and utility helpers for SI-BSDes Mekarjaya
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

// Generate unique transaction code: TRX-YYYYMMDD-XXXX
export const generateTxCode = (type = 'SETOR') => {
  const prefix = type.toUpperCase() === 'TARIK' ? 'TRK' : 'STR';
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${y}${m}${d}-${random}`;
};

// Generate new Account Number for Nasabah: BSDES-MJ-XXX
export const generateNoRekening = (existingCount = 0) => {
  const num = String(existingCount + 1).padStart(3, '0');
  return `BSDES-MJ-${num}`;
};

// Dusun list in Desa Mekarjaya
export const DUSUN_LIST = [
  'Dusun Cimenang',
  'Dusun Ciganda',
  'Dusun Cimuda'
];

// Biopond list
export const BIOPOND_UNITS = [
  'Biopond Maggot Unit 1 (Kandang Utama)',
  'Biopond Maggot Unit 2 (Dusun Ciganda)',
  'Biopond Maggot Unit 3 (Dusun Cimenang)',
  'Biopond Maggot Unit 4 (Dusun Cimuda)'
];

// URL Website Rekan KKM untuk Monitoring Budidaya Maggot BSF
export const MAGGOT_MONITORING_URL = 'https://monitoring-maggot-mekarjaya.vercel.app';

