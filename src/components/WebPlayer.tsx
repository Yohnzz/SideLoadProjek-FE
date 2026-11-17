import React, { useState } from 'react';
import { Maximize2, Minimize2, RotateCcw, Volume2, VolumeX, Play } from 'lucide-react';
import { Button } from './ui';
import type { Game } from '../types/game';

interface WebPlayerProps {
  game: Game;
  onClose?: () => void;
  className?: string;
}

export const WebPlayer: React.FC<WebPlayerProps> = ({ game, onClose, className = '' }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-16/9 bg-[#0B0D13] rounded-[14px] overflow-hidden border border-[#E5E7EB] shadow-lg flex flex-col justify-between ${className}`}
    >
      {/* WebGL Canvas / Simulated Interactive Game Viewport */}
      {!isPlaying ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-black/75 backdrop-blur-xs">
          <img
            src={game.cover_url}
            alt={game.title}
            className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-xs"
          />
          <div className="relative z-20 space-y-4 max-w-md">
            <div className="w-16 h-16 rounded-full bg-[#2373FB] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#2373FB]/30 transform transition hover:scale-110 cursor-pointer"
              onClick={() => setIsPlaying(true)}
            >
              <Play className="w-8 h-8 fill-current ml-1" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">{game.title}</h3>
              <p className="text-xs text-white/70 mt-1">
                Versi WebGL {game.version} • Siap dimainkan langsung di browser tanpa unduhan
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Play className="w-4 h-4 fill-current" />}
              onClick={() => setIsPlaying(true)}
            >
              Mulai Game di Browser
            </Button>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0B0D13] select-none">
          {/* Simulated HTML5 Canvas Demo */}
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#171923] to-[#0B0D13] p-8 text-center text-white">
            <div className="w-20 h-20 rounded-2xl bg-[#2373FB]/20 border border-[#2373FB]/40 flex items-center justify-center mb-4 text-[#2373FB] font-bold text-2xl animate-pulse">
              🎮
            </div>
            <h4 className="text-base font-bold tracking-tight">{game.title} (WebGL Active)</h4>
            <p className="text-xs text-white/60 mt-1 max-w-sm">
              Gunakan tombol panah [← ↑ ↓ →] atau tombol [W, A, S, D] dan [Spasi] untuk interaksi.
            </p>
            <div className="mt-4 px-3 py-1.5 rounded-full bg-white/10 text-[11px] font-mono text-emerald-400 border border-emerald-500/30">
              60 FPS • WebGL 2.0 • WebAudio Active
            </div>
          </div>
        </div>
      )}

      {/* Control Bar Overlay */}
      <div className="relative z-20 mt-auto bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 sm:p-4 flex items-center justify-between text-white text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xs tracking-tight">{game.title}</span>
          <span className="text-white/40">•</span>
          <span className="text-[11px] text-white/70 font-mono">v{game.version}</span>
        </div>

        <div className="flex items-center gap-2">
          {isPlaying && (
            <>
              <button
                onClick={() => setIsMuted((prev) => !prev)}
                aria-label={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
                className="p-1.5 rounded hover:bg-white/20 transition"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-white/70" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsPlaying(false)}
                title="Muat Ulang Game"
                className="p-1.5 rounded hover:bg-white/20 transition text-white/80 hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={toggleFullscreen}
            aria-label="Layar Penuh"
            className="p-1.5 rounded hover:bg-white/20 transition text-white/80 hover:text-white"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 px-2.5 py-1 rounded-[6px] bg-white/20 hover:bg-white/30 text-[11px] font-semibold transition"
            >
              Tutup Player
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

