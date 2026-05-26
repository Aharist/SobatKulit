'use client';

import { useState } from 'react';
import EmergencyMap from './EmergencyMap';

export default function EmergencyAlert({ result, onReset }) {
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (result.confidence_score / 100) * circumference;

  async function handleFindHospital() {
    setLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation tidak didukung oleh browser Anda.');
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setShowMap(true);
        setLoadingLocation(false);
      },
      (err) => {
        setLocationError('Gagal mendapatkan lokasi. Pastikan izin lokasi diaktifkan.');
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  return (
    <div className="animate-slide-up" style={{ maxWidth: '640px', margin: '0 auto' }}>
      {/* Emergency Banner */}
      <div className="emergency-banner" style={{ marginBottom: '20px', textAlign: 'center', padding: '24px' }}>
        <i className="las la-exclamation-triangle" style={{ fontSize: '2.5rem', color: 'var(--danger-red)', display: 'block', marginBottom: '12px' }} />
        <h2 style={{ color: 'var(--danger-red)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>
          KONDISI DARURAT TERDETEKSI
        </h2>
        <p className="text-body" style={{ maxWidth: '400px', margin: '0 auto' }}>
          AI mendeteksi kemungkinan kondisi kulit yang memerlukan penanganan medis segera.
          Segera kunjungi fasilitas kesehatan terdekat.
        </p>
      </div>

      {/* Result Card */}
      <div className="card" style={{ marginBottom: '16px', borderColor: 'rgba(var(--danger-red-rgb), 0.3)' }}>
        <div style={{ display: 'flex', gap: '20px', padding: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          {result.imagePreview && (
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '12px',
              overflow: 'hidden',
              flexShrink: 0,
              background: 'var(--bg-input)',
              border: '2px solid rgba(var(--danger-red-rgb), 0.3)',
            }}>
              <img src={result.imagePreview} alt="Foto kondisi kulit" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <span className="badge badge-red" style={{ marginBottom: '8px' }}>DARURAT</span>
            <h3 className="heading-card" style={{ marginBottom: '8px' }}>
              {result.condition_name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="confidence-ring">
                <svg width="64" height="64" viewBox="0 0 100 100">
                  <circle className="confidence-ring__track" cx="50" cy="50" r="45" />
                  <circle
                    className="confidence-ring__fill"
                    cx="50" cy="50" r="45"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{ stroke: 'var(--danger-red)', filter: 'drop-shadow(0 0 6px rgba(var(--danger-red-rgb), 0.5))' }}
                  />
                </svg>
                <span className="confidence-ring__value" style={{ fontSize: '0.875rem' }}>{result.confidence_score}%</span>
              </div>
              <span className="text-meta">Keyakinan AI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Causes */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="card-body">
          <h3 className="heading-card" style={{ fontSize: '0.875rem', marginBottom: '8px' }}>
            <i className="las la-virus" style={{ color: 'var(--danger-red)', marginRight: '6px' }} />
            Penyebab
          </h3>
          <p className="text-body">{result.causes}</p>
        </div>
      </div>

      {/* Tips */}
      <div className="card" style={{ marginBottom: '16px' }}>
        <div className="card-body">
          <h3 className="heading-card" style={{ fontSize: '0.875rem', marginBottom: '12px' }}>
            <i className="las la-first-aid" style={{ color: 'var(--warning-amber)', marginRight: '6px' }} />
            Pertolongan Pertama
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
        background: 'rgba(var(--danger-red-rgb), 0.08)',
        border: '1px solid rgba(var(--danger-red-rgb), 0.2)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 16px',
        marginBottom: '20px',
      }}>
        <p className="text-meta" style={{ color: 'var(--danger-red)' }}>
          <i className="las la-exclamation-circle" style={{ marginRight: '4px' }} />
          {result.medical_disclaimer}
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          className="btn btn-danger"
          onClick={handleFindHospital}
          disabled={loadingLocation}
          style={{ width: '100%', padding: '16px', fontSize: '0.9375rem' }}
          id="btn-find-hospital"
        >
          {loadingLocation ? (
            <>
              <div className="spinner spinner-sm" style={{ borderTopColor: '#fff' }} />
              MENCARI LOKASI...
            </>
          ) : (
            <>
              <i className="las la-hospital" style={{ fontSize: '1.25rem' }} />
              CARI RS / IGD TERDEKAT
            </>
          )}
        </button>

        {locationError && (
          <p style={{ color: 'var(--danger-red)', fontSize: '0.8125rem', textAlign: 'center' }}>
            {locationError}
          </p>
        )}

        {showMap && userLocation && (
          <EmergencyMap lat={userLocation.lat} lng={userLocation.lng} />
        )}

        <button
          className="btn btn-ghost"
          onClick={onReset}
          style={{ padding: '12px 24px', fontSize: '0.8125rem', alignSelf: 'center' }}
        >
          <i className="las la-redo-alt" />
          SCAN ULANG
        </button>
      </div>
    </div>
  );
}
