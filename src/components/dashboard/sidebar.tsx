"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface DashboardSidebarProps {
  isOpen?: boolean
  isMobile?: boolean
}

export function DashboardSidebar({ isOpen = true, isMobile = false }: DashboardSidebarProps) {
  const pathname = usePathname()

  // State to track which dropdown menus are open
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    dashboard: true, // Dashboard menu starts open
    forms: false,
    tables: false,
    pages: false,
    charts: false,
  })

  // Toggle a dropdown menu
  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  // If it's mobile and not open, don't render
  if (isMobile && !isOpen) return null

  const sidebarContent = (
    <div className="space-y-2">
      <div className="mb-4 text-xs uppercase flex leading-[20px] text-gray-400 font-normal">MENU</div>

      {/* Dashboard Menu */}
      <div>
        <Button
          variant="ghost"
          className={`w-full justify-start gap-2 py-2.5 px-3 text-base font-normal h-auto ${
            pathname === "/" ? "bg-blue-50/50 text-blue-600" : "text-gray-600"
          }`}
          onClick={() => toggleMenu("dashboard")}
        >
          <LayoutDashboard className="h-5 w-5" />
          Dashboard
          {openMenus.dashboard ? (
            <ChevronUp className="h-4 w-4 ml-auto" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-auto" />
          )}
        </Button>

        {openMenus.dashboard && (
          <div className="pl-12">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:bg-blue-50 hover:text-blue-600 py-2.5 text-base font-normal h-auto"
              asChild
            >
              <Link href="/">Ecommerce</Link>
            </Button>
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        className="w-full justify-start gap-2 py-2.5 px-3 text-gray-600 text-base font-normal h-auto"
      >
        <Calendar className="h-5 w-5" />
        Calendar
      </Button>

      <Button
        variant="ghost"
        className={`w-full justify-start gap-2 py-2.5 px-3 text-base font-normal h-auto ${
          pathname === "/employees" ? "bg-blue-50/50 text-blue-600" : "text-gray-600"
        }`}
        asChild
      >
        <Link href="/employees">
          <Users className="h-5 w-5" />
          Employees
        </Link>
      </Button>

      <Button
        variant="ghost"
        className={`w-full justify-start gap-2 py-2.5 px-3 text-base font-normal h-auto ${
          pathname === "/products" ? "bg-blue-50/50 text-blue-600" : "text-gray-600"
        }`}
        asChild
      >
        <Link href="/products">
          <Package className="h-5 w-5" />
          Products
        </Link>
      </Button>

      <Button
        variant="ghost"
        className={`w-full justify-start gap-2 py-2.5 px-3 text-base font-normal h-auto ${
          pathname === "/users" ? "bg-blue-50/50 text-blue-600" : "text-gray-600"
        }`}
        asChild
      >
        <Link href="/users">
          <Users className="h-5 w-5" />
          Users
        </Link>
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start gap-2 py-2.5 px-3 text-gray-600 text-base font-normal h-auto"
      >
        <ShoppingCart className="h-5 w-5" />
        Orders
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start gap-2 py-2.5 px-3 text-gray-600 text-base font-normal h-auto"
      >
        <User className="h-5 w-5" />
        User Profile
      </Button>

      {/* Forms Menu */}
      <div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 py-2.5 px-3 text-gray-600 text-base font-normal h-auto"
          onClick={() => toggleMenu("forms")}
        >
          <FileText className="h-5 w-5" />
          Forms
          {openMenus.forms ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
        </Button>

        {openMenus.forms && (
          <div className="pl-12 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:bg-blue-50 hover:text-blue-600 py-2.5 text-base font-normal h-auto"
            >
              Form Elements
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:bg-blue-50 hover:text-blue-600 py-2.5 text-base font-normal h-auto"
            >
              Form Layout
            </Button>
          </div>
        )}
      </div>

      {/* Tables Menu */}
      <div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 py-2.5 px-3 text-gray-600 text-base font-normal h-auto"
          onClick={() => toggleMenu("tables")}
        >
          <Table2 className="h-5 w-5" />
          Tables
          {openMenus.tables ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
        </Button>

        {openMenus.tables && (
          <div className="pl-12 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:bg-blue-50 hover:text-blue-600 py-2.5 text-base font-normal h-auto"
            >
              Basic Tables
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:bg-blue-50 hover:text-blue-600 py-2.5 text-base font-normal h-auto"
            >
              Data Tables
            </Button>
          </div>
        )}
      </div>

      {/* Pages Menu */}
      <div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 py-2.5 px-3 text-gray-600 text-base font-normal h-auto"
          onClick={() => toggleMenu("pages")}
        >
          <FileText className="h-5 w-5" />
          Pages
          {openMenus.pages ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
        </Button>

        {openMenus.pages && (
          <div className="pl-12 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:bg-blue-50 hover:text-blue-600 py-2.5 text-base font-normal h-auto"
            >
              Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:bg-blue-50 hover:text-blue-600 py-2.5 text-base font-normal h-auto"
            >
              Profile
            </Button>
          </div>
        )}
      </div>

      <div className="mb-4 text-xs uppercase flex leading-[20px] text-gray-400 font-normal mt-6">OTHERS</div>

      {/* Charts Menu */}
      <div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 py-2.5 px-3 text-gray-600 text-base font-normal h-auto"
          onClick={() => toggleMenu("charts")}
        >
          <BarChart3 className="h-5 w-5" />
          Charts
          {openMenus.charts ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
        </Button>

        {openMenus.charts && (
          <div className="pl-12 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:bg-blue-50 hover:text-blue-600 py-2.5 text-base font-normal h-auto"
            >
              Bar Charts
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:bg-blue-50 hover:text-blue-600 py-2.5 text-base font-normal h-auto"
            >
              Line Charts
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  // Mobile sidebar
  if (isMobile) {
    return <div className="md:hidden border-b bg-white p-4">{sidebarContent}</div>
  }

  // Desktop sidebar
  return (
    <div className="w-[280px] border-r bg-white px-6 py-7 hidden md:block">
      <div className="flex items-center gap-3 mb-14">
        <div className="h-[36px] w-[36px] rounded-lg bg-blue-600 flex items-center justify-center">
          <BarChart3 className="h-[22px] w-[22px] text-white" />
        </div>
        <h1 className="text-2xl font-semibold">TailAdmin</h1>
      </div>

      <div className="space-y-7">{sidebarContent}</div>
    </div>
  )
}

