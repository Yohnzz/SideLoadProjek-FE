import React from 'react';
import { Lock, ArrowRight, X } from 'lucide-react';
import { Button } from './ui';

interface GuestAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  actionLabel?: string;
}

export const GuestAuthModal: React.FC<GuestAuthModalProps> = ({
  isOpen,
  onClose,
  onOpenLogin,
  onOpenRegister,
  actionLabel = 'mengunduh atau membeli karya ini',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#171923]/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[16px] max-w-sm w-full border border-[#E5E7EB] p-6 shadow-xl relative space-y-4 text-center">
        <button
          onClick={onClose}
          aria-label="Tutup jendela"
          className="absolute right-4 top-4 text-[#737887] hover:text-[#171923] p-1.5 rounded-full hover:bg-[#F0F1F5] transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-[12px] bg-[#EFF6FF] text-[#2373FB] flex items-center justify-center mx-auto shadow-xs">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-[#171923]">Masuk atau Buat Akun</h3>
          <p className="text-xs text-[#737887] leading-relaxed">
            Untuk {actionLabel}, Anda perlu masuk menggunakan akun SideLoad terlebih dahulu.
          </p>
        </div>

        <div className="space-y-2.5 pt-2">
          <Button
            variant="primary"
            size="md"
            className="w-full justify-center"
            onClick={() => {
              onClose();
              onOpenLogin();
            }}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Masuk Akun
          </Button>

          <Button
            variant="secondary"
            size="md"
            className="w-full justify-center"
            onClick={() => {
              onClose();
              onOpenRegister();
            }}
          >
            Daftar Akun Baru
          </Button>
        </div>

        <p className="text-[11px] text-[#737887] pt-1">
          100% Gratis dan Bebas Telemetri.
        </p>
      </div>
    </div>
  );
};
