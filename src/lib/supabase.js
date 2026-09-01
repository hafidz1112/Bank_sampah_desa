import { createClient } from '@supabase/supabase-js';

// Default / fallback keys from Vite environment variables or local storage
const getSupabaseConfig = () => {
  const customUrl = localStorage.getItem('SI_BSDES_SUPABASE_URL');
  const customAnonKey = localStorage.getItem('SI_BSDES_SUPABASE_ANON_KEY');

  const supabaseUrl = customUrl || import.meta.env.VITE_SUPABASE_URL || '';
  const supabaseAnonKey = customAnonKey || import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  return { supabaseUrl, supabaseAnonKey };
};

export const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

export const isSupabaseConfigured = () => {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl.startsWith('https://') && 
    supabaseAnonKey.length > 20
  );
};

export const getSupabaseClient = () => {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
  if (!isSupabaseConfigured()) {
    return null;
  }
  try {
    return createClient(supabaseUrl, supabaseAnonKey);
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
};

export const supabase = getSupabaseClient();

export const saveSupabaseConfig = (url, anonKey) => {
  if (url) localStorage.setItem('SI_BSDES_SUPABASE_URL', url.trim());
  if (anonKey) localStorage.setItem('SI_BSDES_SUPABASE_ANON_KEY', anonKey.trim());
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem('SI_BSDES_SUPABASE_URL');
  localStorage.removeItem('SI_BSDES_SUPABASE_ANON_KEY');
};

export const testSupabaseConnection = async (url, anonKey) => {
  try {
    const testClient = createClient(url, anonKey);
    const { data, error } = await testClient.from('kategori_sampah').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      // Table might not exist yet, let's test auth or health
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Koneksi ke Supabase berhasil terverifikasi!' };
  } catch (err) {
    return { success: false, message: err.message || 'Gagal terhubung ke URL Supabase' };
  }
};
