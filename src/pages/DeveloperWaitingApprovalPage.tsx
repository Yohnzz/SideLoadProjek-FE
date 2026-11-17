import React from 'react';
import { Clock, CheckCircle2, ArrowRight, ShieldCheck, Gamepad2, Sparkles, Mail } from 'lucide-react';
import { Button, Badge } from '../components/ui';

interface DeveloperWaitingApprovalPageProps {
  studioName?: string;
  submittedAt?: string;
  onBackToStore: () => void;
}

export const DeveloperWaitingApprovalPage: React.FC<DeveloperWaitingApprovalPageProps> = ({
  studioName = 'Nusantara Horizon Studios',
  submittedAt = 'Hari ini, 10:14 WIB',
  onBackToStore,
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 py-6 pb-16">
      {/* Box Utama Status Kurasi */}
      <div className="bg-white rounded-[20px] p-8 border border-[#E5E7EB] shadow-xs text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] text-[#2373FB] border border-[#DBEAFE] flex items-center justify-center mx-auto shadow-sm">
          <Clock className="w-8 h-8 animate-pulse text-[#2373FB]" />
        </div>

        <div className="space-y-2">
          <Badge variant="warning" dot size="md">
            Status: Menunggu Approval Admin
          </Badge>

          <h1 className="text-2xl font-extrabold text-[#171923] tracking-tight">
            Pengajuan Akun Developer Sedang Ditinjau
          </h1>

          <p className="text-xs sm:text-sm text-[#737887] max-w-md mx-auto leading-relaxed">
            Terima kasih telah mengajukan studio <span className="font-semibold text-[#171923]">{studioName}</span>. Tim kurator SideLoad sedang memeriksa kelengkapan data dan portofolio Anda.
          </p>
        </div>

        {/* 3 Tahap Alur Verifikasi */}
        <div className="pt-6 border-t border-[#E5E7EB] grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          <div className="p-3.5 bg-[#F7F8FA] rounded-[12px] border border-[#E5E7EB] space-y-1">
            <span className="text-[10px] font-bold text-[#737887] block uppercase tracking-wider">Langkah 1</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#16A34A]">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Terkirim</span>
            </div>
            <span className="text-[11px] text-[#737887] block">{submittedAt}</span>
          </div>

          <div className="p-3.5 bg-[#EFF6FF] rounded-[12px] border border-[#2373FB]/30 ring-2 ring-[#2373FB]/10 space-y-1">
            <span className="text-[10px] font-bold text-[#2373FB] block uppercase tracking-wider">Langkah 2</span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#171923]">
              <Clock className="w-4 h-4 text-[#2373FB] shrink-0" />
              <span>Kurasi Admin</span>
            </div>
            <span className="text-[11px] text-[#737887] block">Estimasi 1-2 hari kerja</span>
          </div>

          <div className="p-3.5 bg-[#F7F8FA] rounded-[12px] border border-[#E5E7EB] space-y-1 opacity-60">
            <span className="text-[10px] font-bold text-[#737887] block uppercase tracking-wider">Langkah 3</span>
            <div className="text-xs font-bold text-[#737887] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Aktivasi Dasbor</span>
            </div>
            <span className="text-[11px] text-[#737887] block">Rilis game & WebGL</span>
          </div>
        </div>
      </div>

      {/* Informasi Jaminan Akun Pengguna Biasa */}
      <div className="bg-white rounded-[16px] p-6 border border-[#E5E7EB] shadow-xs space-y-4 text-xs text-[#737887]">
        <div className="flex items-center gap-2 font-bold text-[#171923] text-sm">
          <ShieldCheck className="w-5 h-5 text-[#16A34A] shrink-0" />
          <span>Anda Tetap Bebas Menjelajah & Bermain</span>
        </div>
        <p className="leading-relaxed">
          Selama menunggu proses persetujuan akun developer, akun Anda tetap beroperasi penuh sebagai pengguna biasa. Anda dapat mengunduh game gratis, membeli karya indie berbayar, dan memainkan game WebGL di browser tanpa batasan.
        </p>

        <div className="pt-3 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[11px] text-[#737887]">
            <Mail className="w-4 h-4 text-[#2373FB]" />
            <span>Notifikasi persetujuan akan dikirimkan langsung ke email Anda.</span>
          </div>

          <Button
            variant="primary"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            leftIcon={<Gamepad2 className="w-4 h-4" />}
            onClick={onBackToStore}
            className="w-full sm:w-auto"
          >
            Jelajah Game di Etalase
          </Button>
        </div>
      </div>
    </div>
  );
};
