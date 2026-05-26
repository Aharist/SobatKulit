import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';
import { analyzeProgression } from '@/lib/gemini';

// GET: list sessions or get session detail
export async function GET(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    const supabase = createServerSupabase();

    if (sessionId) {
      // Get session with its scan logs
      const { data: session, error: sessErr } = await supabase
        .from('tracking_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();

      if (sessErr) {
        return NextResponse.json({ error: sessErr.message }, { status: 404 });
      }

      const { data: scans, error: scanErr } = await supabase
        .from('scan_logs')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      return NextResponse.json({ session, scans: scans || [] });
    }

    // List all sessions
    const { data: sessions, error } = await supabase
      .from('tracking_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get latest scan for each session
    const sessionsWithPreview = await Promise.all(
      (sessions || []).map(async (session) => {
        const { data: latestScan } = await supabase
          .from('scan_logs')
          .select('image_url, condition_name, created_at, progression_status')
          .eq('session_id', session.id)
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        return { ...session, latestScan };
      })
    );

    return NextResponse.json({ sessions: sessionsWithPreview });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: create session or add update
export async function POST(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    const supabase = createServerSupabase();

    if (action === 'create_session') {
      const { scanLogId, title } = body;

      // Create tracking session
      const { data: session, error: sessErr } = await supabase
        .from('tracking_sessions')
        .insert({
          user_id: userId,
          title: title || 'Sesi Pemantauan',
        })
        .select()
        .single();

      if (sessErr) {
        return NextResponse.json({ error: sessErr.message }, { status: 500 });
      }

      // Link existing scan log to this session
      if (scanLogId) {
        await supabase
          .from('scan_logs')
          .update({ session_id: session.id })
          .eq('id', scanLogId)
          .eq('user_id', userId);
      }

      return NextResponse.json({ session });
    }

    if (action === 'add_update') {
      const { sessionId, imageBase64, mimeType, bodyLocation, symptoms, description } = body;

      if (!sessionId || !imageBase64) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      // Verify session belongs to user
      const { data: session, error: sessErr } = await supabase
        .from('tracking_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();

      if (sessErr || !session) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      // Get the first scan of this session for comparison
      const { data: firstScan } = await supabase
        .from('scan_logs')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      // Upload new image
      const fileName = `${userId}/${Date.now()}.${mimeType === 'image/png' ? 'png' : 'jpg'}`;
      const buffer = Buffer.from(imageBase64, 'base64');

      const { data: uploadData } = await supabase.storage
        .from('skin-images')
        .upload(fileName, buffer, { contentType: mimeType, upsert: false });

      let imageUrl = '';
      if (uploadData) {
        const { data: urlData } = supabase.storage.from('skin-images').getPublicUrl(fileName);
        imageUrl = urlData?.publicUrl || '';
      }

      // Get first scan image for comparison
      let progressionResult = null;
      if (firstScan && firstScan.image_url) {
        try {
          // Fetch the old image to base64 for comparison
          const oldImageResponse = await fetch(firstScan.image_url);
          if (oldImageResponse.ok) {
            const oldImageBuffer = await oldImageResponse.arrayBuffer();
            const oldImageBase64 = Buffer.from(oldImageBuffer).toString('base64');

            progressionResult = await analyzeProgression(
              oldImageBase64,
              imageBase64,
              mimeType,
              firstScan,
              { bodyLocation, symptoms, description }
            );
          }
        } catch (progressionError) {
          console.error('Progression analysis failed, using basic analysis:', progressionError);
        }
      }

      // If progression analysis failed, do basic analysis
      if (!progressionResult) {
        const { analyzeSkinCondition } = await import('@/lib/gemini');
        progressionResult = await analyzeSkinCondition(imageBase64, mimeType, {
          bodyLocation,
          symptoms,
          description,
        });
        progressionResult.progression_status = 'STABIL';
      }

      // Save new scan log
      const { data: newScan, error: scanErr } = await supabase
        .from('scan_logs')
        .insert({
          session_id: sessionId,
          user_id: userId,
          image_url: imageUrl,
          body_location: bodyLocation || null,
          symptoms: symptoms || [],
          description: description || null,
          condition_name: progressionResult.condition_name,
          confidence_score: progressionResult.confidence_score,
          causes: progressionResult.causes,
          handling_tips: progressionResult.handling_tips,
          is_emergency: progressionResult.is_emergency,
          progression_status: progressionResult.progression_status || 'STABIL',
        })
        .select()
        .single();

      if (scanErr) {
        return NextResponse.json({ error: scanErr.message }, { status: 500 });
      }

      return NextResponse.json({
        scan: newScan,
        analysis: progressionResult,
        firstScan,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err) {
    console.error('Tracker API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH: update session status
export async function PATCH(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, status } = body;

    if (!sessionId || !['MONITORING', 'RESOLVED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const supabase = createServerSupabase();
    const { data, error } = await supabase
      .from('tracking_sessions')
      .update({ status })
      .eq('id', sessionId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ session: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: delete session
export async function DELETE(request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
    }

    const supabase = createServerSupabase();

    // Delete session (cascade will delete scan_logs)
    const { error } = await supabase
      .from('tracking_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
