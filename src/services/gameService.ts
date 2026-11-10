import { supabase, isSupabaseConfigured } from '../lib/supabase'
import type { Game, Review } from '../types/game'
import { DUMMY_GAMES, DUMMY_REVIEWS } from '../data/dummyGames'

export const gameService = {
  // Ambil semua game yang sudah terbit di etalase publik
  async getPublishedGames(): Promise<Game[]> {
    if (!isSupabaseConfigured) {
      return DUMMY_GAMES
    }

    try {
      const { data, error } = await supabase
        .from('games')
        .select(`
          *,
          game_specifications(*),
          game_changelogs(*)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (error || !data || data.length === 0) {
        return DUMMY_GAMES
      }

      return data.map((item: any) => this.mapDbGameToGame(item))
    } catch (err) {
      console.error('Error saat mengambil data game dari Supabase:', err)
      return DUMMY_GAMES
    }
  },

  // Ambil satu game berdasarkan slug
  async getGameBySlug(slug: string): Promise<Game | null> {
    if (!isSupabaseConfigured) {
      return DUMMY_GAMES.find(g => g.slug === slug) || null
    }

    try {
      const { data, error } = await supabase
        .from('games')
        .select(`
          *,
          game_specifications(*),
          game_changelogs(*)
        `)
        .eq('slug', slug)
        .single()

      if (error || !data) {
        return DUMMY_GAMES.find(g => g.slug === slug) || null
      }

      return this.mapDbGameToGame(data)
    } catch (err) {
      console.error('Error saat mengambil detail game:', err)
      return DUMMY_GAMES.find(g => g.slug === slug) || null
    }
  },

  // Ambil ulasan untuk game tertentu
  async getGameReviews(gameId: string, slug?: string): Promise<Review[]> {
    if (!isSupabaseConfigured) {
      return slug ? (DUMMY_REVIEWS[slug] || []) : []
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          game_id,
          rating,
          playtime_hours,
          content,
          helpful_count,
          verified_purchase,
          created_at,
          profiles (username, full_name)
        `)
        .eq('game_id', gameId)
        .order('created_at', { ascending: false })

      if (error || !data || data.length === 0) {
        return slug ? (DUMMY_REVIEWS[slug] || []) : []
      }

      return data.map((r: any) => ({
        id: r.id,
        game_id: r.game_id,
        author: r.profiles?.full_name || r.profiles?.username || 'Pemain Terverifikasi',
        rating: Number(r.rating),
        date: new Date(r.created_at).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        verified_purchase: r.verified_purchase,
        playtime_hours: Number(r.playtime_hours),
        helpful_count: r.helpful_count,
        content: r.content,
      }))
    } catch (err) {
      console.error('Error saat mengambil ulasan:', err)
      return slug ? (DUMMY_REVIEWS[slug] || []) : []
    }
  },

  // Ambil Pustaka Game yang dimiliki oleh pengguna tertentu
  async getUserLibrary(userId: string): Promise<Game[]> {
    if (!isSupabaseConfigured || !userId) {
      return DUMMY_GAMES.filter(g => 
        ['kala-warisan-kabut', 'kopi-malam-kisah-sudut-kota', 'memori-kaset-pita', 'bayang-lakon-dalang'].includes(g.slug)
      )
    }

    try {
      const { data, error } = await supabase
        .from('user_library')
        .select(`
          acquired_at,
          games (
            *,
            game_specifications(*),
            game_changelogs(*)
          )
        `)
        .eq('user_id', userId)
        .order('acquired_at', { ascending: false })

      if (error || !data || data.length === 0) {
        return []
      }

      return data
        .filter((row: any) => row.games)
        .map((row: any) => this.mapDbGameToGame(row.games))
    } catch (err) {
      console.error('Error saat mengambil pustaka pengguna:', err)
      return []
    }
  },

  // Tambahkan game gratis langsung ke Pustaka pengguna
  async claimFreeGame(userId: string, gameId: string): Promise<boolean> {
    if (!isSupabaseConfigured) return true

    try {
      const { error } = await supabase
        .from('user_library')
        .insert({
          user_id: userId,
          game_id: gameId,
          order_id: null,
        })

      if (error && error.code !== '23505') {
        throw error
      }
      return true
    } catch (err) {
      console.error('Error saat klaim game gratis:', err)
      return false
    }
  },

  // Catat transaksi pembelian game berbayar & masukkan ke Pustaka pengguna
  async recordOrder(params: {
    userId: string
    gameId: string
    developerId?: string
    amount: number
    paymentMethod?: string
  }): Promise<{ success: boolean; orderNumber?: string }> {
    if (!isSupabaseConfigured) {
      return { success: true, orderNumber: `INV-SL-${Date.now().toString().slice(-6)}` }
    }

    try {
      const orderNumber = `INV-SL-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`
      const platformCommission = Math.round(params.amount * 0.1)
      const developerEarning = params.amount - platformCommission

      // 1. Simpan pesanan ke tabel orders
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: params.userId,
          game_id: params.gameId,
          developer_id: params.developerId || params.userId,
          amount: params.amount,
          platform_commission: platformCommission,
          developer_earning: developerEarning,
          payment_method: params.paymentMethod || 'qris',
          status: 'settlement',
        })
        .select()
        .single()

      if (orderError) {
        console.error('Error saat membuat pesanan:', orderError)
      }

      // 2. Masukkan game ke user_library
      const { error: libError } = await supabase
        .from('user_library')
        .insert({
          user_id: params.userId,
          game_id: params.gameId,
          order_id: order?.id || null,
        })

      if (libError && libError.code !== '23505') {
        console.error('Error saat menambahkan ke user_library:', libError)
      }

      return { success: true, orderNumber }
    } catch (err) {
      console.error('Error recordOrder:', err)
      return { success: false }
    }
  },

  // Pengajuan Game / Rilis Baru oleh Developer
  async submitNewGame(gameData: {
    developerId: string
    title: string
    genre: string
    platforms: string[]
    price: number
    shortDescription: string
    description: string
    coverUrl: string
    screenshots: string[]
    version: string
    fileSize: string
    ratingCategory: string
    sha256Hash?: string
  }): Promise<{ success: boolean; gameId?: string; error?: string }> {
    if (!isSupabaseConfigured) {
      return { success: true }
    }

    try {
      const slug = gameData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000)

      const { data: newGame, error } = await supabase
        .from('games')
        .insert({
          slug,
          developer_id: gameData.developerId,
          title: gameData.title,
          genre: gameData.genre,
          platforms: gameData.platforms,
          price: gameData.price,
          short_description: gameData.shortDescription,
          description: gameData.description,
          cover_url: gameData.coverUrl,
          screenshots: gameData.screenshots,
          version: gameData.version,
          file_size: gameData.fileSize,
          rating_category: gameData.ratingCategory,
          sha256_hash: gameData.sha256Hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          status: 'pending_review',
        })
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      // Buat spesifikasi default
      await supabase.from('game_specifications').insert({
        game_id: newGame.id,
        features: ['Eksplorasi Murni', 'Dukungan Controller'],
      })

      return { success: true, gameId: newGame.id }
    } catch (err: any) {
      console.error('Error saat mengajukan rilis game baru:', err)
      return { success: false, error: err.message || 'Gagal menyimpan karya ke database' }
    }
  },

  // Helper untuk memetakan kolom database Supabase ke tipe Game
  mapDbGameToGame(dbItem: any): Game {
    const specs = Array.isArray(dbItem.game_specifications) 
      ? dbItem.game_specifications[0] 
      : dbItem.game_specifications

    return {
      id: dbItem.id,
      slug: dbItem.slug,
      title: dbItem.title,
      developer: dbItem.developer_id || 'Developer Indie',
      developer_id: dbItem.developer_id,
      genre: dbItem.genre,
      platforms: dbItem.platforms || ['WIN'],
      price: Number(dbItem.price) || 0,
      rating: Number(dbItem.avg_rating) || 5.0,
      review_count: dbItem.review_count || 0,
      cover_url: dbItem.cover_url || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900&auto=format&fit=crop',
      screenshots: dbItem.screenshots || [dbItem.cover_url],
      release_date: dbItem.release_date || 'Terbaru',
      file_size: dbItem.file_size || '1.0 GB',
      languages: dbItem.languages || ['Indonesia'],
      drm_free: dbItem.drm_free ?? true,
      short_description: dbItem.short_description || '',
      description: dbItem.description || '',
      features: specs?.features || [
        'Eksplorasi Murni: Lanskap visual Zero HUD.',
        'Dukungan Pengontrol Penuh Gamepad.',
      ],
      system_requirements: specs ? {
        minimum: {
          os: specs.min_os || 'Windows 10 64-bit',
          processor: specs.min_processor || 'Intel Core i3',
          memory: specs.min_memory || '4 GB RAM',
          graphics: specs.min_graphics || 'GeForce GTX 750 Ti',
          storage: specs.min_storage || '2 GB ruang kosong',
        },
        recommended: {
          os: specs.rec_os || 'Windows 11 64-bit',
          processor: specs.rec_processor || 'Intel Core i5',
          memory: specs.rec_memory || '8 GB RAM',
          graphics: specs.rec_graphics || 'NVIDIA GTX 1060',
          storage: specs.rec_storage || '2 GB ruang kosong SSD',
        },
      } : undefined,
      version: dbItem.version || 'v1.0.0',
      badge: dbItem.badge,
      status: dbItem.status,
    }
  },
}
