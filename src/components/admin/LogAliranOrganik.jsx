import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Download, 
  FileSpreadsheet, 
  Calendar, 
  Egg, 
  Leaf, 
  TrendingUp, 
  X, 
  AlertCircle,
  Scale
} from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';
import { formatRupiah, formatWeight, formatDate, BIOPOND_UNITS } from '../../lib/utils';
import { exportToCSV, exportLogMaggotPDF } from '../../lib/exportUtils';

export const LogAliranOrganik = () => {
  const { logOrganikList, addLogOrganik, deleteLogOrganik } = useBankSampah();

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    tanggal: new Date().toISOString().slice(0, 10),
    volume_sampah_organik_kg: '',
    tujuan_biopond: 'Biopond Maggot Unit 1 (Kandang Utama)',
    est_maggot_panen_kg: '',
    target_alokasi: 'Pakan Bebek Petelur BUMDes Mekarjaya',
    keterangan: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  // Handle auto calculation of maggot yield when volume changes
  const handleVolumeChange = (vol) => {
    const volNum = parseFloat(vol) || 0;
    setFormData({
      ...formData,
      volume_sampah_organik_kg: vol,
      est_maggot_panen_kg: (volNum * 0.20).toFixed(2) // 20% conversion standard
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.volume_sampah_organik_kg || parseFloat(formData.volume_sampah_organik_kg) <= 0) {
      setErrorMsg('Volume sampah organik harus lebih dari 0 kg.');
      return;
    }

    const res = await addLogOrganik(formData);
    if (res.success) {
      setModalOpen(false);
      setFormData({
        tanggal: new Date().toISOString().slice(0, 10),
        volume_sampah_organik_kg: '',
        tujuan_biopond: 'Biopond Maggot Unit 1 (Kandang Utama)',
        est_maggot_panen_kg: '',
        target_alokasi: 'Pakan Bebek Petelur BUMDes Mekarjaya',
        keterangan: ''
      });
      setErrorMsg('');
    } else {
      setErrorMsg(res.error || 'Gagal menyimpan log organik.');
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus catatan log aliran organik ini?')) {
      deleteLogOrganik(id);
    }
  };

  // KPIs
  const totalVolumeKg = logOrganikList.reduce((acc, l) => acc + (parseFloat(l.volume_sampah_organik_kg) || 0), 0);
  const totalMaggotKg = logOrganikList.reduce((acc, l) => acc + (parseFloat(l.est_maggot_panen_kg) || 0), 0);
  const totalKasgotKg = totalVolumeKg * 0.25;
  const totalHematPakanRp = totalMaggotKg * 0.75 * 8500;

  const handleExportCSV = () => {
    const headers = ['Tanggal', 'Volume Sampah Organik (Kg)', 'Tujuan Biopond', 'Est Panen Maggot (Kg)', 'Target Alokasi', 'Keterangan'];
    const rows = logOrganikList.map(l => [
      l.tanggal,
      l.volume_sampah_organik_kg,
      l.tujuan_biopond,
      l.est_maggot_panen_kg,
      l.target_alokasi,
      l.keterangan || ''
    ]);
    exportToCSV(`Log_Maggot_BSF_Mekarjaya_${new Date().toISOString().slice(0, 10)}`, rows, headers);
  };

  const handleExportPDF = () => {
    exportLogMaggotPDF(logOrganikList);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Log Sirkular Sampah Organik ke Biopond Maggot BSF
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pencatatan pasokan sampah dapur & pasar desa untuk pakan ternak bebek petelur BUMDes Mekarjaya
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-600" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-amber-600" />
            <span>Ekspor PDF</span>
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/30 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Catat Log Masuk</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-amber-200/70 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Organik Masuk Biopond</span>
          <div className="text-2xl font-extrabold text-amber-900 font-sans mt-1">{formatWeight(totalVolumeKg)}</div>
          <p className="text-[11px] text-amber-700 font-medium mt-1 flex items-center gap-1">
            <Scale className="w-3.5 h-3.5" /> Dialihkan dari timbulan sampah
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-emerald-200/70 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Est. Panen Maggot Fresh</span>
          <div className="text-2xl font-extrabold text-emerald-800 font-sans mt-1">~{formatWeight(totalMaggotKg)}</div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <Egg className="w-3.5 h-3.5" /> Pakan alami kaya protein (~40%)
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-blue-200/70 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Hemat Pakan Bebek BUMDes</span>
          <div className="text-2xl font-extrabold text-blue-800 font-sans mt-1">{formatRupiah(totalHematPakanRp)}</div>
          <p className="text-[11px] text-blue-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Efisiensi belanja pakan konsentrat
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-purple-200/70 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Residu Kasgot (Pupuk)</span>
          <div className="text-2xl font-extrabold text-purple-800 font-sans mt-1">~{formatWeight(totalKasgotKg)}</div>
          <p className="text-[11px] text-purple-600 font-medium mt-1 flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5" /> Pupuk organik tanaman desa
          </p>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Tanggal Pengiriman</th>
                <th className="py-3.5 px-4 text-right">Volume Sampah Organik</th>
                <th className="py-3.5 px-4">Unit Biopond Maggot</th>
                <th className="py-3.5 px-4 text-right">Est. Panen Larva (Kg)</th>
                <th className="py-3.5 px-4">Alokasi Sasaran</th>
                <th className="py-3.5 px-4">Catatan</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {logOrganikList.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-semibold text-slate-800 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(log.tanggal, false)}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-amber-800 font-sans text-sm">
                    {formatWeight(log.volume_sampah_organik_kg)}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">
                    {log.tujuan_biopond}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-emerald-700 font-sans text-sm">
                    ~{formatWeight(log.est_maggot_panen_kg)}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-semibold">
                      <Egg className="w-3 h-3 text-amber-600" />
                      {log.target_alokasi}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                    {log.keterangan || '-'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
                      title="Hapus Log"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logOrganikList.length === 0 && (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <Sparkles className="w-8 h-8 mx-auto text-amber-300" />
            <p className="text-xs font-semibold">Belum ada catatan aliran organik ke biopond maggot.</p>
          </div>
        )}
      </div>

      {/* Modal Add Log */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-scale-in">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-200" />
                <h3 className="font-extrabold text-base">Catat Pasokan Sampah Organik</h3>
              </div>
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
                  Tanggal Pengiriman *
                </label>
                <input
                  type="date"
                  required
                  value={formData.tanggal}
                  onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Volume Sampah Organik Masuk (Kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={formData.volume_sampah_organik_kg}
                  onChange={(e) => handleVolumeChange(e.target.value)}
                  placeholder="Contoh: 35.5"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Unit Biopond Penerima *
                </label>
                <select
                  value={formData.tujuan_biopond}
                  onChange={(e) => setFormData({ ...formData, tujuan_biopond: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {BIOPOND_UNITS.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Estimasi Panen Larva Maggot (Kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.est_maggot_panen_kg}
                  onChange={(e) => setFormData({ ...formData, est_maggot_panen_kg: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-amber-50 text-amber-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">Dihitung otomatis 20% dari bobot sampah organik</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alokasi Target Pakan
                </label>
                <input
                  type="text"
                  value={formData.target_alokasi}
                  onChange={(e) => setFormData({ ...formData, target_alokasi: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan / Keterangan Sumber
                </label>
                <input
                  type="text"
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  placeholder="Contoh: Sisa sayur pasar desa & limbah hajatan warga"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
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
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/30"
                >
                  Simpan Log Organik
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
