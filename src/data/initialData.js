/**
 * Initial Seed Data for SI-BSDes Bank Sampah Aktif Mekarjaya
 * Penerapan: Tempat Sampah Terpilah 4 Wadah
 * Hasil Penjualan Sampah Menjadi Tabungan / Kas Warga per RT
 * Desa Mekarjaya, Kec. Ciawigebang, Kab. Kuningan
 */

export const INITIAL_KATALOG = [
  {
    id: 1,
    nama_kategori: 'Botol Plastik (PET Bening / Bersih)',
    tipe: 'botol_plastik',
    harga_per_kg: 3500,
    is_active: true,
    deskripsi: 'Botol air mineral bersih, botol teh/jus bening, tutup botol dilepas'
  },
  {
    id: 2,
    nama_kategori: 'Plastik (Kresek, Gelas PP & Campur)',
    tipe: 'plastik',
    harga_per_kg: 2200,
    is_active: true,
    deskripsi: 'Gelas plastik minuman kemasan (PP), kantong kresek kering, kemasan plastik bersih'
  },
  {
    id: 3,
    nama_kategori: 'Kardus & Kertas (Karton / Buku / Koran)',
    tipe: 'kardus_kertas',
    harga_per_kg: 2500,
    is_active: true,
    deskripsi: 'Kardus box gelombang kering, kertas putih HVS, koran, buku tulis bekas'
  },
  {
    id: 4,
    nama_kategori: 'Besi & Kaca (Kaleng, Seng, Beling Botol)',
    tipe: 'besi_kaca',
    harga_per_kg: 3000,
    is_active: true,
    deskripsi: 'Kaleng soda/susu, potongan besi/seng, dan botol kaca/beling sirup/kecap'
  }
];

export const INITIAL_RT = [
  {
    id: 1,
    kode_rt: 'RT-01-CIMENANG',
    nama_rt: 'RT 01 / RW 01',
    dusun: 'Dusun Cimenang',
    rw: '01',
    rt: '01',
    ketua_rt: 'Bapak Suryana',
    kontak: '081234567890',
    saldo_kas: 145000,
    total_sampah_terkumpul_kg: 48.5,
    created_at: '2026-01-10T08:30:00Z'
  },
  {
    id: 2,
    kode_rt: 'RT-02-CIMENANG',
    nama_rt: 'RT 02 / RW 01',
    dusun: 'Dusun Cimenang',
    rw: '01',
    rt: '02',
    ketua_rt: 'Bapak Koswara',
    kontak: '081399887766',
    saldo_kas: 118000,
    total_sampah_terkumpul_kg: 39.0,
    created_at: '2026-01-12T09:15:00Z'
  },
  {
    id: 3,
    kode_rt: 'RT-01-CIGANDA',
    nama_rt: 'RT 01 / RW 02',
    dusun: 'Dusun Ciganda',
    rw: '02',
    rt: '01',
    ketua_rt: 'Kang Asep Wahyudin',
    kontak: '085712349988',
    saldo_kas: 195000,
    total_sampah_terkumpul_kg: 64.2,
    created_at: '2026-01-15T10:00:00Z'
  },
  {
    id: 4,
    kode_rt: 'RT-02-CIGANDA',
    nama_rt: 'RT 02 / RW 02',
    dusun: 'Dusun Ciganda',
    rw: '02',
    rt: '02',
    ketua_rt: 'Bapak Maman Suherman',
    kontak: '082144556677',
    saldo_kas: 85000,
    total_sampah_terkumpul_kg: 28.0,
    created_at: '2026-01-18T11:20:00Z'
  },
  {
    id: 5,
    kode_rt: 'RT-01-CIMUDA',
    nama_rt: 'RT 01 / RW 03',
    dusun: 'Dusun Cimuda',
    rw: '03',
    rt: '01',
    ketua_rt: 'Pak Dedi Supriadi',
    kontak: '087890123456',
    saldo_kas: 160000,
    total_sampah_terkumpul_kg: 52.5,
    created_at: '2026-01-20T14:10:00Z'
  },
  {
    id: 6,
    kode_rt: 'RT-02-CIMUDA',
    nama_rt: 'RT 02 / RW 03',
    dusun: 'Dusun Cimuda',
    rw: '03',
    rt: '02',
    ketua_rt: 'Bapak Nana Sukarna',
    kontak: '085611223344',
    saldo_kas: 92000,
    total_sampah_terkumpul_kg: 31.0,
    created_at: '2026-01-25T13:45:00Z'
  }
];

