/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/Dashboard/_layout";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Search, FileText, ArrowRight } from "lucide-react"
import { PointRenstra, Renstra, SubRenstra, PeriodeRenstra } from "@/types/renstra" 

export default function SelectPointRenstraPage() {
  const router = useRouter()
  const { error: showError } = useToast()

  const [loading, setLoading] = useState(false)
  const [periodes, setPeriodes] = useState<PeriodeRenstra[]>([])
  const [selectedPeriode, setSelectedPeriode] = useState<string | null>(null)
  const [renstraItems, setRenstraItems] = useState<Renstra[]>([])
  const [selectedRenstra, setSelectedRenstra] = useState<string | null>(null)
  const [subRenstraItems, setSubRenstraItems] = useState<SubRenstra[]>([])
  const [selectedSubRenstra, setSelectedSubRenstra] = useState<string | null>(null)
  const [pointRenstraItems, setPointRenstraItems] = useState<PointRenstra[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredPoints, setFilteredPoints] = useState<PointRenstra[]>([])

  // Fetch periods
  useEffect(() => {
    const fetchPeriodes = async () => {
      try {
        const response = await fetch("/api/periode")
        if (!response.ok) throw new Error("Failed to fetch periods")

        const data = await response.json()
        setPeriodes(data.periode || data)
      } catch (err) {
        console.error("Error fetching periods:", err)
        showError("Error", "Failed to fetch active periods")
      }
    }

    fetchPeriodes()
  }, [])

  // Fetch renstra when periode changes
  useEffect(() => {
    if (!selectedPeriode) return

    const fetchRenstra = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/renstra")
        if (!response.ok) throw new Error("Failed to fetch renstra")
        
        const data = await response.json()
        console.log('data renstra', data)
        setRenstraItems(data.renstra || data)
        setSelectedRenstra(null)
        setSelectedSubRenstra(null)
        setPointRenstraItems([])
      } catch (err) {
        console.error("Error fetching renstra:", err)
        showError("Error", "Failed to fetch renstra data")
      } finally {
        setLoading(false)
      }
    }

    fetchRenstra()
  }, [selectedPeriode])

  // Fetch sub-renstra when renstra changes
  useEffect(() => {
    if (!selectedRenstra) {
      setSubRenstraItems([])
      setSelectedSubRenstra(null)
      return
    }

    const fetchSubRenstra = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/sub?renstra_id=${selectedRenstra}`)
        if (!response.ok) throw new Error("Failed to fetch sub-renstra")

        const data = await response.json()
        setSubRenstraItems(data.sub_renstra || data)
        setSelectedSubRenstra(null)
        setPointRenstraItems([])
      } catch (err) {
        console.error("Error fetching sub-renstra:", err)
        showError("Error", "Failed to fetch sub-renstra data")
      } finally {
        setLoading(false)
      }
    }

    fetchSubRenstra()
  }, [selectedRenstra])

  // Fetch point-renstra when sub-renstra changes
  useEffect(() => {
    if (!selectedSubRenstra) {
      setPointRenstraItems([])
      return
    }

    const fetchPointRenstra = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/point?sub_renstra_id=${selectedSubRenstra}`)
        if (!response.ok) throw new Error("Failed to fetch point-renstra")

        const data = await response.json()
        const points = data.point_renstra || data
        setPointRenstraItems(points)
        setFilteredPoints(points)
      } catch (err) {
        console.error("Error fetching point-renstra:", err)
        showError("Error", "Failed to fetch point-renstra data")
      } finally {
        setLoading(false)
      }
    }

    fetchPointRenstra()
  }, [selectedSubRenstra])

  // Filter points based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPoints(pointRenstraItems)
      return
    }

    const filtered = pointRenstraItems.filter(
      (point) =>
        point.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        point.bidang?.nama.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    setFilteredPoints(filtered)
  }, [searchQuery, pointRenstraItems])

  const handleSelectPoint = (pointId: string) => {
    if (!selectedPeriode) {
      showError("Error", "Please select an active period first")
      return
    }

    router.push(`/proker/create/${pointId}?periode=${selectedPeriode}`)
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Select Point Renstra</h1>
            <p className="text-gray-500 mt-1">Select a point renstra to create a new program</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filter Options</CardTitle>
            <CardDescription>Select filters to find the appropriate point renstra</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Active Period</label>
                <Select value={selectedPeriode || ""} onValueChange={setSelectedPeriode}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {periodes.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No active periods available
                      </SelectItem>
                    ) : (
                      periodes.map((period) => (
                        <SelectItem key={period.id} value={period.id.toString()}>
                          {period.nama} ({period.tahun_awal} - {period.tahun_akhir})
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select renstra" />
                  </SelectTrigger>
                  <SelectContent>
                    {renstraItems.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No renstra available
                      </SelectItem>
                    ) : (
                      renstraItems.map((renstra) => (
                        <SelectItem key={renstra.id} value={renstra.id.toString()}>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub renstra" />
                  </SelectTrigger>
                  <SelectContent>
                    {subRenstraItems.length === 0 ? (
                      <SelectItem value="none" disabled>
                        No sub renstra available
                      </SelectItem>
                    ) : (
                      subRenstraItems.map((subRenstra) => (
                        <SelectItem key={subRenstra.id} value={subRenstra.id.toString()}>
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
              <h2 className="text-xl font-semibold">Point Renstra List</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search points..."
                  className="pl-10"
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
                  <p className="text-gray-500 mb-4">No point renstra found for the selected filters</p>
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPoints.map((point) => (
                  <Card key={point.id} className="overflow-hidden">
                    <CardHeader className="bg-gray-50 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg">{point.nama}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      {point.bidang && (
                        <div className="mb-4">
                          <span className="text-sm text-gray-500">Department:</span>
                          <div className="font-medium">
                            {point.bidang.nama}
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="bg-gray-50 flex justify-end">
                      <Button onClick={() => handleSelectPoint(point.id.toString())}>
                        Select <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}