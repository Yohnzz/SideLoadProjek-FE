import React, { useState } from 'react';
import {
  Package,
  PlusCircle,
  TrendingUp,
  CreditCard,
  FileCheck,
  Users,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Store,
  LogOut,
} from 'lucide-react';
import { Avatar, Badge } from '../ui';
import type { UserProfile } from '../../types/game';

export interface SidebarNavOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeVariant?: 'primary' | 'warning' | 'success' | 'danger' | 'neutral';
}

export interface DashboardLayoutProps {
  role: 'developer' | 'admin';
  currentUser: UserProfile;
  activeNavId: string;
  onNavSelect: (id: string) => void;
  onBackToStore: () => void;
  onLogout: () => void;
  children: React.ReactNode;
  customNavItems?: SidebarNavOption[];
  headerAction?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  role,
  currentUser,
  activeNavId,
  onNavSelect,
  onBackToStore,
  onLogout,
  children,
  customNavItems,
  headerAction,
}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState<boolean>(false);

  const defaultDeveloperItems: SidebarNavOption[] = [
    { id: 'katalog', label: 'Katalog Produk', icon: <Package className="w-4 h-4" /> },
    { id: 'upload', label: 'Unggah Karya Baru', icon: <PlusCircle className="w-4 h-4" /> },
    { id: 'transaksi', label: 'Penjualan & Royalti', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'rekening', label: 'Rekening Bank', icon: <CreditCard className="w-4 h-4" /> },
  ];

  const defaultAdminItems: SidebarNavOption[] = [
    { id: 'review-produk', label: 'Review Produk', icon: <FileCheck className="w-4 h-4" />, badge: 3, badgeVariant: 'warning' },
    { id: 'pengajuan-dev', label: 'Pengajuan Developer', icon: <Users className="w-4 h-4" />, badge: 2, badgeVariant: 'warning' },
    { id: 'pencairan-dana', label: 'Antrean Pencairan', icon: <Wallet className="w-4 h-4" />, badge: 1, badgeVariant: 'neutral' },
  ];

  const navItems = customNavItems || (role === 'admin' ? defaultAdminItems : defaultDeveloperItems);

  const handleSelect = (id: string) => {
    onNavSelect(id);
    setMobileDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex">
      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-[#171923]/40 z-50 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-[#E5E7EB] flex flex-col justify-between transition-all duration-200 ease-in-out lg:static ${
          collapsed ? 'lg:w-20' : 'lg:w-64'
        } ${
          mobileDrawerOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Logo & Toggle Button */}
        <div>
          <div className="h-16 border-b border-[#E5E7EB] px-4 flex items-center justify-between">
            <div
              onClick={onBackToStore}
              className="flex items-center gap-2.5 cursor-pointer group select-none overflow-hidden"
              title="Kembali ke Etalase Toko"
            >
              <img
                src="/sideload_new_logo.png"
                alt="SideLoad Logo"
                className="w-7 h-7 object-contain shrink-0 transition-transform group-hover:scale-105"
              />
              {(!collapsed || mobileDrawerOpen) && (
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-sm tracking-tight text-[#171923] truncate">
                    SideLoad
                  </span>
                  <span className="text-[10px] text-[#737887] leading-none">
                    {role === 'admin' ? 'Panel Kurasi Admin' : 'Portal Developer'}
                  </span>
                </div>
              )}
            </div>

            {/* Tombol ciutkan (Desktop only) */}
            <button
              onClick={() => setCollapsed((prev) => !prev)}
              aria-label={collapsed ? 'Perluas sidebar' : 'Ciutkan sidebar'}
              className="hidden lg:flex w-7 h-7 rounded-[6px] items-center justify-center text-[#737887] hover:text-[#171923] hover:bg-[#F0F1F5] transition"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Tombol close (Mobile only) */}
            <button
              onClick={() => setMobileDrawerOpen(false)}
              aria-label="Tutup menu"
              className="lg:hidden p-1.5 rounded-[6px] text-[#737887] hover:bg-[#F0F1F5]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User / Studio Badge Banner */}
          <div className="p-3 border-b border-[#E5E7EB] bg-[#F7F8FA]/60">
            <div className="flex items-center gap-2.5">
              <Avatar
                name={currentUser.studioName || currentUser.fullName || currentUser.username}
                size="sm"
                status="online"
              />
              {(!collapsed || mobileDrawerOpen) && (
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-[#171923] truncate">
                    {currentUser.studioName || currentUser.username}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {role === 'admin' ? (
                      <Badge variant="danger" size="sm">Admin</Badge>
                    ) : (
                      <Badge variant="success" size="sm" dot>Terverifikasi</Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = activeNavId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#2373FB] text-white shadow-xs'
                      : 'text-[#737887] hover:text-[#171923] hover:bg-[#F0F1F5]'
                  } ${collapsed && !mobileDrawerOpen ? 'justify-center px-0' : ''}`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {(!collapsed || mobileDrawerOpen) && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}
                  {(!collapsed || mobileDrawerOpen) && item.badge !== undefined && (
                    <Badge
                      variant={isActive ? 'outline' : item.badgeVariant || 'neutral'}
                      size="sm"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Back to Store & Logout */}
        <div className="p-3 border-t border-[#E5E7EB] space-y-1">
          <button
            onClick={onBackToStore}
            title={collapsed ? 'Kembali ke Etalase' : undefined}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-xs font-medium text-[#737887] hover:text-[#171923] hover:bg-[#F0F1F5] transition ${
              collapsed && !mobileDrawerOpen ? 'justify-center px-0' : ''
            }`}
          >
            <Store className="w-4 h-4 shrink-0 text-[#2373FB]" />
            {(!collapsed || mobileDrawerOpen) && <span className="truncate">Kembali ke Etalase</span>}
          </button>

          <button
            onClick={onLogout}
            title={collapsed ? 'Keluar Akun' : undefined}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-xs font-medium text-[#DC2626] hover:bg-[#FEE2E2]/40 transition ${
              collapsed && !mobileDrawerOpen ? 'justify-center px-0' : ''
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {(!collapsed || mobileDrawerOpen) && <span className="truncate">Keluar Akun</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Hamburger button for mobile */}
            <button
              onClick={() => setMobileDrawerOpen(true)}
              aria-label="Buka navigasi sidebar"
              className="lg:hidden p-2 rounded-[8px] text-[#737887] hover:text-[#171923] hover:bg-[#F0F1F5]"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-bold text-[#171923] tracking-tight">
                  {role === 'admin' ? 'Panel Kurasi & Moderasi SideLoad' : 'Dasbor Pengembang Studio'}
                </h1>
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] text-[10px] font-semibold border border-[#BBF7D0]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" />
                  <span>Sistem Normal</span>
                </div>
              </div>
              <p className="text-[11px] text-[#737887] hidden sm:block">
                {role === 'admin'
                  ? 'Verifikasi integritas berkas, moderasi game, dan konfirmasi permohonan developer'
                  : 'Kelola portofolio game, monitor statistik transaksi, dan ajukan pencairan royalti'}
              </p>
            </div>
          </div>

          {/* Right Header Action Slot */}
          <div className="flex items-center gap-3">
            {headerAction}
            <div className="hidden sm:block">
              <Avatar
                name={currentUser.studioName || currentUser.fullName || currentUser.username}
                size="sm"
                status="online"
              />
            </div>
          </div>
        </header>

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
