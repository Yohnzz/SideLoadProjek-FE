import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { BankAccount, Game } from '../types/game'
import { gameService } from './gameService'

export interface DeveloperApplicationInput {
  userId: string
  studioName: string
  portfolioUrl: string
  contactEmail: string
  description: string
}

export interface DeveloperSaleRecord {
  id: string
  orderNumber: string
  gameTitle: string
  date: string
  grossAmount: number
  platformFee: number
  netEarning: number
  status: string
}

export const developerService = {
  // Pengajuan Akun Developer Baru
  async applyDeveloper(input: DeveloperApplicationInput): Promise<{ success: boolean; error?: string }> {
    if (!isSupabaseConfigured) {
      return { success: true }
    }

    try {
      // 1. Simpan pengajuan ke tabel developer_profiles
      const { error: devError } = await supabase
        .from('developer_profiles')
        .insert({
          user_id: input.userId,
          studio_name: input.studioName,
          contact_email: input.contactEmail,
          portfolio_url: input.portfolioUrl,
          description: input.description,
          status: 'pending',
        })
        .select()
        .single()

      if (devError) {
        console.error('Error insert developer_profiles:', devError)
        return { success: false, error: devError.message }
      }

      // 2. Perbarui dev_status di tabel profiles menjadi pending
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ dev_status: 'pending' })
        .eq('id', input.userId)

      if (profileError) {
        console.error('Error update profile dev_status:', profileError)
      }

      return { success: true }
    } catch (err: any) {
      console.error('Error applyDeveloper:', err)
      return { success: false, error: err.message || 'Gagal mengirim pengajuan developer' }
    }
  },

  // Simpan / Perbarui Rekening Bank Developer
  async saveBankAccount(userId: string, bank: BankAccount): Promise<boolean> {
    if (!isSupabaseConfigured) {
      return true
    }

    try {
      // Cari developer_id berdasarkan user_id
      const { data: devProfile, error: devError } = await supabase
        .from('developer_profiles')
        .select('id')
        .eq('user_id', userId)
        .single()

      if (devError || !devProfile) {
        console.error('Developer profile tidak ditemukan:', devError)
        return false
      }

      // Upsert rekening bank
      const { error: bankError } = await supabase
        .from('developer_bank_accounts')
        .upsert(
          {
            developer_id: devProfile.id,
            bank_name: bank.bankName,
            account_number: bank.accountNumber,
            account_holder: bank.accountHolder,
            is_verified: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'developer_id' }
        )

      if (bankError) {
        console.error('Error simpan rekening bank:', bankError)
        return false
      }

      return true
    } catch (err) {
      console.error('Error saveBankAccount:', err)
      return false
    }
  },

  // Ambil Daftar Game Milik Developer
  async getDeveloperGames(userId: string): Promise<Game[]> {
    if (!isSupabaseConfigured || !userId) {
      return []
    }

    try {
      const { data, error } = await supabase
        .from('games')
        .select(`
          *,
          game_specifications(*),
          game_changelogs(*)
        `)
        .eq('developer_id', userId)
        .order('created_at', { ascending: false })

      if (error || !data) {
        console.error('Error getDeveloperGames:', error)
        return []
      }

      return data.map((item: any) => gameService.mapDbGameToGame(item))
    } catch (err) {
      console.error('Error getDeveloperGames:', err)
      return []
    }
  },

  // Ambil Riwayat Penjualan Studio
  async getDeveloperSales(userId: string): Promise<DeveloperSaleRecord[]> {
    if (!isSupabaseConfigured || !userId) {
      return []
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          amount,
          platform_commission,
          developer_earning,
          status,
          created_at,
          games (title)
        `)
        .eq('developer_id', userId)
        .order('created_at', { ascending: false })

      if (error || !data) {
        return []
      }

      return data.map((item: any) => ({
        id: item.id,
        orderNumber: item.order_number,
        gameTitle: item.games?.title || 'Game Indie',
        date: new Date(item.created_at).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        grossAmount: Number(item.amount),
        platformFee: Number(item.platform_commission),
        netEarning: Number(item.developer_earning),
        status: item.status,
      }))
    } catch (err) {
      console.error('Error getDeveloperSales:', err)
      return []
    }
  },
}
