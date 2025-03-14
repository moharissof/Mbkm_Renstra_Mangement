export enum Role {
  Admin = "Admin",
  Ketua = "Ketua",
  Waket_1 = "Waket_1",
  Waket_2 = "Waket_2",
  Kabag = "Kabag",
  Staff_Kabag = "Staff_Kabag",
}

export enum Bidang {
  SEMUA_BIDANG = "SEMUA_BIDANG",
  BIDANG_1 = "BIDANG_1",
  BIDANG_2 = "BIDANG_2",
}

export interface User {
  id: string
  nikp?: string | null
  name: string
  email: string
  photo?: string | null
  no_telp: string
  isVerified: boolean
  jabatan_id?: bigint | null
  last_login_at?: Date | null
  created_at?: Date | null
  updated_at?: Date | null
  jabatan?: Jabatan | null
}

export interface Jabatan {
  id: bigint
  nama: string
  deskripsi?: string | null
  role: Role
  parent_id?: bigint | null
  created_at?: Date | null
  updated_at?: Date | null
  bidang: Bidang
  parent?: Jabatan | null
}

