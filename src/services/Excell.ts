/* eslint-disable @typescript-eslint/no-explicit-any */
import ExcelJS from 'exceljs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fillLpjRkatTemplate() {
  // 1. Load template yang sudah ada
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile('Form Isian Raker - ver2.xlsx');
  
  // 2. Ambil data proker yang sudah selesai dari database
  const completedPrograms = await prisma.program_kerja.findMany({
    where: {
      status: 'Done',
      progress: 100
    },
    include: {
      users: { select: { name: true, jabatan: true } },
      point_renstra: true,
      indikator_proker: true,
      point_standar: true,
      laporan: {
        orderBy: { created_at: 'desc' },
        take: 1
      }
    }
  });

  // 3. Isi data ke sheet LPJ
  const lpjSheet = workbook.getWorksheet('Form LPJ');
  fillLpjSheet(lpjSheet, completedPrograms);

  // 4. Isi data ke sheet RKAT
  const rkatSheet = workbook.getWorksheet('Form RKAT');
  fillRkatSheet(rkatSheet, completedPrograms);

  // 5. Simpan file hasil
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

function fillLpjSheet(sheet: ExcelJS.Worksheet | undefined, programs: any[]) {
  // Format header dan informasi umum
  if (!sheet) return;
  sheet.getCell('B2').value = `LAPORAN PERTANGGUNGJAWABAN – ${programs[0]?.bidang?.nama || '[NAMA BAGIAN]'}`;
  sheet.getCell('B3').value = 'TAHUN AKADEMIK 2024/2025';
  
  // Isi data program kerja
  let rowIndex = 8; // Mulai dari row 8 sesuai template
  let programCounter = 1;
  
  programs.forEach((proker: { point_renstra: { nama: any; }; nama: any; waktu_mulai: any; waktu_selesai: any; strategi_pencapaian: any; indikator_proker: any[]; baseline: any; target: any; point_standar: any[]; laporan: {
      pengendalian: string;
      hasil_evaluasi: string; peningkatan: string; 
}[]; }) => {
    // Baris utama program
    sheet.getCell(`B${rowIndex}`).value = `${programCounter}. ${proker.point_renstra?.nama || 'Tidak ada poin renstra'}`;
    rowIndex++;
    
    // Sub program
    sheet.getCell(`B${rowIndex}`).value = `a. ${proker.nama}`;
    sheet.getCell(`C${rowIndex}`).value = `${formatDate(proker.waktu_mulai)} - ${formatDate(proker.waktu_selesai)}`;
    sheet.getCell(`D${rowIndex}`).value = proker.strategi_pencapaian;
    sheet.getCell(`E${rowIndex}`).value = proker.indikator_proker.map((i: { nama: any; }) => i.nama).join(', ');
    sheet.getCell(`F${rowIndex}`).value = proker.baseline;
    sheet.getCell(`G${rowIndex}`).value = proker.target;
    sheet.getCell(`H${rowIndex}`).value = proker.point_standar.map((p: { nama: any; }) => p.nama).join(', ');
    sheet.getCell(`I${rowIndex}`).value = proker.laporan[0]?.hasil_evaluasi || '-';
    sheet.getCell(`J${rowIndex}`).value = proker.laporan[0]?.pengendalian || '-';
    sheet.getCell(`K${rowIndex}`).value = proker.laporan[0]?.peningkatan || '-';
    
    rowIndex++;
    programCounter++;
  });

  // Isi informasi penandatangan
  const today = new Date();
  sheet.getCell('J20').value = `Banyuwangi, ${formatDate(today)}`;
  sheet.getCell('B21').value = programs[0]?.user?.jabatan?.atasan_langsung || '[jabatan atasan langsung]';
  sheet.getCell('J21').value = programs[0]?.user?.jabatan?.nama || '[jabatan pejabat yang menyusun]';
  sheet.getCell('B24').value = programs[0]?.user?.jabatan?.atasan_nama || '[nama atasan langsung]';
  sheet.getCell('J24').value = programs[0]?.user?.name || '[nama pejabat penyusun]';
}

function fillRkatSheet(sheet: ExcelJS.Worksheet | undefined, programs: any[]) {
  // Format header dan informasi umum
  if (!sheet) return;
  sheet.getCell('B2').value = `RENCANA KERJA AWAL TAHUN – ${programs[0]?.bidang?.nama || '[NAMA BAGIAN]'}`;
  sheet.getCell('B3').value = 'TAHUN AKADEMIK 2024/2025';
  
  // Isi data program kerja
  let rowIndex = 8; // Mulai dari row 8 sesuai template
  let programCounter = 1;
  
  programs.forEach((proker: { point_renstra: { nama: any; }; nama: any; waktu_mulai: any; waktu_selesai: any; strategi_pencapaian: any; indikator_proker: any[]; baseline: any; target: any; point_standar: any[]; volume: number; anggaran: number; }) => {
    // Baris utama program
    sheet.getCell(`B${rowIndex}`).value = `${programCounter}. ${proker.point_renstra?.nama || 'Tidak ada poin renstra'}`;
    rowIndex++;
    
    // Sub program
    sheet.getCell(`B${rowIndex}`).value = `a. ${proker.nama}`;
    sheet.getCell(`C${rowIndex}`).value = `${formatDate(proker.waktu_mulai)} - ${formatDate(proker.waktu_selesai)}`;
    sheet.getCell(`D${rowIndex}`).value = proker.strategi_pencapaian;
    sheet.getCell(`E${rowIndex}`).value = proker.indikator_proker.map((i: { nama: any; }) => i.nama).join(', ');
    sheet.getCell(`F${rowIndex}`).value = proker.baseline;
    sheet.getCell(`G${rowIndex}`).value = proker.target;
    sheet.getCell(`H${rowIndex}`).value = proker.point_standar.map((p: { nama: any; }) => p.nama).join(', ');
    sheet.getCell(`I${rowIndex}`).value = proker.volume;
    sheet.getCell(`J${rowIndex}`).value = proker.anggaran;
    sheet.getCell(`K${rowIndex}`).value = { 
      formula: `I${rowIndex}*J${rowIndex}`,
      result: proker.volume * proker.anggaran
    };
    
    rowIndex++;
    programCounter++;
  });

  // Update formula total anggaran
  sheet.getCell('K24').value = {
    formula: `SUM(K8:K${rowIndex-1})`,
    result: programs.reduce((sum: number, p: { volume: number; anggaran: number; }) => sum + (p.volume * p.anggaran), 0)
  };

  // Isi informasi penandatangan
  const today = new Date();
  sheet.getCell('I28').value = `Banyuwangi, ${formatDate(today)}`;
  sheet.getCell('C29').value = programs[0]?.user?.jabatan?.atasan_langsung || '[jabatan atasan langsung]';
  sheet.getCell('I29').value = programs[0]?.user?.jabatan?.nama || '[jabatan pejabat yang menyusun]';
  sheet.getCell('C32').value = programs[0]?.user?.jabatan?.atasan_nama || '[nama atasan langsung]';
  sheet.getCell('I32').value = programs[0]?.user?.name || '[nama pejabat penyusun]';
}

function formatDate(date: string | number | Date) {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

// Contoh penggunaan di API route Next.js
export default async function handler(req: any, res: { setHeader: (arg0: string, arg1: string) => void; send: (arg0: ExcelJS.Buffer) => void; status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error: string; }): void; new(): any; }; }; }) {
  try {
    const excelBuffer = await fillLpjRkatTemplate();
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Laporan_Proker_Selesai.xlsx');
    res.send(excelBuffer);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Gagal membuat laporan Excel' });
  }
}