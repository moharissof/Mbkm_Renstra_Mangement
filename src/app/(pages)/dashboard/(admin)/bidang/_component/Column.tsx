"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { type Bidang } from "@/types/user";

export const createBidangColumns = (
  onEdit: (bidang: Bidang) => void,
  onDelete: (bidang: Bidang) => void,
): ColumnDef<Bidang>[] => [
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
    accessorKey: "deskripsi",
    header: "Deskripsi",
    cell: ({ row }) => <div>{row.getValue("deskripsi") || "-"}</div>,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const bidang = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(bidang)}>
            <Pencil className="h-4 w-4 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(bidang)}>
            <Trash2 className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      );
    },
  },
];