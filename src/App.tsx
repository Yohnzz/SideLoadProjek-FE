import { useState, useEffect } from 'react'
import { Header, type NavPage } from './components/Header'
import { Footer } from './components/Footer'
import { HomePage } from './pages/HomePage'
import { GameDetailPage } from './pages/GameDetailPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { LibraryPage } from './pages/LibraryPage'
import { JoinDeveloperPage } from './pages/JoinDeveloperPage'
import { SubmitGamePage } from './pages/SubmitGamePage'
import { DeveloperDashboardPage } from './pages/DeveloperDashboardPage'
import { DeveloperWaitingApprovalPage } from './pages/DeveloperWaitingApprovalPage'
import { AdminCuratorPage } from './pages/AdminCuratorPage'
import { AuthPage } from './pages/AuthPage'
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
            if (profile) {
              setCurrentUser(profile)
              const userLibrary = await gameService.getUserLibrary(profile.id)
              setOwnedGames(userLibrary)
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
            setCurrentPage('home')
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

  return (
    <div className="min-h-screen bg-[#F4F4F2] text-[#222629] font-sans flex flex-col selection:bg-[#BBBFCA] selection:text-[#222629]">
      
      {/* Toast Notifikasi Global */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#222629] text-[#F4F4F2] px-4 py-3 rounded-lg text-xs font-semibold shadow-lg flex items-center gap-2.5 border border-[#BBBFCA]/40 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
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

      {/* Header Bersih dengan Logo SAJA di Kiri Atas */}
      <Header
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
        onOpenAuth={(mode = 'login') => {
          setAuthMode(mode)
          setCurrentPage('auth')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
        onLogout={handleLogout}
      />

      {/* Konten Halaman Utama */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        
        {/* 1. Beranda / Landing Page */}
        {currentPage === 'home' && (
          <HomePage
            games={games}
            onSelectGame={handleSelectGame}
            searchQuery={searchQuery}
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

        {/* 2. Detail Produk */}
        {currentPage === 'detail' && (
          <GameDetailPage
            game={selectedGame}
            onBack={() => {
              setCurrentPage('home')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onCheckout={handleProceedToCheckout}
          />
        )}

        {/* 3. Checkout */}
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

        {/* 4. Pustaka Saya */}
        {currentPage === 'library' && (
          <LibraryPage
            ownedGames={ownedGames}
            onSelectGame={handleSelectGame}
            onExplore={() => {
              setCurrentPage('home')
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

        {/* 7. Formulir Pengajuan Game & Aplikasi */}
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

        {/* 8. Dasbor Developer Lengkap */}
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

        {/* 9. Panel Kurasi & Admin Lengkap */}
        {currentPage === 'admin' && (
          <AdminCuratorPage
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
      </main>

      {/* Footer */}
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
    </div>
  )
}
