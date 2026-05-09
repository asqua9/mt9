import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Clock, Calendar, Users, TrendingUp, Camera } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Demo data
const statsCards = [
  {
    title: "Bugün",
    value: "127",
    description: "Toplam giriş-çıkış",
    icon: Clock,
    trend: "+12%",
    trendUp: true,
  },
  {
    title: "Bu Ay",
    value: "3,842",
    description: "Toplam giriş-çıkış",
    icon: Calendar,
    trend: "+8%",
    trendUp: true,
  },
  {
    title: "Son 24 Saat",
    value: "156",
    description: "Giriş-çıkış kaydı",
    icon: TrendingUp,
    trend: "+15%",
    trendUp: true,
  },
  {
    title: "Tekil Araç",
    value: "89",
    description: "Farklı plaka sayısı",
    icon: Car,
    trend: "+3",
    trendUp: true,
  },
]

const recentEntries = [
  { plaka: "34 ABC 123", kamera: "Giriş Kapısı", tarih: "09.01.2024", saat: "14:32", guven: 98 },
  { plaka: "06 XYZ 789", kamera: "Çıkış Kapısı", tarih: "09.01.2024", saat: "14:28", guven: 95 },
  { plaka: "35 DEF 456", kamera: "Giriş Kapısı", tarih: "09.01.2024", saat: "14:15", guven: 99 },
  { plaka: "34 GHI 012", kamera: "Giriş Kapısı", tarih: "09.01.2024", saat: "14:02", guven: 97 },
  { plaka: "16 JKL 345", kamera: "Çıkış Kapısı", tarih: "09.01.2024", saat: "13:55", guven: 94 },
]

const registeredPlates = [
  { plaka: "34 ABC 123", isim: "Ahmet Yılmaz", durum: "İçeride" },
  { plaka: "06 XYZ 789", isim: "Mehmet Demir", durum: "Dışarıda" },
  { plaka: "35 DEF 456", isim: "Ayşe Kaya", durum: "İçeride" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Anlık giriş-çıkış durumu ve özet istatistikler</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="w-9 h-9 rounded-md bg-accent/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-accent" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-muted-foreground">{stat.description}</p>
                <span className={`text-sm font-medium ${stat.trendUp ? "text-green-600" : "text-red-600"}`}>
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Entries Table */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-accent" />
                  Son Giriş-Çıkışlar
                </CardTitle>
                <CardDescription>Son 5 plaka tanıma kaydı</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plaka</TableHead>
                  <TableHead>Kamera</TableHead>
                  <TableHead>Tarih</TableHead>
                  <TableHead>Saat</TableHead>
                  <TableHead className="text-right">Güven</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentEntries.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{entry.plaka}</TableCell>
                    <TableCell>{entry.kamera}</TableCell>
                    <TableCell>{entry.tarih}</TableCell>
                    <TableCell>{entry.saat}</TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        variant={entry.guven >= 95 ? "default" : "secondary"}
                        className={entry.guven >= 95 ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                      >
                        %{entry.guven}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Registered Plates */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-accent" />
              Kayıtlı Araçlar
            </CardTitle>
            <CardDescription>Son duruma göre araçlar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {registeredPlates.map((plate, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                  <div>
                    <p className="font-medium text-foreground">{plate.plaka}</p>
                    <p className="text-sm text-muted-foreground">{plate.isim}</p>
                  </div>
                  <Badge 
                    variant={plate.durum === "İçeride" ? "default" : "secondary"}
                    className={plate.durum === "İçeride" ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-muted text-muted-foreground"}
                  >
                    {plate.durum}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
