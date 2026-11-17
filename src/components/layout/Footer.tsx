import React from 'react';

interface FooterProps {
  onJoinDeveloper?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onJoinDeveloper }) => {
  return (
    <footer className="border-t border-[#E5E7EB] bg-white py-8 text-xs text-[#737887]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Sisi Kiri: Logo & Hak Cipta */}
        <div className="flex items-center gap-2.5">
          <img
            src="/sideload_new_logo.png"
            alt="SideLoad"
            className="w-5 h-5 object-contain"
          />
          <span className="font-bold text-[#171923] tracking-tight">SideLoad</span>
          <span className="text-[#D1D5DB]">•</span>
          <span>© 2026 SideLoad. Hak Cipta Dilindungi.</span>
        </div>

        {/* Sisi Kanan: Tautan Legal & Kreator */}
        <div className="flex flex-wrap items-center gap-6 font-medium">
          <a
            href="#syarat"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#171923] transition-colors"
          >
            Syarat & Ketentuan
          </a>
          <a
            href="#privasi"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#171923] transition-colors"
          >
            Kebijakan Privasi
          </a>
          <a
            href="#refund"
            onClick={(e) => e.preventDefault()}
            className="hover:text-[#171923] transition-colors"
          >
            Kebijakan Refund
          </a>
          {onJoinDeveloper && (
            <button
              type="button"
              onClick={onJoinDeveloper}
              className="text-[#2373FB] font-semibold hover:text-[#1D5FD0] transition-colors"
            >
              Jadi Developer
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};

