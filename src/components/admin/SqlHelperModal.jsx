import React, { useState } from 'react';
import { X, Copy, Check, Code2, Download, ExternalLink } from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';

export const SqlHelperModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const { showToast } = useBankSampah();

  if (!isOpen) return null;

  const sqlScript = `-- ==============================================================================
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

CREATE POLICY "Public Read Kategori Sampah" ON kategori_sampah FOR SELECT USING (true);
CREATE POLICY "Admin All Kategori Sampah" ON kategori_sampah FOR ALL TO authenticated USING (true);

CREATE POLICY "Public Read Nasabah" ON nasabah FOR SELECT USING (true);
CREATE POLICY "Admin All Nasabah" ON nasabah FOR ALL TO authenticated USING (true);

CREATE POLICY "Public Read Transaksi" ON transaksi FOR SELECT USING (true);
CREATE POLICY "Admin All Transaksi" ON transaksi FOR ALL TO authenticated USING (true);

CREATE POLICY "Public Read Detail Setoran" ON detail_setoran FOR SELECT USING (true);
CREATE POLICY "Admin All Detail Setoran" ON detail_setoran FOR ALL TO authenticated USING (true);

CREATE POLICY "Public Read Log Organik" ON log_aliran_organik FOR SELECT USING (true);
CREATE POLICY "Admin All Log Organik" ON log_aliran_organik FOR ALL TO authenticated USING (true);`;

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
    link.download = 'schema_si_bsdes_mekarjaya.sql';
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
              <p className="text-[10px] text-slate-400">Database Schema, Auto Trigger Saldo & RLS Policies</p>
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
            supabase/schema.sql • 5 Tabel, 2 Enums, 1 Trigger
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
