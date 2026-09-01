import React, { useState } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw, 
  Save, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { 
  supabaseUrl, 
  supabaseAnonKey, 
  saveSupabaseConfig, 
  clearSupabaseConfig, 
  testSupabaseConnection 
} from '../../lib/supabase';
import { useBankSampah } from '../../context/BankSampahContext';

export const SupabaseConfigModal = ({ isOpen, onClose }) => {
  const { isSupabase, loadData, resetToSampleData, showToast } = useBankSampah();

  const [url, setUrl] = useState(localStorage.getItem('SI_BSDES_SUPABASE_URL') || supabaseUrl || '');
  const [anonKey, setAnonKey] = useState(localStorage.getItem('SI_BSDES_SUPABASE_ANON_KEY') || supabaseAnonKey || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!url.trim() || !anonKey.trim()) {
      setTestResult({ success: false, message: 'URL dan Anon Key wajib diisi untuk pengujian.' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    const result = await testSupabaseConnection(url.trim(), anonKey.trim());
    setTesting(false);
    setTestResult(result);
  };

  const handleSave = () => {
    if (url && anonKey) {
      saveSupabaseConfig(url, anonKey);
      showToast('Konfigurasi Supabase berhasil disimpan! Memuat data...', 'success');
      loadData();
      onClose();
      window.location.reload();
    }
  };

  const handleResetToDemo = () => {
    clearSupabaseConfig();
    resetToSampleData();
    setUrl('');
    setAnonKey('');
    setTestResult(null);
    showToast('Beralih ke Mode Demo Lokal Mekarjaya.', 'info');
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/30 flex items-center justify-center">
              <Database className="w-4 h-4 text-blue-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">Pengaturan Koneksi Supabase</h3>
              <p className="text-[10px] text-blue-200">PostgreSQL Backend & Realtime Auth</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Status Chip */}
          <div className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
            isSupabase ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isSupabase ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="font-bold">
                Status Saat Ini: {isSupabase ? 'Supabase Cloud Database Terhubung' : 'Mode Demo Lokal (LocalStorage)'}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Anda dapat menghubungkan database Supabase Anda sendiri dengan memasukkan <strong>Project URL</strong> dan <strong>Anon Public Key</strong> dari menu <em>Project Settings &gt; API</em> di dashboard Supabase.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Supabase Project URL (https://xyz.supabase.co)
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://abcdefghijklm.supabase.co"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Supabase Anon Public API Key (eyJh...)
            </label>
            <textarea
              rows="3"
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Test result message */}
          {testResult && (
            <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
              testResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {testResult.success ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              <span>{testResult.message}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Menguji...' : 'Uji Koneksi'}</span>
            </button>

            <button
              type="button"
              onClick={handleResetToDemo}
              className="px-3 py-2 rounded-xl text-rose-700 hover:bg-rose-50 text-xs font-semibold transition flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ke Demo Lokal</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={!url || !anonKey}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Simpan & Hubungkan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
