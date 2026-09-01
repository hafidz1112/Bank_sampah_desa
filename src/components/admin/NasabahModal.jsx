import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, AlertCircle } from 'lucide-react';
import { DUSUN_LIST, generateNoRekening } from '../../lib/utils';
import { useBankSampah } from '../../context/BankSampahContext';

export const NasabahModal = ({ isOpen, onClose, editingNasabah }) => {
  const { addNasabah, updateNasabah, nasabahList } = useBankSampah();

  const [formData, setFormData] = useState({
    nama: '',
    nik: '',
    no_rekening: '',
    dusun: 'Dusun Cimenang',
    rw: '01',
    rt: '01',
    no_hp: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingNasabah) {
      setFormData({
        nama: editingNasabah.nama || '',
        nik: editingNasabah.nik || '',
        no_rekening: editingNasabah.no_rekening || '',
        dusun: editingNasabah.dusun || 'Dusun Cimenang',
        rw: editingNasabah.rw || '01',
        rt: editingNasabah.rt || '01',
        no_hp: editingNasabah.no_hp || '',
      });
    } else {
      setFormData({
        nama: '',
        nik: '',
        no_rekening: generateNoRekening(nasabahList.length),
        dusun: 'Dusun Cimenang',
        rw: '01',
        rt: '01',
        no_hp: '',
      });
    }
    setErrorMsg('');
  }, [editingNasabah, isOpen, nasabahList.length]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!formData.nama.trim()) {
      setErrorMsg('Nama nasabah wajib diisi.');
      return;
    }

    if (!formData.nik || formData.nik.trim().length !== 16) {
      setErrorMsg('NIK harus terdiri dari 16 digit angka.');
      return;
    }

    // Check duplicate NIK (except when editing same record)
    const duplicateNik = nasabahList.find(
      n => n.nik === formData.nik.trim() && (!editingNasabah || n.id !== editingNasabah.id)
    );
    if (duplicateNik) {
      setErrorMsg(`NIK ${formData.nik} sudah terdaftar atas nama ${duplicateNik.nama}.`);
      return;
    }

    setLoading(true);
    let res;
    if (editingNasabah) {
      res = await updateNasabah(editingNasabah.id, formData);
    } else {
      res = await addNasabah(formData);
    }
    setLoading(false);

    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Gagal menyimpan nasabah.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/30 flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">
                {editingNasabah ? 'Edit Data Nasabah' : 'Pendaftaran Nasabah Baru'}
              </h3>
              <p className="text-[10px] text-emerald-200">Desa Mekarjaya, Kec. Ciawigebang</p>
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
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nomor Rekening Nasabah
              </label>
              <input
                type="text"
                required
                value={formData.no_rekening}
                onChange={(e) => setFormData({ ...formData, no_rekening: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                NIK Kependudukan (16 Digit) *
              </label>
              <input
                type="text"
                maxLength="16"
                required
                value={formData.nik}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value.replace(/\D/g, '') })}
                placeholder="320805xxxxxxxxxx"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama Lengkap Nasabah / Kepala Keluarga *
            </label>
            <input
              type="text"
              required
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              placeholder="Contoh: Bapak Suryana / Ibu Maryati"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Wilayah Dusun *
              </label>
              <select
                value={formData.dusun}
                onChange={(e) => setFormData({ ...formData, dusun: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {DUSUN_LIST.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
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
                onChange={(e) => setFormData({ ...formData, rt: e.target.value })}
                placeholder="02"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nomor WhatsApp / HP (Opsional)
            </label>
            <input
              type="text"
              value={formData.no_hp}
              onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
              placeholder="0812xxxxxxxx"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
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
              <span>{loading ? 'Menyimpan...' : editingNasabah ? 'Perbarui Data' : 'Simpan Nasabah'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
