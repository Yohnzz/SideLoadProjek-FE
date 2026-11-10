import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { UserProfile } from '../types/game'

export const authService = {
  // Ambil user saat ini beserta data profil lengkap dari database Supabase
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    if (!isSupabaseConfigured) {
      return null
    }

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !session?.user) {
        return null
      }

      const user = session.user

      // Ambil data profil dari tabel public.profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError || !profile) {
        return {
          id: user.id,
          email: user.email || '',
          username: user.user_metadata?.username || user.email?.split('@')[0] || 'pengguna',
          role: 'user',
          devStatus: 'none',
        }
      }

      // Ambil profil studio developer jika ada
      let studioName: string | undefined
      let bankAccount = undefined

      if (profile.role === 'developer' || profile.dev_status === 'pending') {
        const { data: devProfile } = await supabase
          .from('developer_profiles')
          .select('id, studio_name, portfolio_url, description')
          .eq('user_id', user.id)
          .single()

        if (devProfile) {
          studioName = devProfile.studio_name

          // Ambil rekening bank
          const { data: bank } = await supabase
            .from('developer_bank_accounts')
            .select('bank_name, account_number, account_holder, is_verified')
            .eq('developer_id', devProfile.id)
            .single()

          if (bank) {
            bankAccount = {
              bankName: bank.bank_name,
              accountNumber: bank.account_number,
              accountHolder: bank.account_holder,
              isVerified: bank.is_verified,
            }
          }
        }
      }

      return {
        id: profile.id,
        email: profile.email,
        username: profile.username,
        role: profile.role,
        devStatus: profile.dev_status,
        studioName,
        bankAccount,
      }
    } catch (err) {
      console.error('Error saat mengambil profil pengguna:', err)
      return null
    }
  },

  // Masuk dengan Email & Password
  async signInWithEmail(emailOrUsername: string, password: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase belum dikonfigurasi di berkas .env')
    }

    // Jika input berupa username tanpa @, cari emailnya di tabel profiles
    let targetEmail = emailOrUsername
    if (!emailOrUsername.includes('@')) {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', emailOrUsername)
        .single()

      if (userProfile?.email) {
        targetEmail = userProfile.email
      }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: targetEmail,
      password,
    })

    if (error) throw error
    return data
  },

  // Daftar Akun Baru
  async signUp(email: string, password: string, username: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase belum dikonfigurasi di berkas .env')
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    })

    if (error) throw error
    return data
  },

  // Masuk dengan OAuth (Google / GitHub)
  async signInWithOAuth(provider: 'google' | 'github') {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase belum dikonfigurasi di berkas .env')
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    })

    if (error) throw error
    return data
  },

  // Keluar Akun
  async signOut() {
    if (!isSupabaseConfigured) return
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Pasang Listener Perubahan Autentikasi
  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!isSupabaseConfigured) {
      return { data: { subscription: { unsubscribe: () => {} } } }
    }
    return supabase.auth.onAuthStateChange(callback)
  },
}
