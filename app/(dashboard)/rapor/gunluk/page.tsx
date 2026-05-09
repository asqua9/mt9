"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, Download, Filter, Clock } from "lucide-react"

// Generate demo data for a specific date
const generateDailyData = (date: string) => {
  const baseData = [
    { plaka: "34 ABC 123", kamera: "Giriş Kapısı", saat: "08:15", guven: 98 },
    { plaka: "06 XYZ 789", kamera: "Giriş Kapısı", saat: "08:32", guven: 95 },
    { plaka: "35 DEF 456", kamera: "Çıkış Kapısı", saat: "09:10", guven: 99 },
    { plaka: "34 GHI 012", kamera: "Giriş Kapısı", saat: "09:45", guven: 97 },
    { plaka: "16 JKL 345", kamera: "Giriş Kapısı", saat: "10:20", guven: 94 },
    { plaka: "07 MNO 678", kamera: "Çıkış Kapısı", saat: "10:55", guven: 96 },
    { plaka: "41 PRS 901", kamera: "Giriş Kapısı", saat: "11:30", guven: 98 },
    { plaka: "34 TUV 234", kamera: "Giriş Kapısı", saat: "12:05", guven: 97 },
    { plaka: "34 ABC 123", kamera: "Çıkış Kapısı", saat: "12:45", guven: 99 },
    { plaka: "06 XYZ 789", kamera: "Çıkış Kapısı", saat: "13:20", guven: 96 },
    { plaka: "35 DEF 456", kamera: "Giriş Kapısı", saat: "14:00", guven: 98 },
    { plaka: "34 GHI 012", kamera: "Çıkış Kapısı", saat: "14:35", guven: 95 },
    { plaka: "16 JKL 345", kamera: "Çıkış Kapısı", saat: "15:10", guven: 97 },
    { plaka: "07 MNO 678", kamera: "Giriş Kapısı", saat: "15:45", guven: 98 },
    { plaka: "41 PRS 901", kamera: "Çıkış Kapısı", saat: "16:20", guven: 96 },
    { plaka: "34 TUV 234", kamera: "Çıkış Kapısı", saat: "17:00", guven: 99 },
    { plaka: "34 ABC 123", kamera: "Giriş Kapısı", saat: "17:35", guven: 97 },
    { plaka: "06 XYZ 789", kamera: "Giriş Kapısı", saat: "18:10", guven: 98 },
  ]
  return baseData.map((item, index) => ({
    id: index + 1,
    ...item,
    tarih: date,
  }))
}

export default function GunlukRaporPage() {
  const today = new Date().toISOString().split("T")[0]
  const [selectedDate, setSelectedDate] = useState(today)
  const [filterCamera, setFilterCamera] = useState<string>("")
  const [filterPlate, setFilterPlate] = useState<string>("")
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 10
  const allData = generateDailyData(selectedDate)

  // Filter data
  const filteredData = allData.filter((item) => {
    const matchesCamera = !filterCamera || item.kamera.toLowerCase().includes(filterCamera.toLowerCase())
    const matchesPlate = !filterPlate || item.plaka.toLowerCase().includes(filterPlate.toLowerCase())
    return matchesCamera && matchesPlate
  })

  // Paginate
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Summary stats
  const totalEntries = filteredData.filter((d) => d.kamera.includes("Giriş")).length
  const totalExits = filteredData.filter((d) => d.kamera.includes("Çıkış")).length
  const uniquePlates = new Set(filteredData.map((d) => d.plaka)).size
  const avgConfidence = Math.round(
    filteredData.reduce((acc, d) => acc + d.guven, 0) / filteredData.length
  )

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("tr-TR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Günlük Rapor</h1>
          <p className="text-muted-foreground">Seçilen güne ait tüm giriş-çıkış kayıtları</p>
        </div>
        <Button variant="outline" className="w-fit">
          <Download className="w-4 h-4 mr-2" />
          Excel İndir
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="w-4 h-4 text-accent" />
            Filtreler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="date">Tarih</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="plate-filter">Plaka</Label>
              <Input
                id="plate-filter"
                placeholder="Plaka ara..."
                value={filterPlate}
                onChange={(e) => {
                  setFilterPlate(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="camera-filter">Kamera</Label>
              <Input
                id="camera-filter"
                placeholder="Kamera ara..."
                value={filterCamera}
                onChange={(e) => {
                  setFilterCamera(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setFilterPlate("")
                  setFilterCamera("")
                  setCurrentPage(1)
                }}
                className="w-full"
              >
                Temizle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Toplam Giriş</p>
                <p className="text-2xl font-bold text-foreground">{totalEntries}</p>
              </div>
              <div className="w-10 h-10 rounded-md bg-green-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Toplam Çıkış</p>
                <p className="text-2xl font-bold text-foreground">{totalExits}</p>
              </div>
              <div className="w-10 h-10 rounded-md bg-red-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tekil Araç</p>
                <p className="text-2xl font-bold text-foreground">{uniquePlates}</p>
              </div>
              <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ort. Güven</p>
                <p className="text-2xl font-bold text-foreground">%{avgConfidence}</p>
              </div>
              <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            {formatDisplayDate(selectedDate)}
          </CardTitle>
          <CardDescription>{filteredData.length} kayıt bulundu</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plaka</TableHead>
                <TableHead>Kamera</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead>Saat</TableHead>
                <TableHead className="text-right">Güven Skoru</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {entry.plaka}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={entry.kamera.includes("Giriş") ? "default" : "secondary"}
                      className={
                        entry.kamera.includes("Giriş")
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-red-100 text-red-700 hover:bg-red-100"
                      }
                    >
                      {entry.kamera}
                    </Badge>
                  </TableCell>
                  <TableCell>{entry.tarih}</TableCell>
                  <TableCell>{entry.saat}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={entry.guven >= 95 ? "default" : "secondary"}
                      className={
                        entry.guven >= 95
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : ""
                      }
                    >
                      %{entry.guven}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Sayfa {currentPage} / {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Önceki
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Sonraki
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
