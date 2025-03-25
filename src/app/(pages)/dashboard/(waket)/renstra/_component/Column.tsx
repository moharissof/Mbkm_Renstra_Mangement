"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  Pencil,
  Trash2,
  FileText,
  SquareDashedMousePointer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { Renstra } from "@/types/renstra";
import { motion } from "framer-motion";

// This is a factory function to create columns with actions
export const createRenstraColumns = (
  onEdit: (renstra: Renstra) => void,
  onDelete: (renstra: Renstra) => void,
  onView: (renstra: Renstra) => void
): ColumnDef<Renstra>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
    header: "Nama Renstra",
    cell: ({ row }) => {
      const renstra = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div className="font-medium">{renstra.nama}</div>
        </div>
      );
    },
  },
  {
    id: "periode",
    header: "Periode",
    cell: ({ row }) => {
      const renstra = row.original;
      const periode = renstra.periode;

      // Tentukan warna titik berdasarkan status
      const dotColor =
        periode?.status === "Aktif" ? "bg-green-500" : "bg-red-500";

      return (
        <div className="flex items-center gap-2">
          {/* Titik (dot) */}
          <motion.div
            className={`w-2 h-2 rounded-full ${dotColor}`}
            animate={{ opacity: [0, 1, 0] }} // Animasi opacity dari 0 ke 1 ke 0
            transition={{
              duration: 1, // Durasi animasi (1 detik)
              repeat: Infinity, // Mengulang animasi tanpa henti
              ease: "linear", // Jenis easing
            }}
          />

          {/* Badge untuk menampilkan periode */}
          <Badge variant="outline" className="bg-gray-50">
            {periode
              ? `${periode.nama} (${periode.tahun_awal}-${periode.tahun_akhir})`
              : "-"}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "sub_renstra",
    header: "Sub-Renstra",
    cell: ({ row }) => {
      const renstra = row.original;
      const subRenstraCount = renstra.sub_renstra?.length || 0;

      return (
        <div className="text-center">
          {subRenstraCount > 0 ? (
            <Badge variant="outline" className="bg-blue-50 text-blue-600">
              {subRenstraCount}
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-blue-50 text-blue-600">
              0
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "point_renstra",
    header: "Point Renstra",
    cell: ({ row }) => {
      const renstra = row.original;
      const pointCount = renstra.point_renstra?.length || 0;

      return (
        <div className="text-center">
          {pointCount > 0 ? (
            <Badge variant="outline" className="bg-green-50 text-green-600">
              {pointCount}
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-blue-50 text-blue-600">
              0
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      const renstra = row.original;

      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-600"
            onClick={() => onView(renstra)}
            title="View Sub-Renstra"
          >
            <SquareDashedMousePointer className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(renstra)}
          >
            <Pencil className="h-4 w-4 text-gray-500" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onDelete(renstra)}
          >
            <Trash2 className="h-4 w-4 text-gray-500" />
          </Button>
        </div>
      );
    },
  },
];
