"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Pencil, Trash2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { PeriodeProker } from "@/types/proker"
import { format } from "date-fns"

// This is a factory function to create columns with actions
export const createPeriodeProkerColumns = (
  onEdit: (periodeProker: PeriodeProker) => void,
  onDelete: (periodeProker: PeriodeProker) => void,
): ColumnDef<PeriodeProker>[] => [
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
    accessorKey: "tahun",
    header: "Tahun",
    cell: ({ row }) => {
      const periodeProker = row.original
      return (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div className="font-medium">{periodeProker.tahun}</div>
        </div>
      )
    },
  },
  {
    accessorKey: "tanggal_mulai",
    header: "Tanggal Mulai",
    cell: ({ row }) => {
      const date = new Date(row.getValue("tanggal_mulai"))
      return <div>{format(date, "dd MMM yyyy")}</div>
    },
  },
  {
    accessorKey: "tanggal_selesai",
    header: "Tanggal Selesai",
    cell: ({ row }) => {
      const date = new Date(row.getValue("tanggal_selesai"))
      return <div>{format(date, "dd MMM yyyy")}</div>
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const periodeProker = row.original
      const now = new Date()
      const startDate = new Date(periodeProker.tanggal_mulai)
      const endDate = new Date(periodeProker.tanggal_selesai)

      let status: "active" | "upcoming" | "completed" = "completed"

      if (now >= startDate && now <= endDate) {
        status = "active"
      } else if (now < startDate) {
        status = "upcoming"
      }

      return (
        <Badge
          className={
            status === "active"
              ? "bg-green-50 text-green-600 hover:bg-green-50 hover:text-green-600"
              : status === "upcoming"
                ? "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600"
                : "bg-gray-50 text-gray-600 hover:bg-gray-50 hover:text-gray-600"
          }
        >
          {status === "active" ? "Active" : status === "upcoming" ? "Upcoming" : "Completed"}
        </Badge>
      )
    },
  },
  {
    id: "program_kerja",
    header: "Programs",
    cell: ({ row }) => {
      const periodeProker = row.original
      const programCount = periodeProker.program_kerja?.length || 0

      return (
        <div className="text-center">
          {programCount > 0 ? (
            <Badge variant="outline" className="bg-blue-50 text-blue-600">
              {programCount}
            </Badge>
          ) : (
            "-"
          )}
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const periodeProker = row.original

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(periodeProker)}
            title="Edit Period"
          >
            <Pencil className="h-4 w-4 text-gray-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onDelete(periodeProker)}
            title="Delete Period"
          >
            <Trash2 className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      )
    },
  },
]

