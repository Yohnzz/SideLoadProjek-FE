import React from 'react'
import { Clock, CheckCircle2, ArrowRight, ShieldCheck, Gamepad2 } from 'lucide-react'

interface DeveloperWaitingApprovalPageProps {
  studioName?: string
  submittedAt?: string
  onBackToStore: () => void
}

export const DeveloperWaitingApprovalPage: React.FC<DeveloperWaitingApprovalPageProps> = ({
  studioName = 'Nusantara Horizon Studios',
  submittedAt = 'Hari ini, 10:14 WIB',
  onBackToStore
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 py-6 pb-16">
      
      {/* Header Status */}
      <div className="bg-[#E8E8E8] rounded-2xl p-8 border border-[#BBBFCA]/50 text-center space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-[#495464] text-[#F4F4F2] flex items-center justify-center mx-auto shadow-md">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-1.5">
          <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 font-pixel text-[10px] font-bold uppercase inline-block">
            Status: Menunggu Approval Admin
          </span>
          <h1 className="text-2xl font-extrabold text-[#222629] tracking-tight">
            Pengajuan Akun Developer Sedang Ditinjau
          </h1>
          <p className="text-xs sm:text-sm text-[#495464] max-w-md mx-auto leading-relaxed">
            Terima kasih telah mendaftar, <span className="font-bold text-[#222629]">{studioName}</span>. Tim kurator SideLoad sedang memeriksa portofolio dan kelengkapan data studio Anda.
          </p>
        </div>

        {/* Timeline Proses Review */}
        <div className="pt-6 border-t border-[#BBBFCA]/40 grid grid-cols-3 gap-2 text-left">
          <div className="p-3 bg-[#F4F4F2] rounded-xl border border-[#BBBFCA]/40 space-y-1">
            <span className="text-[10px] font-pixel text-[#495464] block font-bold">TAHAP 1</span>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-700">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Terkirim</span>
            </div>
            <span className="text-[10px] text-[#495464] block">{submittedAt}</span>
          </div>

          <div className="p-3 bg-white rounded-xl border-2 border-[#495464] space-y-1 shadow-xs">
            <span className="text-[10px] font-pixel text-[#495464] block font-bold">TAHAP 2</span>
            <div className="flex items-center gap-1 text-xs font-bold text-[#222629]">
              <Clock className="w-3.5 h-3.5 text-[#495464]" />
              <span>Kurasi Admin</span>
            </div>
            <span className="text-[10px] text-[#495464] block">Estimasi 1-2 hari kerja</span>
          </div>

          <div className="p-3 bg-[#F4F4F2] rounded-xl border border-[#BBBFCA]/40 space-y-1 opacity-70">
            <span className="text-[10px] font-pixel text-[#495464] block font-bold">TAHAP 3</span>
            <div className="text-xs font-bold text-[#495464]">
              Aktivasi Rilis
            </div>
            <span className="text-[10px] text-[#495464] block">Akses Dasbor Penuh</span>
          </div>
        </div>
      </div>

      {/* Informasi Tambahan */}
      <div className="bg-[#E8E8E8] rounded-xl p-6 border border-[#BBBFCA]/40 space-y-4 text-xs text-[#495464]">
        <div className="flex items-center gap-2 font-bold text-[#222629] text-sm">
          <ShieldCheck className="w-4 h-4 text-[#495464]" />
          <span>Anda Tetap Bebas Menjelajah & Bermain</span>
        </div>
        <p className="leading-relaxed">
          Selama menunggu persetujuan akun developer, akun SideLoad Anda tetap aktif sepenuhnya sebagai pengguna biasa. Anda dapat mengunduh karya indie gratis, membeli game berbayar, dan menulis ulasan komunitas.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#BBBFCA]/30">
          <span className="text-[11px]">
            Notifikasi persetujuan akan dikirimkan langsung ke email Anda.
          </span>
          <button
            onClick={onBackToStore}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#495464] text-[#F4F4F2] font-semibold rounded-lg hover:bg-[#3d4654] transition flex items-center justify-center gap-2 shadow-xs"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Jelajah Game di Etalase</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
