import * as Dialog from '@radix-ui/react-dialog'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import {
  ArrowUpDown,
  BellRing,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Copy,
  Download,
  Edit3,
  FileText,
  GripVertical,
  MapPin,
  MoonStar,
  PhoneCall,
  Plus,
  Printer,
  QrCode,
  Search,
  Sparkles,
  SunMedium,
  Trash2,
  X,
} from 'lucide-react'
import { useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { useForm } from 'react-hook-form'
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useParams,
} from 'react-router-dom'
import { toast, Toaster } from 'sonner'
import { z } from 'zod'

import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'
import { Switch } from './components/ui/switch'
import {
  menuCategories as initialCategories,
  menuItems as initialItems,
  restaurant as initialRestaurant,
  type MenuBadge,
  type MenuCategory,
  type MenuItem,
} from './lib/mock-data'
import { cn, formatCurrency } from './lib/utils'

const badgeOptions: MenuBadge[] = ['Vegan', 'Gluten-Free', 'Spicy']

const itemSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().min(12, 'Description is too short'),
  price: z.number().min(1, 'Add a valid price'),
  categoryId: z.string().min(1, 'Select a category'),
  imageUrl: z.string(),
  badges: z.array(z.string()),
  outOfStock: z.boolean(),
  allergyWarning: z.string().optional(),
})

type MenuFormValues = z.infer<typeof itemSchema>

type AdminAppProps = {
  restaurant: typeof initialRestaurant
  categories: MenuCategory[]
  items: MenuItem[]
  setRestaurant: Dispatch<SetStateAction<typeof initialRestaurant>>
  setCategories: Dispatch<SetStateAction<MenuCategory[]>>
  setItems: Dispatch<SetStateAction<MenuItem[]>>
  isDarkMode: boolean
  setIsDarkMode: Dispatch<SetStateAction<boolean>>
  qrColor: string
  setQrColor: Dispatch<SetStateAction<string>>
  showQrLogo: boolean
  setShowQrLogo: Dispatch<SetStateAction<boolean>>
  qrFormat: 'Table Standee' | 'PDF' | 'PNG'
  setQrFormat: Dispatch<SetStateAction<'Table Standee' | 'PDF' | 'PNG'>>
}

function App() {
  const [restaurant, setRestaurant] = useState(initialRestaurant)
  const [categories, setCategories] = useState(initialCategories)
  const [items, setItems] = useState(initialItems)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [qrColor, setQrColor] = useState('#f59e0b')
  const [showQrLogo, setShowQrLogo] = useState(true)
  const [qrFormat, setQrFormat] = useState<'Table Standee' | 'PDF' | 'PNG'>('Table Standee')

  return (
    <BrowserRouter>
      <div className={cn(isDarkMode ? 'dark' : '')}>
        <div className="min-h-screen bg-[#f8f4ef] text-slate-900 transition-colors dark:bg-[#0b1220] dark:text-slate-50">
          <Routes>
            <Route path="/" element={<Navigate to="/admin" replace />} />
            <Route
              path="/admin"
              element={
                <AdminOverviewPage
                  restaurant={restaurant}
                  categories={categories}
                  items={items}
                  setRestaurant={setRestaurant}
                  setCategories={setCategories}
                  setItems={setItems}
                  isDarkMode={isDarkMode}
                  setIsDarkMode={setIsDarkMode}
                  qrColor={qrColor}
                  setQrColor={setQrColor}
                  showQrLogo={showQrLogo}
                  setShowQrLogo={setShowQrLogo}
                  qrFormat={qrFormat}
                  setQrFormat={setQrFormat}
                />
              }
            />
            <Route
              path="/admin/menu"
              element={
                <AdminMenuPage
                  restaurant={restaurant}
                  categories={categories}
                  items={items}
                  setRestaurant={setRestaurant}
                  setCategories={setCategories}
                  setItems={setItems}
                  isDarkMode={isDarkMode}
                  setIsDarkMode={setIsDarkMode}
                  qrColor={qrColor}
                  setQrColor={setQrColor}
                  showQrLogo={showQrLogo}
                  setShowQrLogo={setShowQrLogo}
                  qrFormat={qrFormat}
                  setQrFormat={setQrFormat}
                />
              }
            />
            <Route
              path="/admin/qrcode"
              element={
                <AdminQrPage
                  restaurant={restaurant}
                  categories={categories}
                  items={items}
                  setRestaurant={setRestaurant}
                  setCategories={setCategories}
                  setItems={setItems}
                  isDarkMode={isDarkMode}
                  setIsDarkMode={setIsDarkMode}
                  qrColor={qrColor}
                  setQrColor={setQrColor}
                  showQrLogo={showQrLogo}
                  setShowQrLogo={setShowQrLogo}
                  qrFormat={qrFormat}
                  setQrFormat={setQrFormat}
                />
              }
            />
            <Route path="/m/:restaurantId" element={<PublicMenuPage items={items} categories={categories} restaurant={restaurant} />} />
          </Routes>
        </div>
      </div>
      <Toaster position="top-right" richColors theme={isDarkMode ? 'dark' : 'light'} closeButton />
    </BrowserRouter>
  )
}

