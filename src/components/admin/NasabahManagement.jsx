import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Edit, 
  Trash2, 
  CreditCard, 
  MapPin, 
  Phone,
  FileSpreadsheet,
  Coins,
  Scale
} from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';
import { formatRupiah, formatWeight, DUSUN_LIST } from '../../lib/utils';
import { exportToCSV, exportRtPDF } from '../../lib/exportUtils';
import { NasabahModal } from './NasabahModal';
import { NasabahCardModal } from './NasabahCardModal';

export const NasabahManagement = () => {
  const { rtList, deleteRt } = useBankSampah();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDusun, setSelectedDusun] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRt, setEditingRt] = useState(null);
  const [cardModalRt, setCardModalRt] = useState(null);

  const matchDusunName = (itemDusun, filterVal) => {
    if (!filterVal || filterVal === 'all') return true;
    if (!itemDusun) return false;
    const cleanItem = String(itemDusun).toLowerCase().replace('dusun ', '').trim();
    const cleanFilter = String(filterVal).toLowerCase().replace('dusun ', '').trim();
    return cleanItem === cleanFilter;
  };

  // Filtered List
  const filteredRt = rtList.filter(r => {
    const matchSearch =
      r.nama_rt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.kode_rt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.ketua_rt && r.ketua_rt.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchDusun = matchDusunName(r.dusun, selectedDusun);
    return matchSearch && matchDusun;
  });

  const handleOpenAdd = () => {
    setEditingRt(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (rt) => {
    setEditingRt(rt);
    setModalOpen(true);
  };

  const handleDelete = (id, nama) => {
    if (window.confirm(`Yakin ingin menghapus data unit "${nama}"? Riwayat transaksi terkait mungkin ikut terhapus.`)) {
      deleteRt(id);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Kode RT', 'Nama RT', 'Dusun', 'RW', 'RT', 'Ketua RT', 'Kontak HP', 'Total Sampah (kg)', 'Saldo Kas (Rp)'];
    const rows = filteredRt.map(r => [
      r.kode_rt,
      r.nama_rt,
      r.dusun,
      r.rw,
      r.rt,
      r.ketua_rt || '',
      r.kontak || r.no_telepon || '',
      r.total_sampah_terkumpul_kg || 0,
      r.saldo_kas || 0
    ]);
    exportToCSV(`Data_Kas_RT_Mekarjaya_${new Date().toISOString().slice(0, 10)}`, rows, headers);
  };

  const handleExportPDF = () => {
    exportRtPDF(filteredRt);
  };

  const totalSaldoSemua = filteredRt.reduce((acc, r) => acc + (parseFloat(r.saldo_kas) || 0), 0);
  const totalSampahSemua = filteredRt.reduce((acc, r) => acc + (parseFloat(r.total_sampah_terkumpul_kg) || 0), 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Data RT & Tabungan Kas Warga
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pengelolaan unit RT penerima alokasi hasil penjualan sampah terpilah 4 wadah Bank Sampah Aktif
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Ekspor CSV</span>
          </button>
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Ekspor PDF</span>
          </button>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Unit RT</span>
          </button>
        </div>
      </div>

      {/* Summary Mini Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Total Unit RT Terdaftar</span>
            <span className="text-xl font-extrabold text-slate-900">{rtList.length} RT</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Total Saldo Kas Terhimpun</span>
            <span className="text-xl font-extrabold text-emerald-800">{formatRupiah(totalSaldoSemua)}</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Total Sampah Terkumpul</span>
            <span className="text-xl font-extrabold text-slate-900">{formatWeight(totalSampahSemua)}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Nama RT, Kode, atau Ketua RT..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        {/* Dusun Filter */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedDusun('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedDusun === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Dusun ({rtList.length})
          </button>
          {DUSUN_LIST.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDusun(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedDusun === d
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              {d.replace('Dusun ', '')} ({rtList.filter(r => matchDusunName(r.dusun, d)).length})
            </button>
          ))}
        </div>
      </div>

      {/* Table of RT */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Kode RT</th>
                <th className="py-3.5 px-4">Nama Unit RT</th>
                <th className="py-3.5 px-4">Wilayah Dusun & RW</th>
                <th className="py-3.5 px-4">Ketua RT / Kontak</th>
                <th className="py-3.5 px-4 text-right">Sampah Terkumpul</th>
                <th className="py-3.5 px-4 text-right">Saldo Kas RT</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredRt.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                    {r.kode_rt}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{r.nama_rt}</div>
                    <div className="text-[11px] text-slate-400">RT {r.rt} / RW {r.rw}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-semibold">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {r.dusun}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    <div className="font-medium text-slate-800">{r.ketua_rt || '-'}</div>
                    {(r.kontak || r.no_telepon) && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {r.kontak || r.no_telepon}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-700 font-sans">
                    {formatWeight(r.total_sampah_terkumpul_kg || 0)}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-emerald-800 font-sans text-sm">
                    {formatRupiah(r.saldo_kas)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setCardModalRt(r)}
                        title="Cetak Kartu Informasi Kas RT"
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(r)}
                        title="Edit Data RT"
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id, r.nama_rt)}
                        title="Hapus Unit RT"
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition"
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

        {filteredRt.length === 0 && (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <Building2 className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-semibold">Tidak ada data RT yang sesuai dengan filter pencarian.</p>
          </div>
        )}
      </div>

      {/* Add / Edit RT Modal */}
      <NasabahModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingNasabah={editingRt}
      />

      {/* Digital Card Modal */}
      <NasabahCardModal
        isOpen={Boolean(cardModalRt)}
        onClose={() => setCardModalRt(null)}
        nasabah={cardModalRt}
      />
    </div>
  );
};
