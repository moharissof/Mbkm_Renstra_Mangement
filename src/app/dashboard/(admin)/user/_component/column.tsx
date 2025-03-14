"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { type User, Role } from "@/types/user"

// This is a factory function to create columns with the verify action
export const createUserColumns = (onVerify: (user: User) => void): ColumnDef<User>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Nama",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.photo || undefined} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "nikp",
    header: "NIKP",
    cell: ({ row }) => <div>{row.getValue("nikp") || "-"}</div>,
  },
  {
    accessorKey: "no_telp",
    header: "No. Telepon",
    cell: ({ row }) => <div>{row.getValue("no_telp") || "-"}</div>,
  },
  {
    id: "jabatan",
    header: "Jabatan",
    cell: ({ row }) => {
      const jabatan = row.original.jabatan
      return <div>{jabatan ? jabatan.nama : "-"}</div>
    },
  },
  {
    id: "role",
    header: "Role",
    cell: ({ row }) => {
      const jabatan = row.original.jabatan
      if (!jabatan) return <div>-</div>

      const role = jabatan.role as Role

      return (
        <Badge
          className={
            role === Role.Admin
              ? "bg-purple-50 text-purple-600 hover:bg-purple-50 hover:text-purple-600"
              : role === Role.Ketua || role === Role.Waket_1 || role === Role.Waket_2
                ? "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600"
                : role === Role.Kabag
                  ? "bg-green-50 text-green-600 hover:bg-green-50 hover:text-green-600"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-50 hover:text-gray-600"
          }
        >
          {role.replace("_", " ")}
        </Badge>
      )
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const isVerified = row.original.isVerified

      return (
        <Badge
          className={
            isVerified
              ? "bg-green-50 text-green-600 hover:bg-green-50 hover:text-green-600"
              : "bg-orange-50 text-orange-600 hover:bg-orange-50 hover:text-orange-600"
          }
        >
          {isVerified ? "Terverifikasi" : "Belum Verifikasi"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const user = row.original
      const isVerified = user.isVerified

      return (
        <div className="flex items-center gap-2">
          {!isVerified && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-50"
              onClick={() => onVerify(user)}
              title="Verifikasi Pengguna"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Pencil className="h-4 w-4 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Trash2 className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      )
    },
  },
]

