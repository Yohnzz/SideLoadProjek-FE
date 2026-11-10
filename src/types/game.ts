export type PlatformType = 'WIN' | 'WEB' | 'APK'

export interface SystemSpecs {
  os: string
  processor: string
  memory: string
  graphics: string
  storage: string
}

export interface Review {
  id: string
  game_id: string
  author: string
  rating: number
  date: string
  verified_purchase: boolean
  playtime_hours: number
  helpful_count: number
  content: string
}

// Model data yang disiapkan sesuai struktur tabel PostgreSQL Supabase ('games')
export interface Game {
  id: string
  slug: string
  title: string
  developer: string
  developer_id?: string
  genre: string
  platforms: PlatformType[]
  price: number // 0 untuk game gratis
  rating: number
  review_count: number
  cover_url: string
  screenshots: string[]
  release_date: string
  file_size: string
  languages: string[]
  drm_free: boolean
  short_description: string
  description: string
  features: string[]
  system_requirements?: {
    minimum: SystemSpecs
    recommended: SystemSpecs
  }
  changelog?: {
    version: string
    date: string
    notes: string[]
  }[]
  version: string
  badge?: string // misal: 'Versi Baru Tersedia'
  download_url?: string
  status?: 'published' | 'pending' | 'revision' | 'rejected' | 'pending_review' | 'revision_needed' | 'draft' | 'taken_down'
}

// Rekening Bank Developer
export interface BankAccount {
  bankName: string
  accountNumber: string
  accountHolder: string
  isVerified: boolean
}

// Tipe Role Pengguna
export type UserRole = 'guest' | 'user' | 'developer' | 'admin'
export type DevApprovalStatus = 'none' | 'pending' | 'approved' | 'rejected'

// Profil Pengguna SideLoad
export interface UserProfile {
  id: string
  email: string
  username: string
  role: UserRole
  devStatus: DevApprovalStatus
  studioName?: string
  portfolioUrl?: string
  description?: string
  bankAccount?: BankAccount
}

// Data Pengajuan Developer untuk Admin
export interface DeveloperApplication {
  id: string
  userId: string
  username: string
  studioName: string
  portfolioUrl: string
  email: string
  description: string
  bankAccount?: BankAccount
  submittedAt: string
  status: DevApprovalStatus
  rejectionReason?: string
}
