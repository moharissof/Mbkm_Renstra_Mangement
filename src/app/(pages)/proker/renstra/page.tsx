/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/Dashboard/_layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Search,
  FileText,
  ArrowRight,
  Lightbulb,
  Target,
  BarChart3,
  BookOpen,
} from "lucide-react";
import type {
  PointRenstra,
  Renstra,
  SubRenstra,
  PeriodeRenstra,
} from "@/types/renstra";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

export default function SelectPointRenstraPage() {
  const router = useRouter();
  const { error: showError } = useToast();

  const [loading, setLoading] = useState(false);
  const [periodes, setPeriodes] = useState<PeriodeRenstra[]>([]);
  const [selectedPeriode, setSelectedPeriode] = useState<string | null>(null);
  const [renstraItems, setRenstraItems] = useState<Renstra[]>([]);
  const [selectedRenstra, setSelectedRenstra] = useState<string | null>(null);
  const [subRenstraItems, setSubRenstraItems] = useState<SubRenstra[]>([]);
  const [selectedSubRenstra, setSelectedSubRenstra] = useState<string | null>(
    null
  );
  const [pointRenstraItems, setPointRenstraItems] = useState<PointRenstra[]>(
    []
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPoints, setFilteredPoints] = useState<PointRenstra[]>([]);
  const [aiSuggestionOpen, setAiSuggestionOpen] = useState(false);
  const [currentPoint, setCurrentPoint] = useState<PointRenstra | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // Fetch periods

  useEffect(() => {
    const fetchPeriodes = async () => {
      try {
        const response = await fetch("/api/periode");
        if (!response.ok) throw new Error("Failed to fetch periods");

        const data = await response.json();
        setPeriodes(data.periode || data);
      } catch (err) {
        console.error("Error fetching periods:", err);
        showError("Error", "Failed to fetch active periods");
      }
    };

    fetchPeriodes();
  }, []);

  // Fetch renstra when periode changes
  useEffect(() => {
    if (!selectedPeriode) return;

    const fetchRenstra = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/renstra");
        if (!response.ok) throw new Error("Failed to fetch renstra");

        const data = await response.json();
        console.log("data renstra", data);
        setRenstraItems(data.renstra || data);
        setSelectedRenstra(null);
        setSelectedSubRenstra(null);
        setPointRenstraItems([]);
      } catch (err) {
        console.error("Error fetching renstra:", err);
        showError("Error", "Failed to fetch renstra data");
      } finally {
        setLoading(false);
      }
    };

    fetchRenstra();
  }, [selectedPeriode]);

  // Fetch sub-renstra when renstra changes
  useEffect(() => {
    if (!selectedRenstra) {
      setSubRenstraItems([]);
      setSelectedSubRenstra(null);
      return;
    }

    const fetchSubRenstra = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/sub?renstra_id=${selectedRenstra}`);
        if (!response.ok) throw new Error("Failed to fetch sub-renstra");

        const data = await response.json();
        setSubRenstraItems(data.sub_renstra || data);
        setSelectedSubRenstra(null);
        setPointRenstraItems([]);
      } catch (err) {
        console.error("Error fetching sub-renstra:", err);
        showError("Error", "Failed to fetch sub-renstra data");
      } finally {
        setLoading(false);
      }
    };

    fetchSubRenstra();
  }, [selectedRenstra]);

  // Fetch point-renstra when sub-renstra changes
  useEffect(() => {
    if (!selectedSubRenstra) {
      setPointRenstraItems([]);
      return;
    }

    const fetchPointRenstra = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/point?sub_renstra_id=${selectedSubRenstra}`
        );
        if (!response.ok) throw new Error("Failed to fetch point-renstra");

        const data = await response.json();
        const points = data.point_renstra || data;
        setPointRenstraItems(points);
        setFilteredPoints(points);
      } catch (err) {
        console.error("Error fetching point-renstra:", err);
        showError("Error", "Failed to fetch point-renstra data");
      } finally {
        setLoading(false);
      }
    };

    fetchPointRenstra();
  }, [selectedSubRenstra]);

  // Filter points based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPoints(pointRenstraItems);
      return;
    }

    const filtered = pointRenstraItems.filter(
      (point) =>
        point.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        point.bidang?.nama.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredPoints(filtered);
  }, [searchQuery, pointRenstraItems]);

  const handleSelectPoint = (pointId: string) => {
    if (!selectedPeriode) {
      showError("Error", "Please select an active period first");
      return;
    }

    router.push(`/proker/create/${pointId}?periode=${selectedPeriode}`);
  };
  const getRandomIcon = (index: number) => {
    const icons = [
      <Target key="target" className="h-5 w-5 text-emerald-600" />,
      <BarChart3 key="chart" className="h-5 w-5 text-blue-600" />,
      <BookOpen key="book" className="h-5 w-5 text-purple-600" />,
      <FileText key="file" className="h-5 w-5 text-amber-600" />,
    ];
    return icons[index % icons.length];
  };

  
  const getIconBgColor = (index: number) => {
    const colors = [
      "bg-emerald-100",
      "bg-blue-100",
      "bg-purple-100",
      "bg-amber-100",
    ];
    return colors[index % colors.length];
  };

  const handleShowAiSuggestions = (point: PointRenstra) => {
    setCurrentPoint(point);
    setAiSuggestionOpen(true);
    setAiLoading(true);

    // Simulate AI response - in a real app, this would be an API call to Gemini AI
    setTimeout(() => {
      const fakeSuggestions = [
        `Program Pelatihan: "${
          point.nama
        }" - Mengadakan workshop dan pelatihan untuk meningkatkan kapasitas tim dalam bidang ${
          point.bidang?.nama || "terkait"
        }.`,
        `Pengembangan Sistem: Membangun platform digital untuk mendukung implementasi "${point.nama}" secara efektif dan terukur.`,
        `Kolaborasi Lintas Departemen: Menjalin kerjasama dengan departemen ${
          point.bidang?.nama === "IT"
            ? "Marketing dan Operasional"
            : "IT dan Keuangan"
        } untuk mengoptimalkan pencapaian target.`,
        `Evaluasi Berkala: Menyusun mekanisme monitoring dan evaluasi untuk memastikan program "${point.nama}" berjalan sesuai rencana strategis.`,
      ];
      setAiSuggestions(fakeSuggestions);
      setAiLoading(false);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Pilih Point Renstra</h1>
            <p className="text-gray-500 mt-1">
              Pilih Salah Satu Point Untuk Acuan Pada Program Kerja{" "}
            </p>
          </div>
        </div>
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
                  Pilih Point Renstra
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

        </div>
        <Card className="border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Filter Options
            </CardTitle>
            <CardDescription>
              Pilih Filter Renstra Agar Sesuai Dengan Program Kerja Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Periode Aktif</label>
                <Select
                  value={selectedPeriode || ""}
                  onValueChange={setSelectedPeriode}
                >
                  <SelectTrigger className="border-gray-300 bg-white">
                    <SelectValue placeholder="Pilih Periode" />
                  </SelectTrigger>
                  <SelectContent>
                    {periodes.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No active periods available
                      </SelectItem>
                    ) : (
                      periodes.map((period) => (
                        <SelectItem
                          key={period.id}
                          value={period.id.toString()}
                        >
                          {period.nama} ({period.tahun_awal} -{" "}
                          {period.tahun_akhir})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Renstra</label>
                <Select
                  value={selectedRenstra || ""}
                  onValueChange={setSelectedRenstra}
                  disabled={!selectedPeriode || loading}
                >
                  <SelectTrigger className="border-gray-300 bg-white">
                    <SelectValue placeholder="Pilih Renstra" />
                  </SelectTrigger>
                  <SelectContent>
                    {renstraItems.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No renstra available
                      </SelectItem>
                    ) : (
                      renstraItems.map((renstra) => (
                        <SelectItem
                          key={renstra.id}
                          value={renstra.id.toString()}
                        >
                          {renstra.nama}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sub Renstra</label>
                <Select
                  value={selectedSubRenstra || ""}
                  onValueChange={setSelectedSubRenstra}
                  disabled={!selectedRenstra || loading}
                >
                  <SelectTrigger className="border-gray-300 bg-white">
                    <SelectValue placeholder="Pilih sub renstra" />
                  </SelectTrigger>
                  <SelectContent>
                    {subRenstraItems.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No sub renstra available
                      </SelectItem>
                    ) : (
                      subRenstraItems.map((subRenstra) => (
                        <SelectItem
                          key={subRenstra.id}
                          value={subRenstra.id.toString()}
                        >
                          {subRenstra.nama}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedSubRenstra && (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Point Renstra List
              </h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search points..."
                  className="pl-10 border-gray-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredPoints.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <p className="text-gray-500 mb-4">
                    No point renstra found for the selected filters
                  </p>
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPoints.map((point, index) => (
                  <Card
                    key={point.id}
                    className={`overflow-hidden border-2 hover:shadow-lg transition-all duration-300
                    )}`}
                  >
                    <CardHeader className="pb-3 relative">
                      <div className="flex items-center gap-3 relative z-10">
                        <div
                          className={`h-10 w-10 rounded-full ${getIconBgColor(
                            index
                          )} flex items-center justify-center`}
                        >
                          {getRandomIcon(index)}
                        </div>
                        <CardTitle className="text-lg line-clamp-2">
                          {point.nama}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {point.bidang && (
                        <div className="mb-4">
                          <span className="text-sm text-gray-500">
                            Bidang:
                          </span>
                          <div className="font-medium flex items-center gap-2 mt-1">
                            <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                              <BarChart3 className="h-3.5 w-3.5 text-gray-600" />
                            </div>
                            {point.bidang.nama}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="bg-white flex justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleShowAiSuggestions(point)}
                      >
                        <Lightbulb className="h-4 w-4 text-amber-500" />
                        <span>Ide Proker</span>
                      </Button>
                      <Button
                        onClick={() => handleSelectPoint(point.id.toString())}
                        className="gap-1"
                      >
                        <span>Pilih</span>
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={aiSuggestionOpen} onOpenChange={setAiSuggestionOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              Rekomendasi Program Kerja
            </DialogTitle>
            <DialogDescription>
              {currentPoint && (
                <span>
                  Ide program kerja untuk point:{" "}
                  <strong>{currentPoint.nama}</strong>
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {aiLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-sm text-gray-500">
                  Generating recommendations...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {aiSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <p className="text-sm">{suggestion}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
