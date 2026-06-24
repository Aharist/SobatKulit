import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';
import { analyzeSkinCondition } from '@/lib/gemini';
import { createRateLimiter } from '@/lib/rateLimit';
import { validateImagePayload } from '@/lib/apiUtils';

const scanLimiter = createRateLimiter({ limit: 5, windowMs: 60_000 });

export async function POST(request) {
  try {
    // Rate limiting
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!scanLimiter.check(clientIp)) {
      return NextResponse.json(
        { error: 'Terlalu banyak permintaan. Silakan coba lagi dalam 1 menit.' },
        { status: 429 }
      );
    }

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { imageBase64, mimeType, bodyLocation, symptoms, description } = body;

    // Validate image payload
    const validation = validateImagePayload(imageBase64, mimeType);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const supabase = createServerSupabase();

    // Check user limits
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role, scan_count')
      .eq('id', userId)
      .single();

    if (!profileError && userProfile) {
      if (userProfile.role === 'free' && userProfile.scan_count >= 3) {
        return NextResponse.json({ error: 'Limit bulanan sudah habis, yuk upgrade agar bisa scan lebih banyak' }, { status: 403 });
      }
    }

    // Analyze with Gemini
    const analysis = await analyzeSkinCondition(imageBase64, mimeType, {
      bodyLocation,
      symptoms,
      description,
    });

    // Upload image to Supabase Storage
    const fileName = `${userId}/${Date.now()}.${mimeType === 'image/png' ? 'png' : 'jpg'}`;
    const buffer = Buffer.from(imageBase64, 'base64');

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('skin-images')
      .upload(fileName, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    // Store the storage path as image_url (prefixed for identification)
    // On retrieval, API will generate signed URLs dynamically
    let imageUrl = '';
    if (!uploadError && uploadData) {
      imageUrl = `storage://skin-images/${fileName}`;
    }

    // If storage upload fails, store as data URI fallback
    if (!imageUrl) {
      imageUrl = `data:${mimeType};base64,${imageBase64}`;
    }

    // Save scan log to database
    const { data: scanLog, error: dbError } = await supabase
      .from('scan_logs')
      .insert({
        user_id: userId,
        image_url: imageUrl,
        body_location: bodyLocation || null,
        symptoms: symptoms || [],
        description: description || null,
        condition_name: analysis.condition_name,
        confidence_score: analysis.confidence_score,
        causes: analysis.causes,
        handling_tips: analysis.handling_tips,
        is_emergency: analysis.is_emergency,
        progression_status: null,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json({
        analysis,
        saved: false,
        error: 'Analysis successful but failed to save to database',
      });
    }

    // Increment scan_count if user is free
    if (!profileError && userProfile && userProfile.role === 'free') {
      await supabase
        .from('profiles')
        .update({ scan_count: (userProfile.scan_count || 0) + 1 })
        .eq('id', userId);
    }

    // Return the scan with a live signed URL for immediate display
    let displayUrl = imageUrl;
    if (imageUrl.startsWith('storage://skin-images/')) {
      const path = imageUrl.replace('storage://skin-images/', '');
      const { data: signedData } = await supabase.storage
        .from('skin-images')
        .createSignedUrl(path, 24 * 60 * 60);
      if (signedData?.signedUrl) displayUrl = signedData.signedUrl;
    }

    return NextResponse.json({
      analysis,
      scanLog: { ...scanLog, image_url: displayUrl },
      saved: true,
    });
  } catch (err) {
    console.error('Scan API error:', err);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses pemindaian.' },
      { status: 500 }
    );
  }
}
