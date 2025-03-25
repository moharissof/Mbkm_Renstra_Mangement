/* eslint-disable @typescript-eslint/no-require-imports */
const { Client } = require("pg");
require("dotenv").config(); // Load environment variables

// Fungsi untuk mengecek koneksi
async function checkConnection(connectionString, label) {
  const client = new Client({
    connectionString: connectionString,
  });

  try {
    await client.connect();
    console.log(`[${label}] Berhasil terhubung ke Supabase!`);

    const res = await client.query("SELECT NOW()");
    console.log(`[${label}] Waktu saat ini di database:`, res.rows[0].now);

    await client.end();
  } catch (error) {
    console.error(`[${label}] Gagal terhubung ke Supabase:`, error);
  }
}

// Jalankan pengecekan untuk kedua URL
(async () => {
  await checkConnection(process.env.DATABASE_URL, "DATABASE_URL (PgBouncer)");
  await checkConnection(process.env.DIRECT_URL, "DIRECT_URL (Direct)");
})();