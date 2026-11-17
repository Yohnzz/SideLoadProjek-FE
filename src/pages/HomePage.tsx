import React from 'react';
import { ArrowRight, ChevronRight, Play, ShoppingBag, Sparkles, Trophy, Flame } from 'lucide-react';
import { Button, Badge, Skeleton, Card } from '../components/ui';
import { GameCard, GameCardSkeleton } from '../components/GameCard';
import type { Game } from '../types/game';

interface HomePageProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
  searchQuery: string;
  onOpenJoinDeveloper?: () => void;
  onNavigateToExplore?: () => void;
  isLoading?: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  games,
  onSelectGame,
  searchQuery,
  onOpenJoinDeveloper,
  onNavigateToExplore,
  isLoading = false,
}) => {
  // Pilihan kurator utama (Kala: Warisan Kabut atau game pertama)
  const featuredGame = games.find((g) => g.slug === 'kala-warisan-kabut') || games[0];

  // Filter pencarian jika ada kata kunci di header
  const searchResults = games.filter(
    (g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.developer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Rak: Paling Banyak Dimainkan
  const mostPlayed = games.filter((g) =>
    ['kopi-malam-kisah-sudut-kota', 'layar-pinisi-ekspedisi-samudra', 'memori-kaset-pita', 'candi-runtuh-labirin-kuno'].includes(
      g.slug
    )
  );
  const displayMostPlayed = mostPlayed.length > 0 ? mostPlayed : games.slice(1, 5);

  // Rak: Rilisan Terbaru
  const newReleases = games.filter((g) =>
    ['bayang-lakon-dalang', 'subak-siklus-air-padi', 'kereta-parahyangan-1994', 'bintang-sumba-peta-langit'].includes(
      g.slug
    )
  );
  const displayNewReleases = newReleases.length > 0 ? newReleases : games.slice(4, 8);

  // Jika sedang mencari di search bar
  if (searchQuery.trim() !== '') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <div>
            <h1 className="text-xl font-bold text-[#171923] tracking-tight">
              Hasil Pencarian: "{searchQuery}"
            </h1>
            <p className="text-xs text-[#737887] mt-0.5">
              Ditemukan {searchResults.length} produk game & aplikasi indie
            </p>
          </div>
        </div>

        {searchResults.length === 0 ? (
          <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#F0F1F5] flex items-center justify-center text-[#737887] mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-[#171923]">Tidak ada produk yang cocok</h3>
            <p className="text-xs text-[#737887] max-w-sm mx-auto">
              Coba cari dengan kata kunci lain, nama developer, atau genre game seperti RPG, Simulasi, atau Petualangan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {searchResults.map((game) => (
              <GameCard key={game.id} game={game} onSelect={onSelectGame} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Loading skeleton state
  if (isLoading || (!featuredGame && games.length === 0)) {
    return (
      <div className="space-y-12">
        {/* Hero skeleton */}
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <Skeleton className="lg:col-span-7 aspect-16/9 rounded-[12px]" />
          <div className="lg:col-span-5 space-y-4">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-16 w-full" />
            <div className="pt-4 border-t border-[#E5E7EB] space-y-3">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-full rounded-[10px]" />
            </div>
          </div>
        </div>

        {/* Grids skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <GameCardSkeleton key={`skeleton-${i}`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* 1. Hero: Pilihan Kurator Besar */}
      {featuredGame && (
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Badge variant="primary" dot size="sm">
                Pilihan Kurator Minggu Ini
              </Badge>
              <span className="text-[11px] text-[#737887] hidden sm:inline">
                Karya indie pilihan terbaik nusantara
              </span>
            </div>
            <span className="text-[11px] font-semibold text-[#737887]">
              Edisi 01
            </span>
          </div>

          <Card
            hoverable
            onClick={() => onSelectGame(featuredGame)}
            className="p-4 sm:p-6 lg:p-7 border border-[#E5E7EB] bg-white shadow-xs group"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* Cover Besar (16:9) */}
              <div className="lg:col-span-7 aspect-16/9 rounded-[12px] overflow-hidden bg-[#F0F1F5] relative group-hover:shadow-sm transition-all duration-300">
                <img
                  src={featuredGame.cover_url}
                  alt={featuredGame.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-102"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4 sm:p-5">
                  <div className="flex items-center gap-2">
                    {featuredGame.platforms.includes('WEB') && (
                      <span className="px-2.5 py-1 rounded-[6px] bg-[#6A3DFB] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 backdrop-blur-xs">
                        <Play className="w-3 h-3 fill-current" />
                        <span>Dapat Dimainkan di Browser</span>
                      </span>
                    )}
                    {featuredGame.platforms.includes('WIN') && (
                      <span className="px-2.5 py-1 rounded-[6px] bg-black/60 text-white text-xs font-medium backdrop-blur-xs">
                        Windows PC
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Informasi Kurasi & Detail */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-[#737887]">
                      {featuredGame.developer}
                    </span>
                    <span className="text-[#D1D5DB]">•</span>
                    <span className="text-xs text-[#737887]">
                      {featuredGame.genre}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171923] tracking-tight group-hover:text-[#2373FB] transition-colors">
                    {featuredGame.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#737887] leading-relaxed line-clamp-4">
                    {featuredGame.short_description || featuredGame.description}
                  </p>
                </div>

                {/* Harga & CTA Utama */}
                <div className="pt-4 border-t border-[#E5E7EB] space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#737887] font-medium">Harga Akses</span>
                    <span className="text-lg font-bold text-[#171923]">
                      {featuredGame.price === 0
                        ? 'Gratis'
                        : `Rp ${featuredGame.price.toLocaleString('id-ID')}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {featuredGame.platforms.includes('WEB') && (
                      <Button
                        variant="primary"
                        size="md"
                        leftIcon={<Play className="w-4 h-4 fill-current" />}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectGame(featuredGame);
                        }}
                      >
                        Mainkan Sekarang
                      </Button>
                    )}
                    <Button
                      variant={featuredGame.platforms.includes('WEB') ? 'outline' : 'primary'}
                      size="md"
                      leftIcon={<ShoppingBag className="w-4 h-4" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectGame(featuredGame);
                      }}
                    >
                      {featuredGame.price === 0 ? 'Unduh Gratis' : 'Beli Game'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* 2. Rak: Paling Banyak Dimainkan */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#2373FB]" />
            <h2 className="text-lg font-bold tracking-tight text-[#171923]">
              Paling Banyak Dimainkan
            </h2>
          </div>
          {onNavigateToExplore && (
            <button
              onClick={onNavigateToExplore}
              className="text-xs font-semibold text-[#2373FB] hover:text-[#1D5FD0] flex items-center gap-1 transition-colors"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {displayMostPlayed.map((game) => (
            <GameCard key={game.id} game={game} onSelect={onSelectGame} />
          ))}
        </div>
      </section>

      {/* 3. Rak: Rilisan Terbaru Indie */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#6A3DFB]" />
            <h2 className="text-lg font-bold tracking-tight text-[#171923]">
              Rilisan Terbaru Indie
            </h2>
          </div>
          {onNavigateToExplore && (
            <button
              onClick={onNavigateToExplore}
              className="text-xs font-semibold text-[#2373FB] hover:text-[#1D5FD0] flex items-center gap-1 transition-colors"
            >
              <span>Lihat Katalog</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {displayNewReleases.map((game) => (
            <GameCard key={game.id} game={game} onSelect={onSelectGame} />
          ))}
        </div>
      </section>

      {/* 4. Banner Ajakan "Jadi Developer" */}
      <section className="bg-white rounded-[16px] border border-[#E5E7EB] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F3E8FF] text-[#6A3DFB] text-[11px] font-semibold">
            <Sparkles className="w-3 h-3" />
            <span>Program Kreator SideLoad</span>
          </div>
          <h3 className="text-lg font-bold text-[#171923] tracking-tight">
            Publikasikan Karya Game & Aplikasi Kamu di SideLoad
          </h3>
          <p className="text-xs text-[#737887] leading-relaxed">
            Dapatkan akses langsung ke ribuan pemain Indonesia. Skema bagi hasil transparan: 98% pendapatan untuk developer, 2% biaya pemeliharaan platform, tanpa biaya tersembunyi.
          </p>
        </div>

        {onOpenJoinDeveloper && (
          <Button
            variant="primary"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={onOpenJoinDeveloper}
            className="shrink-0"
          >
            Daftar Jadi Developer
          </Button>
        )}
      </section>
    </div>
  );
};
