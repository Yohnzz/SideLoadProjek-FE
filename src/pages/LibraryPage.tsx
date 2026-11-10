import React, { useState } from 'react'
import { Download, Play, ShieldCheck, ArrowUpRight } from 'lucide-react'
import type { Game } from '../types/game'

interface LibraryPageProps {
  ownedGames: Game[]
  onSelectGame: (game: Game) => void
  onExplore: () => void
}

export const LibraryPage: React.FC<LibraryPageProps> = ({
  ownedGames,
  onSelectGame,
  onExplore
}) => {
  const [activeTab, setActiveTab] = useState<'collection' | 'history'>('collection')

  return (
    <div className="space-y-6 pb-12">
      {/* Judul Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#BBBFCA]/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#222629]">
            Pustaka Saya
          </h1>
          <p className="text-xs sm:text-sm text-[#495464]">
            Koleksi game dan aplikasi indie milik Anda yang siap diunduh kapan saja.
          </p>
        </div>
      </div>

      {/* Tab Navigasi Pustaka */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#BBBFCA]/40 pb-1 text-sm font-medium">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('collection')}
            className={`pb-2 transition flex items-center gap-2 ${
              activeTab === 'collection'
                ? 'border-b-2 border-[#495464] text-[#222629] font-bold'
                : 'text-[#495464] hover:text-[#222629]'
            }`}
          >
            <span>Koleksi Game</span>
            <span className="text-xs px-1.5 py-0.2 rounded bg-[#E8E8E8] text-[#495464]">
              {ownedGames.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2 transition flex items-center gap-2 ${
              activeTab === 'history'
                ? 'border-b-2 border-[#495464] text-[#222629] font-bold'
                : 'text-[#495464] hover:text-[#222629]'
            }`}
          >
            <span>Riwayat Transaksi</span>
            <span className="text-xs px-1.5 py-0.2 rounded bg-[#E8E8E8] text-[#495464]">
              {ownedGames.length}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#495464]">
          <ShieldCheck className="w-4 h-4 text-[#495464]" />
          <span>Semua berkas bebas DRM dan terverifikasi aman</span>
        </div>
      </div>

      {/* Isi Tab: Koleksi Game */}
      {activeTab === 'collection' && (
        <>
          {ownedGames.length === 0 ? (
            <div className="bg-[#E8E8E8] rounded-xl p-12 text-center border border-[#BBBFCA]/40 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#BBBFCA]/30 flex items-center justify-center text-[#495464]">
                <Download className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#222629]">Pustaka Masih Kosong</h3>
                <p className="text-xs text-[#495464] max-w-md mx-auto">
                  Anda belum memiliki game atau aplikasi apapun. Jelajahi katalog indie kami untuk menemukan karya kreator Indonesia.
                </p>
              </div>
              <button
                onClick={onExplore}
                className="px-5 py-2.5 bg-[#495464] text-[#F4F4F2] text-xs font-semibold rounded-lg hover:bg-[#3d4654] transition shadow-xs"
              >
                Jelajahi Katalog SideLoad
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ownedGames.map(game => (
                <div
                  key={game.id}
                  className="bg-[#E8E8E8] rounded-xl p-4 border border-[#BBBFCA]/40 hover:border-[#495464] transition flex gap-4 group"
                >
                  {/* Thumbnail Cover */}
                  <div 
                    onClick={() => onSelectGame(game)}
                    className="w-28 sm:w-36 aspect-16/10 rounded-lg overflow-hidden bg-[#222629] shrink-0 cursor-pointer relative"
                  >
                    <img
                      src={game.cover_url}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    {game.badge && (
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#222629]/90 text-[9px] font-pixel text-[#F4F4F2] uppercase border border-white/10">
                        {game.badge}
                      </span>
                    )}
                  </div>

                  {/* Info Game & Tombol Aksi */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 
                          onClick={() => onSelectGame(game)}
                          className="font-bold text-sm text-[#222629] truncate cursor-pointer hover:underline"
                        >
                          {game.title}
                        </h3>
                        <span className="text-[10px] font-pixel px-1.5 py-0.2 rounded bg-[#F4F4F2] text-[#495464] border border-[#BBBFCA]/40 shrink-0">
                          {game.platforms[0] || 'WIN'}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#495464]">
                        {game.developer}
                      </p>

                      <div className="flex items-center gap-2 text-[10px] text-[#495464]">
                        <span>Ukuran: {game.file_size}</span>
                        <span>•</span>
                        <span>Versi: {game.version || 'v1.0.0'}</span>
                      </div>
                    </div>

                    <div className="pt-3 flex items-center gap-2">
                      {game.platforms.includes('WEB') ? (
                        <button
                          onClick={() => alert(`Memulai sesi browser langsung untuk "${game.title}".`)}
                          className="flex-1 py-1.5 px-3 bg-[#495464] hover:bg-[#3d4654] text-[#F4F4F2] rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Main di Web</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => alert(`Mengunduh installer resmi "${game.title}" (${game.file_size}). Berkas bebas DRM.`)}
                          className="flex-1 py-1.5 px-3 bg-[#495464] hover:bg-[#3d4654] text-[#F4F4F2] rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh ZIP</span>
                        </button>
                      )}

                      <button
                        onClick={() => onSelectGame(game)}
                        title="Buka halaman etalase dan perbarui ulasan"
                        className="p-1.5 bg-[#F4F4F2] hover:bg-white text-[#495464] hover:text-[#222629] rounded-lg border border-[#BBBFCA]/40 transition"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Isi Tab: Riwayat Transaksi */}
      {activeTab === 'history' && (
        <div className="bg-[#E8E8E8] rounded-xl border border-[#BBBFCA]/40 overflow-hidden">
          <div className="p-4 border-b border-[#BBBFCA]/40 bg-[#E8E8E8] flex items-center justify-between text-xs font-bold text-[#495464] uppercase tracking-wider">
            <span>Daftar Bukti Kepemilikan Digital</span>
            <span>{ownedGames.length} Transaksi</span>
          </div>

          <div className="divide-y divide-[#BBBFCA]/30">
            {ownedGames.map((game, index) => {
              const orderId = `INV-SL-2026-${String(index + 104).padStart(4, '0')}`
              const isFree = game.price === 0
              
              return (
                <div key={game.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#222629] text-sm">{game.title}</span>
                      <span className="font-pixel text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                        LUNAS
                      </span>
                    </div>
                    <p className="text-[11px] text-[#495464]">
                      Nomor Transaksi: <span className="font-mono">{orderId}</span> • Metode: QRIS / Midtrans
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-right">
                      <span className="font-bold text-[#222629]">
                        {isFree ? 'Gratis' : `Rp${game.price.toLocaleString('id-ID')}`}
                      </span>
                      <span className="text-[10px] text-[#495464] block">Lisensi Seumur Hidup</span>
                    </div>

                    <button
                      onClick={() => alert(`Bukti faktur resmi ${orderId} untuk game "${game.title}" telah diunduh.`)}
                      className="px-3 py-1.5 bg-[#F4F4F2] hover:bg-white text-[#495464] hover:text-[#222629] border border-[#BBBFCA]/50 rounded-lg text-xs font-semibold transition"
                    >
                      Faktur
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
