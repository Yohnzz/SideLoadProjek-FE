-- ==============================================================================
-- SIDELOAD: MIGRATION BACKBLAZE B2 STORAGE & SECURE DOWNLOADS
-- ==============================================================================

-- 1. Tambahkan kolom pendukung storage eksternal pada tabel games
ALTER TABLE public.games
  ADD COLUMN IF NOT EXISTS storage_file_path TEXT,
  ADD COLUMN IF NOT EXISTS web_build_url TEXT,
  ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0;

-- Komentar dokumentasi kolom
COMMENT ON COLUMN public.games.storage_file_path IS 'Path kunci objek file unduhan game di Backblaze B2 (misal: games/usr-id/game-id/v1.0.0.zip)';
COMMENT ON COLUMN public.games.web_build_url IS 'URL publik atau CDN untuk file index.html WebGL yang dimainkan di browser';
COMMENT ON COLUMN public.games.download_count IS 'Akumulasi total unduhan berkas game oleh pemain';

-- 2. Index untuk optimasi verifikasi dan pencarian berkas
CREATE INDEX IF NOT EXISTS idx_games_storage_path ON public.games(storage_file_path);
CREATE INDEX IF NOT EXISTS idx_user_library_lookup ON public.user_library(user_id, game_id);

-- 3. Fungsi RPC Atomic Increment untuk counter unduhan aman
CREATE OR REPLACE FUNCTION public.increment_game_download(p_game_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.games
  SET download_count = COALESCE(download_count, 0) + 1
  WHERE id = p_game_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_game_download(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_game_download(UUID) TO anon;

