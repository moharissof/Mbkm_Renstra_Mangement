/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, PlusCircle, FileText, Target } from "lucide-react"
import type { SubRenstra, PointRenstra } from "@/types/renstra"
import { Progress } from "@/components/ui/progress"

interface SubRenstraListProps {
  subRenstraItems: SubRenstra[]
  onEditSubRenstra: (subRenstra: SubRenstra) => void
  onDeleteSubRenstra: (subRenstra: SubRenstra) => void
  onAddPointRenstra: (subRenstra: SubRenstra) => void
  onEditPointRenstra: (pointRenstra: PointRenstra, subRenstra: SubRenstra) => void
  onDeletePointRenstra: (pointRenstra: PointRenstra) => void
}

export function SubRenstraList({
  subRenstraItems,
  onEditSubRenstra,
  onDeleteSubRenstra,
  onAddPointRenstra,
  onEditPointRenstra,
  onDeletePointRenstra,
}: SubRenstraListProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleAccordion = (id: string) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const calculateProgress = (points: PointRenstra[] | undefined) => {
    if (!points || points.length === 0) return 0

    const totalPercentage = points.reduce((sum, point) => sum + (point.presentase || 0), 0)
    return Math.round(totalPercentage / points.length)
  }

  return (
    <div className="space-y-2">
      {subRenstraItems.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            Tidak Ada Data Renstra hehehe
          </CardContent>
        </Card>
      ) : (
        subRenstraItems.map((subRenstra) => {
          const progress = calculateProgress(subRenstra.point_renstra)

          return (
            <Card key={subRenstra.id} className="overflow-hidden">
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{subRenstra.nama}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onAddPointRenstra(subRenstra)} title="Add Point">
                      <PlusCircle className="h-4 w-4 text-green-600 mr-1" />
                      <span className="hidden sm:inline">Add Point</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEditSubRenstra(subRenstra)}
                      title="Edit Sub-Renstra"
                    >
                      <Pencil className="h-4 w-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteSubRenstra(subRenstra)}
                      title="Delete Sub-Renstra"
                    >
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Progress value={progress} className="h-2" />
                  <span className="text-sm font-medium">{progress}%</span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* THIS IS THE ACCORDION PART */}
                <Accordion type="multiple" value={expandedItems} onValueChange={setExpandedItems} className="w-full">
                  <AccordionItem value={subRenstra.id} className="border-0">
                    <AccordionTrigger className="px-4 py-2 text-sm font-medium hover:bg-gray-50">
                      Point Renstra ({subRenstra.point_renstra?.length || 0})
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-0">
                      {!subRenstra.point_renstra || subRenstra.point_renstra.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          No points found. Click &ldquo;Add Point&#34; to create one.
                        </div>
                      ) : (
                        <div className="divide-y">
                          {subRenstra.point_renstra.map((point) => (
                            <div key={point.id} className="p-4 hover:bg-gray-50">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 flex items-center justify-center">
                                    <Target className="h-4 w-4 text-green-600" />
                                  </div>
                                  <div>
                                    <div className="font-medium">{point.nama}</div>
                                    <div className="text-sm text-gray-500">
                                      {point.bidang?.nama ? (
                                        <Badge variant="outline" className="mt-1">
                                          {point.bidang.nama}
                                        </Badge>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <div className="text-lg font-bold">{point.presentase || 0}%</div>
                                    <div className="text-xs text-gray-500">Completion</div>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => onEditPointRenstra(point, subRenstra)}
                                      title="Edit Point"
                                    >
                                      <Pencil className="h-4 w-4 text-gray-500" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => onDeletePointRenstra(point)}
                                      title="Delete Point"
                                    >
                                      <Trash2 className="h-4 w-4 text-gray-500" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                {/* END OF ACCORDION PART */}
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  )
}


