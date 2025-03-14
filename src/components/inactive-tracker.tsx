"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 menit

export default function InactivityTracker() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;

    const resetTimer = () => {
      // Reset timer setiap ada aktivitas
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(logoutUser, INACTIVITY_TIMEOUT);
    };

    const logoutUser = async () => {
      // Logout user menggunakan Supabase
      await supabase.auth.signOut();
      router.push("/login"); 
    };

    // Tambahkan event listener untuk melacak aktivitas
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("scroll", resetTimer);

    // Mulai timer saat komponen dimount
    resetTimer();

    // Bersihkan event listener saat komponen unmount
    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("scroll", resetTimer);
    };
  }, [router, supabase]);

  return null; // Komponen ini tidak merender apa pun
}