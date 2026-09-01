# SI-BSDes Mekarjaya 🌿
### Sistem Informasi Bank Sampah Desa Terintegrasi & Sirkular Maggot BSF
**Program Kerja Individu KKM Informatika UMC 2026**  
**Lokasi Implementasi:** Desa Mekarjaya, Kec. Ciawigebang, Kab. Kuningan (Dusun Cimenang, Dusun Ciganda, Dusun Cimuda)

---

## 📌 Ringkasan Program Kerja
**SI-BSDes Mekarjaya** adalah platform web terpadu, responsive, dan production-ready yang mengintegrasikan tata kelola tabungan sampah anorganik warga berbasis saldo rupiah dengan rantai ekonomi sirkular sampah organik ke unit **Biopond Maggot BSF (*Hermetia illucens*)** guna menyediakan pakan alami berprotein tinggi (~40%) untuk unit bebek petelur BUMDes Mekarjaya serta menghasilkan pupuk organik padat (kasgot) untuk pertanian desa.

---

## 🚀 Tech Stack & Arsitektur
- **Frontend Framework:** React (Vite SPA) + Tailwind CSS + Lucide React Icons
- **State Management & Data Engine:** React Hooks & Context API + Dual-Engine (Supabase PostgreSQL Client SDK `@supabase/supabase-js` & Local Storage Engine)
- **Backend & Database:** Supabase (PostgreSQL, Supabase Auth, Row Level Security, Automated Stored Procedure Triggers)
- **Ekspor Dokumen:** jsPDF & jsPDF-AutoTable (Struk Termal Digital, Rekap PDF & CSV)
- **Deployment Target:** Vercel (Pure Client-side, Serverless, Zero Custom Backend)

---

## 👥 Hak Akses & Fitur Utama

### 1. Admin / Operator (Karang Taruna & Pengurus Bank Sampah)
- **Autentikasi Aman:** Login via Supabase Auth (atau 1-Click Kredensial Demo).
- **Dashboard Eksekutif:** KPI Real-time (Total Sampah Terkelola, Saldo Aktif, Partisipasi per Dusun Cimenang, Ciganda, Cimuda).
- **CRUD Data Nasabah:** Kelola warga (Nama, NIK 16 digit, No Rekening otomatis `BSDES-MJ-XXX`, RT, RW, Dusun) + Cetak Kartu Anggota Digital.
- **Katalog & Tarif Sampah:** Manajemen harga per kg (Organik & Anorganik) serta toggle status aktif.
- **Form Penimbangan Setoran (Live Scale):** Input multi-kategori sampah, auto kalkulasi subtotal dan total rupiah, penambahan saldo otomatis, serta trigger otomatis pencatatan maggot jika terdapat sampah organik.
- **Form Penarikan Saldo:** Validasi batas kecukupan saldo aktif nasabah secara realtime.
- **Log Sirkular Maggot BSF:** Pencatatan pasokan sampah organik harian ke Biopond Maggot (Unit 1-4), estimasi panen maggot (~20%), dan target alokasi pakan bebek petelur BUMDes.
- **Cetak Nota & Ekspor Laporan:** Cetak struk termal digital langsung ke printer atau unduh PDF / CSV untuk arsip Kepala Desa & Dosen Pembimbing KKM UMC.

### 2. Portal Publik & Warga (Nasabah)
- **Cek Saldo Cepat Tanpa Registrasi Rumit:** Cukup masukkan 16 Digit NIK atau Nomor Rekening.
- **Buku Tabungan Digital:** Menampilkan saldo aktif, rincian timbangan per transaksi, mutasi keluar/masuk, dan cetak PDF rekening koran.
- **Katalog Harga Terbuka:** Daftar harga acuan transparan dan kalkulator simulasi estimasi pendapatan sampah warga.
- **Diagram Edukasi Alur Sirkular:** Visualisasi 5 tahap pemilahan organik -> Biopond Maggot -> Pakan Bebek BUMDes -> Pupuk Kasgot.

---

## 🗄️ Struktur Database Supabase (PostgreSQL)

Skrip SQL lengkap tersedia di file [`supabase/schema.sql`](./supabase/schema.sql) dan dapat diakses langsung dari menu **"Skrip SQL Supabase"** di aplikasi.

