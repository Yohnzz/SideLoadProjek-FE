import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  AlertTriangle,
  Plus,
  Wallet,
  Clock,
  Eye,
  CheckCircle2,
  FileEdit,
} from 'lucide-react';
import { Button, Badge, Card, CardHeader, CardContent, Tabs, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Modal } from '../components/ui';
import { BankSetupModal } from '../components/BankSetupModal';
import { developerService, type DeveloperSaleRecord } from '../services/developerService';
import type { BankAccount, UserProfile, Game } from '../types/game';

interface DeveloperDashboardPageProps {
  currentUser?: UserProfile;
  onUploadNew: () => void;
  onOpenStorePage: (slug: string) => void;
  bankAccount?: BankAccount;
  onSaveBankAccount: (bank: BankAccount) => void;
}

export const DeveloperDashboardPage: React.FC<DeveloperDashboardPageProps> = ({
  currentUser,
  onUploadNew,
  onOpenStorePage,
  bankAccount,
  onSaveBankAccount,
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'sales' | 'payouts'>('catalog');
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [developerGames, setDeveloperGames] = useState<Game[]>([]);
  const [salesRecords, setSalesRecords] = useState<DeveloperSaleRecord[]>([]);

  const hasConfiguredBank = Boolean(bankAccount && bankAccount.accountNumber);

  useEffect(() => {
    let isMounted = true;
    const loadDevData = async () => {
      if (currentUser?.id) {
        const games = await developerService.getDeveloperGames(currentUser.id);
        if (isMounted && games.length > 0) {
          setDeveloperGames(games);
        }

        const sales = await developerService.getDeveloperSales(currentUser.id);
        if (isMounted && sales.length > 0) {
          setSalesRecords(sales);
        }
      }
    };
    loadDevData();
    return () => {
      isMounted = false;
    };
  }, [currentUser?.id]);

  const handleAttemptUpload = () => {
    if (!hasConfiguredBank) {
      setIsBankModalOpen(true);
      return;
    }
    onUploadNew();
  };

  // Perhitungan statistik finansial transparan (98% / 2%)
  const grossSales = salesRecords.reduce((acc, curr) => acc + curr.grossAmount, 15000000);
  const platformFee = Math.round(grossSales * 0.02); // 2%
  const totalNetEarnings = grossSales - platformFee; // 98%
  const availablePayout = Math.round(totalNetEarnings * 0.85); // 85% available now
  const pendingHold = totalNetEarnings - availablePayout; // 15% in 14-day refund escrow

  // Default fallback games if none loaded yet
  const displayGames: Game[] =
    developerGames.length > 0
      ? developerGames
      : [
          {
            id: 'dev-g-1',
            slug: 'kala-warisan-kabut',
            title: 'Kala: Warisan Kabut (v1.2.0)',
            developer: currentUser?.studioName || 'Nusantara Horizon Studios',
            genre: 'Petualangan Naratif',
            platforms: ['WIN', 'WEB'],
            price: 45000,
            rating: 4.8,
            review_count: 124,
            cover_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900&auto=format&fit=crop',
            screenshots: [],
            release_date: '2026-01-20',
            file_size: '412.4 MB',
            languages: ['id', 'en'],
            drm_free: true,
            short_description: 'Petualangan naratif bergaya pixel-art atmosferik di lembah Dieng.',
            description: '',
            features: [],
            version: '1.2.0',
            status: 'published',
          },
          {
            id: 'dev-g-2',
            slug: 'lentera-rimba',
            title: 'Lentera Rimba (v0.8.1)',
            developer: currentUser?.studioName || 'Nusantara Horizon Studios',
            genre: 'Eksplorasi Alam',
            platforms: ['WIN'],
            price: 0,
            rating: 4.6,
            review_count: 58,
            cover_url: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=900&auto=format&fit=crop',
            screenshots: [],
            release_date: '2026-02-01',
            file_size: '320 MB',
            languages: ['id'],
            drm_free: true,
            short_description: 'Eksplorasi hutan tropis Kalimantan dengan lentera kuno.',
            description: '',
            features: [],
            version: '0.8.1',
            status: 'revision_needed',
          },
          {
            id: 'dev-g-3',
            slug: 'proyek-wayang-cyber',
            title: 'Proyek Wayang Cyber (Draf)',
            developer: currentUser?.studioName || 'Nusantara Horizon Studios',
            genre: 'Cyberpunk RPG',
            platforms: ['WIN', 'WEB'],
            price: 50000,
            rating: 0,
            review_count: 0,
            cover_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=900&auto=format&fit=crop',
            screenshots: [],
            release_date: '2026-03-01',
            file_size: '250 MB',
            languages: ['id'],
            drm_free: true,
            short_description: 'Konsep wayang kulit bersentuhan dengan neon cyberpunk masa depan.',
            description: '',
            features: [],
            version: '0.1.0-alpha',
            status: 'draft',
          },
        ];

  return (
    <div className="space-y-8 pb-16">
      {/* Modal Pengaturan Rekening Bank */}
      <BankSetupModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        currentBank={bankAccount}
        onSave={onSaveBankAccount}
      />

      {/* Modal Penarikan Saldo */}
      <Modal
        isOpen={isWithdrawModalOpen}
        onClose={() => {
          setIsWithdrawModalOpen(false);
          setWithdrawSuccess(false);
        }}
        title="Penarikan Saldo Royalti Studio"
        description="Dana akan dikirimkan ke rekening bank resmi studio yang terdaftar."
        footer={
          withdrawSuccess ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setIsWithdrawModalOpen(false);
                setWithdrawSuccess(false);
              }}
            >
              Selesai
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsWithdrawModalOpen(false)}>
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Wallet className="w-4 h-4" />}
                onClick={() => setWithdrawSuccess(true)}
              >
                Konfirmasi Tarik Dana
              </Button>
            </div>
          )
        }
      >
        {withdrawSuccess ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-[#171923]">Permintaan Penarikan Berhasil Dibuat</h4>
            <p className="text-xs text-[#737887] max-w-sm mx-auto leading-relaxed">
              Nominal Rp {availablePayout.toLocaleString('id-ID')} sedang diproses ke {bankAccount?.bankName} ({bankAccount?.accountNumber}) a/n {bankAccount?.accountHolder}. Estimasi dana masuk 1 hari kerja.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-[#F0F1F5] rounded-[12px] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#737887]">Nominal Dicairkan:</span>
                <span className="font-bold text-[#171923] text-sm">
                  Rp {availablePayout.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737887]">Bank Tujuan:</span>
                <span className="font-semibold text-[#171923]">{bankAccount?.bankName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737887]">No. Rekening:</span>
                <span className="font-mono text-[#171923]">{bankAccount?.accountNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737887]">Pemilik Rekening:</span>
                <span className="font-semibold text-[#171923]">{bankAccount?.accountHolder}</span>
              </div>
            </div>
            <p className="text-xs text-[#737887] leading-relaxed">
              Pencairan dana saldo bersih tidak dikenakan potongan biaya transfer perbankan.
            </p>
          </div>
        )}
      </Modal>

      {/* Banner Peringatan Wajib Konfigurasi Bank */}
      {!hasConfiguredBank && (
        <div className="p-4 bg-[#FEF3C7] rounded-[14px] border border-[#FDE68A] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#B45309] shadow-xs">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sm text-[#B45309] block">
                Atur Rekening Bank untuk Menerima Pembayaran
              </span>
              <p className="text-[11px] text-[#B45309]/90 mt-0.5 leading-relaxed">
                Anda wajib mendaftarkan nomor rekening bank sebelum dapat mencairkan saldo royalti penjualan atau mengajukan rilis game baru.
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsBankModalOpen(true)}
            className="shrink-0 bg-[#D97706] hover:bg-[#B45309] border-[#D97706]"
          >
            Atur Rekening Sekarang
          </Button>
        </div>
      )}

      {/* Header Statistik Finansial Studio (3 Kartu Ringkas) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Saldo Tersedia Dicairkan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#737887]">Saldo Tersedia Dicairkan</span>
              <Wallet className="w-4 h-4 text-[#2373FB]" />
            </div>
            <div className="text-2xl font-extrabold text-[#171923] tracking-tight mt-1">
              Rp {availablePayout.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-[#737887] flex items-center gap-1 mt-0.5">
              <span>Bagi hasil bersih 98% (potongan platform 2%)</span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              variant={hasConfiguredBank ? 'primary' : 'secondary'}
              size="sm"
              disabled={!hasConfiguredBank}
              onClick={() => setIsWithdrawModalOpen(true)}
              className="w-full mt-2"
              leftIcon={<Wallet className="w-3.5 h-3.5" />}
              title={!hasConfiguredBank ? 'Atur rekening bank terlebih dahulu' : 'Tarik dana ke rekening bank'}
            >
              {hasConfiguredBank ? 'Tarik Dana / Cairkan Saldo' : 'Tarik Dana (Kunci Bank)'}
            </Button>
          </CardContent>
        </Card>

        {/* Saldo Tertahan Garansi 14 Hari */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#737887]">Saldo Tertahan (Garansi 14 Hari)</span>
              <Clock className="w-4 h-4 text-[#D97706]" />
            </div>
            <div className="text-2xl font-extrabold text-[#171923] tracking-tight mt-1">
              Rp {pendingHold.toLocaleString('id-ID')}
            </div>
            <div className="text-[11px] text-[#737887] mt-0.5">
              Akan berpindah ke saldo tersedia secara bertahap saat masa garansi refund pemain berakhir.
            </div>
          </CardHeader>
        </Card>

        {/* Rekening Tujuan Pencairan */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#737887]">Rekening Pencairan Terdaftar</span>
              <CreditCard className="w-4 h-4 text-[#16A34A]" />
            </div>
            {hasConfiguredBank ? (
              <div className="space-y-1 mt-1">
                <div className="text-sm font-bold text-[#171923]">
                  {bankAccount?.bankName}
                </div>
                <div className="text-xs font-mono text-[#737887]">
                  {bankAccount?.accountNumber}
                </div>
                <div className="text-[11px] text-[#737887]">
                  a/n {bankAccount?.accountHolder}
                </div>
              </div>
            ) : (
              <div className="space-y-1 mt-1">
                <span className="text-xs text-[#DC2626] font-semibold block">Belum Ditambahkan</span>
                <span className="text-[11px] text-[#737887] block">
                  Daftarkan nomor rekening Anda untuk verifikasi.
                </span>
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBankModalOpen(true)}
              className="w-full mt-1"
            >
              {hasConfiguredBank ? 'Ubah Rekening Bank' : 'Tambah Rekening Bank'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Navigasi Tab Dasbor */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Tabs
          variant="pill"
          activeId={activeTab}
          onChange={(id) => setActiveTab(id as any)}
          items={[
            { id: 'catalog', label: 'Katalog Produk Studio', count: displayGames.length },
            { id: 'sales', label: 'Statistik & Penjualan (98%)' },
            { id: 'payouts', label: 'Riwayat Penarikan Dana' },
          ]}
        />

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={handleAttemptUpload}
        >
          Unggah Produk Baru
        </Button>
      </div>

      {/* Konten Tab 1: Katalog Game Studio */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {displayGames.map((game) => {
            const isApproved = game.status === 'published';
            const isPending = game.status === 'pending_review' || game.status === 'pending';
            const isRevision = game.status === 'revision_needed' || game.status === 'revision';
            const isDraft = game.status === 'draft';

            return (
              <Card key={game.id} className="p-5 border border-[#E5E7EB]">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Cover Mini */}
                    <div className="w-20 h-14 sm:w-28 sm:h-18 rounded-[10px] overflow-hidden bg-[#F0F1F5] shrink-0 border border-[#E5E7EB]">
                      <img src={game.cover_url} alt={game.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-[#171923] tracking-tight">
                          {game.title}
                        </h3>
                        <Badge variant="neutral" size="sm">v{game.version}</Badge>
                        {game.platforms.includes('WEB') && <Badge variant="violet" size="sm">WEB</Badge>}
                        {game.platforms.includes('WIN') && <Badge variant="neutral" size="sm">WIN</Badge>}
                      </div>

                      <p className="text-xs text-[#737887] line-clamp-1 max-w-xl">
                        {game.short_description || game.description}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-[#737887] pt-1">
                        <span>Harga: <strong className="text-[#171923]">{game.price === 0 ? 'Gratis' : `Rp ${game.price.toLocaleString('id-ID')}`}</strong></span>
                        <span>•</span>
                        <span>Rating: <strong className="text-[#171923]">{game.rating > 0 ? `${game.rating} (${game.review_count} ulasan)` : 'Belum Ada'}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Sisi Kanan: Status & Tombol Aksi */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-[#E5E7EB]">
                    <div>
                      {isApproved && <Badge variant="success" dot size="md">Terbit</Badge>}
                      {isPending && <Badge variant="warning" dot size="md">Menunggu Review</Badge>}
                      {isRevision && <Badge variant="danger" dot size="md">Perlu Revisi</Badge>}
                      {isDraft && <Badge variant="neutral" size="md">Draf</Badge>}
                    </div>

                    <div className="flex items-center gap-2">
                      {isApproved && (
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Eye className="w-3.5 h-3.5" />}
                          onClick={() => onOpenStorePage(game.slug)}
                        >
                          Buka di Toko
                        </Button>
                      )}

                      {isRevision && (
                        <Button
                          variant="danger"
                          size="sm"
                          leftIcon={<FileEdit className="w-3.5 h-3.5" />}
                          onClick={onUploadNew}
                        >
                          Perbaiki & Kirim Ulang
                        </Button>
                      )}

                      {isDraft && (
                        <Button
                          variant="primary"
                          size="sm"
                          leftIcon={<FileEdit className="w-3.5 h-3.5" />}
                          onClick={onUploadNew}
                        >
                          Lanjutkan Draf
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Catatan Kurasi Khusus jika status revisi */}
                {isRevision && (
                  <div className="mt-4 p-3.5 bg-[#FEE2E2]/50 border border-[#FECACA] rounded-[10px] text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-[#B91C1C]">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Catatan Tim Kurator SideLoad:</span>
                    </div>
                    <p className="text-[#737887] leading-relaxed pl-5.5">
                      Berkas executable belum menyertakan file lisensi font open-source dan cover etalase terdapat watermark pihak ketiga. Harap unggah ulang paket rilis yang bersih.
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Konten Tab 2: Statistik & Penjualan (98% Studio / 2% Platform) */}
      {activeTab === 'sales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Card>
              <CardHeader>
                <span className="text-xs font-semibold text-[#737887]">Total Penjualan Kotor</span>
                <div className="text-xl font-bold text-[#171923] mt-1">
                  Rp {grossSales.toLocaleString('id-ID')}
                </div>
                <span className="text-[11px] text-[#737887]">Dari 300+ transaksi pemain</span>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <span className="text-xs font-semibold text-[#737887]">Biaya Pemeliharaan Platform (2%)</span>
                <div className="text-xl font-bold text-[#DC2626] mt-1">
                  - Rp {platformFee.toLocaleString('id-ID')}
                </div>
                <span className="text-[11px] text-[#737887]">Batas potongan terendah industri</span>
              </CardHeader>
            </Card>

            <Card className="border-[#BBF7D0] bg-[#DCFCE7]/20">
              <CardHeader>
                <span className="text-xs font-semibold text-[#15803D]">Hak Royalti Bersih Studio (98%)</span>
                <div className="text-xl font-bold text-[#16A34A] mt-1">
                  Rp {totalNetEarnings.toLocaleString('id-ID')}
                </div>
                <span className="text-[11px] text-[#15803D]">Langsung disalurkan ke rekening bank</span>
              </CardHeader>
            </Card>
          </div>

          {/* Tabel Transaksi Terkini */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#171923]">Riwayat Transaksi Penjualan Terakhir</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Judul Produk</TableHead>
                  <TableHead>Nomor Invoice</TableHead>
                  <TableHead>Harga Jual</TableHead>
                  <TableHead>Biaya Platform (2%)</TableHead>
                  <TableHead>Hak Studio (98%)</TableHead>
                  <TableHead>Status Garansi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>24 Okt 2026</TableCell>
                  <TableCell className="font-semibold">Kala: Warisan Kabut</TableCell>
                  <TableCell className="font-mono text-[11px] text-[#737887]">#SL-2026-8831</TableCell>
                  <TableCell>Rp 45.000</TableCell>
                  <TableCell className="text-[#DC2626]">- Rp 900</TableCell>
                  <TableCell className="font-bold text-[#16A34A]">Rp 44.100</TableCell>
                  <TableCell><Badge variant="warning" size="sm">Masa Refund</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>24 Okt 2026</TableCell>
                  <TableCell className="font-semibold">Kala: Warisan Kabut</TableCell>
                  <TableCell className="font-mono text-[11px] text-[#737887]">#SL-2026-8830</TableCell>
                  <TableCell>Rp 45.000</TableCell>
                  <TableCell className="text-[#DC2626]">- Rp 900</TableCell>
                  <TableCell className="font-bold text-[#16A34A]">Rp 44.100</TableCell>
                  <TableCell><Badge variant="warning" size="sm">Masa Refund</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>10 Okt 2026</TableCell>
                  <TableCell className="font-semibold">Kala: Warisan Kabut</TableCell>
                  <TableCell className="font-mono text-[11px] text-[#737887]">#SL-2026-8120</TableCell>
                  <TableCell>Rp 45.000</TableCell>
                  <TableCell className="text-[#DC2626]">- Rp 900</TableCell>
                  <TableCell className="font-bold text-[#16A34A]">Rp 44.100</TableCell>
                  <TableCell><Badge variant="success" size="sm">Selesai</Badge></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>08 Okt 2026</TableCell>
                  <TableCell className="font-semibold">Kala: Warisan Kabut</TableCell>
                  <TableCell className="font-mono text-[11px] text-[#737887]">#SL-2026-7945</TableCell>
                  <TableCell>Rp 45.000</TableCell>
                  <TableCell className="text-[#DC2626]">- Rp 900</TableCell>
                  <TableCell className="font-bold text-[#16A34A]">Rp 44.100</TableCell>
                  <TableCell><Badge variant="success" size="sm">Selesai</Badge></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Konten Tab 3: Riwayat Penarikan Dana (Withdraw) */}
      {activeTab === 'payouts' && (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal Pengajuan</TableHead>
                <TableHead>ID Penarikan</TableHead>
                <TableHead>Rekening Tujuan</TableHead>
                <TableHead>Nominal Bersih</TableHead>
                <TableHead>Biaya Transfer</TableHead>
                <TableHead>Status Pencairan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>15 Okt 2026</TableCell>
                <TableCell className="font-mono text-[11px] text-[#737887]">#WD-2026-0912</TableCell>
                <TableCell>{bankAccount?.bankName || 'BCA'} •••• 3312</TableCell>
                <TableCell className="font-bold">Rp 8.500.000</TableCell>
                <TableCell className="text-[#16A34A]">Gratis (Rp 0)</TableCell>
                <TableCell><Badge variant="success" dot size="sm">Selesai Ditransfer</Badge></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>01 Okt 2026</TableCell>
                <TableCell className="font-mono text-[11px] text-[#737887]">#WD-2026-0854</TableCell>
                <TableCell>{bankAccount?.bankName || 'BCA'} •••• 3312</TableCell>
                <TableCell className="font-bold">Rp 4.200.000</TableCell>
                <TableCell className="text-[#16A34A]">Gratis (Rp 0)</TableCell>
                <TableCell><Badge variant="success" dot size="sm">Selesai Ditransfer</Badge></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
