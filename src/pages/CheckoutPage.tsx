import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, Lock, QrCode, CheckCircle2, Building, Smartphone } from 'lucide-react';
import { Button, Badge, Modal } from '../components/ui';
import type { Game } from '../types/game';

interface CheckoutPageProps {
  game: Game;
  onBack: () => void;
  onSuccess: (game: Game) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ game, onBack, onSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va' | 'ewallet'>('qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQrisModal, setShowQrisModal] = useState(false);

  const isFree = game.price === 0;

  const handlePayClick = () => {
    if (isFree) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess(game);
      }, 1000);
      return;
    }

    if (paymentMethod === 'qris') {
      setShowQrisModal(true);
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess(game);
      }, 1500);
    }
  };

  const handleSimulateScanQris = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowQrisModal(false);
      onSuccess(game);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Navigasi Kembali */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-medium text-[#737887] hover:text-[#171923] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Detail Produk</span>
      </button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#171923]">
          {isFree ? 'Konfirmasi Klaim Gratis' : 'Penyelesaian Pembayaran'}
        </h1>
        <p className="text-xs text-[#737887] mt-1">
          {isFree
            ? 'Klaim lisensi game ini tanpa biaya dan tambahkan langsung ke pustaka akun Anda.'
            : 'Transaksi aman dengan gateway pembayaran lokal Indonesia tanpa biaya tersembunyi.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: Metode Pembayaran (7 Kolom) */}
        <div className="md:col-span-7 bg-white rounded-[16px] p-6 border border-[#E5E7EB] shadow-xs space-y-5">
          <div>
            <h2 className="text-sm font-bold text-[#171923]">Pilihan Metode Transaksi</h2>
            <p className="text-xs text-[#737887] mt-0.5">
              {isFree ? 'Klaim instan bebas biaya' : 'Pilih jalur pembayaran resmi yang Anda gunakan'}
            </p>
          </div>

          {isFree ? (
            <div className="p-4 bg-[#DCFCE7] rounded-[12px] border border-[#BBF7D0] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#15803D]">Game Gratis / Akses Terbuka</h4>
                <p className="text-xs text-[#15803D] mt-0.5 leading-relaxed">
                  Kreator merilis game ini secara gratis. Anda dapat langsung mengklaim dan mengunduhnya ke Pustaka tanpa perlu memasukkan informasi perbankan.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* QRIS Instan */}
              <label
                onClick={() => setPaymentMethod('qris')}
                className={`block p-4 rounded-[12px] border cursor-pointer transition-all ${
                  paymentMethod === 'qris'
                    ? 'bg-[#EFF6FF] border-[#2373FB] ring-2 ring-[#2373FB]/20 shadow-xs'
                    : 'bg-white border-[#E5E7EB] hover:border-[#D1D5DB]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'qris'}
                      onChange={() => setPaymentMethod('qris')}
                      className="accent-[#2373FB]"
                    />
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-[#2373FB]" />
                      <span className="text-xs font-bold text-[#171923]">QRIS Instan</span>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">
                    Verifikasi Instan
                  </Badge>
                </div>
                <p className="text-xs text-[#737887] mt-2 pl-7 leading-relaxed">
                  GoPay, OVO, ShopeePay, DANA, BCA Mobile, Livin Mandiri, dan perbankan digital.
                </p>
              </label>

              {/* Virtual Account Bank Transfer */}
              <label
                onClick={() => setPaymentMethod('va')}
                className={`block p-4 rounded-[12px] border cursor-pointer transition-all ${
                  paymentMethod === 'va'
                    ? 'bg-[#EFF6FF] border-[#2373FB] ring-2 ring-[#2373FB]/20 shadow-xs'
                    : 'bg-white border-[#E5E7EB] hover:border-[#D1D5DB]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'va'}
                    onChange={() => setPaymentMethod('va')}
                    className="accent-[#2373FB]"
                  />
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#737887]" />
                    <span className="text-xs font-bold text-[#171923]">Virtual Account (Transfer Bank)</span>
                  </div>
                </div>
                <p className="text-xs text-[#737887] mt-2 pl-7 leading-relaxed">
                  BCA, Mandiri, BNI, BRI. Nomor rekening virtual dibuat otomatis.
                </p>
              </label>

              {/* E-Wallet Direct */}
              <label
                onClick={() => setPaymentMethod('ewallet')}
                className={`block p-4 rounded-[12px] border cursor-pointer transition-all ${
                  paymentMethod === 'ewallet'
                    ? 'bg-[#EFF6FF] border-[#2373FB] ring-2 ring-[#2373FB]/20 shadow-xs'
                    : 'bg-white border-[#E5E7EB] hover:border-[#D1D5DB]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'ewallet'}
                    onChange={() => setPaymentMethod('ewallet')}
                    className="accent-[#2373FB]"
                  />
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-[#737887]" />
                    <span className="text-xs font-bold text-[#171923]">E-Wallet Langsung (DANA / ShopeePay)</span>
                  </div>
                </div>
                <p className="text-xs text-[#737887] mt-2 pl-7 leading-relaxed">
                  Otentikasi aman via aplikasi dompet digital ponsel Anda.
                </p>
              </label>
            </div>
          )}

          <div className="pt-4 border-t border-[#E5E7EB] flex items-start gap-2.5 text-xs text-[#737887]">
            <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Diproses aman melalui sertifikasi enkripsi 256-bit. Dilengkapi jaminan refund 14 hari bila game mengalami kendala teknis.
            </span>
          </div>
        </div>

        {/* Kolom Kanan: Rincian Produk & Total Tagihan (5 Kolom) */}
        <div className="md:col-span-5 bg-white rounded-[16px] p-6 border border-[#E5E7EB] shadow-xs space-y-5">
          <h2 className="text-sm font-bold text-[#171923]">Rincian Pesanan</h2>

          {/* Kartu Ringkasan Produk */}
          <div className="flex items-center gap-3 p-3 bg-[#F0F1F5] rounded-[12px]">
            <div className="w-14 h-14 rounded-[8px] overflow-hidden bg-black shrink-0 border border-[#E5E7EB]">
              <img src={game.cover_url} alt={game.title} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-[#171923] truncate">{game.title}</h4>
              <p className="text-[11px] text-[#737887] truncate">{game.developer}</p>
              <div className="flex items-center gap-1 mt-1">
                <Badge variant="neutral" size="sm">{game.platforms[0] || 'WIN'}</Badge>
                <Badge variant="outline" size="sm">DRM-Free</Badge>
              </div>
            </div>
          </div>

          {/* Rincian Finansial */}
          <div className="space-y-2.5 text-xs text-[#737887] pt-2">
            <div className="flex justify-between">
              <span>Harga Lisensi Game</span>
              <span className="font-semibold text-[#171923]">
                {isFree ? 'Gratis' : `Rp ${game.price.toLocaleString('id-ID')}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Biaya Pemeliharaan Platform</span>
              <span className="font-semibold text-[#16A34A]">Rp 0 (Ditanggung Developer)</span>
            </div>
            <div className="flex justify-between">
              <span>Pajak Transaksi</span>
              <span className="font-semibold text-[#171923]">Termasuk</span>
            </div>

            <div className="pt-3 border-t border-[#E5E7EB] flex justify-between items-center text-sm font-bold text-[#171923]">
              <span>Total Akhir</span>
              <span className="text-lg text-[#2373FB]">
                {isFree ? 'Gratis' : `Rp ${game.price.toLocaleString('id-ID')}`}
              </span>
            </div>
          </div>

          {/* Tombol Eksekusi Bayar / Klaim */}
          <Button
            variant="primary"
            size="lg"
            className="w-full shadow-xs"
            isLoading={isProcessing}
            leftIcon={isFree ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            onClick={handlePayClick}
          >
            {isFree ? 'Klaim Game ke Pustaka' : `Bayar Rp ${game.price.toLocaleString('id-ID')}`}
          </Button>

          <p className="text-[11px] text-[#737887] text-center leading-relaxed">
            Akses game bersifat permanen untuk akun Anda tanpa biaya langganan bulanan.
          </p>
        </div>
      </div>

      {/* Modal Simulasi QRIS Interaktif */}
      <Modal
        isOpen={showQrisModal}
        onClose={() => setShowQrisModal(false)}
        title="Pembayaran QRIS Nasional"
        description="Pindai kode QR menggunakan aplikasi dompet digital atau mobile banking Anda."
        footer={
          <div className="w-full flex items-center justify-between">
            <span className="text-xs text-[#737887]">Menunggu scan kamera...</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowQrisModal(false)}>
                Batal
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                onClick={handleSimulateScanQris}
              >
                Simulasi Scan Berhasil
              </Button>
            </div>
          </div>
        }
      >
        <div className="flex flex-col items-center justify-center p-4 space-y-4 text-center">
          <div className="p-4 bg-white rounded-[16px] border-2 border-dashed border-[#2373FB] shadow-md inline-block">
            {/* Visualisasi QRIS Code Dummy */}
            <div className="w-48 h-48 bg-[#F0F1F5] rounded-[10px] flex flex-col items-center justify-center p-3 relative">
              <QrCode className="w-32 h-32 text-[#171923]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-[#2373FB] text-white flex items-center justify-center font-bold text-xs shadow-md">
                  SL
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-[#171923]">NMK: ID102938475829103</div>
            <div className="text-sm font-bold text-[#2373FB] mt-0.5">
              Rp {game.price.toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
