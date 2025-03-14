// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Seed data untuk Jabatan
  type Role = 'Admin' | 'Ketua' | 'Waket_1' | 'Kabag' | 'Staff_Kabag' | 'Waket_2';
  
  type Bidang = 'SEMUA_BIDANG' | 'BIDANG_1' | 'BIDANG_2';

  const jabatanData: { nama: string; role: Role; bidang: Bidang; parent_id: number | null }[] = [
    // Ketua (Pimpinan Tertinggi)

    { nama: 'ADMIN', role: 'Admin', bidang: 'SEMUA_BIDANG', parent_id: null },

    { nama: 'KETUA', role: 'Ketua', bidang: 'SEMUA_BIDANG', parent_id: null },

    // Waket 1 (Memegang BIDANG_1)
    { nama: 'WAKET 1', role: 'Waket_1', bidang: 'BIDANG_1', parent_id: 1 },

    // Jabatan di bawah Waket 1 (BIDANG_1)
    { nama: 'KETUA JURUSAN', role: 'Kabag', bidang: 'BIDANG_1', parent_id: 2 },
    { nama: 'KETUA PRODI TI', role: 'Staff_Kabag', bidang: 'BIDANG_1', parent_id: 3 },
    { nama: 'KETUA PRODI MI', role: 'Staff_Kabag', bidang: 'BIDANG_1', parent_id: 3 },
    { nama: 'KABAG ADMINISTRASI AKADEMIK', role: 'Kabag', bidang: 'BIDANG_1', parent_id: 3 },
    { nama: 'KABAG PERPUSTAKAAN & KEARSIPAN', role: 'Kabag', bidang: 'BIDANG_1', parent_id: 3 },
    { nama: 'KABAG LP3M', role: 'Kabag', bidang: 'BIDANG_1', parent_id: 2 },
    { nama: 'KABAG KEMAHASISWAAN DAN PUSAT KARIR & ALUMNI', role: 'Kabag', bidang: 'BIDANG_1', parent_id: 2 },

    // Waket 2 (Memegang BIDANG_2)
    { nama: 'WAKET 2', role: 'Waket_2', bidang: 'BIDANG_2', parent_id: 1 },

    // Jabatan di bawah Waket 2 (BIDANG_2)
    { nama: 'KABAG UMUM', role: 'Kabag', bidang: 'BIDANG_2', parent_id: 10 },
    { nama: 'KASUBAG KEPEGAWAIAN', role: 'Staff_Kabag', bidang: 'BIDANG_2', parent_id: 11 },
    { nama: 'KASUBAG KEUANGAN', role: 'Staff_Kabag', bidang: 'BIDANG_2', parent_id: 11 },
    { nama: 'KASUBAG SARPRAS', role: 'Staff_Kabag', bidang: 'BIDANG_2', parent_id: 11 },
    { nama: 'KASUBAG ADMINISTRASI UMUM', role: 'Staff_Kabag', bidang: 'BIDANG_2', parent_id: 11 },
    { nama: 'KABAG HUMAS, KERJASAMA DAN PUBLIKASI', role: 'Kabag', bidang: 'BIDANG_2', parent_id: 10 },
    { nama: 'KASUBAG HUMAS', role: 'Staff_Kabag', bidang: 'BIDANG_2', parent_id: 16 },
    { nama: 'KASUBAG KERJASAMA', role: 'Staff_Kabag', bidang: 'BIDANG_2', parent_id: 16 },
    { nama: 'KASUBAG PROMOSI DAN PUBLIKASI', role: 'Staff_Kabag', bidang: 'BIDANG_2', parent_id: 16 },
    { nama: 'KABAG SISFO DAN MAINTENANCE', role: 'Kabag', bidang: 'BIDANG_2', parent_id: 10 },
    { nama: 'KEPALA LAB', role: 'Staff_Kabag', bidang: 'BIDANG_2', parent_id: 20 },
    { nama: 'KASUBAG SISFO', role: 'Staff_Kabag', bidang: 'BIDANG_2', parent_id: 20 },
    { nama: 'UNIT BISNIS', role: 'Kabag', bidang: 'BIDANG_2', parent_id: 10 },
  ];

  // Loop untuk membuat jabatan
  for (const data of jabatanData) {
    await prisma.jabatan.create({
      data,
    });
  }

  // Ambil semua data jabatan yang telah di-seed
  const jabatan = await prisma.jabatan.findMany({
    include: {
      parent: true, // Sertakan data parent (jika ada)
      children: true, // Sertakan data children (jika ada)
    },
  });

  console.log('Seed data berhasil ditambahkan:', jabatan);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });