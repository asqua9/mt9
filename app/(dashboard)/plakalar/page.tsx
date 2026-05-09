"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Pencil, Trash2, Car } from "lucide-react"

// Demo data
const initialPlates = [
  { id: 1, plaka: "34 ABC 123", isim: "Ahmet Yılmaz", telefon: "0532 123 4567", not: "Şirket aracı", olusturulma: "01.01.2024" },
  { id: 2, plaka: "06 XYZ 789", isim: "Mehmet Demir", telefon: "0533 234 5678", not: "Personel", olusturulma: "05.01.2024" },
  { id: 3, plaka: "35 DEF 456", isim: "Ayşe Kaya", telefon: "0534 345 6789", not: "Müdür aracı", olusturulma: "10.01.2024" },
  { id: 4, plaka: "34 GHI 012", isim: "Fatma Öz", telefon: "0535 456 7890", not: "Misafir", olusturulma: "12.01.2024" },
  { id: 5, plaka: "16 JKL 345", isim: "Ali Veli", telefon: "0536 567 8901", not: "Tedarikçi", olusturulma: "15.01.2024" },
  { id: 6, plaka: "07 MNO 678", isim: "Zeynep Ak", telefon: "0537 678 9012", not: "VIP", olusturulma: "18.01.2024" },
  { id: 7, plaka: "41 PRS 901", isim: "Can Yıldız", telefon: "0538 789 0123", not: "Personel", olusturulma: "20.01.2024" },
  { id: 8, plaka: "34 TUV 234", isim: "Elif Deniz", telefon: "0539 890 1234", not: "Şirket aracı", olusturulma: "22.01.2024" },
]

export default function PlakalarPage() {
  const [plates, setPlates] = useState(initialPlates)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedPlate, setSelectedPlate] = useState<typeof initialPlates[0] | null>(null)
  const [formData, setFormData] = useState({
    plaka: "",
    isim: "",
    telefon: "",
    not: "",
  })

  const itemsPerPage = 5

  // Filter plates based on search
  const filteredPlates = plates.filter(
    (plate) =>
      plate.plaka.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plate.isim.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plate.telefon.includes(searchQuery)
  )

  // Paginate
  const totalPages = Math.ceil(filteredPlates.length / itemsPerPage)
  const paginatedPlates = filteredPlates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleAdd = () => {
    const newPlate = {
      id: Date.now(),
      ...formData,
      olusturulma: new Date().toLocaleDateString("tr-TR"),
    }
    setPlates([newPlate, ...plates])
    setFormData({ plaka: "", isim: "", telefon: "", not: "" })
    setIsAddOpen(false)
  }

  const handleEdit = () => {
    if (!selectedPlate) return
    setPlates(
      plates.map((p) =>
        p.id === selectedPlate.id
          ? { ...p, ...formData }
          : p
      )
    )
    setIsEditOpen(false)
    setSelectedPlate(null)
  }

  const handleDelete = () => {
    if (!selectedPlate) return
    setPlates(plates.filter((p) => p.id !== selectedPlate.id))
    setIsDeleteOpen(false)
    setSelectedPlate(null)
  }

  const openEditDialog = (plate: typeof initialPlates[0]) => {
    setSelectedPlate(plate)
    setFormData({
      plaka: plate.plaka,
      isim: plate.isim,
      telefon: plate.telefon,
      not: plate.not,
    })
    setIsEditOpen(true)
  }

  const openDeleteDialog = (plate: typeof initialPlates[0]) => {
    setSelectedPlate(plate)
    setIsDeleteOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Plaka Yönetimi</h1>
          <p className="text-muted-foreground">Kayıtlı araç plakalarını yönetin</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Yeni Plaka Ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Plaka Ekle</DialogTitle>
              <DialogDescription>
                Sisteme yeni bir araç plakası kaydedin.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="add-plaka">Plaka</Label>
                <Input
                  id="add-plaka"
                  placeholder="34 ABC 123"
                  value={formData.plaka}
                  onChange={(e) => setFormData({ ...formData, plaka: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-isim">İsim</Label>
                <Input
                  id="add-isim"
                  placeholder="Araç sahibi adı"
                  value={formData.isim}
                  onChange={(e) => setFormData({ ...formData, isim: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-telefon">Telefon</Label>
                <Input
                  id="add-telefon"
                  placeholder="0532 123 4567"
                  value={formData.telefon}
                  onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-not">Not</Label>
                <Textarea
                  id="add-not"
                  placeholder="Ek bilgiler..."
                  value={formData.not}
                  onChange={(e) => setFormData({ ...formData, not: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>
                İptal
              </Button>
              <Button onClick={handleAdd} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Ekle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5 text-accent" />
                Kayıtlı Plakalar
              </CardTitle>
              <CardDescription>Toplam {filteredPlates.length} kayıt</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Plaka veya isim ara..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plaka</TableHead>
                <TableHead>İsim</TableHead>
                <TableHead className="hidden md:table-cell">Telefon</TableHead>
                <TableHead className="hidden lg:table-cell">Not</TableHead>
                <TableHead className="hidden sm:table-cell">Oluşturulma</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPlates.map((plate) => (
                <TableRow key={plate.id}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {plate.plaka}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{plate.isim}</TableCell>
                  <TableCell className="hidden md:table-cell">{plate.telefon}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-muted-foreground">{plate.not}</span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{plate.olusturulma}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEditDialog(plate)}
                      >
                        <Pencil className="w-4 h-4" />
                        <span className="sr-only">Düzenle</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => openDeleteDialog(plate)}
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="sr-only">Sil</span>
                      </Button>
                    </div>
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

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Plaka Düzenle</DialogTitle>
            <DialogDescription>
              Plaka bilgilerini güncelleyin.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-plaka">Plaka</Label>
              <Input
                id="edit-plaka"
                value={formData.plaka}
                onChange={(e) => setFormData({ ...formData, plaka: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-isim">İsim</Label>
              <Input
                id="edit-isim"
                value={formData.isim}
                onChange={(e) => setFormData({ ...formData, isim: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-telefon">Telefon</Label>
              <Input
                id="edit-telefon"
                value={formData.telefon}
                onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-not">Not</Label>
              <Textarea
                id="edit-not"
                value={formData.not}
                onChange={(e) => setFormData({ ...formData, not: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleEdit} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Plaka Sil</DialogTitle>
            <DialogDescription>
              Bu plakayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          {selectedPlate && (
            <div className="py-4">
              <div className="p-4 rounded-md bg-muted/50">
                <p className="font-mono font-medium">{selectedPlate.plaka}</p>
                <p className="text-sm text-muted-foreground">{selectedPlate.isim}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              İptal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
