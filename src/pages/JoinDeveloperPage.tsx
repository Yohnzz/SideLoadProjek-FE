import React, { useState } from 'react';
import { ArrowLeft, AlertCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { Button, Input, Textarea, Checkbox } from '../components/ui';
import { developerService } from '../services/developerService';
import type { UserProfile } from '../types/game';

interface JoinDeveloperPageProps {
  currentUser?: UserProfile;
  onSubmitted: (studioName: string) => void;
  onBack: () => void;
}

export const JoinDeveloperPage: React.FC<JoinDeveloperPageProps> = ({
  currentUser,
  onSubmitted,
  onBack,
}) => {
  const [studioName, setStudioName] = useState(currentUser?.studioName || '');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [contactEmail, setContactEmail] = useState(currentUser?.email || '');
  const [description, setDescription] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!agreed) {
      setErrorMessage('Harap setujui Perjanjian Developer SideLoad terlebih dahulu.');
      return;
    }

    if (!studioName.trim() || !contactEmail.trim() || !description.trim()) {
      setErrorMessage('Nama studio, email aktif, dan deskripsi rencana karya wajib diisi.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await developerService.applyDeveloper({
        userId: currentUser?.id || 'usr-temp',
        studioName: studioName.trim(),
        portfolioUrl: portfolioUrl.trim(),
        contactEmail: contactEmail.trim(),
        description: description.trim(),
      });

      if (!res.success && res.error) {
        setErrorMessage(res.error);
        setIsSubmitting(false);
        return;
      }

      onSubmitted(studioName.trim());
    } catch (err: any) {
      console.error('Error saat pengajuan developer:', err);
      setErrorMessage(err.message || 'Gagal mengirim formulir pengajuan developer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4 pb-16">
      {/* Tombol Kembali */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-medium text-[#737887] hover:text-[#171923] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Kembali ke Etalase</span>
      </button>

      {/* Header Halaman */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2373FB] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Program Kreator & Studio Indie Indonesia</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171923] tracking-tight">
          Gabung Jadi Developer SideLoad
        </h1>

        <p className="text-xs sm:text-sm text-[#737887] leading-relaxed">
          Publikasikan game dan aplikasimu langsung ke ribuan pemain Indonesia. Skema royalti transparan: 98% pendapatan untuk studio dan hanya 2% biaya pemeliharaan platform.
        </p>
      </div>

      {/* Box Info Jaminan Akun */}
      <div className="p-4 bg-white rounded-[14px] border border-[#E5E7EB] shadow-xs flex items-start gap-3 text-xs text-[#737887]">
        <ShieldCheck className="w-5 h-5 text-[#2373FB] mt-0.5 shrink-0" />
        <div className="space-y-0.5">
          <span className="font-semibold text-[#171923]">Akun Anda Tetap Aktif</span>
          <p className="leading-relaxed">
            Selama proses kurasi data studio, Anda tetap dapat menggunakan akun ini untuk membeli game, mengunduh karya gratis, dan bermain di browser seperti biasa.
          </p>
        </div>
      </div>

      {/* Alert Pesan Error */}
      {errorMessage && (
        <div className="p-3.5 bg-[#FEE2E2] border border-[#FECACA] rounded-[12px] flex items-start gap-2.5 text-xs text-[#B91C1C]">
          <AlertCircle className="w-4 h-4 text-[#DC2626] mt-0.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Formulir Data Studio Pengembang */}
      <form onSubmit={handleSubmit} className="bg-white rounded-[16px] p-6 sm:p-8 border border-[#E5E7EB] shadow-xs space-y-6">
        <Input
          label="Nama Studio atau Pengembang"
          placeholder="Contoh: Nusantara Horizon Studios"
          required
          value={studioName}
          onChange={(e) => setStudioName(e.target.value)}
          helperText="Nama ini akan ditampilkan sebagai kreator pada halaman etalase dan pustaka pemain."
        />

        <Input
          label="Tautan Portofolio / Karya Sebelumnya (Opsional)"
          placeholder="https://itch.io/profile/studio-kamu atau link GitHub / Steam"
          value={portfolioUrl}
          onChange={(e) => setPortfolioUrl(e.target.value)}
          helperText="Sertakan tautan portofolio atau media sosial tempat tim kurator dapat meninjau prototipe karya Anda."
        />

        <Input
          label="Kontak & Email Penanggung Jawab"
          type="email"
          placeholder="nama@studio.id"
          required
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          helperText="Kami akan mengirimkan surat perjanjian mitra resmi dan laporan bagi hasil ke alamat ini."
        />

        <Textarea
          label="Deskripsi Singkat Studio & Rencana Karya"
          placeholder="Jelaskan fokus game yang ingin Anda terbitkan (misal: visual novel, RPG naratif Dieng, atau game edukasi)..."
          required
          maxLength={500}
          showCharCount
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          helperText="Maksimal 500 karakter deskripsi objektif."
        />

        {/* Kotak Rincian Skema Komisi 98/2 */}
        <div className="p-4 bg-[#F7F8FA] rounded-[12px] border border-[#E5E7EB] space-y-2 text-xs">
          <div className="font-semibold text-[#171923]">Skema Transparansi Finansial SideLoad</div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-white rounded-[8px] border border-[#E5E7EB]">
              <span className="text-[11px] text-[#737887]">Hak Bersih Developer</span>
              <div className="text-base font-extrabold text-[#16A34A] mt-0.5">98%</div>
              <span className="text-[10px] text-[#737887]">Dari setiap transaksi resmi</span>
            </div>
            <div className="p-3 bg-white rounded-[8px] border border-[#E5E7EB]">
              <span className="text-[11px] text-[#737887]">Biaya Platform Admin</span>
              <div className="text-base font-bold text-[#171923] mt-0.5">2%</div>
              <span className="text-[10px] text-[#737887]">Pemeliharaan server & CDN</span>
            </div>
          </div>
        </div>

        {/* Persetujuan */}
        <Checkbox
          id="agree-terms"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          label="Saya telah membaca dan menyetujui Perjanjian Developer SideLoad"
          description="Termasuk skema bagi hasil 98% developer dan 2% biaya pemeliharaan platform tanpa potongan tersembunyi."
        />

        <div className="pt-4 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[11px] text-[#737887] text-center sm:text-left">
            * Data dapat diperbarui setelah proses kurasi disetujui.
          </span>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            className="w-full sm:w-auto"
          >
            Kirim Pengajuan Developer
          </Button>
        </div>
      </form>
    </div>
  );
};
