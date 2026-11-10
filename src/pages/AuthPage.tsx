import React, { useState } from 'react'
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  User, 
  ArrowRight,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { authService } from '../services/authService'
import { isSupabaseConfigured } from '../lib/supabase'
import type { UserRole } from '../types/game'

interface AuthPageProps {
  initialMode?: 'login' | 'register'
  onBackToStore: () => void
  onAuthSuccess: (role: UserRole, username: string, email: string) => void
  onOpenJoinDeveloper: () => void
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onBackToStore,
  onAuthSuccess,
  onOpenJoinDeveloper
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [agreeTerms, setAgreeTerms] = useState(true)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (mode === 'register' && !agreeTerms) {
      setErrorMessage('Harap setujui Syarat & Ketentuan SideLoad terlebih dahulu.')
      return
    }

    setIsLoading(true)

    try {
      if (mode === 'login') {
        const loginTarget = identifier.trim()
        if (!loginTarget || !password) {
          setErrorMessage('Harap masukkan email/username dan kata sandi.')
          setIsLoading(false)
          return
        }

        if (isSupabaseConfigured) {
          await authService.signInWithEmail(loginTarget, password)
          const profile = await authService.getCurrentUserProfile()
          if (profile) {
            onAuthSuccess(profile.role, profile.username, profile.email)
          } else {
            onAuthSuccess('user', loginTarget.split('@')[0], loginTarget)
          }
        } else {
          // Mode demo lokal jika kredensial .env belum diisi pengguna
          const username = loginTarget.includes('@') ? loginTarget.split('@')[0] : loginTarget
          const userEmail = loginTarget.includes('@') ? loginTarget : `${loginTarget}@sideload.id`
          onAuthSuccess('user', username, userEmail)
        }
      } else {
        // Mode registrasi
        const regEmail = email.trim()
        const regUsername = identifier.trim() || regEmail.split('@')[0]

        if (!regEmail || !password) {
          setErrorMessage('Harap isi alamat email dan kata sandi yang valid.')
          setIsLoading(false)
          return
        }

        if (password.length < 6) {
          setErrorMessage('Kata sandi minimal terdiri dari 6 karakter.')
          setIsLoading(false)
          return
        }

        if (isSupabaseConfigured) {
          await authService.signUp(regEmail, password, regUsername)
          setErrorMessage(null)
          onAuthSuccess('user', regUsername, regEmail)
        } else {
          onAuthSuccess('user', regUsername, regEmail)
        }
      }
    } catch (err: any) {
      console.error('Error autentikasi:', err)
      setErrorMessage(err.message || 'Terjadi kesalahan saat menghubungi server autentikasi.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setErrorMessage(null)
    setIsLoading(true)
    try {
      if (isSupabaseConfigured) {
        await authService.signInWithOAuth(provider)
      } else {
        onAuthSuccess('user', `${provider}_user`, `user@${provider}.com`)
      }
    } catch (err: any) {
      console.error(`Error OAuth ${provider}:`, err)
      setErrorMessage(err.message || `Gagal masuk dengan ${provider}.`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#181B1E] text-[#F4F4F2] flex flex-col justify-between selection:bg-[#495464] selection:text-white font-sans">
      
      {/* Top Bar Navigasi */}
      <div className="max-w-6xl w-full mx-auto px-6 h-16 flex items-center justify-between text-xs text-[#BBBFCA]">
        <button
          onClick={onBackToStore}
          className="flex items-center gap-2 hover:text-white transition font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Etalase Publik</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="hover:text-white cursor-pointer">Pusat Layanan Akun</span>
          <span>|</span>
          <span className="hover:text-white cursor-pointer">Bantuan</span>
        </div>
      </div>

      {/* Konten Tengah: 2 Kolom */}
      <div className="max-w-6xl w-full mx-auto px-6 py-8 flex-1 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center w-full max-w-4xl">
          
          {/* Kolom Kiri: Logo Metalik & Identitas Nilai */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Box Logo Metalik Besar */}
            <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#13181C] p-2">
              <img
                src="/sideload_logo.jpg"
                alt="SideLoad Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <div className="inline-block px-2.5 py-1 rounded bg-white/5 border border-white/10 text-[10px] font-pixel uppercase tracking-wider text-[#BBBFCA]">
                Repositori Indie Resmi
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Etalase Digital Mandiri
              </h1>

              <p className="text-xs sm:text-sm text-[#BBBFCA] leading-relaxed max-w-md">
                Tempat game dan aplikasi indie karya developer Indonesia ditemukan dan didukung. Masuk untuk mengelola koleksi, unduhan, dan rilisan aplikasi Anda.
              </p>
            </div>

            {/* 3 Nilai Utama */}
            <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-3 text-xs">
              <div>
                <span className="font-pixel text-xs text-white block font-bold">100%</span>
                <span className="text-[11px] text-[#BBBFCA]">Bebas Telemetri</span>
              </div>
              <div>
                <span className="font-pixel text-xs text-white block font-bold">Lokal</span>
                <span className="text-[11px] text-[#BBBFCA]">Kreator Nusantara</span>
              </div>
              <div>
                <span className="font-pixel text-xs text-white block font-bold">Direct</span>
                <span className="text-[11px] text-[#BBBFCA]">Dukungan Penuh</span>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Card Form Auth */}
          <div className="lg:col-span-6 bg-[#22262B] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
            
            {/* Tab Switcher: Masuk vs Daftar Baru */}
            <div className="grid grid-cols-2 p-1 bg-[#181B1E] rounded-xl border border-white/5 text-xs">
              <button
                type="button"
                onClick={() => { setMode('login'); setErrorMessage(null) }}
                className={`py-2 rounded-lg font-bold transition ${
                  mode === 'login'
                    ? 'bg-[#495464] text-white shadow-xs'
                    : 'text-[#BBBFCA] hover:text-white'
                }`}
              >
                Masuk Akun
              </button>

              <button
                type="button"
                onClick={() => { setMode('register'); setErrorMessage(null) }}
                className={`py-2 rounded-lg font-bold transition ${
                  mode === 'register'
                    ? 'bg-[#495464] text-white shadow-xs'
                    : 'text-[#BBBFCA] hover:text-white'
                }`}
              >
                Daftar Baru
              </button>
            </div>

            {/* Error Message Box */}
            {errorMessage && (
              <div className="p-3 bg-rose-950/40 border border-rose-500/50 rounded-xl flex items-start gap-2.5 text-xs text-rose-200 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Tombol OAuth Google & GitHub */}
            <div className="space-y-2.5">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleOAuthLogin('google')}
                className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white transition flex items-center justify-center gap-2.5 disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                  <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                  <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/>
                  <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"/>
                </svg>
                <span>Lanjutkan dengan Google</span>
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleOAuthLogin('github')}
                className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-semibold text-white transition flex items-center justify-center gap-2.5 disabled:opacity-50"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>Lanjutkan dengan GitHub</span>
              </button>
            </div>

            {/* Garis Pemisah */}
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-white/10" />
              <span className="absolute bg-[#22262B] px-3 text-[10px] font-pixel text-[#BBBFCA] uppercase">
                Atau Akun Lokal
              </span>
            </div>

            {/* Form Input Email & Password */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#BBBFCA]">Nama Pengguna</label>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="nama_kamu"
                    className="w-full bg-[#181B1E] text-white text-xs px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-[#495464] outline-none transition"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-[#BBBFCA]">
                  {mode === 'login' ? 'Email atau Nama Pengguna' : 'Alamat Email'}
                </label>
                <div className="relative">
                  <input
                    type={mode === 'login' ? 'text' : 'email'}
                    required
                    value={mode === 'login' ? identifier : email}
                    onChange={e => mode === 'login' ? setIdentifier(e.target.value) : setEmail(e.target.value)}
                    placeholder={mode === 'login' ? 'nama_pengguna atau email@domain.com' : 'pengguna@sideload.id'}
                    className="w-full bg-[#181B1E] text-white text-xs pl-3.5 pr-9 py-2.5 rounded-xl border border-white/10 focus:border-[#495464] outline-none transition"
                  />
                  <User className="w-4 h-4 text-[#BBBFCA] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-[#BBBFCA]">Kata Sandi</label>
                  {mode === 'login' && (
                    <a href="#lupa" className="text-[11px] text-[#BBBFCA] hover:text-white transition">
                      Lupa kata sandi?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full bg-[#181B1E] text-white text-xs pl-3.5 pr-9 py-2.5 rounded-xl border border-white/10 focus:border-[#495464] outline-none transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BBBFCA] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Checkbox Options */}
              {mode === 'login' ? (
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#BBBFCA] pt-1">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="accent-[#495464]"
                  />
                  <span>Tetap masuk di perangkat ini</span>
                </label>
              ) : (
                <label className="flex items-start gap-2 cursor-pointer text-xs text-[#BBBFCA] pt-1">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={e => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 accent-[#495464]"
                  />
                  <span className="text-[11px] leading-relaxed">
                    Saya menyetujui Syarat & Ketentuan serta Kebijakan Privasi SideLoad.
                  </span>
                </label>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#495464] hover:bg-[#3d4654] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-md active:scale-[0.99] mt-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'login' ? 'Masuk ke SideLoad' : 'Daftar Akun Baru'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Link Alih ke Pendaftaran Developer */}
            <div className="pt-3 border-t border-white/10 text-center text-xs text-[#BBBFCA]">
              <span>Ingin menerbitkan karyamu? </span>
              <button
                type="button"
                onClick={onOpenJoinDeveloper}
                className="text-white font-bold hover:underline"
              >
                Daftar sebagai Developer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Gelap */}
      <div className="border-t border-white/10 py-5 text-xs text-[#BBBFCA]/70">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© 2025 SideLoad. Hak Cipta Dilindungi.</span>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#syarat" className="hover:text-white">Syarat & Ketentuan</a>
            <a href="#privasi" className="hover:text-white">Kebijakan Privasi</a>
            <a href="#refund" className="hover:text-white">Kebijakan Refund</a>
            <button type="button" onClick={onOpenJoinDeveloper} className="text-white hover:underline">
              Jadi Developer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