export const INITIAL_TRANSAKSI = [
  {
    id: 1,
    kode_transaksi: 'PJL-20260210-8821',
    rt_id: 1,
    rt_nama: 'RT 01 / RW 01 (Dusun Cimenang)',
    rt_kode: 'RT-01-CIMENANG',
    jenis: 'penjualan',
    total_berat_kg: 25.0,
    total_nominal: 75000,
    keterangan: 'Penjualan berkala sampah botol plastik & kardus dari wadah pilah aktif',
    created_at: '2026-02-10T09:00:00Z',
    items: [
      { kategori_id: 1, nama_kategori: 'Botol Plastik (PET Bening / Bersih)', berat_kg: 10.0, harga_per_kg: 3500, subtotal: 35000 },
      { kategori_id: 3, nama_kategori: 'Kardus & Kertas (Karton / Buku / Koran)', berat_kg: 15.0, harga_per_kg: 2500, subtotal: 40000 }
    ]
  },
  {
    id: 2,
    kode_transaksi: 'PJL-20260215-4412',
    rt_id: 3,
    rt_nama: 'RT 01 / RW 02 (Dusun Ciganda)',
    rt_kode: 'RT-01-CIGANDA',
    jenis: 'penjualan',
    total_berat_kg: 34.0,
    total_nominal: 110000,
    keterangan: 'Hasil penjualan kaleng besi dan botol plastik wadah pilah aktif',
    created_at: '2026-02-15T10:30:00Z',
    items: [
      { kategori_id: 4, nama_kategori: 'Besi & Kaca (Kaleng, Seng, Beling Botol)', berat_kg: 20.0, harga_per_kg: 3000, subtotal: 60000 },
      { kategori_id: 1, nama_kategori: 'Botol Plastik (PET Bening / Bersih)', berat_kg: 10.0, harga_per_kg: 3500, subtotal: 35000 },
      { kategori_id: 2, nama_kategori: 'Plastik (Kresek, Gelas PP & Campur)', berat_kg: 4.0, harga_per_kg: 2200, subtotal: 15000 }
    ]
  },
  {
    id: 3,
    kode_transaksi: 'SLR-20260220-7731',
    rt_id: 1,
    rt_nama: 'RT 01 / RW 01 (Dusun Cimenang)',
    rt_kode: 'RT-01-CIMENANG',
    jenis: 'penyaluran',
    total_berat_kg: 0,
    total_nominal: 30000,
    keterangan: 'Penyaluran dana kas tabungan sampah untuk pengadaan tempat sampah jalan RT 01',
    created_at: '2026-02-20T16:00:00Z',
    items: []
  },
  {
    id: 4,
    kode_transaksi: 'PJL-20260225-1904',
    rt_id: 5,
    rt_nama: 'RT 01 / RW 03 (Dusun Cimuda)',
    rt_kode: 'RT-01-CIMUDA',
    jenis: 'penjualan',
    total_berat_kg: 28.5,
    total_nominal: 87500,
    keterangan: 'Penjualan botol kaca dan kertas kardus terkumpul di wadah pilah aktif',
    created_at: '2026-02-25T14:20:00Z',
    items: [
      { kategori_id: 3, nama_kategori: 'Kardus & Kertas (Karton / Buku / Koran)', berat_kg: 15.0, harga_per_kg: 2500, subtotal: 37500 },
      { kategori_id: 4, nama_kategori: 'Besi & Kaca (Kaleng, Seng, Beling Botol)', berat_kg: 13.5, harga_per_kg: 3000, subtotal: 50000 }
    ]
  }
];
