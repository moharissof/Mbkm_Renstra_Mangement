export  interface CommentUser {
    id?: string
    name?: string
    photo?: string | null
  }
  
export interface Comment {
    id?: bigint | number | string
    program_kerja_id?: bigint
    laporan_id?: bigint
    user_id?: string
    comment?: string
    created_at?: string | Date
    updated_at?: string | Date
    users?: CommentUser
  }