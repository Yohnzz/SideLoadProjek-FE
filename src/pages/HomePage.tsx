import React from 'react'
import { ShoppingBag, ChevronRight } from 'lucide-react'
import type { Game } from '../types/game'

interface HomePageProps {
  games: Game[]
  onSelectGame: (game: Game) => void
  searchQuery: string
  onOpenJoinDeveloper?: () => void
}

export const HomePage: React.FC<HomePageProps> = ({
  games,
  onSelectGame,
  searchQuery,
  onOpenJoinDeveloper
}) => {
  // Game kurator utama (Kala: Warisan Kabut)
  const featuredGame = games.find(g => g.slug === 'kala-warisan-kabut') || games[0]

  // Filter game jika ada kata kunci pencarian
  const filteredGames = games.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.genre.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Kelompokkan data untuk 2 rak
  const mostPlayed = games.filter(g => 
    ['kopi-malam-kisah-sudut-kota', 'layar-pinisi-ekspedisi-samudra', 'memori-kaset-pita', 'candi-runtuh-labirin-kuno'].includes(g.slug)
  )

  const newReleases = games.filter(g => 
    ['bayang-lakon-dalang', 'subak-siklus-air-padi', 'kereta-parahyangan-1994', 'bintang-sumba-peta-langit'].includes(g.slug)
  )

  if (searchQuery.trim() !== '') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-[#BBBFCA]/40">
          <h1 className="text-xl font-bold text-[#222629]">
            Hasil Pencarian: "{searchQuery}"
          </h1>
          <span className="text-xs text-[#495464]">
            Ditemukan {filteredGames.length} produk
          </span>
        </div>

        {filteredGames.length === 0 ? (
          <div className="bg-[#E8E8E8] rounded-xl p-12 text-center border border-[#BBBFCA]/40">
            <p className="text-sm text-[#495464]">
              Tidak ada game atau aplikasi yang cocok dengan kata kunci "{searchQuery}".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredGames.map(game => (
              <GameCard key={game.id} game={game} onSelect={onSelectGame} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* 1. Sorotan Pilihan Kurator Minggu Ini */}
      <section className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#495464]">
          <span>Pilihan Kurator Minggu Ini</span>
          <span className="font-pixel text-[10px]">Edisi 01</span>
        </div>

        {featuredGame && (
          <div className="bg-[#E8E8E8] rounded-xl border border-[#BBBFCA]/40 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Cover Utama */}
            <div 
              onClick={() => onSelectGame(featuredGame)}
              className="lg:col-span-7 aspect-16/9 rounded-lg overflow-hidden border border-[#BBBFCA]/50 relative group cursor-pointer shadow-xs"
            >
              <img 
                src={featuredGame.cover_url} 
                alt={featuredGame.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                <span className="text-white/90 font-bold text-xs tracking-wider uppercase bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                  Beranda SideLoad
                </span>
              </div>
            </div>

            {/* Info Kurasi */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-[#F4F4F2] text-[#495464] border border-[#BBBFCA]/60 text-[10px] font-pixel font-bold">
                    WIN
                  </span>
                  <span className="text-xs text-[#495464] font-medium">
                    {featuredGame.developer}
                  </span>
                </div>

                <h1 
                  onClick={() => onSelectGame(featuredGame)}
                  className="text-2xl sm:text-3xl font-extrabold text-[#222629] tracking-tight hover:text-[#495464] cursor-pointer transition"
                >
                  {featuredGame.title}
                </h1>

                <p className="text-xs sm:text-sm text-[#495464] leading-relaxed line-clamp-4">
                  {featuredGame.short_description}
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-[#BBBFCA]/40">
                <div className="flex items-center justify-between text-xs text-[#495464]">
                  <span>Harga Resmi</span>
                  <span className="text-base font-bold text-[#222629]">
                    {featuredGame.price === 0 ? 'Gratis' : `Rp${featuredGame.price.toLocaleString('id-ID')}`}
                  </span>
                </div>

                <button
                  onClick={() => onSelectGame(featuredGame)}
                  className="w-full py-2.5 px-4 bg-[#495464] text-[#F4F4F2] text-sm font-semibold rounded-lg hover:bg-[#3d4654] active:scale-[0.99] transition flex items-center justify-center gap-2 shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {featuredGame.price === 0 ? 'Unduh Gratis' : `Beli Rp${featuredGame.price.toLocaleString('id-ID')}`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. Rak: Paling Banyak Dimainkan */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-[#222629]">
            Paling Banyak Dimainkan
          </h2>
          <button 
            onClick={() => {}}
            className="text-xs font-semibold text-[#495464] hover:text-[#222629] flex items-center gap-0.5 transition"
          >
            <span>Lihat semua</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mostPlayed.map(game => (
            <GameCard key={game.id} game={game} onSelect={onSelectGame} />
          ))}
        </div>
      </section>

      {/* 3. Rak: Rilisan Terbaru Indie */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-[#222629]">
            Rilisan Terbaru Indie
          </h2>
          <button 
            onClick={() => {}}
            className="text-xs font-semibold text-[#495464] hover:text-[#222629] flex items-center gap-0.5 transition"
          >
            <span>Lihat katalog</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {newReleases.map(game => (
            <GameCard key={game.id} game={game} onSelect={onSelectGame} />
          ))}
        </div>
      </section>

      {/* 4. Banner Callout Kemitraan Developer */}
      <section className="bg-[#E8E8E8] rounded-xl p-6 border border-[#BBBFCA]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-[#222629]">
            Kembangkan karya game Anda bersama kami?
          </h3>
          <p className="text-xs text-[#495464]">
            Distribusikan langsung ke pemain Indonesia tanpa potongan biaya penerbitan yang memberatkan.
          </p>
        </div>
        <button 
          onClick={onOpenJoinDeveloper}
          className="px-4 py-2 bg-[#F4F4F2] text-[#495464] text-xs font-semibold rounded-lg border border-[#BBBFCA] hover:bg-white hover:text-[#222629] transition shrink-0"
        >
          Pelajari Tata Cara Draf
        </button>
      </section>
    </div>
  )
}

// Sub-komponen Kartu Game Sederhana (Cover, Judul, Platform, Harga)
interface GameCardProps {
  game: Game
  onSelect: (game: Game) => void
}

const GameCard: React.FC<GameCardProps> = ({ game, onSelect }) => {
  return (
    <article
      onClick={() => onSelect(game)}
      className="bg-[#E8E8E8] rounded-xl p-3 border border-[#BBBFCA]/40 hover:border-[#495464] transition group cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Cover 16:9 */}
        <div className="w-full aspect-16/10 rounded-lg overflow-hidden border border-[#BBBFCA]/30 mb-2.5 relative bg-[#222629]">
          <img 
            src={game.cover_url} 
            alt={game.title} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
          />
        </div>

        {/* Judul Game */}
        <h3 className="text-sm font-bold text-[#222629] group-hover:text-[#495464] transition line-clamp-1">
          {game.title}
        </h3>
      </div>

      {/* Baris Platform dan Harga */}
      <div className="mt-3 pt-2 border-t border-[#BBBFCA]/30 flex items-center justify-between text-xs">
        <span className="font-pixel text-[10px] text-[#495464] tracking-tight">
          {game.platforms.join(' • ')}
        </span>
        <span className="font-bold text-[#222629]">
          {game.price === 0 ? 'Gratis' : `Rp${game.price.toLocaleString('id-ID')}`}
        </span>
      </div>
    </article>
  )
}
