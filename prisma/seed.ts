import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Update data untuk Bidang
  const bidangData = [
    { id: 1, nama: 'SEMUA_BIDANG' }, // For admin and ketua only
    { id: 2, nama: 'BIDANG_1' },     // For Waket 1 and related positions
    { id: 3, nama: 'BIDANG_2' },     // For Waket 2 and related positions
  ];

  // Loop untuk update bidang
  for (const data of bidangData) {
    await prisma.bidang.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }
  
  const jabatanData = [
    { id: 1, nama: 'ADMIN', role: 'Admin', bidang_id: 1, parent_id: null },
    // Ketua (Pimpinan Tertinggi)
    { id: 2, nama: 'KETUA', role: 'Ketua', bidang_id: 1, parent_id: null },

    // Waket 1 (Memegang BIDANG_1)
    { id: 3, nama: 'WAKET 1', role: 'Waket_1', bidang_id: 2, parent_id: 2 },

    // Jabatan di bawah Waket 1 (BIDANG_1)
    // a. Ketua Jurusan
    { id: 4, nama: 'KETUA JURUSAN', role: 'Kabag', bidang_id: 2, parent_id: 3 },
      // i. Ketua Prodi TI
      { id: 5, nama: 'KETUA PRODI TI', role: 'Staff_Kabag', bidang_id: 2, parent_id: 4 },
      // ii. Ketua Prodi MI
      { id: 6, nama: 'KETUA PRODI MI', role: 'Staff_Kabag', bidang_id: 2, parent_id: 4 },
      // iii. Kabag Administrasi Akademik
      { id: 7, nama: 'KABAG ADMINISTRASI AKADEMIK', role: 'Staff_Kabag', bidang_id: 2, parent_id: 4 },
      // iv. Kabag Perpustakaan & Kearsipan
      { id: 8, nama: 'KABAG PERPUSTAKAAN & KEARSIPAN', role: 'Staff_Kabag', bidang_id: 2, parent_id: 4 },
    // b. Kabag LP3M
    { id: 9, nama: 'KABAG LP3M', role: 'Kabag', bidang_id: 2, parent_id: 3 },
    // c. Kabag Kemahasiswaan dan Pusat Karir & Alumni
    { id: 10, nama: 'KABAG KEMAHASISWAAN DAN PUSAT KARIR & ALUMNI', role: 'Kabag', bidang_id: 2, parent_id: 3 },

    // Waket 2 (Memegang BIDANG_2)
    { id: 11, nama: 'WAKET 2', role: 'Waket_2', bidang_id: 3, parent_id: 2 },

    // Jabatan di bawah Waket 2 (BIDANG_2)
    // a. Kabag Umum
    { id: 12, nama: 'KABAG UMUM', role: 'Kabag', bidang_id: 3, parent_id: 11 },
      // i. Kasubag Kepegawaian
      { id: 13, nama: 'KASUBAG KEPEGAWAIAN', role: 'Staff_Kabag', bidang_id: 3, parent_id: 12 },
      // ii. Kasubag Keuangan
      { id: 14, nama: 'KASUBAG KEUANGAN', role: 'Staff_Kabag', bidang_id: 3, parent_id: 12 },
      // iii. Kasubag Sarpras
      { id: 15, nama: 'KASUBAG SARPRAS', role: 'Staff_Kabag', bidang_id: 3, parent_id: 12 },
      // iv. Kasubag Administrasi Umum
      { id: 16, nama: 'KASUBAG ADMINISTRASI UMUM', role: 'Staff_Kabag', bidang_id: 3, parent_id: 12 },
    // b. Kabag Humas, Kerjasama dan Publikasi
    { id: 17, nama: 'KABAG HUMAS, KERJASAMA DAN PUBLIKASI', role: 'Kabag', bidang_id: 3, parent_id: 11 },
      // i. Kasubag Humas
      { id: 18, nama: 'KASUBAG HUMAS', role: 'Staff_Kabag', bidang_id: 3, parent_id: 17 },
      // ii. Kasubag Kerjasama
      { id: 19, nama: 'KASUBAG KERJASAMA', role: 'Staff_Kabag', bidang_id: 3, parent_id: 17 },
      // iii. Kasubag Promosi dan Publikasi
      { id: 20, nama: 'KASUBAG PROMOSI DAN PUBLIKASI', role: 'Staff_Kabag', bidang_id: 3, parent_id: 17 },
    // c. Kabag SISFO dan Maintenance
    { id: 21, nama: 'KABAG SISFO DAN MAINTENANCE', role: 'Kabag', bidang_id: 3, parent_id: 11 },
      // i. Kepala Lab
      { id: 22, nama: 'KEPALA LAB', role: 'Staff_Kabag', bidang_id: 3, parent_id: 21 },
      // ii. Kasubag SISFO
      { id: 23, nama: 'KASUBAG SISFO', role: 'Staff_Kabag', bidang_id: 3, parent_id: 21 },
    // d. Unit Bisnis
    { id: 24, nama: 'UNIT BISNIS', role: 'Kabag', bidang_id: 3, parent_id: 11 },
  ];

  // Loop untuk update jabatan
  for (const data of jabatanData) {
    await prisma.jabatan.upsert({
      where: { id: data.id },
      update: {
        nama: data.nama,
        role: data.role as 'Admin' | 'Ketua' | 'Waket_1' | 'Kabag' | 'Staff_Kabag' | 'Waket_2',
        bidang_id: data.bidang_id,
        parent_id: data.parent_id,
      },
      create: {
        id: data.id,
        nama: data.nama,
        role: data.role as 'Admin' | 'Ketua' | 'Waket_1' | 'Kabag' | 'Staff_Kabag' | 'Waket_2',
        bidang_id: data.bidang_id,
        parent_id: data.parent_id,
      },
    });
  }


}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });