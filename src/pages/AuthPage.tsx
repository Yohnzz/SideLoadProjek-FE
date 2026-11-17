import React, { useState } from 'react';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { authService } from '../services/authService';
import { isSupabaseConfigured } from '../lib/supabase';
import type { UserRole } from '../types/game';
import { Button, Input, Checkbox } from '../components/ui';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  onBackToStore: () => void;
  onAuthSuccess: (role: UserRole, username: string, email: string) => void;
  onOpenJoinDeveloper: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onBackToStore,
  onAuthSuccess,
  onOpenJoinDeveloper,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (mode === 'forgot') {
      const resetEmail = email.trim() || identifier.trim();
      if (!resetEmail) {
        setErrorMessage('Harap masukkan alamat email akun Anda.');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSuccessMessage(`Tautan pemulihan kata sandi telah dikirimkan ke ${resetEmail}.`);
      }, 1000);
      return;
    }

    if (mode === 'register' && !agreeTerms) {
      setErrorMessage('Harap setujui Syarat & Ketentuan SideLoad terlebih dahulu.');
      return;
    }

    setIsLoading(true);

    try {
      if (mode === 'login') {
        const loginTarget = identifier.trim();
        if (!loginTarget || !password) {
          setErrorMessage('Harap masukkan email/username dan kata sandi.');
          setIsLoading(false);
          return;
        }

        if (isSupabaseConfigured) {
          await authService.signInWithEmail(loginTarget, password);
          const profile = await authService.getCurrentUserProfile();
          if (profile) {
            onAuthSuccess(profile.role, profile.username, profile.email);
          } else {
            onAuthSuccess('user', loginTarget.split('@')[0], loginTarget);
          }
        } else {
          // Mode demo lokal
          const username = loginTarget.includes('@') ? loginTarget.split('@')[0] : loginTarget;
          const userEmail = loginTarget.includes('@') ? loginTarget : `${loginTarget}@sideload.id`;
          onAuthSuccess('user', username, userEmail);
        }
      } else {
        // Mode registrasi
        const regEmail = email.trim();
        const regUsername = identifier.trim() || regEmail.split('@')[0];

        if (!regEmail || !password) {
          setErrorMessage('Harap isi alamat email dan kata sandi yang valid.');
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          setErrorMessage('Kata sandi minimal terdiri dari 6 karakter.');
          setIsLoading(false);
          return;
        }

        if (isSupabaseConfigured) {
          await authService.signUp(regEmail, password, regUsername);
          setErrorMessage(null);
          onAuthSuccess('user', regUsername, regEmail);
        } else {
          onAuthSuccess('user', regUsername, regEmail);
        }
      }
    } catch (err: any) {
      console.error('Error autentikasi:', err);
      setErrorMessage(err.message || 'Terjadi kesalahan saat menghubungi server autentikasi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      if (isSupabaseConfigured) {
        await authService.signInWithOAuth(provider);
      } else {
        onAuthSuccess('user', `${provider}_user`, `user@${provider}.com`);
      }
    } catch (err: any) {
      console.error(`Error OAuth ${provider}:`, err);
      setErrorMessage(err.message || `Gagal masuk dengan ${provider}.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#171923] flex flex-col justify-between selection:bg-[#2373FB]/20 selection:text-[#171923]">
      {/* Top Bar Navigasi */}
      <header className="w-full border-b border-[#E5E7EB] bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between text-xs text-[#737887]">
          <button
            onClick={onBackToStore}
            className="flex items-center gap-2 hover:text-[#171923] font-medium transition py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Etalase</span>
          </button>

          <div className="flex items-center gap-4 text-xs">
            <span className="hover:text-[#171923] cursor-pointer">Pusat Bantuan</span>
            <span className="text-[#E5E7EB]">|</span>
            <span className="hover:text-[#171923] cursor-pointer">Privasi</span>
          </div>
        </div>
      </header>

      {/* Konten Utama: 1 Kolom Bersih Centered */}
      <main className="w-full max-w-md mx-auto px-4 py-8 sm:py-12 flex-1 flex flex-col items-center justify-center">
        {/* Brand Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center justify-center">
            <img
              src="/sideload_new_logo.png"
              alt="SideLoad"
              className="w-12 h-12 object-contain"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#171923] tracking-tight">
              {mode === 'login'
                ? 'Masuk ke SideLoad'
                : mode === 'register'
                ? 'Buat Akun SideLoad'
                : 'Pemulihan Kata Sandi'}
            </h1>
            <p className="text-xs text-[#737887] mt-1">
              {mode === 'login'
                ? 'Jelajahi dan mainkan karya indie terbaik di browser atau desktop'
                : mode === 'register'
                ? 'Simpan riwayat pustaka dan dukung kreator indie nusantara'
                : 'Masukkan email untuk menerima tautan atur ulang kata sandi'}
            </p>
          </div>
        </div>

        {/* Card Form */}
        <div className="w-full bg-white rounded-[16px] border border-[#E5E7EB] p-6 sm:p-8 shadow-xs space-y-5">
          {/* Tab Switcher (jika bukan mode forgot) */}
          {mode !== 'forgot' && (
            <div className="grid grid-cols-2 p-1 bg-[#F0F1F5] rounded-[10px] text-xs">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-2 rounded-[8px] font-semibold transition ${
                  mode === 'login'
                    ? 'bg-white text-[#171923] shadow-xs'
                    : 'text-[#737887] hover:text-[#171923]'
                }`}
              >
                Masuk Akun
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`py-2 rounded-[8px] font-semibold transition ${
                  mode === 'register'
                    ? 'bg-white text-[#171923] shadow-xs'
                    : 'text-[#737887] hover:text-[#171923]'
                }`}
              >
                Daftar Baru
              </button>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-[10px] flex items-start gap-2.5 text-xs text-rose-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-[10px] flex items-start gap-2.5 text-xs text-emerald-800 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* OAuth Buttons (Hanya saat mode login atau register) */}
          {mode !== 'forgot' && (
            <div className="space-y-2.5">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleOAuthLogin('google')}
                className="w-full py-2.5 px-4 bg-white hover:bg-[#F7F8FA] border border-[#E5E7EB] rounded-[10px] text-xs font-semibold text-[#171923] transition flex items-center justify-center gap-2.5 shadow-xs disabled:opacity-50"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                  />
                </svg>
                <span>Lanjutkan dengan Google</span>
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleOAuthLogin('github')}
                className="w-full py-2.5 px-4 bg-white hover:bg-[#F7F8FA] border border-[#E5E7EB] rounded-[10px] text-xs font-semibold text-[#171923] transition flex items-center justify-center gap-2.5 shadow-xs disabled:opacity-50"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>Lanjutkan dengan GitHub</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="w-full border-t border-[#E5E7EB]" />
                <span className="absolute bg-white px-3 text-[11px] text-[#737887]">
                  atau dengan email
                </span>
              </div>
            </div>
          )}

          {/* Form Input Email & Password */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <Input
                label="Nama Pengguna"
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="misal: bagas_dev"
                leftIcon={<User className="w-4 h-4 text-[#737887]" />}
              />
            )}

            {mode === 'forgot' ? (
              <Input
                label="Alamat Email Terdaftar"
                type="email"
                required
                value={email || identifier}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@domain.com"
                leftIcon={<Mail className="w-4 h-4 text-[#737887]" />}
              />
            ) : (
              <Input
                label={mode === 'login' ? 'Email atau Nama Pengguna' : 'Alamat Email'}
                type={mode === 'login' ? 'text' : 'email'}
                required
                value={mode === 'login' ? identifier : email}
                onChange={(e) =>
                  mode === 'login' ? setIdentifier(e.target.value) : setEmail(e.target.value)
                }
                placeholder={mode === 'login' ? 'nama@domain.com atau username' : 'nama@domain.com'}
                leftIcon={mode === 'login' ? <User className="w-4 h-4 text-[#737887]" /> : <Mail className="w-4 h-4 text-[#737887]" />}
              />
            )}

            {mode !== 'forgot' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#171923]">Kata Sandi</label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setErrorMessage(null);
                        setSuccessMessage(null);
                      }}
                      className="text-[11px] text-[#2373FB] hover:underline"
                    >
                      Lupa kata sandi?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    leftIcon={<Lock className="w-4 h-4 text-[#737887]" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[#737887] hover:text-[#171923]"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    }
                  />
                </div>
              </div>
            )}

            {/* Checkbox Options */}
            {mode === 'login' && (
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                label="Tetap masuk di perangkat ini"
              />
            )}

            {mode === 'register' && (
              <Checkbox
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                label="Saya menyetujui Syarat & Ketentuan serta Kebijakan Privasi SideLoad"
              />
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading}
              className="w-full justify-center"
              rightIcon={!isLoading && <ArrowRight className="w-4 h-4" />}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses...</span>
                </span>
              ) : mode === 'login' ? (
                'Masuk ke SideLoad'
              ) : mode === 'register' ? (
                'Daftar Akun Baru'
              ) : (
                'Kirim Tautan Pemulihan'
              )}
            </Button>

            {mode === 'forgot' && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-center text-xs"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
              >
                Kembali ke Halaman Masuk
              </Button>
            )}
          </form>

          {/* Link Alih ke Developer */}
          <div className="pt-3 border-t border-[#E5E7EB] text-center text-xs text-[#737887]">
            <span>Ingin menerbitkan game atau aplikasi? </span>
            <button
              type="button"
              onClick={onOpenJoinDeveloper}
              className="text-[#2373FB] font-semibold hover:underline"
            >
              Daftar Jadi Developer
            </button>
          </div>
        </div>
      </main>

      {/* Footer Minimalis */}
      <footer className="border-t border-[#E5E7EB] bg-white py-4 text-xs text-[#737887]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 SideLoad. Hak Cipta Dilindungi.</span>
          <div className="flex items-center gap-4 text-[11px]">
            <a href="#syarat" className="hover:text-[#171923]">Syarat</a>
            <a href="#privasi" className="hover:text-[#171923]">Privasi</a>
            <a href="#refund" className="hover:text-[#171923]">Refund</a>
            <button
              type="button"
              onClick={onOpenJoinDeveloper}
              className="text-[#2373FB] hover:underline"
            >
              Portal Developer
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
