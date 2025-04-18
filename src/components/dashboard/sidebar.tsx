/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import {
  BarChart3,
  Calendar,
  LayoutDashboard,
  SquareUser,
  FolderClock,
  Network,
  ShieldUser,
  SquareKanban,
  FileClock,
  BookAudio,
  Search,
  Hourglass,
  Bell,
  CircleCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Role } from "@/types/user"

const menuCategories = [
  {
    name: "DASHBOARD",
    items: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        roles: [Role.Admin, Role.Ketua, Role.Waket_1, Role.Waket_2, Role.Kabag, Role.Staff_Kabag],
      }
    ]
  },
  {
    name: "Master Data",
    items: [
      {
        title: "Bidang",
        icon: SquareUser,
        href: "/dashboard/bidang",
        roles: [Role.Admin], 
      },
      {
        title: "Users",
        icon: ShieldUser,
        href: "/dashboard/user",
        roles: [Role.Admin],
      },
      {
        title: "Jabatan",
        icon: Network,
        href: "/dashboard/jabatan",
        roles: [Role.Admin],
      },
      {
        title: "Notifikasi",
        icon: Bell,
        href: "/dashboard/jabatan",
        roles: [Role.Admin],
      }
    ]
  },
  {
    name: "RENSTRA",
    items: [
      {
        title: "Renstra",
        icon: SquareKanban,
        href: "/dashboard/renstra",
        roles: [Role.Admin, Role.Waket_1, Role.Waket_2],
      },
      {
        title: "Periode Renstra",
        icon: FolderClock,
        href: "/dashboard/periode-renstra",
        roles: [Role.Admin],
      },
    ]
  },
  {
    name: "PROKER",
    items: [
      {
        title: "Periode Proker",
        icon: FileClock,
        href: "/dashboard/periode-proker",
        roles: [Role.Admin],
      },
      {
        title: "Pengajuan Proker (Waket)",
        icon: Hourglass,
        href: "/proker/pengajuan/waket",
        roles: [Role.Waket_1, Role.Waket_2],
      },
      {
        title: "Pengajuan Penyelesaian (Kabag)",
        icon: CircleCheck,
        href: "/proker/done/kabag",
        roles: [Role.Kabag],
      },
      {
        title: "Pengajuan Penyelesaian (Waket)",
        icon: CircleCheck,
        href: "/proker/done/waket",
        roles: [Role.Waket_1, Role.Waket_2],
      },
      {
        title: "Search Proker (Waket)",
        icon: Search,
        href: "/history",
        roles: [Role.Waket_1, Role.Waket_2],
      },
      {
        title: "Pengajuan Proker (Kabag)",
        icon: Hourglass,
        href: "/proker/pengajuan/kabag",
        roles: [Role.Kabag],
      },
      {
        title: "Buat Proker",
        icon: Calendar,
        href: "/proker",
        roles: [Role.Kabag, Role.Staff_Kabag],
      },
      {
        title: "Daftar Proker",
        icon: BookAudio,
        href: "/proker/daftar",
        roles: [Role.Kabag, Role.Staff_Kabag],
      }
    ]
  },
  {
    name: "STRUKTURAL",
    items: [
      {
        title: "Struktural",
        icon: Network,
        href: "/dashboard/struktural",
        roles: [Role.Kabag, Role.Waket_1, Role.Waket_2],
      }
    ]
  }
]

interface DashboardSidebarProps {
  isOpen?: boolean
  isMobile?: boolean
}

export function DashboardSidebar({ isOpen = true, isMobile = false }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("/api/auth/role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        })
        const { role } = await response.json()
        setUserRole(role)
      } catch (error) {
        console.error("Error fetching user role:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [])

  if (isMobile && !isOpen) return null

  const filteredMenuCategories = menuCategories.map(category => ({
    ...category,
    items: category.items.filter(item => userRole && item.roles.includes(userRole))
  })).filter(category => category.items.length > 0)

  const renderMenuItem = (item: typeof menuCategories[0]['items'][0]) => {
    const isActive = pathname === item.href
    return (
      <Link key={item.href} href={item.href}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={`w-full justify-start ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-700"} pl-4 h-10`}
        >
          <item.icon className="mr-3 h-4 w-4" />
          <span className="text-sm font-medium">{item.title}</span>
        </Button>
      </Link>
    )
  }

  const sidebarContent = (
    <div className="space-y-8">
      {filteredMenuCategories.map((category) => (
        <div key={category.name} className="space-y-2">
          <div className="text-xs uppercase tracking-wider text-gray-500 font-medium px-4">
            {category.name}
          </div>
          <div className="space-y-2">
            {category.items.map(renderMenuItem)}
          </div>
        </div>
      ))}
    </div>
  )

  if (isMobile) {
    return (
      <div className="md:hidden border-b bg-white p-4">
        {sidebarContent}
      </div>
    )
  }

  return (
    <div className="w-[280px] border-r bg-white px-4 py-6 hidden md:block">
      <div className="flex items-center gap-3 mb-8 pl-4">
        <div className="h-[36px] w-[36px] rounded-lg bg-blue-600 flex items-center justify-center">
          <BarChart3 className="h-[22px] w-[22px] text-white" />
        </div>
        <h1 className="text-2xl font-semibold">E-Kinerja</h1>
      </div>

      {sidebarContent}
    </div>
  )
}