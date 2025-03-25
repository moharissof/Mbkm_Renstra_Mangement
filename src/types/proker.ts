export type PeriodeProker = {
  id: string;
  tahun: string;
  tanggal_mulai: Date;
  tanggal_selesai: Date;
  created_at?: Date | null;
  updated_at?: Date | null;
  program_kerja?: unknown[]; // Array of program kerja associated with this period
};
