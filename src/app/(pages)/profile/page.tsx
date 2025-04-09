/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User as UserIcon, Lock } from "lucide-react";
import { ProfileForm } from "./_component/ProfileForm";
import { PasswordForm } from "./_component/PasswordForm";
import { ProfileSkeleton } from "./_component/ProfileSkeleton";
import { User } from "@/types/user";


export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/auth/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const { user: userData } = await response.json();
        setUser({
            ...userData,
            no_telp: userData.no_telp || "", // Provide default empty string
            jabatan_id: userData.jabatan_id ?? null, // Ensure jabatan_id is null if undefined
            jabatan: userData.jabatan || { nama: "Tidak ada jabatan" },
            isVerified: !!userData.isVerified, // Ensure isVerified is always a boolean
          });
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Gagal memuat data pengguna",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (isLoading || !user) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <ProfileSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Profil Pengguna</h1>
            <p className="text-gray-500 mt-1">Kelola informasi profil Anda</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Summary Card */}
          <Card className="md:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle>Informasi Pengguna</CardTitle>
              <CardDescription>Ringkasan informasi profil Anda</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center pt-6">
              <div className="relative mb-4">
                <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
                  <img
                    src={user.photo || "/images/orang.png"}
                    alt={user.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/images/orang.png";
                    }}
                  />
                </div>
              </div>
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <p className="text-gray-500 text-sm mt-1">{user.email}</p>
              <div className="mt-4 w-full">
                <div className="bg-gray-50 p-3 rounded-lg mb-2">
                  <p className="text-sm text-gray-500">Jabatan</p>
                  <p className="font-medium">
                    {user.jabatan?.nama || "Tidak ada jabatan"}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">NIKP</p>
                  <p className="font-medium">{user.nikp || "-"}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Status Verifikasi</p>
                  <p className="font-medium">{user.isVerified ? "Terverifikasi" : "Belum Terverifikasi"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Edit Tabs */}
          <Card className="md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle>Edit Profil</CardTitle>
              <CardDescription>
                Perbarui informasi profil dan kata sandi Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="profile" className="flex items-center">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profil
                  </TabsTrigger>
                  <TabsTrigger value="password" className="flex items-center">
                    <Lock className="mr-2 h-4 w-4" />
                    Kata Sandi
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="profile">
                  <ProfileForm user={user} />
                </TabsContent>
                <TabsContent value="password">
                  <PasswordForm userId={user.id} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}