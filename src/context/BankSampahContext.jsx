import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  INITIAL_KATALOG,
  INITIAL_NASABAH,
  INITIAL_TRANSAKSI,
  INITIAL_LOG_ORGANIK
} from '../data/initialData';
import { generateTxCode, generateNoRekening } from '../lib/utils';

const BankSampahContext = createContext();

export const BankSampahProvider = ({ children }) => {
  const [isSupabase, setIsSupabase] = useState(isSupabaseConfigured());
  const [loading, setLoading] = useState(true);

  // Core Data States
  const [nasabahList, setNasabahList] = useState([]);
  const [katalogList, setKatalogList] = useState([]);
  const [transaksiList, setTransaksiList] = useState([]);
  const [logOrganikList, setLogOrganikList] = useState([]);

  // Toast / Alert State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#16a34a', '#eab308', '#3b82f6']
      });
    } catch (e) {
      console.log('Confetti error:', e);
    }
  };

  // Initialize data
  useEffect(() => {
    loadData();
  }, [isSupabase]);

  const loadData = async () => {
    setLoading(true);
    if (isSupabaseConfigured() && supabase) {
      try {
        // Fetch from Supabase
        const [nasabahRes, katalogRes, txRes, logRes] = await Promise.all([
          supabase.from('nasabah').select('*').order('id', { ascending: false }),
          supabase.from('kategori_sampah').select('*').order('id', { ascending: true }),
          supabase.from('transaksi').select('*, detail_setoran(*), nasabah(*)').order('created_at', { ascending: false }),
          supabase.from('log_aliran_organik').select('*').order('tanggal', { ascending: false })
        ]);

        if (nasabahRes.data) setNasabahList(nasabahRes.data);
        if (katalogRes.data) setKatalogList(katalogRes.data);
        if (txRes.data) {
          const formattedTx = txRes.data.map(t => ({
            ...t,
            nasabah_nama: t.nasabah?.nama || 'Nasabah',
            nasabah_no_rekening: t.nasabah?.no_rekening || '-',
            items: t.detail_setoran || []
          }));
          setTransaksiList(formattedTx);
        }
        if (logRes.data) setLogOrganikList(logRes.data);
        setIsSupabase(true);
      } catch (err) {
        console.warn('Error fetching Supabase data, falling back to local:', err);
        loadLocalData();
      }
    } else {
      loadLocalData();
    }
    setLoading(false);
  };

  const loadLocalData = () => {
    setIsSupabase(false);
    const savedNasabah = localStorage.getItem('SI_BSDES_NASABAH');
    const savedKatalog = localStorage.getItem('SI_BSDES_KATALOG');
    const savedTransaksi = localStorage.getItem('SI_BSDES_TRANSAKSI');
    const savedLog = localStorage.getItem('SI_BSDES_LOG_ORGANIK');

    setNasabahList(savedNasabah ? JSON.parse(savedNasabah) : INITIAL_NASABAH);
    setKatalogList(savedKatalog ? JSON.parse(savedKatalog) : INITIAL_KATALOG);
    setTransaksiList(savedTransaksi ? JSON.parse(savedTransaksi) : INITIAL_TRANSAKSI);
    setLogOrganikList(savedLog ? JSON.parse(savedLog) : INITIAL_LOG_ORGANIK);
  };

  // Sync to local storage if in local mode
  const syncLocalNasabah = (data) => {
    setNasabahList(data);
    localStorage.setItem('SI_BSDES_NASABAH', JSON.stringify(data));
  };

  const syncLocalKatalog = (data) => {
    setKatalogList(data);
    localStorage.setItem('SI_BSDES_KATALOG', JSON.stringify(data));
  };

  const syncLocalTransaksi = (data) => {
    setTransaksiList(data);
    localStorage.setItem('SI_BSDES_TRANSAKSI', JSON.stringify(data));
  };

  const syncLocalLogOrganik = (data) => {
    setLogOrganikList(data);
    localStorage.setItem('SI_BSDES_LOG_ORGANIK', JSON.stringify(data));
  };

  // --- NASABAH ACTIONS ---
  const addNasabah = async (nasabahData) => {
    try {
      const generatedRek = generateNoRekening(nasabahList.length);
      const dbPayload = {
        no_rekening: nasabahData.no_rekening || generatedRek,
        nik: nasabahData.nik,
        nama: nasabahData.nama,
        dusun: nasabahData.dusun,
        rw: nasabahData.rw,
        rt: nasabahData.rt,
        no_hp: nasabahData.no_hp || null,
        saldo_aktif: parseFloat(nasabahData.saldo_aktif) || 0,
        created_at: new Date().toISOString()
      };

      if (isSupabase && supabase) {
        const { data, error } = await supabase.from('nasabah').insert([dbPayload]).select().single();
        if (error) throw error;
        setNasabahList(prev => [data, ...prev]);
      } else {
        const itemWithId = { ...dbPayload, id: Date.now() };
        syncLocalNasabah([itemWithId, ...nasabahList]);
      }
      showToast(`Nasabah "${nasabahData.nama}" berhasil didaftarkan!`, 'success');
      return { success: true };
    } catch (err) {
      showToast(`Gagal menambah nasabah: ${err.message}`, 'error');
      return { success: false, error: err.message };
    }
  };

  const updateNasabah = async (id, updatedData) => {
    try {
      const dbPayload = {};
      if (updatedData.no_rekening !== undefined) dbPayload.no_rekening = updatedData.no_rekening;
      if (updatedData.nik !== undefined) dbPayload.nik = updatedData.nik;
      if (updatedData.nama !== undefined) dbPayload.nama = updatedData.nama;
      if (updatedData.dusun !== undefined) dbPayload.dusun = updatedData.dusun;
      if (updatedData.rw !== undefined) dbPayload.rw = updatedData.rw;
      if (updatedData.rt !== undefined) dbPayload.rt = updatedData.rt;
      if (updatedData.no_hp !== undefined) dbPayload.no_hp = updatedData.no_hp;
      if (updatedData.saldo_aktif !== undefined) dbPayload.saldo_aktif = parseFloat(updatedData.saldo_aktif);

      if (isSupabase && supabase) {
        const { error } = await supabase.from('nasabah').update(dbPayload).eq('id', id);
        if (error) throw error;
      }
      const updatedList = nasabahList.map(n => n.id === id ? { ...n, ...dbPayload } : n);
      syncLocalNasabah(updatedList);
      showToast('Data nasabah berhasil diperbarui!', 'success');
      return { success: true };
    } catch (err) {
      showToast(`Gagal update nasabah: ${err.message}`, 'error');
      return { success: false, error: err.message };
    }
  };

  const deleteNasabah = async (id) => {
    try {
      if (isSupabase && supabase) {
        const { error } = await supabase.from('nasabah').delete().eq('id', id);
        if (error) throw error;
      }
      const updatedList = nasabahList.filter(n => n.id !== id);
      syncLocalNasabah(updatedList);
      showToast('Nasabah berhasil dihapus.', 'info');
      return { success: true };
    } catch (err) {
      showToast(`Gagal menghapus nasabah: ${err.message}`, 'error');
      return { success: false, error: err.message };
    }
  };

  // Find Nasabah by NIK or No Rekening (for Public Portal)
  const findNasabahByNikOrRekening = (identifier) => {
    if (!identifier) return null;
    const clean = identifier.trim().toLowerCase();
    return nasabahList.find(
      n => (n.nik && n.nik.toLowerCase() === clean) ||
           (n.no_rekening && n.no_rekening.toLowerCase() === clean)
    ) || null;
  };

  // --- KATALOG SAMPAH ACTIONS ---
  const addKategori = async (kategoriData) => {
    try {
      const dbPayload = {
        nama_kategori: kategoriData.nama_kategori,
        tipe: kategoriData.tipe,
        harga_per_kg: parseFloat(kategoriData.harga_per_kg),
        is_active: kategoriData.is_active ?? true,
        updated_at: new Date().toISOString()
      };

      if (isSupabase && supabase) {
        const { data, error } = await supabase.from('kategori_sampah').insert([dbPayload]).select().single();
        if (error) throw error;
        setKatalogList(prev => [...prev, data]);
      } else {
        const itemWithId = { ...dbPayload, id: Date.now() };
        syncLocalKatalog([...katalogList, itemWithId]);
      }
      showToast(`Katalog "${kategoriData.nama_kategori}" berhasil ditambahkan!`, 'success');
      return { success: true };
    } catch (err) {
      showToast(`Gagal menambah katalog: ${err.message}`, 'error');
      return { success: false, error: err.message };
    }
  };

  const updateKategori = async (id, updatedData) => {
    try {
      const dbPayload = {};
      if (updatedData.nama_kategori !== undefined) dbPayload.nama_kategori = updatedData.nama_kategori;
      if (updatedData.tipe !== undefined) dbPayload.tipe = updatedData.tipe;
      if (updatedData.harga_per_kg !== undefined) dbPayload.harga_per_kg = parseFloat(updatedData.harga_per_kg);
      if (updatedData.is_active !== undefined) dbPayload.is_active = updatedData.is_active;
      dbPayload.updated_at = new Date().toISOString();

      if (isSupabase && supabase) {
        const { error } = await supabase.from('kategori_sampah').update(dbPayload).eq('id', id);
        if (error) throw error;
      }
      const updatedList = katalogList.map(k => k.id === id ? { ...k, ...dbPayload } : k);
      syncLocalKatalog(updatedList);
      showToast('Katalog sampah berhasil diperbarui!', 'success');
      return { success: true };
    } catch (err) {
      showToast(`Gagal update katalog: ${err.message}`, 'error');
      return { success: false, error: err.message };
    }
  };

  const toggleKategoriActive = async (id) => {
    const item = katalogList.find(k => k.id === id);
    if (!item) return;
    return updateKategori(id, { is_active: !item.is_active });
  };

  const deleteKategori = async (id) => {
    try {
      if (isSupabase && supabase) {
        const { error } = await supabase.from('kategori_sampah').delete().eq('id', id);
        if (error) throw error;
      }
      const updated = katalogList.filter(k => k.id !== id);
      syncLocalKatalog(updated);
      showToast('Katalog sampah berhasil dihapus.', 'info');
      return { success: true };
    } catch (err) {
      showToast(`Gagal menghapus kategori: ${err.message}`, 'error');
      return { success: false, error: err.message };
    }
  };

  // --- TRANSAKSI SETORAN SAMPAH ---
  const processSetoran = async ({ nasabahId, items, keterangan }) => {
    try {
      const nasabah = nasabahList.find(n => n.id === Number(nasabahId));
      if (!nasabah) throw new Error('Nasabah tidak ditemukan.');
      if (!items || items.length === 0) throw new Error('Minimal harus ada 1 item sampah.');

      const totalBerat = items.reduce((acc, curr) => acc + (parseFloat(curr.berat_kg) || 0), 0);
      const totalNominal = items.reduce((acc, curr) => acc + (parseFloat(curr.subtotal) || 0), 0);
      const kodeTransaksi = generateTxCode('SETOR');
      const now = new Date().toISOString();

      let createdTx = null;

      if (isSupabase && supabase) {
        // 1. Insert into transaksi
        const { data: txRecord, error: txErr } = await supabase.from('transaksi').insert([{
          kode_transaksi: kodeTransaksi,
          nasabah_id: Number(nasabahId),
          jenis: 'setor',
          total_berat_kg: totalBerat,
          total_nominal: totalNominal,
          keterangan: keterangan || 'Setoran sampah bank sampah',
          created_at: now
        }]).select().single();

        if (txErr) throw txErr;

        // 2. Insert detail_setoran
        const detailRecords = items.map(it => ({
          transaksi_id: txRecord.id,
          kategori_id: it.kategori_id,
          berat_kg: parseFloat(it.berat_kg),
          harga_per_kg: parseFloat(it.harga_per_kg),
          subtotal: parseFloat(it.subtotal)
        }));

        const { error: detailErr } = await supabase.from('detail_setoran').insert(detailRecords);
        if (detailErr) console.warn('Detail insert note:', detailErr);

        createdTx = {
          ...txRecord,
          nasabah_nama: nasabah.nama,
          nasabah_no_rekening: nasabah.no_rekening,
          items: items.map(it => ({
            ...it,
            nama_kategori: katalogList.find(k => k.id === it.kategori_id)?.nama_kategori || 'Sampah'
          }))
        };
      } else {
        // Local mode
        createdTx = {
          id: Date.now(),
          kode_transaksi: kodeTransaksi,
          nasabah_id: Number(nasabahId),
          nasabah_nama: nasabah.nama,
          nasabah_no_rekening: nasabah.no_rekening,
          jenis: 'setor',
          total_berat_kg: totalBerat,
          total_nominal: totalNominal,
          keterangan: keterangan || 'Setoran sampah bank sampah',
          created_at: now,
          items: items.map(it => ({
            ...it,
            nama_kategori: katalogList.find(k => k.id === it.kategori_id)?.nama_kategori || 'Sampah'
          }))
        };

        // Update local nasabah balance
        const updatedNasabahList = nasabahList.map(n => {
          if (n.id === Number(nasabahId)) {
            return { ...n, saldo_aktif: (parseFloat(n.saldo_aktif) || 0) + totalNominal };
          }
          return n;
        });
        syncLocalNasabah(updatedNasabahList);
      }

      syncLocalTransaksi([createdTx, ...transaksiList]);
      triggerConfetti();
      showToast(`Setoran ${kodeTransaksi} berhasil dicatat! Saldo ${nasabah.nama} bertambah.`, 'success');
      return { success: true, transaksi: createdTx, nasabah: { ...nasabah, saldo_aktif: (parseFloat(nasabah.saldo_aktif) || 0) + totalNominal } };
    } catch (err) {
      showToast(`Gagal memproses setoran: ${err.message}`, 'error');
      return { success: false, error: err.message };
    }
  };

  // --- TRANSAKSI PENARIKAN SALDO ---
  const processPenarikan = async ({ nasabahId, nominal, keterangan }) => {
    try {
      const nasabah = nasabahList.find(n => n.id === Number(nasabahId));
      if (!nasabah) throw new Error('Nasabah tidak ditemukan.');

      const withdrawAmount = parseFloat(nominal);
      if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        throw new Error('Nominal penarikan harus lebih dari Rp 0.');
      }

      if (nasabah.saldo_aktif < withdrawAmount) {
        throw new Error(`Saldo tidak mencukupi. Saldo aktif nasabah saat ini adalah Rp ${nasabah.saldo_aktif.toLocaleString('id-ID')}`);
      }

      const kodeTransaksi = generateTxCode('TARIK');
      const now = new Date().toISOString();
      let createdTx = null;

      if (isSupabase && supabase) {
        const { data: txRecord, error: txErr } = await supabase.from('transaksi').insert([{
          kode_transaksi: kodeTransaksi,
          nasabah_id: Number(nasabahId),
          jenis: 'tarik',
          total_berat_kg: 0,
          total_nominal: withdrawAmount,
          keterangan: keterangan || 'Penarikan tabungan saldo nasabah',
          created_at: now
        }]).select().single();

        if (txErr) throw txErr;

        createdTx = {
          ...txRecord,
          nasabah_nama: nasabah.nama,
          nasabah_no_rekening: nasabah.no_rekening,
          items: []
        };
      } else {
        createdTx = {
          id: Date.now(),
          kode_transaksi: kodeTransaksi,
          nasabah_id: Number(nasabahId),
          nasabah_nama: nasabah.nama,
          nasabah_no_rekening: nasabah.no_rekening,
          jenis: 'tarik',
          total_berat_kg: 0,
          total_nominal: withdrawAmount,
          keterangan: keterangan || 'Penarikan tabungan saldo nasabah',
          created_at: now,
          items: []
        };

        const updatedNasabahList = nasabahList.map(n => {
          if (n.id === Number(nasabahId)) {
            return { ...n, saldo_aktif: (parseFloat(n.saldo_aktif) || 0) - withdrawAmount };
          }
          return n;
        });
        syncLocalNasabah(updatedNasabahList);
      }

      syncLocalTransaksi([createdTx, ...transaksiList]);
      showToast(`Penarikan ${kodeTransaksi} sebesar Rp ${withdrawAmount.toLocaleString('id-ID')} berhasil!`, 'success');
      return { success: true, transaksi: createdTx, nasabah: { ...nasabah, saldo_aktif: (parseFloat(nasabah.saldo_aktif) || 0) - withdrawAmount } };
    } catch (err) {
      showToast(`Gagal memproses penarikan: ${err.message}`, 'error');
      return { success: false, error: err.message };
    }
  };

  // --- LOG ALIRAN ORGANIK MAGGOT BSF ---
  const addLogOrganik = async (logData, notify = true) => {
    try {
      const dbPayload = {
        tanggal: logData.tanggal || new Date().toISOString().slice(0, 10),
        volume_sampah_organik_kg: parseFloat(logData.volume_sampah_organik_kg) || 0,
        tujuan_biopond: logData.tujuan_biopond || 'Biopond Maggot Unit 1',
        est_maggot_panen_kg: parseFloat(logData.est_maggot_panen_kg) || (parseFloat(logData.volume_sampah_organik_kg) * 0.2),
        target_alokasi: logData.target_alokasi || 'Pakan Bebek Petelur BUMDes',
        created_at: new Date().toISOString()
      };

      if (isSupabase && supabase) {
        const { data, error } = await supabase.from('log_aliran_organik').insert([dbPayload]).select().single();
        if (error) throw error;
        setLogOrganikList(prev => [data, ...prev]);
      } else {
        const itemWithId = { ...dbPayload, id: Date.now() };
        syncLocalLogOrganik([itemWithId, ...logOrganikList]);
      }
      if (notify) showToast('Log aliran sampah organik ke Biopond Maggot berhasil dicatat!', 'success');
      return { success: true };
    } catch (err) {
      if (notify) showToast(`Gagal mencatat log organik: ${err.message}`, 'error');
      return { success: false, error: err.message };
    }
  };

  const deleteLogOrganik = async (id) => {
    try {
      if (isSupabase && supabase) {
        const { error } = await supabase.from('log_aliran_organik').delete().eq('id', id);
        if (error) throw error;
      }
      const updated = logOrganikList.filter(l => l.id !== id);
      syncLocalLogOrganik(updated);
      showToast('Log biopond maggot berhasil dihapus.', 'info');
      return { success: true };
    } catch (err) {
      showToast(`Gagal menghapus log: ${err.message}`, 'error');
      return { success: false, error: err.message };
    }
  };

  // Reset database back to default initial seed data
  const resetToSampleData = () => {
    syncLocalNasabah(INITIAL_NASABAH);
    syncLocalKatalog(INITIAL_KATALOG);
    syncLocalTransaksi(INITIAL_TRANSAKSI);
    syncLocalLogOrganik(INITIAL_LOG_ORGANIK);
    showToast('Data berhasil di-reset ke data bawaan Desa Mekarjaya.', 'info');
  };

  // Agregated Statistics
  const getStats = () => {
    const totalNasabah = nasabahList.length;
    const totalSaldoAktif = nasabahList.reduce((acc, n) => acc + (parseFloat(n.saldo_aktif) || 0), 0);

    const totalSetoranTx = transaksiList.filter(t => t.jenis === 'setor');
    const totalPenarikanTx = transaksiList.filter(t => t.jenis === 'tarik');

    const totalUangSetor = totalSetoranTx.reduce((acc, t) => acc + (parseFloat(t.total_nominal) || 0), 0);
    const totalUangTarik = totalPenarikanTx.reduce((acc, t) => acc + (parseFloat(t.total_nominal) || 0), 0);
    const totalBeratSampahKg = totalSetoranTx.reduce((acc, t) => acc + (parseFloat(t.total_berat_kg) || 0), 0);

    // Calculate organic vs anorganic waste from setoran transactions
    let totalSampahOrganikKg = 0;
    let totalSampahAnorganikKg = 0;

    totalSetoranTx.forEach(t => {
      if (t.items && Array.isArray(t.items) && t.items.length > 0) {
        t.items.forEach(it => {
          const kat = katalogList.find(k => k.id === it.kategori_id);
          const w = parseFloat(it.berat_kg) || 0;
          if (kat && kat.tipe === 'organik') {
            totalSampahOrganikKg += w;
          } else {
            totalSampahAnorganikKg += w;
          }
        });
      }
    });

    // Fallback if detail items not populated in legacy data:
    if (totalSampahOrganikKg === 0 && totalSampahAnorganikKg === 0 && totalBeratSampahKg > 0) {
      totalSampahOrganikKg = totalBeratSampahKg * 0.35;
      totalSampahAnorganikKg = totalBeratSampahKg * 0.65;
    }

    // Estimated maggot conversion (~20% standard bioconversion factor) for educational insight
    const totalEstMaggotKg = totalSampahOrganikKg * 0.20;

    // Dusun distribution
    const dusunStats = {
      'Dusun Cimenang': { count: 0, saldo: 0, weight: 0 },
      'Dusun Ciganda': { count: 0, saldo: 0, weight: 0 },
      'Dusun Cimuda': { count: 0, saldo: 0, weight: 0 }
    };

    const normalizeDusunName = (val) => {
      if (!val) return 'Dusun Cimenang';
      const clean = String(val).trim().toLowerCase();
      if (clean.includes('cimenang')) return 'Dusun Cimenang';
      if (clean.includes('ciganda')) return 'Dusun Ciganda';
      if (clean.includes('cimuda')) return 'Dusun Cimuda';
      return clean.startsWith('dusun ') ? val : `Dusun ${val}`;
    };

    nasabahList.forEach(n => {
      const targetKey = normalizeDusunName(n.dusun);
      if (dusunStats[targetKey]) {
        dusunStats[targetKey].count += 1;
        dusunStats[targetKey].saldo += (parseFloat(n.saldo_aktif) || 0);
      }
    });

    // Compute setoran weight per dusun
    totalSetoranTx.forEach(t => {
      const foundNasabah = nasabahList.find(n => n.id === t.nasabah_id);
      if (foundNasabah) {
        const targetKey = normalizeDusunName(foundNasabah.dusun);
        if (dusunStats[targetKey]) {
          dusunStats[targetKey].weight += (parseFloat(t.total_berat_kg) || 0);
        }
      }
    });

    return {
      totalNasabah,
      totalSaldoAktif,
      totalUangSetor,
      totalUangTarik,
      totalBeratSampahKg,
      totalSampahOrganikKg,
      totalSampahAnorganikKg,
      totalSampahOrganikLogKg: totalSampahOrganikKg, // Alias for backward compatibility
      totalEstMaggotKg,
      totalTransaksiCount: transaksiList.length,
      dusunStats
    };
  };

  return (
    <BankSampahContext.Provider
      value={{
        isSupabase,
        setIsSupabase,
        loading,
        nasabahList,
        katalogList,
        transaksiList,
        logOrganikList,
        toast,
        showToast,
        triggerConfetti,
        loadData,
        resetToSampleData,
        // Nasabah
        addNasabah,
        updateNasabah,
        deleteNasabah,
        findNasabahByNikOrRekening,
        // Katalog
        addKategori,
        updateKategori,
        toggleKategoriActive,
        deleteKategori,
        // Transaksi
        processSetoran,
        processPenarikan,
        // Maggot
        addLogOrganik,
        deleteLogOrganik,
        // Stats
        getStats
      }}
    >
      {children}
    </BankSampahContext.Provider>
  );
};

export const useBankSampah = () => useContext(BankSampahContext);
