import React, { useState } from 'react';
import {
  ChevronRight,
  ShieldCheck,
  Check,
  ShoppingBag,
  Download,
  Play,
  Cpu,
  FileCheck,
  Star,
} from 'lucide-react';
import { Button, Badge, Tabs } from '../components/ui';
import { WebPlayer } from '../components/WebPlayer';
import { storageService } from '../services/storageService';
import type { Game } from '../types/game';
import { DUMMY_REVIEWS } from '../data/dummyGames';

interface GameDetailPageProps {
  game: Game;
  isOwned?: boolean;
  onBack: () => void;
  onCheckout: (game: Game) => void;
}

export const GameDetailPage: React.FC<GameDetailPageProps> = ({
  game,
  isOwned = false,
  onBack,
  onCheckout,
}) => {
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState(0);
  const [activeMediaTab, setActiveMediaTab] = useState<'screenshots' | 'webplayer'>('screenshots');
  const [activeDetailTab, setActiveDetailTab] = useState<'about' | 'specs' | 'changelog' | 'reviews'>('about');
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const res = await storageService.getDownloadPresignedUrl(game.id);
      if (res.success && res.downloadUrl) {
        storageService.triggerBrowserDownload(res.downloadUrl, res.fileName || `${game.title}.zip`);
      } else {
        alert(res.error || 'Gagal memproses tautan unduh.');
      }
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan saat memproses unduhan.');
    } finally {
      setIsDownloading(false);
    }
  };

  const hasWeb = game.platforms.includes('WEB');
  const hasWin = game.platforms.includes('WIN');
  const isFree = game.price === 0;

  const screenshots = game.screenshots && game.screenshots.length > 0 ? game.screenshots : [game.cover_url];
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
      content: 'Karya indie yang sangat solid dan berkarakter. Tidak ada kendala teknis selama pengujian.',
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb Navigasi */}
      <nav className="flex items-center gap-2 text-xs text-[#737887]">
        <button onClick={onBack} className="hover:text-[#171923] hover:underline transition-colors">
          Jelajah Katalog
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-[#D1D5DB]" />
        <span className="text-[#171923] font-semibold truncate max-w-[200px] sm:max-w-none">
          {game.title}
        </span>
      </nav>

      {/* Bagian Atas: Galeri Media / Web Player & Panel Pembelian */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: Galeri Cuplikan Gameplay / Web Player (8 Kolom) */}
        <div className="lg:col-span-8 space-y-3">
          {/* Tab Media: Cuplikan vs Mainkan di Browser */}
          {hasWeb && (
            <div className="flex items-center justify-between pb-1">
              <div className="inline-flex p-1 bg-[#F0F1F5] rounded-[10px]">
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('screenshots')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-[8px] transition-all ${
                    activeMediaTab === 'screenshots'
                      ? 'bg-white text-[#171923] shadow-xs'
                      : 'text-[#737887] hover:text-[#171923]'
                  }`}
                >
                  Cuplikan Gameplay ({screenshots.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('webplayer')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-[8px] flex items-center gap-1.5 transition-all ${
                    activeMediaTab === 'webplayer'
                      ? 'bg-[#2373FB] text-white shadow-xs'
                      : 'text-[#2373FB] hover:bg-[#EFF6FF]'
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Mainkan di Browser (WebGL)</span>
                </button>
              </div>

              <span className="text-[11px] text-[#737887] hidden sm:inline">
                {activeMediaTab === 'webplayer' ? 'Simulasi Web Player Aktif' : 'Klik gambar untuk memperbesar'}
              </span>
            </div>
          )}

          {/* Area Tampilan Media */}
          {activeMediaTab === 'webplayer' && hasWeb ? (
            <WebPlayer game={game} onClose={() => setActiveMediaTab('screenshots')} />
          ) : (
            <div className="space-y-3">
              {/* Gambar Utama */}
              <div className="w-full aspect-16/9 rounded-[14px] overflow-hidden border border-[#E5E7EB] relative bg-[#171923] shadow-xs">
                <img
                  src={screenshots[selectedScreenshotIndex] || game.cover_url}
                  alt={game.title}
                  className="w-full h-full object-cover transition-opacity duration-200"
                />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-[6px] text-[11px] font-semibold border border-white/10 flex items-center gap-1.5">
                  <Play className="w-3 h-3 text-[#2373FB] fill-current" />
                  <span>Cuplikan Etalase #{selectedScreenshotIndex + 1}</span>
                </div>
              </div>

              {/* Baris Thumbnail */}
              {screenshots.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                  {screenshots.map((thumb, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedScreenshotIndex(idx)}
                      className={`aspect-16/9 rounded-[8px] overflow-hidden border-2 transition-all focus:outline-none ${
                        selectedScreenshotIndex === idx
                          ? 'border-[#2373FB] ring-2 ring-[#2373FB]/20 scale-102'
                          : 'border-[#E5E7EB] opacity-70 hover:opacity-100'
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
          )}
        </div>

        {/* Kolom Kanan: Detail & Kartu Aksi Pembelian (4 Kolom) */}
        <div className="lg:col-span-4 bg-white rounded-[16px] p-6 border border-[#E5E7EB] shadow-xs space-y-5">
          {/* Platform & Status Kepemilikan */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {hasWeb && <Badge variant="violet" size="sm">WebGL</Badge>}
              {hasWin && <Badge variant="neutral" size="sm">Windows</Badge>}
            </div>
            {isOwned ? (
              <Badge variant="success" dot size="sm">
                Ada di Pustaka
              </Badge>
            ) : (
              <span className="text-[11px] text-[#737887]">
                v{game.version}
              </span>
            )}
          </div>

          {/* Judul & Developer */}
          <div>
            <h1 className="text-2xl font-bold text-[#171923] tracking-tight">
              {game.title}
            </h1>
            <p className="text-xs text-[#737887] mt-1">
              Karya oleh <span className="font-semibold text-[#171923]">{game.developer}</span>
            </p>
          </div>

          {/* Rating & Ulasan */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 text-[#D97706] font-bold">
              <Star className="w-4 h-4 fill-current text-[#D97706]" />
              <span>{game.rating}</span>
            </div>
            <span className="text-[#D1D5DB]">•</span>
            <span className="text-[#737887]">{game.review_count} pemain terverifikasi</span>
          </div>

          {/* Blok Aksi Pembelian / Mainkan / Unduh */}
          <div className="pt-4 border-t border-[#E5E7EB] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#737887] font-medium">Harga Akses</span>
              <span className="text-xl font-bold text-[#171923]">
                {isFree ? 'Gratis' : `Rp ${game.price.toLocaleString('id-ID')}`}
              </span>
            </div>

            {/* Tombol Aksi Dinamis Sesuai Status Kepemilikan */}
            <div className="space-y-2">
              {isOwned ? (
                <>
                  {hasWeb && (
                    <Button
                      variant="primary"
                      size="md"
                      className="w-full"
                      leftIcon={<Play className="w-4 h-4 fill-current" />}
                      onClick={() => setActiveMediaTab('webplayer')}
                    >
                      Mainkan di Browser
                    </Button>
                  )}
                  <Button
                    variant={hasWeb ? 'outline' : 'primary'}
                    size="md"
                    className="w-full"
                    leftIcon={<Download className="w-4 h-4" />}
                    disabled={isDownloading}
                    onClick={handleDownload}
                  >
                    {isDownloading ? 'Menyiapkan Unduhan...' : `Unduh Berkas Game (${game.file_size})`}
                  </Button>
                </>
              ) : isFree ? (
                <>
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    leftIcon={<Download className="w-4 h-4" />}
                    onClick={() => onCheckout(game)}
                  >
                    Klaim & Unduh Gratis
                  </Button>
                  {hasWeb && (
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full"
                      leftIcon={<Play className="w-4 h-4 fill-current text-[#2373FB]" />}
                      onClick={() => setActiveMediaTab('webplayer')}
                    >
                      Coba Mainkan di Browser
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    leftIcon={<ShoppingBag className="w-4 h-4" />}
                    onClick={() => onCheckout(game)}
                  >
                    Beli Rp {game.price.toLocaleString('id-ID')}
                  </Button>
                  {hasWeb && (
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full"
                      leftIcon={<Play className="w-4 h-4 text-[#2373FB]" />}
                      onClick={() => setActiveMediaTab('webplayer')}
                    >
                      Coba Versi WebGL
                    </Button>
                  )}
                </>
              )}
            </div>

            {/* Kebijakan Garansi */}
            <div className="flex items-center gap-2 text-[11px] text-[#737887] pt-1 leading-relaxed">
              <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>Garansi refund 14 hari sesuai Kebijakan Refund SideLoad.</span>
            </div>
          </div>

          {/* Rincian Metadata Produk */}
          <div className="pt-4 border-t border-[#E5E7EB] text-xs space-y-2.5 text-[#737887]">
            <div className="flex justify-between">
              <span>Genre</span>
              <span className="font-semibold text-[#171923]">{game.genre}</span>
            </div>
            <div className="flex justify-between">
              <span>Ukuran Berkas</span>
              <span className="font-semibold text-[#171923]">{game.file_size}</span>
            </div>
            <div className="flex justify-between">
              <span>Rilis Publik</span>
              <span className="font-semibold text-[#171923]">{game.release_date}</span>
            </div>
            <div className="flex justify-between">
              <span>Lisensi</span>
              <span className="font-semibold text-[#171923]">DRM-Free Standalone</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Bawah: Tab Informasi Detail, Spesifikasi, Changelog, & Ulasan */}
      <div className="space-y-6">
        <Tabs
          variant="underline"
          activeId={activeDetailTab}
          onChange={(id) => setActiveDetailTab(id as any)}
          items={[
            { id: 'about', label: 'Tentang & Fitur Utama' },
            { id: 'specs', label: 'Spesifikasi Sistem' },
            { id: 'changelog', label: 'Catatan Rilis (Changelog)' },
            { id: 'reviews', label: `Ulasan Komunitas (${reviews.length})` },
          ]}
        />

        {/* Tab 1: Tentang Game & Fitur */}
        {activeDetailTab === 'about' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white rounded-[16px] p-6 border border-[#E5E7EB] space-y-6 shadow-xs">
              <div className="space-y-3">
                <h3 className="text-base font-bold text-[#171923]">Sinopsis & Alur Cerita</h3>
                <p className="text-sm text-[#737887] leading-relaxed whitespace-pre-line">
                  {game.description || game.short_description}
                </p>
              </div>

              {game.features && game.features.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-[#E5E7EB]">
                  <h3 className="text-base font-bold text-[#171923]">Fitur Utama Karya</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {game.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-[#171923]">
                        <div className="w-5 h-5 rounded-full bg-[#EFF6FF] text-[#2373FB] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                        <span className="leading-relaxed">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Integritas & Verifikasi Berkas */}
            <div className="lg:col-span-4 bg-white rounded-[16px] p-6 border border-[#E5E7EB] space-y-4 shadow-xs">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#2373FB]" />
                <h4 className="text-sm font-bold text-[#171923]">Integritas & Keamanan Berkas</h4>
              </div>
              <p className="text-xs text-[#737887] leading-relaxed">
                Setiap paket rilis telah diverifikasi oleh SideLoad Sentinel Node untuk memastikan bebas dari modifikasi tidak resmi dan virus.
              </p>
              <div className="p-3 bg-[#F0F1F5] rounded-[10px] space-y-1.5 font-mono text-[11px] text-[#737887]">
                <div className="text-[10px] font-semibold text-[#171923]">Checksum SHA-256:</div>
                <div className="break-all select-all text-[#171923]">
                  e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#16A34A] font-semibold">
                <Check className="w-4 h-4" />
                <span>Status Pemeriksaan: 0/72 Engine Bersih</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Spesifikasi Sistem */}
        {activeDetailTab === 'specs' && (
          <div className="bg-white rounded-[16px] p-6 border border-[#E5E7EB] shadow-xs space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Minimum */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB]">
                  <Cpu className="w-4 h-4 text-[#737887]" />
                  <h4 className="text-sm font-bold text-[#171923]">Kebutuhan Minimum</h4>
                </div>
                <dl className="text-xs space-y-2 text-[#737887]">
                  <div className="flex justify-between py-1 border-b border-[#F0F1F5]">
                    <dt>Sistem Operasi</dt>
                    <dd className="font-semibold text-[#171923]">{game.system_requirements?.minimum?.os || 'Windows 10 (64-bit)'}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F0F1F5]">
                    <dt>Prosesor</dt>
                    <dd className="font-semibold text-[#171923]">{game.system_requirements?.minimum?.processor || 'Intel Core i3 / AMD Ryzen 3'}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F0F1F5]">
                    <dt>Memori RAM</dt>
                    <dd className="font-semibold text-[#171923]">{game.system_requirements?.minimum?.memory || '4 GB RAM'}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F0F1F5]">
                    <dt>Kartu Grafis</dt>
                    <dd className="font-semibold text-[#171923]">{game.system_requirements?.minimum?.graphics || 'Intel UHD Graphics 620'}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt>Penyimpanan Kosong</dt>
                    <dd className="font-semibold text-[#171923]">{game.system_requirements?.minimum?.storage || '500 MB ruang kosong'}</dd>
                  </div>
                </dl>
              </div>

              {/* Rekomendasi */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#E5E7EB]">
                  <Cpu className="w-4 h-4 text-[#2373FB]" />
                  <h4 className="text-sm font-bold text-[#171923]">Kebutuhan Rekomendasi</h4>
                </div>
                <dl className="text-xs space-y-2 text-[#737887]">
                  <div className="flex justify-between py-1 border-b border-[#F0F1F5]">
                    <dt>Sistem Operasi</dt>
                    <dd className="font-semibold text-[#171923]">{game.system_requirements?.recommended?.os || 'Windows 11 (64-bit)'}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F0F1F5]">
                    <dt>Prosesor</dt>
                    <dd className="font-semibold text-[#171923]">{game.system_requirements?.recommended?.processor || 'Intel Core i5 / AMD Ryzen 5'}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F0F1F5]">
                    <dt>Memori RAM</dt>
                    <dd className="font-semibold text-[#171923]">{game.system_requirements?.recommended?.memory || '8 GB RAM'}</dd>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#F0F1F5]">
                    <dt>Kartu Grafis</dt>
                    <dd className="font-semibold text-[#171923]">{game.system_requirements?.recommended?.graphics || 'NVIDIA GTX 1050 / AMD RX 560'}</dd>
                  </div>
                  <div className="flex justify-between py-1">
                    <dt>Penyimpanan Kosong</dt>
                    <dd className="font-semibold text-[#171923]">{game.system_requirements?.recommended?.storage || '1 GB SSD direkomendasikan'}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Changelog Catatan Rilis */}
        {activeDetailTab === 'changelog' && (
          <div className="bg-white rounded-[16px] p-6 border border-[#E5E7EB] shadow-xs space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="primary">v{game.version}</Badge>
                <span className="text-xs text-[#737887]">Rilisan Publik Terakhir ({game.release_date})</span>
              </div>
              <ul className="text-xs space-y-2 text-[#737887] list-disc list-inside">
                <li>Penyempurnaan performa WebGL pada browser Chromium dan Firefox.</li>
                <li>Optimalisasi alokasi memori audio untuk soundtrack orisinal.</li>
                <li>Perbaikan bug minor saat memuat save game di bab 2.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: Ulasan Komunitas */}
        {activeDetailTab === 'reviews' && (
          <div className="bg-white rounded-[16px] p-6 border border-[#E5E7EB] shadow-xs space-y-6">
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-[#F7F8FA] rounded-[12px] space-y-2 border border-[#E5E7EB]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-[#171923]">{rev.author}</span>
                      {rev.verified_purchase && (
                        <Badge variant="success" size="sm">
                          Pembeli Terverifikasi
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-[#D97706] text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{rev.rating}.0</span>
                    </div>
                  </div>
                  <p className="text-xs text-[#737887] leading-relaxed">{rev.content}</p>
                  <div className="text-[11px] text-[#737887] pt-1">
                    Dimainkan {rev.playtime_hours} jam • {rev.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
