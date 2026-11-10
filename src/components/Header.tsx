import React from 'react'
import { Search, LogOut } from 'lucide-react'
import type { UserProfile } from '../types/game'

export type NavPage = 
  | 'home' 
  | 'detail' 
  | 'checkout' 
  | 'library' 
  | 'join-dev' 
  | 'submit-game' 
  | 'dev-dashboard' 
  | 'dev-waiting'
  | 'admin'
  | 'auth'

interface HeaderProps {
  currentPage: NavPage
  onNavigate: (page: NavPage) => void
  searchQuery: string
  onSearchChange: (q: string) => void
  currentUser: UserProfile
  onOpenAuth: (mode?: 'login' | 'register') => void
  onLogout: () => void
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  searchQuery,
  onSearchChange,
  currentUser,
  onOpenAuth,
  onLogout
}) => {
  return (
    <header className="border-b border-[#BBBFCA]/40 bg-[#F4F4F2] sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4 sm:gap-6">
        
        {/* REVISI 1: Hanya menampilkan logonya saja tanpa tulisan SideLoad */}
        <button 
          onClick={() => onNavigate('home')}
          className="focus:outline-none group shrink-0"
          title="Beranda SideLoad"
        >
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-[#222629] border border-[#BBBFCA]/60 flex items-center justify-center shadow-xs transition group-hover:scale-105">
            <img 
              src="/sideload_logo.jpg" 
              alt="SideLoad Logo" 
              className="w-full h-full object-cover"
            />
          </div>
        </button>

        {/* Kolom Pencarian Bersih */}
        <div className="flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-[#495464] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari game atau aplikasi indie..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full bg-[#E8E8E8] text-[#222629] placeholder-[#495464]/70 pl-9 pr-3.5 py-1.5 text-xs sm:text-sm rounded-lg border border-[#BBBFCA]/40 focus:border-[#495464] focus:bg-white outline-none transition"
          />
        </div>

        {/* Menu Navigasi Berdasarkan Role & Status Akun */}
        <nav className="flex items-center gap-3 sm:gap-5 text-xs sm:text-sm font-medium text-[#495464]">
          <button 
            onClick={() => onNavigate('home')}
            className={`transition hover:text-[#222629] ${
              currentPage === 'home' ? 'text-[#222629] font-bold underline underline-offset-4 decoration-[#495464]' : ''
            }`}
          >
            Jelajah
          </button>

          <button 
            onClick={() => onNavigate('library')}
            className={`transition hover:text-[#222629] ${
              currentPage === 'library' ? 'text-[#222629] font-bold underline underline-offset-4 decoration-[#495464]' : ''
            }`}
          >
            Pustaka
          </button>

          {/* Navigasi khusus Pengguna / Developer */}
          {currentUser.role === 'developer' && (
            <button 
              onClick={() => onNavigate('dev-dashboard')}
              className={`transition hover:text-[#222629] ${
                currentPage === 'dev-dashboard' || currentPage === 'submit-game' ? 'text-[#222629] font-bold underline underline-offset-4 decoration-[#495464]' : ''
              }`}
            >
              Dasbor
            </button>
          )}

          {currentUser.devStatus === 'pending' && (
            <button 
              onClick={() => onNavigate('dev-waiting')}
              className={`transition flex items-center gap-1.5 text-amber-800 font-semibold ${
                currentPage === 'dev-waiting' ? 'underline underline-offset-4' : ''
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>Menunggu Approval</span>
            </button>
          )}

          {currentUser.role === 'admin' && (
            <button 
              onClick={() => onNavigate('admin')}
              className={`transition hover:text-[#222629] ${
                currentPage === 'admin' ? 'text-[#222629] font-bold underline underline-offset-4 decoration-[#495464]' : ''
              }`}
            >
              Admin
            </button>
          )}

          <span className="text-[#BBBFCA] hidden sm:inline">|</span>

          {/* Autentikasi: Tamu vs Akun Terdaftar */}
          {currentUser.role === 'guest' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-1.5 bg-[#495464] text-[#F4F4F2] text-xs font-semibold rounded-lg hover:bg-[#3d4654] transition shadow-xs"
              >
                Masuk
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div 
                onClick={() => {
                  if (currentUser.role === 'developer') {
                    onNavigate('dev-dashboard')
                  } else if (currentUser.devStatus === 'pending') {
                    onNavigate('dev-waiting')
                  } else {
                    onNavigate('join-dev')
                  }
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-[#E8E8E8] hover:bg-white border border-[#BBBFCA]/50 rounded-lg cursor-pointer transition text-xs"
                title="Kelola Profil Anda"
              >
                <div className="w-5 h-5 rounded bg-[#495464] text-[#F4F4F2] font-pixel text-[9px] flex items-center justify-center font-bold">
                  {currentUser.role === 'admin' ? 'AK' : currentUser.role === 'developer' ? 'NH' : 'BD'}
                </div>
                <span className="text-[#222629] font-semibold hidden md:inline truncate max-w-[120px]">
                  {currentUser.username}
                </span>
              </div>

              <button
                onClick={onLogout}
                className="p-1.5 text-[#495464] hover:text-[#B42318] hover:bg-white rounded-lg transition"
                title="Keluar Akun"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
