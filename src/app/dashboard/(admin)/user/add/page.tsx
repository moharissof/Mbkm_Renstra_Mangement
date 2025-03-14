"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { DashboardLayout } from "@/components/dashboard/_layout"
import type { Jabatan } from "@/types/user"
import { userFormSchema, type UserFormValues } from "@/lib/validations/user"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AddUserPage() {
  const [loading, setLoading] = useState(false)
  const [jabatan, setJabatan] = useState<Jabatan[]>([])
  const router = useRouter()

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      nama: "",
      email: "",
      password: "",
      role: "STAFF",
      jabatanId: "",
    },
  })

  useEffect(() => {
    const fetchJabatan = async () => {
      try {
        const response = await fetch("/api/jabatan")
        if (!response.ok) throw new Error("Failed to fetch jabatan")
        const data = await response.json()
        setJabatan(data)
      } catch (error) {
        console.error("Error fetching jabatan:", error)
        toast.error("Gagal memuat data jabatan")
      }
    }

    fetchJabatan()
  }, [])

  async function onSubmit(data: UserFormValues) {
    setLoading(true)
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create user")
      }

      toast.success("Pengguna berhasil ditambahkan")
      router.push("/dashboard/user")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menambahkan pengguna")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 space-y-8 p-8 pt-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Tambah Pengguna</h1>
              <p className="text-gray-500">Tambahkan pengguna baru ke sistem</p>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold">Informasi Pengguna</h2>
                  <p className="text-sm text-gray-500">Masukkan informasi untuk pengguna baru</p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-6">
                      <FormField
                        control={form.control}
                        name="nama"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nama</FormLabel>
                            <FormControl>
                              <Input placeholder="Masukkan nama..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Masukkan email..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Masukkan password..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid gap-6 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Role</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Pilih role" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="ADMIN">Admin</SelectItem>
                                  <SelectItem value="KETUA">Ketua</SelectItem>
                                  <SelectItem value="WAKET1">Wakil Ketua 1</SelectItem>
                                  <SelectItem value="WAKET2">Wakil Ketua 2</SelectItem>
                                  <SelectItem value="KABAG">Kepala Bagian</SelectItem>
                                  <SelectItem value="STAFF">Staff</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="jabatanId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Jabatan</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Pilih jabatan" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {jabatan.map((item) => (
                                    <SelectItem key={item.id} value={item.id.toString()}>
                                      {item.nama}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Simpan
                      </Button>
                      <Button type="button" variant="outline" onClick={() => router.back()}>
                        Batal
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

