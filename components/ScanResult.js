'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import EmergencyAlert from './EmergencyAlert';

export default function ScanResult({ result, onReset }) {
  const router = useRouter();
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [tracked, setTracked] = useState(false);

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (result.confidence_score / 100) * circumference;

  async function handleTrackThis() {
    if (!result.scanLogId) return;
    setTrackingLoading(true);
    try {
      const res = await fetch('/api/tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_session',
          scanLogId: result.scanLogId,
          title: result.condition_name,
        }),
      });
      if (res.ok) {
        setTracked(true);
      }
    } catch (err) {
      console.error('Failed to create tracking session:', err);
    } finally {
      setTrackingLoading(false);
    }
  }

  if (result.is_emergency) {
    return (
      <div className="emergency-mode">
        <EmergencyAlert result={result} onReset={onReset} />
      </div>
    );
  }

  return (
    <div className="animate-slide-up" style={{ maxWidth: '640px', margin: '0 auto' }}>
      {/* Image + Confidence */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '20px', padding: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          {result.imagePreview && (
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '12px',
              overflow: 'hidden',
              flexShrink: 0,
              background: 'var(--bg-input)',
            }}>
              <img
                src={result.imagePreview}
                alt="Foto kondisi kulit"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}

          <div style={{ flex: 1, minWidth: '200px' }}>
            <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>NORMAL</span>
            <h2 className="heading-card" style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
              {result.condition_name}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div className="confidence-ring">
                <svg width="80" height="80" viewBox="0 0 100 100">
                  <circle className="confidence-ring__track" cx="50" cy="50" r="45" />
                  <circle
                    className="confidence-ring__fill"
                    cx="50"
                    cy="50"
                    r="45"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                  />
                </svg>
                <span className="confidence-ring__value" style={{ fontSize: '1.125rem' }}>
                  {result.confidence_score}%
                </span>
              </div>
              <div>
                <p className="text-meta">Tingkat Keyakinan AI</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Causes */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="card-body">
          <h3 className="heading-card" style={{ fontSize: '0.875rem', marginBottom: '8px' }}>
            <i className="las la-search-plus" style={{ color: 'var(--accent-cyan)', marginRight: '6px' }} />
            Penyebab
          </h3>
          <p className="text-body">{result.causes}</p>
        </div>
      </div>

      {/* Handling Tips */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="card-body">
          <h3 className="heading-card" style={{ fontSize: '0.875rem', marginBottom: '12px' }}>
            <i className="las la-hand-holding-medical" style={{ color: 'var(--success-mint)', marginRight: '6px' }} />
            Tips Penanganan
          </h3>
          <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {result.handling_tips.map((tip, i) => (
              <li key={i} className="text-body">{tip}</li>
            ))}
          </ol>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div style={{
        background: 'rgba(255, 164, 43, 0.06)',
        border: '1px solid rgba(255, 164, 43, 0.15)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        marginBottom: '20px',
      }}>
        <p className="text-meta" style={{ color: 'var(--warning-amber)' }}>
          <i className="las la-info-circle" style={{ marginRight: '4px' }} />
          {result.medical_disclaimer}
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={onReset} style={{ padding: '12px 24px', fontSize: '0.8125rem' }}>
          <i className="las la-redo-alt" />
          SCAN ULANG
        </button>

        <button
          className="btn btn-ghost"
          onClick={onReset}
          style={{ padding: '12px 24px', fontSize: '0.8125rem' }}
          id="btn-close-result"
        >
          <i className="las la-times" />
          TUTUP
        </button>

        {result.scanLogId && !tracked && (
          <button
            className="btn btn-ghost"
            onClick={handleTrackThis}
            disabled={trackingLoading}
            style={{ padding: '12px 24px', fontSize: '0.8125rem' }}
            id="btn-track-this"
          >
            <i className="las la-heartbeat" />
            {trackingLoading ? 'MENYIMPAN...' : 'PANTAU LUKA INI'}
          </button>
        )}

        {tracked && (
          <button
            className="btn btn-ghost"
            onClick={() => router.push('/tracker')}
            style={{ padding: '12px 24px', fontSize: '0.8125rem', borderColor: 'rgba(0, 230, 118, 0.3)', color: 'var(--success-mint)' }}
          >
            <i className="las la-check-circle" />
            LIHAT DI TRACKER
          </button>
        )}
      </div>
    </div>
  );
}
