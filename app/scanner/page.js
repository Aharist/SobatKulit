'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ScannerCamera from '@/components/ScannerCamera';
import QuestionnaireModal from '@/components/QuestionnaireModal';
import ScanResult from '@/components/ScanResult';

export default function ScannerPage() {
  const [step, setStep] = useState('capture'); // capture | questionnaire | analyzing | result
  const [imageData, setImageData] = useState(null); // { base64, mimeType, preview }
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const [userProfile, setUserProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setUserProfile(data.profile);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      }
    }
    fetchProfile();
  }, []);

  function handleImageCapture(data) {
    setImageData(data);
    setStep('questionnaire');
  }

  async function handleQuestionnaireSubmit(questionnaire) {
    // Check scan limits
    if (userProfile && userProfile.role === 'free' && userProfile.scan_count >= 3) {
      setError('Limit bulanan sudah habis, yuk upgrade agar bisa scan lebih banyak');
      return;
    }

    setStep('analyzing');
    setError(null);

    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageData.base64,
          mimeType: imageData.mimeType,
          bodyLocation: questionnaire.bodyLocation,
          symptoms: questionnaire.symptoms,
          description: questionnaire.description,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal menganalisis gambar');
      }

      setResult({
        ...data.analysis,
        scanLogId: data.scanLog?.id,
        imagePreview: imageData.preview,
      });
      setStep('result');
    } catch (err) {
      setError(err.message);
      setStep('capture');
    }
  }

  function handleReset() {
    setStep('capture');
    setImageData(null);
    setResult(null);
    setError(null);
  }

  return (
    <div className="container page-content">
      <div className="page-header">
        <h1 className="page-title">
          <i className="las la-microscope" style={{ color: 'var(--accent-cyan)', marginRight: '8px' }} />
          Pemindai Kulit AI
        </h1>
        <p className="page-subtitle">
          Ambil foto atau unggah gambar kondisi kulit untuk mendapatkan analisis instan
        </p>
      </div>

      {error && (
        <div className="modal-backdrop" style={{ zIndex: 9999 }}>
          <div className="modal-content animate-slide-up" style={{ maxWidth: '400px', textAlign: 'center', padding: '32px 24px' }}>
            <div style={{ marginBottom: '16px', color: 'var(--danger-red)' }}>
              <i className="las la-exclamation-circle" style={{ fontSize: '3rem' }} />
            </div>
            <h3 className="heading-card" style={{ marginBottom: '12px' }}>Peringatan</h3>
            <p className="text-body" style={{ marginBottom: '24px' }}>
              {error}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                className="btn btn-ghost"
                onClick={() => setError(null)}
              >
                TUTUP
              </button>
              {error.includes('Limit') && (
                <button
                  className="btn btn-primary"
                  onClick={() => router.push('/pricing')}
                >
                  <i className="las la-crown" style={{ marginRight: '6px' }} />
                  UPGRADE
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {step === 'capture' && (
        <ScannerCamera onCapture={handleImageCapture} />
      )}

      {step === 'questionnaire' && (
        <QuestionnaireModal
          imagePreview={imageData.preview}
          onSubmit={handleQuestionnaireSubmit}
          onBack={() => setStep('capture')}
        />
      )}

      {step === 'analyzing' && (
        <div className="flex-center" style={{ flexDirection: 'column', padding: '80px 0' }}>
          <div className="spinner spinner-lg" style={{ marginBottom: '24px' }} />
          <p className="heading-card">Menganalisis Kondisi Kulit...</p>
          <p className="text-body" style={{ marginTop: '8px' }}>
            AI sedang memproses gambar dan data kuesioner Anda
          </p>
        </div>
      )}

      {step === 'result' && result && (
        <ScanResult result={result} onReset={handleReset} />
      )}
    </div>
  );
}
