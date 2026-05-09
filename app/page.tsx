import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Camera, Car, Shield, BarChart3, Clock, Wifi } from "lucide-react"

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-accent flex items-center justify-center">
              <Camera className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">PlakaKontrol</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Giriş Yap
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight text-balance">
                Plaka Giriş-Çıkış Kontrol Paneli
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed text-pretty">
                Anlık girişler, günlük ve aylık raporlar tek panelde. Firmanızın araç giriş-çıkış takibini profesyonelce yönetin.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
                  Panele Git
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Plaka Ara
                </Button>
              </Link>
            </div>

            {/* Micro-copy */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wifi className="w-4 h-4" />
              <span>Veriler çevrimdışı modda güvenle saklanır, internet geldiğinde otomatik senkronlanır.</span>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="bg-card border border-border rounded-xl p-8 shadow-md">
              {/* Visual Grid */}
              <div className="grid grid-cols-2 gap-4">
                <FeatureCard 
                  icon={<Camera className="w-6 h-6" />}
                  title="Anlık Tanıma"
                  description="Kamera entegrasyonu ile gerçek zamanlı plaka okuma"
                />
                <FeatureCard 
                  icon={<Car className="w-6 h-6" />}
                  title="Araç Takibi"
                  description="Tüm araçların giriş-çıkış kayıtları"
                />
                <FeatureCard 
                  icon={<BarChart3 className="w-6 h-6" />}
                  title="Detaylı Raporlar"
                  description="Günlük ve aylık istatistikler"
                />
                <FeatureCard 
                  icon={<Shield className="w-6 h-6" />}
                  title="Güvenli Veri"
                  description="Şifreli ve korumalı veri depolama"
                />
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard value="7/24" label="Kesintisiz Çalışma" icon={<Clock className="w-5 h-5" />} />
          <StatCard value="99.9%" label="Tanıma Doğruluğu" icon={<Camera className="w-5 h-5" />} />
          <StatCard value="<1s" label="Tanıma Süresi" icon={<BarChart3 className="w-5 h-5" />} />
          <StatCard value="256-bit" label="Veri Şifreleme" icon={<Shield className="w-5 h-5" />} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; 2024 PlakaKontrol. Tüm hakları saklıdır.</p>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-foreground transition-colors">Gizlilik Politikası</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Kullanım Koşulları</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Destek</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group">
      <div className="w-10 h-10 rounded-md bg-accent/10 text-accent flex items-center justify-center mb-3 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function StatCard({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent mb-3">
        {icon}
      </div>
      <div className="text-2xl md:text-3xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </div>
  )
}
