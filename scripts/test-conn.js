import { createClient } from '@supabase/supabase-js';

const url = 'https://agnfjisdxohqwlacptvr.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnbmZqaXNkeG9ocXdsYWNwdHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMzI0NDMsImV4cCI6MjA5ODgwODQ0M30.ZRVabfb_fEnmHUVxzfmLIPTaK1vS1YSfyLgFa1R22Io';

const supabase = createClient(url, key);

async function testAll() {
  console.log('🔍 Menguji koneksi database Supabase...');

  const [katRes, nasabahRes, txRes, logRes] = await Promise.all([
    supabase.from('kategori_sampah').select('*'),
    supabase.from('nasabah').select('*'),
    supabase.from('transaksi').select('*'),
    supabase.from('log_aliran_organik').select('*')
  ]);

  const report = {
    kategori: katRes.error ? { status: 'ERROR', msg: katRes.error.message } : { status: 'OK', count: katRes.data.length, sample: katRes.data.slice(0, 3) },
    nasabah: nasabahRes.error ? { status: 'ERROR', msg: nasabahRes.error.message } : { status: 'OK', count: nasabahRes.data.length, sample: nasabahRes.data.slice(0, 3) },
    transaksi: txRes.error ? { status: 'ERROR', msg: txRes.error.message } : { status: 'OK', count: txRes.data.length },
    logOrganik: logRes.error ? { status: 'ERROR', msg: logRes.error.message } : { status: 'OK', count: logRes.data.length, sample: logRes.data.slice(0, 2) }
  };

  console.log('Hasil Test:', JSON.stringify(report, null, 2));
}

testAll();
