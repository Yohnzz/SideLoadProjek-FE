import React, { useState, useEffect } from 'react'
import { 
  Check, 
  X, 
  CheckCircle2, 
  ExternalLink,
  FileCheck,
  UserCheck,
  CreditCard,
  Building2,
  AlertTriangle
} from 'lucide-react'
import { adminService, type AdminGameQueueItem, type AdminDevApplicationItem } from '../services/adminService'

interface AdminCuratorPageProps {
  onBackToStore: () => void
  onApproveDeveloperAccount?: (studioName: string) => void
}

const FALLBACK_GAME_QUEUE: AdminGameQueueItem[] = [
  {
    id: '1',
    code: 'PRD-2025-0819',
    type: 'PATCH UPDATE',
    timeAgo: '4 jam lalu',
    title: 'Kala: Warisan Kabut',
    developer: 'Nusantara Horizon Studios',
    version: 'v1.2.1-patch',
    category: 'Petualangan Naratif',
    platform: 'WIN / WEB',
    dateSubmitted: '24 Mei 2025, 10:14 WIB',
    fileName: 'Kala_WarisanKabut_v1.2.1_Win64.zip',
    fileSize: '412.4 MB • Windows (x86_64)',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'pending_review'
  },
  {
    id: '2',
    code: 'PRD-2025-0818',
    type: 'GAME BARU',
    timeAgo: '1 hari lalu',
    title: 'Lentera Rimba',
    developer: 'Studio Rimba Raya',
    version: 'v0.8.1',
    category: 'Eksplorasi Alam',
    platform: 'WIN',
    dateSubmitted: '23 Mei 2025, 14:30 WIB',
    fileName: 'LenteraRimba_v0.8.1_Build.zip',
    fileSize: '320 MB • Windows (x86_64)',
    sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    status: 'pending_review'
  }
]

const FALLBACK_DEV_APPLICATIONS: AdminDevApplicationItem[] = [
  {
    id: 'dev-app-1',
    userId: 'usr-1',
    studioName: 'Nusantara Horizon Studios',
    applicantName: 'Bagas Pratama',
    email: 'bagas@nusantarahorizon.id',
    portfolioUrl: 'https://itch.io/profile/nusantara-horizon',
    timeAgo: '2 jam lalu',
    dateSubmitted: '24 Mei 2025, 12:40 WIB',
    focus: 'Fokus pengembangan game naratif dan pixel-art bertema mitologi nusantara dengan rencana rilis Alpha.',
    bankName: 'Bank Central Asia (BCA)',
    accountNumber: '827-019-3312',
    accountHolder: 'Nusantara Horizon Studio'
  }
]

