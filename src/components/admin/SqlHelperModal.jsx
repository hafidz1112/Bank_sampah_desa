import React, { useState } from 'react';
import { X, Copy, Check, Code2, Download, ExternalLink } from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';

export const SqlHelperModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useBankSampah();

  if (!isOpen) return null;

  const sqlScript = `-- ==============================================================================
-- SISTEM INFORMASI BANK SAMPAH DESA TERINTEGRASI (SI-BSDes) BANK SAMPAH AKTIF MEKARJAYA
-- Penerapan: Tempat Sampah Terpilah 4 Wadah Bank Sampah Aktif Mekarjaya
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

-- 9. SEED DATA AWAL (4 KATEGORI SAMPAH & DATA RT)
INSERT INTO kategori_sampah (nama_kategori, tipe, harga_per_kg, deskripsi, is_active) VALUES
('Botol Plastik (PET Bening / Bersih)', 'botol_plastik', 3500, 'Botol air mineral bersih, botol teh/jus bening, tutup botol dilepas', true),
('Plastik (Kresek, Gelas PP & Campur)', 'plastik', 2200, 'Gelas plastik minuman kemasan (PP), kantong kresek kering, kemasan plastik bersih', true),
('Kardus & Kertas (Karton / Buku / Koran)', 'kardus_kertas', 2500, 'Kardus box gelombang kering, kertas putih HVS, koran, buku tulis bekas', true),
('Besi & Kaca (Kaleng, Seng, Beling Botol)', 'besi_kaca', 3000, 'Kaleng soda/susu, potongan besi/seng, dan botol kaca/beling sirup/kecap', true);

INSERT INTO tabungan_rt (kode_rt, nama_rt, dusun, rw, rt, ketua_rt, kontak, saldo_kas, total_sampah_terkumpul_kg) VALUES
('RT-01-CIMENANG', 'RT 01 / RW 01', 'Dusun Cimenang', '01', '01', 'Bapak Suryana', '081234567890', 145000.00, 48.5),
('RT-02-CIMENANG', 'RT 02 / RW 01', 'Dusun Cimenang', '01', '02', 'Bapak Koswara', '081399887766', 118000.00, 39.0),
('RT-01-CIGANDA', 'RT 01 / RW 02', 'Dusun Ciganda', '02', '01', 'Kang Asep Wahyudin', '085712349988', 195000.00, 64.2),
('RT-02-CIGANDA', 'RT 02 / RW 02', 'Dusun Ciganda', '02', '02', 'Bapak Maman Suherman', '082144556677', 85000.00, 28.0),
('RT-01-CIMUDA', 'RT 01 / RW 03', 'Dusun Cimuda', '03', '01', 'Pak Dedi Supriadi', '087890123456', 160000.00, 52.5),
('RT-02-CIMUDA', 'RT 02 / RW 03', 'Dusun Cimuda', '03', '02', 'Bapak Nana Sukarna', '085611223344', 92000.00, 31.0);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    showToast('Skrip SQL berhasil disalin ke clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownload = () => {
    const blob = new Blob([sqlScript], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'schema_si_bsdes_bank_sampah_aktif.sql';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-100 animate-scale-in flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Skrip SQL PostgreSQL & DDL Supabase</h3>
              <p className="text-[10px] text-slate-400">Database Schema 4 Wadah Bank Sampah Aktif, Auto Trigger Kas RT & RLS Policies</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action bar */}
        <div className="bg-slate-800 px-6 py-2.5 flex items-center justify-between border-b border-slate-700">
          <span className="text-xs text-slate-300 font-mono">
            supabase/schema.sql • 4 Tabel, 2 Enums, 1 Trigger Kas RT
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh .sql</span>
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin SQL'}</span>
            </button>
          </div>
        </div>

        {/* Code view */}
        <div className="p-4 bg-slate-950 overflow-y-auto flex-1 font-mono text-xs text-emerald-400 leading-relaxed select-all">
          <pre>{sqlScript}</pre>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>Jalankan skrip ini di tab <strong>SQL Editor</strong> pada Supabase Dashboard Anda.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