```sql
CREATE TYPE waste_type AS ENUM ('organik', 'anorganik');
CREATE TYPE tx_type AS ENUM ('setor', 'tarik');

CREATE TABLE nasabah (
    id BIGSERIAL PRIMARY KEY,
    no_rekening VARCHAR(20) UNIQUE NOT NULL,
    nik VARCHAR(16) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    dusun VARCHAR(50) NOT NULL,
    rw VARCHAR(5) NOT NULL,
    rt VARCHAR(5) NOT NULL,
    no_hp VARCHAR(20),
    saldo_aktif NUMERIC(12, 2) DEFAULT 0 CHECK (saldo_aktif >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE kategori_sampah (
    id BIGSERIAL PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL,
    tipe waste_type NOT NULL,
    harga_per_kg NUMERIC(10, 2) NOT NULL CHECK (harga_per_kg >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transaksi (
    id BIGSERIAL PRIMARY KEY,
    kode_transaksi VARCHAR(30) UNIQUE NOT NULL,
    nasabah_id BIGINT REFERENCES nasabah(id) ON DELETE RESTRICT,
    jenis tx_type NOT NULL,
    total_berat_kg NUMERIC(8, 2) DEFAULT 0,
    total_nominal NUMERIC(12, 2) NOT NULL CHECK (total_nominal > 0),
    keterangan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE detail_setoran (
    id BIGSERIAL PRIMARY KEY,
    transaksi_id BIGINT REFERENCES transaksi(id) ON DELETE CASCADE,
    kategori_id BIGINT REFERENCES kategori_sampah(id) ON DELETE RESTRICT,
    berat_kg NUMERIC(8, 2) NOT NULL CHECK (berat_kg > 0),
    harga_per_kg NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL
);

CREATE TABLE log_aliran_organik (
    id BIGSERIAL PRIMARY KEY,
    tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    volume_sampah_organik_kg NUMERIC(8, 2) NOT NULL,
    tujuan_biopond VARCHAR(50) DEFAULT 'Biopond Maggot Unit 1',
    est_maggot_panen_kg NUMERIC(8, 2) DEFAULT 0,
    target_alokasi VARCHAR(100) DEFAULT 'Pakan Bebek Petelur BUMDes',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger Otomatis Pembaruan Saldo Nasabah
CREATE OR REPLACE FUNCTION tr_update_saldo()
RETURNS TRIGGER AS $$ 
BEGIN     
    IF NEW.jenis = 'setor' THEN         
        UPDATE nasabah SET saldo_aktif = saldo_aktif + NEW.total_nominal WHERE id = NEW.nasabah_id;     
    ELSIF NEW.jenis = 'tarik' THEN         
        IF (SELECT saldo_aktif FROM nasabah WHERE id = NEW.nasabah_id) < NEW.total_nominal THEN             
            RAISE EXCEPTION 'Saldo tidak mencukupi';         
        END IF;         
        UPDATE nasabah SET saldo_aktif = saldo_aktif - NEW.total_nominal WHERE id = NEW.nasabah_id;     
    END IF;     
    RETURN NEW; 
END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_sync_saldo_nasabah
AFTER INSERT ON transaksi
FOR EACH ROW EXECUTE FUNCTION tr_update_saldo();
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
   Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` sesuai project Supabase Anda.  
   *(Catatan: Aplikasi juga memiliki fitur konfigurasi UI langsung di navbar atau dapat berjalan offline dalam Mode Demo Lokal).*

4. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```
   Aplikasi akan terbuka di browser pada: `http://localhost:3000`

5. **Build untuk Production:**
   ```bash
   npm run build
   ```

---

## ☁️ Panduan Deploy ke Vercel (1-Click)
1. Push kode ke repository GitHub Anda.
2. Buka dashboard [Vercel](https://vercel.com) dan pilih **Add New Project**.
3. Import repository SI-BSDes Mekarjaya.
4. Pada bagian **Environment Variables**, tambahkan:
   - `VITE_SUPABASE_URL` : URL Supabase Anda
   - `VITE_SUPABASE_ANON_KEY` : Anon Public Key Supabase Anda
5. Klik **Deploy**. Selesai!

---

## 🧪 Akun & Data Uji Coba Demo (Out of the Box)
- **Login Pengurus:**  
  Email: `admin@mekarjaya.desa.id`  
  Password: `admin123`  
  *(Tersedia tombol 1-Click Isi Otomatis di modal login).*
- **Contoh NIK Warga untuk Cek Saldo:**  
  - `3208051204850001` (Bapak Suryana - Dusun Cimenang)
  - `3208055508920002` (Ibu Siti Aminah - Dusun Ciganda)
  - `3208052101780003` (Pak Dedi Supriadi - Dusun Cimuda)
  - `3208056211900004` (Ibu Neng Maryati - Dusun Cimenang)
- **Contoh No. Rekening:** `BSDES-MJ-001` s/d `BSDES-MJ-006`

---

Dibuat dengan dedikasi untuk kemajuan **Desa Mekarjaya, Kec. Ciawigebang, Kab. Kuningan**  
© 2026 KKM Teknik Informatika Universitas Muhammadiyah Cirebon (UMC).
