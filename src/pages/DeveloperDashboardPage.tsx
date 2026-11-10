import React, { useState, useEffect } from 'react'
import { 
  CreditCard, 
  Info, 
  AlertTriangle, 
  Clock, 
  ExternalLink, 
  Plus
} from 'lucide-react'
import type { BankAccount, UserProfile, Game } from '../types/game'
import { BankSetupModal } from '../components/BankSetupModal'
import { developerService, type DeveloperSaleRecord } from '../services/developerService'

interface DeveloperDashboardPageProps {
  currentUser?: UserProfile
  onUploadNew: () => void
  onOpenStorePage: (slug: string) => void
  bankAccount?: BankAccount
  onSaveBankAccount: (bank: BankAccount) => void
}

export const DeveloperDashboardPage: React.FC<DeveloperDashboardPageProps> = ({
  currentUser,
  onUploadNew,
  onOpenStorePage,
  bankAccount,
  onSaveBankAccount
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'sales' | 'payouts'>('catalog')
  const [isBankModalOpen, setIsBankModalOpen] = useState(false)
  const [developerGames, setDeveloperGames] = useState<Game[]>([])
  const [salesRecords, setSalesRecords] = useState<DeveloperSaleRecord[]>([])

  const hasConfiguredBank = Boolean(bankAccount && bankAccount.accountNumber)

  useEffect(() => {
    let isMounted = true
    const loadDevData = async () => {
      if (currentUser?.id) {
        const games = await developerService.getDeveloperGames(currentUser.id)
        if (isMounted && games.length > 0) {
          setDeveloperGames(games)
        }

        const sales = await developerService.getDeveloperSales(currentUser.id)
        if (isMounted && sales.length > 0) {
          setSalesRecords(sales)
        }
      }
    }
    loadDevData()
    return () => { isMounted = false }
  }, [currentUser?.id])

  const handleAttemptUpload = () => {
    if (!hasConfiguredBank) {
      setIsBankModalOpen(true)
      return
    }
    onUploadNew()
  }

  // Perhitungan statistik finansial
  const totalNetEarnings = salesRecords.reduce((acc, curr) => acc + curr.netEarning, 12150000)
  const totalSalesCount = salesRecords.length > 0 ? salesRecords.length : 300

  return (
    <div className="space-y-8 pb-16">
      
      {/* Modal Pengaturan Rekening Bank */}
      <BankSetupModal
        isOpen={isBankModalOpen}
        onClose={() => setIsBankModalOpen(false)}
        currentBank={bankAccount}
        onSave={onSaveBankAccount}
      />

      {/* Peringatan Wajib Rekening Bank Jika Belum Dikonfigurasi */}
      {!hasConfiguredBank && (
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 shadow-xs">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
            <div>
              <span className="font-bold block text-sm">Rekening Bank Belum Dikonfigurasi</span>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                Anda wajib mengatur rekening bank penerima royalti sebelum dapat mengunggah rilis game baru atau mencairkan saldo.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBankModalOpen(true)}
            className="px-4 py-2 bg-amber-800 text-white rounded-lg font-bold text-xs hover:bg-amber-900 transition shrink-0 self-start sm:self-auto"
          >
            Atur Rekening Sekarang
          </button>
        </div>
      )}

      {/* Header Dasbor */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#BBBFCA]/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222629] tracking-tight">
              Dasbor Developer
            </h1>
            <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-[#E8E8E8] text-[#495464] border border-[#BBBFCA]/50">
              STATUS: SISTEM NORMAL
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#495464]">
            Kelola status rilis game, tinjau catatan kurator, dan pantau bagi hasil penjualan studio kamu.
          </p>
        </div>

        <button
          onClick={handleAttemptUpload}
          className="px-4 py-2.5 bg-[#495464] text-[#F4F4F2] text-xs font-semibold rounded-lg hover:bg-[#3d4654] active:scale-[0.99] transition flex items-center gap-2 self-start md:self-auto shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Unggah Produk Baru</span>
        </button>
      </div>

      {/* Tiga Kartu Rekapitulasi Finansial Jujur */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Saldo Tersedia */}
        <div className="bg-[#E8E8E8] rounded-xl p-5 border border-[#BBBFCA]/40 space-y-2">
          <span className="text-xs font-semibold text-[#495464]">Saldo Tersedia Dicairkan</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#222629] tracking-tight">
            Rp {totalNetEarnings.toLocaleString('id-ID')}
          </p>
          <p className="text-[11px] text-[#495464] leading-relaxed">
            Dari total {totalSalesCount} salinan terjual setelah dipotong komisi platform 10%.
          </p>
        </div>

        {/* Saldo Tertahan (Refund Window) */}
        <div className="bg-[#E8E8E8] rounded-xl p-5 border border-[#BBBFCA]/40 space-y-2">
          <span className="text-xs font-semibold text-[#495464]">Saldo Tertahan (Garansi Refund 14 Hari)</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#222629] tracking-tight">
            Rp 1.620.000
          </p>
          <p className="text-[11px] text-[#495464] leading-relaxed">
            Akan berpindah ke saldo tersedia secara bertahap saat masa refund berakhir.
          </p>
        </div>

        {/* Rekening Tujuan Pencairan */}
        <div className="bg-[#E8E8E8] rounded-xl p-5 border border-[#BBBFCA]/40 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#495464]">Rekening Tujuan Pencairan</span>
              {hasConfiguredBank ? (
                <span className="text-[9px] font-pixel text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300 font-bold">
                  Terverifikasi
                </span>
              ) : (
                <span className="text-[9px] font-pixel text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300 font-bold">
                  Belum Diatur
                </span>
              )}
            </div>

            {hasConfiguredBank ? (
              <>
                <p className="text-xs font-bold text-[#222629] mt-1">
                  {bankAccount?.bankName} ({bankAccount?.accountNumber})
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#495464]">
                  <span>a/n {bankAccount?.accountHolder}</span>
                  <button 
                    onClick={() => setIsBankModalOpen(true)}
                    className="text-[#495464] hover:underline font-semibold"
                  >
                    Ubah
                  </button>
                </div>
              </>
            ) : (
              <p className="text-xs text-[#B42318] mt-1 font-medium">
                Wajib diisi untuk menerima pembayaran dan royalti.
              </p>
            )}
          </div>

          {hasConfiguredBank ? (
            <button
              onClick={() => alert(`Pencairan saldo Rp ${totalNetEarnings.toLocaleString('id-ID')} berhasil diajukan dan diproses via transfer bank.`)}
              className="w-full py-2 bg-[#495464] text-[#F4F4F2] text-xs font-semibold rounded-lg hover:bg-[#3d4654] transition flex items-center justify-center gap-2 shadow-xs"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Cairkan Saldo</span>
            </button>
          ) : (
            <button
              onClick={() => setIsBankModalOpen(true)}
              className="w-full py-2 bg-amber-700 text-white text-xs font-semibold rounded-lg hover:bg-amber-800 transition flex items-center justify-center gap-2 shadow-xs"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>+ Tambahkan Rekening Bank</span>
            </button>
          )}
        </div>
      </div>

      {/* Info Callout */}
      <div className="p-3 bg-[#E8E8E8] rounded-lg border border-[#BBBFCA]/40 flex items-center gap-2.5 text-xs text-[#495464]">
        <Info className="w-4 h-4 text-[#495464] shrink-0" />
        <span>Pencairan diproses otomatis setiap hari kerja tanpa potongan biaya admin transfer.</span>
      </div>

      {/* Tab Navigasi Katalog & Riwayat */}
      <div className="space-y-4">
        <div className="flex items-center gap-6 border-b border-[#BBBFCA]/40 pb-1 text-sm font-medium">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`pb-2 transition ${
              activeTab === 'catalog'
                ? 'border-b-2 border-[#495464] text-[#222629] font-bold'
                : 'text-[#495464] hover:text-[#222629]'
            }`}
          >
            Katalog Produk ({developerGames.length > 0 ? developerGames.length : 3})
          </button>

          <button
            onClick={() => setActiveTab('sales')}
            className={`pb-2 transition ${
              activeTab === 'sales'
                ? 'border-b-2 border-[#495464] text-[#222629] font-bold'
                : 'text-[#495464] hover:text-[#222629]'
            }`}
          >
            Riwayat Penjualan & Bagi Hasil
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            className={`pb-2 transition ${
              activeTab === 'payouts'
                ? 'border-b-2 border-[#495464] text-[#222629] font-bold'
                : 'text-[#495464] hover:text-[#222629]'
            }`}
          >
            Riwayat Pencairan Dana
          </button>
        </div>

        {/* Tab 1: Katalog Produk */}
        {activeTab === 'catalog' && (
          <div className="space-y-4">
            {developerGames.length > 0 ? (
              developerGames.map(game => (
                <div key={game.id} className="bg-[#E8E8E8] rounded-xl p-5 border border-[#BBBFCA]/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-24 sm:w-32 aspect-16/10 rounded-lg overflow-hidden bg-[#222629] shrink-0">
                        <img 
                          src={game.cover_url} 
                          alt={game.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-[#222629]">{game.title}</h3>
                          <span className="text-[10px] font-pixel text-[#495464]">{game.version || 'v1.0.0'}</span>
                          <span className="text-[10px] font-pixel px-1.5 bg-[#F4F4F2] text-[#495464] rounded border border-[#BBBFCA]/40">
                            {game.platforms.join(' / ')}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-1 text-xs">
                          <div>
                            <span className="text-[#495464] block text-[11px]">Harga Produk</span>
                            <span className="font-bold text-[#222629]">
                              {game.price === 0 ? 'Gratis' : `Rp${game.price.toLocaleString('id-ID')}`}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#495464] block text-[11px]">Status Rilis</span>
                            <span className="font-bold text-[#222629] capitalize">{game.status || 'Terbit'}</span>
                          </div>
                          <div>
                            <span className="text-[#495464] block text-[11px]">Rating</span>
                            <span className="font-bold text-[#222629]">★ {game.rating} ({game.review_count})</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded border self-start ${
                      game.status === 'published' 
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : game.status === 'revision_needed'
                        ? 'bg-rose-100 text-[#B42318] border-rose-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {game.status === 'published' ? 'Terbit' : game.status === 'revision_needed' ? 'Perlu Revisi' : 'Menunggu Review'}
                    </span>
                  </div>

                  <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-[#495464] border-t border-[#BBBFCA]/30">
                    <button 
                      onClick={() => onOpenStorePage(game.slug)}
                      className="hover:text-[#222629] hover:underline flex items-center gap-1"
                    >
                      <span>Buka Halaman Toko</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={handleAttemptUpload}
                      className="hover:text-[#222629] hover:underline"
                    >
                      Unggah Pembaruan (Patch)
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <>
                {/* Item 1: PERLU REVISI */}
                <div className="bg-[#E8E8E8] rounded-xl p-5 border border-[#BBBFCA]/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-24 sm:w-32 aspect-16/10 rounded-lg overflow-hidden bg-[#222629] shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=400&auto=format&fit=crop" 
                          alt="Lentera Rimba" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-[#222629]">Lentera Rimba</h3>
                          <span className="text-[10px] font-pixel text-[#495464]">v0.8.1</span>
                          <span className="text-[10px] font-pixel px-1.5 bg-[#F4F4F2] text-[#495464] rounded border border-[#BBBFCA]/40">
                            WIN
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-rose-100 text-[#B42318] border border-rose-300 self-start">
                      Perlu Revisi
                    </span>
                  </div>

                  {/* Warning Box Tim Kurator */}
                  <div className="p-3.5 bg-[#F4F4F2] rounded-lg border border-[#BBBFCA]/50 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-[#B42318]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Catatan Tim Kurator SideLoad:</span>
                    </div>
                    <p className="text-[#495464] leading-relaxed">
                      Berkas executable belum menyertakan file lisensi font open-source dan cover etalase terdapat watermark pihak ketiga. Harap unggah ulang paket rilis yang bersih.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleAttemptUpload}
                      className="px-4 py-1.5 bg-[#F4F4F2] text-[#B42318] border border-[#B42318]/50 rounded-lg text-xs font-semibold hover:bg-rose-50 transition"
                    >
                      Perbaiki & Kirim Ulang
                    </button>
                  </div>
                </div>

                {/* Item 2: MENUNGGU REVIEW */}
                <div className="bg-[#E8E8E8] rounded-xl p-5 border border-[#BBBFCA]/40 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-24 sm:w-32 aspect-16/10 rounded-lg overflow-hidden bg-[#222629] shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop" 
                          alt="Kala" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-[#222629]">Kala: Warisan Kabut (Update v1.2.1)</h3>
                          <span className="text-[10px] font-pixel px-1.5 bg-[#F4F4F2] text-[#495464] rounded border border-[#BBBFCA]/40">
                            WIN / WEB
                          </span>
                        </div>
                        <p className="text-xs text-[#495464]">
                          Diajukan 4 jam lalu. Estimasi peninjauan kurator selesai dalam 1 sampai 2 hari kerja. Paket pembaruan mencakup perbaikan bug audio dan optimasi rendering WebGL.
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 self-start flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Menunggu Review</span>
                    </span>
                  </div>
                </div>

                {/* Item 3: TERBIT */}
                <div className="bg-[#E8E8E8] rounded-xl p-5 border border-[#BBBFCA]/40 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-24 sm:w-32 aspect-16/10 rounded-lg overflow-hidden bg-[#222629] shrink-0">
                        <img 
                          src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400&auto=format&fit=crop" 
                          alt="Kala" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-[#222629]">Kala: Warisan Kabut (v1.2.0)</h3>
                          <span className="text-[10px] font-pixel px-1.5 bg-[#F4F4F2] text-[#495464] rounded border border-[#BBBFCA]/40">
                            WIN
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-1 text-xs">
                          <div>
                            <span className="text-[#495464] block text-[11px]">Harga Produk</span>
                            <span className="font-bold text-[#222629]">Rp45.000</span>
                          </div>
                          <div>
                            <span className="text-[#495464] block text-[11px]">Volume Penjualan</span>
                            <span className="font-bold text-[#222629]">280 Salinan</span>
                          </div>
                          <div>
                            <span className="text-[#495464] block text-[11px]">Ulasan</span>
                            <span className="font-bold text-[#222629]">Rating 4.8 (124 ulasan)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 self-start">
                      Terbit
                    </span>
                  </div>

                  <div className="pt-2 flex items-center gap-4 text-xs font-semibold text-[#495464] border-t border-[#BBBFCA]/30">
                    <button 
                      onClick={() => onOpenStorePage('kala-warisan-kabut')}
                      className="hover:text-[#222629] hover:underline flex items-center gap-1"
                    >
                      <span>Buka Halaman Toko</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={handleAttemptUpload}
                      className="hover:text-[#222629] hover:underline"
                    >
                      Unggah Pembaruan (Patch)
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 2 & 3: Tabel Riwayat Transaksi Penjualan Terakhir */}
        {(activeTab === 'sales' || activeTab === 'payouts') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <h2 className="font-bold text-[#222629]">Riwayat Transaksi Penjualan Terakhir</h2>
              <span className="text-[#495464]">Menampilkan transaksi penjualan studio</span>
            </div>

            <div className="bg-[#E8E8E8] rounded-xl border border-[#BBBFCA]/40 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#495464]">
                  <thead className="bg-[#F4F4F2] border-b border-[#BBBFCA]/40 text-[#222629] font-bold">
                    <tr>
                      <th className="p-3">Tanggal</th>
                      <th className="p-3">Judul Produk</th>
                      <th className="p-3">Nomor Invoice</th>
                      <th className="p-3">Harga (Rp)</th>
                      <th className="p-3">SideLoad 10%</th>
                      <th className="p-3">Bersih Studio 90%</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#BBBFCA]/30">
                    {salesRecords.length > 0 ? (
                      salesRecords.map(sale => (
                        <tr key={sale.id} className="hover:bg-white/40 transition">
                          <td className="p-3">{sale.date}</td>
                          <td className="p-3 font-semibold text-[#222629]">{sale.gameTitle}</td>
                          <td className="p-3 font-mono">{sale.orderNumber}</td>
                          <td className="p-3">Rp{sale.grossAmount.toLocaleString('id-ID')}</td>
                          <td className="p-3 text-[#B42318]">- Rp{sale.platformFee.toLocaleString('id-ID')}</td>
                          <td className="p-3 font-bold text-[#222629]">Rp{sale.netEarning.toLocaleString('id-ID')}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
                              Lunas
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <>
                        <tr className="hover:bg-white/40 transition">
                          <td className="p-3">24 Okt 2025</td>
                          <td className="p-3 font-semibold text-[#222629]">Kala: Warisan Kabut</td>
                          <td className="p-3 font-mono">#SL-2025-8831</td>
                          <td className="p-3">Rp45.000</td>
                          <td className="p-3 text-[#B42318]">- Rp4.500</td>
                          <td className="p-3 font-bold text-[#222629]">Rp40.500</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold">
                              Masa Refund
                            </span>
                          </td>
                        </tr>
                        <tr className="hover:bg-white/40 transition">
                          <td className="p-3">10 Okt 2025</td>
                          <td className="p-3 font-semibold text-[#222629]">Kala: Warisan Kabut</td>
                          <td className="p-3 font-mono">#SL-2025-8120</td>
                          <td className="p-3">Rp45.000</td>
                          <td className="p-3 text-[#B42318]">- Rp4.500</td>
                          <td className="p-3 font-bold text-[#222629]">Rp40.500</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-bold">
                              Selesai
                            </span>
                          </td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
