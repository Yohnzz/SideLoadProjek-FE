-- ==============================================================================
-- SIDELOAD: SKEMA DATABASE LENGKAP SUPABASE (POSTGRESQL)
-- Wadah Game & Aplikasi Indie Indonesia (3 Role: User, Developer, Admin)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TIPE DATA ENUMERASI (ENUMS)
-- ==============================================================================

-- Role Pengguna
CREATE TYPE user_role AS ENUM ('user', 'developer', 'admin');

-- Status Persetujuan Akun Developer
CREATE TYPE dev_status AS ENUM ('none', 'pending', 'approved', 'rejected');

-- Status Siklus Hidup Game / Aplikasi
CREATE TYPE game_status AS ENUM (
  'draft',            -- Masih berupa draf oleh developer
  'pending_review',   -- Dikirim ke admin untuk kurasi
  'revision_needed',  -- Dikembalikan admin untuk perbaikan berkas/cover
  'published',        -- Lolos review & tampil di etalase publik
  'rejected',         -- Ditolak resmi oleh admin
  'taken_down'        -- Diturunkan karena pelanggaran hak cipta/malware
);

-- Status Transaksi Pembayaran Midtrans
CREATE TYPE order_status AS ENUM (
  'pending',          -- Menunggu pembayaran pengguna (QRIS / VA dibuat)
  'settlement',       -- Pembayaran berhasil & terverifikasi
  'expire',           -- Batas waktu pembayaran habis
  'cancel',           -- Dibatalkan oleh sistem atau pengguna
  'refund'            -- Dana dikembalikan ke pembeli
);

-- Status Pencairan Royalti Developer
CREATE TYPE payout_status AS ENUM (
  'pending',          -- Pengajuan pencairan diajukan oleh developer
  'approved',         -- Disetujui oleh admin keuangan
  'transferred',      -- Berhasil ditransfer ke rekening bank
  'rejected'          -- Ditolak (misal rekening tidak valid)
);

-- ==============================================================================
-- 3. TABEL UTAMA SISTEM
-- ==============================================================================

-- A. PROFIL PENGGUNA (Terhubung otomatis dengan Supabase Auth)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'user',
  dev_status dev_status NOT NULL DEFAULT 'none',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- B. DETAIL PROFIL DEVELOPER (Data legalitas studio & portofolio)
CREATE TABLE public.developer_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  studio_name TEXT UNIQUE NOT NULL,
  contact_email TEXT NOT NULL,
  portfolio_url TEXT NOT NULL,
  description TEXT NOT NULL,
  status dev_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.profiles(id)
);

-- C. REKENING BANK DEVELOPER (Wajib untuk pencairan royalti 90%)
CREATE TABLE public.developer_bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID NOT NULL REFERENCES public.developer_profiles(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_holder TEXT NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_dev_bank UNIQUE (developer_id)
);

-- D. KATALOG GAME & APLIKASI
CREATE TABLE public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  developer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  genre TEXT NOT NULL,
  platforms TEXT[] NOT NULL DEFAULT ARRAY['WIN'], -- Contoh: ARRAY['WIN', 'WEB', 'APK']
  price NUMERIC(12,2) NOT NULL DEFAULT 0,          -- 0 = Gratis
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_url TEXT NOT NULL,
  screenshots TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  release_date TEXT NOT NULL DEFAULT TO_CHAR(NOW(), 'DD Mon YYYY'),
  file_size TEXT NOT NULL DEFAULT '0 MB',
  languages TEXT[] NOT NULL DEFAULT ARRAY['Indonesia'],
  drm_free BOOLEAN NOT NULL DEFAULT TRUE,
  version TEXT NOT NULL DEFAULT 'v1.0.0',
  badge TEXT,                                      -- Misal: 'Versi Baru Tersedia'
  
  -- Berkas & Verifikasi Teknis
  storage_file_path TEXT,                          -- Lokasi file .zip di Private Bucket Supabase
  sha256_hash TEXT,                                -- Hash integrity verifikasi kurator
  rating_category TEXT NOT NULL DEFAULT 'Semua Umur (SU)',
  
  -- Status Moderasi
  status game_status NOT NULL DEFAULT 'draft',
  curator_feedback TEXT,
  
  -- Statistik Real-time
  avg_rating NUMERIC(3,2) NOT NULL DEFAULT 0.00,
  review_count INT NOT NULL DEFAULT 0,
  total_downloads INT NOT NULL DEFAULT 0,
  total_sales_count INT NOT NULL DEFAULT 0,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- E. SPESIFIKASI SISTEM & CHANGELOG GAME
