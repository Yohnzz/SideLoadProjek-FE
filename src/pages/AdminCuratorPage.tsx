import React, { useState, useEffect } from 'react';
import {
  Check,
  X,
  CheckCircle2,
  ExternalLink,
  FileCheck,
  UserCheck,
  CreditCard,
  Building2,
  AlertTriangle,
  TrendingUp,
  Wallet,
  Copy,
  Gamepad2,
  Clock,
} from 'lucide-react';
import { adminService, type AdminGameQueueItem, type AdminDevApplicationItem } from '../services/adminService';
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Textarea,
  Checkbox,
  Tabs,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Avatar,
  EmptyState,
} from '../components/ui';

export interface AdminCuratorPageProps {
  onBackToStore: () => void;
  onApproveDeveloperAccount?: (studioName: string) => void;
  activeTab?: 'products' | 'devs' | 'payouts';
  onTabChange?: (tab: 'products' | 'devs' | 'payouts') => void;
}

interface PayoutRequestItem {
  id: string;
  code: string;
  studioName: string;
  applicantName: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  amount: number;
  requestDate: string;
  status: 'pending' | 'completed' | 'rejected';
}

const FALLBACK_GAME_QUEUE: AdminGameQueueItem[] = [
  {
    id: '1',
    code: 'PRD-2026-0819',
    type: 'PATCH UPDATE',
    timeAgo: '4 jam lalu',
    title: 'Kala: Warisan Kabut',
    developer: 'Nusantara Horizon Studios',
    version: 'v1.2.1-patch',
    category: 'Petualangan Naratif',
    platform: 'WIN / WEB',
    dateSubmitted: '24 Mei 2026, 10:14 WIB',
    fileName: 'Kala_WarisanKabut_v1.2.1_Win64.zip',
    fileSize: '412.4 MB (Windows x86_64)',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    status: 'pending_review',
  },
  {
    id: '2',
    code: 'PRD-2026-0818',
    type: 'GAME BARU',
    timeAgo: '1 hari lalu',
    title: 'Lentera Rimba',
    developer: 'Studio Rimba Raya',
    version: 'v0.8.1',
    category: 'Eksplorasi Alam',
    platform: 'WIN',
    dateSubmitted: '23 Mei 2026, 14:30 WIB',
    fileName: 'LenteraRimba_v0.8.1_Build.zip',
    fileSize: '320 MB (Windows x86_64)',
    sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    status: 'pending_review',
  },
];

const FALLBACK_DEV_APPLICATIONS: AdminDevApplicationItem[] = [
  {
    id: 'dev-app-1',
    userId: 'usr-1',
    studioName: 'Nusantara Horizon Studios',
    applicantName: 'Bagas Pratama',
    email: 'bagas@nusantarahorizon.id',
    portfolioUrl: 'https://itch.io/profile/nusantara-horizon',
    timeAgo: '2 jam lalu',
    dateSubmitted: '24 Mei 2026, 12:40 WIB',
    focus: 'Fokus pengembangan game naratif dan pixel-art bertema mitologi nusantara dengan rencana rilis Alpha.',
    bankName: 'Bank Central Asia (BCA)',
    accountNumber: '827-019-3312',
    accountHolder: 'Nusantara Horizon Studio',
  },
  {
    id: 'dev-app-2',
    userId: 'usr-2',
    studioName: 'Studio Lentera Rimba',
    applicantName: 'Aditia Permana',
    email: 'aditia@lenterarimba.dev',
    portfolioUrl: 'https://github.com/lenterarimba',
    timeAgo: '6 jam lalu',
    dateSubmitted: '24 Mei 2026, 08:15 WIB',
    focus: 'Mengembangkan game eksplorasi alam 2D dengan audio suasana relaksasi dan teka-teki lingkungan hidup.',
    bankName: 'Bank Mandiri',
    accountNumber: '137-00-1928-331',
    accountHolder: 'Studio Lentera Rimba',
  },
];

const INITIAL_PAYOUT_REQUESTS: PayoutRequestItem[] = [
  {
    id: 'wd-1',
    code: 'WD-2026-0812',
    studioName: 'Nusantara Horizon Studios',
    applicantName: 'Bagas Pratama',
    bankName: 'Bank Central Asia (BCA)',
    accountNumber: '827-019-3312',
    accountHolder: 'Nusantara Horizon Studio',
    amount: 18250000,
    requestDate: '24 Mei 2026, 09:20 WIB',
    status: 'pending',
  },
  {
    id: 'wd-2',
    code: 'WD-2026-0811',
    studioName: 'Studio Rimba Raya',
    applicantName: 'Aditia Permana',
    bankName: 'Bank Mandiri',
    accountNumber: '137-00-1928-331',
    accountHolder: 'Studio Rimba Raya',
    amount: 4900000,
    requestDate: '23 Mei 2026, 16:45 WIB',
    status: 'pending',
  },
  {
    id: 'wd-3',
    code: 'WD-2026-0809',
    studioName: 'Pixel Nusantara Studio',
    applicantName: 'Dewi Lestari',
    bankName: 'Bank Negara Indonesia (BNI)',
    accountNumber: '089-221-4820',
    accountHolder: 'Pixel Nusantara Studio',
    amount: 8420000,
    requestDate: '21 Mei 2026, 11:10 WIB',
    status: 'completed',
  },
];

