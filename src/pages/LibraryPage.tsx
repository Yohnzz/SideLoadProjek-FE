import React, { useState } from 'react';
import { Download, Play, ShieldCheck, ExternalLink, PackageOpen, HardDrive } from 'lucide-react';
import { Button, Badge, EmptyState, Tabs, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui';
import { storageService } from '../services/storageService';
import type { Game } from '../types/game';

interface LibraryPageProps {
  ownedGames: Game[];
  onSelectGame: (game: Game) => void;
  onExploreMore: () => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({
  ownedGames,
  onSelectGame,
  onExploreMore,
}) => {
  const [activeTab, setActiveTab] = useState<'collection' | 'history'>('collection');
  const [downloadingGameId, setDownloadingGameId] = useState<string | null>(null);

  const handleDownload = async (game: Game) => {
    setDownloadingGameId(game.id);
    try {
      const res = await storageService.getDownloadPresignedUrl(game.id);
      if (res.success && res.downloadUrl) {
        storageService.triggerBrowserDownload(res.downloadUrl, res.fileName || `${game.title}.zip`);
      } else {
        alert(res.error || 'Gagal menyiapkan berkas unduh.');
      }
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan sistem saat mengunduh.');
    } finally {
      setDownloadingGameId(null);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Halaman Pustaka */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#171923]">
              Pustaka Game & Aplikasi Saya
            </h1>
            <Badge variant="primary" size="sm">
              {ownedGames.length} Koleksi
            </Badge>
          </div>
          <p className="text-xs text-[#737887] mt-1">
            Koleksi karya berlisensi akun Anda. Mainkan langsung di browser atau unduh paket instalasi bebas DRM.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#16A34A] bg-[#DCFCE7] px-3 py-1.5 rounded-full border border-[#BBF7D0]">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span className="font-semibold">Lisensi Permanen & Bebas DRM</span>
        </div>
      </div>

      {/* Navigasi Tab Pustaka */}
      <Tabs
        variant="pill"
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as any)}
        items={[
          { id: 'collection', label: 'Koleksi Game Aktif', count: ownedGames.length },
          { id: 'history', label: 'Riwayat Klaim & Pembelian', count: ownedGames.length },
        ]}
      />

      {/* Konten Tab 1: Koleksi Game */}
      {activeTab === 'collection' && (
        <div>
          {ownedGames.length === 0 ? (
            <EmptyState
              icon={<PackageOpen className="w-6 h-6 text-[#737887]" />}
              title="Pustaka Anda Masih Kosong"
              description="Anda belum memiliki game atau aplikasi di akun ini. Jelajahi etalase karya indie lokal, klaim yang gratis atau beli untuk mulai bermain."
              actionText="Jelajahi Katalog Toko"
              onAction={onExploreMore}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ownedGames.map((game) => {
                const hasWeb = game.platforms.includes('WEB');
                const hasWin = game.platforms.includes('WIN');

                return (
                  <article
                    key={game.id}
                    className="bg-white rounded-[16px] border border-[#E5E7EB] hover:border-[#D1D5DB] hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Cover Thumbnail 16:9 */}
                      <div className="relative w-full aspect-16/9 bg-[#F0F1F5] overflow-hidden">
                        <img
                          src={game.cover_url}
                          alt={game.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <Badge variant="success" size="sm" dot>
                            Milik Anda
                          </Badge>
                          {hasWeb && <Badge variant="violet" size="sm">WebGL</Badge>}
                        </div>
                      </div>

                      {/* Info Game */}
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-[#737887]">
                          <span>{game.developer}</span>
                          <span>v{game.version}</span>
                        </div>
                        <h3 className="text-base font-bold text-[#171923] tracking-tight line-clamp-1">
                          {game.title}
                        </h3>
                        <p className="text-xs text-[#737887] line-clamp-2 leading-relaxed">
                          {game.short_description || game.description}
                        </p>
                      </div>
                    </div>

                    {/* Tombol Aksi Langsung */}
                    <div className="p-4 pt-3 border-t border-[#E5E7EB] bg-[#F7F8FA]/60 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        {hasWeb ? (
                          <Button
                            variant="primary"
                            size="sm"
                            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                            onClick={() => onSelectGame(game)}
                          >
                            Mainkan
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
                            onClick={() => onSelectGame(game)}
                          >
                            Buka Halaman
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Download className="w-3.5 h-3.5" />}
                          disabled={downloadingGameId === game.id}
                          onClick={() => handleDownload(game)}
                        >
                          {downloadingGameId === game.id ? 'Menyiapkan...' : 'Unduh ZIP'}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#737887] pt-1">
                        <span className="flex items-center gap-1">
                          <HardDrive className="w-3 h-3" />
                          <span>{game.file_size}</span>
                        </span>
                        <span>{hasWin ? 'Windows x86_64' : 'Web Player'}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Konten Tab 2: Riwayat Transaksi */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produk</TableHead>
                <TableHead>Pengembang</TableHead>
                <TableHead>Nomor Invoice</TableHead>
                <TableHead>Metode Bayar</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ownedGames.map((game, index) => (
                <TableRow key={`inv-${game.id}`}>
                  <TableCell className="font-semibold">{game.title}</TableCell>
                  <TableCell className="text-[#737887]">{game.developer}</TableCell>
                  <TableCell className="font-mono text-[11px] text-[#737887]">
                    #INV-2026-{(1000 + index).toString()}
                  </TableCell>
                  <TableCell>{game.price === 0 ? 'Klaim Gratis' : 'QRIS Instan'}</TableCell>
                  <TableCell className="font-bold">
                    {game.price === 0 ? 'Gratis' : `Rp ${game.price.toLocaleString('id-ID')}`}
                  </TableCell>
                  <TableCell>
                    <Badge variant="success" size="sm" dot>
                      Selesai
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => onSelectGame(game)}>
                      Buka
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
