/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, LogOut, Menu, Search, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface DashboardHeaderProps {
  onMenuToggle: () => void
}

export function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close the menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="flex items-center justify-between border-b bg-white p-4">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuToggle}>
        <Menu className="h-6 w-6" />
      </Button>

      <div className="relative w-full max-w-md mx-auto md:mx-0">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input placeholder="Search or type command..." className="pl-10 pr-16 py-2 border-gray-200 rounded-md w-full" />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
          ⌘K
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-orange-500"></div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </Button>

        <div className="relative" ref={userMenuRef}>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setUserMenuOpen(!userMenuOpen)}>
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
              <img
                src="/images/orang.png"
                alt="User"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-medium hidden md:inline-block">Haris</span>
            <ChevronDown
              className={`h-4 w-4 hidden md:block transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
            />
          </div>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium text-gray-900">Musharof Chy</p>
                <p className="text-xs text-gray-500 truncate">musharof@example.com</p>
              </div>
              <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <User className="h-4 w-4 mr-2" />
                My Profile
              </a>
              <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </a>
              <div className="border-t my-1"></div>
              <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

