import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Seed data untuk Bidang
  const bidangData = [
    { id : 1 , nama: 'SEMUA_BIDANG'},
    { id : 2 , nama: 'BIDANG_1' },
    { id : 3 , nama: 'BIDANG_2'},
  ];

  // Loop untuk membuat bidang
  for (const data of bidangData) {
    await prisma.bidang.create({
      data,
    });
  }

  // Ambil semua data bidang yang telah di-seed
  const bidang = await prisma.bidang.findMany();
  console.log('Data bidang berhasil ditambahkan:', bidang);

  // Seed data untuk Jabatan
  const jabatanData = [
    // Admin (Tidak memiliki atasan dan tidak berada di bawah siapa-siapa)
    { id: 1, nama: 'ADMIN', role: 'Admin', bidang_id: 1, parent_id: null },

    // Ketua (Pimpinan Tertinggi)
    { id: 2, nama: 'KETUA', role: 'Ketua', bidang_id: 1,  parent_id: null },

    // Waket 1 (Memegang BIDANG_1)
    { id: 3, nama: 'WAKET 1', role: 'Waket_1', bidang_id: 1, parent_id: 2 },

    // Jabatan di bawah Waket 1 (BIDANG_1)
    { id: 4, nama: 'KETUA JURUSAN', role: 'Kabag', bidang_id: 1, parent_id: 3 },
    { id: 5, nama: 'KETUA PRODI TI', role: 'Staff_Kabag', bidang_id: 1, parent_id: 4 },
    { id: 6, nama: 'KETUA PRODI MI', role: 'Staff_Kabag', bidang_id: 1, parent_id: 4 },
    { id: 7, nama: 'KABAG ADMINISTRASI AKADEMIK', role: 'Kabag', bidang_id: 1, parent_id: 4 },
    { id: 8, nama: 'KABAG PERPUSTAKAAN & KEARSIPAN', role: 'Kabag', bidang_id: 1, parent_id: 4 },
    { id: 9, nama: 'KABAG LP3M', role: 'Kabag', bidang_id: 1, parent_id: 3 },
    { id: 10, nama: 'KABAG KEMAHASISWAAN DAN PUSAT KARIR & ALUMNI', role: 'Kabag', bidang_id: 1, parent_id: 3 },

    // Waket 2 (Memegang BIDANG_2)
    { id: 11, nama: 'WAKET 2', role: 'Waket_2', bidang_id: 2, parent_id: 2 },

    // Jabatan di bawah Waket 2 (BIDANG_2)
    { id: 12, nama: 'KABAG UMUM', role: 'Kabag', bidang_id: 2, parent_id: 11 },
    { id: 13, nama: 'KASUBAG KEPEGAWAIAN', role: 'Staff_Kabag', bidang_id: 2, parent_id: 12 },
    { id: 14, nama: 'KASUBAG KEUANGAN', role: 'Staff_Kabag', bidang_id: 2, parent_id: 12 },
    { id: 15, nama: 'KASUBAG SARPRAS', role: 'Staff_Kabag', bidang_id: 2, parent_id: 12 },
    { id: 16, nama: 'KASUBAG ADMINISTRASI UMUM', role: 'Staff_Kabag', bidang_id: 2, parent_id: 12 },
    { id: 17, nama: 'KABAG HUMAS, KERJASAMA DAN PUBLIKASI', role: 'Kabag', bidang_id: 2, parent_id: 11 },
    { id: 18, nama: 'KASUBAG HUMAS', role: 'Staff_Kabag', bidang_id: 2, parent_id: 17 },
    { id: 19, nama: 'KASUBAG KERJASAMA', role: 'Staff_Kabag', bidang_id: 2, parent_id: 17 },
    { id: 20, nama: 'KASUBAG PROMOSI DAN PUBLIKASI', role: 'Staff_Kabag', bidang_id: 2, parent_id: 17 },
    { id: 21, nama: 'KABAG SISFO DAN MAINTENANCE', role: 'Kabag', bidang_id: 2, parent_id: 11 },
    { id: 22, nama: 'KEPALA LAB', role: 'Staff_Kabag', bidang_id: 2, parent_id: 21 },
    { id: 23, nama: 'KASUBAG SISFO', role: 'Staff_Kabag', bidang_id: 2, parent_id: 21 },
    { id: 24, nama: 'UNIT BISNIS', role: 'Kabag', bidang_id: 2, parent_id: 11 },
  ];

  // Loop untuk membuat jabatan
  for (const data of jabatanData) {
    await prisma.jabatan.create({
      data: {
        ...data,
        role: data.role as 'Admin' | 'Ketua' | 'Waket_1' | 'Kabag' | 'Staff_Kabag' | 'Waket_2', // Pastikan tipe role sesuai dengan enum
      },
    });
  }

  // Ambil semua data jabatan yang telah di-seed
  const jabatan = await prisma.jabatan.findMany({
    include: {
      parent: true, // Sertakan data parent (jika ada)
      children: true, // Sertakan data children (jika ada)
      bidang: true, // Sertakan data bidang
    },
  });

  console.log('Data jabatan berhasil ditambahkan:', jabatan);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });