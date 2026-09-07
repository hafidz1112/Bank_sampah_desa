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
import { Select } from '../ui/Select';

export const RiwayatTransaksi = () => {
  const { transaksiList, rtList } = useBankSampah();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all'); // all, penjualan, penyaluran
  const [dateFilter, setDateFilter] = useState('all'); // all, today, this-month
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState(null);
  const [expandedTxId, setExpandedTxId] = useState(null);

  // Filter logic
  const filtered = transaksiList.filter(tx => {
    const rtName = tx.rt_nama || tx.nasabah_nama || '';
    const rtKode = tx.rt_kode || tx.nasabah_no_rekening || '';
    const matchSearch =
      (tx.kode_transaksi && tx.kode_transaksi.toLowerCase().includes(searchQuery.toLowerCase())) ||
      rtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rtKode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.keterangan && tx.keterangan.toLowerCase().includes(searchQuery.toLowerCase()));

    const isPenjualan = tx.jenis === 'penjualan' || tx.jenis === 'setor';
    const isPenyaluran = tx.jenis === 'penyaluran' || tx.jenis === 'tarik';

    let matchType = true;
    if (selectedType === 'penjualan') matchType = isPenjualan;
    else if (selectedType === 'penyaluran') matchType = isPenyaluran;

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
  const totalNominalPenjualan = filtered
    .filter(t => t.jenis === 'penjualan' || t.jenis === 'setor')
    .reduce((acc, t) => acc + (parseFloat(t.total_nominal) || 0), 0);

  const totalNominalPenyaluran = filtered
    .filter(t => t.jenis === 'penyaluran' || t.jenis === 'tarik')
    .reduce((acc, t) => acc + (parseFloat(t.total_nominal) || 0), 0);

  const totalBerat = filtered
    .filter(t => t.jenis === 'penjualan' || t.jenis === 'setor')
    .reduce((acc, t) => acc + (parseFloat(t.total_berat_kg) || 0), 0);

  const handleExportCSV = () => {
    const headers = ['Kode Transaksi', 'Tanggal & Waktu', 'Unit RT', 'Jenis', 'Total Berat (Kg)', 'Total Nominal (Rp)', 'Keterangan'];
    const rows = filtered.map(t => [
      t.kode_transaksi,
      t.created_at,
      t.rt_nama || t.nasabah_nama || '',
      (t.jenis === 'penjualan' || t.jenis === 'setor') ? 'PENJUALAN' : 'PENYALURAN',
      t.total_berat_kg || 0,
      t.total_nominal,
      t.keterangan || ''
    ]);
    exportToCSV(`Jurnal_Kas_RT_Mekarjaya_${new Date().toISOString().slice(0, 10)}`, rows, headers);
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
            Buku Jurnal Mutasi Kas RT
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Rekapitulasi penjualan 4 wadah sampah RA (pemasukan) dan penyaluran dana kas tabungan warga RT (pengeluaran)
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
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Jumlah Transaksi</span>
          <div className="text-xl font-bold text-slate-900 mt-1">{filtered.length} Transaksi</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Sampah RA Terjual</span>
          <div className="text-xl font-bold text-slate-900 mt-1">{formatWeight(totalBerat)}</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-600 uppercase">Total Penjualan (Masuk Kas)</span>
          <div className="text-xl font-bold text-emerald-700 mt-1">+{formatRupiah(totalNominalPenjualan)}</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase">Total Penyaluran (Keluar Kas)</span>
          <div className="text-xl font-bold text-amber-700 mt-1">-{formatRupiah(totalNominalPenyaluran)}</div>
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
            placeholder="Cari Kode TRX, Unit RT, Dusun, atau Keterangan..."
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
              onClick={() => setSelectedType('penjualan')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedType === 'penjualan' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              Penjualan ({transaksiList.filter(t => t.jenis === 'penjualan' || t.jenis === 'setor').length})
            </button>
            <button
              onClick={() => setSelectedType('penyaluran')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedType === 'penyaluran' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              Penyaluran ({transaksiList.filter(t => t.jenis === 'penyaluran' || t.jenis === 'tarik').length})
            </button>
          </div>

          {/* Date Filter */}
          <div className="w-36">
            <Select
              value={dateFilter}
              onChange={(val) => setDateFilter(val)}
              options={[
                { value: 'all', label: 'Semua Waktu' },
                { value: 'today', label: 'Hari Ini' },
                { value: 'this-month', label: 'Bulan Ini' }
              ]}
              size="sm"
            />
          </div>
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
                <th className="py-3.5 px-4">Alokasi Unit RT</th>
                <th className="py-3.5 px-4">Jenis</th>
                <th className="py-3.5 px-4 text-right">Berat Terjual</th>
                <th className="py-3.5 px-4 text-right">Nominal Kas</th>
                <th className="py-3.5 px-4">Keterangan</th>
                <th className="py-3.5 px-4 text-center">Bukti</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((tx) => {
                const isPenjualan = tx.jenis === 'penjualan' || tx.jenis === 'setor';
                const isExpanded = expandedTxId === tx.id;
                const rtName = tx.rt_nama || tx.nasabah_nama || 'RT Mekarjaya';
                const rtKode = tx.rt_kode || tx.nasabah_no_rekening || '';

                return (
                  <React.Fragment key={tx.id}>
                    <tr className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 flex items-center gap-1.5">
                        {isPenjualan && tx.items && tx.items.length > 0 && (
                          <button
                            onClick={() => setExpandedTxId(isExpanded ? null : tx.id)}
                            className="p-1 rounded text-slate-400 hover:text-slate-600"
                            title="Tampilkan rincian wadah"
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
                        <div className="font-bold text-slate-900">{rtName}</div>
                        {rtKode && <div className="text-[10px] text-slate-400 font-mono">{rtKode}</div>}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isPenjualan ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isPenjualan ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          {isPenjualan ? 'Penjualan' : 'Penyaluran'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        {isPenjualan ? formatWeight(tx.total_berat_kg) : '-'}
                      </td>
                      <td className={`py-3 px-4 text-right font-extrabold font-sans text-sm ${
                        isPenjualan ? 'text-emerald-700' : 'text-amber-700'
                      }`}>
                        {isPenjualan ? '+' : '-'} {formatRupiah(tx.total_nominal)}
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                        {tx.keterangan || '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            const foundRt = rtList.find(r => r.id === (tx.rt_id || tx.nasabah_id));
                            setSelectedTxForReceipt({ ...tx, nasabah: foundRt, rt: foundRt });
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                          title="Lihat Bukti Transaksi"
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
                              Rincian 4 Wadah Sampah RA Terjual:
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                              {tx.items.map((item, idx) => (
                                <div key={idx} className="p-2 rounded-lg bg-white border border-emerald-200 flex justify-between items-center">
                                  <span className="font-semibold text-slate-700 truncate mr-2">{item.nama_kategori}</span>
                                  <span className="font-mono font-bold text-emerald-800 whitespace-nowrap">
                                    {item.berat_kg} kg • {formatRupiah(item.subtotal)}
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
