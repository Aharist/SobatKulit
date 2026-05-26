import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';
import { signScanUrls, extractStoragePath, deleteStorageFile } from '@/lib/apiUtils';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerSupabase();
    const { data: scans, error } = await supabase
      .from('scan_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Gagal memuat riwayat.' }, { status: 500 });
    }

    // Convert stored paths to signed URLs for secure client access
    const signedScans = await signScanUrls(supabase, scans || []);

    return NextResponse.json({ scans: signedScans });
  } catch (err) {
    console.error('History GET error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const scanId = searchParams.get('id');

    if (!scanId) {
      return NextResponse.json({ error: 'Missing scan ID' }, { status: 400 });
    }

    const supabase = createServerSupabase();

    // Fetch the scan record first to get the storage path
    const { data: scanRecord } = await supabase
      .from('scan_logs')
      .select('image_url')
      .eq('id', scanId)
      .eq('user_id', userId)
      .single();

    // Delete the storage file if it exists
    if (scanRecord?.image_url) {
      const storagePath = extractStoragePath(scanRecord.image_url);
      await deleteStorageFile(supabase, storagePath);
    }

    // Delete the database record
    const { error } = await supabase
      .from('scan_logs')
      .delete()
      .eq('id', scanId)
      .eq('user_id', userId);

    if (error) {
      return NextResponse.json({ error: 'Gagal menghapus riwayat.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('History DELETE error:', err);
    return NextResponse.json({ error: 'Terjadi kesalahan.' }, { status: 500 });
  }
}
