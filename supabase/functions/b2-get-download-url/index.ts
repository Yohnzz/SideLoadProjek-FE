// Supabase Edge Function: b2-get-download-url
// Menghasilkan Presigned GET URL dari Backblaze B2 untuk Unduhan Aman & Terverifikasi

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { S3Client, GetObjectCommand } from 'https://esm.sh/@aws-sdk/client-s3@3.500.0'
import { getSignedUrl } from 'https://esm.sh/@aws-sdk/s3-request-presigner@3.500.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Tangani CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Header otorisasi diperlukan' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    // 1. Verifikasi Pengguna
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Harap masuk ke akun terlebih dahulu' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. Baca Body
    const { game_id } = await req.json()
    if (!game_id) {
      return new Response(JSON.stringify({ error: 'game_id diperlukan' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 3. Ambil Metadata Game dari Database Supabase
    const { data: game, error: gameError } = await supabaseClient
      .from('games')
      .select('id, title, version, price, developer_id, storage_file_path')
      .eq('id', game_id)
      .single()

    if (gameError || !game) {
      return new Response(JSON.stringify({ error: 'Karya game tidak ditemukan di database' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!game.storage_file_path) {
      return new Response(
        JSON.stringify({ error: 'Berkas instalasi game belum diunggah atau belum tersedia di cloud storage.' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // 4. Verifikasi Hak Kepemilikan (Authorization Guard)
    const isFree = Number(game.price) === 0
    const isDeveloperOrOwner = game.developer_id === user.id

    if (!isFree && !isDeveloperOrOwner) {
      const { data: owned, error: libError } = await supabaseClient
        .from('user_library')
        .select('id')
        .eq('user_id', user.id)
        .eq('game_id', game.id)
        .maybeSingle()

      if (libError || !owned) {
        return new Response(
          JSON.stringify({
            error: 'Akses ditolak: Karya berbayar ini belum ada di Pustaka akun Anda.',
          }),
          {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
    }

    // 5. Konfigurasi Kredensial Backblaze B2 (S3 API)
    const b2Endpoint = Deno.env.get('B2_ENDPOINT') || 'https://s3.us-west-004.backblazeb2.com'
    const b2Region = Deno.env.get('B2_REGION') || 'us-west-004'
    const b2Bucket = Deno.env.get('B2_BUCKET_NAME') || 'sideload-games-vault'
    const b2KeyId = Deno.env.get('B2_APPLICATION_KEY_ID')
    const b2AppKey = Deno.env.get('B2_APPLICATION_KEY')

    if (!b2KeyId || !b2AppKey) {
      return new Response(
        JSON.stringify({
          error: 'Kredensial Backblaze B2 belum dikonfigurasi di server.',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const s3Client = new S3Client({
      endpoint: b2Endpoint,
      region: b2Region,
      credentials: {
        accessKeyId: b2KeyId,
        secretAccessKey: b2AppKey,
      },
    })

    // 6. Buat Presigned URL GET (Berlaku 60 Menit)
    const downloadFileName = `${game.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_${game.version || 'v1.0'}.zip`

    const command = new GetObjectCommand({
      Bucket: b2Bucket,
      Key: game.storage_file_path,
      ResponseContentDisposition: `attachment; filename="${downloadFileName}"`,
    })

    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

    // 7. Catat Counter Unduhan di Database
    await supabaseClient.rpc('increment_game_download', { p_game_id: game.id }).catch(() => {})

    return new Response(
      JSON.stringify({
        success: true,
        downloadUrl,
        fileName: downloadFileName,
        expiresIn: 3600,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (err: any) {
    console.error('Error b2-get-download-url:', err)
    return new Response(JSON.stringify({ error: err.message || 'Terjadi kesalahan sistem' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

