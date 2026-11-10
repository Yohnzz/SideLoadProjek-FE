import React, { useState } from 'react'
import { 
  ChevronRight, 
  ShieldCheck, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ShoppingBag, 
  Download,
  Info
} from 'lucide-react'
import type { Game } from '../types/game'
import { DUMMY_REVIEWS } from '../data/dummyGames'

interface GameDetailPageProps {
  game: Game
  onBack: () => void
  onCheckout: (game: Game) => void
}

export const GameDetailPage: React.FC<GameDetailPageProps> = ({
  game,
  onBack,
  onCheckout
}) => {
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState(0)
  const [openSpecs, setOpenSpecs] = useState(true)
  const [openChangelog, setOpenChangelog] = useState(false)
  const [openIntegrity, setOpenIntegrity] = useState(false)

  const screenshots = game.screenshots && game.screenshots.length > 0 
    ? game.screenshots 
    : [game.cover_url]

  const reviews = DUMMY_REVIEWS[game.slug] || [
    {
      id: 'default-1',
      game_id: game.id,
      author: 'Pemain Terverifikasi',
      rating: game.rating,
      date: '25 Jan 2026',
      verified_purchase: true,
      playtime_hours: 3.5,
      helpful_count: 4,
      content: 'Karya indie yang sangat solid dan berkarakter. Tidak ada kendala teknis selama pengujian.'
    }
  ]

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-[#495464]">
        <button 
          onClick={onBack}
          className="hover:text-[#222629] hover:underline"
        >
          Jelajah
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-[#BBBFCA]" />
        <span className="text-[#222629] font-medium">{game.title}</span>
      </nav>

      {/* Bagian Atas: Galeri Media & Panel Beli */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Kolom Kiri: Galeri Cuplikan Gameplay */}
        <div className="lg:col-span-8 space-y-3">
          {/* Layar Utama Screenshot */}
          <div className="w-full aspect-16/9 rounded-xl overflow-hidden border border-[#BBBFCA]/50 relative bg-[#222629] shadow-xs">
            <img 
              src={screenshots[selectedScreenshotIndex] || game.cover_url} 
              alt={game.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-[#222629]/80 backdrop-blur-xs text-[#F4F4F2] px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase border border-white/10">
              Gameplay Cuplikan
            </div>
          </div>

          {/* Baris Thumbnail (Dapat diklik) */}
          {screenshots.length > 1 && (
            <div className="grid grid-cols-4 gap-2.5">
              {screenshots.map((thumb, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedScreenshotIndex(idx)}
                  className={`aspect-16/9 rounded-lg overflow-hidden border-2 transition focus:outline-none ${
                    selectedScreenshotIndex === idx 
                      ? 'border-[#495464] ring-1 ring-[#495464]' 
                      : 'border-[#BBBFCA]/50 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={thumb} 
                    alt={`Cuplikan ${idx + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Kolom Kanan: Detail & Kartu Pembelian */}
        <div className="lg:col-span-4 bg-[#E8E8E8] rounded-xl p-6 border border-[#BBBFCA]/40 space-y-5">
          {/* Platform & Tanggal Rilis */}
          <div className="flex items-center justify-between text-xs text-[#495464]">
            <span className="px-2 py-0.5 rounded bg-[#F4F4F2] text-[#495464] border border-[#BBBFCA]/50 font-pixel text-[10px] font-bold">
              {game.platforms.join(' • ')}
            </span>
            <span className="text-[11px]">Rilis: {game.release_date}</span>
          </div>

          {/* Judul & Pengembang */}
          <div>
            <h1 className="text-2xl font-extrabold text-[#222629] tracking-tight">
              {game.title}
            </h1>
            <p className="text-xs text-[#495464] mt-1">
              Oleh <span className="font-semibold text-[#222629]">{game.developer}</span>
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-sm text-[#222629]">{game.rating}</span>
            <span className="text-[#495464]">/ 5.0</span>
            <span className="text-[#BBBFCA]">·</span>
            <span className="text-[#495464]">{game.review_count} pemain terverifikasi</span>
          </div>

          {/* Blok Aksi Beli */}
          <div className="pt-4 border-t border-[#BBBFCA]/40 space-y-3">
            <div className="flex items-center justify-between text-xs text-[#495464]">
              <span>Harga resmi</span>
              <span className="text-xl font-extrabold text-[#222629]">
                {game.price === 0 ? 'Gratis' : `Rp${game.price.toLocaleString('id-ID')}`}
              </span>
            </div>

            <button
              onClick={() => onCheckout(game)}
              className="w-full py-3 px-4 bg-[#495464] text-[#F4F4F2] text-sm font-semibold rounded-lg hover:bg-[#3d4654] active:scale-[0.99] transition flex items-center justify-center gap-2 shadow-xs"
            >
              {game.price === 0 ? (
                <>
                  <Download className="w-4 h-4" />
                  <span>Unduh Gratis</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Beli Rp{game.price.toLocaleString('id-ID')}</span>
                </>
              )}
            </button>

            <div className="flex items-center gap-1.5 text-[11px] text-[#495464] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#495464] shrink-0" />
              <span>Garansi refund 14 hari sesuai Kebijakan Refund SideLoad.</span>
            </div>
          </div>

          {/* Metadata Tambahan */}
          <div className="pt-4 border-t border-[#BBBFCA]/40 text-xs space-y-2 text-[#495464]">
            <div className="flex justify-between">
              <span>Genre</span>
              <span className="font-medium text-[#222629]">{game.genre}</span>
            </div>
            <div className="flex justify-between">
              <span>Ukuran Berkas</span>
              <span className="font-medium text-[#222629]">{game.file_size}</span>
            </div>
            <div className="flex justify-between">
              <span>Bahasa</span>
              <span className="font-medium text-[#222629]">{game.languages.join(', ')}</span>
            </div>
            <div className="flex justify-between">
              <span>Bebas DRM</span>
              <span className="font-medium text-[#222629]">
                {game.drm_free ? 'Ya (Standalone Build)' : 'Tidak'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Bawah: Deskripsi, Fitur, Spesifikasi, dan Ulasan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-10">
          
          {/* Tentang Game */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#222629]">Tentang Game</h2>
            <div className="text-sm text-[#495464] leading-relaxed space-y-3 whitespace-pre-line">
              {game.description}
            </div>
          </section>

          {/* Fitur Utama */}
          {game.features && game.features.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#222629]">Fitur Utama</h2>
              <ul className="space-y-2 text-sm text-[#495464]">
                {game.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#495464] mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Spesifikasi & Riwayat (Accordion) */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#222629]">Spesifikasi & Riwayat</h2>

            <div className="rounded-xl border border-[#BBBFCA]/40 bg-[#E8E8E8] divide-y divide-[#BBBFCA]/40 overflow-hidden">
              
              {/* Accordion 1: Persyaratan Sistem */}
              <div>
                <button
                  onClick={() => setOpenSpecs(!openSpecs)}
                  className="w-full p-4 flex items-center justify-between text-left font-bold text-sm text-[#222629] hover:bg-[#BBBFCA]/15 transition"
                >
                  <span>Persyaratan Sistem</span>
                  {openSpecs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {openSpecs && (
                  <div className="p-4 pt-0 text-xs text-[#495464] border-t border-[#BBBFCA]/20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3">
                      <div>
                        <h4 className="font-bold text-[#222629] mb-2 uppercase tracking-wider text-[11px]">
                          Minimum
                        </h4>
                        <dl className="space-y-1.5">
                          <div>
                            <dt className="text-[#495464]">Sistem Operasi:</dt>
                            <dd className="font-medium text-[#222629]">{game.system_requirements?.minimum.os || 'Windows 10 64-bit'}</dd>
                          </div>
                          <div>
                            <dt className="text-[#495464]">Prosesor:</dt>
                            <dd className="font-medium text-[#222629]">{game.system_requirements?.minimum.processor || 'Intel Core i3 / AMD ekuivalen'}</dd>
                          </div>
                          <div>
                            <dt className="text-[#495464]">Memori:</dt>
                            <dd className="font-medium text-[#222629]">{game.system_requirements?.minimum.memory || '4 GB RAM'}</dd>
                          </div>
                          <div>
                            <dt className="text-[#495464]">Kartu Grafis:</dt>
                            <dd className="font-medium text-[#222629]">{game.system_requirements?.minimum.graphics || 'GeForce GTX 750 Ti'}</dd>
                          </div>
                          <div>
                            <dt className="text-[#495464]">Penyimpanan:</dt>
                            <dd className="font-medium text-[#222629]">{game.system_requirements?.minimum.storage || '2 GB ruang kosong'}</dd>
                          </div>
                        </dl>
                      </div>

                      <div>
                        <h4 className="font-bold text-[#222629] mb-2 uppercase tracking-wider text-[11px]">
                          Direkomendasikan
                        </h4>
                        <dl className="space-y-1.5">
                          <div>
                            <dt className="text-[#495464]">Sistem Operasi:</dt>
                            <dd className="font-medium text-[#222629]">{game.system_requirements?.recommended.os || 'Windows 11 64-bit'}</dd>
                          </div>
                          <div>
                            <dt className="text-[#495464]">Prosesor:</dt>
                            <dd className="font-medium text-[#222629]">{game.system_requirements?.recommended.processor || 'Intel Core i5 / AMD Ryzen 5'}</dd>
                          </div>
                          <div>
                            <dt className="text-[#495464]">Memori:</dt>
                            <dd className="font-medium text-[#222629]">{game.system_requirements?.recommended.memory || '8 GB RAM'}</dd>
                          </div>
                          <div>
                            <dt className="text-[#495464]">Kartu Grafis:</dt>
                            <dd className="font-medium text-[#222629]">{game.system_requirements?.recommended.graphics || 'NVIDIA GTX 1060 / RX 580'}</dd>
                          </div>
                          <div>
                            <dt className="text-[#495464]">Penyimpanan:</dt>
                            <dd className="font-medium text-[#222629]">{game.system_requirements?.recommended.storage || '2 GB SSD'}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Accordion 2: Changelog & Pembaruan */}
              <div>
                <button
                  onClick={() => setOpenChangelog(!openChangelog)}
                  className="w-full p-4 flex items-center justify-between text-left font-bold text-sm text-[#222629] hover:bg-[#BBBFCA]/15 transition"
                >
                  <span>Changelog & Pembaruan</span>
                  {openChangelog ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {openChangelog && (
                  <div className="p-4 pt-2 text-xs text-[#495464] space-y-2 border-t border-[#BBBFCA]/20">
                    <p className="font-semibold text-[#222629]">{game.version} (Rilis Terakhir)</p>
                    <ul className="list-disc list-inside space-y-1 pl-1">
                      <li>Optimalisasi performa memori pada skenario aksi kompleks.</li>
                      <li>Perbaikan kompatibilitas gamepad generic USB.</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 3: Informasi Berkas & Integritas */}
              <div>
                <button
                  onClick={() => setOpenIntegrity(!openIntegrity)}
                  className="w-full p-4 flex items-center justify-between text-left font-bold text-sm text-[#222629] hover:bg-[#BBBFCA]/15 transition"
                >
                  <span>Informasi Berkas & Integritas</span>
                  {openIntegrity ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {openIntegrity && (
                  <div className="p-4 pt-2 text-xs text-[#495464] space-y-2 border-t border-[#BBBFCA]/20 font-mono">
                    <p>Format Berkas: Standalone .ZIP Installer</p>
                    <p className="break-all text-[11px]">
                      Checksum SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
                    </p>
                    <p className="text-[11px] text-[#495464]">
                      Status Scan: Bebas Malware & Adware (Terverifikasi oleh Tim Moderasi SideLoad).
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Ulasan Pemain */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#222629]">Ulasan Pemain</h2>
                <p className="text-xs text-[#495464]">
                  {game.rating} dari 5.0 bintang · {game.review_count} penilaian terverifikasi
                </p>
              </div>

              <button 
                onClick={() => alert('Hanya akun yang telah membeli dan memainkan game ini di SideLoad yang dapat menulis ulasan.')}
                className="px-3.5 py-1.5 bg-[#F4F4F2] text-[#495464] text-xs font-semibold rounded-lg border border-[#BBBFCA] hover:text-[#222629] hover:bg-white transition"
              >
                Tulis Ulasan
              </button>
            </div>

            {/* Kotak Integritas Ulasan */}
            <div className="p-3 bg-[#E8E8E8] rounded-lg border border-[#BBBFCA]/50 flex items-start gap-2.5 text-xs text-[#495464]">
              <Info className="w-4 h-4 text-[#495464] mt-0.5 shrink-0" />
              <span>
                Hanya pemain yang telah membeli dan memainkan game ini di SideLoad yang dapat memberikan rating dan ulasan untuk memastikan integritas penilaian.
              </span>
            </div>

            {/* Daftar Ulasan */}
            <div className="space-y-3">
              {reviews.map(rev => (
                <div 
                  key={rev.id} 
                  className="bg-[#E8E8E8] rounded-xl p-4 border border-[#BBBFCA]/40 space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#222629]">{rev.author}</span>
                      {rev.verified_purchase && (
                        <span className="text-[9px] font-pixel px-1.5 py-0.5 rounded bg-[#F4F4F2] text-[#495464] border border-[#BBBFCA]/60 font-semibold uppercase">
                          Terverifikasi
                        </span>
                      )}
                    </div>
                    <span className="text-[#495464] text-[11px]">{rev.date}</span>
                  </div>

                  <div className="text-xs font-semibold text-[#222629]">
                    Rating: {rev.rating} / 5.0
                  </div>

                  <p className="text-xs sm:text-sm text-[#495464] leading-relaxed">
                    {rev.content}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-[#495464] border-t border-[#BBBFCA]/30">
                    <span>Durasi main: {rev.playtime_hours} jam saat diulas</span>
                    <button 
                      onClick={() => {}}
                      className="hover:text-[#222629] hover:underline"
                    >
                      Bermanfaat ({rev.helpful_count})
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
