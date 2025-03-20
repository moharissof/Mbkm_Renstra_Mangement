export enum Bidang {
  SEMUA_BIDANG = "SEMUA_BIDANG",
  BIDANG_1 = "BIDANG_1",
  BIDANG_2 = "BIDANG_2",
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

