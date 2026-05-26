'use client';

import { useState } from 'react';
import ScannerCamera from '@/components/ScannerCamera';
import QuestionnaireModal from '@/components/QuestionnaireModal';
import ScanResult from '@/components/ScanResult';

export default function ScannerPage() {
  const [step, setStep] = useState('capture'); // capture | questionnaire | analyzing | result
  const [imageData, setImageData] = useState(null); // { base64, mimeType, preview }
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  function handleImageCapture(data) {
    setImageData(data);
    setStep('questionnaire');
  }

  async function handleQuestionnaireSubmit(questionnaire) {
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
        <div className="emergency-banner" style={{ marginBottom: '16px' }}>
          <p style={{ color: 'var(--danger-red)', fontSize: '0.875rem' }}>
            <i className="las la-exclamation-circle" style={{ marginRight: '6px' }} />
            {error}
          </p>
          <button
            className="btn btn-ghost"
            onClick={() => setError(null)}
            style={{ marginTop: '8px', padding: '6px 16px', fontSize: '0.6875rem' }}
          >
            TUTUP
          </button>
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