const RECENT_TRANSACTIONS = [
  {
    id: 'ORD-9842',
    date: '24 Mei 2026, 13:12 WIB',
    game: 'Kala: Warisan Kabut',
    studio: 'Nusantara Horizon Studios',
    gross: 85000,
    fee2Pct: 1700,
    net98Pct: 83300,
  },
  {
    id: 'ORD-9841',
    date: '24 Mei 2026, 12:45 WIB',
    game: 'Lentera Rimba',
    studio: 'Studio Rimba Raya',
    gross: 65000,
    fee2Pct: 1300,
    net98Pct: 63700,
  },
  {
    id: 'ORD-9840',
    date: '24 Mei 2026, 11:20 WIB',
    game: 'Tactical Recon 2',
    studio: 'Digital Forge',
    gross: 45000,
    fee2Pct: 900,
    net98Pct: 44100,
  },
  {
    id: 'ORD-9839',
    date: '24 Mei 2026, 10:05 WIB',
    game: 'Cyber Runner 2099',
    studio: 'Neon Byte Studio',
    gross: 120000,
    fee2Pct: 2400,
    net98Pct: 117600,
  },
];

export const AdminCuratorPage: React.FC<AdminCuratorPageProps> = ({
  onBackToStore,
  onApproveDeveloperAccount,
  activeTab: externalActiveTab,
  onTabChange,
}) => {
  const [internalTab, setInternalTab] = useState<'products' | 'devs' | 'payouts'>('products');
  const activeTab = externalActiveTab || internalTab;

  const handleTabChange = (tab: 'products' | 'devs' | 'payouts') => {
    setInternalTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
    setFeedbackNote('');
  };

  const [gameQueue, setGameQueue] = useState<AdminGameQueueItem[]>(FALLBACK_GAME_QUEUE);
  const [selectedGameId, setSelectedGameId] = useState<string>('1');

  const [devQueue, setDevQueue] = useState<AdminDevApplicationItem[]>(FALLBACK_DEV_APPLICATIONS);
  const [selectedDevId, setSelectedDevId] = useState<string>('dev-app-1');

  const [payoutRequests, setPayoutRequests] = useState<PayoutRequestItem[]>(INITIAL_PAYOUT_REQUESTS);

  const [feedbackNote, setFeedbackNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);

  const [copiedSha, setCopiedSha] = useState(false);
  const [showWebSimulator, setShowWebSimulator] = useState(false);

  // Checklist Game
  const [gameChecklist, setGameChecklist] = useState({
    watermarkClean: true,
    executableStable: true,
    licenseValid: true,
    ageRatingAccurate: true,
  });

  // Checklist Developer
  const [devChecklist, setDevChecklist] = useState({
    portfolioVerified: true,
    emailConfirmed: true,
    bankMatched: true,
    termsAgreed: true,
  });

  // Load live queues from Supabase
  useEffect(() => {
    let isMounted = true;
    const loadQueues = async () => {
      const dbGames = await adminService.getPendingGames();
      if (isMounted && dbGames.length > 0) {
        setGameQueue(dbGames);
        setSelectedGameId(dbGames[0].id);
      }

      const dbDevs = await adminService.getPendingDevelopers();
      if (isMounted && dbDevs.length > 0) {
        setDevQueue(dbDevs);
        setSelectedDevId(dbDevs[0].id);
      }
    };
    loadQueues();
    return () => {
      isMounted = false;
    };
  }, []);

  const showNotification = (message: string, type: 'success' | 'warning' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const currentGame = gameQueue.find((q) => q.id === selectedGameId) || gameQueue[0];
  const currentDev = devQueue.find((d) => d.id === selectedDevId) || devQueue[0];

  // Action: Approve Game
  const handleApproveGame = async () => {
    if (!currentGame) return;
    setIsProcessing(true);
    const success = await adminService.reviewGame(currentGame.id, 'approve');
    setIsProcessing(false);

    if (success) {
      showNotification(`Game "${currentGame.title}" (${currentGame.version}) disetujui dan langsung terbit di etalase.`);
      const remaining = gameQueue.filter((q) => q.id !== currentGame.id);
      setGameQueue(remaining);
      if (remaining.length > 0) {
        setSelectedGameId(remaining[0].id);
      }
      setFeedbackNote('');
    }
  };

  // Action: Request Revision
  const handleRevisionGame = async () => {
    if (!currentGame) return;
    if (!feedbackNote.trim()) {
      showNotification('Harap tuliskan catatan perbaikan pada kolom masukan kurator.', 'warning');
      return;
    }
    setIsProcessing(true);
    const success = await adminService.reviewGame(currentGame.id, 'revision', feedbackNote);
    setIsProcessing(false);

    if (success) {
      showNotification(`Permintaan revisi untuk "${currentGame.title}" berhasil dikirimkan ke developer.`);
      const remaining = gameQueue.filter((q) => q.id !== currentGame.id);
      setGameQueue(remaining);
      if (remaining.length > 0) {
        setSelectedGameId(remaining[0].id);
      }
      setFeedbackNote('');
    }
  };

  // Action: Reject Game
  const handleRejectGame = async () => {
    if (!currentGame) return;
    if (!feedbackNote.trim()) {
      showNotification('Harap tuliskan alasan penolakan karya pada kolom masukan.', 'warning');
      return;
    }
    setIsProcessing(true);
    const success = await adminService.reviewGame(currentGame.id, 'reject', feedbackNote);
    setIsProcessing(false);

    if (success) {
      showNotification(`Karya "${currentGame.title}" telah ditolak dengan catatan resmi.`, 'warning');
      const remaining = gameQueue.filter((q) => q.id !== currentGame.id);
      setGameQueue(remaining);
      if (remaining.length > 0) {
        setSelectedGameId(remaining[0].id);
      }
      setFeedbackNote('');
    }
  };

  // Action: Approve Developer
  const handleApproveDev = async () => {
    if (!currentDev) return;
    setIsProcessing(true);
    const success = await adminService.reviewDeveloper(currentDev.id, currentDev.userId, 'approve');
    setIsProcessing(false);

    if (success) {
      showNotification(`Akun studio "${currentDev.studioName}" berhasil disetujui menjadi developer resmi.`);
      if (onApproveDeveloperAccount) {
        onApproveDeveloperAccount(currentDev.studioName);
      }
      const remaining = devQueue.filter((d) => d.id !== currentDev.id);
      setDevQueue(remaining);
      if (remaining.length > 0) {
        setSelectedDevId(remaining[0].id);
      }
      setFeedbackNote('');
    }
  };

  // Action: Reject Developer
  const handleRejectDev = async () => {
    if (!currentDev) return;
    if (!feedbackNote.trim()) {
      showNotification('Harap tuliskan alasan penolakan pada kolom masukan.', 'warning');
      return;
    }
    setIsProcessing(true);
    const success = await adminService.reviewDeveloper(currentDev.id, currentDev.userId, 'reject', feedbackNote);
    setIsProcessing(false);

    if (success) {
      showNotification(`Pengajuan akun studio "${currentDev.studioName}" telah ditolak.`, 'warning');
      const remaining = devQueue.filter((d) => d.id !== currentDev.id);
      setDevQueue(remaining);
      if (remaining.length > 0) {
        setSelectedDevId(remaining[0].id);
      }
      setFeedbackNote('');
    }
  };

  // Action: Process Payout
  const handleProcessPayout = (id: string, studio: string, amount: number) => {
    setPayoutRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'completed' } : item))
    );
    showNotification(
      `Pencairan dana Rp ${amount.toLocaleString('id-ID')} untuk ${studio} berhasil diproses dan dikirim.`
    );
  };

  // Action: Reject Payout
  const handleRejectPayout = (id: string, studio: string) => {
    setPayoutRequests((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'rejected' } : item))
    );
    showNotification(`Permohonan pencairan dana studio ${studio} ditolak dan saldo dikembalikan ke escrow.`, 'warning');
  };

  const copyShaToClipboard = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2000);
  };

  const pendingPayoutCount = payoutRequests.filter((p) => p.status === 'pending').length;

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-[10px] text-xs font-semibold shadow-lg flex items-center gap-2.5 border transition-all animate-in fade-in duration-200 ${
            notification.type === 'success'
              ? 'bg-[#171923] text-white border-emerald-500/30'
              : 'bg-[#171923] text-white border-amber-500/30'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white rounded-[12px] p-5 border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-[#171923] tracking-tight">
              Panel Kurasi & Moderasi Admin
            </h1>
            <Badge variant="primary" size="sm">
              Sistem Aktif
            </Badge>
          </div>
          <p className="text-xs text-[#737887] mt-1">
            Verifikasi kelayakan rilis game indie, audit permohonan studio baru, dan pantau bagi hasil platform 2%.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBackToStore}
            leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
          >
            Lihat Etalase Publik
          </Button>
          <div className="h-4 w-px bg-[#E5E7EB] hidden sm:block" />
          <div className="flex items-center gap-2.5 pl-1">
            <Avatar name="Admin Kurasi" size="sm" status="online" />
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-[#171923]">Admin Kurasi</div>
              <div className="text-[10px] text-[#737887]">SideLoad Security Team</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Metric Cards for Platform Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#737887]">
              <span>Komisi Platform (2%)</span>
              <div className="w-7 h-7 rounded-[8px] bg-[#EFF6FF] text-[#2373FB] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-[#171923]">Rp 1.450.000</div>
            <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Bersih masuk kas platform SideLoad</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#737887]">
              <span>Volume Transaksi (GMV)</span>
              <div className="w-7 h-7 rounded-[8px] bg-[#F0F1F5] text-[#171923] flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-[#171923]">Rp 72.500.000</div>
            <div className="text-[11px] text-[#737887]">
              842 transaksi penjualan game berbayar
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#737887]">
              <span>Antrean Kurasi Game</span>
              <div className="w-7 h-7 rounded-[8px] bg-amber-50 text-amber-600 flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-[#171923]">{gameQueue.length} Karya</div>
            <div className="text-[11px] text-amber-600 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Memerlukan validasi integritas</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#737887]">
              <span>Permohonan Pencairan</span>
              <div className="w-7 h-7 rounded-[8px] bg-violet-50 text-[#6A3DFB] flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-bold text-[#171923]">{pendingPayoutCount} Studio</div>
            <div className="text-[11px] text-[#6A3DFB] font-medium flex items-center gap-1">
              <CreditCard className="w-3 h-3" />
              <span>Royalti bersih 98% siap transfer</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <Tabs
        variant="underline"
        activeId={activeTab}
        onChange={(id) => handleTabChange(id as 'products' | 'devs' | 'payouts')}
        items={[
          {
            id: 'products',
            label: 'Review Game & Aplikasi',
            count: gameQueue.length,
            icon: <FileCheck className="w-4 h-4" />,
          },
          {
            id: 'devs',
            label: 'Approval Akun Developer',
            count: devQueue.length,
            icon: <UserCheck className="w-4 h-4" />,
          },
          {
            id: 'payouts',
            label: 'Keuangan & Pencairan Dana',
            count: pendingPayoutCount,
            icon: <Wallet className="w-4 h-4" />,
          },
        ]}
      />

      {/* ================= TAB 1: REVIEW GAME & APLIKASI ================= */}
      {activeTab === 'products' && (
        <>
          {gameQueue.length === 0 ? (
            <Card>
              <CardContent className="p-12">
                <EmptyState
                  icon={<CheckCircle2 className="w-12 h-12 text-emerald-500" />}
                  title="Antrean Kurasi Game Kosong"
                  description="Semua game, aplikasi, dan berkas patch yang diajukan komunitas developer telah selesai ditinjau."
                  actionText="Kembali ke Etalase"
                  onAction={onBackToStore}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Kolom Kiri: Antrean Game */}
              <div className="lg:col-span-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#737887]">
                  <span>MENUNGGU VERIFIKASI</span>
                  <Badge variant="neutral" size="sm">
                    {gameQueue.length} Item
                  </Badge>
                </div>

                <div className="space-y-2.5">
                  {gameQueue.map((item) => {
                    const isSelected = item.id === selectedGameId;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedGameId(item.id)}
                        className={`p-4 rounded-[12px] border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white border-[#2373FB] shadow-sm ring-1 ring-[#2373FB]'
                            : 'bg-white border-[#E5E7EB] hover:border-[#2373FB]/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[11px] font-mono text-[#737887]">{item.code}</span>
                          <Badge
                            variant={item.type === 'GAME BARU' ? 'primary' : 'neutral'}
                            size="sm"
                          >
                            {item.type}
                          </Badge>
                        </div>

                        <h4 className="font-bold text-sm text-[#171923] mt-1.5">{item.title}</h4>
                        <p className="text-xs text-[#737887]">{item.developer}</p>

                        <div className="mt-3 pt-2.5 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#737887]">
                          <span className="font-mono">{item.version} ({item.platform})</span>
                          <span>{item.timeAgo}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Kolom Kanan: Detail Berkas, Pratinjau & Form Kurator */}
              <div className="lg:col-span-8 space-y-5">
                {/* Detail Game & Header */}
                <Card>
                  <CardHeader className="pb-4 border-b border-[#E5E7EB]">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="primary" size="sm">
                            {currentGame.type}
                          </Badge>
                          <span className="text-xs text-[#737887]">{currentGame.code}</span>
                        </div>
                        <h2 className="text-xl font-bold text-[#171923] mt-1">
                          {currentGame.title} ({currentGame.version})
                        </h2>
                        <p className="text-xs text-[#737887]">
                          Karya Studio <span className="font-semibold text-[#171923]">{currentGame.developer}</span> • Kategori: {currentGame.category}
                        </p>
                      </div>

                      <div className="text-right text-xs text-[#737887]">
                        <span>Diajukan pada:</span>
                        <div className="font-semibold text-[#171923] mt-0.5">{currentGame.dateSubmitted}</div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 space-y-5">
                    {/* Visual Media & Pratinjau Game */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#171923] uppercase tracking-wider">
                          Pratinjau Etalase & Web Player
                        </span>
                        {currentGame.platform.includes('WEB') && (
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<Gamepad2 className="w-3.5 h-3.5 text-[#2373FB]" />}
                            onClick={() => setShowWebSimulator((prev) => !prev)}
                          >
                            {showWebSimulator ? 'Tutup Web Player' : 'Uji Coba di Web Player'}
                          </Button>
                        )}
                      </div>

                      {showWebSimulator && currentGame.platform.includes('WEB') ? (
                        <div className="rounded-[10px] overflow-hidden border border-[#2373FB]/40 bg-[#171923] p-4 text-center text-white space-y-3">
                          <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-700">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              Web Player Sandbox Test: {currentGame.title}
                            </span>
                            <Badge variant="success" size="sm">
                              60 FPS Normal
                            </Badge>
                          </div>
                          <div className="aspect-video bg-black/60 rounded-[8px] flex flex-col items-center justify-center p-6 space-y-2">
                            <Gamepad2 className="w-10 h-10 text-[#2373FB]" />
                            <div className="text-sm font-semibold">Simulasi Build WebGL Berjalan Stabil</div>
                            <p className="text-xs text-slate-400 max-w-md">
                              Resolusi canvas 1920x1080 responsif, audio context aktif, tidak ada memory leak yang terdeteksi.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2 aspect-video rounded-[10px] bg-slate-900 overflow-hidden relative group">
                            <img
                              src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop"
                              alt="Cover Game"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                              <span className="text-xs font-semibold text-white">Cover Banner 16:9 Utama</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <div className="flex-1 aspect-video rounded-[8px] bg-slate-800 overflow-hidden">
                              <img
                                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop"
                                alt="Cuplikan 1"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 aspect-video rounded-[8px] bg-slate-800 overflow-hidden">
                              <img
                                src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop"
                                alt="Cuplikan 2"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Integritas Berkas & Antivirus */}
                    <div className="p-4 bg-[#F7F8FA] rounded-[10px] border border-[#E5E7EB] space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileCheck className="w-4 h-4 text-[#2373FB]" />
                          <span className="text-xs font-bold text-[#171923]">
                            Verifikasi Paket Rilis & Keamanan
                          </span>
                        </div>
                        <Badge variant="success" size="sm">
                          Lolos Pemindaian
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-white rounded-[8px] border border-[#E5E7EB]">
                          <span className="text-[11px] text-[#737887] block">Nama File & Ukuran:</span>
                          <span className="font-mono font-semibold text-[#171923] block mt-0.5 truncate">
                            {currentGame.fileName}
                          </span>
                          <span className="text-[11px] text-[#737887] block">{currentGame.fileSize}</span>
                        </div>

                        <div className="p-3 bg-white rounded-[8px] border border-[#E5E7EB]">
                          <span className="text-[11px] text-[#737887] block">Sentinel Antivirus Scanner:</span>
                          <div className="flex items-center justify-between mt-1">
                            <span className="font-mono text-[11px] text-[#171923]">0/72 Engine Dideteksi</span>
                            <span className="text-xs font-bold text-emerald-600">BERSIH</span>
                          </div>
                          <span className="text-[10px] text-emerald-600 block mt-0.5">
                            Bebas dari trojan, adware, atau crypto miner
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-white rounded-[8px] border border-[#E5E7EB] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-[#737887]">
                            SHA-256 Checksum Manifest:
                          </span>
                          <button
                            type="button"
                            onClick={() => copyShaToClipboard(currentGame.sha256)}
                            className="text-[11px] text-[#2373FB] hover:underline flex items-center gap-1 font-medium"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedSha ? 'Tersalin!' : 'Salin Hash'}</span>
                          </button>
                        </div>
                        <div className="font-mono text-[11px] text-[#171923] break-all bg-[#F0F1F5] p-2 rounded-[6px] select-all">
                          {currentGame.sha256}
                        </div>
                      </div>
                    </div>

                    {/* Checklist Kurasi Manual Game */}
                    <div className="space-y-2.5">
                      <span className="text-xs font-bold text-[#171923] uppercase tracking-wider block">
                        Checklist Kurasi Manual Game (4 Kriteria Wajib)
                      </span>

                      <div className="space-y-2">
                        <div className="p-3 bg-white rounded-[8px] border border-[#E5E7EB]">
                          <Checkbox
                            checked={gameChecklist.watermarkClean}
                            onChange={(e) =>
                              setGameChecklist((prev) => ({ ...prev, watermarkClean: e.target.checked }))
                            }
                            label="Cover dan cuplikan etalase bersih dari watermark toko pihak ketiga"
                            description="Tampilan media produk orisinal dan tidak mencantumkan logo kompetitor tanpa izin."
                          />
                        </div>

                        <div className="p-3 bg-white rounded-[8px] border border-[#E5E7EB]">
                          <Checkbox
                            checked={gameChecklist.executableStable}
                            onChange={(e) =>
                              setGameChecklist((prev) => ({ ...prev, executableStable: e.target.checked }))
                            }
                            label="Berkas dapat diekstrak dan build berjalan normal tanpa crash awal"
                            description="File zip berisi binary executable atau WebGL index.html yang valid dan dapat dimainkan."
                          />
                        </div>

                        <div className="p-3 bg-white rounded-[8px] border border-[#E5E7EB]">
                          <Checkbox
                            checked={gameChecklist.licenseValid}
                            onChange={(e) =>
                              setGameChecklist((prev) => ({ ...prev, licenseValid: e.target.checked }))
                            }
                            label="Lisensi aset, audio, dan font pihak ketiga terlampir jelas dan legal"
                            description="Developer menjamin seluruh aset memiliki izin komersial atau dibuat secara mandiri."
                          />
                        </div>

                        <div className="p-3 bg-white rounded-[8px] border border-[#E5E7EB]">
                          <Checkbox
                            checked={gameChecklist.ageRatingAccurate}
                            onChange={(e) =>
                              setGameChecklist((prev) => ({ ...prev, ageRatingAccurate: e.target.checked }))
                            }
                            label="Klasifikasi batas usia dan deskripsi gameplay sesuai dengan konten asli"
                            description="Tidak memuat konten berbahaya tersembunyi yang melanggar ketentuan hukum Indonesia."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Catatan Feedback Kurator */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#171923] uppercase tracking-wider block">
                        Catatan Masukan Kurator (Wajib diisi jika Minta Revisi atau Menolak)
                      </label>
                      <Textarea
                        rows={2}
                        value={feedbackNote}
                        onChange={(e) => setFeedbackNote(e.target.value)}
                        placeholder="Contoh: Harap perbarui cuplikan layar ketiga agar sesuai dengan rasio 16:9, dan lampirkan izin lisensi background music..."
                      />
                    </div>
                  </CardContent>

                  {/* Action Bar */}
                  <CardFooter className="p-4 bg-[#F7F8FA] border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={isProcessing}
                        onClick={handleRejectGame}
                        leftIcon={<X className="w-3.5 h-3.5" />}
                        className="flex-1 sm:flex-none"
                      >
                        Tolak Rilis
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={isProcessing}
                        onClick={handleRevisionGame}
                        leftIcon={<AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                        className="flex-1 sm:flex-none text-amber-700 hover:bg-amber-50"
                      >
                        Minta Revisi
                      </Button>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      disabled={isProcessing}
                      onClick={handleApproveGame}
                      leftIcon={<Check className="w-4 h-4" />}
                      className="w-full sm:w-auto"
                    >
                      Setujui & Terbitkan Game
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </>
      )}

      {/* ================= TAB 2: APPROVAL AKUN DEVELOPER ================= */}
      {activeTab === 'devs' && (
        <>
          {devQueue.length === 0 ? (
            <Card>
              <CardContent className="p-12">
                <EmptyState
                  icon={<UserCheck className="w-12 h-12 text-emerald-500" />}
                  title="Antrean Akun Developer Kosong"
                  description="Semua permohonan akun studio kreator indie telah selesai diverifikasi oleh tim kurasi."
                  actionText="Kembali ke Etalase"
                  onAction={onBackToStore}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Kolom Kiri: Antrean Studio */}
              <div className="lg:col-span-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#737887]">
                  <span>PENGAJUAN DEVELOPER</span>
                  <Badge variant="neutral" size="sm">
                    {devQueue.length} Studio
                  </Badge>
                </div>

                <div className="space-y-2.5">
                  {devQueue.map((item) => {
                    const isSelected = item.id === selectedDevId;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedDevId(item.id)}
                        className={`p-4 rounded-[12px] border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-white border-[#2373FB] shadow-sm ring-1 ring-[#2373FB]'
                            : 'bg-white border-[#E5E7EB] hover:border-[#2373FB]/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[11px] font-semibold text-emerald-600">MENUNGGU KURASI</span>
                          <span className="text-[11px] text-[#737887]">{item.timeAgo}</span>
                        </div>

                        <h4 className="font-bold text-sm text-[#171923] mt-1.5">{item.studioName}</h4>
                        <p className="text-xs text-[#737887]">{item.applicantName}</p>

                        <div className="mt-3 pt-2.5 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#737887]">
                          <span className="truncate max-w-[170px]">{item.email}</span>
                          <span className="text-[#2373FB] font-semibold">Tinjau</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Kolom Kanan: Detail Studio & Validasi */}
              <div className="lg:col-span-8 space-y-5">
                <Card>
                  <CardHeader className="pb-4 border-b border-[#E5E7EB]">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-[12px] bg-[#EFF6FF] text-[#2373FB] flex items-center justify-center shrink-0">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant="primary" size="sm">
                              Calon Developer
                            </Badge>
                            <span className="text-xs text-[#737887]">Diajukan {currentDev.timeAgo}</span>
                          </div>
                          <h2 className="text-xl font-bold text-[#171923] mt-1">
                            {currentDev.studioName}
                          </h2>
                          <p className="text-xs text-[#737887]">
                            Penanggung Jawab: <span className="font-semibold text-[#171923]">{currentDev.applicantName}</span> ({currentDev.email})
                          </p>
                        </div>
                      </div>

                      <div className="text-right text-xs text-[#737887]">
                        <span>Tanggal Pengajuan:</span>
                        <div className="font-semibold text-[#171923] mt-0.5">{currentDev.dateSubmitted}</div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-5 space-y-5">
                    {/* Visi Studio & Portofolio */}
                    <div className="p-4 bg-[#F7F8FA] rounded-[10px] border border-[#E5E7EB] space-y-3 text-xs">
                      <div>
                        <span className="text-[11px] font-bold text-[#737887] uppercase tracking-wider block">
                          Rencana Proyek & Fokus Pengembangan:
                        </span>
                        <p className="text-[#171923] leading-relaxed mt-1">
                          {currentDev.focus}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#E5E7EB] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[11px] font-bold text-[#737887] uppercase tracking-wider block">
                            Tautan Portofolio / Karya Sebelumnya:
                          </span>
                          <a
                            href={currentDev.portfolioUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#2373FB] font-semibold hover:underline flex items-center gap-1 mt-0.5"
                          >
                            <span>{currentDev.portfolioUrl}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <Badge variant="success" size="sm">
                          Tautan Dapat Diakses
                        </Badge>
                      </div>
                    </div>

                    {/* Rekening Bank Developer untuk Royalti 98% */}
                    <div className="p-4 bg-white rounded-[10px] border border-[#E5E7EB] space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-[#2373FB]" />
                          <span className="text-xs font-bold text-[#171923]">
                            Rekening Bank Penyaluran Royalti 98%
                          </span>
                        </div>
                        <Badge variant="success" size="sm">
                          Terverifikasi
                        </Badge>
                      </div>

                      <div className="p-3 bg-[#F7F8FA] rounded-[8px] flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <div className="font-bold text-[#171923]">{currentDev.bankName}</div>
                          <div className="font-mono text-[#737887]">{currentDev.accountNumber}</div>
                          <div className="text-[11px] text-[#737887]">
                            Atas Nama: <span className="font-semibold text-[#171923]">{currentDev.accountHolder}</span>
                          </div>
                        </div>
                        <div className="text-right text-[11px] text-[#737887]">
                          <div>Bagi Hasil Otomatis</div>
                          <div className="font-bold text-[#2373FB]">98% Developer / 2% Admin</div>
                        </div>
                      </div>
                    </div>

                    {/* Checklist Validasi Profil */}
                    <div className="space-y-2.5">
                      <span className="text-xs font-bold text-[#171923] uppercase tracking-wider block">
                        Checklist Validasi Profil Studio (4 Kriteria)
                      </span>

                      <div className="space-y-2">
                        <div className="p-3 bg-white rounded-[8px] border border-[#E5E7EB]">
                          <Checkbox
                            checked={devChecklist.portfolioVerified}
                            onChange={(e) =>
                              setDevChecklist((prev) => ({ ...prev, portfolioVerified: e.target.checked }))
                            }
                            label="Tautan portofolio dan riwayat game atau karya sebelumnya sah dan dapat diakses"
                            description="Menunjukkan rekam jejak pembuatan karya digital indie yang valid."
                          />
                        </div>

                        <div className="p-3 bg-white rounded-[8px] border border-[#E5E7EB]">
                          <Checkbox
                            checked={devChecklist.emailConfirmed}
                            onChange={(e) =>
                              setDevChecklist((prev) => ({ ...prev, emailConfirmed: e.target.checked }))
                            }
                            label="Email korespondensi resmi developer aktif dan terverifikasi"
                            description="Email domain studio atau email penanggung jawab telah lolos verifikasi tautan konfirmasi."
                          />
                        </div>

                        <div className="p-3 bg-white rounded-[8px] border border-[#E5E7EB]">
                          <Checkbox
                            checked={devChecklist.bankMatched}
                            onChange={(e) =>
                              setDevChecklist((prev) => ({ ...prev, bankMatched: e.target.checked }))
                            }
                            label="Nama pada rekening bank sesuai dengan identitas penanggung jawab studio"
                            description="Mencegah indikasi pencucian uang atau kepemilikan rekening fiktif pihak ketiga."
                          />
                        </div>

                        <div className="p-3 bg-white rounded-[8px] border border-[#E5E7EB]">
                          <Checkbox
                            checked={devChecklist.termsAgreed}
                            onChange={(e) =>
                              setDevChecklist((prev) => ({ ...prev, termsAgreed: e.target.checked }))
                            }
                            label="Persetujuan Perjanjian Kemitraan Developer SideLoad (98% Royalti Studio, 2% Biaya Platform)"
                            description="Developer setuju mematuhi syarat konten orisinal dan kebijakan garansi refund 14 hari pemain."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Catatan Masukan Admin */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#171923] uppercase tracking-wider block">
                        Catatan Masukan Admin (Wajib diisi jika Menolak)
                      </label>
                      <Textarea
                        rows={2}
                        value={feedbackNote}
                        onChange={(e) => setFeedbackNote(e.target.value)}
                        placeholder="Contoh: Harap sertakan link repository GitHub atau video demonstrasi proyek yang dapat diuji..."
                      />
                    </div>
                  </CardContent>

                  {/* Action Bar */}
                  <CardFooter className="p-4 bg-[#F7F8FA] border-t border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-3">
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={isProcessing}
                      onClick={handleRejectDev}
                      leftIcon={<X className="w-3.5 h-3.5" />}
                      className="w-full sm:w-auto"
                    >
                      Tolak Pengajuan Akun
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      disabled={isProcessing}
                      onClick={handleApproveDev}
                      leftIcon={<UserCheck className="w-4 h-4" />}
                      className="w-full sm:w-auto"
                    >
                      Setujui Akun Jadi Developer
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          )}
        </>
      )}

      {/* ================= TAB 3: KEUANGAN & PENCAIRAN DANA ================= */}
      {activeTab === 'payouts' && (
        <div className="space-y-6">
          {/* Antrean Pencairan Dana */}
          <Card>
            <CardHeader className="pb-3 border-b border-[#E5E7EB]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-bold text-[#171923]">
                    Antrean Permohonan Penarikan Dana Studio
                  </CardTitle>
                  <CardDescription className="text-xs text-[#737887]">
                    Permohonan pencairan saldo royalti bersih 98% yang diajukan oleh developer terverifikasi.
                  </CardDescription>
                </div>
                <Badge variant="primary" size="sm">
                  {pendingPayoutCount} Menunggu Transfer
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kode Permohonan</TableHead>
                    <TableHead>Studio & Penanggung Jawab</TableHead>
                    <TableHead>Rekening Bank Tujuan</TableHead>
                    <TableHead>Nominal Bersih (98%)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi Transfer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payoutRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-mono text-[11px] text-[#737887]">
                        {req.code}
                        <div className="text-[10px] text-[#737887]">{req.requestDate}</div>
                      </TableCell>

                      <TableCell>
                        <div className="font-semibold text-xs text-[#171923]">{req.studioName}</div>
                        <div className="text-[11px] text-[#737887]">{req.applicantName}</div>
                      </TableCell>

                      <TableCell>
                        <div className="font-medium text-xs text-[#171923]">{req.bankName}</div>
                        <div className="font-mono text-[11px] text-[#737887]">{req.accountNumber}</div>
                        <div className="text-[10px] text-[#737887]">a/n {req.accountHolder}</div>
                      </TableCell>

                      <TableCell>
                        <div className="font-bold text-xs text-[#171923]">
                          Rp {req.amount.toLocaleString('id-ID')}
                        </div>
                        <div className="text-[10px] text-emerald-600 font-medium">Bebas Biaya Admin Tambahan</div>
                      </TableCell>

                      <TableCell>
                        {req.status === 'pending' && (
                          <Badge variant="warning" size="sm" dot>
                            Menunggu Transfer
                          </Badge>
                        )}
                        {req.status === 'completed' && (
                          <Badge variant="success" size="sm">
                            Selesai Ditransfer
                          </Badge>
                        )}
                        {req.status === 'rejected' && (
                          <Badge variant="danger" size="sm">
                            Ditolak
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="text-right">
                        {req.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-rose-600 hover:bg-rose-50"
                              onClick={() => handleRejectPayout(req.id, req.studioName)}
                            >
                              Tolak
                            </Button>
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleProcessPayout(req.id, req.studioName, req.amount)}
                            >
                              Proses Transfer
                            </Button>
                          </div>
                        ) : req.status === 'completed' ? (
                          <span className="text-xs text-emerald-600 font-semibold flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Terkirim</span>
                          </span>
                        ) : (
                          <span className="text-xs text-rose-600 font-semibold">
                            Dibatalkan
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Audit Log Transaksi Toko & Bagi Hasil 2% */}
          <Card>
            <CardHeader className="pb-3 border-b border-[#E5E7EB]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base font-bold text-[#171923]">
                    Audit Transaksi Toko & Komisi Platform 2%
                  </CardTitle>
                  <CardDescription className="text-xs text-[#737887]">
                    Kalkulasi otomatis dari setiap pembelian produk berbayar di ekosistem SideLoad.
                  </CardDescription>
                </div>
                <div className="text-xs text-[#737887]">
                  Formula: <span className="font-semibold text-[#171923]">Harga Kotor × 2% = Kas Platform</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Pesanan & Waktu</TableHead>
                    <TableHead>Produk & Studio</TableHead>
                    <TableHead>Harga Kotor (GMV)</TableHead>
                    <TableHead>Komisi Platform (2%)</TableHead>
                    <TableHead>Hak Developer (98%)</TableHead>
                    <TableHead className="text-right">Status Settlement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RECENT_TRANSACTIONS.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-[11px] text-[#737887]">
                        {tx.id}
                        <div className="text-[10px] text-[#737887]">{tx.date}</div>
                      </TableCell>

                      <TableCell>
                        <div className="font-semibold text-xs text-[#171923]">{tx.game}</div>
                        <div className="text-[11px] text-[#737887]">{tx.studio}</div>
                      </TableCell>

                      <TableCell className="font-semibold text-xs text-[#171923]">
                        Rp {tx.gross.toLocaleString('id-ID')}
                      </TableCell>

                      <TableCell className="text-xs font-bold text-[#2373FB]">
                        +Rp {tx.fee2Pct.toLocaleString('id-ID')}
                      </TableCell>

                      <TableCell className="text-xs font-bold text-emerald-600">
                        Rp {tx.net98Pct.toLocaleString('id-ID')}
                      </TableCell>

                      <TableCell className="text-right">
                        <Badge variant="success" size="sm">
                          Otomatis Teralokasi
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
