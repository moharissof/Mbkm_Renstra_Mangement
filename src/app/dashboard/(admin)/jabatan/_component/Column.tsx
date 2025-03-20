"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { type Jabatan, Role } from "@/types/user";

export const createPositionColumns = (
  onEdit: (position: Jabatan) => void,
  onDelete: (position: Jabatan) => void,
): ColumnDef<Jabatan>[] => [
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
    header: "Nama Jabatan",
    cell: ({ row }) => {
      const position = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium">{position.nama}</div>
            {position.parent && (
              <div className="text-sm text-gray-500">Dibawah: {position.parent.nama}</div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "deskripsi",
    header: "Deskripsi",
    cell: ({ row }) => <div>{row.getValue("deskripsi") || "-"}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as Role;

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
      );
    },
  },
  {
    accessorKey: "bidang",
    header: "Bidang",
    cell: ({ row }) => {
      const bidang = row.original.bidang;
      console.log("bidang", bidang); // Debugging: Log bidang to verify its structure

      if (!bidang || !bidang.nama) {
        return <div>-</div>; // Fallback for missing bidang or bidang.nama
      }

      return (
        <Badge
          className={
            bidang.nama === "SEMUA_BIDANG"
              ? "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600"
              : bidang.nama === "Bidang 1"
                ? "bg-green-50 text-green-600 hover:bg-green-50 hover:text-green-600"
                : "bg-yellow-50 text-yellow-600 hover:bg-yellow-50 hover:text-yellow-600"
          }
        >
          {bidang.nama}
        </Badge>
      );
    },
  },
  {
    id: "children",
    header: "Bawahan",
    cell: ({ row }) => {
      const position = row.original;
      const childCount = position.children?.length || 0;

      return (
        <div className="text-center">
          {childCount > 0 ? (
            <Badge variant="outline" className="bg-gray-50">
              {childCount}
            </Badge>
          ) : (
            "-"
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const position = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(position)}>
            <Pencil className="h-4 w-4 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(position)}>
            <Trash2 className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      );
    },
  },
];