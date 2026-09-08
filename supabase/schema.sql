-- ==============================================================================
-- SISTEM INFORMASI BANK SAMPAH DESA TERINTEGRASI (SI-BSDes) BANK SAMPAH AKTIF MEKARJAYA
-- Penerapan: Tempat Sampah Terpilah 4 Wadah di Bank Sampah Aktif Mekarjaya
-- Hasil Penjualan Sampah Dikelola sebagai Tabungan/Kas Warga per RT
-- Lokasi: Desa Mekarjaya, Kec. Ciawigebang, Kab. Kuningan
-- Dusun: Cimenang, Ciganda, Cimuda
-- Program Kerja Individu KKM Informatika UMC 2026
-- ==============================================================================

-- 1. ENUMS
CREATE TYPE waste_category_type AS ENUM ('botol_plastik', 'plastik', 'kardus_kertas', 'besi_kaca');
CREATE TYPE tx_flow_type AS ENUM ('penjualan', 'penyaluran');

-- 2. TABEL TABUNGAN / KAS RT DESA MEKARJAYA
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

-- 3. TABEL 4 KATALOG SAMPAH TERPILAH
CREATE TABLE kategori_sampah (
    id BIGSERIAL PRIMARY KEY,
    nama_kategori VARCHAR(100) NOT NULL,
    tipe waste_category_type NOT NULL,
    harga_per_kg NUMERIC(10, 2) NOT NULL CHECK (harga_per_kg >= 0),
    deskripsi TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL TRANSAKSI (PENJUALAN SAMPAH KE PENGEPUL & PENYALURAN KAS RT)
CREATE TABLE transaksi (
    id BIGSERIAL PRIMARY KEY,
    kode_transaksi VARCHAR(30) UNIQUE NOT NULL, -- PJL-YYYYMMDD-XXXX atau SLR-YYYYMMDD-XXXX
    rt_id BIGINT REFERENCES tabungan_rt(id) ON DELETE RESTRICT,
    jenis tx_flow_type NOT NULL,
    total_berat_kg NUMERIC(8, 2) DEFAULT 0,
    total_nominal NUMERIC(12, 2) NOT NULL CHECK (total_nominal > 0),
    keterangan TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL DETAIL PENJUALAN SAMPAH DARI 4 WADAH AKTIF
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

-- 7. INDEXES UNTUK PERFORMA QUERY CEPAT
CREATE INDEX idx_tabungan_rt_kode ON tabungan_rt(kode_rt);
CREATE INDEX idx_tabungan_rt_dusun ON tabungan_rt(dusun);
CREATE INDEX idx_transaksi_rt_id ON transaksi(rt_id);
CREATE INDEX idx_transaksi_created_at ON transaksi(created_at);
CREATE INDEX idx_detail_tx_id ON detail_setoran(transaksi_id);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE tabungan_rt ENABLE ROW LEVEL SECURITY;
ALTER TABLE kategori_sampah ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaksi ENABLE ROW LEVEL SECURITY;
ALTER TABLE detail_setoran ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow All Tabungan RT" ON tabungan_rt FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Kategori Sampah" ON kategori_sampah FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Transaksi" ON transaksi FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Detail Setoran" ON detail_setoran FOR ALL TO public USING (true) WITH CHECK (true);

-- ==============================================================================
-- 9. SEED DATA AWAL (4 KATEGORI SAMPAH & DATA RT DESA MEKARJAYA)
-- ==============================================================================

-- 4 Kategori Tempat Sampah Terpilah di Bank Sampah Aktif Mekarjaya
INSERT INTO kategori_sampah (nama_kategori, tipe, harga_per_kg, deskripsi, is_active) VALUES
('Botol Plastik (PET Bening / Bersih)', 'botol_plastik', 3500, 'Botol air mineral bersih, botol teh/jus bening, tutup botol dilepas', true),
('Plastik (Kresek, Gelas PP & Campur)', 'plastik', 2200, 'Gelas plastik minuman kemasan (PP), kantong kresek kering, kemasan plastik bersih', true),
('Kardus & Kertas (Karton / Buku / Koran)', 'kardus_kertas', 2500, 'Kardus box gelombang kering, kertas putih HVS, koran, buku tulis bekas', true),
('Besi & Kaca (Kaleng, Seng, Beling Botol)', 'besi_kaca', 3000, 'Kaleng soda/susu, potongan besi/seng, dan botol kaca/beling sirup/kecap', true);

-- Data Kas & Tabungan per RT di Lingkungan Desa Mekarjaya
INSERT INTO tabungan_rt (kode_rt, nama_rt, dusun, rw, rt, ketua_rt, kontak, saldo_kas, total_sampah_terkumpul_kg) VALUES
('RT-01-CIMENANG', 'RT 01 / RW 01', 'Dusun Cimenang', '01', '01', 'Bapak Suryana', '081234567890', 145000.00, 48.5),
('RT-02-CIMENANG', 'RT 02 / RW 01', 'Dusun Cimenang', '01', '02', 'Bapak Koswara', '081399887766', 118000.00, 39.0),
('RT-01-CIGANDA', 'RT 01 / RW 02', 'Dusun Ciganda', '02', '01', 'Kang Asep Wahyudin', '085712349988', 195000.00, 64.2),
('RT-02-CIGANDA', 'RT 02 / RW 02', 'Dusun Ciganda', '02', '02', 'Bapak Maman Suherman', '082144556677', 85000.00, 28.0),
('RT-01-CIMUDA', 'RT 01 / RW 03', 'Dusun Cimuda', '03', '01', 'Pak Dedi Supriadi', '087890123456', 160000.00, 52.5),
('RT-02-CIMUDA', 'RT 02 / RW 03', 'Dusun Cimuda', '03', '02', 'Bapak Nana Sukarna', '085611223344', 92000.00, 31.0);

-- Riwayat Penjualan Sampah Terpilah Awal
INSERT INTO transaksi (kode_transaksi, rt_id, jenis, total_berat_kg, total_nominal, keterangan) VALUES
('PJL-20260210-1011', 1, 'penjualan', 25.0, 75000.00, 'Penjualan berkala sampah botol plastik & kardus wadah pilah aktif untuk RT 01 Cimenang'),
('PJL-20260215-2022', 3, 'penjualan', 34.0, 110000.00, 'Hasil penjualan kaleng besi dan botol plastik wadah pilah aktif'),
('SLR-20260220-3033', 1, 'penyaluran', 0, 30000.00, 'Penyaluran dana kas tabungan sampah untuk pengadaan tempat sampah jalan RT 01'),
('PJL-20260225-4044', 5, 'penjualan', 28.5, 87500.00, 'Penjualan botol kaca dan kertas kardus terkumpul di wadah pilah aktif');
