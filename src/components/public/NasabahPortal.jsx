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
  ChevronUp,
  Building2,
  Phone,
  CheckCircle2,
  Coins
} from 'lucide-react';
import { useBankSampah } from '../../context/BankSampahContext';
import { formatRupiah, formatWeight, formatDate } from '../../lib/utils';
import { exportTransaksiPDF } from '../../lib/exportUtils';
import { ReceiptModal } from '../common/ReceiptModal';
import { Select } from '../ui/Select';

export const NasabahPortal = ({ initialSearch = '' }) => {
  const { rtList, transaksiList, findRtByIdOrKode } = useBankSampah();
  const [selectedRtId, setSelectedRtId] = useState(rtList[0]?.id || 1);
  const [showBalance, setShowBalance] = useState(true);
  const [txFilter, setTxFilter] = useState('all'); // all, penjualan, penyaluran
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState(null);
  const [expandedTxId, setExpandedTxId] = useState(null);

  useEffect(() => {
    if (initialSearch) {
      const found = findRtByIdOrKode(initialSearch);
      if (found) setSelectedRtId(found.id);
    } else if (rtList.length > 0 && !selectedRtId) {
      setSelectedRtId(rtList[0].id);
    }
  }, [initialSearch, rtList]);

  const selectedRt = rtList.find(r => r.id === Number(selectedRtId)) || rtList[0];

  // Filter transactions for selected RT
  const rtTx = selectedRt
    ? transaksiList.filter(t => t.rt_id === selectedRt.id)
    : [];

  const filteredTx = rtTx.filter(t => {
    if (txFilter === 'all') return true;
    if (txFilter === 'penjualan') return t.jenis === 'penjualan' || t.jenis === 'setor';
    if (txFilter === 'penyaluran') return t.jenis === 'penyaluran' || t.jenis === 'tarik';
    return true;
  });

  const totalPenjualanKg = rtTx
    .filter(t => t.jenis === 'penjualan' || t.jenis === 'setor')
    .reduce((acc, curr) => acc + (parseFloat(curr.total_berat_kg) || 0), 0);

  const totalPenyaluranNominal = rtTx
    .filter(t => t.jenis === 'penyaluran' || t.jenis === 'tarik')
    .reduce((acc, curr) => acc + (parseFloat(curr.total_nominal) || 0), 0);

  const handleExportStatement = () => {
    if (!selectedRt) return;
    exportTransaksiPDF(rtTx, `Buku Kas Tabungan - ${selectedRt.nama_rt} (${selectedRt.dusun})`);
  };

  const rtOptions = rtList.map(r => ({
    value: r.id,
    label: `${r.nama_rt} (${r.dusun})`,
    sublabel: `Ketua RT: ${r.ketua_rt} • Saldo: ${formatRupiah(r.saldo_kas)}`,
    badge: r.kode_rt
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2 sm:space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
          <Wallet className="w-3.5 h-3.5" />
          <span>Transparansi Kas & Tabungan Warga</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
          Buku Tabungan Kas RT - Bank Sampah Aktif Desa Mekarjaya
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Inisiatif <strong>Bank Sampah Aktif Desa Mekarjaya</strong>. Warga tidak perlu mendaftar buku rekening individu. Hasil penjualan sampah dari 4 wadah terpilah masuk secara transparan ke kas tabungan RT masing-masing.
        </p>
      </div>

      {/* Select RT Selector */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Pilih Lingkungan RT Anda untuk Melihat Saldo & Mutasi Kas:
        </label>
        
        <Select
          value={selectedRtId}
          onChange={(val) => setSelectedRtId(val)}
          options={rtOptions}
          placeholder="Pilih RT..."
          size="lg"
        />

        {/* Quick RT chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-[11px] text-slate-400 font-semibold mr-1">Pilihan Cepat:</span>
          {rtList.map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => setSelectedRtId(r.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                selectedRt?.id === r.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r.nama_rt} ({r.dusun.replace('Dusun ', '')})
            </button>
          ))}
        </div>
      </div>

      {/* Result Section */}
      {selectedRt && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Cards: Saldo Kas RT + Profil RT */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
            {/* Balance Card */}
            <div className="md:col-span-6 bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-800 rounded-3xl p-6 sm:p-7 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-10 pointer-events-none">
                <Wallet className="w-56 h-56 text-white" />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 flex items-center gap-1.5">
                    <Wallet className="w-4 h-4" />
                    <span>Saldo Kas Tabungan RT Saat Ini</span>
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
                  <div className="text-2xl sm:text-4xl font-black tracking-tight font-sans truncate">
                    {showBalance ? formatRupiah(selectedRt.saldo_kas) : 'Rp ••••••••'}
                  </div>
                  <p className="text-xs text-emerald-200 mt-1">
                    Dana kas murni dari hasil pemilahan & penjualan sampah Bank Sampah Aktif
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs">
                <div>
                  <span className="text-emerald-300 block text-[10px] uppercase">Kode Wilayah</span>
                  <span className="font-mono font-bold text-sm tracking-wider">{selectedRt.kode_rt}</span>
                </div>
                <div className="text-right">
                  <span className="text-emerald-300 block text-[10px] uppercase">Total Sampah Terjual</span>
                  <span className="font-bold text-sm">{formatWeight(selectedRt.total_sampah_terkumpul_kg || totalPenjualanKg)}</span>
                </div>
              </div>
            </div>

            {/* RT Profile Details */}
            <div className="md:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Informasi Wilayah RT
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Bank Sampah Aktif</span>
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900">{selectedRt.nama_rt}</h3>

                <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Wilayah Dusun</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span className="truncate">{selectedRt.dusun}</span>
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Ketua RT / Pengurus</span>
                    <span className="font-bold text-slate-800 block mt-0.5 truncate">{selectedRt.ketua_rt}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Kontak Pengurus</span>
                    <span className="font-bold text-slate-800 block mt-0.5 truncate">{selectedRt.kontak || '-'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Dana Tersalurkan</span>
                    <span className="font-bold text-amber-700 block mt-0.5">{formatRupiah(totalPenyaluranNominal)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleExportStatement}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs transition"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Cetak Buku Kas RT (PDF)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mutation History Feed */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                  Riwayat Mutasi Kas {selectedRt.nama_rt}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Catatan transparan uang masuk dari penjualan 4 sampah terpilah dan penyaluran dana kas warga
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
                  Semua ({rtTx.length})
                </button>
                <button
                  onClick={() => setTxFilter('penjualan')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    txFilter === 'penjualan' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-emerald-700'
                  }`}
                >
                  Penjualan Sampah (+)
                </button>
                <button
                  onClick={() => setTxFilter('penyaluran')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    txFilter === 'penyaluran' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600 hover:text-amber-700'
                  }`}
                >
                  Penyaluran Kas (-)
                </button>
              </div>
            </div>

            {/* Transaction List */}
            {filteredTx.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {filteredTx.map((tx) => {
                  const isPenjualan = tx.jenis === 'penjualan' || tx.jenis === 'setor';
                  const isExpanded = expandedTxId === tx.id;

                  return (
                    <div key={tx.id} className="py-4 first:pt-0 last:pb-0 space-y-2.5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                            isPenjualan ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {isPenjualan ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-xs sm:text-sm text-slate-800 font-mono">
                                {tx.kode_transaksi}
                              </span>
                              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                isPenjualan ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {isPenjualan ? 'Penjualan Sampah' : 'Penyaluran Kas'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(tx.created_at)}
                              </span>
                              {isPenjualan && tx.total_berat_kg > 0 && (
                                <span>• {formatWeight(tx.total_berat_kg)}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className={`text-sm sm:text-base font-black font-sans ${
                            isPenjualan ? 'text-emerald-700' : 'text-amber-700'
                          }`}>
                            {isPenjualan ? '+' : '-'} {formatRupiah(tx.total_nominal)}
                          </div>
                          <div className="flex items-center justify-end gap-1 mt-1">
                            <button
                              onClick={() => setSelectedTxForReceipt({ ...tx, rt: selectedRt })}
                              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-0.5"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Bukti</span>
                            </button>
                            {isPenjualan && tx.items && tx.items.length > 0 && (
                              <button
                                onClick={() => setExpandedTxId(isExpanded ? null : tx.id)}
                                className="text-xs font-semibold text-emerald-600 hover:text-emerald-800 flex items-center ml-1"
                              >
                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Item Details */}
                      {isExpanded && tx.items && tx.items.length > 0 && (
                        <div className="bg-slate-50 rounded-2xl p-3 text-xs space-y-1.5 border border-slate-100 mt-2 ml-0 sm:ml-10">
                          <div className="font-bold text-[11px] text-slate-700 mb-1">Rincian Timbangan dari 4 Wadah Terpilah:</div>
                          {tx.items.map((it, idx) => (
                            <div key={idx} className="flex items-center justify-between text-slate-600 gap-2">
                              <span className="truncate">• {it.nama_kategori} ({formatWeight(it.berat_kg)})</span>
                              <span className="font-bold text-slate-800 flex-shrink-0">{formatRupiah(it.subtotal)}</span>
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
                <p className="text-xs text-slate-500 font-medium">Belum ada riwayat transaksi kas pada filter ini.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Digital Receipt Modal */}
      {selectedTxForReceipt && (
        <ReceiptModal
          isOpen={Boolean(selectedTxForReceipt)}
          onClose={() => setSelectedTxForReceipt(null)}
          transaksi={selectedTxForReceipt}
          nasabah={selectedTxForReceipt?.rt || selectedRt}
        />
      )}
    </div>
  );
};