function AdminLayout({
  restaurant,
  isDarkMode,
  setIsDarkMode,
  children,
}: {
  restaurant: typeof initialRestaurant
  isDarkMode: boolean
  setIsDarkMode: Dispatch<SetStateAction<boolean>>
  children: ReactNode
}) {
  const tabs = [
    { label: 'Overview', to: '/admin' },
    { label: 'Menu', to: '/admin/menu' },
    { label: 'QR Code', to: '/admin/qrcode' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-5 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4 rounded-[28px] border border-white/60 bg-white/80 p-3 shadow-soft backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/80">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <img src={restaurant.logoUrl} alt={restaurant.name} className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Restaurant</p>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{restaurant.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Toggle theme"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            onClick={() => setIsDarkMode((current) => !current)}
          >
            {isDarkMode ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
          </button>
          <Link to={`/m/${restaurant.slug}`}>
            <Button variant="secondary" size="sm" className="gap-2 rounded-xl">
              <Sparkles className="h-4 w-4" />
              Preview Public Menu
            </Button>
          </Link>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white/80 p-2 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            className={cn(
              'rounded-xl px-4 py-2 text-sm font-medium transition-colors',
              window.location.pathname === tab.to
                ? 'bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-900'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {children}
    </div>
  )
}

function AdminOverviewPage(props: AdminAppProps) {
  const { restaurant, items, categories, setRestaurant, isDarkMode, setIsDarkMode } = props
  const averagePrice = items.length ? items.reduce((sum, item) => sum + item.price, 0) / items.length : 0

  return (
    <AdminLayout restaurant={restaurant} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
      <div className="space-y-6">
        <div className="rounded-[32px] border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-700 dark:bg-slate-900 sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100 shadow-md">
                <img src={restaurant.logoUrl} alt={restaurant.name} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{restaurant.active ? 'Live profile' : 'Paused'}</Badge>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{restaurant.isOpen ? 'Open now' : 'Currently closed'}</span>
                </div>
                <Input
                  value={restaurant.name}
                  onChange={(event) => setRestaurant((current) => ({ ...current, name: event.target.value }))}
                  className="h-11 max-w-xs border-none bg-transparent p-0 text-2xl font-semibold text-slate-900 shadow-none focus-visible:ring-0 dark:text-white"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800">
                <span className="text-sm text-slate-500 dark:text-slate-400">Active</span>
                <Switch
                  checked={restaurant.active}
                  onCheckedChange={(checked) => setRestaurant((current) => ({ ...current, active: checked }))}
                />
              </div>

              <Link to={`/m/${restaurant.slug}`}>
                <Button className="rounded-xl">
                  <QrCode className="h-4 w-4" />
                  Preview Public Menu
                </Button>
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card className="rounded-2xl border-slate-200 bg-slate-50 dark:bg-slate-800/60">
              <CardHeader className="pb-2">
                <CardDescription>Total menu items</CardDescription>
                <CardTitle className="text-3xl">{items.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="rounded-2xl border-slate-200 bg-slate-50 dark:bg-slate-800/60">
              <CardHeader className="pb-2">
                <CardDescription>Categories</CardDescription>
                <CardTitle className="text-3xl">{categories.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="rounded-2xl border-slate-200 bg-slate-50 dark:bg-slate-800/60">
              <CardHeader className="pb-2">
                <CardDescription>Average dish</CardDescription>
                <CardTitle className="text-3xl">{formatCurrency(averagePrice)}</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-[28px] border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle>Branding snapshot</CardTitle>
              <CardDescription>Keep the public menu aligned with your restaurant identity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Logo URL</label>
                <Input
                  value={restaurant.logoUrl}
                  onChange={(event) => setRestaurant((current) => ({ ...current, logoUrl: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Cover image</label>
                <Input
                  value={restaurant.coverImage}
                  onChange={(event) => setRestaurant((current) => ({ ...current, coverImage: event.target.value }))}
                />
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Public menu link</p>
                  <p className="font-medium text-slate-900 dark:text-white">/m/{restaurant.slug}</p>
                </div>
                <Link to={`/m/${restaurant.slug}`}>
                  <Button variant="outline" size="sm">
                    Open
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[28px] border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
              <CardDescription>Everything you need from the owner dashboard.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/menu">
                <Button className="w-full justify-between rounded-2xl" variant="secondary">
                  Manage menu items <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/admin/qrcode">
                <Button className="w-full justify-between rounded-2xl" variant="outline">
                  Generate QR codes <QrCode className="h-4 w-4" />
                </Button>
              </Link>
              <Button className="w-full justify-between rounded-2xl" variant="ghost">
                Export sales snapshot <Download className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}

function AdminMenuPage(props: AdminAppProps) {
  const { restaurant, categories, items, setCategories, setItems, isDarkMode, setIsDarkMode } = props
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [draftCategory, setDraftCategory] = useState('')
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || item.categoryId === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [items, searchTerm, selectedCategory])

  const handleAddCategory = () => {
    if (!draftCategory.trim()) return
    const slug = draftCategory.trim().toLowerCase().replace(/\s+/g, '-')
    setCategories((current) => [...current, { id: slug, name: draftCategory.trim(), accent: '#f59e0b' }])
    setDraftCategory('')
    toast.success('Category created')
  }

  const moveCategory = (id: string, direction: -1 | 1) => {
    setCategories((current) => {
      const index = current.findIndex((category) => category.id === id)
      if (index === -1) return current
      const nextIndex = index + direction
      if (nextIndex < 0 || nextIndex >= current.length) return current
      const next = [...current]
      ;[next[index], next[nextIndex]] = [next[nextIndex], next[index]]
      return next
    })
  }

  const deleteCategory = (id: string) => {
    setCategories((current) => current.filter((category) => category.id !== id))
    setItems((current) => current.filter((item) => item.categoryId !== id))
    toast.success('Category removed')
  }

  const openCreateItem = () => {
    setEditingItem(null)
    setIsItemModalOpen(true)
  }

  const openEditItem = (item: MenuItem) => {
    setEditingItem(item)
    setIsItemModalOpen(true)
  }

  const handleSaveItem = (values: MenuFormValues) => {
    const itemPayload: MenuItem = {
      id: editingItem?.id ?? crypto.randomUUID(),
      title: values.title,
      description: values.description,
      price: values.price,
      categoryId: values.categoryId,
      imageUrl:
        values.imageUrl && values.imageUrl.trim().length > 0
          ? values.imageUrl
          : 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
      badges: values.badges as MenuBadge[],
      outOfStock: values.outOfStock,
      allergyWarning: values.allergyWarning,
    }

    if (editingItem) {
      setItems((current) => current.map((item) => (item.id === editingItem.id ? itemPayload : item)))
      toast.success('Menu item updated')
    } else {
      setItems((current) => [itemPayload, ...current])
      toast.success('Menu item saved')
    }

    setIsItemModalOpen(false)
    setEditingItem(null)
  }

  const toggleOutOfStock = (itemId: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, outOfStock: !item.outOfStock } : item,
      ),
    )
    toast.success('Availability updated')
  }

  return (
    <AdminLayout restaurant={restaurant} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="rounded-[28px] border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>Category builder</CardTitle>
            <CardDescription>Organize the menu layout for customers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={draftCategory}
                onChange={(event) => setDraftCategory(event.target.value)}
                placeholder="Add category"
              />
              <Button onClick={handleAddCategory} type="button" className="shrink-0 rounded-xl">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex h-10 w-10 cursor-grab items-center justify-center rounded-xl bg-white text-slate-400 dark:bg-slate-900">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900 dark:text-white">{category.name}</p>
                    <p className="text-xs text-slate-500">{items.filter((item) => item.categoryId === category.id).length} items</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="Move category up"
                      className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-900"
                      onClick={() => moveCategory(category.id, -1)}
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Move category down"
                      className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-white dark:hover:bg-slate-900"
                      onClick={() => moveCategory(category.id, 1)}
                    >
                      <ArrowUpDown className="h-4 w-4 rotate-90" />
                    </button>
                    <button
                      type="button"
                      aria-label="Delete category"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-900"
                      onClick={() => deleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-slate-200 dark:border-slate-700">
          <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Menu editor</CardTitle>
              <CardDescription>Search, filter, and update items in real time.</CardDescription>
            </div>
            <Button className="rounded-xl" onClick={openCreateItem}>
              <Plus className="h-4 w-4" />
              Add item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search dishes"
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <option value="all">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-[26px] border border-slate-200 bg-slate-50/90 dark:border-slate-700 dark:bg-slate-800/90"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                    {item.outOfStock ? (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/65 text-sm font-semibold uppercase tracking-[0.2em] text-white">
                        Out of stock
                      </div>
                    ) : null}
                  </div>

                  <div className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{formatCurrency(item.price)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openEditItem(item)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm dark:bg-slate-900 dark:text-slate-200"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {item.badges.map((badge) => (
                        <Badge key={badge} variant={badge === 'Spicy' ? 'default' : 'secondary'}>
                          {badge}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => toggleOutOfStock(item.id)}
                        className={cn(
                          'text-xs font-medium uppercase tracking-[0.18em]',
                          item.outOfStock ? 'text-rose-500' : 'text-emerald-600',
                        )}
                      >
                        {item.outOfStock ? 'Mark available' : 'In stock'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setItems((current) => current.filter((entry) => entry.id !== item.id))
                          toast.success('Item removed')
                        }}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <ItemModal
        categories={categories}
        editingItem={editingItem}
        open={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false)
          setEditingItem(null)
        }}
        onSave={handleSaveItem}
      />
    </AdminLayout>
  )
}

function AdminQrPage(props: AdminAppProps) {
  const { restaurant, isDarkMode, setIsDarkMode, qrColor, setQrColor, showQrLogo, setShowQrLogo, qrFormat, setQrFormat } = props
  const publicMenuUrl = typeof window !== 'undefined' ? `${window.location.origin}/m/${restaurant.slug}` : `/m/${restaurant.slug}`
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(publicMenuUrl)}&size=300x300&color=${qrColor.replace('#', '')}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(publicMenuUrl)
    toast.success('Public menu URL copied')
  }

  return (
    <AdminLayout restaurant={restaurant} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="rounded-[28px] border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>QR code controls</CardTitle>
            <CardDescription>Customize the scan experience for guests.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Foreground</label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                <input type="color" value={qrColor} onChange={(event) => setQrColor(event.target.value)} className="h-11 w-14 rounded-md border-none bg-transparent p-0" />
                <span className="text-sm text-slate-600 dark:text-slate-300">{qrColor}</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">Center logo</p>
                <p className="text-sm text-slate-500">Adds your restaurant identity.</p>
              </div>
              <Switch checked={showQrLogo} onCheckedChange={setShowQrLogo} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600 dark:text-slate-300">Print format</label>
              <div className="flex flex-wrap gap-2">
                {(['Table Standee', 'PDF', 'PNG'] as const).map((format) => (
                  <button
                    key={format}
                    type="button"
                    onClick={() => setQrFormat(format)}
                    className={cn(
                      'rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
                      qrFormat === format
                        ? 'border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300'
                        : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200',
                    )}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            <Button className="w-full rounded-2xl" onClick={copyLink}>
              <Copy className="h-4 w-4" />
              Copy URL
            </Button>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-slate-200 dark:border-slate-700">
          <CardHeader>
            <CardTitle>QR generator</CardTitle>
            <CardDescription>Scan and go straight to the public menu.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="rounded-[32px] bg-gradient-to-br from-amber-50 via-white to-emerald-50 p-6 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800">
              <div className="relative mx-auto flex max-w-[290px] items-center justify-center rounded-[26px] border border-slate-200 bg-white p-5 shadow-soft">
                <img src={qrUrl} alt="QR code" className="h-[220px] w-[220px] rounded-2xl" />
                {showQrLogo ? (
                  <div className="absolute flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-white bg-slate-900 shadow-lg">
                    <img src={restaurant.logoUrl} alt={restaurant.name} className="h-full w-full rounded-xl object-cover" />
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Format selected</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{qrFormat}</p>
                </div>
                <div className="flex gap-2">
                  {qrFormat === 'PNG' ? (
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  ) : null}
                  {qrFormat === 'PDF' ? (
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <FileText className="h-4 w-4" />
                      Export PDF
                    </Button>
                  ) : null}
                  {qrFormat === 'Table Standee' ? (
                    <Button variant="outline" size="sm" className="rounded-xl">
                      <Printer className="h-4 w-4" />
                      Print layout
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

function PublicMenuPage({
  restaurant,
  categories,
  items,
}: {
  restaurant: typeof initialRestaurant
  categories: MenuCategory[]
  items: MenuItem[]
}) {
  const { restaurantId } = useParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  const publicItems = useMemo(() => {
    return items.filter((item) => {
      const matches = item.title.toLowerCase().includes(searchTerm.toLowerCase())
      return matches
    })
  }, [items, searchTerm])

  const categoriesWithItems = categories
    .map((category) => ({
      ...category,
      items: publicItems.filter((item) => item.categoryId === category.id),
    }))
    .filter((category) => category.items.length > 0)

  const handleScrollTo = (categoryId: string) => {
    document.getElementById(categoryId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (restaurantId !== restaurant.slug) {
    return <Navigate to={`/m/${restaurant.slug}`} replace />
  }

  return (
    <div className="mx-auto max-w-md bg-[#f6f1ea] text-slate-900">
      <div className="sticky top-0 z-30 border-b border-white/60 bg-[#f6f1ea]/90 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/admin" className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <ChevronRight className="h-4 w-4 rotate-180" />
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600">
            <Clock3 className="h-3.5 w-3.5" />
            {restaurant.isOpen ? 'Open now' : 'Closed'}
          </div>
        </div>
      </div>

      <div className="relative">
        <img src={restaurant.coverImage} alt={restaurant.name} className="h-56 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120f10]/80 via-[#120f10]/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-white shadow-lg">
              <img src={restaurant.logoUrl} alt={restaurant.name} className="h-full w-full object-cover" />
            </div>
            <div className="text-white">
              <p className="text-xs uppercase tracking-[0.24em] text-white/70">Dining</p>
              <h1 className="text-2xl font-semibold">{restaurant.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-24 pt-4">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search menu"
            className="h-12 rounded-full border-slate-200 bg-white pl-11 shadow-sm"
          />
        </div>

        <div className="mb-5 overflow-x-auto pb-2">
          <div className="flex min-w-max gap-2">
            {categoriesWithItems.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleScrollTo(category.id)}
                className="whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {categoriesWithItems.map((category) => (
            <section key={category.id} id={category.id} className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-semibold text-slate-900">{category.name}</h2>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{category.items.length}</span>
              </div>

              <div className="space-y-3">
                {category.items.map((item) => (
                  <motion.button
                    key={item.id}
                    type="button"
                    whileTap={{ scale: 0.992 }}
                    onClick={() => setSelectedItem(item)}
                    className="flex w-full overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-soft text-left"
                  >
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden">
                      <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                      {item.outOfStock ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                          Sold out
                        </div>
                      ) : null}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-between p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="line-clamp-2 text-base font-semibold text-slate-900">{item.title}</h3>
                          <p className="mt-1 line-clamp-2 text-xs text-slate-500">{item.description}</p>
                        </div>
                        <span className="text-base font-semibold text-slate-900">{formatCurrency(item.price)}</span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {item.badges.map((badge) => (
                          <Badge key={badge} variant={badge === 'Spicy' ? 'default' : 'secondary'}>
                            {badge}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-md border-t border-slate-200 bg-white/95 p-3 backdrop-blur-xl">
        <div className="grid grid-cols-2 gap-2">
          <Button className="rounded-2xl bg-amber-500 text-white hover:bg-amber-600">
            <BellRing className="h-4 w-4" />
            Call waiter
          </Button>
          <Button variant="outline" className="rounded-2xl">
            <MapPin className="h-4 w-4" />
            Info
          </Button>
        </div>
      </div>

      <Dialog.Root open={Boolean(selectedItem)} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-slate-900/45 backdrop-blur-sm" />
          <Dialog.Content className="fixed inset-x-0 bottom-0 mx-auto max-w-md rounded-t-[30px] bg-white p-0 shadow-soft">
            {selectedItem ? (
              <>
                <div className="relative h-56 w-full overflow-hidden">
                  <img src={selectedItem.imageUrl} alt={selectedItem.title} className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-700 backdrop-blur-sm"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-2xl font-semibold text-slate-900">{selectedItem.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{formatCurrency(selectedItem.price)}</p>
                    </div>
                    <Badge variant={selectedItem.outOfStock ? 'outline' : 'secondary'}>
                      {selectedItem.outOfStock ? 'Unavailable' : 'Available'}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedItem.badges.map((badge) => (
                      <Badge key={badge} variant={badge === 'Spicy' ? 'default' : 'secondary'}>
                        {badge}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-sm leading-6 text-slate-600">{selectedItem.description}</p>

                  <div className="rounded-2xl border border-amber-100 bg-amber-50 p-3">
                    <p className="flex items-center gap-2 text-sm font-medium text-amber-800">
                      <CheckCircle2 className="h-4 w-4" />
                      Allergy note
                    </p>
                    <p className="mt-2 text-sm text-amber-700">{selectedItem.allergyWarning ?? 'Prepared on shared equipment, please ask your server for details.'}</p>
                  </div>

                  <Button className="w-full rounded-2xl">
                    <PhoneCall className="h-4 w-4" />
                    Ask server for this dish
                  </Button>
                </div>
              </>
            ) : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

function ItemModal({
  categories,
  editingItem,
  open,
  onClose,
  onSave,
}: {
  categories: MenuCategory[]
  editingItem: MenuItem | null
  open: boolean
  onClose: () => void
  onSave: (values: MenuFormValues) => void
}) {
  const defaultValues: MenuFormValues = {
    title: editingItem?.title ?? '',
    description: editingItem?.description ?? '',
    price: editingItem?.price ?? 0,
    categoryId: editingItem?.categoryId ?? categories[0]?.id ?? '',
    imageUrl: editingItem?.imageUrl ?? '',
    badges: editingItem?.badges ?? [],
    outOfStock: editingItem?.outOfStock ?? false,
    allergyWarning: editingItem?.allergyWarning ?? '',
  }

  const form = useForm<MenuFormValues>({
    resolver: zodResolver<MenuFormValues, any, MenuFormValues>(itemSchema),
    defaultValues: defaultValues as MenuFormValues,
  })

  const toggleBadge = (badge: MenuBadge) => {
    const values = form.getValues('badges')
    const next = values.includes(badge)
      ? values.filter((current) => current !== badge)
      : [...values, badge]
    form.setValue('badges', next)
  }

  return (
    <Dialog.Root open={open} onOpenChange={(value) => !value && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-xl rounded-t-[30px] bg-white p-5 shadow-soft md:bottom-8 md:rounded-[30px]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <Dialog.Title className="text-xl font-semibold text-slate-900">
                {editingItem ? 'Edit menu item' : 'Create menu item'}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-slate-500">
                Update your public menu in a few quick steps.
              </Dialog.Description>
            </div>
            <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
              <X className="h-4 w-4" />
            </button>
          </div>

          <form className="space-y-4" onSubmit={form.handleSubmit(onSave)}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-600">Title</label>
                <Input {...form.register('title')} placeholder="Citrus ceviche bowl" />
                {form.formState.errors.title ? (
                  <p className="text-xs text-rose-500">{form.formState.errors.title.message}</p>
                ) : null}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-600">Description</label>
                <textarea
                  {...form.register('description')}
                  className="min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                  placeholder="Describe the dish and highlight the key ingredients"
                />
                {form.formState.errors.description ? (
                  <p className="text-xs text-rose-500">{form.formState.errors.description.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Price</label>
                <Input {...form.register('price', { valueAsNumber: true })} type="number" min="0" step="0.01" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Category</label>
                <select
                  {...form.register('categoryId')}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-600">Image URL</label>
                <Input {...form.register('imageUrl')} placeholder="https://example.com/image.jpg" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-600">Dietary badges</label>
                <div className="flex flex-wrap gap-2">
                  {badgeOptions.map((badge) => {
                    const active = form.watch('badges').includes(badge)
                    return (
                      <button
                        key={badge}
                        type="button"
                        onClick={() => toggleBadge(badge)}
                        className={cn(
                          'rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors',
                          active
                            ? 'border-amber-200 bg-amber-50 text-amber-700'
                            : 'border-slate-200 bg-white text-slate-600',
                        )}
                      >
                        {badge}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-600">Allergy warning</label>
                <Input {...form.register('allergyWarning')} placeholder="Contains shellfish and sesame." />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3 md:col-span-2 dark:border-slate-700 dark:bg-slate-800">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">Out of stock</p>
                  <p className="text-sm text-slate-500">Pause sales while keeping the item visible.</p>
                </div>
                <Switch
                  checked={form.watch('outOfStock')}
                  onCheckedChange={(checked) => form.setValue('outOfStock', checked)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" className="rounded-xl" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl">
                Save item
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export default App
