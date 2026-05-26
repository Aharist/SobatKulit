import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';
import { analyzeSkinCondition } from '@/lib/gemini';

export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { imageBase64, mimeType, bodyLocation, symptoms, description } = body;

    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
    }

    // Analyze with Gemini
    const analysis = await analyzeSkinCondition(imageBase64, mimeType, {
      bodyLocation,
      symptoms,
      description,
    });

    // Upload image to Supabase Storage
    const supabase = createServerSupabase();
    const fileName = `${userId}/${Date.now()}.${mimeType === 'image/png' ? 'png' : 'jpg'}`;
    const buffer = Buffer.from(imageBase64, 'base64');

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('skin-images')
      .upload(fileName, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    let imageUrl = '';
    if (!uploadError && uploadData) {
      const { data: urlData } = supabase.storage
        .from('skin-images')
        .getPublicUrl(fileName);
      imageUrl = urlData?.publicUrl || '';
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
      // Return analysis even if DB save fails
      return NextResponse.json({
        analysis,
        saved: false,
        error: 'Analysis successful but failed to save to database',
      });
    }

    return NextResponse.json({
      analysis,
      scanLog,
      saved: true,
    });
  } catch (err) {
    console.error('Scan API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
