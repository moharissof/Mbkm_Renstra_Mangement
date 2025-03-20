 
export enum Role {
  Admin = "Admin",
  Ketua = "Ketua",
  Waket_1 = "Waket_1",
  Waket_2 = "Waket_2",
  Kabag = "Kabag",
  Staff_Kabag = "Staff_Kabag",
}

export interface Bidang {
  id: string
  nama: string
  deskripsi?: string | null
  created_at?: Date | null
  updated_at?: Date | null
}


export interface User {
  id: string;
  name: string;
  email: string;
  nikp?: string;
  no_telp: string;
  photo?: string | null;
  isVerified: boolean;
  jabatan_id: string | null; // Ubah tipe data ke string
  jabatan?: Jabatan;
  password?: string;
  last_login_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface Jabatan {
  id: string;
  nama: string;
  deskripsi: string | null;
  role: Role;
  parent_id: string | null;
  bidang_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  parent?: {
    id: string;
    nama: string;
    deskripsi: string | null;
    role: Role;
    parent_id: string | null;
    bidang_id: string;
    created_at: string | null;
    updated_at: string | null;
  };
  children?: Jabatan[] ;
  bidang?: {
    id: string;
    nama: string;
  };
}