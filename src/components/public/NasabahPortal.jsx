import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Eye, 
  EyeOff, 
  Printer, 
  Award, 
  Calendar, 
  FileText, 
  Scale, 
  MapPin, 
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-6 sm:space-y-8">
      {/* Search Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
          <Wallet className="w-3.5 h-3.5" />
          <span>Buku Tabungan Digital Warga</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Cek Saldo & Mutasi Bank Sampah
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Masukkan 16 digit Nomor Induk Kependudukan (NIK) atau Nomor Rekening Bank Sampah Anda untuk melihat saldo dan riwayat setoran secara instan.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border border-slate-200 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex flex-col sm:flex-row gap-2.5 sm:gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Ketik 16 Digit NIK atau No Rekening..."
              className="w-full pl-10 sm:pl-12 pr-4 py-3 rounded-xl sm:rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 min-h-[44px]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl sm:rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Search className="w-4 h-4" />
            <span>Periksa Data</span>
          </button>
        </form>

        {/* Quick Sample Chips */}
        <div className="mt-3 sm:mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-500">
          <span className="font-semibold">Coba NIK Warga:</span>
          {nasabahList.slice(0, 4).map(n => (
            <button
              key={n.id}
              type="button"
              onClick={() => {
                setSearchInput(n.nik);
                handleSearch(n.nik);
              }}
              className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-mono text-[10px] sm:text-xs transition active:scale-95"
            >
              {n.nama.split(' ')[0]} ({n.nik.slice(-4)})
            </button>
          ))}
        </div>
      </div>

      {/* Result Section */}
      {selectedNasabah ? (
        <div className="space-y-5 sm:space-y-6 animate-fade-in">
          {/* Top Cards: Profile + Balance Card */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            {/* Balance Card */}
            <div className="md:col-span-6 bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-800 rounded-2xl sm:rounded-3xl p-5 sm:p-7 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 pointer-events-none">
                <Wallet className="w-56 h-56 text-white" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-200 flex items-center gap-1.5">
                    <Wallet className="w-4 h-4" />
                    <span>Saldo Tabungan Aktif</span>
                  </span>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white transition"
                    title={showBalance ? 'Sembunyikan Saldo' : 'Tampilkan Saldo'}
                  >
                    {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div className="mt-3 sm:mt-4">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-sans">
                    {showBalance ? formatRupiah(selectedNasabah.saldo_aktif) : 'Rp ••••••••'}
                  </div>
                  <p className="text-[11px] sm:text-xs text-emerald-200 mt-1">
                    Saldo dapat ditarik tunai sewaktu-waktu di pos bank sampah
                  </p>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 pt-3.5 sm:pt-4 border-t border-white/15 flex items-center justify-between text-xs">
                <div>
                  <span className="text-emerald-300 block text-[10px]">No. Rekening</span>
                  <span className="font-mono font-bold text-xs sm:text-sm tracking-wider">{selectedNasabah.no_rekening}</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-300 block text-[10px]">Total Sampah Terkumpul</span>
                  <span className="font-bold text-xs sm:text-sm">{formatWeight(totalSetoranKg)}</span>
                </div>
              </div>
            </div>

            {/* Resident Profile Details */}
            <div className="md:col-span-6 bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400">
                    Biodata Nasabah
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] sm:text-xs font-bold">
                    <Award className="w-3.5 h-3.5" />
                    <span>Warga Terdaftar</span>
                  </span>
                </div>

                <h3 className="text-lg sm:text-2xl font-bold text-slate-900 leading-snug">{selectedNasabah.nama}</h3>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-3 text-xs">
                  <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">NIK Kependudukan</span>
                    <span className="font-mono font-bold text-slate-800 text-[11px] sm:text-xs truncate block">{selectedNasabah.nik}</span>
                  </div>
                  <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Wilayah Dusun</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 text-[11px] sm:text-xs truncate">
                      <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">{selectedNasabah.dusun}</span>
                    </span>
                  </div>
                  <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Rukun Tetangga (RT/RW)</span>
                    <span className="font-bold text-slate-800 text-[11px] sm:text-xs">RT {selectedNasabah.rt} / RW {selectedNasabah.rw}</span>
                  </div>
                  <div className="p-2.5 sm:p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px]">Kontak / HP</span>
                    <span className="font-bold text-slate-800 text-[11px] sm:text-xs truncate block">{selectedNasabah.no_hp || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleExportStatement}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold text-xs shadow-xs transition"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Cetak Buku Tabungan (PDF)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mutation History Feed */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200 shadow-xs space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900">
                  Riwayat Mutasi Tabungan
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
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
                  Setoran (+)
                </button>
                <button
                  onClick={() => setTxFilter('tarik')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    txFilter === 'tarik' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-amber-700'
                  }`}
                >
                  Penarikan (-)
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
                    <div key={tx.id} className="py-3.5 sm:py-4 first:pt-0 last:pb-0 space-y-2.5">
                      <div className="flex items-center justify-between gap-2.5 sm:gap-4">
                        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 ${
                            isSetor ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {isSetor ? <ArrowDownLeft className="w-4 h-4 sm:w-5 sm:h-5" /> : <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-xs sm:text-sm text-slate-800 font-mono truncate">
                                {tx.kode_transaksi}
                              </span>
                              <span className={`text-[9px] sm:text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                isSetor ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {tx.jenis}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-400 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(tx.created_at)}
                              </span>
                              {isSetor && tx.total_berat_kg > 0 && (
                                <span>• {formatWeight(tx.total_berat_kg)}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className={`text-xs sm:text-base font-extrabold font-sans ${
                            isSetor ? 'text-emerald-700' : 'text-amber-700'
                          }`}>
                            {isSetor ? '+' : '-'} {formatRupiah(tx.total_nominal)}
                          </div>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <button
                              onClick={() => setSelectedTxForReceipt({ ...tx, nasabah: selectedNasabah })}
                              className="text-[10px] sm:text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
                            >
                              <FileText className="w-3 h-3" />
                              <span className="hidden sm:inline">Struk</span>
                            </button>
                            {isSetor && tx.items && tx.items.length > 0 && (
                              <button
                                onClick={() => setExpandedTxId(isExpanded ? null : tx.id)}
                                className="text-[10px] sm:text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center ml-1"
                              >
                                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Item Details */}
                      {isExpanded && tx.items && tx.items.length > 0 && (
                        <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-100 ml-10">
                          <div className="font-bold text-[11px] text-slate-700 mb-1">Rincian Timbangan Sampah:</div>
                          {tx.items.map((it, idx) => (
                            <div key={idx} className="flex items-center justify-between text-slate-600 text-[11px]">
                              <span>• {it.nama_kategori || 'Sampah'} ({formatWeight(it.berat_kg)})</span>
                              <span className="font-bold text-slate-800">{formatRupiah(it.subtotal)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">Belum ada riwayat transaksi pada filter ini.</p>
              </div>
            )}
          </div>
        </div>
      ) : hasSearched ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-2">
          <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Data Nasabah Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            NIK atau Nomor Rekening yang Anda masukkan belum terdaftar di Bank Sampah Desa Mekarjaya. Silakan hubungi petugas Karang Taruna di pos dusun untuk pendaftaran.
          </p>
        </div>
      ) : null}

      {/* Digital Receipt Modal */}
      {selectedTxForReceipt && (
        <ReceiptModal
          isOpen={Boolean(selectedTxForReceipt)}
          onClose={() => setSelectedTxForReceipt(null)}
          transaksi={selectedTxForReceipt}
          nasabah={selectedTxForReceipt?.nasabah}
        />
      )}
    </div>
  );
};
