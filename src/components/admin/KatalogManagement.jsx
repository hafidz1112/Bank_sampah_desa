import React, { useState } from 'react';
import { Tag, Plus, Edit, Trash2, CheckCircle2, XCircle, Search, DollarSign, X, AlertCircle } from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';
import { formatRupiah } from '../../lib/utils';
import { Select } from '../ui/Select';

export const KatalogManagement = () => {
  const { katalogList, addKategori, updateKategori, deleteKategori, toggleKategoriActive } = useBankSampah();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    nama_kategori: '',
    tipe: 'anorganik',
    harga_per_kg: '',
    deskripsi: '',
    is_active: true
  });
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      nama_kategori: '',
      tipe: 'anorganik',
      harga_per_kg: '',
      deskripsi: '',
      is_active: true
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      nama_kategori: item.nama_kategori || '',
      tipe: item.tipe || 'anorganik',
      harga_per_kg: item.harga_per_kg || '',
      deskripsi: item.deskripsi || '',
      is_active: item.is_active ?? true
    });
    setErrorMsg('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama_kategori.trim()) {
      setErrorMsg('Nama kategori sampah wajib diisi.');
      return;
    }
    const hargaNum = parseFloat(formData.harga_per_kg);
    if (isNaN(hargaNum) || hargaNum < 0) {
      setErrorMsg('Harga per kg harus berupa angka positif.');
      return;
    }

    const payload = {
      ...formData,
      harga_per_kg: hargaNum
    };

    let res;
    if (editingItem) {
      res = await updateKategori(editingItem.id, payload);
    } else {
      res = await addKategori(payload);
    }

    if (res.success) {
      setModalOpen(false);
    } else {
      setErrorMsg(res.error || 'Gagal menyimpan kategori.');
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Yakin ingin menghapus kategori "${name}"?`)) {
      deleteKategori(id);
    }
  };

  const filtered = katalogList.filter(k => {
    const matchSearch = k.nama_kategori.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = selectedType === 'all' || k.tipe === selectedType;
    return matchSearch && matchType;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Katalog Sampah & Tarif per Kilogram
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola harga beli sampah anorganik dan organik untuk seluruh warga Desa Mekarjaya
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Kategori</span>
        </button>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari kategori sampah..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedType === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({katalogList.length})
          </button>
          <button
            onClick={() => setSelectedType('anorganik')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedType === 'anorganik' ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
            }`}
          >
            Anorganik ({katalogList.filter(k => k.tipe === 'anorganik').length})
          </button>
          <button
            onClick={() => setSelectedType('organik')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              selectedType === 'organik' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Organik Maggot ({katalogList.filter(k => k.tipe === 'organik').length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Kategori Sampah</th>
                <th className="py-3.5 px-4">Tipe / Kelompok</th>
                <th className="py-3.5 px-4">Deskripsi / Kriteria</th>
                <th className="py-3.5 px-4 text-right">Tarif Beli Warga</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {item.nama_kategori}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      item.tipe === 'organik'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-sky-100 text-sky-800'
                    }`}>
                      {item.tipe}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                    {item.deskripsi || '-'}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-slate-900 font-sans text-sm">
                    {formatRupiah(item.harga_per_kg)} <span className="text-[11px] font-normal text-slate-400">/kg</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => toggleKategoriActive(item.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition ${
                        item.is_active
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {item.is_active ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3" />}
                      {item.is_active ? 'Aktif' : 'Non-aktif'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                        title="Edit Kategori"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.nama_kategori)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-scale-in">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base">
                {editingItem ? 'Edit Katalog Sampah' : 'Tambah Kategori Sampah'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Kategori Sampah *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama_kategori}
                  onChange={(e) => setFormData({ ...formData, nama_kategori: e.target.value })}
                  placeholder="Contoh: Kardus Bekas / Minyak Jelantah"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tipe Sampah *
                  </label>
                  <Select
                    value={formData.tipe}
                    onChange={(val) => setFormData({ ...formData, tipe: val })}
                    options={[
                      { value: 'anorganik', label: 'Anorganik', badge: 'ANORGANIK' },
                      { value: 'organik', label: 'Organik (Pakan Maggot)', badge: 'ORGANIK' }
                    ]}
                    size="sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tarif per Kg (Rp) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    required
                    value={formData.harga_per_kg}
                    onChange={(e) => setFormData({ ...formData, harga_per_kg: e.target.value })}
                    placeholder="Contoh: 2500"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Deskripsi / Petunjuk Kebersihan
                </label>
                <textarea
                  rows="2"
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  placeholder="Contoh: Kering, bersih tanpa staples/tutup"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active_check"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="is_active_check" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Aktifkan kategori ini untuk penimbangan warga
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
