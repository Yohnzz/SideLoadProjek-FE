import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, RotateCcw, Sparkles } from 'lucide-react';
import { Select, Badge, Button, Pagination } from '../components/ui';
import { GameCard } from '../components/GameCard';
import type { Game, PlatformType } from '../types/game';

interface ExplorePageProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
  initialQuery?: string;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  games,
  onSelectGame,
  initialQuery = '',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'rating' | 'price-asc' | 'price-desc'>('popular');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Kategori unik dari data game
  const categories = useMemo(() => {
    const list = Array.from(new Set(games.map((g) => g.genre))).filter(Boolean);
    return ['all', ...list];
  }, [games]);

  // Filter dan sorting
  const filteredGames = useMemo(() => {
    return games
      .filter((game) => {
        // Filter Kata Kunci
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchTitle = game.title.toLowerCase().includes(q);
          const matchDev = game.developer.toLowerCase().includes(q);
          const matchGenre = game.genre.toLowerCase().includes(q);
          const matchDesc = (game.short_description || game.description || '').toLowerCase().includes(q);
          if (!matchTitle && !matchDev && !matchGenre && !matchDesc) return false;
        }

        // Filter Kategori
        if (selectedCategory !== 'all' && game.genre !== selectedCategory) {
          return false;
        }

        // Filter Harga
        if (priceFilter === 'free' && game.price > 0) return false;
        if (priceFilter === 'paid' && game.price === 0) return false;

        // Filter Platform
        if (platformFilter !== 'all') {
          if (!game.platforms.includes(platformFilter as PlatformType)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.release_date || 0).getTime() - new Date(a.release_date || 0).getTime();
        }
        if (sortBy === 'popular') {
          return (b.review_count || 0) - (a.review_count || 0);
        }
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === 'price-asc') {
          return a.price - b.price;
        }
        if (sortBy === 'price-desc') {
          return b.price - a.price;
        }
        return 0;
      });
  }, [games, searchQuery, selectedCategory, priceFilter, platformFilter, sortBy]);

  // Pagination kalkulasi
  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
  const paginatedGames = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredGames.slice(start, start + itemsPerPage);
  }, [filteredGames, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceFilter('all');
    setPlatformFilter('all');
    setSortBy('popular');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    priceFilter !== 'all' ||
    platformFilter !== 'all';

  return (
    <div className="space-y-8">
      {/* Header Halaman Jelajah */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#171923]">
              Jelajah Game & Aplikasi Indie
            </h1>
            <Badge variant="primary" size="sm">
              {filteredGames.length} Karya
            </Badge>
          </div>
          <p className="text-xs text-[#737887] mt-1">
            Temukan game karya kreator lokal Indonesia. Mainkan instan via WebGL atau unduh executable langsung.
          </p>
        </div>

        {/* Input Pencarian Internal */}
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-[#737887] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Ketik judul, genre, atau studio..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-9 bg-white text-xs text-[#171923] placeholder:text-[#737887] pl-9.5 pr-3.5 rounded-[10px] border border-[#E5E7EB] hover:border-[#D1D5DB] focus:border-[#2373FB] focus:ring-2 focus:ring-[#2373FB]/20 transition outline-none shadow-xs"
          />
        </div>
      </div>

      {/* Bar Filter & Pengurutan */}
      <div className="bg-white rounded-[14px] border border-[#E5E7EB] p-4 shadow-xs space-y-4">
        {/* Baris Kategori Pill Tab */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs select-none">
          <span className="text-[#737887] font-semibold text-[11px] shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Kategori:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-[8px] font-medium transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#2373FB] text-white shadow-xs'
                  : 'bg-[#F0F1F5] text-[#737887] hover:text-[#171923] hover:bg-[#E4E6EB]'
              }`}
            >
              {cat === 'all' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>

        {/* Baris Filter Platform, Harga & Urutan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-[#E5E7EB]">
          {/* Filter Platform */}
          <div>
            <label className="text-[11px] font-semibold text-[#737887] block mb-1">Platform</label>
            <Select
              value={platformFilter}
              onChange={(e) => {
                setPlatformFilter(e.target.value);
                setCurrentPage(1);
              }}
              options={[
                { value: 'all', label: 'Semua Platform' },
                { value: 'WEB', label: 'WebGL (Browser Play)' },
                { value: 'WIN', label: 'Windows PC (x86_64)' },
                { value: 'APK', label: 'Android Mobile (APK)' },
              ]}
            />
          </div>

          {/* Filter Skema Harga */}
          <div>
            <label className="text-[11px] font-semibold text-[#737887] block mb-1">Skema Akses</label>
            <Select
              value={priceFilter}
              onChange={(e) => {
                setPriceFilter(e.target.value as 'all' | 'free' | 'paid');
                setCurrentPage(1);
              }}
              options={[
                { value: 'all', label: 'Semua Harga' },
                { value: 'free', label: 'Hanya Gratis' },
                { value: 'paid', label: 'Berbayar / Premium' },
              ]}
            />
          </div>

          {/* Urutkan */}
          <div>
            <label className="text-[11px] font-semibold text-[#737887] block mb-1">Urutkan Berdasarkan</label>
            <Select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as any);
                setCurrentPage(1);
              }}
              options={[
                { value: 'popular', label: 'Terpopuler (Review Terbanyak)' },
                { value: 'newest', label: 'Rilisan Terbaru' },
                { value: 'rating', label: 'Rating Tertinggi' },
                { value: 'price-asc', label: 'Harga: Termurah' },
                { value: 'price-desc', label: 'Harga: Tertinggi' },
              ]}
            />
          </div>

          {/* Tombol Reset Filter */}
          <div className="flex items-end">
            {hasActiveFilters ? (
              <Button
                variant="outline"
                size="md"
                onClick={handleResetFilters}
                leftIcon={<RotateCcw className="w-3.5 h-3.5 text-[#DC2626]" />}
                className="w-full text-xs text-[#DC2626] border-[#FECACA] hover:bg-[#FEE2E2]/30"
              >
                Reset Semua Filter
              </Button>
            ) : (
              <div className="w-full h-10 flex items-center justify-center text-xs text-[#737887] bg-[#F7F8FA] rounded-[10px] border border-[#E5E7EB]">
                <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
                <span>Filter Standar</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid Hasil Karya */}
      {filteredGames.length === 0 ? (
        <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-12 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#F0F1F5] flex items-center justify-center text-[#737887] mx-auto">
            <Sparkles className="w-7 h-7 text-[#6A3DFB]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#171923]">Tidak ada produk yang sesuai filter</h3>
            <p className="text-xs text-[#737887] max-w-md mx-auto leading-relaxed">
              Kombinasi kata kunci "{searchQuery}" atau filter platform yang dipilih tidak menghasilkan game. Coba ubah atau bersihkan kriteria pencarian Anda.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={handleResetFilters}>
            Tampilkan Semua Game
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {paginatedGames.map((game) => (
              <GameCard key={game.id} game={game} onSelect={onSelectGame} />
            ))}
          </div>

          {/* Navigasi Pagination */}
          {totalPages > 1 && (
            <div className="pt-4 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

