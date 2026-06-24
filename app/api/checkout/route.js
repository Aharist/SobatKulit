import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabase();
    
    // Get user profile for customer details
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, role')
      .eq('id', userId)
      .single();

    if (profile?.role === 'premium') {
      return NextResponse.json({ error: 'Akun Anda sudah Premium' }, { status: 400 });
    }

    // Prepare Midtrans payload. Note: order_id max length is 50 chars.
    const orderId = `PRM-${Date.now()}-${userId.slice(-8)}`;
    const grossAmount = 49000;

    // We can get email from clerk using clerkClient if we need, 
    // but Midtrans only requires order_id and gross_amount for basic Snap.
    // If we want more details, we can add customer_details.
    const payload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: profile?.full_name || 'Pengguna',
        last_name: 'SobatKulit',
      },
      item_details: [
        {
          id: 'PKG-PREMIUM',
          price: grossAmount,
          quantity: 1,
          name: 'Paket Premium SobatKulit 1 Bulan',
        }
      ]
    };

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const authString = Buffer.from(`${serverKey}:`).toString('base64');

    const midtransRes = await fetch('https://app.sandbox.midtrans.com/snap/v1/transactions', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authString}`
      },
      body: JSON.stringify(payload),
    });

    const midtransData = await midtransRes.json();

    if (!midtransRes.ok) {
      console.error('Midtrans Error:', midtransData);
      return NextResponse.json(
        { error: 'Gagal menghubungi payment gateway' },
        { status: 500 }
      );
    }

    return NextResponse.json({ token: midtransData.token });

  } catch (error) {
    console.error('Checkout API Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
