# Panduan Konfigurasi Supabase & Midtrans untuk SideLoad

Folder ini berisi seluruh rancangan backend database PostgreSQL dan Edge Functions tanpa server untuk platform SideLoad.

---

## 1. Menjalankan Kode SQL di Supabase

1. Buka dashboard proyek Anda di [https://supabase.com](https://supabase.com).
2. Di menu navigasi samping, klik ikon **SQL Editor**.
3. Buat query baru, lalu salin seluruh isi berkas `supabase/schema.sql` dan tempelkan.
4. Klik tombol **Run** (Jalankan).

### Apa Saja yang Otomatis Dibuat oleh SQL ini?

- **Tabel Utama**:
  - `profiles`: Sinkronisasi otomatis dengan akun login Supabase Auth.
  - `developer_profiles`: Menyimpan data studio, portofolio, dan status approval admin.
  - `developer_bank_accounts`: Data rekening bank wajib untuk royalti 90%.
  - `games`: Data etalase, harga, genre, platform, hash SHA-256, dan status moderasi.
  - `game_specifications`: Persyaratan sistem Minimum dan Rekomendasi.
  - `game_changelogs`: Riwayat versi dan catatan update.
  - `orders`: Pencatatan transaksi Midtrans dengan kalkulasi otomatis 90% developer dan 10% platform.
  - `user_library`: Koleksi game milik user yang berhak mengunduh file rilis.
  - `reviews`: Ulasan dan rating yang hanya bisa diisi oleh pemilik game terverifikasi.
  - `payouts`: Rekap permohonan pencairan dana royalti developer.
- **Triggers Otomatis**:
  - `on_auth_user_created`: Otomatis mengisi baris profil pengguna saat registrasi baru.
  - `before_order_inserted`: Menghitung nilai komisi 10% SideLoad dan 90% royalti studio secara akurat.
  - `on_order_status_settlement`: Ketika order dibayar lunas (`settlement`), game otomatis dimasukkan ke `user_library` pembeli dan masa garansi refund 14 hari diaktifkan.
  - `on_review_changed`: Memperbarui nilai rata-rata rating game seketika saat ulasan masuk atau diedit.
- **Keamanan Ketat (Row Level Security / RLS)**:
  - Pembeli hanya bisa melihat pustaka dan transaksi miliknya sendiri.
  - Berkas game berbayar di Supabase Storage hanya dapat diunduh oleh akun yang tercatat memiliki game di tabel `user_library`.
  - Admin memiliki akses khusus via fungsi `is_admin()` untuk menyetujui game dan akun developer.

---

## 2. Storage Buckets di Supabase

Skrip SQL di atas otomatis mengonfigurasi dua bucket penyimpanan:

1. `game-covers` (Public): Digunakan untuk menyimpan gambar poster 16:9 dan tangkapan layar gameplay.
2. `game-builds` (Private): Digunakan untuk menyimpan berkas instalasi `.zip` dan `.apk`. Berkas di bucket ini tidak memiliki tautan publik, melainkan diunduh lewat *Signed URL* berdurasi terbatas khusus bagi pemilik game.

---

## 3. Menjalankan Supabase Edge Functions untuk Midtrans

Dua berkas fungsi telah disiapkan di folder `supabase/functions/`:

1. `create-midtrans-transaction`:
   - Menerima `game_id`.
   - Membuat record order di database.
   - Menghubungi Midtrans Snap API menggunakan `MIDTRANS_SERVER_KEY` secara aman tanpa mengekspos kunci ke browser.
   - Mengembalikan `snap_token` ke React frontend.
2. `midtrans-webhook`:
   - Endpoint HTTP penerima notifikasi notifikasi pembayaran dari Midtrans.
   - Memverifikasi keaslian hash signature SHA-512 dari Midtrans.
   - Mengubah status order menjadi `settlement` secara instan begitu pengguna membayar via QRIS, GoPay, atau Virtual Account.

### Cara Deploy Edge Function Menggunakan Supabase CLI:

```bash
# 1. Login ke Supabase CLI
npx supabase login

# 2. Tautkan ke proyek Anda
npx supabase link --project-ref your-project-id

# 3. Set Secret Kunci Midtrans di Supabase
npx supabase secrets set MIDTRANS_SERVER_KEY="SB-Mid-server-xxxxxxxxxxxx"
npx supabase secrets set MIDTRANS_IS_PRODUCTION="false"

# 4. Deploy fungsi
npx supabase functions deploy create-midtrans-transaction
npx supabase functions deploy midtrans-webhook
```

---

## 4. Konfigurasi Webhook di Dashboard Midtrans

1. Masuk ke [https://dashboard.midtrans.com](https://dashboard.midtrans.com) (Mode Sandbox atau Production).
2. Buka menu **Settings** > **Configuration**.
3. Di kolom **Payment Notification URL**, masukkan URL webhook Supabase Anda:
   `https://<your-project-id>.supabase.co/functions/v1/midtrans-webhook`
4. Simpan perubahan.
