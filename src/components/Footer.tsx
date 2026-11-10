import React from 'react'

interface FooterProps {
  onJoinDeveloper?: () => void
}

export const Footer: React.FC<FooterProps> = ({ onJoinDeveloper }) => {
  return (
    <footer className="border-t border-[#BBBFCA]/40 bg-[#E8E8E8]/60 py-6 text-xs text-[#495464]">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-[#222629]">SideLoad</span>
          <span>© 2025 SideLoad. Hak Cipta Dilindungi.</span>
        </div>
        <div className="flex flex-wrap items-center gap-5 font-medium">
          <a href="#syarat" className="hover:text-[#222629] transition">Syarat & Ketentuan</a>
          <a href="#privasi" className="hover:text-[#222629] transition">Kebijakan Privasi</a>
          <a href="#refund" className="hover:text-[#222629] transition">Kebijakan Refund</a>
          <button 
            type="button"
            onClick={onJoinDeveloper}
            className="text-[#222629] font-bold hover:underline transition"
          >
            Jadi Developer
          </button>
        </div>
      </div>
    </footer>
  )
}
