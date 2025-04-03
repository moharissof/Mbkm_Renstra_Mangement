export type PeriodeProker = {
  id: string;
  tahun: string;
  tanggal_mulai: Date;
  tanggal_selesai: Date;
  created_at?: Date | null;
  updated_at?: Date | null;
  program_kerja?: unknown[]; // Array of program kerja associated with this period
};

export interface ProgramKerja {
  id: string
  nama: string
  status: string
  user_id: string
  progress?: number
  waktu_mulai?: string | Date
  waktu_selesai?: string | Date
  point_renstra?: {
    bidang?: {
      nama?: string
    }
  }
}