CREATE TABLE public.game_specifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID UNIQUE NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  features TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  
  -- Spek Minimum
  min_os TEXT NOT NULL DEFAULT 'Windows 10 64-bit',
  min_processor TEXT NOT NULL DEFAULT 'Intel Core i3 / AMD ekuivalen',
  min_memory TEXT NOT NULL DEFAULT '4 GB RAM',
  min_graphics TEXT NOT NULL DEFAULT 'GeForce GTX 750 Ti / AMD Radeon R7',
  min_storage TEXT NOT NULL DEFAULT '2 GB ruang kosong',
  
  -- Spek Rekomendasi
  rec_os TEXT NOT NULL DEFAULT 'Windows 11 64-bit',
  rec_processor TEXT NOT NULL DEFAULT 'Intel Core i5 / AMD Ryzen 5',
  rec_memory TEXT NOT NULL DEFAULT '8 GB RAM',
  rec_graphics TEXT NOT NULL DEFAULT 'NVIDIA GTX 1060 (6GB) / RX 580',
  rec_storage TEXT NOT NULL DEFAULT '2 GB ruang kosong SSD'
);

CREATE TABLE public.game_changelogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  version TEXT NOT NULL,
  release_date TEXT NOT NULL,
  notes TEXT[] NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- F. TRANSAKSI PEMBELIAN (MIDTRANS INTEGRATION)
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,               -- Format: INV-SL-2026-XXXX
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE RESTRICT,
  developer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  
  -- Nilai Transaksi & Kalkulasi Royalti 90/10
  amount NUMERIC(12,2) NOT NULL,
  platform_commission NUMERIC(12,2) NOT NULL,      -- 10% Masuk ke Kas SideLoad
  developer_earning NUMERIC(12,2) NOT NULL,        -- 90% Masuk ke Saldo Developer
  
  payment_method TEXT,                             -- 'qris', 'bank_transfer', 'gopay', dll.
  status order_status NOT NULL DEFAULT 'pending',
  midtrans_snap_token TEXT,
  midtrans_transaction_id TEXT,
  
  -- Masa Garansi Refund 14 Hari
  refund_period_ends_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- G. PUSTAKA PENGGUNA (GAMES YANG DIMILIKI USER)
CREATE TABLE public.user_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE RESTRICT,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL, -- NULL jika produk gratis
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_downloaded_at TIMESTAMPTZ,
  CONSTRAINT uq_user_game UNIQUE (user_id, game_id)
);

-- H. ULASAN & RATING KOMUNITAS (Hanya bagi pemilik game terverifikasi)
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating NUMERIC(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
  playtime_hours NUMERIC(4,1) NOT NULL DEFAULT 1.0,
  content TEXT NOT NULL,
  helpful_count INT NOT NULL DEFAULT 0,
  verified_purchase BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_user_game_review UNIQUE (game_id, user_id)
);

-- I. PENCAIRAN DANA DEVELOPER (PAYOUT LEDGER)
CREATE TABLE public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  bank_account_id UUID NOT NULL REFERENCES public.developer_bank_accounts(id) ON DELETE RESTRICT,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  status payout_status NOT NULL DEFAULT 'pending',
  transfer_proof_url TEXT,
  admin_notes TEXT,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES public.profiles(id)
);

-- ==============================================================================
-- 4. OTOMASI TRIGGERS & FUNGSI DATABASE
-- ==============================================================================

-- Trigger 1: Otomatis Membuat Profil Pengguna Saat Registrasi di Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, full_name, avatar_url, role, dev_status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || SUBSTRING(NEW.id::TEXT, 1, 8)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    'user',
    'none'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- Trigger 2: Kalkulasi Otomatis Royalti 90% dan Komisi 10% Sebelum Order Dibuat
