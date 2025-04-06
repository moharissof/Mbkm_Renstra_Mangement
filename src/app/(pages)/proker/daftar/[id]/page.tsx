/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Clock, Calendar, Filter, Eye, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardLayout } from "@/components/dashboard/layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function ApprovedProgramsPage() {
  const params = useParams();
  const { toast } = useToast();
  const router = useRouter();
  const [programs, setPrograms] = useState<any[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); 
  const userId = params.id as string;
  const [searchTerm, setSearchTerm] = useState("");

  const [periods, setPeriods] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("Disetujui");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");

  // Define status options
  const statusOptions = [
    { value: "Disetujui", label: "Disetujui" },
    { value: "On_Progress", label: "Dikerjakan" },
    { value: "Done", label: "Selesai" },
  ];

  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const response = await fetch("/api/periode-proker");
        if (!response.ok) throw new Error("Gagal mengambil periode");
        const data = await response.json();
        console.log("Fetched periods:", data);
        setPeriods(Array.isArray(data) ? data : data.periodeProker || []);
      } catch (error) {
        console.error("Error fetching periods:", error);
        setPeriods([]);
      }
    };

    fetchPeriods();
  }, []);

  useEffect(() => {
    const fetchPrograms = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        let url = `/api/proker?user_id=${userId}&status=${selectedStatus}`;

        if (selectedPeriod && selectedPeriod !== "all") {
          url += `&periode_proker_id=${selectedPeriod}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Gagal mengambil program kerja");

        const data = await response.json();
        setPrograms(data.programKerja || []);
        setFilteredPrograms(data.programKerja || []);
      } catch (error) {
        console.error("Gagal mengambil program kerja:", error);
        toast({
          title: "Error",
          description: "Gagal memuat program kerja",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [selectedStatus, selectedPeriod]);

  // Add search filter effect
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPrograms(programs);
    } else {
      const filtered = programs.filter(program =>
        program.nama.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPrograms(filtered);
    }
  }, [searchTerm, programs]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Disetujui":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">Disetujui</Badge>
        );
      case "On_Progress":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            Dikerjakan
          </Badge>
        );
      case "Done":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Selesai</Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 p-6">
          <h1 className="text-2xl font-bold">Program Kerja</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden border-none shadow-md">
                <CardHeader className="p-0">
                  <Skeleton className="h-40 w-full rounded-t-lg" />
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Program Kerja</h1>
        </div>

        {/* Filter Section */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <Select
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select
            value={selectedPeriod}
            onValueChange={(value) => setSelectedPeriod(value)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Semua Periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Periode</SelectItem>
              {Array.isArray(periods) &&
                periods.map((period) => (
                  <SelectItem key={period.id} value={period.id}>
                    {period.tahun}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari berdasarkan nama program..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((program) => {
              const startDate = new Date(program.waktu_mulai);
              const endDate = new Date(program.waktu_selesai);
              const daysLeft = Math.ceil(
                (endDate.getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              );

              return (
                <Card
                  key={program.id}
                  className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader className="p-0">
                    <div
                      className="h-40 w-full flex items-center justify-center text-white p-6 relative"
                      style={{
                        backgroundImage: "url('/images/proker.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      <div className="absolute inset-0 bg-black/50"></div>
                      <div className="absolute top-4 right-4">
                        {getStatusBadge(program.status)}
                      </div>
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/20 backdrop-blur-sm text-white">
                          {program.point_renstra?.bidang?.nama ||
                            "Tidak ada bidang"}
                        </Badge>
                      </div>
                      <div className="text-center z-10">
                        <h3 className="text-xl font-bold mb-2 line-clamp-2">
                          {program.nama}
                        </h3>
                        <p className="text-sm opacity-90">
                          {program.point_renstra?.nama ||
                            "Tidak ada poin strategis"}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {format(startDate, "dd MMM yyyy")} -{" "}
                          {format(endDate, "dd MMM yyyy")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {daysLeft > 0
                            ? `${daysLeft} hari tersisa`
                            : "Melebihi tenggat waktu"}
                        </span>
                      </div>
                      <Badge
                        variant={
                          daysLeft > 30
                            ? "outline"
                            : daysLeft > 7
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {daysLeft > 30
                          ? "Jangka Panjang"
                          : daysLeft > 7
                          ? "Akan Datang"
                          : "Mendesak"}
                      </Badge>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm font-medium">
                          {program.progress || 0}%
                        </span>
                      </div>
                      <Progress value={program.progress || 0} className="h-2" />
                    </div>

                    {program.indikator_proker &&
                      program.indikator_proker.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">
                            Indikator Utama:
                          </h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {program.indikator_proker
                              .slice(0, 2)
                              .map((indikator: any, idx: number) => (
                                <li key={idx} className="line-clamp-1">
                                  • {indikator.nama}: {indikator.target}{" "}
                                  {indikator.satuan}
                                </li>
                              ))}
                            {program.indikator_proker.length > 2 && (
                              <li>
                                • {program.indikator_proker.length - 2}{" "}
                                indikator lainnya
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <div className="flex flex-col gap-2 w-full">
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => router.push(`/proker/${program.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Detail Program
                      </Button>

                      {program.status === "On_Progress" && (
                        <div className="flex flex-col gap-2">
                          <Button
                            className="w-full"
                            onClick={() =>
                              router.push(`/proker/${program.id}/reports`)
                            }
                          >
                            Lihat Laporan
                          </Button>
                          <Button
                            className="w-full"
                            onClick={() =>
                              router.push(`/proker/${program.id}/file`)
                            }
                          >
                            Lihat File
                          </Button>
                        </div>
                      )}

                      {program.status === "Done" && (
                        <div className="flex flex-col gap-2">
                          <Button
                            className="w-full"
                            onClick={() =>
                              router.push(`/proker/${program.id}/reports`)
                            }
                          >
                            Lihat Laporan
                          </Button>
                          <Button
                            className="w-full"
                            onClick={() =>
                              router.push(`/proker/${program.id}/file`)
                            }
                          >
                            Lihat File
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">
                {searchTerm ? "Tidak ditemukan program" : "Tidak ada data"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? `Tidak ada program kerja dengan nama "${searchTerm}"`
                  : "Tidak ada program kerja yang ditemukan dengan filter yang dipilih."}
              </p>
              {searchTerm && (
                <Button
                  variant="ghost"
                  className="mt-4"
                  onClick={() => setSearchTerm("")}
                >
                  Reset Pencarian
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}