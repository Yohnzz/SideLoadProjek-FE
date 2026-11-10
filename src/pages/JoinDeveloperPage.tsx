import React, { useState } from 'react'
import { Info, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { developerService } from '../services/developerService'
import type { UserProfile } from '../types/game'

interface JoinDeveloperPageProps {
  currentUser?: UserProfile
  onSubmitted: (studioName: string) => void
  onBack: () => void
}

export const JoinDeveloperPage: React.FC<JoinDeveloperPageProps> = ({
  currentUser,
  onSubmitted,
  onBack
}) => {
  const [studioName, setStudioName] = useState(currentUser?.studioName || '')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [contactEmail, setContactEmail] = useState(currentUser?.email || '')
  const [description, setDescription] = useState('')
  const [agreed, setAgreed] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!agreed) {
      setErrorMessage('Harap setujui Perjanjian Developer terlebih dahulu.')
      return
    }

    if (!studioName.trim() || !portfolioUrl.trim() || !contactEmail.trim() || !description.trim()) {
      setErrorMessage('Semua bidang formulir wajib diisi dengan lengkap.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await developerService.applyDeveloper({
        userId: currentUser?.id || 'usr-temp',
        studioName: studioName.trim(),
        portfolioUrl: portfolioUrl.trim(),
        contactEmail: contactEmail.trim(),
        description: description.trim(),
      })

      if (!res.success && res.error) {
        setErrorMessage(res.error)
        setIsSubmitting(false)
        return
      }

      onSubmitted(studioName.trim())
    } catch (err: any) {
      console.error('Error saat pengajuan developer:', err)
      setErrorMessage(err.message || 'Gagal mengirim pengajuan developer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Header Judul */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#E8E8E8] text-[#495464] border border-[#BBBFCA]/50 text-[10px] font-pixel uppercase">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#495464]" />
          <span>Program Kreator Indie Indonesia</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222629] tracking-tight">
          Gabung Jadi Developer SideLoad
        </h1>

        <p className="text-xs sm:text-sm text-[#495464] leading-relaxed">
          Publikasikan game dan aplikasimu langsung ke komunitas Indonesia dengan bagi hasil 90% tanpa biaya tersembunyi.
        </p>
      </div>

      {/* Info Callout */}
      <div className="p-4 bg-[#E8E8E8] rounded-xl border border-[#BBBFCA]/50 flex items-start gap-3 text-xs text-[#495464]">
        <Info className="w-4 h-4 text-[#495464] mt-0.5 shrink-0" />
        <span className="leading-relaxed">
          Selama proses review akun, Anda tetap dapat menggunakan akun ini untuk membeli dan memainkan game seperti biasa.
        </span>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl flex items-start gap-2.5 text-xs text-[#B42318] animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-[#B42318] mt-0.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Formulir Pengajuan */}
      <form 
        onSubmit={handleSubmit}
        className="bg-[#E8E8E8] rounded-xl p-6 sm:p-8 border border-[#BBBFCA]/40 space-y-5"
      >
        {/* Nama Studio */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#222629]">
            Nama Studio atau Nama Pengembang <span className="text-[#B42318]">*</span>
          </label>
          <input
            type="text"
            required
            value={studioName}
            onChange={e => setStudioName(e.target.value)}
            placeholder="Contoh: Nusantara Horizon Studios"
            className="w-full bg-[#F4F4F2] text-[#222629] text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#BBBFCA]/60 focus:border-[#495464] focus:bg-white outline-none transition"
          />
          <p className="text-[11px] text-[#495464]">
            Nama ini akan ditampilkan sebagai developer pada halaman produk dan pustaka pemain.
          </p>
        </div>

        {/* Tautan Portofolio */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#222629]">
            Tautan Portofolio / Karya Sebelumnya <span className="text-[#B42318]">*</span>
          </label>
          <input
            type="url"
            required
            value={portfolioUrl}
            onChange={e => setPortfolioUrl(e.target.value)}
            placeholder="https://itch.io/profile/namastudio"
            className="w-full bg-[#F4F4F2] text-[#222629] text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#BBBFCA]/60 focus:border-[#495464] focus:bg-white outline-none transition"
          />
          <p className="text-[11px] text-[#495464]">
            Sertakan tautan itch.io, Steam, GitHub, atau situs web studio tempat kami dapat meninjau prototipe Anda.
          </p>
        </div>

        {/* Kontak & Email */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#222629]">
            Kontak & Email Penanggung Jawab <span className="text-[#B42318]">*</span>
          </label>
          <input
            type="email"
            required
            value={contactEmail}
            onChange={e => setContactEmail(e.target.value)}
            placeholder="kreator@studio.id"
            className="w-full bg-[#F4F4F2] text-[#222629] text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#BBBFCA]/60 focus:border-[#495464] focus:bg-white outline-none transition"
          />
          <p className="text-[11px] text-[#495464]">
            Kami akan mengirimkan surat perjanjian mitra resmi dan laporan pembayaran ke alamat ini.
          </p>
        </div>

        {/* Deskripsi Singkat */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-[#222629]">
            Deskripsi Singkat Studio & Rencana Karya <span className="text-[#B42318]">*</span>
          </label>
          <textarea
            rows={4}
            required
            maxLength={500}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Ceritakan tim Anda, genre game yang dikembangkan, dan target rilis karya..."
            className="w-full bg-[#F4F4F2] text-[#222629] text-xs sm:text-sm p-3.5 rounded-lg border border-[#BBBFCA]/60 focus:border-[#495464] focus:bg-white outline-none resize-none transition"
          />
          <p className="text-[11px] text-[#495464]">
            Maksimal 500 karakter deskripsi objektif.
          </p>
        </div>

        {/* Checkbox Perjanjian */}
        <div className="pt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
              className="mt-0.5 accent-[#495464]"
            />
            <span className="text-xs text-[#222629] leading-relaxed">
              Saya telah membaca dan menyetujui <span className="underline font-semibold cursor-pointer">Perjanjian Developer SideLoad</span>, termasuk skema bagi hasil 90% developer dan komisi platform 10%.
            </span>
          </label>
        </div>

        {/* Action Bar */}
        <div className="pt-4 border-t border-[#BBBFCA]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-[#495464] hover:text-[#222629] order-2 sm:order-1"
          >
            ← Batal & Kembali ke Beranda
          </button>

          <button
            type="submit"
            disabled={isSubmitting || !agreed}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#495464] hover:bg-[#3d4654] text-[#F4F4F2] text-xs font-semibold rounded-lg transition active:scale-[0.99] disabled:opacity-50 order-1 sm:order-2 shadow-xs flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Mengirimkan Pengajuan...</span>
              </>
            ) : (
              <span>Kirim Pengajuan</span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