CREATE OR REPLACE FUNCTION public.calculate_order_commissions()
RETURNS TRIGGER AS $$
BEGIN
  NEW.platform_commission := ROUND(NEW.amount * 0.10, 2);
  NEW.developer_earning := NEW.amount - NEW.platform_commission;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER before_order_inserted
BEFORE INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.calculate_order_commissions();


-- Trigger 3: Otomatis Masukkan ke Pustaka User Ketika Status Order Menjadi "settlement"
CREATE OR REPLACE FUNCTION public.handle_order_settlement()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'settlement' AND OLD.status != 'settlement' THEN
    -- 1. Masukkan ke pustaka jika belum ada
    INSERT INTO public.user_library (user_id, game_id, order_id, acquired_at)
    VALUES (NEW.user_id, NEW.game_id, NEW.id, NOW())
    ON CONFLICT (user_id, game_id) DO NOTHING;

    -- 2. Set masa garansi refund 14 hari
    NEW.refund_period_ends_at := NOW() + INTERVAL '14 days';

    -- 3. Update metrik penjualan game
    UPDATE public.games
    SET total_sales_count = total_sales_count + 1,
        total_downloads = total_downloads + 1
    WHERE id = NEW.game_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_order_status_settlement
BEFORE UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.handle_order_settlement();


-- Trigger 4: Otomatis Update Rata-rata Rating Game Saat Ulasan Ditambah / Diedit
CREATE OR REPLACE FUNCTION public.update_game_ratings()
RETURNS TRIGGER AS $$
DECLARE
  target_game_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_game_id := OLD.game_id;
  ELSE
    target_game_id := NEW.game_id;
  END IF;

  UPDATE public.games
  SET 
    avg_rating = COALESCE((SELECT ROUND(AVG(rating), 2) FROM public.reviews WHERE game_id = target_game_id), 0.00),
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE game_id = target_game_id)
  WHERE id = target_game_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_review_changed
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.update_game_ratings();

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Aktifkan RLS di seluruh tabel
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_changelogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

-- Helper fungsi cek apakah pengguna adalah Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Kebijakan: profiles
CREATE POLICY "Semua orang bisa melihat profil publik" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Pengguna dapat mengedit profil sendiri" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin dapat mengelola seluruh profil" ON public.profiles FOR ALL USING (public.is_admin());

-- Kebijakan: games
CREATE POLICY "Publik dapat melihat game terbit" ON public.games FOR SELECT USING (status = 'published');
CREATE POLICY "Developer dapat melihat seluruh game miliknya" ON public.games FOR SELECT USING (auth.uid() = developer_id);
CREATE POLICY "Developer dapat mengedit game miliknya" ON public.games FOR UPDATE USING (auth.uid() = developer_id);
CREATE POLICY "Developer dapat menambah game draf" ON public.games FOR INSERT WITH CHECK (auth.uid() = developer_id);
CREATE POLICY "Admin dapat melihat dan mengedit seluruh game" ON public.games FOR ALL USING (public.is_admin());

-- Kebijakan: game_specifications & changelogs
CREATE POLICY "Publik dapat membaca spesifikasi game" ON public.game_specifications FOR SELECT USING (true);
CREATE POLICY "Publik dapat membaca changelog" ON public.game_changelogs FOR SELECT USING (true);
CREATE POLICY "Developer dan admin dapat mengelola spesifikasi" ON public.game_specifications FOR ALL USING (
  EXISTS (SELECT 1 FROM public.games WHERE id = game_id AND (developer_id = auth.uid() OR public.is_admin()))
);
CREATE POLICY "Developer dan admin dapat mengelola changelog" ON public.game_changelogs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.games WHERE id = game_id AND (developer_id = auth.uid() OR public.is_admin()))
);

