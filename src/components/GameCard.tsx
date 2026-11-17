import React from 'react';
import { Play, Download } from 'lucide-react';
import { Badge } from './ui';
import type { Game } from '../types/game';

interface GameCardProps {
  game: Game;
  onSelect: (game: Game) => void;
  className?: string;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onSelect, className = '' }) => {
  const isFree = game.price === 0;
  const hasWeb = game.platforms.includes('WEB');
  const hasWin = game.platforms.includes('WIN');

  return (
    <article
      onClick={() => onSelect(game)}
      className={`group bg-white rounded-[12px] border border-[#E5E7EB] hover:border-[#D1D5DB] hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between ${className}`}
    >
      <div>
        {/* Cover Image 16:10 */}
        <div className="relative w-full aspect-16/10 bg-[#F0F1F5] overflow-hidden">
          <img
            src={game.cover_url}
            alt={game.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-103"
          />

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
            {hasWeb && (
              <Badge variant="violet" size="sm">
                WebGL
              </Badge>
            )}
            {hasWin && (
              <Badge variant="neutral" size="sm">
                Windows
              </Badge>
            )}
          </div>

          {/* Quick Play/Download Hover Pill */}
          <div className="absolute inset-0 bg-[#171923]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none">
            <span className="px-3 py-1.5 rounded-full bg-white text-[#171923] text-xs font-semibold shadow-md flex items-center gap-1.5">
              {hasWeb ? <Play className="w-3.5 h-3.5 fill-current text-[#2373FB]" /> : <Download className="w-3.5 h-3.5" />}
              <span>Lihat Detail</span>
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3.5 space-y-1">
          <div className="text-[11px] text-[#737887] font-medium truncate">
            {game.developer}
          </div>
          <h3 className="text-sm font-semibold text-[#171923] group-hover:text-[#2373FB] transition-colors line-clamp-1">
            {game.title}
          </h3>
          <p className="text-xs text-[#737887] line-clamp-2 leading-relaxed">
            {game.short_description || game.description}
          </p>
        </div>
      </div>

      {/* Footer: Harga & Genre */}
      <div className="px-3.5 py-2.5 border-t border-[#E5E7EB] bg-[#F7F8FA]/60 flex items-center justify-between">
        <span className="text-[11px] text-[#737887] font-medium truncate max-w-[120px]">
          {game.genre}
        </span>
        <span
          className={`text-xs font-bold ${
            isFree ? 'text-[#16A34A]' : 'text-[#171923]'
          }`}
        >
          {isFree ? 'Gratis' : `Rp ${game.price.toLocaleString('id-ID')}`}
        </span>
      </div>
    </article>
  );
};

export const GameCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-[12px] border border-[#E5E7EB] overflow-hidden animate-pulse flex flex-col justify-between">
      <div>
        <div className="w-full aspect-16/10 bg-[#E4E6EB]" />
        <div className="p-3.5 space-y-2">
          <div className="h-2.5 w-1/3 bg-[#E4E6EB] rounded" />
          <div className="h-4 w-3/4 bg-[#E4E6EB] rounded" />
          <div className="h-3 w-full bg-[#E4E6EB] rounded" />
        </div>
      </div>
      <div className="px-3.5 py-2.5 border-t border-[#E5E7EB] flex items-center justify-between">
        <div className="h-2.5 w-1/4 bg-[#E4E6EB] rounded" />
        <div className="h-3 w-1/4 bg-[#E4E6EB] rounded" />
      </div>
    </div>
  );
};

