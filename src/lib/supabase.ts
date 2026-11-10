import { createClient } from '@supabase/supabase-js'

const envUrl = import.meta.env.VITE_SUPABASE_URL || ''
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Pengecekan apakah kredensial asli Supabase sudah diisi di .env
export const isSupabaseConfigured = Boolean(
  envUrl &&
  envKey &&
  !envUrl.includes('placeholder') &&
  !envUrl.includes('your-project') &&
  envKey !== 'your-anon-key'
)

// Gunakan URL aktif atau fallback aman agar build tidak melempar error saat belum dikonfigurasi
export const supabaseUrl = isSupabaseConfigured ? envUrl : 'https://sideload-placeholder.supabase.co'
export const supabaseAnonKey = isSupabaseConfigured ? envKey : 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