-- Kebijakan: orders
CREATE POLICY "Pengguna dapat melihat transaksi miliknya" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Developer dapat melihat riwayat penjualan game miliknya" ON public.orders FOR SELECT USING (auth.uid() = developer_id);
CREATE POLICY "Admin dapat mengelola seluruh order" ON public.orders FOR ALL USING (public.is_admin());

-- Kebijakan: user_library
CREATE POLICY "Pengguna hanya dapat melihat pustaka game miliknya" ON public.user_library FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Pengguna dapat menambahkan game gratis ke pustaka" ON public.user_library FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Kebijakan: reviews
CREATE POLICY "Publik dapat membaca ulasan" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Hanya pemilik game yang dapat menulis ulasan" ON public.reviews FOR INSERT WITH CHECK (
  auth.uid() = user_id AND EXISTS (SELECT 1 FROM public.user_library WHERE user_id = auth.uid() AND game_id = reviews.game_id)
);
CREATE POLICY "Pengguna dapat mengedit ulasan sendiri" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

-- Kebijakan: developer_profiles & bank accounts
CREATE POLICY "Developer dapat melihat dan mengedit data studionya" ON public.developer_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Developer dapat melihat rekening banknya" ON public.developer_bank_accounts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.developer_profiles WHERE id = developer_id AND user_id = auth.uid())
);
CREATE POLICY "Admin dapat melihat dan memverifikasi seluruh developer & bank" ON public.developer_profiles FOR ALL USING (public.is_admin());
CREATE POLICY "Admin dapat melihat seluruh rekening bank developer" ON public.developer_bank_accounts FOR ALL USING (public.is_admin());

-- ==============================================================================
-- 6. SETUP STORAGE BUCKETS SUPABASE
-- ==============================================================================

-- Buat Bucket Penyimpanan
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('game-covers', 'game-covers', true),   -- Public: Cover 16:9 & Screenshots
  ('game-builds', 'game-builds', false)   -- Private: Berkas .zip/.apk (Download via Signed URL)
ON CONFLICT (id) DO NOTHING;

-- Kebijakan Akses Bucket Cover (Publik Read)
CREATE POLICY "Publik dapat melihat cover dan screenshot" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'game-covers');

CREATE POLICY "Developer terdaftar dapat mengunggah cover" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'game-covers' AND auth.role() = 'authenticated');

-- Kebijakan Akses Bucket Builds (Hanya Pemilik Game di user_library yang Boleh Unduh)
CREATE POLICY "Hanya pembeli berhak mengunduh file game" 
ON storage.objects FOR SELECT 
USING (
  bucket_id = 'game-builds' AND (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.games g
      JOIN public.user_library ul ON ul.game_id = g.id
      WHERE ul.user_id = auth.uid() AND g.storage_file_path = name
    ) OR
    EXISTS (
      SELECT 1 FROM public.games g
      WHERE g.developer_id = auth.uid() AND g.storage_file_path = name
    )
  )
);

-- ==============================================================================
-- 7. SEED DATA (DATA AWAL UNTUK PENGUJIAN / SEED LOKAL)
-- ==============================================================================

-- CATATAN PENTING UNTUK PENGGUNAAN HOSTED / PRODUCTION:
-- Di lingkungan produksi atau hosted Supabase:
-- 1. Jangan membuat pengguna dengan insert langsung ke auth.users.
-- 2. Buat akun developer melalui UI Sign Up aplikasi SideLoad atau Dashboard Supabase (Authentication -> Users).
-- 3. Ambil User UID dari dashboard, lalu tautkan ke tabel developer_profiles dengan query:
--      UPDATE public.profiles SET role = 'developer', dev_status = 'approved' WHERE id = '<USER_UID>';
--      INSERT INTO public.developer_profiles (user_id, studio_name, contact_email, portfolio_url, description, status)
--      VALUES ('<USER_UID>', 'Nama Studio', 'email@studio.id', 'https://itch.io/...', 'Deskripsi', 'approved');
--
-- Blok di bawah ini ditujukan untuk lingkungan lokal/test dengan ID pengguna konsisten.
DO $$
DECLARE
  -- ID Pengguna Konsisten (Deterministic UUID untuk pengujian lokal/test)
  dev_user_id CONSTANT UUID := '00000000-0000-0000-0000-000000000001'::UUID;
  admin_user_id CONSTANT UUID := '00000000-0000-0000-0000-000000000002'::UUID;
  dev_profile_id CONSTANT UUID := '00000000-0000-0000-0000-000000000011'::UUID;
  
  -- ID Game Konsisten
  game1_id CONSTANT UUID := '11111111-1111-1111-1111-111111111101'::UUID;
  game2_id CONSTANT UUID := '11111111-1111-1111-1111-111111111102'::UUID;
  game3_id CONSTANT UUID := '11111111-1111-1111-1111-111111111103'::UUID;
  game4_id CONSTANT UUID := '11111111-1111-1111-1111-111111111104'::UUID;
  
  target_dev_id UUID := dev_user_id;
