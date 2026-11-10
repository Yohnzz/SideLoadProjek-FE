// Supabase Edge Function: create-midtrans-transaction
// Deno / TypeScript runtime

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // 1. Verifikasi User yang sedang Login
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Harap login terlebih dahulu' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { game_id } = await req.json()
    if (!game_id) {
      return new Response(JSON.stringify({ error: 'game_id diperlukan' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 2. Ambil Data Game dari Database
    const { data: game, error: gameError } = await supabaseClient
      .from('games')
      .select('id, title, price, developer_id')
      .eq('id', game_id)
      .single()

    if (gameError || !game) {
      return new Response(JSON.stringify({ error: 'Game tidak ditemukan' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 3. Buat Nomor Pesanan Unik
    const orderNumber = `INV-SL-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 900 + 100)}`

    // 4. Masukkan ke Tabel Orders Supabase
    const { data: newOrder, error: orderInsertError } = await supabaseClient
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        game_id: game.id,
        developer_id: game.developer_id,
        amount: game.price,
        status: 'pending',
      })
      .select()
      .single()

    if (orderInsertError) {
      return new Response(JSON.stringify({ error: orderInsertError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // 5. Panggil Midtrans Snap API (Server-side aman dengan MIDTRANS_SERVER_KEY)
    const midtransServerKey = Deno.env.get('MIDTRANS_SERVER_KEY') ?? ''
    const isProduction = Deno.env.get('MIDTRANS_IS_PRODUCTION') === 'true'
    const snapUrl = isProduction 
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions'

    const authHeader = 'Basic ' + btoa(midtransServerKey + ':')

    const midtransPayload = {
      transaction_details: {
        order_id: orderNumber,
        gross_amount: Math.round(game.price),
      },
      customer_details: {
        email: user.email,
        first_name: user.user_metadata?.username || 'Pemain',
      },
      item_details: [
        {
          id: game.id,
          price: Math.round(game.price),
          quantity: 1,
          name: game.title.slice(0, 50),
        },
      ],
    }

    const midtransRes = await fetch(snapUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(midtransPayload),
    })

    const midtransData = await midtransRes.json()

    if (!midtransRes.ok) {
      return new Response(JSON.stringify({ error: midtransData }), {
        status: midtransRes.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Simpan Snap Token ke Order
    await supabaseClient
      .from('orders')
      .update({ midtrans_snap_token: midtransData.token })
      .eq('id', newOrder.id)

    return new Response(
      JSON.stringify({
        token: midtransData.token,
        redirect_url: midtransData.redirect_url,
        order_number: orderNumber,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
