import React, { useState } from 'react'
import { 
  Check, 
  ArrowLeft, 
  Upload, 
  CheckCircle2, 
  Sparkles,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { gameService } from '../services/gameService'
import type { UserProfile } from '../types/game'

interface SubmitGamePageProps {
  currentUser?: UserProfile
  onBack: () => void
  onSubmitSuccess: () => void
}

export const SubmitGamePage: React.FC<SubmitGamePageProps> = ({
  currentUser,
  onBack,
  onSubmitSuccess
}) => {
  const [activeStep, setActiveStep] = useState(2)
  const [title, setTitle] = useState('Kala: Warisan Kabut')
  const [genre, setGenre] = useState('Petualangan Naratif')
  const [platforms, setPlatforms] = useState<string[]>(['win', 'web'])
  const [shortDescription, setShortDescription] = useState(
    'Kala: Warisan Kabut adalah sebuah petualangan naratif bergaya seni piksel atmosferik yang berlatar di lembah mistis pegunungan Dieng. Pemain berperan sebagai penjaga lentera yang harus menyingkap simpul waktu kuno sebelum kabut menelan desanya selamanya.'
  )
  const [price, setPrice] = useState('45000')
  const [priceType, setPriceType] = useState<'free' | 'paid'>('paid')
  const [ratingCategory, setRatingCategory] = useState<'su' | 'r13' | 'd18'>('r13')
  const [agreeOriginal, setAgreeOriginal] = useState(true)
  const [agreeSafe, setAgreeSafe] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const numPrice = priceType === 'free' ? 0 : (parseInt(price.replace(/\D/g, ''), 10) || 0)
  const commission = Math.round(numPrice * 0.1)
  const netEarnings = numPrice - commission

  const togglePlatform = (p: string) => {
    setPlatforms(prev => 
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!agreeOriginal || !agreeSafe) {
      setErrorMessage('Harap setujui deklarasi orisinalitas dan jaminan keamanan berkas.')
      return
    }

    if (!title.trim() || platforms.length === 0) {
      setErrorMessage('Judul karya dan minimal satu platform target wajib dipilih.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await gameService.submitNewGame({
        developerId: currentUser?.id || 'usr-temp',
        title: title.trim(),
        genre,
        platforms: platforms.map(p => p.toUpperCase()),
        price: numPrice,
        shortDescription: shortDescription.trim(),
        description: shortDescription.trim(),
        coverUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900&auto=format&fit=crop',
        screenshots: [
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=900&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=900&auto=format&fit=crop'
        ],
        version: 'v1.0.0',
        fileSize: '412.4 MB',
        ratingCategory: ratingCategory === 'su' ? 'Semua Umur (SU)' : ratingCategory === 'r13' ? 'Remaja (13+)' : 'Dewasa (18+)',
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      })

      if (!res.success && res.error) {
        setErrorMessage(res.error)
        setIsSubmitting(false)
        return
      }

      onSubmitSuccess()
    } catch (err: any) {
      console.error('Error pengajuan game:', err)
      setErrorMessage(err.message || 'Terjadi kesalahan saat menyimpan rilis.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Breadcrumb & ID Draft */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#495464]">
        <div className="flex items-center gap-1.5 font-pixel text-[11px]">
          <button onClick={onBack} className="hover:text-[#222629] hover:underline">
            PORTAL DEVELOPER
          </button>
          <span>/</span>
          <span className="text-[#222629] font-bold">UNGGAH RILIS BARU</span>
        </div>
        <span className="font-pixel text-[11px] bg-[#E8E8E8] px-2 py-0.5 rounded border border-[#BBBFCA]/50">
          Draft #IND-9821
        </span>
      </div>

      {/* Header Formulir */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#222629] tracking-tight">
          Formulir Pengajuan Game & Aplikasi
        </h1>
        <p className="text-xs sm:text-sm text-[#495464]">
          Lengkapi data teknis, berkas instalasi, dan kalkulasi royalti untuk melalui proses verifikasi katalog independen SideLoad.
        </p>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl flex items-start gap-2.5 text-xs text-[#B42318] animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-[#B42318] mt-0.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 4-Step Wizard Indicator */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <div 
          onClick={() => setActiveStep(1)}
          className={`p-3 rounded-lg border text-xs cursor-pointer transition flex items-center gap-2.5 ${
            activeStep === 1 
              ? 'bg-white border-[#495464] font-bold shadow-xs' 
              : 'bg-[#E8E8E8] border-[#BBBFCA]/50 text-[#495464]'
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-[#495464] text-[#F4F4F2] flex items-center justify-center text-[10px]">
            <Check className="w-3 h-3" />
          </div>
          <div>
            <div className="text-[10px] text-[#495464]">Langkah 1</div>
            <div className="font-semibold text-[#222629]">Info Produk</div>
          </div>
        </div>

        <div 
          onClick={() => setActiveStep(2)}
          className={`p-3 rounded-lg border text-xs cursor-pointer transition flex items-center gap-2.5 ${
            activeStep === 2 
              ? 'bg-white border-[#495464] font-bold shadow-xs' 
              : 'bg-[#E8E8E8] border-[#BBBFCA]/50 text-[#495464]'
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-[#495464] text-[#F4F4F2] flex items-center justify-center text-[10px] font-bold">
            2
          </div>
          <div>
            <div className="text-[10px] text-[#495464]">Langkah 2</div>
            <div className="font-semibold text-[#222629]">Media & Berkas</div>
          </div>
        </div>

        <div 
          onClick={() => setActiveStep(3)}
          className={`p-3 rounded-lg border text-xs cursor-pointer transition flex items-center gap-2.5 ${
            activeStep === 3 
              ? 'bg-white border-[#495464] font-bold shadow-xs' 
              : 'bg-[#E8E8E8] border-[#BBBFCA]/50 text-[#495464]'
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-[#BBBFCA] text-[#222629] flex items-center justify-center text-[10px] font-bold">
            3
          </div>
          <div>
            <div className="text-[10px] text-[#495464]">Langkah 3</div>
            <div className="font-semibold text-[#222629]">Harga & Bagi Hasil</div>
          </div>
        </div>

        <div 
          onClick={() => setActiveStep(4)}
          className={`p-3 rounded-lg border text-xs cursor-pointer transition flex items-center gap-2.5 ${
            activeStep === 4 
              ? 'bg-white border-[#495464] font-bold shadow-xs' 
              : 'bg-[#E8E8E8] border-[#BBBFCA]/50 text-[#495464]'
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-[#BBBFCA] text-[#222629] flex items-center justify-center text-[10px] font-bold">
            4
          </div>
          <div>
            <div className="text-[10px] text-[#495464]">Langkah 4</div>
            <div className="font-semibold text-[#222629]">Tinjau & Kirim</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ================= BAGIAN 1: INFORMASI DASAR PRODUK ================= */}
        <section className="bg-[#E8E8E8] rounded-xl p-6 border border-[#BBBFCA]/40 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#222629]">Bagian 1: Informasi Dasar Produk</h2>
              <p className="text-xs text-[#495464]">Identitas karya yang akan ditampilkan pada etalase dan metadata indeks SideLoad.</p>
            </div>
            <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-[#F4F4F2] text-[#495464] border border-[#BBBFCA]/50 uppercase">
              Wajib
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#222629]">Judul Game atau Aplikasi *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full bg-[#F4F4F2] text-[#222629] text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#BBBFCA]/60 focus:border-[#495464] focus:bg-white outline-none"
              />
              <span className="text-[10px] text-[#495464]">Gunakan nama resminya tanpa embel-embel versi rilis atau kata promosi.</span>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#222629]">Genre Utama *</label>
              <select
                value={genre}
                onChange={e => setGenre(e.target.value)}
                className="w-full bg-[#F4F4F2] text-[#222629] text-xs sm:text-sm px-3.5 py-2.5 rounded-lg border border-[#BBBFCA]/60 focus:border-[#495464] focus:bg-white outline-none"
              >
                <option value="Petualangan Naratif">Petualangan Naratif</option>
                <option value="Action RPG">Action RPG</option>
                <option value="Simulasi">Simulasi</option>
                <option value="Puzzle Pixel">Puzzle Pixel</option>
                <option value="Aplikasi Budaya & Edukasi">Aplikasi Budaya & Edukasi</option>
              </select>
            </div>
          </div>

          {/* Platform Checkboxes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#222629]">Dukungan Platform Target *</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="p-3 bg-[#F4F4F2] rounded-lg border border-[#BBBFCA]/50 flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={platforms.includes('win')}
                  onChange={() => togglePlatform('win')}
                  className="mt-0.5 accent-[#495464]"
                />
                <div>
                  <span className="text-xs font-bold text-[#222629] block">Windows PC</span>
                  <span className="text-[10px] text-[#495464]">Arsip .exe terkompresi atau .zip portabel</span>
                </div>
              </label>

              <label className="p-3 bg-[#F4F4F2] rounded-lg border border-[#BBBFCA]/50 flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={platforms.includes('web')}
                  onChange={() => togglePlatform('web')}
                  className="mt-0.5 accent-[#495464]"
                />
                <div>
                  <span className="text-xs font-bold text-[#222629] block">Web Browser</span>
                  <span className="text-[10px] text-[#495464]">Dapat dimainkan via HTML5 WebGL langsung</span>
                </div>
              </label>

              <label className="p-3 bg-[#F4F4F2] rounded-lg border border-[#BBBFCA]/50 flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={platforms.includes('apk')}
                  onChange={() => togglePlatform('apk')}
                  className="mt-0.5 accent-[#495464]"
                />
                <div>
                  <span className="text-xs font-bold text-[#222629] block">Android Mobile</span>
                  <span className="text-[10px] text-[#495464]">Instalasi mandiri berkas .apk (SideLoad)</span>
                </div>
              </label>
            </div>
          </div>

          {/* Sinopsis */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#222629]">Deskripsi Singkat & Sinopsis Game *</label>
            <textarea
              rows={3}
              value={shortDescription}
              onChange={e => setShortDescription(e.target.value)}
              className="w-full bg-[#F4F4F2] text-[#222629] text-xs sm:text-sm p-3 rounded-lg border border-[#BBBFCA]/60 focus:border-[#495464] focus:bg-white outline-none resize-none leading-relaxed"
            />
            <div className="flex justify-between text-[10px] text-[#495464]">
              <span>Minimal 50 kata untuk memberikan gambaran naratif yang jelas.</span>
              <span>{shortDescription.length}/1000 Karakter</span>
            </div>
          </div>
        </section>

        {/* ================= BAGIAN 2: MEDIA ETALASE & BERKAS INSTALASI ================= */}
        <section className="bg-[#E8E8E8] rounded-xl p-6 border border-[#BBBFCA]/40 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#222629]">Bagian 2: Media Etalase & Berkas Instalasi</h2>
              <p className="text-xs text-[#495464]">Aset visual 16:9 yang bersih dari watermark eksternal dan logo toko lain.</p>
            </div>
            <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-[#F4F4F2] text-[#495464] border border-[#BBBFCA]/50 uppercase">
              Rasio 16:9
            </span>
          </div>

          {/* Upload Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Cover Utama */}
            <div className="md:col-span-5 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-[#222629]">Cover Utama (Key Art)</span>
                <span className="text-[10px] text-[#495464]">1920x1080 (16:9)</span>
              </div>
              <div className="w-full aspect-16/9 rounded-lg overflow-hidden border border-[#BBBFCA]/60 relative bg-[#222629] group cursor-pointer shadow-xs">
                <img 
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900&auto=format&fit=crop" 
                  alt="Cover" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-semibold">
                  Ganti Gambar Cover
                </div>
              </div>
              <p className="text-[10px] text-[#495464]">Gambar cover resolusi tinggi ini akan menjadi thumbnail katalog depan SideLoad.</p>
            </div>

            {/* Galeri Gameplay */}
            <div className="md:col-span-7 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-[#222629]">Galeri Cuplikan Gameplay (3-5 Berkas)</span>
                <span className="text-[10px] text-[#495464]">Tersedia: 2/5</span>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="aspect-16/9 rounded-lg overflow-hidden border border-[#BBBFCA]/60 relative bg-[#222629]">
                  <img 
                    src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400&auto=format&fit=crop" 
                    alt="Cuplikan 1" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-16/9 rounded-lg overflow-hidden border border-[#BBBFCA]/60 relative bg-[#222629]">
                  <img 
                    src="https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=400&auto=format&fit=crop" 
                    alt="Cuplikan 2" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="aspect-16/9 rounded-lg border-2 border-dashed border-[#BBBFCA] hover:border-[#495464] bg-[#F4F4F2] flex flex-col items-center justify-center p-2 text-center cursor-pointer transition">
                  <Upload className="w-4 h-4 text-[#495464] mb-1" />
                  <span className="text-[10px] font-bold text-[#222629]">Tambah Cuplikan</span>
                  <span className="text-[9px] text-[#495464]">PNG / JPG 1080p</span>
                </div>
              </div>

              <p className="text-[10px] text-[#495464]">Cuplikan langsung gameplay tanpa bingkai promosi atau klaim diskon eksternal.</p>
            </div>
          </div>

          {/* Berkas Rilis Package */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#222629]">Berkas Paket Rilis</span>
              <button 
                type="button" 
                onClick={() => alert('Fitur tambah multi-target OS tersedia saat draf disimpan.')}
                className="text-[11px] text-[#495464] hover:text-[#222629] font-medium"
              >
                + Tambah Versi Platform Lain
              </button>
            </div>

            <div className="space-y-2">
              <div className="p-3 bg-[#F4F4F2] rounded-lg border border-[#BBBFCA]/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-[#495464] text-[#F4F4F2] font-pixel text-[10px] flex items-center justify-center">
                    WIN
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#222629] block">Kala_WarisanKabut_v1.0.0_Win64.zip</span>
                    <span className="text-[10px] text-[#495464]">Ukuran: 412.4 MB • Versi Rilis: v1.0.0</span>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  Terunggah ✓
                </span>
              </div>

              <div className="p-2 bg-[#F4F4F2]/50 rounded border border-[#BBBFCA]/40 flex items-center justify-between text-[10px] text-[#495464]">
                <span>Hash SHA-256 Otomatis:</span>
                <span className="font-mono text-[9px] text-[#222629]">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= BAGIAN 3: MODEL HARGA & BAGI HASIL ================= */}
        <section className="bg-[#E8E8E8] rounded-xl p-6 border border-[#BBBFCA]/40 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#222629]">Bagian 3: Model Harga & Transparansi Bagi Hasil</h2>
              <p className="text-xs text-[#495464]">Skema pendapatan langsung tanpa potongan tersembunyi. SideLoad hanya mengenakan potongan platform adil 10%.</p>
            </div>
            <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-[#F4F4F2] text-[#495464] border border-[#BBBFCA]/50 uppercase font-bold">
              Bagi Hasil 90/10
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Sisi Kiri: Pilihan Harga */}
            <div className="lg:col-span-7 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#222629]">Pilih Model Akses</label>
                <div className="grid grid-cols-2 gap-3">
                  <label 
                    onClick={() => setPriceType('free')}
                    className={`p-3 rounded-lg border cursor-pointer text-xs transition ${
                      priceType === 'free' ? 'bg-white border-[#495464] font-bold shadow-xs' : 'bg-[#F4F4F2] border-[#BBBFCA]/50'
                    }`}
                  >
                    <input type="radio" name="ptype" checked={priceType === 'free'} onChange={() => setPriceType('free')} className="mr-2 accent-[#495464]" />
                    <span>Gratis</span>
                    <span className="block text-[10px] text-[#495464] mt-0.5 font-normal">Akses publik bebas biaya.</span>
                  </label>

                  <label 
                    onClick={() => setPriceType('paid')}
                    className={`p-3 rounded-lg border cursor-pointer text-xs transition ${
                      priceType === 'paid' ? 'bg-white border-[#495464] font-bold shadow-xs' : 'bg-[#F4F4F2] border-[#BBBFCA]/50'
                    }`}
                  >
                    <input type="radio" name="ptype" checked={priceType === 'paid'} onChange={() => setPriceType('paid')} className="mr-2 accent-[#495464]" />
                    <span>Harga Tetap</span>
                    <span className="block text-[10px] text-[#495464] mt-0.5 font-normal">Sekali bayar selamanya.</span>
                  </label>
                </div>
              </div>

              {priceType === 'paid' && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#222629]">Nominal Harga Jual (IDR) *</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-xs text-[#495464]">Rp</span>
                    <input
                      type="number"
                      required
                      min={10000}
                      step={1000}
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      className="w-full bg-[#F4F4F2] text-[#222629] text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-lg border border-[#BBBFCA]/60 focus:border-[#495464] focus:bg-white outline-none font-mono"
                    />
                  </div>
                  <span className="text-[10px] text-[#495464]">Rekomendasi harga karya indie berkisar antara Rp25.000 hingga Rp95.000.</span>
                </div>
              )}

              {/* Rekening Terdaftar */}
              <div className="p-3 bg-[#F4F4F2] rounded-lg border border-[#BBBFCA]/50 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#222629]">Rekening Pencairan Terdaftar:</span>
                  <span className="text-[10px] font-pixel text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-300">
                    Terverifikasi
                  </span>
                </div>
                <p className="text-[11px] text-[#495464]">
                  {currentUser?.bankAccount?.bankName || 'Bank Central Asia (BCA)'} • {currentUser?.bankAccount?.accountNumber || '827-019-3312'} a/n {currentUser?.bankAccount?.accountHolder || 'Nusantara Horizon Studio'}
                </p>
                <p className="text-[10px] text-[#495464]">Pencairan otomatis diproses setiap hari Jumat tanpa biaya administrasi transfer tambahan.</p>
              </div>
            </div>

            {/* Sisi Kanan: Kartu Simulasi Bagi Hasil */}
            <div className="lg:col-span-5 bg-[#F4F4F2] rounded-xl p-5 border border-[#BBBFCA]/60 space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-[#495464]">
                <span>SIMULASI TRANSAKSI RESMI</span>
                <span className="font-pixel text-[10px]">TRANSPARAN</span>
              </div>

              <div className="space-y-2 text-xs border-b border-[#BBBFCA]/40 pb-3">
                <div className="flex justify-between">
                  <span className="text-[#495464]">Harga Jual ke Pemain:</span>
                  <span className="font-bold text-[#222629]">
                    {priceType === 'free' ? 'Gratis' : `Rp${numPrice.toLocaleString('id-ID')}`}
                  </span>
                </div>
                <div className="flex justify-between text-[#495464]">
                  <span>Komisi Pemeliharaan SideLoad (10%):</span>
                  <span>- Rp{commission.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <span className="text-xs font-bold text-[#222629]">Hak Bersih Studio Kamu:</span>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-[#222629] block">
                    {priceType === 'free' ? 'Rp0' : `Rp${netEarnings.toLocaleString('id-ID')}`}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">90% per setiap transaksi salinan</span>
                </div>
              </div>

              <p className="text-[10px] text-[#495464] leading-relaxed pt-2 border-t border-[#BBBFCA]/30">
                Tidak ada komisi tersembunyi, biaya API server, atau penalti kuota bandwidth. Studio kamu memegang kendali kepemilikan penuh 100%.
              </p>
            </div>
          </div>
        </section>

        {/* ================= BAGIAN 4: RATING USIA & DEKLARASI ORISINALITAS ================= */}
        <section className="bg-[#E8E8E8] rounded-xl p-6 border border-[#BBBFCA]/40 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#222629]">Bagian 4: Rating Usia & Deklarasi Orisinalitas</h2>
              <p className="text-xs text-[#495464]">Jaminan kepatuhan konten demi perlindungan pemain dan integritas kurasi toko.</p>
            </div>
            <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-[#F4F4F2] text-[#495464] border border-[#BBBFCA]/50 uppercase">
              Kepatuhan Hukum
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#222629]">Klasifikasi Konten & Batas Usia</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label 
                onClick={() => setRatingCategory('su')}
                className={`p-3 rounded-lg border cursor-pointer text-xs transition ${
                  ratingCategory === 'su' ? 'bg-white border-[#495464] font-bold' : 'bg-[#F4F4F2] border-[#BBBFCA]/50'
                }`}
              >
                <input type="radio" name="cat" checked={ratingCategory === 'su'} onChange={() => setRatingCategory('su')} className="mr-2 accent-[#495464]" />
                <span>Semua Umur (SU)</span>
                <span className="block text-[10px] text-[#495464] mt-0.5 font-normal">Bebas kekerasan eksplisit, bebas alkohol, dan materi dewasa.</span>
              </label>

              <label 
                onClick={() => setRatingCategory('r13')}
                className={`p-3 rounded-lg border cursor-pointer text-xs transition ${
                  ratingCategory === 'r13' ? 'bg-white border-[#495464] font-bold' : 'bg-[#F4F4F2] border-[#BBBFCA]/50'
                }`}
              >
                <input type="radio" name="cat" checked={ratingCategory === 'r13'} onChange={() => setRatingCategory('r13')} className="mr-2 accent-[#495464]" />
                <span>Remaja (13+)</span>
                <span className="block text-[10px] text-[#495464] mt-0.5 font-normal">Terdapat sedikit unsur fantasi seram atau narasi misteri ringan.</span>
              </label>

              <label 
                onClick={() => setRatingCategory('d18')}
                className={`p-3 rounded-lg border cursor-pointer text-xs transition ${
                  ratingCategory === 'd18' ? 'bg-white border-[#495464] font-bold' : 'bg-[#F4F4F2] border-[#BBBFCA]/50'
                }`}
              >
                <input type="radio" name="cat" checked={ratingCategory === 'd18'} onChange={() => setRatingCategory('d18')} className="mr-2 accent-[#495464]" />
                <span>Dewasa (18+)</span>
                <span className="block text-[10px] text-[#495464] mt-0.5 font-normal">Tema berat, kekerasan intens, atau materi psikologis mendalam.</span>
              </label>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeOriginal}
                onChange={e => setAgreeOriginal(e.target.checked)}
                className="mt-0.5 accent-[#495464]"
              />
              <span className="text-xs text-[#222629] leading-relaxed">
                <span className="font-bold">Orisinalitas & Lisensi:</span> Saya menyatakan bahwa seluruh aset visual, kode sumber, audio, dan elemen dalam game ini adalah hasil karya orisinal tim kami atau menggunakan lisensi pihak ketiga yang sah secara hukum.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeSafe}
                onChange={e => setAgreeSafe(e.target.checked)}
                className="mt-0.5 accent-[#495464]"
              />
              <span className="text-xs text-[#222629] leading-relaxed">
                <span className="font-bold">Bebas Perangkat Berbahaya:</span> Berkas instalasi yang diunggah telah dipindai dan dipastikan bebas dari malware, trojan, pelacak tersembunyi, atau cryptocurrency miner apapun.
              </span>
            </label>
          </div>
        </section>

        {/* Action Bar Bawah */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#BBBFCA]/40">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-xs text-[#495464] hover:text-[#222629] font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Langkah Sebelumnya</span>
          </button>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            <span className="text-[11px] text-[#495464] hidden md:inline">
              Setelah dikirim, karya akan ditinjau tim kurator SideLoad dalam waktu 1-2 hari kerja.
            </span>
            <button
              type="submit"
              disabled={isSubmitting || !agreeOriginal || !agreeSafe}
              className="px-6 py-2.5 bg-[#495464] text-[#F4F4F2] text-xs font-semibold rounded-lg hover:bg-[#3d4654] active:scale-[0.99] transition disabled:opacity-60 shadow-xs flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengirimkan Berkas...</span>
                </>
              ) : (
                <>
                  <span>Kirim untuk Review</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Callout Box */}
        <div className="p-3 bg-[#E8E8E8] rounded-lg border border-[#BBBFCA]/50 flex items-start gap-2 text-xs text-[#495464]">
          <CheckCircle2 className="w-4 h-4 text-[#495464] mt-0.5 shrink-0" />
          <div>
            <span className="font-bold text-[#222629]">Status Pasca Kirim: Menunggu Review. </span>
            <span>Tim kurator kami memeriksa stabilitas berkas rilis, integritas hash, serta kesesuaian gambar cover dengan panduan etalase.</span>
          </div>
        </div>
      </form>
    </div>
  )
}
