import { useState, useEffect } from 'react'
import { Navbar, Footer, DashboardLayout } from './components/layout'
import type { NavPage } from './components/Header'
import { HomePage } from './pages/HomePage'
import { ExplorePage } from './pages/ExplorePage'
import { GameDetailPage } from './pages/GameDetailPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { LibraryPage } from './pages/LibraryPage'
import { JoinDeveloperPage } from './pages/JoinDeveloperPage'
import { SubmitGamePage } from './pages/SubmitGamePage'
import { DeveloperDashboardPage } from './pages/DeveloperDashboardPage'
import { DeveloperWaitingApprovalPage } from './pages/DeveloperWaitingApprovalPage'
import { AdminCuratorPage } from './pages/AdminCuratorPage'
import { AuthPage } from './pages/AuthPage'
import { DesignSystemShowcase } from './pages/DesignSystemShowcase'
import { GuestAuthModal } from './components/GuestAuthModal'
import { DUMMY_GAMES } from './data/dummyGames'
import type { Game, UserProfile, BankAccount } from './types/game'
import { authService } from './services/authService'
import { gameService } from './services/gameService'
import { developerService } from './services/developerService'
import { CheckCircle2 } from 'lucide-react'

const GUEST_USER: UserProfile = {
  id: 'guest',
  email: '',
  username: 'Tamu',
  role: 'guest',
  devStatus: 'none',
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('home')
  const [currentUser, setCurrentUser] = useState<UserProfile>(GUEST_USER)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false)
  const [guestModalAction, setGuestModalAction] = useState('mengunduh atau membeli karya ini')

  const [games, setGames] = useState<Game[]>(DUMMY_GAMES)
  const [selectedGame, setSelectedGame] = useState<Game>(DUMMY_GAMES[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [adminTab, setAdminTab] = useState<'products' | 'devs' | 'payouts'>('products')
  
  // Koleksi game yang dimiliki user
  const [ownedGames, setOwnedGames] = useState<Game[]>([])

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  // Ambil sesi autentikasi dan data game riil dari Supabase saat aplikasi dibuka
  useEffect(() => {
    let isMounted = true

    const initAppData = async () => {
      // 1. Ambil profil user saat ini
      const profile = await authService.getCurrentUserProfile()
      if (isMounted && profile) {
        setCurrentUser(profile)
        // Ambil pustaka game user dari Supabase
        const userLibrary = await gameService.getUserLibrary(profile.id)
        if (isMounted && userLibrary.length > 0) {
          setOwnedGames(userLibrary)
        }
        // Arahkan otomatis ke dasbor sesuai role saat halaman dimuat ulang
        if (isMounted) {
          if (profile.role === 'admin') {
            setCurrentPage('admin')
          } else if (profile.role === 'developer') {
            setCurrentPage('dev-dashboard')
          }
        }
      }

      // 2. Ambil katalog game yang dipublikasikan dari database
      const published = await gameService.getPublishedGames()
      if (isMounted && published.length > 0) {
        setGames(published)
        setSelectedGame(published[0])
      }
    }

    initAppData()

    // 3. Pasang pendengar perubahan autentikasi Supabase
    const { data: authListener } = authService.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await authService.getCurrentUserProfile()
        if (isMounted && profile) {
          setCurrentUser(profile)
          const userLibrary = await gameService.getUserLibrary(profile.id)
          if (isMounted) setOwnedGames(userLibrary)
        }
      } else {
        if (isMounted) {
          setCurrentUser(GUEST_USER)
          setOwnedGames([])
        }
      }
    })

    return () => {
      isMounted = false
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  // Guard untuk aksi Guest
  const requireUserAuth = (actionDescription: string, onSuccess: () => void) => {
    if (currentUser.role === 'guest') {
      setGuestModalAction(actionDescription)
      setIsGuestModalOpen(true)
      return
    }
    onSuccess()
  }

  // Handler navigasi ke Detail Produk
  const handleSelectGame = (game: Game) => {
    setSelectedGame(game)
    setCurrentPage('detail')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handler lanjut ke Checkout
  const handleProceedToCheckout = (game: Game) => {
    requireUserAuth('membeli game ini', () => {
      setSelectedGame(game)
      setCurrentPage('checkout')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  // Handler sukses pembayaran
  const handleCheckoutSuccess = async (game: Game) => {
    if (currentUser.role !== 'guest' && currentUser.id) {
      if (game.price === 0) {
        await gameService.claimFreeGame(currentUser.id, game.id)
      } else {
        await gameService.recordOrder({
          userId: currentUser.id,
          gameId: game.id,
          developerId: game.developer_id,
          amount: game.price,
          paymentMethod: 'qris',
        })
      }
      const updatedLibrary = await gameService.getUserLibrary(currentUser.id)
      if (updatedLibrary.length > 0) {
        setOwnedGames(updatedLibrary)
      } else if (!ownedGames.some(g => g.id === game.id)) {
        setOwnedGames(prev => [game, ...prev])
      }
    } else {
      if (!ownedGames.some(g => g.id === game.id)) {
        setOwnedGames(prev => [game, ...prev])
      }
    }

    showToast(`Transaksi berhasil! "${game.title}" telah ditambahkan ke Pustaka Anda.`)
    setCurrentPage('library')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handler simpan rekening bank developer
  const handleSaveBankAccount = async (bank: BankAccount) => {
    if (currentUser.id && currentUser.id !== 'guest') {
      await developerService.saveBankAccount(currentUser.id, bank)
    }
    setCurrentUser(prev => ({
      ...prev,
      bankAccount: bank,
    }))
    showToast(`Rekening ${bank.bankName} berhasil disimpan dan terverifikasi.`)
  }

  // Handler keluar akun
  const handleLogout = async () => {
    await authService.signOut()
    setCurrentUser(GUEST_USER)
    setOwnedGames([])
    showToast('Anda telah keluar dari akun.')
    setCurrentPage('home')
  }

  // Jika sedang di halaman Auth (Login / Register)
  if (currentPage === 'auth') {
    return (
      <>
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-[#222629] text-[#F4F4F2] px-4 py-3 rounded-lg text-xs font-semibold shadow-lg flex items-center gap-2.5 border border-[#BBBFCA]/40 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
        <AuthPage
          initialMode={authMode}
          onBackToStore={() => {
            setCurrentPage('home')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          onAuthSuccess={async (role, username, email) => {
            const profile = await authService.getCurrentUserProfile()
            let activeRole = role
            if (profile) {
              setCurrentUser(profile)
              const userLibrary = await gameService.getUserLibrary(profile.id)
              setOwnedGames(userLibrary)
              activeRole = profile.role
            } else {
              setCurrentUser({
                id: 'usr-' + Date.now(),
                email,
                username,
                role,
                devStatus: 'none',
              })
            }
            showToast(`Selamat datang kembali, ${username}!`)
            // Arahkan ke dasbor sesuai role
            if (activeRole === 'admin') {
              setCurrentPage('admin')
            } else if (activeRole === 'developer') {
              setCurrentPage('dev-dashboard')
            } else {
              setCurrentPage('home')
            }
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          onOpenJoinDeveloper={() => {
            setCurrentPage('join-dev')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      </>
    )
  }

  const isDashboardView = currentPage === 'dev-dashboard' || currentPage === 'submit-game' || currentPage === 'admin'

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-[#171923] font-sans flex flex-col antialiased">
      
      {/* Toast Notifikasi Global */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-white border border-[#BBF7D0] shadow-lg p-3.5 rounded-[12px] flex items-center gap-2.5 text-xs font-semibold text-[#15803D] animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal Autentikasi Pengunjung / Guest Guard */}
      <GuestAuthModal
        isOpen={isGuestModalOpen}
        onClose={() => setIsGuestModalOpen(false)}
        actionLabel={guestModalAction}
        onOpenLogin={() => {
          setAuthMode('login')
          setCurrentPage('auth')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        onOpenRegister={() => {
          setAuthMode('register')
          setCurrentPage('auth')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />

      {isDashboardView ? (
        <DashboardLayout
          role={currentPage === 'admin' ? 'admin' : 'developer'}
          currentUser={currentUser}
          activeNavId={
            currentPage === 'submit-game'
              ? 'upload'
              : currentPage === 'admin'
              ? adminTab === 'products'
                ? 'review-produk'
                : adminTab === 'devs'
                ? 'pengajuan-dev'
                : 'pencairan-dana'
              : 'katalog'
          }
          onNavSelect={(navId) => {
            if (navId === 'upload') {
              setCurrentPage('submit-game')
            } else if (navId === 'katalog' || navId === 'transaksi' || navId === 'rekening') {
              setCurrentPage('dev-dashboard')
            } else if (navId === 'review-produk') {
              setAdminTab('products')
              setCurrentPage('admin')
            } else if (navId === 'pengajuan-dev') {
              setAdminTab('devs')
              setCurrentPage('admin')
            } else if (navId === 'pencairan-dana') {
              setAdminTab('payouts')
              setCurrentPage('admin')
            }
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          onBackToStore={() => {
            setCurrentPage('home')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          onLogout={handleLogout}
        >
          {/* Formulir Pengajuan Game & Aplikasi */}
          {currentPage === 'submit-game' && (
            <SubmitGamePage
              currentUser={currentUser}
              onBack={() => {
                setCurrentPage('dev-dashboard')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              onSubmitSuccess={() => {
                showToast('Karya berhasil diajukan untuk review! Status berubah menjadi Menunggu Review.')
                setCurrentPage('dev-dashboard')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          )}

          {/* Dasbor Developer Lengkap */}
          {currentPage === 'dev-dashboard' && (
            <DeveloperDashboardPage
              currentUser={currentUser}
              onUploadNew={() => {
                setCurrentPage('submit-game')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              onOpenStorePage={(slug) => {
                const found = games.find(g => g.slug === slug)
                handleSelectGame(found || games[0])
              }}
              bankAccount={currentUser.bankAccount}
              onSaveBankAccount={handleSaveBankAccount}
            />
          )}

          {/* Panel Kurasi & Admin Lengkap */}
          {currentPage === 'admin' && (
            <AdminCuratorPage
              activeTab={adminTab}
              onTabChange={setAdminTab}
              onBackToStore={() => {
                setCurrentPage('home')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              onApproveDeveloperAccount={(approvedStudio) => {
                if (currentUser.studioName === approvedStudio) {
                  setCurrentUser(prev => ({
                    ...prev,
                    role: 'developer',
                    devStatus: 'approved',
                  }))
                }
                showToast(`Akun studio ${approvedStudio} disetujui menjadi developer resmi.`)
              }}
            />
          )}
        </DashboardLayout>
      ) : (
        <>
          {/* Header & Navbar Global Lengket & Ringkas */}
          <Navbar
            currentPage={currentPage}
            onNavigate={(page) => {
              if (page === 'library' && currentUser.role === 'guest') {
                requireUserAuth('mengakses pustaka game', () => {})
                return
              }
              setCurrentPage(page)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            currentUser={currentUser}
            ownedCount={ownedGames.length}
            onOpenAuth={(mode = 'login') => {
              setAuthMode(mode)
              setCurrentPage('auth')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onLogout={handleLogout}
          />

          {/* Konten Halaman Utama Publik */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* 1. Beranda / Landing Page */}
        {currentPage === 'home' && (
          <HomePage
            games={games}
            onSelectGame={handleSelectGame}
            searchQuery={searchQuery}
            onNavigateToExplore={() => {
              setCurrentPage('explore')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onOpenJoinDeveloper={() => {
              if (currentUser.devStatus === 'pending') {
                setCurrentPage('dev-waiting')
              } else if (currentUser.role === 'developer') {
                setCurrentPage('dev-dashboard')
              } else {
                setCurrentPage('join-dev')
              }
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}

        {/* 2. Halaman Jelajah & Filter Lengkap */}
        {currentPage === 'explore' && (
          <ExplorePage
            games={games}
            onSelectGame={handleSelectGame}
            initialQuery={searchQuery}
          />
        )}

        {/* 3. Detail Produk */}
        {currentPage === 'detail' && (
          <GameDetailPage
            game={selectedGame}
            isOwned={ownedGames.some(g => g.id === selectedGame.id)}
            onBack={() => {
              setCurrentPage('explore')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onCheckout={handleProceedToCheckout}
          />
        )}

        {/* 4. Checkout */}
        {currentPage === 'checkout' && (
          <CheckoutPage
            game={selectedGame}
            onBack={() => {
              setCurrentPage('detail')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onSuccess={handleCheckoutSuccess}
          />
        )}

        {/* 5. Pustaka Saya */}
        {currentPage === 'library' && (
          <LibraryPage
            ownedGames={ownedGames}
            onSelectGame={handleSelectGame}
            onExploreMore={() => {
              setCurrentPage('explore')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}

        {/* 5. Gabung Jadi Developer */}
        {currentPage === 'join-dev' && (
          <JoinDeveloperPage
            currentUser={currentUser}
            onSubmitted={(studioName) => {
              setCurrentUser(prev => ({
                ...prev,
                devStatus: 'pending',
                studioName,
              }))
              showToast('Pengajuan akun developer berhasil dikirim! Menunggu approval tim admin.')
              setCurrentPage('dev-waiting')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onBack={() => {
              setCurrentPage('home')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}

        {/* 6. Halaman Status Menunggu Approval Admin */}
        {currentPage === 'dev-waiting' && (
          <DeveloperWaitingApprovalPage
            studioName={currentUser.studioName}
            onBackToStore={() => {
              setCurrentPage('home')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          />
        )}

        {/* 7. Showcase Desain Sistem (Fase 1) */}
        {currentPage === 'design-system' && (
          <DesignSystemShowcase />
        )}
      </main>

      {/* Footer Minimalis */}
      <Footer 
        onJoinDeveloper={() => {
          if (currentUser.devStatus === 'pending') {
            setCurrentPage('dev-waiting')
          } else if (currentUser.role === 'developer') {
            setCurrentPage('dev-dashboard')
          } else {
            setCurrentPage('join-dev')
          }
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />
    </>
  )}
</div>
  )
}
