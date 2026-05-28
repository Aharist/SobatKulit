'use client';

import { useState } from 'react';

const BODY_LOCATIONS = ['Wajah', 'Lengan', 'Kaki', 'Punggung', 'Perut', 'Dada', 'Kepala'];
const SYMPTOM_OPTIONS = ['Gatal', 'Perih', 'Panas', 'Berdarah', 'Mati Rasa'];

export default function QuestionnaireModal({ imagePreview, onSubmit, onBack }) {
  const [bodyLocation, setBodyLocation] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [description, setDescription] = useState('');

  function toggleSymptom(symptom) {
    setSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ bodyLocation, symptoms, description });
  }

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onBack()}>
      <div className="modal-content modal-wide animate-slide-up">
        <div className="modal-header">
          <h2>Kuesioner Pemindaian</h2>
          <button className="modal-close" onClick={onBack} aria-label="Kembali">
            <i className="las la-arrow-left" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Image preview */}
            {imagePreview && (
              <div style={{
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '20px',
                maxHeight: '180px',
                display: 'flex',
                justifyContent: 'center',
                background: 'var(--bg-input)',
              }}>
                <img
                  src={imagePreview}
                  alt="Foto kulit yang akan dianalisis"
                  style={{ maxHeight: '180px', objectFit: 'contain' }}
                />
              </div>
            )}

            <p className="text-body" style={{ marginBottom: '20px' }}>
              Jawab kuesioner berikut untuk meningkatkan akurasi analisis AI. Semua kolom bersifat opsional.
            </p>

            {/* Body Location */}
            <div className="form-group">
              <label className="form-label">Lokasi Area Tubuh</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {BODY_LOCATIONS.map((loc) => (
                  <button
                    key={loc}
                    type="button"
                    onClick={() => setBodyLocation(bodyLocation === loc ? '' : loc)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 'var(--radius-pill)',
                      border: `1px solid ${bodyLocation === loc ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.08)'}`,
                      background: bodyLocation === loc ? 'rgba(var(--accent-cyan-rgb), 0.15)' : 'var(--bg-input)',
                      color: bodyLocation === loc ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                      fontFamily: 'var(--font-family)',
                    }}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms */}
            <div className="form-group">
              <label className="form-label">Gejala yang Dirasakan</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {SYMPTOM_OPTIONS.map((symptom) => (
                  <label key={symptom} className="form-checkbox">
                    <input
                      type="checkbox"
                      checked={symptoms.includes(symptom)}
                      onChange={() => toggleSymptom(symptom)}
                    />
                    <span>{symptom}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="scan-description">
                Deskripsi Keluhan Tambahan
              </label>
              <textarea
                id="scan-description"
                className="form-textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ceritakan keluhan yang Anda rasakan..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onBack}>
              KEMBALI
            </button>
            <button type="submit" className="btn btn-primary" id="btn-analyze">
              <i className="las la-brain" style={{ fontSize: '1rem' }} />
              ANALISIS SEKARANG
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
