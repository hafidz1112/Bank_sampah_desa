import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  INITIAL_KATALOG,
  INITIAL_RT,
  INITIAL_TRANSAKSI
} from '../data/initialData';
import { generateTxCode, generateKodeRt, formatRupiah } from '../lib/utils';

const BankSampahContext = createContext();

export const BankSampahProvider = ({ children }) => {
  const [isSupabase, setIsSupabase] = useState(isSupabaseConfigured());
  const [loading, setLoading] = useState(true);

  // Core Data States
  const [rtList, setRtList] = useState([]);
  const [katalogList, setKatalogList] = useState([]);
  const [transaksiList, setTransaksiList] = useState([]);

  // Toast / Alert State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    if (!message) {
      setToast(null);
      return;
    }
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const hideToast = () => setToast(null);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#16a34a', '#0284c7', '#eab308']
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
        const [rtRes, katalogRes, txRes] = await Promise.all([
          supabase.from('tabungan_rt').select('*').order('id', { ascending: true }),
          supabase.from('kategori_sampah').select('*').order('id', { ascending: true }),
          supabase.from('transaksi').select('*, detail_setoran(*), tabungan_rt(*)').order('created_at', { ascending: false })
        ]);

        // If tabungan_rt table does not exist or error in Supabase, fall back safely to local data
        if (rtRes.error) {
          console.warn('Supabase tabungan_rt note:', rtRes.error.message);
          loadLocalData();
          setLoading(false);
          return;
        }

        if (rtRes.data && rtRes.data.length > 0) {
          const formattedRt = rtRes.data.map(r => ({
            ...r,
            no_telepon: r.kontak || r.no_telepon || ''
          }));
          setRtList(formattedRt);
        } else {
          setRtList(INITIAL_RT);
        }

        if (katalogRes.data && katalogRes.data.length > 0) setKatalogList(katalogRes.data);
        else setKatalogList(INITIAL_KATALOG);

        if (txRes.data && txRes.data.length > 0) {
          const formattedTx = txRes.data.map(t => ({
            ...t,
            rt_nama: t.tabungan_rt ? `${t.tabungan_rt.nama_rt} (${t.tabungan_rt.dusun})` : (t.rt_nama || 'Kas RT'),
            rt_kode: t.tabungan_rt?.kode_rt || '-',
            items: t.detail_setoran || []
          }));
          setTransaksiList(formattedTx);
        } else {
          setTransaksiList(INITIAL_TRANSAKSI);
        }
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
    const savedRt = localStorage.getItem('SI_BSDES_RT');
    const savedKatalog = localStorage.getItem('SI_BSDES_KATALOG');
    const savedTransaksi = localStorage.getItem('SI_BSDES_TRANSAKSI');

    setRtList(savedRt ? JSON.parse(savedRt) : INITIAL_RT);
    setKatalogList(savedKatalog ? JSON.parse(savedKatalog) : INITIAL_KATALOG);
    setTransaksiList(savedTransaksi ? JSON.parse(savedTransaksi) : INITIAL_TRANSAKSI);
  };

  // Sync to local storage if in local mode
  const syncLocalRt = (data) => {
    setRtList(data);
    localStorage.setItem('SI_BSDES_RT', JSON.stringify(data));
  };

  const syncLocalKatalog = (data) => {
    setKatalogList(data);
    localStorage.setItem('SI_BSDES_KATALOG', JSON.stringify(data));
  };

  const syncLocalTransaksi = (data) => {
    setTransaksiList(data);
    localStorage.setItem('SI_BSDES_TRANSAKSI', JSON.stringify(data));
  };

  // --- RT & TABUNGAN ACTIONS ---
  const addRt = async (rtData) => {
    try {
      const kode = rtData.kode_rt?.trim() || generateKodeRt(rtData.rt, rtData.rw, rtData.dusun);
      const kontakVal = rtData.kontak || rtData.no_telepon || rtData.no_hp || null;
      const dbPayload = {
        kode_rt: kode,
        nama_rt: rtData.nama_rt || `RT ${rtData.rt} / RW ${rtData.rw}`,
        dusun: rtData.dusun,
        rw: rtData.rw,
        rt: rtData.rt,
        ketua_rt: rtData.ketua_rt || 'Pengurus RT',
        kontak: kontakVal,
        saldo_kas: parseFloat(rtData.saldo_kas) || 0,
        total_sampah_terkumpul_kg: parseFloat(rtData.total_sampah_terkumpul_kg) || 0,
        created_at: new Date().toISOString()
      };

      if (isSupabase && supabase) {
        try {
          const { data, error } = await supabase.from('tabungan_rt').insert([dbPayload]).select().single();
          if (error) throw error;
          const fullData = { ...data, no_telepon: data.kontak || '' };
          setRtList(prev => [...prev, fullData]);
        } catch (dbErr) {
          console.warn('Supabase insert note, saving locally:', dbErr.message);
          const itemWithId = { ...dbPayload, id: Date.now(), no_telepon: kontakVal || '' };
          syncLocalRt([...rtList, itemWithId]);
        }
      } else {
        const itemWithId = { ...dbPayload, id: Date.now(), no_telepon: kontakVal || '' };
        syncLocalRt([...rtList, itemWithId]);
      }
      showToast(`Data "${dbPayload.nama_rt}" berhasil ditambahkan!`, 'success');
      return { success: true };
    } catch (err) {
      showToast(`Gagal menambah data RT: ${err.message}`, 'error');
      return { success: false, error: err.message };
    }
  };

  const updateRt = async (id, updatedData) => {
    try {
      const dbPayload = {};
      if (updatedData.nama_rt !== undefined) dbPayload.nama_rt = updatedData.nama_rt;
      if (updatedData.kode_rt !== undefined) dbPayload.kode_rt = updatedData.kode_rt;
      if (updatedData.dusun !== undefined) dbPayload.dusun = updatedData.dusun;
      if (updatedData.rw !== undefined) dbPayload.rw = updatedData.rw;
      if (updatedData.rt !== undefined) dbPayload.rt = updatedData.rt;
      if (updatedData.ketua_rt !== undefined) dbPayload.ketua_rt = updatedData.ketua_rt;
      if (updatedData.kontak !== undefined || updatedData.no_telepon !== undefined) {
        dbPayload.kontak = updatedData.kontak || updatedData.no_telepon || null;
      }
      if (updatedData.saldo_kas !== undefined) dbPayload.saldo_kas = parseFloat(updatedData.saldo_kas);
      if (updatedData.total_sampah_terkumpul_kg !== undefined) dbPayload.total_sampah_terkumpul_kg = parseFloat(updatedData.total_sampah_terkumpul_kg);

      if (isSupabase && supabase) {
        try {
          const { error } = await supabase.from('tabungan_rt').update(dbPayload).eq('id', id);
          if (error) throw error;
        } catch (dbErr) {
          console.warn('Supabase update note, saving locally:', dbErr.message);
        }
      }
      const updated = rtList.map(r => r.id === id ? { ...r, ...dbPayload, no_telepon: dbPayload.kontak !== undefined ? dbPayload.kontak : r.no_telepon } : r);
      syncLocalRt(updated);
      showToast('Data RT & Tabungan berhasil diperbarui!', 'success');
      return { success: true };
    } catch (err) {
      showToast(`Gagal update RT: ${err.message}`, 'error');
      return { success: false, error: err.message };
    }
  };

  const deleteRt = async (id) => {
    try {
      if (isSupabase && supabase) {
        const { error } = await supabase.from('tabungan_rt').delete().eq('id', id);
        if (error) throw error;
      }
      const updated = rtList.filter(r => r.id !== id);
      syncLocalRt(updated);
      showToast('Data RT berhasil dihapus.', 'info');
      return { success: true };
    } catch (err) {
      showToast(`Gagal menghapus data RT: ${err.message}`, 'error');
      return { success: false, error: err.message };
    }
  };

  // Find RT by ID or Code
  const findRtByIdOrKode = (identifier) => {
    if (!identifier) return null;
    const clean = String(identifier).trim().toLowerCase();
    return rtList.find(
      r => String(r.id) === clean ||
           (r.kode_rt && r.kode_rt.toLowerCase() === clean) ||
           (r.nama_rt && r.nama_rt.toLowerCase().includes(clean))
    ) || null;
  };

  // --- KATALOG SAMPAH ACTIONS ---
  const addKategori = async (kategoriData) => {
    try {
      const dbPayload = {
        nama_kategori: kategoriData.nama_kategori,
        tipe: kategoriData.tipe,
        harga_per_kg: parseFloat(kategoriData.harga_per_kg),
        deskripsi: kategoriData.deskripsi || '',
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
      if (updatedData.deskripsi !== undefined) dbPayload.deskripsi = updatedData.deskripsi;
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

  // --- TRANSAKSI PENJUALAN 4 WADAH SAMPAH TERPILAH KE PENGEPUL ---
  const processPenjualan = async ({ rtId, nasabahId, items, keterangan }) => {
    try {
      const targetId = rtId || nasabahId;
      const rt = rtList.find(r => r.id === Number(targetId));
      if (!rt) throw new Error('Pilih RT alokasi tabungan terlebih dahulu.');
      if (!items || items.length === 0) throw new Error('Minimal harus ada 1 item sampah.');

      const totalBerat = items.reduce((acc, curr) => acc + (parseFloat(curr.berat_kg) || 0), 0);
      const totalNominal = items.reduce((acc, curr) => acc + (parseFloat(curr.subtotal) || 0), 0);
      const kodeTransaksi = generateTxCode('PENJUALAN');
      const now = new Date().toISOString();

      let createdTx = null;

      if (isSupabase && supabase) {
        try {
          const { data: txRecord, error: txErr } = await supabase.from('transaksi').insert([{
            kode_transaksi: kodeTransaksi,
            rt_id: Number(targetId),
            jenis: 'penjualan',
            total_berat_kg: totalBerat,
            total_nominal: totalNominal,
            keterangan: keterangan || 'Hasil penjualan sampah terpilah Bank Sampah Aktif',
            created_at: now
          }]).select().single();

          if (txErr) throw txErr;

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
            rt_nama: `${rt.nama_rt} (${rt.dusun})`,
            rt_kode: rt.kode_rt,
            items: items.map(it => ({
              ...it,
              nama_kategori: katalogList.find(k => k.id === it.kategori_id)?.nama_kategori || 'Sampah'
            }))
          };
        } catch (dbErr) {
          console.warn('Supabase processPenjualan failed, saving locally:', dbErr.message);
          createdTx = {
            id: Date.now(),
            kode_transaksi: kodeTransaksi,
            rt_id: Number(targetId),
            rt_nama: `${rt.nama_rt} (${rt.dusun})`,
            rt_kode: rt.kode_rt,
            jenis: 'penjualan',
            total_berat_kg: totalBerat,
            total_nominal: totalNominal,
            keterangan: keterangan || 'Hasil penjualan sampah terpilah Bank Sampah Aktif',
            created_at: now,
            items: items.map(it => ({
              ...it,
              nama_kategori: katalogList.find(k => k.id === it.kategori_id)?.nama_kategori || 'Sampah'
            }))
          };
        }
      } else {
        createdTx = {
          id: Date.now(),
          kode_transaksi: kodeTransaksi,
          rt_id: Number(targetId),
          rt_nama: `${rt.nama_rt} (${rt.dusun})`,
          rt_kode: rt.kode_rt,
          jenis: 'penjualan',
          total_berat_kg: totalBerat,
          total_nominal: totalNominal,
          keterangan: keterangan || 'Hasil penjualan sampah terpilah Bank Sampah Aktif',
          created_at: now,
          items: items.map(it => ({
            ...it,
            nama_kategori: katalogList.find(k => k.id === it.kategori_id)?.nama_kategori || 'Sampah'
          }))
        };
      }

      // Update RT balance in local state
      const updatedRtList = rtList.map(r => {
        if (r.id === Number(targetId)) {
          return {
            ...r,
            saldo_kas: (parseFloat(r.saldo_kas) || 0) + totalNominal,
            total_sampah_terkumpul_kg: (parseFloat(r.total_sampah_terkumpul_kg) || 0) + totalBerat
          };
        }
        return r;
      });
      syncLocalRt(updatedRtList);
      syncLocalTransaksi([createdTx, ...transaksiList]);

      triggerConfetti();
      showToast(`Penjualan ${kodeTransaksi} berhasil dicatat! Kas ${rt.nama_rt} bertambah ${formatRupiah(totalNominal)}.`, 'success');
      const updatedRtObj = {
        ...rt,
        saldo_kas: (parseFloat(rt.saldo_kas) || 0) + totalNominal,
        saldo_aktif: (parseFloat(rt.saldo_kas) || 0) + totalNominal,
        total_sampah_terkumpul_kg: (parseFloat(rt.total_sampah_terkumpul_kg) || 0) + totalBerat
      };
      return {
        success: true,
        transaksi: createdTx,
        rt: updatedRtObj,
        nasabah: updatedRtObj
      };
    } catch (err) {
      showToast(`Gagal memproses penjualan: ${err.message}`, 'error');
      return { success: false, error: err.message };
    }
  };

  // --- TRANSAKSI PENYALURAN / PENGELUARAN KAS TABUNGAN RT ---
  const processPenyaluran = async ({ rtId, nasabahId, nominal, keterangan }) => {
    try {
      const targetId = rtId || nasabahId;
      const rt = rtList.find(r => r.id === Number(targetId));
      if (!rt) throw new Error('Data RT tidak ditemukan.');

      const withdrawAmount = parseFloat(nominal);
      if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        throw new Error('Nominal pengeluaran harus lebih dari Rp 0.');
      }

      if (rt.saldo_kas < withdrawAmount) {
        throw new Error(`Saldo kas RT tidak mencukupi. Saldo saat ini adalah ${formatRupiah(rt.saldo_kas)}`);
      }

      const kodeTransaksi = generateTxCode('PENYALURAN');
      const now = new Date().toISOString();
      let createdTx = null;

      if (isSupabase && supabase) {
        try {
          const { data: txRecord, error: txErr } = await supabase.from('transaksi').insert([{
            kode_transaksi: kodeTransaksi,
            rt_id: Number(targetId),
            jenis: 'penyaluran',
            total_berat_kg: 0,
            total_nominal: withdrawAmount,
            keterangan: keterangan || 'Penyaluran dana kas tabungan RT',
            created_at: now
          }]).select().single();

          if (txErr) throw txErr;

          createdTx = {
            ...txRecord,
            rt_nama: `${rt.nama_rt} (${rt.dusun})`,
            rt_kode: rt.kode_rt,
            items: []
          };
        } catch (dbErr) {
          console.warn('Supabase processPenyaluran failed, saving locally:', dbErr.message);
          createdTx = {
            id: Date.now(),
            kode_transaksi: kodeTransaksi,
            rt_id: Number(targetId),
            rt_nama: `${rt.nama_rt} (${rt.dusun})`,
            rt_kode: rt.kode_rt,
            jenis: 'penyaluran',
            total_berat_kg: 0,
            total_nominal: withdrawAmount,
            keterangan: keterangan || 'Penyaluran dana kas tabungan RT',
            created_at: now,
            items: []
          };
        }
      } else {
        createdTx = {
          id: Date.now(),
          kode_transaksi: kodeTransaksi,
          rt_id: Number(targetId),
          rt_nama: `${rt.nama_rt} (${rt.dusun})`,
          rt_kode: rt.kode_rt,
          jenis: 'penyaluran',
          total_berat_kg: 0,
          total_nominal: withdrawAmount,
          keterangan: keterangan || 'Penyaluran dana kas tabungan RT',
          created_at: now,
          items: []
        };
      }

      // Update RT balance in local state
      const updatedRtList = rtList.map(r => {
        if (r.id === Number(targetId)) {
          return {
            ...r,
            saldo_kas: (parseFloat(r.saldo_kas) || 0) - withdrawAmount,
            saldo_aktif: (parseFloat(r.saldo_kas) || 0) - withdrawAmount
          };
        }
        return r;
      });
      syncLocalRt(updatedRtList);
      syncLocalTransaksi([createdTx, ...transaksiList]);

      showToast(`Penyaluran dana kas ${rt.nama_rt} sebesar ${formatRupiah(withdrawAmount)} berhasil dicatat!`, 'success');
      const updatedRtObj = { 
        ...rt, 
        saldo_kas: (parseFloat(rt.saldo_kas) || 0) - withdrawAmount,
        saldo_aktif: (parseFloat(rt.saldo_kas) || 0) - withdrawAmount
      };
      return {
        success: true,
        transaksi: createdTx,
        rt: updatedRtObj,
        nasabah: updatedRtObj
      };
    } catch (err) {
      showToast(`Gagal memproses penyaluran: ${err.message}`, 'error');
      return { success: false, error: err.message };
    }
  };

  // Reset database back to default initial seed data
  const resetToSampleData = () => {
    syncLocalRt(INITIAL_RT);
    syncLocalKatalog(INITIAL_KATALOG);
    syncLocalTransaksi(INITIAL_TRANSAKSI);
    showToast('Data berhasil di-reset ke data bawaan Desa Mekarjaya.', 'info');
  };

  // Aggregated Statistics
  const getStats = () => {
    const totalRt = rtList.length;
    const totalSaldoKas = rtList.reduce((acc, r) => acc + (parseFloat(r.saldo_kas) || 0), 0);

    const totalPenjualanTx = transaksiList.filter(t => t.jenis === 'penjualan' || t.jenis === 'setor');
    const totalPenyaluranTx = transaksiList.filter(t => t.jenis === 'penyaluran' || t.jenis === 'tarik');

    const totalUangPenjualan = totalPenjualanTx.reduce((acc, t) => acc + (parseFloat(t.total_nominal) || 0), 0);
    const totalUangPenyaluran = totalPenyaluranTx.reduce((acc, t) => acc + (parseFloat(t.total_nominal) || 0), 0);
    const totalBeratSampahKg = totalPenjualanTx.reduce((acc, t) => acc + (parseFloat(t.total_berat_kg) || 0), 0);

    // Breakdown per 4 Category
    const categoryStats = {
      botol_plastik: 0,
      plastik: 0,
      kardus_kertas: 0,
      besi_kaca: 0
    };

    totalPenjualanTx.forEach(t => {
      if (t.items && Array.isArray(t.items)) {
        t.items.forEach(it => {
          const kat = katalogList.find(k => k.id === it.kategori_id);
          const w = parseFloat(it.berat_kg) || 0;
          if (kat?.tipe && categoryStats[kat.tipe] !== undefined) {
            categoryStats[kat.tipe] += w;
          }
        });
      }
    });

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

    rtList.forEach(r => {
      const targetKey = normalizeDusunName(r.dusun);
      if (dusunStats[targetKey]) {
        dusunStats[targetKey].count += 1;
        dusunStats[targetKey].saldo += (parseFloat(r.saldo_kas) || 0);
        dusunStats[targetKey].weight += (parseFloat(r.total_sampah_terkumpul_kg) || 0);
      }
    });

    return {
      totalRt,
      totalNasabah: totalRt, // Backward compatibility
      totalSaldoKas,
      totalSaldoAktif: totalSaldoKas, // Backward compatibility
      totalUangPenjualan,
      totalUangSetor: totalUangPenjualan, // Backward compatibility
      totalUangPenyaluran,
      totalUangTarik: totalUangPenyaluran, // Backward compatibility
      totalBeratSampahKg,
      totalTransaksiCount: transaksiList.length,
      categoryStats,
      dusunStats
    };
  };

  return (
    <BankSampahContext.Provider
      value={{
        isSupabase,
        setIsSupabase,
        loading,
        rtList,
        nasabahList: rtList, // Alias for backward compatibility
        katalogList,
        transaksiList,
        toast,
        showToast,
        hideToast,
        triggerConfetti,
        loadData,
        resetToSampleData,
        // RT Actions
        addRt,
        addNasabah: addRt,
        updateRt,
        updateNasabah: updateRt,
        deleteRt,
        deleteNasabah: deleteRt,
        findRtByIdOrKode,
        // Katalog Actions
        addKategori,
        updateKategori,
        toggleKategoriActive,
        deleteKategori,
        // Transaksi Actions
        processPenjualan,
        processSetoran: processPenjualan, // Alias
        processPenyaluran,
        processPenarikan: processPenyaluran, // Alias
        // Stats
        getStats
      }}
    >
      {children}
    </BankSampahContext.Provider>
  );
};

export const useBankSampah = () => useContext(BankSampahContext);
