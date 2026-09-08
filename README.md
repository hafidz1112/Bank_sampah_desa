# SI-BSDes Mekarjaya 🌿
### Sistem Informasi Bank Sampah Aktif Desa Terintegrasi
**Penerapan: Pemilahan 4 Wadah Bank Sampah Aktif & Pengelolaan Hasil Penjualan Menjadi Tabungan Kas RT**  
**Program Kerja Individu KKM Informatika UMC 2026**  
**Lokasi Implementasi:** Desa Mekarjaya, Kec. Ciawigebang, Kab. Kuningan (Dusun Cimenang, Dusun Ciganda, Dusun Cimuda)

---

## 📌 Ringkasan Program Kerja
**SI-BSDes Mekarjaya** adalah platform web modern, responsif, dan *production-ready* yang dirancang untuk mendukung operasional program **Bank Sampah Aktif Desa Mekarjaya**. 

Sistem ini mengadopsi model **titik pemilahan terpusat berbasis 4 Wadah Tematik**:
1. 🧴 **Botol Plastik** (PET Bening / Bersih)
2. 🥤 **Plastik** (Gelas Plastik PP, Kresek & Lembaran)
3. 📦 **Kardus & Kertas** (Box Karton, HVS, Koran, Buku Tulis)
4. 🥫 **Besi & Kaca** (Kaleng Soda/Susu, Seng, Potongan Besi, Botol Kaca/Beling)

Warga dapat langsung membuang sampah terpilah ke dalam 4 wadah tanpa hambatan birokrasi pendaftaran perorangan. Sampah yang terkumpul ditimbang dan dijual secara berkala ke pengepul. Seluruh hasil penjualan dicatat transparan ke dalam sistem dan dialokasikan menjadi **Tabungan / Kas Warga per RT** (Dusun Cimenang, Dusun Ciganda, Dusun Cimuda) untuk mendanai kegiatan sosial, kebersihan, dan pembangunan lingkungan RT.

---

## 🚀 Tech Stack & Arsitektur
- **Frontend Framework:** React 18 (Vite SPA) + Tailwind CSS + Lucide React Icons
- **State Management & Data Engine:** React Context API + **Dual-Engine Architecture**:
  - **Supabase Cloud Engine:** PostgreSQL Database, Row Level Security (RLS), Automated Triggers.
  - **Local Storage Engine:** Otomatis aktif sebagai *graceful fallback* bila jaringan offline atau database cloud sedang dalam proses inisialisasi, sehingga sistem tidak pernah *freeze* atau *crash*.
- **Ekspor Dokumen & Laporan:** jsPDF & jsPDF-AutoTable (Struk Digital Termal 80mm, Rekap PDF Kas RT, Buku Transaksi PDF, dan Rekap CSV).
- **Gamifikasi Edukasi:** Game Interaktif Pilah Sampah 4 Wadah dengan drag & drop dan drag-touch friendly.
- **Deployment Target:** Vercel / Netlify (Pure Client-side SPA, zero custom server required).

---

## 👥 Hak Akses & Fitur Utama

### 1. Admin / Operator (Pengurus Bank Sampah Aktif & Karang Taruna)
- **Autentikasi Aman:** Login via Supabase Auth atau 1-Click Kredensial Demo.
- **Dashboard Overview:** KPI Real-time (Total Kas Terkumpul, Total Sampah Terpilah Terjual, Total Penyaluran Dana, Partisipasi per RT & Dusun).
- **Form Penjualan Sampah (Live Scale):** Input timbangan hasil pengumpulan dari 4 wadah ke pengepul, multi-kategori dinamis, auto kalkulasi subtotal dan total rupiah, cetak struk termal seketika, serta auto-sync penambahan saldo kas RT terpilih.
- **Form Penyaluran Dana Kas RT:** Penarikan saldo kas RT untuk kegiatan sosial dengan proteksi validasi batas saldo aktif.
- **Manajemen Kas & Rekening RT:** Kelola data RT (Kode RT `RT-XX-DUSUN`, Nama RT, Dusun, Ketua RT, No Telepon/WhatsApp, Saldo Kas) + Cetak Kartu Tabungan RT Digital.
- **Manajemen Katalog & Tarif Sampah:** Penyesuaian harga jual per kg mengikuti fluktuasi harga pasar/pengepul serta toggle status aktif.
- **Buku Riwayat Transaksi & Struk:** Filter pencarian berdasarkan kode transaksi, RT, atau jenis mutasi (Penjualan / Penyaluran) serta cetak ulang struk digital.
- **Laporan & Ekspor:** Unduh Laporan Rekap Saldo Kas RT (PDF/CSV) dan Rekap Mutasi Transaksi (PDF/CSV) untuk arsip Kepala Desa & Dosen Pembimbing Lapangan KKM UMC.

