import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabase();
    
    // Update role to 'premium'
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'premium' })
      .eq('id', userId);

    if (error) {
      console.error('Update Role Error:', error);
      return NextResponse.json(
        { error: 'Gagal memperbarui status akun' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Akun berhasil di-upgrade' });

  } catch (error) {
    console.error('Upgrade API Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
