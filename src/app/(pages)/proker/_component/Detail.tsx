/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ProgramKerjaDetailsProps {
  programKerja: any
}

export function ProgramKerjaDetails({ programKerja }: ProgramKerjaDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Informasi Program */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Program</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {programKerja.deskripsi && (
            <div>
              <h3 className="text-sm font-medium mb-1">Deskripsi</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{programKerja.deskripsi}</p>
            </div>
          )}

          {programKerja.strategi_pencapaian && (
            <div>
              <h3 className="text-sm font-medium mb-1">Strategi Pencapaian</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{programKerja.strategi_pencapaian}</p>
            </div>
          )}

          {programKerja.baseline && (
            <div>
              <h3 className="text-sm font-medium mb-1">Baseline</h3>
              <p className="text-sm text-muted-foreground">{programKerja.baseline}</p>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium mb-1">Point Strategis</h3>
            <p className="text-sm text-muted-foreground">
              {programKerja.point_renstra?.nama || "Tidak ada informasi point strategis"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-1">Dibuat Oleh</h3>
            <p className="text-sm text-muted-foreground">
              {programKerja.users?.name || "Tidak diketahui"} ({programKerja.users?.email || ""})
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Indikator Program */}
      <Card>
        <CardHeader>
          <CardTitle>Indikator Program</CardTitle>
        </CardHeader>
        <CardContent>
          {programKerja.indikator_proker && programKerja.indikator_proker.length > 0 ? (
            <div className="space-y-4">
              {programKerja.indikator_proker.map((indikator: any, index: number) => (
                <div key={index} className="p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Nama Indikator</h3>
                      <p className="text-sm">{indikator.nama}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Target</h3>
                      <p className="text-sm">{indikator.target}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Satuan</h3>
                      <p className="text-sm">{indikator.satuan}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Tidak ada indikator tersedia</p>
          )}
        </CardContent>
      </Card>

      {/* Point Standar */}
      <Card>
        <CardHeader>
          <CardTitle>Point Standar</CardTitle>
        </CardHeader>
        <CardContent>
          {programKerja.point_standar && programKerja.point_standar.length > 0 ? (
            <div className="space-y-4">
              {programKerja.point_standar.map((point: any, index: number) => (
                <div key={index} className="p-4 border rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Nama Point</h3>
                      <p className="text-sm">{point.nama}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Nilai Point</h3>
                      <p className="text-sm">{point.point}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Tidak ada point standar tersedia</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

