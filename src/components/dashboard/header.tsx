/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, Menu, Search, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { NotificationDropdown } from "@/components/Notification/drop-down";

interface DashboardHeaderProps {
  onMenuToggle: () => void;
}

export function DashboardHeader({ onMenuToggle }: DashboardHeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState<{ id: string; name: string; email: string; photo: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  // Close the menu when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, []);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/auth/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Pastikan cookie dikirim
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router, supabase]);

  // Handle logout
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

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
        <NotificationDropdown userId={userData?.id || ""} />
        <div className="relative" ref={userMenuRef}>
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setUserMenuOpen(!userMenuOpen)}>
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden">
              {loading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : userData?.photo ? (
                <img src="https://lh3.googleusercontent.com/d/1Sbmh52FpvmB0mrIDQocrWDxnwPObOF1Q=s300" alt="User" className="h-full w-full object-cover" />
              ) : (
                <img src="/images/orang.png" alt="User" className="h-full w-full object-cover" />
              )}
            </div>
            <span className="font-medium hidden md:inline-block">
              {loading ? "Loading..." : userData?.name || "User"}
            </span>
            <ChevronDown
              className={`h-4 w-4 hidden md:block transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
            />
          </div>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-medium text-gray-900">{userData?.name || "User"}</p>
                <p className="text-xs text-gray-500 truncate">{userData?.email || "No email"}</p>
              </div>
              <a href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <User className="h-4 w-4 mr-2" />
                My Profile
              </a>
              <div className="border-t my-1"></div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}