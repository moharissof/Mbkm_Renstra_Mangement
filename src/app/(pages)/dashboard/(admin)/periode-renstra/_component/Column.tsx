"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge"; // Import komponen Badge
import { type PeriodeRenstra } from "@/types/renstra";

export const createPeriodeRenstraColumns = (
  onEdit: (periodeRenstra: PeriodeRenstra) => void,
  onDelete: (periodeRenstra: PeriodeRenstra) => void,
): ColumnDef<PeriodeRenstra>[] => [
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
    header: "Nama",
    cell: ({ row }) => <div>{row.getValue("nama")}</div>,
  },
  {
    accessorKey: "tahun_awal",
    header: "Tahun Awal",
    cell: ({ row }) => <div>{row.getValue("tahun_awal")}</div>,
  },
  {
    accessorKey: "tahun_akhir",
    header: "Tahun Akhir",
    cell: ({ row }) => <div>{row.getValue("tahun_akhir")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const badgeVariant = status === "Aktif" ? "default" : "secondary"; // Sesuaikan variant badge berdasarkan status
      return <Badge variant={badgeVariant}>{status}</Badge>;
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const periodeRenstra = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(periodeRenstra)}>
            <Pencil className="h-4 w-4 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(periodeRenstra)}>
            <Trash2 className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      );
    },
  },
];