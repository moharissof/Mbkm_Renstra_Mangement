export interface PeriodeRenstra {
  id: string; // or bigint, depending on your database
  nama: string;
  tahun_awal: number;
  tahun_akhir: number;
  created_at?: string | null;
  updated_at?: string | null;
}
