// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Seed data untuk Jabatan
  const jabatan = await prisma.jabatan.createMany({
    data: [
      { id: 1, nama: 'KETUA', level: 1, bidang: null, parentId: null },
      { id: 2, nama: 'WAKET 1', level: 2, bidang: 'Bidang 1', parentId: 1 },
      { id: 3, nama: 'WAKET 2', level: 2, bidang: 'Bidang 2', parentId: 1 },
      { id: 4, nama: 'KETUA JURUSAN', level: 3, bidang: 'Bidang 1', parentId: 2 },
      { id: 5, nama: 'KABAG LP3M', level: 3, bidang: 'Bidang 1', parentId: 2 },
      { id: 6, nama: 'KABAG KEMAHASISWAAN DAN PUSAT KARIR & ALUMNI', level: 3, bidang: 'Bidang 1', parentId: 2 },
      { id: 7, nama: 'KABAG UMUM', level: 3, bidang: 'Bidang 2', parentId: 3 },
      { id: 8, nama: 'KABAG HUMAS, KERJASAMA DAN PUBLIKASI', level: 3, bidang: 'Bidang 2', parentId: 3 },
      { id: 9, nama: 'KABAG SISFO DAN MAINTENANCE', level: 3, bidang: 'Bidang 2', parentId: 3 },
      { id: 10, nama: 'UNIT BISNIS', level: 3, bidang: 'Bidang 2', parentId: 3 },
      { id: 11, nama: 'KETUA PRODI TI', level: 4, bidang: 'Bidang 1', parentId: 4 },
      { id: 12, nama: 'KETUA PRODI MI', level: 4, bidang: 'Bidang 1', parentId: 4 },
      { id: 13, nama: 'KABAG ADMINISTRASI AKADEMIK', level: 4, bidang: 'Bidang 1', parentId: 4 },
      { id: 14, nama: 'KABAG PERPUSTAKAAN & KEARSIPAN', level: 4, bidang: 'Bidang 1', parentId: 4 },
      { id: 15, nama: 'KASUBAG KEPEGAWAIAN', level: 4, bidang: 'Bidang 2', parentId: 7 },
      { id: 16, nama: 'KASUBAG KEUANGAN', level: 4, bidang: 'Bidang 2', parentId: 7 },
      { id: 17, nama: 'KASUBAG SARPRAS', level: 4, bidang: 'Bidang 2', parentId: 7 },
      { id: 18, nama: 'KASUBAG ADMINISTRASI UMUM', level: 4, bidang: 'Bidang 2', parentId: 7 },
      { id: 19, nama: 'KASUBAG HUMAS', level: 4, bidang: 'Bidang 2', parentId: 8 },
      { id: 20, nama: 'KASUBAG KERJASAMA', level: 4, bidang: 'Bidang 2', parentId: 8 },
      { id: 21, nama: 'KASUBAG PROMOSI DAN PUBLIKASI', level: 4, bidang: 'Bidang 2', parentId: 8 },
      { id: 22, nama: 'KEPALA LAB', level: 4, bidang: 'Bidang 2', parentId: 9 },
      { id: 23, nama: 'KASUBAG SISFO', level: 4, bidang: 'Bidang 2', parentId: 9 },
    ],
  });

  console.log('Seed data berhasil ditambahkan:', { jabatan});
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });