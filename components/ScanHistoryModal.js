'use client';

import { useState, useEffect } from 'react';

export default function ScanHistoryModal({ onClose }) {
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

  // Detail view of a single scan
  if (selectedScan) {
    return (
      <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="modal-content modal-wide animate-slide-up">
          <div className="modal-header">
            <h2>Detail Hasil Scan</h2>
            <button className="modal-close" onClick={() => setSelectedScan(null)} aria-label="Kembali">
              <i className="las la-arrow-left" />
            </button>
          </div>
          <div className="modal-body">
            {selectedScan.image_url && (
              <div style={{
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '16px',
                maxHeight: '240px',
                display: 'flex',
                justifyContent: 'center',
                background: 'var(--bg-input)'
              }}>
                <img
                  src={selectedScan.image_url}
                  alt="Foto kondisi kulit"
                  style={{ maxHeight: '240px', objectFit: 'contain' }}
                />
              </div>
            )}

            <h3 className="heading-card" style={{ marginBottom: '4px' }}>
              {selectedScan.condition_name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span className={`badge ${selectedScan.is_emergency ? 'badge-red' : 'badge-cyan'}`}>
                {selectedScan.is_emergency ? 'DARURAT' : 'NORMAL'}
              </span>
              <span className="text-meta">
                Keyakinan: {selectedScan.confidence_score}%
              </span>
            </div>

            {selectedScan.body_location && (
              <div style={{ marginBottom: '12px' }}>
                <span className="form-label" style={{ display: 'block', marginBottom: '4px' }}>Lokasi Tubuh</span>
                <span className="text-body">{selectedScan.body_location}</span>
              </div>
            )}

            <div style={{ marginBottom: '12px' }}>
              <span className="form-label" style={{ display: 'block', marginBottom: '4px' }}>Penyebab</span>
              <p className="text-body">{selectedScan.causes}</p>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <span className="form-label" style={{ display: 'block', marginBottom: '4px' }}>Tips Penanganan</span>
              <ul style={{ paddingLeft: '16px' }}>
                {selectedScan.handling_tips?.map((tip, i) => (
                  <li key={i} className="text-body" style={{ marginBottom: '4px' }}>{tip}</li>
                ))}
              </ul>
            </div>

            <p className="text-meta" style={{ fontStyle: 'italic', marginTop: '16px' }}>
              {selectedScan.medical_disclaimer || 'Hasil ini merupakan penapisan awal AI dan bukan diagnosis medis resmi.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content modal-wide animate-slide-up">
        <div className="modal-header">
          <h2>Riwayat Scan</h2>
          <button className="modal-close" onClick={onClose} aria-label="Tutup">
            <i className="las la-times" />
          </button>
        </div>
        <div className="modal-body">
          {loading ? (
            <div className="flex-center" style={{ padding: '48px 0' }}>
              <div className="spinner" />
            </div>
          ) : scans.length === 0 ? (
            <div className="empty-state">
              <i className="las la-microscope" />
              <h3>Belum Ada Riwayat</h3>
              <p>Anda belum pernah melakukan pemindaian kulit. Mulai dengan menekan tombol Scan Sekarang.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {scans.map((scan) => (
                <div
                  key={scan.id}
                  className="card"
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}
                  onClick={() => setSelectedScan(scan)}
                  role="button"
                  tabIndex={0}
                >
                  {scan.image_url && (
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: 'var(--bg-input)',
                    }}>
                      <img
                        src={scan.image_url}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="heading-card" style={{ fontSize: '0.875rem', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {scan.condition_name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${scan.is_emergency ? 'badge-red' : 'badge-cyan'}`} style={{ fontSize: '0.5625rem', padding: '2px 8px' }}>
                        {scan.is_emergency ? 'DARURAT' : 'NORMAL'}
                      </span>
                      <span className="text-meta">{scan.confidence_score}%</span>
                    </div>
                    <p className="text-meta" style={{ marginTop: '2px' }}>
                      {formatDate(scan.created_at)}
                    </p>
                  </div>
                  <button
                    className="btn-icon btn-icon-sm"
                    style={{ background: 'rgba(243,114,127,0.1)', color: 'var(--danger-red)', border: 'none', cursor: 'pointer' }}
                    onClick={(e) => handleDelete(scan.id, e)}
                    aria-label="Hapus scan"
                    title="Hapus"
                  >
                    <i className="las la-trash-alt" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
