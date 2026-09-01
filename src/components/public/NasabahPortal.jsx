import React, { useState, useEffect } from 'react';
import { 
  Search, 
  User, 
  CreditCard, 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Eye, 
  EyeOff, 
  Printer, 
  Award, 
  Calendar, 
  FileText, 
  AlertCircle, 
  CheckCircle2,
  Scale,
  MapPin,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';
import { formatRupiah, formatWeight, formatDate } from '../../lib/utils';
import { exportTransaksiPDF } from '../../lib/exportUtils';
import { ReceiptModal } from '../common/ReceiptModal';

export const NasabahPortal = ({ initialSearch = '' }) => {
  const { nasabahList, transaksiList, findNasabahByNikOrRekening } = useBankSampah();
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [selectedNasabah, setSelectedNasabah] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [txFilter, setTxFilter] = useState('all'); // all, setor, tarik
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState(null);
  const [expandedTxId, setExpandedTxId] = useState(null);

  useEffect(() => {
    if (initialSearch) {
      handleSearch(initialSearch);
    }
  }, [initialSearch]);

  const handleSearch = (query) => {
    const q = query || searchInput;
    if (!q.trim()) return;

    setHasSearched(true);
    const found = findNasabahByNikOrRekening(q);
    setSelectedNasabah(found || null);
  };

  // Filter transactions for selected nasabah
  const nasabahTx = selectedNasabah
    ? transaksiList.filter(t => t.nasabah_id === selectedNasabah.id)
    : [];

  const filteredTx = nasabahTx.filter(t => {
    if (txFilter === 'all') return true;
    return t.jenis === txFilter;
  });

  const totalSetoranKg = nasabahTx
    .filter(t => t.jenis === 'setor')
    .reduce((acc, curr) => acc + (parseFloat(curr.total_berat_kg) || 0), 0);

  const handleExportStatement = () => {
    if (!selectedNasabah) return;
    exportTransaksiPDF(nasabahTx, `Buku Tabungan - ${selectedNasabah.nama} (${selectedNasabah.no_rekening})`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Search Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <CreditCard className="w-3.5 h-3.5" />
          Buku Tabungan Digital Warga
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Cek Saldo & Mutasi Bank Sampah
        </h1>
        <p className="text-sm text-slate-600">
          Masukkan 16 digit Nomor Induk Kependudukan (NIK) atau Nomor Rekening Bank Sampah Anda untuk melihat saldo dan riwayat setoran secara instan.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Ketik 16 Digit NIK (contoh: 3208051204850001) atau No Rekening..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-sm text-slate-800 placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/30 transition flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Periksa Data</span>
          </button>
        </form>

        {/* Quick Sample Chips */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold">Coba NIK Warga:</span>
          {nasabahList.slice(0, 4).map(n => (
            <button
              key={n.id}
              type="button"
              onClick={() => {
                setSearchInput(n.nik);
                handleSearch(n.nik);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-mono transition"
            >
              {n.nama.split(' ')[0]} ({n.nik.slice(-4)})
            </button>
          ))}
        </div>
      </div>

      {/* Result Section */}
      {selectedNasabah ? (
        <div className="space-y-6 animate-fade-in">
          {/* Top Cards: Profile + Balance Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Balance Card */}
            <div className="md:col-span-6 bg-gradient-to-br from-emerald-700 via-emerald-800 to-green-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 pointer-events-none">
                <Wallet className="w-64 h-64 text-white" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 flex items-center gap-1.5">
                    <Wallet className="w-4 h-4" />
                    Saldo Tabungan Aktif
                  </span>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                    title={showBalance ? 'Sembunyikan Saldo' : 'Tampilkan Saldo'}
                  >
                    {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="mt-4">
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight font-sans">
                    {showBalance ? formatRupiah(selectedNasabah.saldo_aktif) : 'Rp ••••••••'}
                  </div>
                  <p className="text-xs text-emerald-200 mt-1">
                    Saldo dapat ditarik tunai sewaktu-waktu di pos bank sampah
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-emerald-300 block text-[10px]">No. Rekening</span>
                  <span className="font-mono font-bold text-sm tracking-wider">{selectedNasabah.no_rekening}</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-300 block text-[10px]">Total Sampah Terkumpul</span>
                  <span className="font-bold text-sm">{formatWeight(totalSetoranKg)}</span>
                </div>
              </div>
            </div>

            {/* Resident Profile Details */}
            <div className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Biodata Nasabah
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    <Award className="w-3.5 h-3.5" />
                    Nasabah Terverifikasi
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-slate-900">{selectedNasabah.nama}</h3>

                <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">NIK Kependudukan</span>
                    <span className="font-mono font-bold text-slate-800">{selectedNasabah.nik}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Wilayah Dusun</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {selectedNasabah.dusun}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Rukun Tetangga (RT/RW)</span>
                    <span className="font-bold text-slate-800">RT {selectedNasabah.rt} / RW {selectedNasabah.rw}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Kontak / No HP</span>
                    <span className="font-bold text-slate-800">{selectedNasabah.no_hp || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleExportStatement}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-sm transition"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  Cetak Buku Tabungan (PDF)
                </button>
              </div>
            </div>
          </div>

          {/* Mutation History Feed */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Riwayat Transaksi & Mutasi Tabungan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Daftar seluruh setoran penimbangan sampah dan penarikan tunai
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
                <button
                  onClick={() => setTxFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    txFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua ({nasabahTx.length})
                </button>
                <button
                  onClick={() => setTxFilter('setor')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    txFilter === 'setor' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-emerald-700'
                  }`}
                >
                  Setoran
                </button>
                <button
                  onClick={() => setTxFilter('tarik')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    txFilter === 'tarik' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-amber-700'
                  }`}
                >
                  Penarikan
                </button>
              </div>
            </div>

            {/* Transaction List */}
            {filteredTx.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {filteredTx.map((tx) => {
                  const isSetor = tx.jenis === 'setor';
                  const isExpanded = expandedTxId === tx.id;

                  return (
                    <div key={tx.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                            isSetor ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {isSetor ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-800 font-mono">
                                {tx.kode_transaksi}
                              </span>
                              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                isSetor ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {tx.jenis}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>{formatDate(tx.created_at, true)}</span>
                              {isSetor && tx.total_berat_kg > 0 && (
                                <span>• Total Berat: <strong className="text-slate-600">{formatWeight(tx.total_berat_kg)}</strong></span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex items-center gap-3">
                          <div>
                            <div className={`text-base font-extrabold font-sans ${
                              isSetor ? 'text-emerald-700' : 'text-amber-700'
                            }`}>
                              {isSetor ? '+' : '-'} {formatRupiah(tx.total_nominal)}
                            </div>
                            <p className="text-[10px] text-slate-400 truncate max-w-[160px]">
                              {tx.keterangan || (isSetor ? 'Setor sampah' : 'Tarik saldo')}
                            </p>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setSelectedTxForReceipt(tx)}
                              title="Lihat Nota Digital"
                              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            {isSetor && tx.items && tx.items.length > 0 && (
                              <button
                                onClick={() => setExpandedTxId(isExpanded ? null : tx.id)}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                                title="Rincian Sampah"
                              >
                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expandable Breakdown of Items */}
                      {isExpanded && tx.items && tx.items.length > 0 && (
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs space-y-2 animate-fade-in">
                          <div className="font-bold text-slate-600 uppercase text-[10px] tracking-wider mb-1">
                            Rincian Penimbangan per Kategori
                          </div>
                          <div className="space-y-1.5">
                            {tx.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-slate-700">
                                <span>• {item.nama_kategori}</span>
                                <div className="text-right font-mono">
                                  <span className="text-slate-500 mr-3">{item.berat_kg} kg @{formatRupiah(item.harga_per_kg)}</span>
                                  <span className="font-bold text-slate-900">{formatRupiah(item.subtotal)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 space-y-1">
                <FileText className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-semibold">Belum ada catatan transaksi pada filter ini.</p>
              </div>
            )}
          </div>
        </div>
      ) : hasSearched ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-4 animate-fade-in">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Nasabah Tidak Ditemukan</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Nomor NIK atau No Rekening <strong>"{searchInput}"</strong> belum terdaftar dalam basis data Bank Sampah Mekarjaya. Silakan hubungi pengurus Karang Taruna di dusun Anda untuk pendaftaran.
            </p>
          </div>
        </div>
      ) : null}

      {/* Digital Receipt Modal */}
      <ReceiptModal
        isOpen={Boolean(selectedTxForReceipt)}
        onClose={() => setSelectedTxForReceipt(null)}
        transaksi={selectedTxForReceipt}
        nasabah={selectedNasabah}
      />
    </div>
  );
};
