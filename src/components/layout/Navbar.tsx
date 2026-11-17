import React, { useState } from 'react';
import { Search, X, Menu, Compass, Library, PlusCircle, LayoutDashboard, Shield, LogOut, User, Sparkles } from 'lucide-react';
import { Button, Avatar, Dropdown, Badge } from '../ui';
import type { NavPage } from '../Header';
import type { UserProfile } from '../../types/game';

interface NavbarProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  currentUser: UserProfile;
  ownedCount?: number;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  searchQuery,
  onSearchChange,
  currentUser,
  ownedCount = 0,
  onOpenAuth,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isGuest = currentUser.role === 'guest';
  const isDeveloper = currentUser.role === 'developer';
  const isAdmin = currentUser.role === 'admin';
  const isPendingDev = currentUser.devStatus === 'pending';

  const handleMobileNav = (page: NavPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Sisi Kiri: Logo & Navigasi Utama */}
        <div className="flex items-center gap-6 shrink-0">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 focus:outline-none group select-none"
            title="SideLoad Beranda"
          >
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src="/sideload_new_logo.png"
                alt="SideLoad"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-base tracking-tight text-[#171923] hidden sm:inline">
              SideLoad
            </span>
          </button>

          {/* Navigasi Desktop */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => onNavigate('explore')}
              className={`px-3 py-1.5 rounded-[8px] transition-colors flex items-center gap-1.5 ${
                currentPage === 'explore'
                  ? 'bg-[#EFF6FF] text-[#2373FB] font-semibold'
                  : 'text-[#737887] hover:text-[#171923] hover:bg-[#F0F1F5]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Jelajah</span>
            </button>

            <button
              onClick={() => onNavigate('library')}
              className={`px-3 py-1.5 rounded-[8px] transition-colors flex items-center gap-1.5 ${
                currentPage === 'library'
                  ? 'bg-[#EFF6FF] text-[#2373FB] font-semibold'
                  : 'text-[#737887] hover:text-[#171923] hover:bg-[#F0F1F5]'
              }`}
            >
              <Library className="w-4 h-4" />
              <span>Pustaka</span>
              {ownedCount > 0 && (
                <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full font-semibold bg-[#F0F1F5] text-[#737887]">
                  {ownedCount}
                </span>
              )}
            </button>

            {/* Quick link jika role developer */}
            {isDeveloper && (
              <button
                onClick={() => onNavigate('dev-dashboard')}
                className={`px-3 py-1.5 rounded-[8px] transition-colors flex items-center gap-1.5 ${
                  currentPage === 'dev-dashboard' || currentPage === 'submit-game'
                    ? 'bg-[#EFF6FF] text-[#2373FB] font-semibold'
                    : 'text-[#737887] hover:text-[#171923] hover:bg-[#F0F1F5]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dasbor</span>
              </button>
            )}

            {/* Quick link jika role admin */}
            {isAdmin && (
              <button
                onClick={() => onNavigate('admin')}
                className={`px-3 py-1.5 rounded-[8px] transition-colors flex items-center gap-1.5 ${
                  currentPage === 'admin'
                    ? 'bg-[#EFF6FF] text-[#2373FB] font-semibold'
                    : 'text-[#737887] hover:text-[#171923] hover:bg-[#F0F1F5]'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </button>
            )}
          </nav>
        </div>

        {/* Tengah: Kolom Pencarian Bersih & Minimalis */}
        <div className="flex-1 max-w-md mx-2 sm:mx-4">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-[#737887] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Cari game atau aplikasi indie..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-9 bg-[#F0F1F5] text-xs sm:text-sm text-[#171923] placeholder:text-[#737887] pl-9.5 pr-8 rounded-[10px] border border-transparent transition-all outline-none hover:border-[#D1D5DB] focus:bg-white focus:border-[#2373FB] focus:ring-2 focus:ring-[#2373FB]/20"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 text-[#737887] hover:text-[#171923] p-0.5 rounded transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Sisi Kanan: Autentikasi / Profil Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {isGuest ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenAuth('login')}
              >
                Masuk
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onOpenAuth('register')}
              >
                Daftar
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Tombol aksi cepat untuk Developer */}
              {isDeveloper && (
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden sm:inline-flex"
                  leftIcon={<PlusCircle className="w-3.5 h-3.5 text-[#2373FB]" />}
                  onClick={() => onNavigate('submit-game')}
                >
                  Unggah Karya
                </Button>
              )}

              {/* Status menunggu approval bagi calon developer */}
              {isPendingDev && (
                <button
                  onClick={() => onNavigate('dev-waiting')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] text-xs font-medium hover:bg-[#FDE68A]/70 transition"
                >
                  <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
                  <span>Menunggu Review</span>
                </button>
              )}

              {/* Dropdown Menu Pengguna */}
              <Dropdown
                align="right"
                trigger={
                  <div className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-[10px] bg-[#F0F1F5] hover:bg-[#E4E6EB] transition border border-transparent hover:border-[#D1D5DB] select-none">
                    <Avatar
                      name={currentUser.fullName || currentUser.username}
                      size="sm"
                      status="online"
                    />
                    <div className="text-left hidden md:block">
                      <div className="text-xs font-semibold leading-tight text-[#171923] max-w-[110px] truncate">
                        {currentUser.username}
                      </div>
                      <div className="text-[10px] text-[#737887] leading-tight">
                        {isAdmin ? 'Admin' : isDeveloper ? 'Developer' : 'Pengguna'}
                      </div>
                    </div>
                  </div>
                }
                items={[
                  {
                    label: currentUser.fullName || currentUser.username,
                    icon: <User className="w-3.5 h-3.5" />,
                    badge: (
                      <Badge
                        variant={isAdmin ? 'danger' : isDeveloper ? 'primary' : 'neutral'}
                        size="sm"
                      >
                        {isAdmin ? 'Admin' : isDeveloper ? 'Developer' : 'User'}
                      </Badge>
                    ),
                    onClick: () => onNavigate('home'),
                  },
                  'divider',
                  {
                    label: 'Pustaka Game Saya',
                    icon: <Library className="w-3.5 h-3.5" />,
                    badge: ownedCount > 0 ? <Badge variant="neutral">{ownedCount}</Badge> : undefined,
                    onClick: () => onNavigate('library'),
                  },
                  ...(isDeveloper
                    ? [
                        {
                          label: 'Dasbor Developer',
                          icon: <LayoutDashboard className="w-3.5 h-3.5" />,
                          onClick: () => onNavigate('dev-dashboard'),
                        },
                        {
                          label: 'Unggah Produk Baru',
                          icon: <PlusCircle className="w-3.5 h-3.5" />,
                          onClick: () => onNavigate('submit-game'),
                        },
                      ]
                    : isPendingDev
                    ? [
                        {
                          label: 'Status Pengajuan Developer',
                          icon: <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />,
                          badge: <Badge variant="warning" size="sm">Review</Badge>,
                          onClick: () => onNavigate('dev-waiting'),
                        },
                      ]
                    : [
                        {
                          label: 'Daftar Jadi Developer',
                          icon: <Sparkles className="w-3.5 h-3.5 text-[#6A3DFB]" />,
                          onClick: () => onNavigate('join-dev'),
                        },
                      ]),
                  ...(isAdmin
                    ? [
                        {
                          label: 'Panel Kurasi & Admin',
                          icon: <Shield className="w-3.5 h-3.5 text-[#DC2626]" />,
                          badge: <Badge variant="danger" size="sm">Admin</Badge>,
                          onClick: () => onNavigate('admin'),
                        },
                      ]
                    : []),
                  'divider',
                  {
                    label: 'Keluar Akun',
                    icon: <LogOut className="w-3.5 h-3.5" />,
                    danger: true,
                    onClick: onLogout,
                  },
                ]}
              />
            </div>
          )}

          {/* Tombol Hamburger Menu Mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Buka Menu Navigasi"
            className="md:hidden p-2 rounded-[8px] text-[#737887] hover:text-[#171923] hover:bg-[#F0F1F5] transition"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] bg-white px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => handleMobileNav('home')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-xs font-semibold ${
                currentPage === 'home' ? 'bg-[#EFF6FF] text-[#2373FB]' : 'text-[#171923] hover:bg-[#F0F1F5]'
              }`}
            >
              <span>Beranda</span>
            </button>

            <button
              onClick={() => handleMobileNav('explore')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-xs font-semibold ${
                currentPage === 'explore' ? 'bg-[#EFF6FF] text-[#2373FB]' : 'text-[#171923] hover:bg-[#F0F1F5]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Jelajah Katalog</span>
            </button>

            <button
              onClick={() => handleMobileNav('library')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[8px] text-xs font-semibold ${
                currentPage === 'library' ? 'bg-[#EFF6FF] text-[#2373FB]' : 'text-[#171923] hover:bg-[#F0F1F5]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Library className="w-4 h-4" />
                <span>Pustaka Game</span>
              </div>
              {ownedCount > 0 && <Badge variant="neutral" size="sm">{ownedCount}</Badge>}
            </button>

            {isDeveloper && (
              <>
                <button
                  onClick={() => handleMobileNav('dev-dashboard')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-xs font-semibold ${
                    currentPage === 'dev-dashboard' ? 'bg-[#EFF6FF] text-[#2373FB]' : 'text-[#171923] hover:bg-[#F0F1F5]'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dasbor Developer</span>
                </button>
                <button
                  onClick={() => handleMobileNav('submit-game')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-xs font-semibold ${
                    currentPage === 'submit-game' ? 'bg-[#EFF6FF] text-[#2373FB]' : 'text-[#171923] hover:bg-[#F0F1F5]'
                  }`}
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Unggah Produk Baru</span>
                </button>
              </>
            )}

            {isPendingDev && (
              <button
                onClick={() => handleMobileNav('dev-waiting')}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-[8px] text-xs font-semibold text-[#B45309] bg-[#FEF3C7]"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
                  <span>Status Pengajuan Developer</span>
                </div>
                <Badge variant="warning" size="sm">Menunggu</Badge>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => handleMobileNav('admin')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[8px] text-xs font-semibold ${
                  currentPage === 'admin' ? 'bg-[#EFF6FF] text-[#2373FB]' : 'text-[#171923] hover:bg-[#F0F1F5]'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Panel Kurasi & Admin</span>
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-[#E5E7EB]">
            {isGuest ? (
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                >
                  Masuk
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('register');
                  }}
                >
                  Daftar
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-[#DC2626] justify-start"
                leftIcon={<LogOut className="w-4 h-4" />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLogout();
                }}
              >
                Keluar Akun ({currentUser.username})
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

