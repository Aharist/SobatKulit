'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RiwayatPage() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const res = await fetch('/api/history');
      if (res.ok) {
        const data = await res.json();
        setScans(data.scans || []);
      }
    } catch (err) {
      console.error('Failed to fetch scan history:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(scanId, e) {
    e.stopPropagation();
    if (!confirm('Hapus riwayat scan ini secara permanen?')) return;
    try {
      const res = await fetch(`/api/history?id=${scanId}`, { method: 'DELETE' });
      if (res.ok) {
        setScans((prev) => prev.filter((s) => s.id !== scanId));
        if (selectedScan?.id === scanId) setSelectedScan(null);
      }
    } catch (err) {
      console.error('Failed to delete scan:', err);
    }
  }

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="container page-content">
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 className="page-title">
            <i className="las la-history" style={{ color: 'var(--accent-cyan)', marginRight: '8px' }} />
            Riwayat Pemindaian
          </h1>
          <p className="page-subtitle">
            Daftar seluruh riwayat hasil pemindaian kulit yang pernah Anda lakukan
          </p>
        </div>
        <Link href="/profile" className="btn btn-ghost" style={{ padding: '10px 20px', fontSize: '0.75rem' }}>
          <i className="las la-user" /> PROFIL SAYA
        </Link>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="flex-center" style={{ padding: '80px 0' }}>
          <div className="spinner spinner-lg" />
        </div>
      ) : scans.length === 0 ? (
        <div className="empty-state card" style={{ padding: '64px 24px' }}>
          <i className="las la-microscope" style={{ fontSize: '4rem', color: 'rgba(var(--accent-cyan-rgb), 0.2)', marginBottom: '16px' }} />
          <h3 className="heading-card" style={{ marginBottom: '8px' }}>Belum Ada Riwayat Pemindaian</h3>
          <p className="text-body" style={{ marginBottom: '24px', maxWidth: '360px' }}>
            Anda belum pernah memindai kondisi kulit menggunakan AI. Mulai pemindaian pertama Anda sekarang!
          </p>
          <Link href="/scanner" className="btn btn-primary">
            MULAI PINDAI KULIT
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '800px', margin: '0 auto' }}>
          {scans.map((scan) => (
            <div
              key={scan.id}
              className="card"
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onClick={() => setSelectedScan(scan)}
              role="button"
              tabIndex={0}
            >
              {scan.image_url && (
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  background: 'var(--bg-input)',
                  border: scan.is_emergency ? '2px solid rgba(var(--danger-red-rgb), 0.3)' : '1px solid rgba(255,255,255,0.06)'
                }}>
                  <img
                    src={scan.image_url}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 className="heading-card" style={{ fontSize: '0.9375rem', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {scan.condition_name}
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span className={`badge ${scan.is_emergency ? 'badge-red' : 'badge-cyan'}`} style={{ fontSize: '0.625rem', padding: '2px 8px' }}>
                    {scan.is_emergency ? 'DARURAT' : 'NORMAL'}
                  </span>
                  <span className="text-meta" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    Keyakinan: {scan.confidence_score}%
                  </span>
                  <span className="text-meta">
                    {formatDate(scan.created_at)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button
                  className="btn-icon btn-icon-sm"
                  style={{
                    background: 'rgba(243,114,127,0.1)',
                    color: 'var(--danger-red)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onClick={(e) => handleDelete(scan.id, e)}
                  aria-label="Hapus scan"
                  title="Hapus"
                >
                  <i className="las la-trash-alt" />
                </button>
                <i className="las la-chevron-right" style={{ color: 'var(--text-secondary)', fontSize: '1.25rem' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal Overlay */}
      {selectedScan && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setSelectedScan(null)}>
          <div className="modal-content modal-wide animate-slide-up" style={{ margin: '20px' }}>
            <div className="modal-header">
              <h2>Detail Riwayat Pemindaian</h2>
              <button className="modal-close" onClick={() => setSelectedScan(null)} aria-label="Tutup">
                <i className="las la-times" />
              </button>
            </div>
            
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {selectedScan.image_url && (
                <div style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  maxHeight: '320px',
                  display: 'flex',
                  justifyContent: 'center',
                  background: 'var(--bg-input)',
                  border: selectedScan.is_emergency ? '2px solid rgba(var(--danger-red-rgb), 0.3)' : '1px solid rgba(255,255,255,0.06)'
                }}>
                  <img
                    src={selectedScan.image_url}
                    alt="Foto kondisi kulit"
                    style={{ maxHeight: '320px', width: '100%', objectFit: 'contain' }}
                  />
                </div>
              )}

              <div>
                <span className={`badge ${selectedScan.is_emergency ? 'badge-red' : 'badge-cyan'}`} style={{ marginBottom: '8px' }}>
                  {selectedScan.is_emergency ? 'DARURAT' : 'NORMAL'}
                </span>
                <h3 className="heading-main" style={{ fontSize: '1.25rem', marginBottom: '8px' }}>
                  {selectedScan.condition_name}
                </h3>
                <p className="text-meta">
                  Keyakinan Analisis AI: <strong style={{ color: 'var(--text-primary)' }}>{selectedScan.confidence_score}%</strong>
                </p>
                <p className="text-meta">
                  Waktu Pemindaian: {formatDate(selectedScan.created_at)}
                </p>
              </div>

              {selectedScan.body_location && (
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '12px' }}>
                  <span className="form-label" style={{ display: 'block', marginBottom: '4px' }}>Lokasi Tubuh</span>
                  <span className="text-body" style={{ color: 'var(--text-primary)' }}>{selectedScan.body_location}</span>
                </div>
              )}

              {selectedScan.symptoms && selectedScan.symptoms.length > 0 && (
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '12px' }}>
                  <span className="form-label" style={{ display: 'block', marginBottom: '4px' }}>Gejala yang Dilaporkan</span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                    {selectedScan.symptoms.map((symptom, idx) => (
                      <span key={idx} className="badge badge-cyan" style={{ fontSize: '0.6875rem' }}>
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedScan.description && (
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '12px' }}>
                  <span className="form-label" style={{ display: 'block', marginBottom: '4px' }}>Deskripsi Keluhan</span>
                  <p className="text-body" style={{ color: 'var(--text-primary)' }}>{selectedScan.description}</p>
                </div>
              )}

              <div style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '12px' }}>
                <span className="form-label" style={{ display: 'block', marginBottom: '4px' }}>Penyebab</span>
                <p className="text-body">{selectedScan.causes}</p>
              </div>

              <div>
                <span className="form-label" style={{ display: 'block', marginBottom: '6px' }}>Tips Penanganan</span>
                <ul style={{ paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {selectedScan.handling_tips?.map((tip, i) => (
                    <li key={i} className="text-body">{tip}</li>
                  ))}
                </ul>
              </div>

              <div style={{
                background: selectedScan.is_emergency ? 'rgba(var(--danger-red-rgb), 0.06)' : 'rgba(255, 164, 43, 0.06)',
                border: `1px solid ${selectedScan.is_emergency ? 'rgba(var(--danger-red-rgb), 0.15)' : 'rgba(255, 164, 43, 0.15)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                marginTop: '8px',
              }}>
                <p className="text-meta" style={{ color: selectedScan.is_emergency ? 'var(--danger-red)' : 'var(--warning-amber)' }}>
                  <i className="las la-info-circle" style={{ marginRight: '4px' }} />
                  {selectedScan.medical_disclaimer || 'Hasil ini merupakan penapisan awal AI dan bukan diagnosis medis resmi. Selalu konsultasikan dengan dokter spesialis kulit.'}
                </p>
              </div>
            </div>
            
            <div className="modal-footer">
              <button
                className="btn btn-ghost"
                onClick={() => setSelectedScan(null)}
              >
                TUTUP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
