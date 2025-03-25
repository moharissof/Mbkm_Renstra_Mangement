/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Eye, Pencil, Trash2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { format } from "date-fns"

// This is a factory function to create columns with actions
export const createProgramKerjaColumns = (
  onView: (program: any) => void,
  onEdit: (program: any) => void,
  onDelete: (program: any) => void,
): ColumnDef<any>[] => [
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
    accessorKey: "nama",
    header: "Nama Program",
    cell: ({ row }) => {
      const program = row.original
      return (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium">{program.nama}</div>
            <div className="text-xs text-gray-500">
              {program.point_renstra?.bidang?.nama}
            </div>
          </div>
        </div>
      )
    },
  },
  {
    id: "periode",
    header: "Periode",
    cell: ({ row }) => {
      const program = row.original
      return <div>{program.periode_proker?.tahun || "-"}</div>
    },
  },
  {
    id: "waktu",
    header: "Timeline",
    cell: ({ row }) => {
      const program = row.original
      const startDate = program.waktu_mulai ? new Date(program.waktu_mulai) : null
      const endDate = program.waktu_selesai ? new Date(program.waktu_selesai) : null

      if (!startDate || !endDate) return <div>-</div>

      return (
        <div className="text-sm">
          {format(startDate, "dd MMM yyyy")} - {format(endDate, "dd MMM yyyy")}
        </div>
      )
    },
  },
  {
    id: "progress",
    header: "Progress",
    cell: ({ row }) => {
      const program = row.original
      const progress = program.progress || 0

      return (
        <div className="w-full flex items-center gap-2">
          <Progress value={progress} className="h-2 flex-1" />
          <span className="text-xs font-medium w-8 text-right">{progress}%</span>
        </div>
      )
    },
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const program = row.original
      const status = program.status

      let badgeClass = ""
      switch (status) {
        case "Draft":
          badgeClass = "bg-gray-50 text-gray-600 hover:bg-gray-50 hover:text-gray-600"
          break
        case "Planning":
          badgeClass = "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600"
          break
        case "Disetujui":
          badgeClass = "bg-green-50 text-green-600 hover:bg-green-50 hover:text-green-600"
          break
        case "Ditolak":
          badgeClass = "bg-red-50 text-red-600 hover:bg-red-50 hover:text-red-600"
          break
        case "Done":
          badgeClass = "bg-purple-50 text-purple-600 hover:bg-purple-50 hover:text-purple-600"
          break
        default:
          badgeClass = "bg-gray-50 text-gray-600 hover:bg-gray-50 hover:text-gray-600"
      }

      return <Badge className={badgeClass}>{status}</Badge>
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const program = row.original

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-600"
            onClick={() => onView(program)}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(program)} title="Edit Program">
            <Pencil className="h-4 w-4 text-gray-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onDelete(program)}
            title="Delete Program"
          >
            <Trash2 className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      )
    },
  },
]

