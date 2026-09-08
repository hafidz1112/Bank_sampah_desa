import { createClient } from '@supabase/supabase-js';

const url = 'https://agnfjisdxohqwlacptvr.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnbmZqaXNkeG9ocXdsYWNwdHZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMyMzI0NDMsImV4cCI6MjA5ODgwODQ0M30.ZRVabfb_fEnmHUVxzfmLIPTaK1vS1YSfyLgFa1R22Io';

const supabase = createClient(url, key);

async function testAll() {
  console.log('🔍 Menguji koneksi database Supabase...');

  const [katRes, rtRes, txRes, detailRes] = await Promise.all([
    supabase.from('kategori_sampah').select('*'),
    supabase.from('tabungan_rt').select('*'),
    supabase.from('transaksi').select('*'),
    supabase.from('detail_setoran').select('*')
  ]);

  const report = {
    kategori_sampah: katRes.error ? { status: 'ERROR', msg: katRes.error.message } : { status: 'OK', count: katRes.data.length, sample: katRes.data.slice(0, 4) },
    tabungan_rt: rtRes.error ? { status: 'ERROR', msg: rtRes.error.message } : { status: 'OK', count: rtRes.data.length, sample: rtRes.data.slice(0, 3) },
    transaksi: txRes.error ? { status: 'ERROR', msg: txRes.error.message } : { status: 'OK', count: txRes.data.length },
    detail_setoran: detailRes.error ? { status: 'ERROR', msg: detailRes.error.message } : { status: 'OK', count: detailRes.data.length }
  };

  console.log('Hasil Test Koneksi Supabase:', JSON.stringify(report, null, 2));
}

testAll();
