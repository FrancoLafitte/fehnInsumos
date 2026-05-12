import { NextResponse } from 'next/server'
import supabaseServer from '@/lib/supabaseServer'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { user_id, items, total } = body

    if (!user_id || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Create order server-side with service role key
    const { data: order, error: orderErr } = await supabaseServer
      .from('orders')
      .insert([{ user_id, total }])
      .select()
      .single()

    if (orderErr) throw orderErr

    const orderItems = items.map((it: any) => ({
      order_id: order.id,
      product_id: it.product_id,
      quantity: it.quantity,
      price: it.price,
    }))

    const { error: itemsErr } = await supabaseServer.from('order_items').insert(orderItems)
    if (itemsErr) throw itemsErr

    return NextResponse.json({ order_id: order.id })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
