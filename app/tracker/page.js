'use client';

import { useState, useEffect } from 'react';
import ScannerCamera from '@/components/ScannerCamera';
import QuestionnaireModal from '@/components/QuestionnaireModal';

export default function TrackerPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessionDetail, setSessionDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Update flow states
  const [updateMode, setUpdateMode] = useState(null); // null | 'capture' | 'questionnaire' | 'analyzing'
  const [updateImageData, setUpdateImageData] = useState(null);
  const [updateResult, setUpdateResult] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  async function fetchSessions() {
    try {
      const res = await fetch('/api/tracker');
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions || []);
      }
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSessionDetail(sessionId) {
    setDetailLoading(true);
    try {
      const res = await fetch(`/api/tracker?sessionId=${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setSessionDetail(data);
      }
    } catch (err) {
      console.error('Failed to fetch session detail:', err);
    } finally {
      setDetailLoading(false);
    }
  }

  function handleSelectSession(session) {
    setSelectedSession(session);
    fetchSessionDetail(session.id);
    setUpdateMode(null);
    setUpdateResult(null);
  }

  function handleImageCapture(data) {
    setUpdateImageData(data);
    setUpdateMode('questionnaire');
  }

  async function handleQuestionnaireSubmit(questionnaire) {
    setUpdateMode('analyzing');
    try {
      const res = await fetch('/api/tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_update',
          sessionId: selectedSession.id,
          imageBase64: updateImageData.base64,
          mimeType: updateImageData.mimeType,
          bodyLocation: questionnaire.bodyLocation,
          symptoms: questionnaire.symptoms,
          description: questionnaire.description,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setUpdateResult(data);
        // Refresh session detail
        fetchSessionDetail(selectedSession.id);
      }
    } catch (err) {
      console.error('Failed to add update:', err);
    } finally {
      setUpdateMode(null);
    }
  }

  async function handleResolve(sessionId) {
    try {
      const res = await fetch('/api/tracker', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, status: 'RESOLVED' }),
      });
      if (res.ok) {
        fetchSessions();
        if (selectedSession?.id === sessionId) {
          setSelectedSession((prev) => ({ ...prev, status: 'RESOLVED' }));
        }
      }
    } catch (err) {
      console.error('Failed to resolve session:', err);
    }
  }

  async function handleDelete(sessionId) {
    if (!confirm('Hapus sesi pemantauan ini beserta seluruh datanya?')) return;
    try {
      const res = await fetch(`/api/tracker?sessionId=${sessionId}`, { method: 'DELETE' });
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        if (selectedSession?.id === sessionId) {
          setSelectedSession(null);
          setSessionDetail(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  }

  // Session detail view
  if (selectedSession) {
    const scans = sessionDetail?.scans || [];
    const firstScan = scans[0];
    const latestScan = scans[scans.length - 1];

    return (
      <div className="container page-content">
        <div style={{ marginBottom: '20px' }}>
          <button
            onClick={() => { setSelectedSession(null); setSessionDetail(null); setUpdateResult(null); }}
            style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', fontSize: '0.875rem', fontFamily: 'var(--font-family)', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <i className="las la-arrow-left" /> Kembali
          </button>
        </div>

        <div className="flex-between" style={{ marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="page-title" style={{ fontSize: '1.25rem' }}>{selectedSession.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span className={`badge ${selectedSession.status === 'MONITORING' ? 'badge-cyan' : 'badge-green'}`}>
                {selectedSession.status}
              </span>
              <span className="text-meta">{formatDate(selectedSession.created_at)}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {selectedSession.status === 'MONITORING' && (
              <button
                className="btn btn-ghost"
                onClick={() => handleResolve(selectedSession.id)}
                style={{ padding: '8px 16px', fontSize: '0.6875rem' }}
              >
                SELESAI
              </button>
            )}
            <button
              className="btn btn-ghost"
              onClick={() => handleDelete(selectedSession.id)}
              style={{ padding: '8px 16px', fontSize: '0.6875rem', borderColor: 'rgba(var(--danger-red-rgb), 0.3)', color: 'var(--danger-red)' }}
            >
              HAPUS
            </button>
          </div>
        </div>

        {detailLoading ? (
          <div className="flex-center" style={{ padding: '48px 0' }}><div className="spinner" /></div>
        ) : (
          <>
            {/* Side-by-side comparison */}
            {scans.length >= 2 && (
              <div style={{ marginBottom: '24px' }}>
                <h3 className="heading-card" style={{ fontSize: '0.875rem', marginBottom: '12px' }}>
                  Perbandingan Visual
                </h3>
                <div className="comparison">
                  <div className="comparison-panel">
                    <div className="comparison-label comparison-label--before">
                      Hari Pertama — {formatDate(firstScan.created_at)}
                    </div>
                    {firstScan.image_url && (
                      <img src={firstScan.image_url} alt="Foto pertama" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
                    )}
                  </div>
                  <div className="comparison-panel">
                    <div className="comparison-label comparison-label--after">
                      Terbaru — {formatDate(latestScan.created_at)}
                    </div>
                    {latestScan.image_url && (
                      <img src={latestScan.image_url} alt="Foto terbaru" style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
                    )}
                  </div>
                </div>

                {/* Progression status */}
                {latestScan.progression_status && (
                  <div style={{
                    textAlign: 'center',
                    marginTop: '16px',
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    background: latestScan.progression_status === 'MEMBAIK'
                      ? 'rgba(0, 230, 118, 0.08)'
                      : latestScan.progression_status === 'MEMBURUK'
                        ? 'rgba(var(--danger-red-rgb), 0.08)'
                        : 'rgba(255, 164, 43, 0.08)',
                    border: `1px solid ${latestScan.progression_status === 'MEMBAIK'
                      ? 'rgba(0, 230, 118, 0.2)'
                      : latestScan.progression_status === 'MEMBURUK'
                        ? 'rgba(var(--danger-red-rgb), 0.2)'
                        : 'rgba(255, 164, 43, 0.2)'}`,
                  }}>
                    <p style={{
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      color: latestScan.progression_status === 'MEMBAIK'
                        ? 'var(--success-mint)'
                        : latestScan.progression_status === 'MEMBURUK'
                          ? 'var(--danger-red)'
                          : 'var(--warning-amber)',
                    }}>
                      {latestScan.progression_status}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Update result */}
            {updateResult && (
              <div className="card" style={{ marginBottom: '16px' }}>
                <div className="card-body">
                  <h3 className="heading-card" style={{ fontSize: '0.875rem', marginBottom: '8px' }}>
                    Hasil Evaluasi Terbaru
                  </h3>
                  <p className="text-body" style={{ marginBottom: '8px' }}>
                    {updateResult.analysis?.analysis_summary || updateResult.analysis?.causes}
                  </p>
                  {updateResult.analysis?.handling_tips && (
                    <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {updateResult.analysis.handling_tips.map((tip, i) => (
                        <li key={i} className="text-body">{tip}</li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            )}

            {/* Scan history timeline */}
            <div style={{ marginBottom: '24px' }}>
              <h3 className="heading-card" style={{ fontSize: '0.875rem', marginBottom: '12px' }}>
                Riwayat Pemindaian ({scans.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {scans.map((scan, i) => (
                  <div key={scan.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
                    {scan.image_url && (
                      <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: 'var(--bg-input)' }}>
                        <img src={scan.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {i === 0 ? 'Scan Awal' : `Update #${i}`}
                      </p>
                      <p className="text-meta">{formatDate(scan.created_at)}</p>
                    </div>
                    {scan.progression_status && (
                      <span className={`badge ${scan.progression_status === 'MEMBAIK' ? 'badge-green' : scan.progression_status === 'MEMBURUK' ? 'badge-red' : 'badge-amber'}`}>
                        {scan.progression_status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Add update button */}
            {selectedSession.status === 'MONITORING' && !updateMode && (
              <button
                className="btn btn-primary"
                onClick={() => setUpdateMode('capture')}
                style={{ width: '100%', padding: '14px', fontSize: '0.875rem' }}
                id="btn-add-update"
              >
                <i className="las la-camera" style={{ fontSize: '1.125rem' }} />
                AMBIL FOTO TERBARU
              </button>
            )}

            {/* Update flow */}
            {updateMode === 'capture' && (
              <div style={{ marginTop: '20px' }}>
                <ScannerCamera onCapture={handleImageCapture} />
              </div>
            )}

            {updateMode === 'questionnaire' && (
              <QuestionnaireModal
                imagePreview={updateImageData?.preview}
                onSubmit={handleQuestionnaireSubmit}
                onBack={() => setUpdateMode('capture')}
              />
            )}

            {updateMode === 'analyzing' && (
              <div className="flex-center" style={{ flexDirection: 'column', padding: '48px 0' }}>
                <div className="spinner spinner-lg" style={{ marginBottom: '16px' }} />
                <p className="heading-card">Menganalisis Perkembangan...</p>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  // Sessions list view
  return (
    <div className="container page-content">
      <div className="page-header">
        <h1 className="page-title">
          <i className="las la-heartbeat" style={{ color: 'var(--accent-cyan)', marginRight: '8px' }} />
          Skin Tracker
        </h1>
        <p className="page-subtitle">
          Pantau perkembangan kondisi kulit Anda dari waktu ke waktu
        </p>
      </div>

      {loading ? (
        <div className="flex-center" style={{ padding: '64px 0' }}>
          <div className="spinner" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="empty-state">
          <i className="las la-heartbeat" />
          <h3>Belum Ada Sesi Pemantauan</h3>
          <p>
            Lakukan scan terlebih dahulu, lalu tekan &quot;Pantau Luka Ini&quot; untuk memulai pemantauan.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {sessions.map((session) => (
            <div
              key={session.id}
              className="card"
              onClick={() => handleSelectSession(session)}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', padding: '16px' }}
              role="button"
              tabIndex={0}
            >
              {session.latestScan?.image_url && (
                <div style={{ width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: 'var(--bg-input)' }}>
                  <img src={session.latestScan.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {session.title}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className={`badge ${session.status === 'MONITORING' ? 'badge-cyan' : 'badge-green'}`}>
                    {session.status}
                  </span>
                  {session.latestScan?.progression_status && (
                    <span className={`badge ${session.latestScan.progression_status === 'MEMBAIK' ? 'badge-green' : session.latestScan.progression_status === 'MEMBURUK' ? 'badge-red' : 'badge-amber'}`}>
                      {session.latestScan.progression_status}
                    </span>
                  )}
                  <span className="text-meta">{formatDate(session.created_at)}</span>
                </div>
              </div>
              <i className="las la-chevron-right" style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
