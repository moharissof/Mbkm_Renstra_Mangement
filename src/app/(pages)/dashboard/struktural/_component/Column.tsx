/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal, Eye, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";

export type StaffPerformance = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  position: string;
  department: string;
  lastLogin: string;
  completionRate: number;
  onTimeRate: number;
  qualityScore: number;
  responseTime: number;
  activePrograms: number;
  completedPrograms: number;
  totalPrograms: number;
  status: "active" | "inactive" | "on_leave";
};

export const staffColumns: ColumnDef<StaffPerformance>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Pilih semua"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Pilih baris"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Staf",
    cell: ({ row }) => {
      const staff = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={staff.avatar} alt={staff.name} />
            <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{staff.name}</div>
            <div className="text-sm text-muted-foreground">
              {staff.email || ""}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "position",
    header: "Jabatan",
    cell: ({ row }) => {
      return (
        <div className="font-medium">{row.getValue("position") || "N/A"}</div>
      );
    },
  },
  {
    accessorKey: "department",
    header: "Departemen",
    cell: ({ row }) => {
      return (
        <div className="font-medium">{row.getValue("department") || "N/A"}</div>
      );
    },
  },
  {
    accessorKey: "lastLogin",
    header: "Login Terakhir",
    cell: ({ row }) => {
      try {
        const lastLogin = new Date(row.getValue("lastLogin"));
        return (
          <div className="font-medium">
            {formatDistanceToNow(lastLogin, { addSuffix: true, locale: id })}
          </div>
        );
      } catch (error) {
        return <div className="font-medium">Belum pernah</div>;
      }
    },
  },
  {
    accessorKey: "completionRate",
    header: "Tingkat Penyelesaian",
    cell: ({ row }) => {
      const rate = (row.getValue("completionRate") as number) || 0;
      return (
        <div className="flex items-center gap-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                rate >= 75
                  ? "bg-green-500"
                  : rate >= 50
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${rate}%` }}
            ></div>
          </div>
          <span className="text-sm font-medium">{rate}%</span>
        </div>
      );
    },
  },
  {
    accessorKey: "activePrograms",
    header: "Program",
    cell: ({ row }) => {
      const active = (row.getValue("activePrograms") as number) || 0;
      const total = row.original.totalPrograms || 0;
      return (
        <div className="font-medium">
          {active} / {total}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const staff = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Buka menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Tindakan</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(staff.id)}
            >
              Salin ID staf
            </DropdownMenuItem>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Link
                href={`/proker/daftar/${staff.id}`}
                className="flex items-center w-full"
              >
                <Eye className="mr-2 h-4 w-4" />
                Lihat proker
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
               Export Program
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