### 2. Portal Publik & Warga (Masyarakat Desa Mekarjaya)
- **Cek Saldo Kas RT Terbuka:** Warga dapat memilih RT atau Dusun (Cimenang, Ciganda, Cimuda) atau memasukkan Kode RT untuk memantau tabungan kas mereka secara transparan.
- **Panduan 4 Wadah Tematik:** Edukasi detail jenis sampah yang diterima pada masing-masing dari 4 wadah Bank Sampah Aktif beserta tips pemilahannya.
- **Katalog Tarif Terbuka & Kalkulator Simulasi:** Transparansi harga beli pengepul dan kalkulator simulasi estimasi pendapatan rupiah dari timbangan sampah.
- **Game Pilah Sampah Interaktif:** Mini game edukasi seru untuk melatih anak-anak dan warga memilah sampah ke wadah yang tepat.

---

## 🗄️ Struktur Database Supabase (PostgreSQL)

Skrip SQL lengkap tersedia di file [`supabase/schema.sql`](./supabase/schema.sql) dan dapat disalin langsung dari menu **"Skrip SQL Supabase"** di dalam Dashboard Admin.

```sql
-- 1. ENUMS
CREATE TYPE waste_category_type AS ENUM ('botol_plastik', 'plastik', 'kardus_kertas', 'besi_kaca');
CREATE TYPE tx_flow_type AS ENUM ('penjualan', 'penyaluran');

-- 2. TABEL TABUNGAN / KAS RT
CREATE TABLE tabungan_rt (
    id BIGSERIAL PRIMARY KEY,
    kode_rt VARCHAR(20) UNIQUE NOT NULL,      -- Contoh: RT-01-CIMENANG
    nama_rt VARCHAR(100) NOT NULL,            -- Contoh: RT 01 / RW 01
    dusun VARCHAR(50) NOT NULL,               -- Dusun Cimenang / Dusun Ciganda / Dusun Cimuda
    rw VARCHAR(5) NOT NULL,                   -- 01 / 02 / 03
    rt VARCHAR(5) NOT NULL,                   -- 01 / 02 / 03
    ketua_rt VARCHAR(100) NOT NULL,           -- Nama Ketua RT / Penanggung Jawab
    kontak VARCHAR(20),                       -- No WhatsApp / Telepon
    saldo_kas NUMERIC(12, 2) DEFAULT 0 CHECK (saldo_kas >= 0),
    total_sampah_terkumpul_kg NUMERIC(10, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL KATALOG 4 WADAH SAMPAH TERPILAH
CREATE TABLE kategori_sampah (
    id BIGSERIAL PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL,
    tipe waste_category_type NOT NULL,
    harga_per_kg NUMERIC(10, 2) NOT NULL CHECK (harga_per_kg >= 0),
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL TRANSAKSI (PENJUALAN KE PENGEPUL & PENYALURAN KAS)
CREATE TABLE transaksi (
    id BIGSERIAL PRIMARY KEY,
    kode_transaksi VARCHAR(30) UNIQUE NOT NULL,
    rt_id BIGINT REFERENCES tabungan_rt(id) ON DELETE RESTRICT,
    jenis tx_flow_type NOT NULL,
    total_berat_kg NUMERIC(8, 2) DEFAULT 0,
    total_nominal NUMERIC(12, 2) NOT NULL CHECK (total_nominal > 0),
    keterangan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL DETAIL PENJUALAN DARI 4 WADAH AKTIF
CREATE TABLE detail_setoran (
    id BIGSERIAL PRIMARY KEY,
    transaksi_id BIGINT REFERENCES transaksi(id) ON DELETE CASCADE,
    kategori_id BIGINT REFERENCES kategori_sampah(id) ON DELETE RESTRICT,
    berat_kg NUMERIC(8, 2) NOT NULL CHECK (berat_kg > 0),
    harga_per_kg NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL
);

-- 6. TRIGGER OTOMATIS PEMBARUAN SALDO KAS RT & AKUMULASI SAMPAH
CREATE OR REPLACE FUNCTION tr_update_saldo_rt()
RETURNS TRIGGER 
SECURITY DEFINER
AS $$ 
BEGIN     
    IF NEW.jenis = 'penjualan' THEN         
        UPDATE tabungan_rt 
        SET saldo_kas = saldo_kas + NEW.total_nominal,
            total_sampah_terkumpul_kg = total_sampah_terkumpul_kg + COALESCE(NEW.total_berat_kg, 0)
        WHERE id = NEW.rt_id;     
    ELSIF NEW.jenis = 'penyaluran' THEN         
        IF (SELECT saldo_kas FROM tabungan_rt WHERE id = NEW.rt_id) < NEW.total_nominal THEN             
            RAISE EXCEPTION 'Saldo kas RT tidak mencukupi untuk melakukan penyaluran dana';         
        END IF;         
        UPDATE tabungan_rt 
        SET saldo_kas = saldo_kas - NEW.total_nominal 
        WHERE id = NEW.rt_id;     
    END IF;     
    RETURN NEW; 
END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_sync_saldo_rt
AFTER INSERT ON transaksi
FOR EACH ROW EXECUTE FUNCTION tr_update_saldo_rt();
```