BEGIN
  -- 0. Perbaiki baris auth.users yang berpotensi memiliki token bernilai NULL
  -- (Penyebab utama galat GoTrue: 'Database error querying schema')
  UPDATE auth.users
  SET 
    confirmation_token = COALESCE(confirmation_token, ''),
    recovery_token = COALESCE(recovery_token, ''),
    email_change_token_new = COALESCE(email_change_token_new, ''),
    email_change = COALESCE(email_change, '')
  WHERE 
    confirmation_token IS NULL 
    OR recovery_token IS NULL 
    OR email_change_token_new IS NULL 
    OR email_change IS NULL;

  -- 1. Buat Pengguna di auth.users Terlebih Dahulu (Khusus Lingkungan Lokal / Test)
  -- Jika sudah ada pengguna terdaftar dengan email ini di hosted, gunakan ID pengguna tersebut.
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = 'bagas@nusantarahorizon.id') THEN
    SELECT id INTO target_dev_id FROM auth.users WHERE email = 'bagas@nusantarahorizon.id' LIMIT 1;
  ELSE
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change
    ) VALUES (
      dev_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'bagas@nusantarahorizon.id',
      crypt('password123', gen_salt('bf')),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"username":"bagas_dev","full_name":"Bagas Pratama"}'::jsonb,
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      dev_user_id,
      dev_user_id,
      dev_user_id,
      json_build_object('sub', dev_user_id::text, 'email', 'bagas@nusantarahorizon.id')::jsonb,
      'email',
      NOW(),
      NOW(),
      NOW()
    )
    ON CONFLICT (provider, provider_id) DO NOTHING;

    target_dev_id := dev_user_id;
  END IF;

  -- 2. Pastikan profil pengguna ada dan diperbarui ke role 'developer' dan dev_status = 'approved'
  -- Trigger on_auth_user_created membuat profil default; pernyataan ini memperbarui role dan status approval.
  INSERT INTO public.profiles (id, username, email, full_name, role, dev_status)
  VALUES (target_dev_id, 'bagas_dev', 'bagas@nusantarahorizon.id', 'Bagas Pratama', 'developer', 'approved')
  ON CONFLICT (id) DO UPDATE
  SET 
    role = 'developer',
    dev_status = 'approved',
    full_name = EXCLUDED.full_name,
    username = EXCLUDED.username,
    updated_at = NOW();

  -- 3. Akun Admin Kurasi untuk Lingkungan Test / Lokal
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@sideload.id' OR id = admin_user_id) THEN
    INSERT INTO auth.users (
      id,
      instance_id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change
    ) VALUES (
      admin_user_id,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'admin@sideload.id',
      crypt('admin123', gen_salt('bf')),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"username":"admin_kurasi","full_name":"Admin Kurasi SideLoad"}'::jsonb,
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO auth.identities (
      id,
      user_id,
      provider_id,
      identity_data,
      provider,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      admin_user_id,
      admin_user_id,
      admin_user_id,
      json_build_object('sub', admin_user_id::text, 'email', 'admin@sideload.id')::jsonb,
      'email',
      NOW(),
      NOW(),
      NOW()
    )
    ON CONFLICT (provider, provider_id) DO NOTHING;
  END IF;

  INSERT INTO public.profiles (id, username, email, full_name, role, dev_status)
  VALUES (admin_user_id, 'admin_kurasi', 'admin@sideload.id', 'Admin Kurasi SideLoad', 'admin', 'approved')
  ON CONFLICT (id) DO UPDATE
  SET 
    role = 'admin',
    dev_status = 'approved',
    full_name = EXCLUDED.full_name,
    updated_at = NOW();

  -- 4. Insert / Perbarui Detail Profil Developer & Rekening Bank
  INSERT INTO public.developer_profiles (
    id, 
    user_id, 
    studio_name, 
    contact_email, 
    portfolio_url, 
    description, 
    status
  ) VALUES (
    dev_profile_id, 
    target_dev_id, 
    'Nusantara Horizon Studios', 
    'bagas@nusantarahorizon.id', 
    'https://itch.io/profile/nusantara-horizon',
    'Fokus pada game petualangan naratif atmosferik nusantara.',
    'approved'
  )
  ON CONFLICT (user_id) DO UPDATE
  SET 
    studio_name = EXCLUDED.studio_name,
    status = 'approved',
    contact_email = EXCLUDED.contact_email;

  INSERT INTO public.developer_bank_accounts (
    developer_id, 
    bank_name, 
    account_number, 
    account_holder, 
    is_verified
  ) VALUES (
    dev_profile_id, 
    'Bank Central Asia (BCA)', 
    '827-019-3312', 
    'Nusantara Horizon Studio', 
    true
  )
  ON CONFLICT (developer_id) DO UPDATE
  SET 
    bank_name = EXCLUDED.bank_name,
    account_number = EXCLUDED.account_number,
    account_holder = EXCLUDED.account_holder,
    is_verified = true;

  -- 5. Insert Game 1: Kala: Warisan Kabut
  INSERT INTO public.games (
    id, slug, developer_id, title, genre, platforms, price, 
    short_description, description, cover_url, release_date, 
    file_size, version, status, avg_rating, review_count, total_sales_count
  ) VALUES (
    game1_id,
    'kala-warisan-kabut',
    target_dev_id,
    'Kala: Warisan Kabut',
    'Petualangan Naratif, Teka-teki',
    ARRAY['WIN'],
    45000.00,
    'Jelajahi peradaban lereng pegunungan mistis Jawa kuno yang terlupakan. Pecahkan teka-teki lingkungan berbasis waktu dan dengarkan ritme gending gamelan minimalis yang memikat.',
    'Kala: Warisan Kabut adalah game petualangan teka-teki atmosferik berlatar dataran tinggi mistis nusantara masa lampau.',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=900&auto=format&fit=crop',
    '12 Jan 2026',
    '1.4 GB',
    'v1.2.0',
    'published',
    4.80,
    124,
    280
  ) 
  ON CONFLICT (slug) DO UPDATE
  SET 
    price = EXCLUDED.price,
    status = EXCLUDED.status,
    developer_id = EXCLUDED.developer_id;

  -- 6. Insert Spesifikasi Game 1 (Lengkap: 12 Kolom dan 12 Nilai, Minimum & Rekomendasi)
  INSERT INTO public.game_specifications (
    game_id, 
    features, 
    min_os, 
    min_processor, 
    min_memory, 
    min_graphics, 
    min_storage,
    rec_os,
    rec_processor,
    rec_memory,
    rec_graphics,
    rec_storage
  ) VALUES (
    game1_id,
    ARRAY[
      'Eksplorasi Murni: Lanskap visual Zero HUD',
      'Teka-teki Spasial Lingkungan: 18 ruang puzzle kuil',
      'Musik Akustik Otentik: 12 komposisi gamelan kontemporer',
      'Dukungan Pengontrol Penuh Gamepad'
    ],
    'Windows 10 64-bit', 'Intel Core i3-4160', '4 GB RAM', 'GeForce GTX 750 Ti', '2 GB ruang kosong',
    'Windows 11 64-bit', 'Intel Core i5-8400', '8 GB RAM', 'NVIDIA GTX 1060', '2 GB ruang kosong SSD'
  ) 
  ON CONFLICT (game_id) DO UPDATE
  SET 
    features = EXCLUDED.features,
    min_os = EXCLUDED.min_os,
    min_processor = EXCLUDED.min_processor,
    min_memory = EXCLUDED.min_memory,
    min_graphics = EXCLUDED.min_graphics,
    min_storage = EXCLUDED.min_storage,
    rec_os = EXCLUDED.rec_os,
    rec_processor = EXCLUDED.rec_processor,
    rec_memory = EXCLUDED.rec_memory,
    rec_graphics = EXCLUDED.rec_graphics,
    rec_storage = EXCLUDED.rec_storage;

  -- 7. Insert Game 2: Kopi Malam: Kisah Sudut Kota
  INSERT INTO public.games (
    id, slug, developer_id, title, genre, platforms, price, 
    short_description, description, cover_url, release_date, 
    file_size, version, status, avg_rating, review_count
  ) VALUES (
    game2_id,
    'kopi-malam-kisah-sudut-kota',
    target_dev_id,
    'Kopi Malam: Kisah Sudut Kota',
    'Naratif, Simulasi Kehidupan',
    ARRAY['WIN', 'WEB'],
    35000.00,
    'Dengarkan kisah malam warga kota di sebuah kedai kopi tenda pinggir jalan sembari meracik minuman hangat yang menenangkan.',
    'Di tengah hiruk pikuk jalanan malam kota besar, sebuah kedai kopi kecil menjadi tempat berlabuh.',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=900&auto=format&fit=crop',
    '04 Jan 2026',
    '850 MB',
    'v1.0.4',
    'published',
    4.70,
    86
  ) 
  ON CONFLICT (slug) DO UPDATE
  SET 
    price = EXCLUDED.price,
    status = EXCLUDED.status,
    developer_id = EXCLUDED.developer_id;

  -- 8. Insert Game 3: Memori Kaset Pita (Gratis)
  INSERT INTO public.games (
    id, slug, developer_id, title, genre, platforms, price, 
    short_description, description, cover_url, release_date, 
    file_size, version, status, avg_rating, review_count
  ) VALUES (
    game3_id,
    'memori-kaset-pita',
    target_dev_id,
    'Memori Kaset Pita',
    'Fiksi Interaktif, Nostalgia 90an',
    ARRAY['WEB'],
    0.00,
    'Putar kembali rekaman pita kaset lawas dari kamar tidur tahun 1999 dan telusuri jejak pesan rahasia sahabat masa kecil.',
    'Game naratif interaktif santai yang dimainkan langsung di peramban web.',
    'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=900&auto=format&fit=crop',
    '15 Jan 2026',
    '120 MB',
    'v1.1',
    'published',
    4.60,
    95
  ) 
  ON CONFLICT (slug) DO UPDATE
  SET 
    price = EXCLUDED.price,
    status = EXCLUDED.status,
    developer_id = EXCLUDED.developer_id;

  -- 9. Insert Game 4: Lentera Rimba (Status: revision_needed untuk Dasbor)
  INSERT INTO public.games (
    id, slug, developer_id, title, genre, platforms, price, 
    short_description, description, cover_url, release_date, 
    file_size, version, status, curator_feedback
  ) VALUES (
    game4_id,
    'lentera-rimba',
    target_dev_id,
    'Lentera Rimba',
    'Eksplorasi Alam',
    ARRAY['WIN'],
    30000.00,
    'Jelajahi hutan belantara tropis Kalimantan dengan lentera pemandu arah.',
    'Sebuah game petualangan hutan hujan tropis dengan grafis menawan.',
    'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?q=80&w=400&auto=format&fit=crop',
    '23 Mei 2025',
    '320 MB',
    'v0.8.1',
    'revision_needed',
    'Berkas executable belum menyertakan file lisensi font open-source dan cover etalase terdapat watermark pihak ketiga. Harap unggah ulang paket rilis yang bersih.'
  ) 
  ON CONFLICT (slug) DO UPDATE
  SET 
    status = EXCLUDED.status,
    curator_feedback = EXCLUDED.curator_feedback,
    developer_id = EXCLUDED.developer_id;

END $$;
