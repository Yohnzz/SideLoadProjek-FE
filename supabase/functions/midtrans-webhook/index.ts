// Supabase Edge Function: midtrans-webhook
// Deno / TypeScript runtime

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts'

serve(async (req) => {
  try {
    const payload = await req.json()
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
      transaction_id,
    } = payload

    // 1. Verifikasi Signature Hash dari Midtrans
    // SHA512(order_id + status_code + gross_amount + ServerKey)
    const serverKey = Deno.env.get('MIDTRANS_SERVER_KEY') ?? ''
    const rawSignature = `${order_id}${status_code}${gross_amount}${serverKey}`
    
    const hashBuffer = await crypto.subtle.digest(
      'SHA-512',
      new TextEncoder().encode(rawSignature)
    )
    const expectedSignature = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    if (signature_key !== expectedSignature) {
      return new Response(JSON.stringify({ error: 'Signature Key Invalid' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 2. Gunakan Service Role Key untuk update status order tanpa terhalang RLS
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let newOrderStatus: 'pending' | 'settlement' | 'expire' | 'cancel' = 'pending'

    if (transaction_status === 'capture') {
      if (fraud_status === 'accept') {
        newOrderStatus = 'settlement'
      }
    } else if (transaction_status === 'settlement') {
      newOrderStatus = 'settlement'
    } else if (['cancel', 'deny'].includes(transaction_status)) {
      newOrderStatus = 'cancel'
    } else if (transaction_status === 'expire') {
      newOrderStatus = 'expire'
    }

    // 3. Update Status Order di Database
    // Trigger SQL `on_order_status_settlement` akan otomatis memasukkan game ke `user_library`!
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        status: newOrderStatus,
        payment_method: payment_type,
        midtrans_transaction_id: transaction_id,
      })
      .eq('order_number', order_id)

    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ message: 'OK: Order Berhasil Diperbarui' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