---

## ⚡ Cara Menjalankan Aplikasi Secara Lokal

1. **Clone repository atau buka direktori proyek:**
   ```bash
   cd "proker individu"
   ```

2. **Install Dependensi:**
   ```bash
   npm install
   ```

3. **(Opsional) Konfigurasi Environment Variables Supabase:**
   Salin `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Isi dengan URL dan Kunci Anonim proyek Supabase Anda:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
   *Jika tabel belum dibuat di Supabase, buka Supabase SQL Editor dan jalankan skrip dari `supabase/schema.sql`.*

4. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```
   Aplikasi akan otomatis berjalan pada: `http://localhost:3000` (atau port yang tertera pada terminal).

5. **Build untuk Production:**
   ```bash
   npm run build
   ```

---

## 🧪 Akun & Data Uji Coba Demo (Out of the Box)

- **Login Admin/Operator:**
  - Email: `admin@mekarjaya.desa.id`
  - Password: `admin123`
  - *(Tersedia tombol 1-Click Isi Otomatis di modal login).*
- **Contoh Kode RT untuk Cek Saldo Publik:**
  - `RT-01-CIMENANG` (RT 01 / RW 01 - Dusun Cimenang - Ketua: Bpk. Suryana)
  - `RT-02-CIMENANG` (RT 02 / RW 01 - Dusun Cimenang - Ketua: Bpk. Casmita)
  - `RT-01-CIGANDA` (RT 01 / RW 02 - Dusun Ciganda - Ketua: Ibu Siti Aminah)
  - `RT-02-CIGANDA` (RT 02 / RW 02 - Dusun Ciganda - Ketua: Bpk. Sutrisno)
  - `RT-01-CIMUDA` (RT 01 / RW 03 - Dusun Cimuda - Ketua: Bpk. Dedi Supriadi)
  - `RT-02-CIMUDA` (RT 02 / RW 03 - Dusun Cimuda - Ketua: Bpk. Yayat Sudrajat)

---

## ☁️ Panduan Deploy ke Vercel
1. Push kode ke repository GitHub Anda (`main` branch).
2. Buka dashboard [Vercel](https://vercel.com) dan pilih **Add New Project**.
3. Hubungkan repository GitHub.
4. Pada bagian **Environment Variables**, tambahkan:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Klik **Deploy**. Selesai!

---

Dibuat dengan dedikasi untuk kemajuan **Desa Mekarjaya, Kec. Ciawigebang, Kab. Kuningan**  
© 2026 KKM Tematik Teknik Informatika Universitas Muhammadiyah Cirebon (UMC).
