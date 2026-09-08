import React, { useState, useEffect } from 'react';
import { X, Building2, Save, AlertCircle, Lock } from 'lucide-react';
import { DUSUN_LIST, generateKodeRt } from '../../lib/utils';
import { useBankSampah } from '../../context/BankSampahContext';
import { Select } from '../ui/Select';

export const NasabahModal = ({ isOpen, onClose, editingNasabah }) => {
  const { addRt, updateRt, rtList } = useBankSampah();

  const [formData, setFormData] = useState({
    nama_rt: '',
    kode_rt: '',
    dusun: 'Dusun Cimenang',
    rw: '01',
    rt: '01',
    ketua_rt: '',
    no_telepon: '',
    saldo_kas: 0
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingNasabah) {
      const rawDusun = editingNasabah.dusun || '';
      let selectedDusun = 'Dusun Cimenang';
      if (rawDusun.toLowerCase().includes('ciganda')) selectedDusun = 'Dusun Ciganda';
      else if (rawDusun.toLowerCase().includes('cimuda')) selectedDusun = 'Dusun Cimuda';
      else if (rawDusun.toLowerCase().includes('cimenang')) selectedDusun = 'Dusun Cimenang';

      setFormData({
        nama_rt: editingNasabah.nama_rt || editingNasabah.nama || '',
        kode_rt: editingNasabah.kode_rt || '',
        dusun: selectedDusun,
        rw: editingNasabah.rw || '01',
        rt: editingNasabah.rt || '01',
        ketua_rt: editingNasabah.ketua_rt || '',
        no_telepon: editingNasabah.kontak || editingNasabah.no_telepon || editingNasabah.no_hp || '',
        saldo_kas: editingNasabah.saldo_kas ?? 0
      });
    } else {
      const defaultDusun = 'Dusun Cimenang';
      const defaultRt = '01';
      setFormData({
        nama_rt: `RT ${defaultRt} Cimenang`,
        kode_rt: generateKodeRt(defaultRt, '01', defaultDusun),
        dusun: defaultDusun,
        rw: '01',
        rt: defaultRt,
        ketua_rt: '',
        no_telepon: '',
        saldo_kas: 0
      });
    }
    setErrorMsg('');
  }, [editingNasabah, isOpen]);

  if (!isOpen) return null;

  const handleDusunChange = (dusun) => {
    const dusunLabel = dusun.replace('Dusun ', '');
    const newKode = generateKodeRt(formData.rt, formData.rw, dusun);
    setFormData(prev => ({
      ...prev,
      dusun,
      nama_rt: prev.nama_rt.startsWith('RT ') ? `RT ${prev.rt} ${dusunLabel}` : prev.nama_rt,
      kode_rt: newKode
    }));
  };

  const handleRtNumChange = (rtNum) => {
    const dusunLabel = formData.dusun.replace('Dusun ', '');
    const newKode = generateKodeRt(rtNum, formData.rw, formData.dusun);
    setFormData(prev => ({
      ...prev,
      rt: rtNum,
      nama_rt: `RT ${rtNum} ${dusunLabel}`,
      kode_rt: newKode
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!formData.nama_rt.trim()) {
      setErrorMsg('Nama unit RT wajib diisi.');
      return;
    }

    if (!formData.kode_rt.trim()) {
      setErrorMsg('Kode RT wajib diisi.');
      return;
    }

    // Check duplicate kode_rt (except when editing same record)
    const duplicate = rtList.find(
      r => r.kode_rt.toLowerCase() === formData.kode_rt.trim().toLowerCase() && 
           (!editingNasabah || r.id !== editingNasabah.id)
    );
    if (duplicate) {
      setErrorMsg(`Kode RT ${formData.kode_rt} sudah digunakan oleh ${duplicate.nama_rt}.`);
      return;
    }

    setLoading(true);
    const payload = {
      ...formData,
      nama: formData.nama_rt, // alias
      kontak: formData.no_telepon.trim() || null,
      no_telepon: formData.no_telepon.trim() || null,
      saldo_kas: parseFloat(formData.saldo_kas) || 0
    };

    let res;
    if (editingNasabah) {
      res = await updateRt(editingNasabah.id, payload);
    } else {
      res = await addRt(payload);
    }
    setLoading(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Gagal menyimpan data RT.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/30 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">
                {editingNasabah ? 'Edit Data Unit RT' : 'Tambah Unit RT Baru'}
              </h3>
              <p className="text-[10px] text-emerald-200">Bank Sampah Aktif Desa Mekarjaya, Ciawigebang</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Kode RT
                </label>
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.5 rounded-md">
                  <Lock className="w-2.5 h-2.5" /> Otomatis
                </span>
              </div>
              <input
                type="text"
                required
                value={formData.kode_rt}
                onChange={(e) => setFormData({ ...formData, kode_rt: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="RT01-CMN"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Unit RT *
              </label>
              <input
                type="text"
                required
                value={formData.nama_rt}
                onChange={(e) => setFormData({ ...formData, nama_rt: e.target.value })}
                placeholder="Contoh: RT 01 Cimenang"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Wilayah Dusun *
              </label>
              <Select
                value={formData.dusun}
                onChange={handleDusunChange}
                options={DUSUN_LIST.map((d) => ({ value: d, label: d }))}
                size="sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor RW
              </label>
              <input
                type="text"
                maxLength="3"
                value={formData.rw}
                onChange={(e) => setFormData({ ...formData, rw: e.target.value })}
                placeholder="01"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor RT
              </label>
              <input
                type="text"
                maxLength="3"
                value={formData.rt}
                onChange={(e) => handleRtNumChange(e.target.value)}
                placeholder="01"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Ketua RT / Koordinator
              </label>
              <input
                type="text"
                value={formData.ketua_rt}
                onChange={(e) => setFormData({ ...formData, ketua_rt: e.target.value })}
                placeholder="Contoh: Bpk. Suryana"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                No. WhatsApp / Kontak Ketua RT
              </label>
              <input
                type="text"
                value={formData.no_telepon}
                onChange={(e) => setFormData({ ...formData, no_telepon: e.target.value })}
                placeholder="0812xxxxxxxx"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Saldo Kas Awal (Rp)
            </label>
            <input
              type="number"
              min="0"
              value={formData.saldo_kas}
              onChange={(e) => setFormData({ ...formData, saldo_kas: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Saldo kas akan bertambah otomatis setiap kali hasil penjualan sampah Bank Sampah Aktif dialokasikan ke RT ini.
            </span>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Menyimpan...' : editingNasabah ? 'Perbarui Data RT' : 'Simpan Data RT'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
