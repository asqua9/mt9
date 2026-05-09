"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Calendar, TrendingUp, Download, BarChart3, Car } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

// Generate demo monthly data
const generateMonthlyData = (year: number, month: number) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const data = []
  
  for (let day = 1; day <= daysInMonth; day++) {
    const toplam = Math.floor(Math.random() * 80) + 60 // 60-140 arası
    const tekil = Math.floor(toplam * (0.4 + Math.random() * 0.3)) // %40-70 arası tekil
    data.push({
      gun: day,
      tarih: `${day.toString().padStart(2, "0")}.${(month + 1).toString().padStart(2, "0")}.${year}`,
      toplam,
      tekil,
    })
  }
  
  return data
}

const months = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
]

const chartConfig = {
  toplam: {
    label: "Toplam",
    color: "var(--accent)",
  },
  tekil: {
    label: "Tekil",
    color: "var(--muted-foreground)",
  },
}

export default function AylikRaporPage() {
  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()
  
  const [selectedYear, setSelectedYear] = useState(currentYear.toString())
  const [selectedMonth, setSelectedMonth] = useState(currentMonth.toString())

  const monthlyData = generateMonthlyData(parseInt(selectedYear), parseInt(selectedMonth))

  // Summary stats
  const totalEntries = monthlyData.reduce((acc, d) => acc + d.toplam, 0)
  const avgDaily = Math.round(totalEntries / monthlyData.length)
  const maxDay = monthlyData.reduce((max, d) => d.toplam > max.toplam ? d : max, monthlyData[0])
  const totalUnique = monthlyData.reduce((acc, d) => acc + d.tekil, 0)

  // Chart data (limit to show nicely)
  const chartData = monthlyData.map((d) => ({
    name: d.gun.toString(),
    toplam: d.toplam,
    tekil: d.tekil,
  }))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Aylık Rapor</h1>
          <p className="text-muted-foreground">Seçilen aya ait özet istatistikler ve günlük dağılım</p>
        </div>
        <Button variant="outline" className="w-fit">
          <Download className="w-4 h-4 mr-2" />
          Excel İndir
        </Button>
      </div>

      {/* Month/Year Selector */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="w-4 h-4 text-accent" />
            Dönem Seçimi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <Label>Yıl</Label>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={(currentYear - 1).toString()}>{currentYear - 1}</SelectItem>
                  <SelectItem value={currentYear.toString()}>{currentYear}</SelectItem>
                  <SelectItem value={(currentYear + 1).toString()}>{currentYear + 1}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ay</Label>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <p className="text-sm text-muted-foreground">Toplam Giriş-Çıkış</p>
                <p className="text-2xl font-bold text-foreground">{totalEntries.toLocaleString("tr-TR")}</p>
              </div>
              <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Günlük Ortalama</p>
                <p className="text-2xl font-bold text-foreground">{avgDaily}</p>
              </div>
              <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En Yoğun Gün</p>
                <p className="text-2xl font-bold text-foreground">{maxDay.gun}. gün</p>
                <p className="text-xs text-muted-foreground">{maxDay.toplam} kayıt</p>
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
                <p className="text-sm text-muted-foreground">Toplam Tekil Araç</p>
                <p className="text-2xl font-bold text-foreground">{totalUnique.toLocaleString("tr-TR")}</p>
              </div>
              <div className="w-10 h-10 rounded-md bg-accent/10 flex items-center justify-center">
                <Car className="w-5 h-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-accent" />
            Günlük Giriş-Çıkış Grafiği
          </CardTitle>
          <CardDescription>
            {months[parseInt(selectedMonth)]} {selectedYear} - Günlük dağılım
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="name" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  className="fill-muted-foreground"
                />
                <YAxis 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  className="fill-muted-foreground"
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="toplam" fill="var(--color-toplam)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="tekil" fill="var(--color-tekil)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Günlük Detay</CardTitle>
          <CardDescription>
            {months[parseInt(selectedMonth)]} {selectedYear} - Tüm günler
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gün</TableHead>
                <TableHead>Tarih</TableHead>
                <TableHead className="text-right">Toplam</TableHead>
                <TableHead className="text-right">Tekil Araç</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlyData.map((day) => (
                <TableRow key={day.gun}>
                  <TableCell>
                    <Badge variant="outline">{day.gun}</Badge>
                  </TableCell>
                  <TableCell>{day.tarih}</TableCell>
                  <TableCell className="text-right font-medium">{day.toplam}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant="secondary"
                      className="bg-accent/10 text-accent hover:bg-accent/10"
                    >
                      {day.tekil}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
