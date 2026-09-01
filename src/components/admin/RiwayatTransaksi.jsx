import React, { useState } from 'react';
import { 
  Receipt, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';
import { formatRupiah, formatWeight, formatDate } from '../../lib/utils';
import { exportToCSV, exportTransaksiPDF } from '../../lib/exportUtils';
import { ReceiptModal } from '../common/ReceiptModal';

export const RiwayatTransaksi = () => {
  const { transaksiList, nasabahList } = useBankSampah();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // all, setor, tarik
  const [dateFilter, setDateFilter] = useState('all'); // all, today, this-month
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState(null);
  const [expandedTxId, setExpandedTxId] = useState(null);

  // Filter logic
  const filtered = transaksiList.filter(tx => {
    const matchSearch =
      (tx.kode_transaksi && tx.kode_transaksi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tx.nasabah_nama && tx.nasabah_nama.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (tx.nasabah_no_rekening && tx.nasabah_no_rekening.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchType = selectedType === 'all' || tx.jenis === selectedType;

    let matchDate = true;
    if (dateFilter === 'today') {
      const today = new Date().toISOString().slice(0, 10);
      matchDate = tx.created_at?.startsWith(today);
    } else if (dateFilter === 'this-month') {
      const thisMonth = new Date().toISOString().slice(0, 7);
      matchDate = tx.created_at?.startsWith(thisMonth);
    }

    return matchSearch && matchType && matchDate;
  });

  // Calculate totals
  const totalNominal = filtered.reduce((acc, t) => acc + (parseFloat(t.total_nominal) || 0), 0);
  const totalBerat = filtered
    .filter(t => t.jenis === 'setor')
    .reduce((acc, t) => acc + (parseFloat(t.total_berat_kg) || 0), 0);

  const handleExportCSV = () => {
    const headers = ['Kode Transaksi', 'Tanggal & Waktu', 'Nama Nasabah', 'No Rekening', 'Jenis', 'Total Berat (Kg)', 'Total Nominal (Rp)', 'Keterangan'];
    const rows = filtered.map(t => [
      t.kode_transaksi,
      t.created_at,
      t.nasabah_nama,
      t.nasabah_no_rekening,
      t.jenis.toUpperCase(),
      t.total_berat_kg || 0,
      t.total_nominal,
      t.keterangan || ''
    ]);
    exportToCSV(`Jurnal_Transaksi_Mekarjaya_${new Date().toISOString().slice(0, 10)}`, rows, headers);
  };

  const handleExportPDF = () => {
    const label = dateFilter === 'today' ? 'Hari Ini' : dateFilter === 'this-month' ? 'Bulan Ini' : 'Semua Periode';
    exportTransaksiPDF(filtered, label);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Buku Jurnal Mutasi & Transaksi
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Rekapitulasi seluruh setoran sampah dan penarikan saldo warga Desa Mekarjaya
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
        </div>
      </div>

      {/* Summary Filter Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Jumlah Transaksi</span>
          <div className="text-xl font-bold text-slate-900 mt-1">{filtered.length} Transaksi</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Berat Disetor</span>
          <div className="text-xl font-bold text-emerald-700 mt-1">{formatWeight(totalBerat)}</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Perputaran Uang</span>
          <div className="text-xl font-bold text-blue-700 mt-1">{formatRupiah(totalNominal)}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari Kode TRX, Nama, No. Rek..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          {/* Type Filter */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedType === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Semua ({transaksiList.length})
            </button>
            <button
              onClick={() => setSelectedType('setor')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedType === 'setor' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Setoran ({transaksiList.filter(t => t.jenis === 'setor').length})
            </button>
            <button
              onClick={() => setSelectedType('tarik')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedType === 'tarik' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Penarikan ({transaksiList.filter(t => t.jenis === 'tarik').length})
            </button>
          </div>

          {/* Date Filter */}
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="p-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="all">Semua Waktu</option>
            <option value="today">Hari Ini</option>
            <option value="this-month">Bulan Ini</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Kode TRX</th>
                <th className="py-3.5 px-4">Waktu</th>
                <th className="py-3.5 px-4">Nasabah</th>
                <th className="py-3.5 px-4">Jenis</th>
                <th className="py-3.5 px-4 text-right">Berat (Kg)</th>
                <th className="py-3.5 px-4 text-right">Nominal (Rp)</th>
                <th className="py-3.5 px-4">Keterangan</th>
                <th className="py-3.5 px-4 text-center">Nota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((tx) => {
                const isSetor = tx.jenis === 'setor';
                const isExpanded = expandedTxId === tx.id;

                return (
                  <React.Fragment key={tx.id}>
                    <tr className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 flex items-center gap-1.5">
                        {isSetor && tx.items && tx.items.length > 0 && (
                          <button
                            onClick={() => setExpandedTxId(isExpanded ? null : tx.id)}
                            className="p-1 rounded text-slate-400 hover:text-slate-600"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        )}
                        <span>{tx.kode_transaksi}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {formatDate(tx.created_at, true)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{tx.nasabah_nama}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{tx.nasabah_no_rekening}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isSetor ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isSetor ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          {tx.jenis}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        {isSetor ? formatWeight(tx.total_berat_kg) : '-'}
                      </td>
                      <td className={`py-3 px-4 text-right font-bold font-sans text-sm ${
                        isSetor ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        {isSetor ? '+' : '-'} {formatRupiah(tx.total_nominal)}
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                        {tx.keterangan || '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            const foundNasabah = nasabahList.find(n => n.id === tx.nasabah_id);
                            setSelectedTxForReceipt({ ...tx, nasabah: foundNasabah });
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                          title="Lihat Struk"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>

                    {/* Expandable item details */}
                    {isExpanded && tx.items && tx.items.length > 0 && (
                      <tr className="bg-emerald-50/30">
                        <td colSpan="8" className="py-2.5 px-6 border-y border-emerald-100">
                          <div className="text-[11px] space-y-1">
                            <span className="font-bold text-emerald-900 block uppercase tracking-wider text-[9px]">
                              Rincian Timbangan Sampah:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {tx.items.map((item, idx) => (
                                <div key={idx} className="p-2 rounded-lg bg-white border border-emerald-200 flex justify-between">
                                  <span className="font-medium text-slate-700 truncate mr-2">{item.nama_kategori}</span>
                                  <span className="font-mono font-bold text-emerald-800 whitespace-nowrap">
                                    {item.berat_kg} kg = {formatRupiah(item.subtotal)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 space-y-2">
            <Receipt className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-xs font-semibold">Tidak ada transaksi ditemukan pada filter ini.</p>
          </div>
        )}
      </div>

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(selectedTxForReceipt)}
        onClose={() => setSelectedTxForReceipt(null)}
        transaksi={selectedTxForReceipt}
        nasabah={selectedTxForReceipt?.nasabah}
      />
    </div>
  );
};
