import React, { useState } from 'react';
import {
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Switch,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Modal,
  Dropdown,
  Tabs,
  ToastProvider,
  useToast,
  Skeleton,
  EmptyState,
  Pagination,
  Avatar,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Stepper,
  ProgressBar,
} from '../components/ui';
import {
  Search,
  Download,
  Play,
  Upload,
  User,
  Settings,
  LogOut,
  ExternalLink,
  Sparkles,
  Gamepad2,
  Bell,
  CheckCircle2,
  Layers,
} from 'lucide-react';

const ShowcaseContent: React.FC = () => {
  const { addToast } = useToast();

  // Component states
  const [activeTab, setActiveTab] = useState<string>('all');
  const [activeUnderlineTab, setActiveUnderlineTab] = useState<string>('overview');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(2);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [switchState, setSwitchState] = useState<boolean>(true);
  const [checkboxState, setCheckboxState] = useState<boolean>(true);
  const [uploadProgress, setUploadProgress] = useState<number>(68);

  const steps = [
    { title: 'Info Produk', description: 'Data dasar & platform' },
    { title: 'Media & Berkas', description: 'Cover & arsip zip' },
    { title: 'Harga & Bagi Hasil', description: 'Skema komisi 2%' },
    { title: 'Tinjau & Kirim', description: 'Validasi kurasi' },
  ];

  const tabItems = [
    { id: 'all', label: 'Semua Produk', count: 12 },
    { id: 'games', label: 'Game WebGL', count: 8 },
    { id: 'apps', label: 'Aplikasi Windows', count: 4 },
  ];

  const underlineTabs = [
    { id: 'overview', label: 'Ringkasan' },
    { id: 'analytics', label: 'Statistik Penjualan', count: 'Baru' },
    { id: 'settings', label: 'Pengaturan Studio' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#171923] p-6 sm:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Showcase */}
        <header className="border-b border-[#E5E7EB] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/sideload_new_logo.png"
              alt="SideLoad Logo"
              className="w-10 h-10 object-contain"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">SideLoad Design System</h1>
                <Badge variant="primary" size="sm">
                  Fase 1
                </Badge>
              </div>
              <p className="text-xs text-[#737887] mt-0.5">
                Token desain, palet warna, tipografi, dan pustaka komponen antarmuka terpusat
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Sparkles className="w-4 h-4 text-[#6A3DFB]" />}
              onClick={() =>
                addToast({
                  type: 'info',
                  title: 'Design System Aktif',
                  message: 'Semua komponen menggunakan token terpusat.',
                })
              }
            >
              Uji Notifikasi
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Gamepad2 className="w-4 h-4" />}
              onClick={() => setIsModalOpen(true)}
            >
              Buka Modal
            </Button>
          </div>
        </header>

        {/* 1. Design Tokens: Colors */}
        <section className="space-y-4">
          <div>
            <h2 className="text-base font-bold tracking-tight text-[#171923]">1. Palet Warna (Design Tokens)</h2>
            <p className="text-xs text-[#737887]">Warna utama, netral, aksen, dan status operasional sistem</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="bg-white p-3 rounded-[12px] border border-[#E5E7EB] shadow-xs">
              <div className="h-14 rounded-[8px] bg-[#2373FB] mb-2 shadow-inner" />
              <div className="font-semibold text-xs">Primary Blue</div>
              <div className="text-[11px] text-[#737887] font-mono">#2373FB</div>
            </div>

            <div className="bg-white p-3 rounded-[12px] border border-[#E5E7EB] shadow-xs">
              <div className="h-14 rounded-[8px] bg-[#3438D5] mb-2 shadow-inner" />
              <div className="font-semibold text-xs">Indigo (Hover)</div>
              <div className="text-[11px] text-[#737887] font-mono">#3438D5</div>
            </div>

            <div className="bg-white p-3 rounded-[12px] border border-[#E5E7EB] shadow-xs">
              <div className="h-14 rounded-[8px] bg-[#6A3DFB] mb-2 shadow-inner" />
              <div className="font-semibold text-xs">Accent Violet</div>
              <div className="text-[11px] text-[#737887] font-mono">#6A3DFB</div>
            </div>

            <div className="bg-white p-3 rounded-[12px] border border-[#E5E7EB] shadow-xs">
              <div className="h-14 rounded-[8px] bg-[#F7F8FA] border border-[#E5E7EB] mb-2" />
              <div className="font-semibold text-xs">Background</div>
              <div className="text-[11px] text-[#737887] font-mono">#F7F8FA</div>
            </div>

            <div className="bg-white p-3 rounded-[12px] border border-[#E5E7EB] shadow-xs">
              <div className="h-14 rounded-[8px] bg-[#F0F1F5] mb-2" />
              <div className="font-semibold text-xs">Surface</div>
              <div className="text-[11px] text-[#737887] font-mono">#F0F1F5</div>
            </div>

            <div className="bg-white p-3 rounded-[12px] border border-[#E5E7EB] shadow-xs">
              <div className="h-14 rounded-[8px] bg-[#171923] mb-2" />
              <div className="font-semibold text-xs">Main Text</div>
              <div className="text-[11px] text-[#737887] font-mono">#171923</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#DCFCE7] p-3 rounded-[12px] border border-[#BBF7D0]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#15803D]">Sukses / Disetujui</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
              </div>
              <span className="text-[11px] font-mono text-[#15803D]">#16A34A</span>
            </div>

            <div className="bg-[#FEF3C7] p-3 rounded-[12px] border border-[#FDE68A]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#B45309]">Menunggu Review</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
              </div>
              <span className="text-[11px] font-mono text-[#B45309]">#D97706</span>
            </div>

            <div className="bg-[#FEE2E2] p-3 rounded-[12px] border border-[#FECACA]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#B91C1C]">Ditolak / Revisi</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
              </div>
              <span className="text-[11px] font-mono text-[#B91C1C]">#DC2626</span>
            </div>

            <div className="bg-[#EFF6FF] p-3 rounded-[12px] border border-[#DBEAFE]">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#1D4ED8]">Info / Platform</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#2373FB]" />
              </div>
              <span className="text-[11px] font-mono text-[#1D4ED8]">#2373FB</span>
            </div>
          </div>
        </section>

        {/* 2. Buttons */}
        <section className="space-y-4">
          <div>
            <h2 className="text-base font-bold tracking-tight text-[#171923]">2. Tombol (Buttons)</h2>
            <p className="text-xs text-[#737887]">Varian gaya, ukuran standar, dan status tombol</p>
          </div>

          <Card>
            <CardContent className="space-y-6">
              {/* Variants */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-[#737887] uppercase tracking-wider">Varian Gaya</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary">Primary Blue</Button>
                  <Button variant="secondary">Secondary Surface</Button>
                  <Button variant="outline">Outline Border</Button>
                  <Button variant="ghost">Ghost Plain</Button>
                  <Button variant="danger">Danger Red</Button>
                </div>
              </div>

              {/* Sizes */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-[#737887] uppercase tracking-wider">Ukuran Tombol</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" size="sm">Small (h-8)</Button>
                  <Button variant="primary" size="md">Medium (h-10)</Button>
                  <Button variant="primary" size="lg">Large (h-12)</Button>
                </div>
              </div>

              {/* States & Icons */}
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-[#737887] uppercase tracking-wider">Status & Ikon</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary" leftIcon={<Play className="w-4 h-4 fill-current" />}>
                    Mainkan di Browser
                  </Button>
                  <Button variant="outline" rightIcon={<Download className="w-4 h-4" />}>
                    Unduh File ZIP
                  </Button>
                  <Button variant="secondary" leftIcon={<Upload className="w-4 h-4" />}>
                    Unggah Versi Baru
                  </Button>
                  <Button variant="primary" isLoading>
                    Menyimpan Berkas...
                  </Button>
                  <Button variant="primary" disabled>
                    Tombol Dinonaktifkan
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card Component Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card hoverable>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="violet" size="sm" dot>Rilisan Terkini</Badge>
                  <Bell className="w-4 h-4 text-[#737887]" />
                </div>
                <CardTitle>Struktur Card Standar (12px Radius)</CardTitle>
                <CardDescription>
                  Komponen kartu berlatar putih dengan border #E5E7EB, bayangan halus, dan hover elevasi.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-[#737887] leading-relaxed">
                  Menyediakan slot CardHeader, CardTitle, CardDescription, CardContent, dan CardFooter untuk menjaga konsistensi di etalase game, dasbor developer, dan panel admin.
                </p>
              </CardContent>
              <CardFooter>
                <span className="text-xs font-semibold text-[#171923]">Rp 45.000</span>
                <Button variant="primary" size="sm">Beli Game</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <Badge variant="success" size="sm" dot>Bagi Hasil 98% / 2%</Badge>
                <CardTitle>Komisi Platform SideLoad</CardTitle>
                <CardDescription>
                  Developer menerima 98% pendapatan bersih tanpa potongan tersembunyi.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-[#F0F1F5] rounded-[10px] space-y-1 text-xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-[#737887]">Harga Produk:</span>
                    <span className="text-[#171923]">Rp 50.000</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-[#737887]">Komisi Platform 2%:</span>
                    <span className="text-[#DC2626]">- Rp 1.000</span>
                  </div>
                  <div className="flex justify-between font-bold pt-1 border-t border-[#E5E7EB]">
                    <span className="text-[#171923]">Hak Bersih Studio:</span>
                    <span className="text-[#16A34A]">Rp 49.000</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <span className="text-[11px] text-[#737887]">Pencairan otomatis setiap hari kerja</span>
                <Button variant="outline" size="sm">Pelajari</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* 3. Form Controls */}
        <section className="space-y-4">
          <div>
            <h2 className="text-base font-bold tracking-tight text-[#171923]">3. Form & Input Controls</h2>
            <p className="text-xs text-[#737887]">Input teks, textarea, dropdown select, checkbox, dan switch</p>
          </div>

          <Card>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Input
                  label="Nama Studio atau Developer"
                  placeholder="Contoh: Nusantara Horizon Studios"
                  required
                  helperText="Nama ini akan tampil di etalase katalog publik."
                />

                <Input
                  label="Cari Game atau Aplikasi"
                  placeholder="Ketik judul..."
                  leftIcon={<Search className="w-4 h-4" />}
                />

                <Input
                  label="Harga Jual Game (IDR)"
                  defaultValue="Rp 45.000"
                  error="Harga minimal untuk game berbayar adalah Rp 10.000"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Select
                  label="Kategori Utama Produk"
                  options={[
                    { value: 'game', label: 'Game - Petualangan Naratif' },
                    { value: 'rpg', label: 'Game - Pixel RPG' },
                    { value: 'app', label: 'Aplikasi - Produktivitas' },
                    { value: 'tools', label: 'Alat Kreator - Audio & Grafis' },
                  ]}
                  helperText="Pilih kategori yang paling sesuai untuk rekomendasi kurator."
                />

                <div className="space-y-4 pt-1">
                  <Checkbox
                    id="agreement-check"
                    checked={checkboxState}
                    onChange={(e) => setCheckboxState(e.target.checked)}
                    label="Saya menyetujui Perjanjian Developer SideLoad"
                    description="Skema bagi hasil 98% developer dan 2% biaya pemeliharaan platform."
                  />

                  <Switch
                    label="Tampilkan Game di Hasil Pencarian Publik"
                    description="Nonaktifkan jika Anda ingin game hanya bisa diakses lewat tautan langsung."
                    checked={switchState}
                    onChange={setSwitchState}
                  />
                </div>
              </div>

              <Textarea
                label="Deskripsi Singkat Karya & Rencana Rilis"
                placeholder="Tuliskan latar belakang game, alur permainan, dan mekanisme utama..."
                maxLength={500}
                showCharCount
                defaultValue="Kala: Warisan Kabut adalah game petualangan naratif berpiksel modern yang berlatar di lembah mistis pegunungan Dieng. Pemain berperan sebagai penjaga lentera waktu kuno."
              />
            </CardContent>
          </Card>
        </section>

        {/* 4. Badges, Tags & Tabs */}
        <section className="space-y-4">
          <div>
            <h2 className="text-base font-bold tracking-tight text-[#171923]">4. Badge, Tag & Tab Navigasi</h2>
            <p className="text-xs text-[#737887]">Indikator status operasional dan navigasi kategori</p>
          </div>

          <Card>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-[#737887] uppercase tracking-wider">Status Badge</h3>
                <div className="flex flex-wrap items-center gap-2.5">
                  <Badge variant="success" dot>
                    Disetujui / Terbit
                  </Badge>
                  <Badge variant="warning" dot>
                    Menunggu Review
                  </Badge>
                  <Badge variant="danger" dot>
                    Perlu Revisi
                  </Badge>
                  <Badge variant="primary" dot>
                    Pilihan Kurator
                  </Badge>
                  <Badge variant="violet" dot>
                    WebGL Langsung
                  </Badge>
                  <Badge variant="neutral">
                    Windows PC
                  </Badge>
                  <Badge variant="neutral">
                    v1.2.0
                  </Badge>
                  <Badge variant="outline">
                    Gratis
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-[#737887] uppercase tracking-wider">Tab Pill (Dasbor Style)</h3>
                <Tabs items={tabItems} activeId={activeTab} onChange={setActiveTab} variant="pill" />
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-[#737887] uppercase tracking-wider">Tab Underline (Detail Style)</h3>
                <Tabs
                  items={underlineTabs}
                  activeId={activeUnderlineTab}
                  onChange={setActiveUnderlineTab}
                  variant="underline"
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 5. Stepper & Progress Bar */}
        <section className="space-y-4">
          <div>
            <h2 className="text-base font-bold tracking-tight text-[#171923]">5. Stepper & Indikator Unggah</h2>
            <p className="text-xs text-[#737887]">Pelacak alur pengajuan karya dan proses upload berkas game</p>
          </div>

          <Card>
            <CardContent className="space-y-6">
              <Stepper
                steps={steps}
                currentStep={currentStep}
                onStepClick={(step) => setCurrentStep(step)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#171923]">Berkas Rilis WebGL (game_webgl.zip)</span>
                    <button
                      className="text-xs text-[#2373FB] hover:underline"
                      onClick={() => setUploadProgress((prev) => (prev >= 100 ? 20 : prev + 20))}
                    >
                      Simulasi Progres
                    </button>
                  </div>
                  <ProgressBar
                    value={uploadProgress}
                    size="md"
                    label="Mengunggah ke Supabase Storage..."
                    helperText="45.2 MB dari 66.4 MB (3.8 MB/detik)"
                  />
                </div>

                <div className="space-y-2">
                  <ProgressBar
                    indeterminate
                    size="md"
                    status="default"
                    label="Pemeriksaan Integritas Berkas"
                    helperText="Memindai SHA-256 dan virus signature secara otomatis..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 6. Data Table */}
        <section className="space-y-4">
          <div>
            <h2 className="text-base font-bold tracking-tight text-[#171923]">6. Tabel Data (Table Component)</h2>
            <p className="text-xs text-[#737887]">Tabel bersih untuk transaksi penjualan, katalog karya, dan moderasi</p>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produk</TableHead>
                <TableHead>Developer</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Komisi Platform (2%)</TableHead>
                <TableHead>Hak Bersih Studio</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-semibold">Kala: Warisan Kabut</TableCell>
                <TableCell className="text-[#737887]">Nusantara Horizon</TableCell>
                <TableCell>
                  <span className="inline-flex gap-1">
                    <Badge variant="neutral" size="sm">WIN</Badge>
                    <Badge variant="violet" size="sm">WEB</Badge>
                  </span>
                </TableCell>
                <TableCell>Rp 45.000</TableCell>
                <TableCell className="text-[#737887]">- Rp 900</TableCell>
                <TableCell className="font-semibold text-[#16A34A]">Rp 44.100</TableCell>
                <TableCell>
                  <Badge variant="success" dot size="sm">
                    Terbit
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Dropdown
                    trigger={
                      <button className="p-1 rounded hover:bg-[#F0F1F5] text-[#737887]">
                        •••
                      </button>
                    }
                    items={[
                      { label: 'Lihat di Toko', icon: <ExternalLink className="w-3.5 h-3.5" /> },
                      { label: 'Edit Rilis', icon: <Settings className="w-3.5 h-3.5" /> },
                    ]}
                  />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className="font-semibold">Lentera Rimba</TableCell>
                <TableCell className="text-[#737887]">Studio RimbaRaya</TableCell>
                <TableCell>
                  <Badge variant="neutral" size="sm">WIN</Badge>
                </TableCell>
                <TableCell>Gratis</TableCell>
                <TableCell className="text-[#737887]">Rp 0</TableCell>
                <TableCell className="font-semibold">Rp 0</TableCell>
                <TableCell>
                  <Badge variant="warning" dot size="sm">
                    Menunggu Review
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Dropdown
                    trigger={
                      <button className="p-1 rounded hover:bg-[#F0F1F5] text-[#737887]">
                        •••
                      </button>
                    }
                    items={[
                      { label: 'Tinjau Berkas', icon: <ExternalLink className="w-3.5 h-3.5" /> },
                    ]}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Pagination
            currentPage={currentPage}
            totalPages={6}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </section>

        {/* 7. Avatar, Skeleton & Empty State */}
        <section className="space-y-4">
          <div>
            <h2 className="text-base font-bold tracking-tight text-[#171923]">7. Avatar, Skeleton & Empty State</h2>
            <p className="text-xs text-[#737887]">Status pengguna, loading placeholder, dan tampilan saat data kosong</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Avatars */}
            <Card>
              <CardHeader>
                <CardTitle>Ukuran Avatar</CardTitle>
                <CardDescription>Dengan fallback inisial dan indikator online</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <Avatar name="Bagas Pratama" size="xs" status="online" />
                <Avatar name="Bagas Pratama" size="sm" status="online" />
                <Avatar name="Bagas Pratama" size="md" status="online" />
                <Avatar name="Bagas Pratama" size="lg" status="busy" />
                <Avatar name="Bagas Pratama" size="xl" status="offline" />
              </CardContent>
            </Card>

            {/* Skeleton Loaders */}
            <Card>
              <CardHeader>
                <CardTitle>Skeleton Placeholder</CardTitle>
                <CardDescription>Menjaga tata letak saat memuat data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton variant="circular" className="w-10 h-10 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-2.5 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>

            {/* User Dropdown Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Menu Dropdown</CardTitle>
                <CardDescription>Dropdown profil dan navigasi cepat</CardDescription>
              </CardHeader>
              <CardContent>
                <Dropdown
                  align="left"
                  trigger={
                    <div className="flex items-center gap-2 p-2 rounded-[10px] bg-[#F0F1F5] hover:bg-[#E4E6EB] transition-colors">
                      <Avatar name="Bagas Pratama" size="sm" status="online" />
                      <div className="text-left">
                        <div className="text-xs font-semibold leading-tight">Bagas Pratama</div>
                        <div className="text-[10px] text-[#737887]">Developer</div>
                      </div>
                    </div>
                  }
                  items={[
                    { label: 'Profil Saya', icon: <User className="w-4 h-4" /> },
                    { label: 'Dasbor Developer', icon: <Layers className="w-4 h-4" /> },
                    { label: 'Pengaturan Akun', icon: <Settings className="w-4 h-4" /> },
                    'divider',
                    {
                      label: 'Keluar',
                      icon: <LogOut className="w-4 h-4" />,
                      danger: true,
                      onClick: () =>
                        addToast({
                          type: 'warning',
                          title: 'Keluar Akun',
                          message: 'Sesi akun telah berakhir.',
                        }),
                    },
                  ]}
                />
              </CardContent>
            </Card>
          </div>

          {/* Empty State */}
          <EmptyState
            title="Pustaka Anda Masih Kosong"
            description="Jelajahi karya terbaik developer lokal Indonesia, unduh gratis atau beli untuk mulai bermain langsung di browser."
            actionText="Jelajahi Katalog Game"
            onAction={() =>
              addToast({
                type: 'info',
                title: 'Jelajah Katalog',
                message: 'Membuka katalog etalase SideLoad.',
              })
            }
            secondaryActionText="Daftar Jadi Developer"
            onSecondaryAction={() =>
              addToast({
                type: 'success',
                title: 'Program Kreator',
                message: 'Buka formulir pengajuan developer.',
              })
            }
          />
        </section>

        {/* Modal Dialog Component Preview */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Konfirmasi Klaim Game Indie"
          description="Produk ini akan ditambahkan secara permanen ke akun dan Pustaka Anda."
          footer={
            <>
              <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                onClick={() => {
                  setIsModalOpen(false);
                  addToast({
                    type: 'success',
                    title: 'Berhasil Diklaim',
                    message: 'Game telah masuk ke Pustaka Anda.',
                  });
                }}
              >
                Klaim Sekarang (Gratis)
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-[#F0F1F5] rounded-[10px]">
              <div className="w-12 h-12 bg-white rounded-[8px] flex items-center justify-center font-bold text-[#2373FB] border border-[#E5E7EB]">
                SL
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[#171923]">Kala: Warisan Kabut</h4>
                <p className="text-xs text-[#737887]">Nusantara Horizon Studios • Versi 1.2.0</p>
              </div>
            </div>
            <p className="text-xs text-[#737887] leading-relaxed">
              Setelah diklaim, Anda dapat mengunduh berkas executable Windows atau memainkannya langsung di browser melalui WebGL player tanpa instalasi tambahan.
            </p>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export const DesignSystemShowcase: React.FC = () => {
  return (
    <ToastProvider>
      <ShowcaseContent />
    </ToastProvider>
  );
};

export default DesignSystemShowcase;
