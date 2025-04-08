/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/export-laporan-proker.ts
// app/api/export/route.ts
import { NextResponse } from 'next/server';
import ExcelJS from 'exceljs';
import { PrismaClient } from '@prisma/client';
import path from 'path';

const prisma = new PrismaClient();

// Fungsi untuk mengkonversi BigInt ke number/string
function convertBigInt(obj: any): any {
  if (typeof obj === 'bigint') {
    return Number(obj); // atau String(obj) jika perlu presisi penuh
  }
  if (Array.isArray(obj)) {
    return obj.map(convertBigInt);
  }
  if (typeof obj === 'object' && obj !== null) {
    const result: any = {};
    for (const key in obj) {
      result[key] = convertBigInt(obj[key]);
    }
    return result;
  }
  return obj;
}

export async function GET() {
  try {
    // 1. Load template Excel
    const templatePath = path.join(process.cwd(), 'public', 'templates', 'Form Isian Raker - ver2.xlsx');
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(templatePath);

    // 2. Get completed programs from database
    const completedPrograms = await prisma.program_kerja.findMany({
      where: {
        status: 'Done',
        progress: 100
      },
      include: {
        users: {
          select: {
            name: true,
            jabatan: {
              select: {
                nama: true,
                bidang: {
                  select: {
                    nama: true
                  }
                }
              }
            }
          }
        },
        point_renstra: true,
        indikator_proker: true,
        point_standar: true,
        laporan: {
          orderBy: { created_at: 'desc' },
          take: 1
        }
      }
    });

    if (completedPrograms.length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada program kerja yang selesai' },
        { status: 404 }
      );
    }

    // 3. Konversi BigInt sebelum diproses
    const convertedPrograms = convertBigInt(completedPrograms);

    // 4. Fill sheets dengan data yang sudah dikonversi
    const lpjSheet = workbook.getWorksheet('Form LPJ');
    if (lpjSheet) {
      fillLpjSheet(lpjSheet, convertedPrograms);
    }

    const rkatSheet = workbook.getWorksheet('Form RKAT');
    if (rkatSheet) {
      fillRkatSheet(rkatSheet, convertedPrograms);
    }

    // 5. Generate Excel buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // 6. Create response
    const response = new NextResponse(buffer);
    response.headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    response.headers.set('Content-Disposition', 'attachment; filename=Laporan_Proker_Selesai.xlsx');
    
    return response;

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Gagal membuat laporan Excel' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


// Helper function to fill LPJ sheet
function fillLpjSheet(sheet: ExcelJS.Worksheet, programs: any[]) {
  // Set header information
  sheet.getCell('B2').value = `LAPORAN PERTANGGUNGJAWABAN – ${programs[0]?.users?.jabatan?.bidang?.nama || '[NAMA BAGIAN]'}`;
  sheet.getCell('B3').value = 'TAHUN AKADEMIK 2024/2025';
  
  // Fill program data
  let rowIndex = 8;
  let programCounter = 1;
  
  programs.forEach((proker) => {
    // Main program row
    sheet.getCell(`B${rowIndex}`).value = `${programCounter}. ${proker.point_renstra?.nama || 'Tidak ada poin renstra'}`;
    rowIndex++;
    
    // Sub program row
    sheet.getCell(`B${rowIndex}`).value = `a. ${proker.nama}`;
    sheet.getCell(`C${rowIndex}`).value = `${formatDate(proker.waktu_mulai)} - ${formatDate(proker.waktu_selesai)}`;
    sheet.getCell(`D${rowIndex}`).value = proker.strategi_pencapaian || '-';
    sheet.getCell(`E${rowIndex}`).value = proker.indikator_proker?.map((i: any) => i.nama).join(', ') || '-';
    sheet.getCell(`F${rowIndex}`).value = proker.baseline || '-';
    sheet.getCell(`G${rowIndex}`).value = proker.target || '-';
    sheet.getCell(`H${rowIndex}`).value = proker.point_standar?.map((p: any) => p.nama).join(', ') || '-';
    sheet.getCell(`I${rowIndex}`).value = proker.laporan[0]?.hasil_evaluasi || '-';
    sheet.getCell(`J${rowIndex}`).value = proker.laporan[0]?.pengendalian || '-';
    sheet.getCell(`K${rowIndex}`).value = proker.laporan[0]?.peningkatan || '-';
    
    rowIndex++;
    programCounter++;
  });

  // Set signature information
  const today = new Date();
  sheet.getCell('J20').value = `Banyuwangi, ${formatDate(today)}`;
  sheet.getCell('B21').value = programs[0]?.users?.jabatan?.atasan_langsung || '[jabatan atasan langsung]';
  sheet.getCell('J21').value = programs[0]?.users?.jabatan?.nama || '[jabatan pejabat yang menyusun]';
  sheet.getCell('B24').value = programs[0]?.users?.jabatan?.atasan_nama || '[nama atasan langsung]';
  sheet.getCell('J24').value = programs[0]?.users?.name || '[nama pejabat penyusun]';
}

// Helper function to fill RKAT sheet
function fillRkatSheet(sheet: ExcelJS.Worksheet, programs: any[]) {
    // Set header information
    sheet.getCell('B2').value = `RENCANA KERJA AWAL TAHUN – ${programs[0]?.users?.jabatan?.bidang?.nama || '[NAMA BAGIAN]'}`;
    sheet.getCell('B3').value = 'TAHUN AKADEMIK 2024/2025';
    
    // Fill program data
    let rowIndex = 8;
    let programCounter = 1;
    
    programs.forEach((proker) => {
      // Main program row
      sheet.getCell(`B${rowIndex}`).value = `${programCounter}. ${proker.point_renstra?.nama || 'Tidak ada poin renstra'}`;
      rowIndex++;
      
      // Sub program row
      sheet.getCell(`B${rowIndex}`).value = `a. ${proker.nama}`;
      sheet.getCell(`C${rowIndex}`).value = `${formatDate(proker.waktu_mulai)} - ${formatDate(proker.waktu_selesai)}`;
      sheet.getCell(`D${rowIndex}`).value = proker.strategi_pencapaian || '-';
      sheet.getCell(`E${rowIndex}`).value = proker.indikator_proker?.map((i: any) => i.nama).join(', ') || '-';
      sheet.getCell(`F${rowIndex}`).value = proker.baseline || '-';
      sheet.getCell(`G${rowIndex}`).value = proker.target || '-';
      sheet.getCell(`H${rowIndex}`).value = proker.point_standar?.map((p: any) => p.nama).join(', ') || '-';
      sheet.getCell(`I${rowIndex}`).value = proker.volume || 0;
      
      // Konversi khusus untuk nilai anggaran
      const anggaran = typeof proker.anggaran === 'bigint' ? Number(proker.anggaran) : proker.anggaran || 0;
      sheet.getCell(`J${rowIndex}`).value = anggaran;
      
      sheet.getCell(`K${rowIndex}`).value = { 
        formula: `I${rowIndex}*J${rowIndex}`,
        result: (proker.volume || 0) * anggaran
      };
      
      rowIndex++;
      programCounter++;
    });
  
  // Set total budget formula
  sheet.getCell('K24').value = {
    formula: `SUM(K8:K${rowIndex-1})`,
    result: programs.reduce((sum, p) => sum + ((p.volume || 0) * (p.anggaran || 0)), 0)
  };

  // Set signature information
  const today = new Date();
  sheet.getCell('I28').value = `Banyuwangi, ${formatDate(today)}`;
  sheet.getCell('C29').value = programs[0]?.users?.jabatan?.atasan_langsung || '[jabatan atasan langsung]';
  sheet.getCell('I29').value = programs[0]?.users?.jabatan?.nama || '[jabatan pejabat yang menyusun]';
  sheet.getCell('C32').value = programs[0]?.users?.jabatan?.atasan_nama || '[nama atasan langsung]';
  sheet.getCell('I32').value = programs[0]?.users?.name || '[nama pejabat penyusun]';
}

// Helper function to format date
function formatDate(date: string | number | Date | null | undefined) {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }