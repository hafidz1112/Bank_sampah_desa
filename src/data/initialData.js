/**
 * Initial Seed Data for SI-BSDes Mekarjaya
 * Desa Mekarjaya, Kec. Ciawigebang, Kab. Kuningan
 */

export const INITIAL_KATALOG = [
  {
    id: 1,
    nama_kategori: 'Kardus Bekas / Box Karton',
    tipe: 'anorganik',
    harga_per_kg: 2500,
    is_active: true,
    deskripsi: 'Kardus kering, bersih, dipipihkan tanpa staples berlebih'
  },
  {
    id: 2,
    nama_kategori: 'Botol Plastik PET Bening',
    tipe: 'anorganik',
    harga_per_kg: 3500,
    is_active: true,
    deskripsi: 'Botol air mineral bersih, tutup dan label dilepas'
  },
  {
    id: 3,
    nama_kategori: 'Gelas Plastik Bersih (PP)',
    tipe: 'anorganik',
    harga_per_kg: 4000,
    is_active: true,
    deskripsi: 'Gelas minuman kemasan bening / warna tanpa penutup lid'
  },
  {
    id: 4,
    nama_kategori: 'Plastik Campur / Kresek Bersih',
    tipe: 'anorganik',
    harga_per_kg: 1200,
    is_active: true,
    deskripsi: 'Kantong kresek kering dan plastik lembaran bersih'
  },
  {
    id: 5,
    nama_kategori: 'Kaleng / Seng Logam',
    tipe: 'anorganik',
    harga_per_kg: 2000,
    is_active: true,
    deskripsi: 'Kaleng susu, biskuit, dan seng bekas'
  },
  {
    id: 6,
    nama_kategori: 'Besi Tua / Logam Campur',
    tipe: 'anorganik',
    harga_per_kg: 4500,
    is_active: true,
    deskripsi: 'Besi plat, paku, kawat, dan konstruksi besi bekas'
  },
  {
    id: 7,
    nama_kategori: 'Kertas HVS / Buku Tulis',
    tipe: 'anorganik',
    harga_per_kg: 2200,
    is_active: true,
    deskripsi: 'Kertas putih print, buku tulis tanpa sampul plastik'
  },
  {
    id: 8,
    nama_kategori: 'Koran Bekas',
    tipe: 'anorganik',
    harga_per_kg: 1800,
    is_active: true,
    deskripsi: 'Koran kering rapi terikat'
  },
  {
    id: 9,
    nama_kategori: 'Minyak Jelantah (UCO)',
    tipe: 'anorganik',
    harga_per_kg: 6500,
    is_active: true,
    deskripsi: 'Minyak goreng bekas pakai, disaring dalam jeriken/botol'
  },
  {
    id: 10,
    nama_kategori: 'Sampah Organik Dapur (Sisa Sayur & Nasi)',
    tipe: 'organik',
    harga_per_kg: 800,
    is_active: true,
    deskripsi: 'Pakan biopond maggot BSF (bebas plastik, tulang besar, dan tusuk gigi)'
  },
  {
    id: 11,
    nama_kategori: 'Sisa Buah & Sayuran Pasar Desa',
    tipe: 'organik',
    harga_per_kg: 600,
    is_active: true,
    deskripsi: 'Sisa dagangan sayur dan buah busuk dari warung / pasar desa'
  },
  {
    id: 12,
    nama_kategori: 'Ampas Tahu & Kelapa',
    tipe: 'organik',
    harga_per_kg: 1000,
    is_active: true,
    deskripsi: 'Nutrisi tinggi untuk percepatan pembesaran larva maggot BSF'
  }
];

export const INITIAL_NASABAH = [
  {
    id: 1,
    no_rekening: 'BSDES-MJ-001',
    nik: '3208051204850001',
    nama: 'Bapak Suryana',
    dusun: 'Dusun Cimenang',
    rw: '01',
    rt: '02',
    no_hp: '081234567890',
    saldo_aktif: 47500,
    created_at: '2026-01-10T08:30:00Z'
  },
  {
    id: 2,
    no_rekening: 'BSDES-MJ-002',
    nik: '3208055508920002',
    nama: 'Ibu Siti Aminah',
    dusun: 'Dusun Ciganda',
    rw: '02',
    rt: '01',
    no_hp: '085712349988',
    saldo_aktif: 82000,
    created_at: '2026-01-12T09:15:00Z'
  },
  {
    id: 3,
    no_rekening: 'BSDES-MJ-003',
    nik: '3208052101780003',
    nama: 'Pak Dedi Supriadi',
    dusun: 'Dusun Cimuda',
    rw: '03',
    rt: '03',
    no_hp: '087890123456',
    saldo_aktif: 25000,
    created_at: '2026-01-15T10:00:00Z'
  },
  {
    id: 4,
    no_rekening: 'BSDES-MJ-004',
    nik: '3208056211900004',
    nama: 'Ibu Neng Maryati',
    dusun: 'Dusun Cimenang',
    rw: '01',
    rt: '01',
    no_hp: '081399887766',
    saldo_aktif: 115000,
    created_at: '2026-01-18T11:20:00Z'
  },
  {
    id: 5,
    no_rekening: 'BSDES-MJ-005',
    nik: '3208051506880005',
    nama: 'Kang Asep Wahyudin',
    dusun: 'Dusun Ciganda',
    rw: '02',
    rt: '02',
    no_hp: '082144556677',
    saldo_aktif: 63000,
    created_at: '2026-01-20T14:10:00Z'
  },
  {
    id: 6,
    no_rekening: 'BSDES-MJ-006',
    nik: '3208054803950006',
    nama: 'Teh Rina Karlina',
    dusun: 'Dusun Cimuda',
    rw: '03',
    rt: '01',
    no_hp: '085611223344',
    saldo_aktif: 38500,
    created_at: '2026-01-25T13:45:00Z'
  }
];

