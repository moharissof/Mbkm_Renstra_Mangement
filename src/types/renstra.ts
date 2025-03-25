/* eslint-disable @typescript-eslint/no-explicit-any */

export interface PeriodeRenstra {
  id: string;
  nama: string;
  tahun_awal: number;
  tahun_akhir: number;
  status: string;
  created_at?: string | null;
  updated_at?: string | null;
}

// Define the Renstra type
export type Renstra = {
  id: string
  periode_id: string
  nama: string
  created_at?: Date | null
  updated_at?: Date | null
  periode?: {
    id: string
    nama: string
    tahun_awal: number
    tahun_akhir: number
    status: string
  }
  sub_renstra?: any[]
  point_renstra?: any[]
}

export type SubRenstra = {
  id: string
  renstra_id: string
  nama: string
  created_at?: Date | null
  updated_at?: Date | null
  point_renstra?: PointRenstra[]
}

export type PointRenstra = {
  id: string
  renstra_id: string
  sub_renstra_id: string
  nama: string
  presentase?: number | null
  bidang_id: string
  created_at?: Date | null
  updated_at?: Date | null
  bidang?: {
    id: string
    nama: string
    kode: string
  }
  sub_renstra?: SubRenstra
}

