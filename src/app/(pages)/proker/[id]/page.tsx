import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import {
  ChevronLeft,
  Calendar,
  DollarSign,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ProgramKerjaDetails } from "../_component/Detail";
import { PageLoader } from "@/components/ui/loader";
import { DashboardLayout } from "@/components/Dashboard/_layout";

async function getProgramKerja(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_APP_URL}/api/proker/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch program kerja");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching program kerja:", error);
    throw error;
  }
}

export default async function ProgramKerjaViewPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <Suspense fallback={<PageLoader />}>
      <ProgramKerjaView id={params.id} />
    </Suspense>
  );
}

async function ProgramKerjaView({ id }: { id: string }) {
  const programKerja = await getProgramKerja(id);

  if (!programKerja) {
    notFound();
  }

  // Format dates
  const startDate = programKerja.waktu_mulai
    ? new Date(programKerja.waktu_mulai)
    : null;
  const endDate = programKerja.waktu_selesai
    ? new Date(programKerja.waktu_selesai)
    : null;

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Draft":
        return "bg-gray-100 text-gray-800";
      case "Planning":
        return "bg-blue-100 text-blue-800";
      case "Disetujui":
        return "bg-green-100 text-green-800";
      case "Ditolak":
        return "bg-red-100 text-red-800";
      case "Done":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Breadcrumb and Back Button */}
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/dashboard"
                  className="text-sm hover:text-primary"
                >
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/proker"
                  className="text-sm hover:text-primary"
                >
                  Program Kerja
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink className="text-sm font-medium text-primary">
                  {programKerja.nama}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Link href="/proker">
            <Button variant="outline" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              <span>Kembali</span>
            </Button>
          </Link>
        </div>
        {/* Banner and Header */}
        <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-md">
          <Image
            src="/images/proker.jpg"
            alt="Program Banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 flex flex-col justify-end p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  {programKerja.nama}
                </h1>
                <p className="text-white/90 mt-1">
                  {programKerja.point_renstra?.bidang?.nama}
                </p>
              </div>
              <Badge
                className={`${getStatusBadgeClass(
                  programKerja.status
                )} text-sm px-3 py-1 rounded-full font-medium`}
              >
                {programKerja.status}
              </Badge>
            </div>
          </div>
        </div>
        {/* Key Information Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Periode Card */}
          <Card className="border shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-7">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-md">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Periode</p>
                  <p className="text-base font-semibold">
                    {programKerja.periode_proker?.tahun || "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Jangka Waktu Card */}
          <Card className="border shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-md">
                  <Clock className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">
                    Jangka Waktu
                  </p>
                  <p className="text-base font-semibold">
                    {startDate && endDate
                      ? `${format(startDate, "dd MMM yyyy")} - ${format(
                          endDate,
                          "dd MMM yyyy"
                        )}`
                      : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Anggaran Card */}
          <Card className="border shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-7">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-md">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Anggaran</p>
                  <p className="text-base font-semibold">
                    {programKerja.anggaran
                      ? `Rp ${Number(programKerja.anggaran).toLocaleString(
                          "id-ID"
                        )}`
                      : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Volume Card */}
          <Card className="border-2 shadow-sm hover:shadow transition-shadow">
            <CardContent className="p-7">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 rounded-md">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Volume</p>
                  <p className="text-base font-semibold">
                    {programKerja.volume || "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        {/* Progress Card */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  {programKerja.progress || 0}% selesai
                </span>
                <span className="text-sm font-medium text-gray-500">
                  {100 - (programKerja.progress || 0)}% tersisa
                </span>
              </div>
              <Progress
                value={programKerja.progress || 0}
                className="h-3 bg-gray-100"
                indicatorColor="bg-blue-600"
              />
            </div>
          </CardContent>
        </Card>

        {/* Detail Program */}
        <ProgramKerjaDetails programKerja={programKerja} />

        {/* Status Persetujuan */}
        {(programKerja.first_approval_status ||
          programKerja.second_approval_status) && (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Status Persetujuan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {programKerja.first_approval_status && (
                <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                  {programKerja.first_approval_status === "Disetujui" ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium">Persetujuan Pertama</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Status:{" "}
                      <span className="font-medium capitalize">
                        {programKerja.first_approval_status.toLowerCase()}
                      </span>
                    </p>
                    {programKerja.status_periode_first && (
                      <p className="text-sm text-gray-600 mt-1">
                        Periode: {programKerja.status_periode_first}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {programKerja.second_approval_status && (
                <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                  {programKerja.second_approval_status === "Disetujui" ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium">Persetujuan Kedua</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Status:{" "}
                      <span className="font-medium capitalize">
                        {programKerja.second_approval_status.toLowerCase()}
                      </span>
                    </p>
                    {programKerja.status_periode_second && (
                      <p className="text-sm text-gray-600 mt-1">
                        Periode: {programKerja.status_periode_second}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {programKerja.alasan_penolakan && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                  <p className="font-medium text-red-700">Alasan Penolakan:</p>
                  <p className="text-sm text-red-600 mt-1">
                    {programKerja.alasan_penolakan}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