export const INITIAL_TRANSAKSI = [
  {
    id: 1,
    kode_transaksi: 'STR-20260210-8821',
    nasabah_id: 1,
    nasabah_nama: 'Bapak Suryana',
    nasabah_no_rekening: 'BSDES-MJ-001',
    jenis: 'setor',
    total_berat_kg: 12.5,
    total_nominal: 47500,
    keterangan: 'Setoran mingguan kardus dan botol plastik',
    created_at: '2026-02-10T09:00:00Z',
    items: [
      { kategori_id: 1, nama_kategori: 'Kardus Bekas / Box Karton', berat_kg: 9.0, harga_per_kg: 2500, subtotal: 22500 },
      { kategori_id: 2, nama_kategori: 'Botol Plastik PET Bening', berat_kg: 5.0, harga_per_kg: 3500, subtotal: 17500 },
      { kategori_id: 10, nama_kategori: 'Sampah Organik Dapur (Sisa Sayur & Nasi)', berat_kg: 9.37, harga_per_kg: 800, subtotal: 7500 }
    ]
  },
  {
    id: 2,
    kode_transaksi: 'STR-20260215-4412',
    nasabah_id: 2,
    nasabah_nama: 'Ibu Siti Aminah',
    nasabah_no_rekening: 'BSDES-MJ-002',
    jenis: 'setor',
    total_berat_kg: 22.0,
    total_nominal: 82000,
    keterangan: 'Setoran minyak jelantah & botol PET',
    created_at: '2026-02-15T10:30:00Z',
    items: [
      { kategori_id: 9, nama_kategori: 'Minyak Jelantah (UCO)', berat_kg: 8.0, harga_per_kg: 6500, subtotal: 52000 },
      { kategori_id: 2, nama_kategori: 'Botol Plastik PET Bening', berat_kg: 6.0, harga_per_kg: 3500, subtotal: 21000 },
      { kategori_id: 10, nama_kategori: 'Sampah Organik Dapur (Sisa Sayur & Nasi)', berat_kg: 11.25, harga_per_kg: 800, subtotal: 9000 }
    ]
  },
  {
    id: 3,
    kode_transaksi: 'STR-20260218-1904',
    nasabah_id: 4,
    nasabah_nama: 'Ibu Neng Maryati',
    nasabah_no_rekening: 'BSDES-MJ-004',
    jenis: 'setor',
    total_berat_kg: 31.0,
    total_nominal: 115000,
    keterangan: 'Hasil pilah sampah rumah tangga & toko kelontong',
    created_at: '2026-02-18T14:20:00Z',
    items: [
      { kategori_id: 1, nama_kategori: 'Kardus Bekas / Box Karton', berat_kg: 20.0, harga_per_kg: 2500, subtotal: 50000 },
      { kategori_id: 3, nama_kategori: 'Gelas Plastik Bersih (PP)', berat_kg: 10.0, harga_per_kg: 4000, subtotal: 40000 },
      { kategori_id: 6, nama_kategori: 'Besi Tua / Logam Campur', berat_kg: 5.55, harga_per_kg: 4500, subtotal: 25000 }
    ]
  },
  {
    id: 4,
    kode_transaksi: 'TRK-20260220-7731',
    nasabah_id: 3,
    nasabah_nama: 'Pak Dedi Supriadi',
    nasabah_no_rekening: 'BSDES-MJ-003',
    jenis: 'tarik',
    total_berat_kg: 0,
    total_nominal: 25000,
    keterangan: 'Penarikan saldo tabungan untuk keperluan rumah tangga',
    created_at: '2026-02-20T16:00:00Z',
    items: []
  }
];

export const INITIAL_LOG_ORGANIK = [
  {
    id: 1,
    tanggal: '2026-02-22',
    volume_sampah_organik_kg: 35.5,
    tujuan_biopond: 'Biopond Maggot Unit 1 (Kandang Utama)',
    est_maggot_panen_kg: 7.1,
    target_alokasi: 'Pakan Bebek Petelur BUMDes Mekarjaya',
    keterangan: 'Sisa sayur pasar dan ampas tahu warga'
  },
  {
    id: 2,
    tanggal: '2026-02-24',
    volume_sampah_organik_kg: 42.0,
    tujuan_biopond: 'Biopond Maggot Unit 2 (Dusun Ciganda)',
    est_maggot_panen_kg: 8.4,
    target_alokasi: 'Pakan Bebek Petelur BUMDes Mekarjaya',
    keterangan: 'Sampah organik dapur dusun Ciganda & Cimenang'
  },
  {
    id: 3,
    tanggal: '2026-02-26',
    volume_sampah_organik_kg: 50.0,
    tujuan_biopond: 'Biopond Maggot Unit 1 (Kandang Utama)',
    est_maggot_panen_kg: 10.0,
    target_alokasi: 'Pakan Bebek Petelur BUMDes Mekarjaya',
    keterangan: 'Limbah organik hajatan dan sisa dapur'
  },
  {
    id: 4,
    tanggal: '2026-02-28',
    volume_sampah_organik_kg: 38.0,
    tujuan_biopond: 'Biopond Maggot Unit 3 (Dusun Cimenang)',
    est_maggot_panen_kg: 7.6,
    target_alokasi: 'Pakan Bebek Petelur BUMDes Mekarjaya',
    keterangan: 'Pasokan organik harian siap urai'
  }
];
