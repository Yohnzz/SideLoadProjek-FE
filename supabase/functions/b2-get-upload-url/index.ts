// Supabase Edge Function: b2-get-upload-url
// Menghasilkan Presigned PUT URL dari Backblaze B2 untuk Direct Upload dari Browser

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { S3Client, PutObjectCommand } from 'https://esm.sh/@aws-sdk/client-s3@3.500.0'
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
      return new Response(JSON.stringify({ error: 'Unauthorized: Sesi tidak valid' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. Baca Body Permintaan
    const { fileName, fileType, isWebBuild } = await req.json()
    if (!fileName) {
      return new Response(JSON.stringify({ error: 'fileName diperlukan' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 3. Konfigurasi Kredensial Backblaze B2 (S3 API)
    const b2Endpoint = Deno.env.get('B2_ENDPOINT') || 'https://s3.us-west-004.backblazeb2.com'
    const b2Region = Deno.env.get('B2_REGION') || 'us-west-004'
    const b2Bucket = Deno.env.get('B2_BUCKET_NAME') || 'sideload-games-vault'
    const b2KeyId = Deno.env.get('B2_APPLICATION_KEY_ID')
    const b2AppKey = Deno.env.get('B2_APPLICATION_KEY')

    if (!b2KeyId || !b2AppKey) {
      return new Response(
        JSON.stringify({
          error: 'Kredensial B2_APPLICATION_KEY_ID atau B2_APPLICATION_KEY belum disetel di environment Supabase.',
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

    // 4. Susun Lokasi Objek File di Bucket
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
    const folder = isWebBuild ? 'web-builds' : 'installers'
    const objectKey = `${folder}/${user.id}/${Date.now()}_${sanitizedName}`

    // 5. Buat Presigned URL PUT (Berlaku 60 Menit)
    const command = new PutObjectCommand({
      Bucket: b2Bucket,
      Key: objectKey,
      ContentType: fileType || 'application/octet-stream',
    })

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
    const cdnBase = Deno.env.get('VITE_B2_CDN_URL') || `${b2Endpoint}/${b2Bucket}`
    const publicUrl = `${cdnBase}/${objectKey}`

    return new Response(
      JSON.stringify({
        success: true,
        uploadUrl,
        objectKey,
        publicUrl,
        expiresIn: 3600,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (err: any) {
    console.error('Error b2-get-upload-url:', err)
    return new Response(JSON.stringify({ error: err.message || 'Terjadi kesalahan internal' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

