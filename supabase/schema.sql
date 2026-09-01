-- ==============================================================================
-- SISTEM INFORMASI BANK SAMPAH DESA TERINTEGRASI (SI-BSDes) MEKARJAYA
-- Lokasi: Desa Mekarjaya, Kec. Ciawigebang, Kab. Kuningan
-- Dusun: Cimenang, Ciganda, Cimuda
-- Program Kerja Individu KKM Informatika UMC 2026
-- ==============================================================================

-- 1. ENUMS
CREATE TYPE waste_type AS ENUM ('organik', 'anorganik');
CREATE TYPE tx_type AS ENUM ('setor', 'tarik');

-- 2. TABEL NASABAH
CREATE TABLE nasabah (
    id BIGSERIAL PRIMARY KEY,
    no_rekening VARCHAR(20) UNIQUE NOT NULL,
    nik VARCHAR(16) UNIQUE NOT NULL,
    nama VARCHAR(100) NOT NULL,
    dusun VARCHAR(50) NOT NULL, -- Cimenang / Ciganda / Cimuda
    rw VARCHAR(5) NOT NULL,
    rt VARCHAR(5) NOT NULL,
    no_hp VARCHAR(20),
    saldo_aktif NUMERIC(12, 2) DEFAULT 0 CHECK (saldo_aktif >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL KATALOG KATEGORI SAMPAH
CREATE TABLE kategori_sampah (
    id BIGSERIAL PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL,
    tipe waste_type NOT NULL,
    harga_per_kg NUMERIC(10, 2) NOT NULL CHECK (harga_per_kg >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL TRANSAKSI (SETOR / TARIK)
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

-- 5. TABEL DETAIL SETORAN SAMPAH
CREATE TABLE detail_setoran (
    id BIGSERIAL PRIMARY KEY,
    transaksi_id BIGINT REFERENCES transaksi(id) ON DELETE CASCADE,
    kategori_id BIGINT REFERENCES kategori_sampah(id) ON DELETE RESTRICT,
    berat_kg NUMERIC(8, 2) NOT NULL CHECK (berat_kg > 0),
    harga_per_kg NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL
);

-- 6. TABEL LOG ALIRAN SAMPAH ORGANIK KE BIOPOND MAGGOT BSF
CREATE TABLE log_aliran_organik (
    id BIGSERIAL PRIMARY KEY,
    tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
    volume_sampah_organik_kg NUMERIC(8, 2) NOT NULL,
    tujuan_biopond VARCHAR(50) DEFAULT 'Biopond Maggot Unit 1',
    est_maggot_panen_kg NUMERIC(8, 2) DEFAULT 0,
    target_alokasi VARCHAR(100) DEFAULT 'Pakan Bebek Petelur BUMDes',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TRIGGER OTOMATIS PEMBARUAN SALDO NASABAH
CREATE OR REPLACE FUNCTION tr_update_saldo()
RETURNS TRIGGER AS $$ 
BEGIN     
    IF NEW.jenis = 'setor' THEN         
        UPDATE nasabah SET saldo_aktif = saldo_aktif + NEW.total_nominal WHERE id = NEW.nasabah_id;     
    ELSIF NEW.jenis = 'tarik' THEN         
        IF (SELECT saldo_aktif FROM nasabah WHERE id = NEW.nasabah_id) < NEW.total_nominal THEN             
            RAISE EXCEPTION 'Saldo tidak mencukupi untuk melakukan penarikan';         
        END IF;         
        UPDATE nasabah SET saldo_aktif = saldo_aktif - NEW.total_nominal WHERE id = NEW.nasabah_id;     
    END IF;     
    RETURN NEW; 
END; 
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_sync_saldo_nasabah
AFTER INSERT ON transaksi
FOR EACH ROW EXECUTE FUNCTION tr_update_saldo();

-- 8. INDEXES UNTUK PERFORMA QUERY CEPAT
CREATE INDEX idx_nasabah_nik ON nasabah(nik);
CREATE INDEX idx_nasabah_no_rekening ON nasabah(no_rekening);
CREATE INDEX idx_nasabah_dusun ON nasabah(dusun);
CREATE INDEX idx_transaksi_nasabah_id ON transaksi(nasabah_id);
CREATE INDEX idx_transaksi_created_at ON transaksi(created_at);
CREATE INDEX idx_detail_setoran_tx ON detail_setoran(transaksi_id);
CREATE INDEX idx_log_organik_tanggal ON log_aliran_organik(tanggal);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE nasabah ENABLE ROW LEVEL SECURITY;
ALTER TABLE kategori_sampah ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaksi ENABLE ROW LEVEL SECURITY;
ALTER TABLE detail_setoran ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_aliran_organik ENABLE ROW LEVEL SECURITY;

-- Kebijakan Akses:
-- Kategori Sampah dapat dibaca publik (untuk landing page & nasabah)
CREATE POLICY "Public Read Kategori Sampah" ON kategori_sampah FOR SELECT USING (true);
CREATE POLICY "Admin All Kategori Sampah" ON kategori_sampah FOR ALL TO authenticated USING (true);

-- Nasabah: Publik dapat membaca data nasabah untuk cek saldo berdasarkan NIK/No Rek
CREATE POLICY "Public Read Nasabah" ON nasabah FOR SELECT USING (true);
CREATE POLICY "Admin All Nasabah" ON nasabah FOR ALL TO authenticated USING (true);

-- Transaksi & Detail: Publik dapat membaca riwayat transaksi
CREATE POLICY "Public Read Transaksi" ON transaksi FOR SELECT USING (true);
CREATE POLICY "Admin All Transaksi" ON transaksi FOR ALL TO authenticated USING (true);

CREATE POLICY "Public Read Detail Setoran" ON detail_setoran FOR SELECT USING (true);
CREATE POLICY "Admin All Detail Setoran" ON detail_setoran FOR ALL TO authenticated USING (true);

-- Log Aliran Organik: Publik dapat melihat edukasi maggot & Admin mengelola
CREATE POLICY "Public Read Log Organik" ON log_aliran_organik FOR SELECT USING (true);
CREATE POLICY "Admin All Log Organik" ON log_aliran_organik FOR ALL TO authenticated USING (true);

-- ==============================================================================
-- 10. SEED DATA AWAL (KATALOG SAMPAH & NASABAH DESA MEKARJAYA)
-- ==============================================================================

-- Kategori Sampah Anorganik & Organik
INSERT INTO kategori_sampah (nama_kategori, tipe, harga_per_kg, is_active) VALUES
('Kardus Bekas / Box Karton', 'anorganik', 2500, true),
('Botol Plastik PET Bening', 'anorganik', 3500, true),
('Gelas Plastik Bersih (PP/Aqua)', 'anorganik', 4000, true),
('Plastik Campur / Kresek Bersih', 'anorganik', 1200, true),
('Kaleng / Seng Logam', 'anorganik', 2000, true),
('Besi Tua / Scrap Besi', 'anorganik', 4500, true),
('Kertas HVS / Buku Tulis', 'anorganik', 2200, true),
('Koran Bekas', 'anorganik', 1800, true),
('Minyak Jelantah (UCO)', 'anorganik', 6500, true),
('Sampah Organik Dapur (Sisa Sayur & Nasi)', 'organik', 800, true),
('Sisa Buah & Sayuran Pasar Desa', 'organik', 600, true),
('Ampas Tahu & Kelapa', 'organik', 1000, true);

-- Data Nasabah Warga Desa Mekarjaya
INSERT INTO nasabah (no_rekening, nik, nama, dusun, rw, rt, no_hp, saldo_aktif) VALUES
('BSDES-MJ-001', '3208051204850001', 'Bapak Suryana', 'Cimenang', '01', '02', '081234567890', 47500.00),
('BSDES-MJ-002', '3208055508920002', 'Ibu Siti Aminah', 'Ciganda', '02', '01', '085712349988', 82000.00),
('BSDES-MJ-003', '3208052101780003', 'Pak Dedi Supriadi', 'Cimuda', '03', '03', '087890123456', 25000.00),
('BSDES-MJ-004', '3208056211900004', 'Ibu Neng Maryati', 'Cimenang', '01', '01', '081399887766', 115000.00),
('BSDES-MJ-005', '3208051506880005', 'Kang Asep Wahyudin', 'Ciganda', '02', '02', '082144556677', 63000.00),
('BSDES-MJ-006', '3208054803950006', 'Teh Rina Karlina', 'Cimuda', '03', '01', '085611223344', 38500.00);

-- Log Aliran Organik Awal ke Biopond Maggot BSF
INSERT INTO log_aliran_organik (tanggal, volume_sampah_organik_kg, tujuan_biopond, est_maggot_panen_kg, target_alokasi) VALUES
(CURRENT_DATE - INTERVAL '6 days', 35.5, 'Biopond Maggot Unit 1 (Kandang Utama)', 7.1, 'Pakan Bebek Petelur BUMDes Mekarjaya'),
(CURRENT_DATE - INTERVAL '4 days', 42.0, 'Biopond Maggot Unit 2 (Dusun Ciganda)', 8.4, 'Pakan Bebek Petelur BUMDes Mekarjaya'),
(CURRENT_DATE - INTERVAL '2 days', 50.0, 'Biopond Maggot Unit 1 (Kandang Utama)', 10.0, 'Pakan Bebek Petelur BUMDes Mekarjaya'),
(CURRENT_DATE, 38.0, 'Biopond Maggot Unit 3 (Dusun Cimenang)', 7.6, 'Pakan Bebek Petelur BUMDes Mekarjaya');
