/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import {
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronUp,
  FileText,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Table2,
  User,
  Users,
  SquareUser,
  UserCog,
  Network,
  ShieldUser
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Role } from "@/types/user"


// Define menu items with role-based access
const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    roles: [Role.Admin, Role.Ketua, Role.Waket_1, Role.Waket_2, Role.Kabag, Role.Staff_Kabag], // All roles can access
  },
  // {
  //   title: "Calendar",
  //   icon: Calendar,
  //   href: "/calendar",
  //   roles: [Role.Admin, Role.Ketua, Role.Waket_1, Role.Waket_2, Role.Kabag, Role.Staff_Kabag], // All roles can access
  // },
  {
    title: "Bidang",
    icon: SquareUser,
    href: "/dashboard/bidang",
    roles: [Role.Admin], // Admin and management roles
  },
  // {
  //   title: "Products",
  //   icon: Package,
  //   href: "/products",
  //   roles: [Role.Admin, Role.Kabag], // Only Admin and Kabag
  // },
  {
    title: "Users",
    icon: ShieldUser,
    href: "/dashboard/user",
    roles: [Role.Admin], // Only Admin can manage users
  },
  {
    title: "Jabatan",
    icon: Network,
    href: "/dashboard/jabatan",
    roles: [Role.Admin], // Only Admin can manage positions
  },
  // {
  //   title: "Pages",
  //   icon: FileText,
  //   href: "#",
  //   submenu: [
  //     { title: "Settings", href: "/settings" },
  //     { title: "Profile", href: "/profile" },
  //   ],
  //   roles: [Role.Admin, Role.Ketua, Role.Waket_1, Role.Waket_2, Role.Kabag, Role.Staff_Kabag], // All roles can access
  // },
  {
    title: "Charts",
    icon: BarChart3,
    href: "#",
    submenu: [
      { title: "Bar Charts", href: "/charts/bar" },
      { title: "Line Charts", href: "/charts/line" },
    ],
    roles: [Role.Admin, Role.Ketua, Role.Waket_1, Role.Waket_2], // Admin and management roles
  },
]

interface DashboardSidebarProps {
  isOpen?: boolean
  isMobile?: boolean
}

export function DashboardSidebar({ isOpen = true, isMobile = false }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)

  // State to track which dropdown menus are open
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    dashboard: true, // Dashboard menu starts open
  })

  // Fetch user role on component mount
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

  // Toggle a dropdown menu
  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  // If it's mobile and not open, don't render
  if (isMobile && !isOpen) return null

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter((item) => {
    // If no user role or no roles specified for the item, don't show it
    if (!userRole) return false

    // Show the item if the user's role is in the item's allowed roles
    return item.roles.includes(userRole)
  })

  const renderMenuItem = (item: (typeof menuItems)[0]) => {
    const isActive = pathname === item.href
    const hasSubmenu = item.submenu && item.submenu.length > 0
    const isSubmenuOpen = openMenus[item.title.toLowerCase()]

    if (hasSubmenu) {
      return (
        <div key={item.title}>
          <Button
            variant="ghost"
            className={`w-full justify-start gap-2 py-2.5 px-3 text-base font-normal h-auto ${
              isActive ? "bg-blue-50/50 text-blue-600" : "text-gray-600"
            }`}
            onClick={() => toggleMenu(item.title.toLowerCase())}
          >
            <item.icon className="h-5 w-5" />
            {item.title}
            {isSubmenuOpen ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
          </Button>

          {isSubmenuOpen && item.submenu && (
            <div className="pl-12">
              {item.submenu.map((subItem) => (
                <Button
                  key={subItem.title}
                  variant="ghost"
                  className={`w-full justify-start text-gray-600 hover:bg-blue-50 hover:text-blue-600 py-2.5 text-base font-normal h-auto ${
                    pathname === subItem.href ? "bg-blue-50/50 text-blue-600" : ""
                  }`}
                  asChild
                >
                  <Link href={subItem.href}>{subItem.title}</Link>
                </Button>
              ))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Button
        key={item.title}
        variant="ghost"
        className={`w-full justify-start gap-2 py-2.5 px-3 text-base font-normal h-auto ${
          pathname === item.href ? "bg-blue-50/50 text-blue-600" : "text-gray-600"
        }`}
        asChild
      >
        <Link href={item.href}>
          <item.icon className="h-5 w-5" />
          {item.title}
        </Link>
      </Button>
    )
  }


  const sidebarContent = (
    <div className="space-y-2">
      <div className="mb-4 text-xs uppercase flex leading-[20px] text-gray-400 font-normal">MENU</div>

      {/* Render menu items based on user role */}
      {filteredMenuItems.map(renderMenuItem)}
    </div>
  )

  // Mobile sidebar
  if (isMobile) {
    return <div className="md:hidden border-b bg-white p-4">{sidebarContent}</div>
  }

  // Desktop sidebar
  return (
    <div className="w-[280px] border-r bg-white px-6 py-7 hidden md:block">
      <div className="flex items-center gap-3 mb-10">
        <div className="h-[36px] w-[36px] rounded-lg bg-blue-600 flex items-center justify-center">
          <BarChart3 className="h-[22px] w-[22px] text-white" />
        </div>
        <h1 className="text-2xl font-semibold">E- Renstra</h1>
      </div>

      <div className="space-y-6">{sidebarContent}</div>
    </div>
  )
}