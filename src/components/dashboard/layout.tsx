"use client";

import { useState, Suspense } from "react";
import { DashboardHeader } from "./header";
import { DashboardSidebar } from "./sidebar";
import type { ReactNode } from "react";
import { PageLoader } from "../ui/loader";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex min-h-screen font-['Outfit']">
      {/* Desktop Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        <DashboardHeader onMenuToggle={toggleMenu} />

        {/* Mobile Sidebar */}
        {isMenuOpen && <DashboardSidebar isMobile isOpen={isMenuOpen} />}

        <Suspense fallback={<PageLoader />}>{children}</Suspense>
      </div>
    </div>
  );
}
