import React, { useState } from 'react'
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react'
import type { Game } from '../types/game'

interface CheckoutPageProps {
  game: Game
  onBack: () => void
  onSuccess: (game: Game) => void
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  game,
  onBack,
  onSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va' | 'ewallet'>('qris')
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePay = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      onSuccess(game)
    }, 1200)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Tombol Kembali & Breadcrumb */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs text-[#495464] hover:text-[#222629] transition"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Game / Pembayaran Aman</span>
      </button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#222629]">
          Ringkasan Checkout
        </h1>
        <p className="text-xs sm:text-sm text-[#495464]">
          Selesaikan transaksi dengan pembayaran lokal yang instan tanpa biaya tersembunyi.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Kolom Kiri: Pilihan Metode Pembayaran Midtrans */}
        <div className="md:col-span-7 bg-[#E8E8E8] rounded-xl p-6 border border-[#BBBFCA]/40 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-[#222629]">Metode Pembayaran</h2>
            <p className="text-xs text-[#495464]">Pilih jalur transaksi resmi yang Anda gunakan.</p>
          </div>

          <div className="space-y-3 pt-2">
            
            {/* QRIS Instan */}
            <label 
              onClick={() => setPaymentMethod('qris')}
              className={`block p-4 rounded-lg border cursor-pointer transition ${
                paymentMethod === 'qris'
                  ? 'bg-white border-[#495464] shadow-xs'
                  : 'bg-[#F4F4F2]/70 border-[#BBBFCA]/50 hover:bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'qris'}
                    onChange={() => setPaymentMethod('qris')}
                    className="accent-[#495464]"
                  />
                  <span className="font-bold text-sm text-[#222629]">QRIS Instan</span>
                </div>
                <span className="text-[10px] font-pixel bg-[#E8E8E8] text-[#495464] px-1.5 py-0.5 rounded border border-[#BBBFCA]/40">
                  Otomatis Terverifikasi
                </span>
              </div>
              <p className="text-xs text-[#495464] mt-2 pl-6">
                GoPay, OVO, ShopeePay, DANA, BCA Mobile, Livin, dan aplikasi perbankan berlisensi QRIS.
              </p>
            </label>

            {/* Virtual Account Bank Transfer */}
            <label 
              onClick={() => setPaymentMethod('va')}
              className={`block p-4 rounded-lg border cursor-pointer transition ${
                paymentMethod === 'va'
                  ? 'bg-white border-[#495464] shadow-xs'
                  : 'bg-[#F4F4F2]/70 border-[#BBBFCA]/50 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'va'}
                  onChange={() => setPaymentMethod('va')}
                  className="accent-[#495464]"
                />
                <span className="font-bold text-sm text-[#222629]">Virtual Account (Bank Transfer)</span>
              </div>
              <p className="text-xs text-[#495464] mt-1.5 pl-6">
                BCA, Mandiri, BRI, BNI. Bayar via ATM, Internet Banking, atau Mobile Banking.
              </p>
            </label>

            {/* E-Wallet Direct Debit */}
            <label 
              onClick={() => setPaymentMethod('ewallet')}
              className={`block p-4 rounded-lg border cursor-pointer transition ${
                paymentMethod === 'ewallet'
                  ? 'bg-white border-[#495464] shadow-xs'
                  : 'bg-[#F4F4F2]/70 border-[#BBBFCA]/50 hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'ewallet'}
                  onChange={() => setPaymentMethod('ewallet')}
                  className="accent-[#495464]"
                />
                <span className="font-bold text-sm text-[#222629]">E-Wallet Direct Debit</span>
              </div>
              <p className="text-xs text-[#495464] mt-1.5 pl-6">
                Redirect langsung ke otentikasi akun DANA atau ShopeePay Anda.
              </p>
            </label>
          </div>

          <div className="pt-3 border-t border-[#BBBFCA]/40 flex items-start gap-2 text-[11px] text-[#495464]">
            <ShieldCheck className="w-4 h-4 text-[#495464] mt-0.5 shrink-0" />
            <span>
              Transaksi diproses aman melalui gateway tersertifikasi Bank Indonesia. Garansi perlindungan pengguna berlaku 14 hari penuh.
            </span>
          </div>
        </div>

        {/* Kolom Kanan: Rincian Pembelian */}
        <div className="md:col-span-5 bg-[#E8E8E8] rounded-xl p-6 border border-[#BBBFCA]/40 space-y-4">
          <h2 className="text-sm font-bold text-[#222629]">Rincian Pembelian</h2>

          {/* Mini Box Item */}
          <div className="flex items-center gap-3 p-3 bg-[#F4F4F2] rounded-lg border border-[#BBBFCA]/40">
            <div className="w-14 h-12 rounded overflow-hidden bg-[#222629] shrink-0">
              <img src={game.cover_url} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-[#222629] truncate">{game.title}</h4>
              <p className="text-[11px] text-[#495464] truncate">{game.developer}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[9px] font-pixel px-1 py-0.2 bg-[#E8E8E8] text-[#495464] rounded border border-[#BBBFCA]/50">
                  {game.platforms[0] || 'WIN'}
                </span>
                <span className="text-[9px] font-pixel px-1 py-0.2 bg-[#E8E8E8] text-[#495464] rounded border border-[#BBBFCA]/50">
                  DRM-FREE
                </span>
              </div>
            </div>
          </div>

          {/* Rincian Harga */}
          <div className="space-y-2 text-xs text-[#495464] pt-2">
            <div className="flex justify-between">
              <span>Harga Lisensi Game</span>
              <span className="font-semibold text-[#222629]">
                {game.price === 0 ? 'Gratis' : `Rp${game.price.toLocaleString('id-ID')}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Biaya Layanan SideLoad</span>
              <span className="font-semibold text-[#222629]">Rp0</span>
            </div>
            <div className="flex justify-between">
              <span>Pajak (Termasuk)</span>
              <span className="font-semibold text-[#222629]">Rp0</span>
            </div>

            <div className="pt-3 border-t border-[#BBBFCA]/40 flex justify-between items-center text-sm font-extrabold text-[#222629]">
              <span>Total Pembayaran</span>
              <span>
                {game.price === 0 ? 'Gratis' : `Rp${game.price.toLocaleString('id-ID')}`}
              </span>
            </div>
          </div>

          {/* Tombol Bayar */}
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-3 px-4 bg-[#495464] text-[#F4F4F2] text-sm font-semibold rounded-lg hover:bg-[#3d4654] active:scale-[0.99] transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-75"
          >
            {isProcessing ? (
              <span>Memproses Pembayaran...</span>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>
                  {game.price === 0 ? 'Klaim Gratis' : `Bayar Rp${game.price.toLocaleString('id-ID')}`}
                </span>
              </>
            )}
          </button>

          <p className="text-[11px] text-[#495464] text-center pt-1">
            Garansi refund 14 hari sesuai Kebijakan Refund SideLoad. Tidak ada biaya langganan berulang.
          </p>
        </div>
      </div>
    </div>
  )
}
