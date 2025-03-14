import * as z from "zod"

export const userFormSchema = z.object({
  nama: z.string().min(2, {
    message: "Nama harus minimal 2 karakter.",
  }),
  email: z.string().email({
    message: "Email tidak valid.",
  }),
  password: z
    .string()
    .min(6, {
      message: "Password harus minimal 6 karakter.",
    })
    .optional(),
  role: z.enum(["ADMIN", "KETUA", "WAKET1", "WAKET2", "KABAG", "STAFF"], {
    required_error: "Silakan pilih role.",
  }),
  jabatanId: z.string({
    required_error: "Silakan pilih jabatan.",
  }),
})

export type UserFormValues = z.infer<typeof userFormSchema>

