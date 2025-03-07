export enum Role {
    ADMIN = "ADMIN",
    KETUA = "KETUA",
    WAKET1 = "WAKET1",
    WAKET2 = "WAKET2",
    KABAG = "KABAG",
    STAFF = "STAFF",
  }
  
  export enum Bidang {
    BIDANG_1 = "BIDANG_1",
    BIDANG_2 = "BIDANG_2",
  }
  
  export interface RegisterData {
    nama: string
    email: string
    password: string
    role: Role
    jabatanId?: number
  }
  
  export interface LoginData {
    email: string
    password: string
  }
  
  