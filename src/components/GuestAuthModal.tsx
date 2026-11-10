import React from 'react'
import { X, Lock, ArrowRight } from 'lucide-react'

interface GuestAuthModalProps {
  isOpen: boolean
  onClose: () => void
  onOpenLogin: () => void
  onOpenRegister: () => void
  actionLabel?: string
}

export const GuestAuthModal: React.FC<GuestAuthModalProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
  onOpenRegister,
  actionLabel = 'mengunduh atau membeli karya ini'
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-[#222629]/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#F4F4F2] rounded-2xl max-w-sm w-full border border-[#BBBFCA] p-6 shadow-2xl relative space-y-4 text-center">
        
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-[#495464] hover:text-[#222629] p-1"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-[#495464] text-[#F4F4F2] flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-[#222629]">
            Masuk atau Buat Akun
          </h3>
          <p className="text-xs text-[#495464] leading-relaxed">
            Untuk {actionLabel}, Anda perlu masuk menggunakan akun SideLoad terlebih dahulu.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              onClose()
              onOpenLogin()
            }}
            className="w-full py-2.5 px-4 bg-[#495464] text-[#F4F4F2] text-xs font-semibold rounded-lg hover:bg-[#3d4654] transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Masuk Akun</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              onClose()
              onOpenRegister()
            }}
            className="w-full py-2.5 px-4 bg-[#E8E8E8] text-[#222629] text-xs font-semibold rounded-lg border border-[#BBBFCA] hover:bg-white transition"
          >
            Daftar Akun Baru
          </button>
        </div>

        <p className="text-[11px] text-[#495464] pt-1">
          100% Gratis & Bebas Telemetri.
        </p>
      </div>
    </div>
  )
}