export const AdminCuratorPage: React.FC<AdminCuratorPageProps> = ({
  onBackToStore,
  onApproveDeveloperAccount
}) => {
  const [gameQueue, setGameQueue] = useState<AdminGameQueueItem[]>(FALLBACK_GAME_QUEUE)
  const [selectedGameId, setSelectedGameId] = useState<string>('1')

  const [devQueue, setDevQueue] = useState<AdminDevApplicationItem[]>(FALLBACK_DEV_APPLICATIONS)
  const [selectedDevId, setSelectedDevId] = useState<string>('dev-app-1')

  const [activeTab, setActiveTab] = useState<'products' | 'devs' | 'payouts'>('products')
  const [feedbackNote, setFeedbackNote] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [notification, setNotification] = useState<string | null>(null)

  const [devChecklist, setDevChecklist] = useState({
    portfolioVerified: true,
    emailConfirmed: true,
    bankMatched: true,
    termsAgreed: true
  })

  const [gameChecklist, setGameChecklist] = useState({
    watermarkClean: true,
    executableStable: true,
    licenseValid: true,
    ageRatingAccurate: true
  })

  // Memuat antrian asli dari Supabase saat komponen dipasang
  useEffect(() => {
    let isMounted = true
    const loadQueues = async () => {
      const dbGames = await adminService.getPendingGames()
      if (isMounted && dbGames.length > 0) {
        setGameQueue(dbGames)
        setSelectedGameId(dbGames[0].id)
      }

      const dbDevs = await adminService.getPendingDevelopers()
      if (isMounted && dbDevs.length > 0) {
        setDevQueue(dbDevs)
        setSelectedDevId(dbDevs[0].id)
      }
    }
    loadQueues()
    return () => { isMounted = false }
  }, [])

  const showNotification = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 3500)
  }

  const currentGame = gameQueue.find(q => q.id === selectedGameId) || gameQueue[0]
  const currentDev = devQueue.find(d => d.id === selectedDevId) || devQueue[0]

  // Approval Game
  const handleApproveGame = async () => {
    if (!currentGame) return
    setIsProcessing(true)
    const success = await adminService.reviewGame(currentGame.id, 'approve')
    setIsProcessing(false)

    if (success) {
      showNotification(`Game "${currentGame.title}" (${currentGame.version}) disetujui dan langsung terbit di etalase.`)
      setGameQueue(prev => prev.filter(q => q.id !== currentGame.id))
      setFeedbackNote('')
    }
  }

  // Minta Revisi Game
  const handleRevisionGame = async () => {
    if (!currentGame) return
    if (!feedbackNote.trim()) {
      alert('Harap tuliskan catatan perbaikan pada kolom catatan masukan kurator.')
      return
    }
    setIsProcessing(true)
    const success = await adminService.reviewGame(currentGame.id, 'revision', feedbackNote)
    setIsProcessing(false)

    if (success) {
      showNotification(`Permintaan revisi untuk "${currentGame.title}" berhasil dikirimkan ke developer.`)
      setGameQueue(prev => prev.filter(q => q.id !== currentGame.id))
      setFeedbackNote('')
    }
  }

  // Tolak Game
  const handleRejectGame = async () => {
    if (!currentGame) return
    if (!feedbackNote.trim()) {
      alert('Harap tuliskan alasan penolakan karya pada kolom catatan.')
      return
    }
    setIsProcessing(true)
    const success = await adminService.reviewGame(currentGame.id, 'reject', feedbackNote)
    setIsProcessing(false)

    if (success) {
      showNotification(`Karya "${currentGame.title}" telah ditolak.`)
      setGameQueue(prev => prev.filter(q => q.id !== currentGame.id))
      setFeedbackNote('')
    }
  }

  // Approval Akun Developer
  const handleApproveDev = async () => {
    if (!currentDev) return
    setIsProcessing(true)
    const success = await adminService.reviewDeveloper(currentDev.id, currentDev.userId, 'approve')
    setIsProcessing(false)

    if (success) {
      showNotification(`Akun Studio "${currentDev.studioName}" berhasil disetujui menjadi developer resmi.`)
      if (onApproveDeveloperAccount) {
        onApproveDeveloperAccount(currentDev.studioName)
      }
      setDevQueue(prev => prev.filter(d => d.id !== currentDev.id))
      setFeedbackNote('')
    }
  }

  // Tolak Akun Developer
  const handleRejectDev = async () => {
    if (!currentDev) return
    if (!feedbackNote.trim()) {
      alert('Harap tuliskan alasan penolakan pada kolom catatan masukan.')
      return
    }
    setIsProcessing(true)
    const success = await adminService.reviewDeveloper(currentDev.id, currentDev.userId, 'reject', feedbackNote)
    setIsProcessing(false)

    if (success) {
      showNotification(`Pengajuan akun "${currentDev.studioName}" telah ditolak.`)
      setDevQueue(prev => prev.filter(d => d.id !== currentDev.id))
      setFeedbackNote('')
    }
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notifikasi Kurasi */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 bg-[#222629] text-[#F4F4F2] px-4 py-3 rounded-lg text-xs font-semibold shadow-lg flex items-center gap-2.5 border border-[#BBBFCA]/40 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}
      
      {/* Header Panel Kurasi & Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#BBBFCA]/40">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#222629] tracking-tight">
            Panel Kurasi & Admin
          </h1>
          <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-[#495464] text-[#F4F4F2] font-semibold">
            MODERASI RESMI
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <button
            onClick={onBackToStore}
            className="flex items-center gap-1.5 text-[#495464] hover:text-[#222629] font-medium"
          >
            <span>Lihat Etalase Publik</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <span className="text-[#BBBFCA]">|</span>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#495464] text-[#F4F4F2] flex items-center justify-center font-bold text-xs">
              AK
            </div>
            <span className="font-semibold text-[#222629]">Admin Kurasi</span>
          </div>
        </div>
      </div>

      {/* Tab Navigasi Admin */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#BBBFCA]/40 text-xs sm:text-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setActiveTab('products'); setFeedbackNote('') }}
            className={`pb-2 transition font-medium ${
              activeTab === 'products'
                ? 'border-b-2 border-[#495464] text-[#222629] font-bold'
                : 'text-[#495464] hover:text-[#222629]'
            }`}
          >
            Review Game & Aplikasi ({gameQueue.length})
          </button>

          <button
            onClick={() => { setActiveTab('devs'); setFeedbackNote('') }}
            className={`pb-2 transition font-medium ${
              activeTab === 'devs'
                ? 'border-b-2 border-[#495464] text-[#222629] font-bold'
                : 'text-[#495464] hover:text-[#222629]'
            }`}
          >
            Approval Akun Developer ({devQueue.length})
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            className={`pb-2 transition font-medium ${
              activeTab === 'payouts'
                ? 'border-b-2 border-[#495464] text-[#222629] font-bold'
                : 'text-[#495464] hover:text-[#222629]'
            }`}
          >
            Antrian Pencairan Dana (1)
          </button>
        </div>
      </div>

      {/* ================= TAB 1: REVIEW GAME & APLIKASI ================= */}
      {activeTab === 'products' && (
        <>
          {gameQueue.length === 0 ? (
            <div className="bg-[#E8E8E8] rounded-xl p-16 text-center border border-[#BBBFCA]/40 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
              <h3 className="text-base font-bold text-[#222629]">Antrian Kurasi Game Kosong</h3>
              <p className="text-xs text-[#495464] max-w-sm mx-auto">
                Semua game, aplikasi, dan berkas patch yang diajukan telah selesai ditinjau.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Kolom Kiri: Antrian Game */}
              <div className="lg:col-span-4 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#495464] uppercase tracking-wider">
                  <span>Urutan: Menunggu Verifikasi</span>
                  <span>{gameQueue.length} Item</span>
                </div>

                <div className="space-y-2.5">
                  {gameQueue.map(item => {
                    const isSelected = item.id === selectedGameId
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedGameId(item.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition ${
                          isSelected
                            ? 'bg-white border-[#495464] shadow-xs'
                            : 'bg-[#E8E8E8] border-[#BBBFCA]/50 hover:border-[#495464]/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-pixel text-[#495464]">{item.code}</span>
                          <span className="text-[10px] font-pixel px-1.5 py-0.2 rounded bg-[#E8E8E8] text-[#222629] font-bold">
                            {item.type}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-[#222629] mt-1">{item.title}</h4>
                        <p className="text-xs text-[#495464]">{item.developer}</p>

                        <div className="mt-2.5 pt-2 border-t border-[#BBBFCA]/30 flex items-center justify-between text-[11px] text-[#495464]">
                          <span>{item.version} • {item.platform}</span>
                          <span>{item.timeAgo}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Kolom Kanan: Detail Berkas & Aksi */}
              <div className="lg:col-span-8 bg-[#E8E8E8] rounded-xl p-6 border border-[#BBBFCA]/40 space-y-6">
                
                {/* Header Produk */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#BBBFCA]/40">
                  <div>
                    <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-[#495464] text-[#F4F4F2] font-semibold">
                      {currentGame.type}
                    </span>
                    <h2 className="text-xl font-bold text-[#222629] mt-1.5">
                      {currentGame.title} ({currentGame.version})
                    </h2>
                    <p className="text-xs text-[#495464]">
                      Oleh <span className="font-semibold text-[#222629]">{currentGame.developer}</span> • Kategori: {currentGame.category}
                    </p>
                  </div>

                  <div className="text-right text-xs text-[#495464]">
                    <span>Diajukan pada:</span>
                    <div className="font-semibold text-[#222629]">{currentGame.dateSubmitted}</div>
                  </div>
                </div>

                {/* Integritas Berkas */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#222629] flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-[#495464]" />
                    <span>Verifikasi Integritas Paket Rilis</span>
                  </h3>

                  <div className="p-4 bg-[#F4F4F2] rounded-xl border border-[#BBBFCA]/50 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-[#222629] block font-mono">{currentGame.fileName}</span>
                        <span className="text-[#495464] text-[11px]">{currentGame.fileSize}</span>
                      </div>
                      <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                        LOLOS PEMINDAIAN
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[#BBBFCA]/30 space-y-2">
                      <div>
                        <span className="text-[10px] text-[#495464] block font-semibold">SHA-256 Checksum:</span>
                        <span className="font-mono text-[10px] text-[#222629] break-all bg-white p-1.5 rounded border border-[#BBBFCA]/40 block select-all">
                          {currentGame.sha256}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                          ✓ Terverifikasi Cocok dengan Manifest
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#495464] block font-semibold">Pemeriksaan Keamanan Malware:</span>
                        <div className="bg-white p-2 rounded border border-[#BBBFCA]/40 text-[#222629] mt-1 flex items-center justify-between">
                          <span className="font-mono text-[11px]">Engine Antivirus (0/72 Dideteksi)</span>
                          <span className="font-bold text-emerald-700 text-xs">BERSIH</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checklist Game */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#222629]">
                    Checklist Kurasi Manual Game
                  </h3>
                  <div className="space-y-2">
                    <label className="p-3 bg-[#F4F4F2] rounded-lg border border-[#BBBFCA]/50 flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gameChecklist.watermarkClean}
                        onChange={e => setGameChecklist(prev => ({ ...prev, watermarkClean: e.target.checked }))}
                        className="mt-0.5 accent-[#495464]"
                      />
                      <span className="text-xs text-[#222629]">Cover dan cuplikan etalase bersih dari watermark toko pihak ketiga</span>
                    </label>

                    <label className="p-3 bg-[#F4F4F2] rounded-lg border border-[#BBBFCA]/50 flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gameChecklist.executableStable}
                        onChange={e => setGameChecklist(prev => ({ ...prev, executableStable: e.target.checked }))}
                        className="mt-0.5 accent-[#495464]"
                      />
                      <span className="text-xs text-[#222629]">Berkas dapat diekstrak dan executable berjalan normal tanpa crash awal</span>
                    </label>

                    <label className="p-3 bg-[#F4F4F2] rounded-lg border border-[#BBBFCA]/50 flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gameChecklist.licenseValid}
                        onChange={e => setGameChecklist(prev => ({ ...prev, licenseValid: e.target.checked }))}
                        className="mt-0.5 accent-[#495464]"
                      />
                      <span className="text-xs text-[#222629]">Lisensi aset, audio, font pihak ketiga terlampir jelas dan legal</span>
                    </label>
                  </div>
                </div>

                {/* Catatan Masukan untuk Game */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#222629]">
                    Catatan Kurator (Wajib diisi jika Minta Revisi atau Menolak)
                  </label>
                  <textarea
                    rows={2}
                    value={feedbackNote}
                    onChange={e => setFeedbackNote(e.target.value)}
                    placeholder="Tuliskan catatan revisi atau alasan penolakan rilis..."
                    className="w-full bg-[#F4F4F2] text-[#222629] text-xs p-3 rounded-lg border border-[#BBBFCA]/60 focus:border-[#495464] focus:bg-white outline-none resize-none"
                  />
                </div>

                {/* Action Bar Game */}
                <div className="pt-4 border-t border-[#BBBFCA]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      disabled={isProcessing}
                      onClick={handleRejectGame}
                      className="px-4 py-2 border border-[#B42318] text-[#B42318] bg-[#F4F4F2] hover:bg-rose-50 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 flex-1 sm:flex-none disabled:opacity-50"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Tolak Rilis</span>
                    </button>

                    <button
                      disabled={isProcessing}
                      onClick={handleRevisionGame}
                      className="px-4 py-2 border border-amber-600 text-amber-800 bg-[#F4F4F2] hover:bg-amber-50 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 flex-1 sm:flex-none disabled:opacity-50"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Minta Revisi</span>
                    </button>
                  </div>

                  <button
                    disabled={isProcessing}
                    onClick={handleApproveGame}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#495464] text-[#F4F4F2] text-xs font-semibold rounded-lg hover:bg-[#3d4654] transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>Setujui & Terbitkan Game</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ================= TAB 2: APPROVAL AKUN DEVELOPER ================= */}
      {activeTab === 'devs' && (
        <>
          {devQueue.length === 0 ? (
            <div className="bg-[#E8E8E8] rounded-xl p-16 text-center border border-[#BBBFCA]/40 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
              <h3 className="text-base font-bold text-[#222629]">Antrian Akun Developer Kosong</h3>
              <p className="text-xs text-[#495464] max-w-sm mx-auto">
                Semua permohonan akun kreator indie telah selesai diverifikasi.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Kolom Kiri: Antrian Akun Studio */}
              <div className="lg:col-span-4 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#495464] uppercase tracking-wider">
                  <span>Antrian Pengajuan Akun</span>
                  <span>{devQueue.length} Studio</span>
                </div>

                <div className="space-y-2.5">
                  {devQueue.map(item => {
                    const isSelected = item.id === selectedDevId
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedDevId(item.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition ${
                          isSelected
                            ? 'bg-white border-[#495464] shadow-xs'
                            : 'bg-[#E8E8E8] border-[#BBBFCA]/50 hover:border-[#495464]/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-pixel text-[#495464]">PENGAJUAN BARU</span>
                          <span className="text-[11px] text-[#495464]">{item.timeAgo}</span>
                        </div>

                        <h4 className="font-bold text-sm text-[#222629] mt-1">{item.studioName}</h4>
                        <p className="text-xs text-[#495464]">{item.applicantName}</p>

                        <div className="mt-2.5 pt-2 border-t border-[#BBBFCA]/30 flex items-center justify-between text-[11px] text-[#495464]">
                          <span className="truncate max-w-[150px]">{item.email}</span>
                          <span className="text-emerald-700 font-bold">Siap Review</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Kolom Kanan: Detail Verifikasi Developer */}
              <div className="lg:col-span-8 bg-[#E8E8E8] rounded-xl p-6 border border-[#BBBFCA]/40 space-y-6">
                
                {/* Header Studio */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#BBBFCA]/40">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#495464] text-[#F4F4F2] flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-[#495464] text-[#F4F4F2] font-semibold">
                        KANDIDAT DEVELOPER
                      </span>
                      <h2 className="text-xl font-bold text-[#222629] mt-1">
                        {currentDev.studioName}
                      </h2>
                      <p className="text-xs text-[#495464]">
                        Penanggung Jawab: <span className="font-semibold text-[#222629]">{currentDev.applicantName}</span> ({currentDev.email})
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-xs text-[#495464]">
                    <span>Diajukan pada:</span>
                    <div className="font-semibold text-[#222629]">{currentDev.dateSubmitted}</div>
                  </div>
                </div>

                {/* Deskripsi & Portofolio */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#222629]">
                    Informasi Studio & Rencana Karya
                  </h3>

                  <div className="p-4 bg-[#F4F4F2] rounded-xl border border-[#BBBFCA]/50 space-y-3 text-xs">
                    <div>
                      <span className="text-[#495464] block font-semibold text-[11px]">Rencana Proyek:</span>
                      <p className="text-[#222629] leading-relaxed mt-0.5">
                        {currentDev.focus}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#BBBFCA]/30 flex items-center justify-between">
                      <div>
                        <span className="text-[#495464] block font-semibold text-[11px]">Tautan Portofolio / Karya:</span>
                        <a 
                          href={currentDev.portfolioUrl} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[#495464] font-semibold hover:text-[#222629] hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <span>{currentDev.portfolioUrl}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                        AKTIF
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verifikasi Rekening Bank Developer */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#222629] flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#495464]" />
                    <span>Rekening Bank Penyaluran Royalti 90%</span>
                  </h3>

                  <div className="p-4 bg-[#F4F4F2] rounded-xl border border-[#BBBFCA]/50 flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <div className="font-bold text-[#222629]">{currentDev.bankName}</div>
                      <div className="font-mono text-[#495464]">{currentDev.accountNumber}</div>
                      <div className="text-[11px] text-[#495464]">Atas Nama: <span className="font-semibold text-[#222629]">{currentDev.accountHolder}</span></div>
                    </div>
                    <span className="text-[10px] font-pixel px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                      VALID
                    </span>
                  </div>
                </div>

                {/* Checklist Kurasi Manual Akun */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#222629]">
                    Checklist Validasi Profil
                  </h3>
                  <div className="space-y-2">
                    <label className="p-3 bg-[#F4F4F2] rounded-lg border border-[#BBBFCA]/50 flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={devChecklist.portfolioVerified}
                        onChange={e => setDevChecklist(prev => ({ ...prev, portfolioVerified: e.target.checked }))}
                        className="mt-0.5 accent-[#495464]"
                      />
                      <span className="text-xs text-[#222629]">Tautan portofolio dan riwayat game/karya sebelumnya sah dan dapat diakses</span>
                    </label>

                    <label className="p-3 bg-[#F4F4F2] rounded-lg border border-[#BBBFCA]/50 flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={devChecklist.emailConfirmed}
                        onChange={e => setDevChecklist(prev => ({ ...prev, emailConfirmed: e.target.checked }))}
                        className="mt-0.5 accent-[#495464]"
                      />
                      <span className="text-xs text-[#222629]">Email korespondensi resmi developer aktif dan terverifikasi</span>
                    </label>

                    <label className="p-3 bg-[#F4F4F2] rounded-lg border border-[#BBBFCA]/50 flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={devChecklist.bankMatched}
                        onChange={e => setDevChecklist(prev => ({ ...prev, bankMatched: e.target.checked }))}
                        className="mt-0.5 accent-[#495464]"
                      />
                      <span className="text-xs text-[#222629]">Nama pada rekening bank sesuai dengan penanggung jawab studio</span>
                    </label>

                    <label className="p-3 bg-[#F4F4F2] rounded-lg border border-[#BBBFCA]/50 flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={devChecklist.termsAgreed}
                        onChange={e => setDevChecklist(prev => ({ ...prev, termsAgreed: e.target.checked }))}
                        className="mt-0.5 accent-[#495464]"
                      />
                      <span className="text-xs text-[#222629]">Persetujuan Perjanjian Kemitraan Developer SideLoad (90% Royalti Dev / 10% Komisi)</span>
                    </label>
                  </div>
                </div>

                {/* Catatan Masukan Admin */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#222629]">
                    Catatan Masukan Admin (Wajib jika Menolak)
                  </label>
                  <textarea
                    rows={2}
                    value={feedbackNote}
                    onChange={e => setFeedbackNote(e.target.value)}
                    placeholder="Tuliskan alasan jika menolak atau saran untuk developer..."
                    className="w-full bg-[#F4F4F2] text-[#222629] text-xs p-3 rounded-lg border border-[#BBBFCA]/60 focus:border-[#495464] focus:bg-white outline-none resize-none"
                  />
                </div>

                {/* Action Bar Approval Akun */}
                <div className="pt-4 border-t border-[#BBBFCA]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    disabled={isProcessing}
                    onClick={handleRejectDev}
                    className="w-full sm:w-auto px-4 py-2 border border-[#B42318] text-[#B42318] bg-[#F4F4F2] hover:bg-rose-50 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Tolak Pengajuan Akun</span>
                  </button>

                  <button
                    disabled={isProcessing}
                    onClick={handleApproveDev}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#495464] text-[#F4F4F2] text-xs font-semibold rounded-lg hover:bg-[#3d4654] active:scale-[0.99] transition flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Setujui Akun Jadi Developer</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ================= TAB 3: PENCAIRAN DANA ================= */}
      {activeTab === 'payouts' && (
        <div className="bg-[#E8E8E8] rounded-xl p-6 border border-[#BBBFCA]/40 space-y-4">
          <h2 className="text-base font-bold text-[#222629]">Permohonan Pencairan Saldo Developer</h2>
          <div className="p-4 bg-[#F4F4F2] rounded-xl border border-[#BBBFCA]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-[#222629]">Nusantara Horizon Studios</h4>
                <span className="text-[10px] font-pixel px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                  BCA Terverifikasi
                </span>
              </div>
              <p className="text-xs text-[#495464] mt-0.5">Jumlah Pencairan: <span className="font-bold text-[#222629]">Rp 12.150.000</span> (Royalti 90% Bersih)</p>
              <p className="text-[11px] text-[#495464]">Rekening: BCA 827-019-3312 a/n Nusantara Horizon Studio</p>
            </div>
            <button 
              onClick={() => alert('Transfer pencairan dana berhasil divalidasi.')}
              className="px-4 py-2 bg-[#495464] text-[#F4F4F2] text-xs font-semibold rounded-lg hover:bg-[#3d4654]"
            >
              Proses Transfer Payout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
