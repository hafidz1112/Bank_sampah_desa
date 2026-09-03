import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  Edit, 
  Trash2, 
  CreditCard, 
  MapPin, 
  ChevronRight,
  Phone,
  FileSpreadsheet
} from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';
import { formatRupiah, formatDate, DUSUN_LIST } from '../../lib/utils';
import { exportToCSV, exportNasabahPDF } from '../../lib/exportUtils';
import { NasabahModal } from './NasabahModal';
import { NasabahCardModal } from './NasabahCardModal';

export const NasabahManagement = () => {
  const { nasabahList, deleteNasabah } = useBankSampah();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDusun, setSelectedDusun] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNasabah, setEditingNasabah] = useState(null);
  const [cardModalNasabah, setCardModalNasabah] = useState(null);

  const matchDusunName = (itemDusun, filterVal) => {
    if (!filterVal || filterVal === 'all') return true;
    if (!itemDusun) return false;
    const cleanItem = String(itemDusun).toLowerCase().replace('dusun ', '').trim();
    const cleanFilter = String(filterVal).toLowerCase().replace('dusun ', '').trim();
    return cleanItem === cleanFilter;
  };

  // Filtered List
  const filteredNasabah = nasabahList.filter(n => {
    const matchSearch =
      n.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.nik.includes(searchQuery) ||
      n.no_rekening.toLowerCase().includes(searchQuery.toLowerCase());

    const matchDusun = matchDusunName(n.dusun, selectedDusun);
    return matchSearch && matchDusun;
  });

  const handleOpenAdd = () => {
    setEditingNasabah(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (nasabah) => {
    setEditingNasabah(nasabah);
    setModalOpen(true);
  };

  const handleDelete = (id, nama) => {
    if (window.confirm(`Yakin ingin menghapus data nasabah "${nama}"? Riwayat transaksi mungkin terkait dengan nasabah ini.`)) {
      deleteNasabah(id);
    }
  };

  const handleExportCSV = () => {
    const headers = ['No Rekening', 'NIK', 'Nama Lengkap', 'Dusun', 'RW', 'RT', 'No HP', 'Saldo Aktif', 'Tanggal Terdaftar'];
    const rows = filteredNasabah.map(n => [
      n.no_rekening,
      n.nik,
      n.nama,
      n.dusun,
      n.rw,
      n.rt,
      n.no_hp || '',
      n.saldo_aktif,
      n.created_at || ''
    ]);
    exportToCSV(`Data_Nasabah_Mekarjaya_${new Date().toISOString().slice(0, 10)}`, rows, headers);
  };

  const handleExportPDF = () => {
    exportNasabahPDF(filteredNasabah);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Data Nasabah Bank Sampah Mekarjaya
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total {nasabahList.length} nasabah terdaftar di Dusun Cimenang, Ciganda, & Cimuda
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
            <UserPlus className="w-4 h-4" />
            <span>+ Tambah Nasabah</span>
          </button>
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
            placeholder="Cari Nama, NIK, atau No. Rek..."
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
            Semua Dusun ({nasabahList.length})
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
              {d.replace('Dusun ', '')} ({nasabahList.filter(n => matchDusunName(n.dusun, d)).length})
            </button>
          ))}
        </div>
      </div>

      {/* Table of Residents */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">No. Rekening</th>
                <th className="py-3.5 px-4">Nama & NIK</th>
                <th className="py-3.5 px-4">Wilayah Dusun</th>
                <th className="py-3.5 px-4">RT / RW</th>
                <th className="py-3.5 px-4">Kontak HP</th>
                <th className="py-3.5 px-4 text-right">Saldo Aktif</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredNasabah.map((n) => (
                <tr key={n.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                    {n.no_rekening}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{n.nama}</div>
                    <div className="font-mono text-[11px] text-slate-400">NIK: {n.nik}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-700 font-semibold">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {n.dusun}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    RT {n.rt} / RW {n.rw}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {n.no_hp ? (
                      <span className="inline-flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {n.no_hp}
                      </span>
                    ) : (
                      <span className="text-slate-300">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-extrabold text-slate-900 font-sans text-sm">
                    {formatRupiah(n.saldo_aktif)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setCardModalNasabah(n)}
                        title="Cetak Kartu Anggota"
                        className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(n)}
                        title="Edit Data"
                        className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(n.id, n.nama)}
                        title="Hapus Nasabah"
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

        {filteredNasabah.length === 0 && (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <Users className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-semibold">Tidak ada nasabah yang sesuai dengan filter pencarian.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      <NasabahModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingNasabah={editingNasabah}
      />

      {/* Digital Card Modal */}
      <NasabahCardModal
        isOpen={Boolean(cardModalNasabah)}
        onClose={() => setCardModalNasabah(null)}
        nasabah={cardModalNasabah}
      />
    </div>
  );
};
