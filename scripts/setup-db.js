import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env if present
const envPath = path.join(__dirname, '..', '.env');
let databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
  if (match) {
    databaseUrl = match[1].trim();
  }
}

async function runSchema() {
  if (!databaseUrl) {
    console.error('❌ Error: DATABASE_URL tidak ditemukan di file .env atau environment variables!');
    console.log('\n💡 Cara menambahkan DATABASE_URL di .env:');
    console.log('1. Buka Supabase Dashboard > Project Settings > Database');
    console.log('2. Di bagian "Connection string" > pilih "URI"');
    console.log('3. Tambahkan ke .env: DATABASE_URL=postgresql://postgres.xxx:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:65432/postgres');
    console.log('4. Jalankan kembali: node scripts/setup-db.js\n');
    process.exit(1);
  }

  const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql');
  if (!fs.existsSync(schemaPath)) {
    console.error(`❌ File schema tidak ditemukan di: ${schemaPath}`);
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(schemaPath, 'utf8');
  console.log('🔌 Menghubungkan ke database Supabase PostgreSQL...');

  const client = new pg.Client({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('✅ Berhasil terhubung ke Supabase!');
    console.log('🚀 Menjalankan skrip schema.sql (Tabel, Trigger, RLS, Seed Data)...');

    await client.query(sqlContent);

    console.log('\n🎉 =======================================================');
    console.log('✅ SUKSES: Seluruh tabel, trigger saldo, RLS policies,');
    console.log('   dan seed data Desa Mekarjaya berhasil dibuat di Supabase!');
    console.log('🎉 =======================================================\n');
  } catch (err) {
    console.error('❌ Gagal menjalankan skrip SQL:', err.message);
  } finally {
    await client.end();
  }
}

runSchema();
