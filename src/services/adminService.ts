import { supabase, isSupabaseConfigured } from '../lib/supabase'

export interface AdminGameQueueItem {
  id: string
  code: string
  type: string
  timeAgo: string
  title: string
  developer: string
  version: string
  category: string
  platform: string
  dateSubmitted: string
  fileName: string
  fileSize: string
  sha256: string
  status: string
  curatorFeedback?: string
}

export interface AdminDevApplicationItem {
  id: string
  userId: string
  studioName: string
  applicantName: string
  email: string
  portfolioUrl: string
  timeAgo: string
  dateSubmitted: string
  focus: string
  bankName: string
  accountNumber: string
  accountHolder: string
}

export const adminService = {
  // Ambil Antrian Game yang Perlu Ditinjau
  async getPendingGames(): Promise<AdminGameQueueItem[]> {
    if (!isSupabaseConfigured) {
      return []
    }

    try {
      const { data, error } = await supabase
        .from('games')
        .select(`
          id,
          title,
          genre,
          platforms,
          version,
          file_size,
          sha256_hash,
          created_at,
          status,
          curator_feedback,
          profiles:developer_id (full_name, username)
        `)
        .in('status', ['pending_review', 'revision_needed'])
        .order('created_at', { ascending: true })

      if (error || !data) {
        console.error('Error getPendingGames:', error)
        return []
      }

      return data.map((item: any, idx: number) => {
        const devName = item.profiles?.full_name || item.profiles?.username || 'Developer Studio'
        const platformsStr = (item.platforms || ['WIN']).join(' / ').toUpperCase()
        const createdAt = new Date(item.created_at)

        return {
          id: item.id,
          code: `PRD-${createdAt.getFullYear()}-${String(idx + 1).padStart(4, '0')}`,
          type: item.status === 'revision_needed' ? 'REVISI DRAF' : 'GAME BARU',
          timeAgo: 'Baru saja',
          title: item.title,
          developer: devName,
          version: item.version || 'v1.0.0',
          category: item.genre,
          platform: platformsStr,
          dateSubmitted: createdAt.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }) + ' WIB',
          fileName: `${item.title.replace(/\s+/g, '_')}_${item.version || 'v1.0.0'}.zip`,
          fileSize: `${item.file_size || '250 MB'} • Standalone`,
          sha256: item.sha256_hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          status: item.status,
          curatorFeedback: item.curator_feedback,
        }
      })
    } catch (err) {
      console.error('Error getPendingGames:', err)
      return []
    }
  },

  // Eksekusi Keputusan Kurasi Game (Setujui / Revisi / Tolak)
  async reviewGame(
    gameId: string,
    action: 'approve' | 'revision' | 'reject',
    feedbackNote?: string
  ): Promise<boolean> {
    if (!isSupabaseConfigured) {
      return true
    }

    try {
      let updatePayload: Record<string, any> = {}

      if (action === 'approve') {
        const todayStr = new Date().toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
        updatePayload = {
          status: 'published',
          release_date: todayStr,
          curator_feedback: null,
          updated_at: new Date().toISOString(),
        }
      } else if (action === 'revision') {
        updatePayload = {
          status: 'revision_needed',
          curator_feedback: feedbackNote || 'Perlu perbaikan berkas dan kelengkapan lisensi.',
          updated_at: new Date().toISOString(),
        }
      } else {
        updatePayload = {
          status: 'rejected',
          curator_feedback: feedbackNote || 'Karya tidak memenuhi kriteria etalase SideLoad.',
          updated_at: new Date().toISOString(),
        }
      }

      const { error } = await supabase
        .from('games')
        .update(updatePayload)
        .eq('id', gameId)

      if (error) {
        console.error('Error reviewGame:', error)
        return false
      }

      return true
    } catch (err) {
      console.error('Error reviewGame:', err)
      return false
    }
  },

  // Ambil Antrian Pengajuan Akun Developer
  async getPendingDevelopers(): Promise<AdminDevApplicationItem[]> {
    if (!isSupabaseConfigured) {
      return []
    }

    try {
      const { data, error } = await supabase
        .from('developer_profiles')
        .select(`
          id,
          user_id,
          studio_name,
          contact_email,
          portfolio_url,
          description,
          applied_at,
          profiles:user_id (username, full_name, email),
          developer_bank_accounts (bank_name, account_number, account_holder)
        `)
        .eq('status', 'pending')
        .order('applied_at', { ascending: true })

      if (error || !data) {
        console.error('Error getPendingDevelopers:', error)
        return []
      }

      return data.map((item: any) => {
        const userObj = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
        const bankObj = Array.isArray(item.developer_bank_accounts)
          ? item.developer_bank_accounts[0]
          : item.developer_bank_accounts

        const appliedAt = new Date(item.applied_at)

        return {
          id: item.id,
          userId: item.user_id,
          studioName: item.studio_name,
          applicantName: userObj?.full_name || userObj?.username || 'Pemohon Developer',
          email: item.contact_email || userObj?.email || '',
          portfolioUrl: item.portfolio_url,
          timeAgo: 'Baru diajukan',
          dateSubmitted: appliedAt.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }) + ' WIB',
          focus: item.description,
          bankName: bankObj?.bank_name || 'Belum diatur',
          accountNumber: bankObj?.account_number || 'Belum diatur',
          accountHolder: bankObj?.account_holder || (userObj?.full_name || 'Studio Terkait'),
        }
      })
    } catch (err) {
      console.error('Error getPendingDevelopers:', err)
      return []
    }
  },

  // Eksekusi Keputusan Persetujuan Akun Developer
  async reviewDeveloper(
    devProfileId: string,
    userId: string,
    action: 'approve' | 'reject',
    adminNotes?: string
  ): Promise<boolean> {
    if (!isSupabaseConfigured) {
      return true
    }

    try {
      const nowIso = new Date().toISOString()

      if (action === 'approve') {
        // 1. Perbarui developer_profiles ke status approved
        const { error: devError } = await supabase
          .from('developer_profiles')
          .update({
            status: 'approved',
            admin_notes: null,
            reviewed_at: nowIso,
          })
          .eq('id', devProfileId)

        if (devError) throw devError

        // 2. Perbarui profil user menjadi role developer dan dev_status approved
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            role: 'developer',
            dev_status: 'approved',
            updated_at: nowIso,
          })
          .eq('id', userId)

        if (profileError) throw profileError
      } else {
        // Penolakan akun developer
        const { error: devError } = await supabase
          .from('developer_profiles')
          .update({
            status: 'rejected',
            admin_notes: adminNotes || 'Pengajuan belum memenuhi persyaratan kurasi developer.',
            reviewed_at: nowIso,
          })
          .eq('id', devProfileId)

        if (devError) throw devError

        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            dev_status: 'rejected',
            updated_at: nowIso,
          })
          .eq('id', userId)

        if (profileError) throw profileError
      }

      return true
    } catch (err) {
      console.error('Error reviewDeveloper:', err)
      return false
    }
  },
}
