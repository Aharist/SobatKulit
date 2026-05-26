'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  function handleScanClick() {
    if (!isSignedIn) {
      router.push('/sign-in');
    } else {
      router.push('/scanner');
    }
  }

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 140px)' }}>
      <div className="hero">
        <div className="hero-content">
          <div className="hero-text animate-slide-up">
            <p className="hero-eyebrow">AI-POWERED SKIN SCREENING</p>
            <h1 className="hero-heading">
              Analisis Kondisi Kulit Anda dengan{' '}
              <span className="hero-highlight">Kecerdasan Buatan</span>
            </h1>
            <p className="hero-description">
              SobatKulit menggabungkan teknologi multimodal AI dan data klinis
              untuk memberikan penapisan awal kondisi kulit secara instan.
              Unggah atau ambil foto, jawab kuesioner singkat, dan dapatkan
              hasil analisis dalam hitungan detik.
            </p>
            <button
              className="btn btn-primary hero-cta"
              onClick={handleScanClick}
              id="cta-scan-sekarang"
            >
              <i className="las la-microscope" style={{ fontSize: '1.125rem' }} />
              SCAN SEKARANG
            </button>
          </div>

          <div className="hero-visual animate-fade-in">
            <div className="scanner-box hero-scanner">
              <div className="scanner-corner scanner-corner--tl" />
              <div className="scanner-corner scanner-corner--tr" />
              <div className="scanner-corner scanner-corner--bl" />
              <div className="scanner-corner scanner-corner--br" />
              <div className="scanner-line" />
              <div className="scanner-content">
                <i className="las la-hand-paper scanner-icon" />
                <p className="scanner-text">Pemindai Kulit AI</p>
                <p className="scanner-subtext">Siap Menganalisis</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="features-grid animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="las la-camera-retro" />
            </div>
            <h3 className="feature-title">Multimodal Scanner</h3>
            <p className="feature-desc">
              Foto langsung atau unggah gambar untuk analisis AI instan
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon feature-icon--red">
              <i className="las la-exclamation-triangle" />
            </div>
            <h3 className="feature-title">Emergency Detector</h3>
            <p className="feature-desc">
              Deteksi otomatis kondisi darurat dengan rute RS terdekat
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon feature-icon--green">
              <i className="las la-chart-line" />
            </div>
            <h3 className="feature-title">Skin Tracker</h3>
            <p className="feature-desc">
              Pantau perkembangan kondisi kulit dari waktu ke waktu
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero {
          padding: 48px 0 32px;
        }
        .hero-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: center;
        }
        @media (min-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr 1fr;
            gap: 64px;
          }
          .hero {
            padding: 80px 0 48px;
          }
        }
        .hero-eyebrow {
          font-size: 0.6875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: var(--accent-cyan);
          margin-bottom: 12px;
        }
        .hero-heading {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.25;
          margin-bottom: 16px;
        }
        @media (min-width: 768px) {
          .hero-heading {
            font-size: 2.25rem;
          }
        }
        .hero-highlight {
          color: var(--accent-cyan);
          text-shadow: 0 0 20px rgba(var(--accent-cyan-rgb), 0.3);
        }
        .hero-description {
          font-size: 0.9375rem;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 28px;
          max-width: 480px;
        }
        .hero-cta {
          font-size: 0.9375rem;
          padding: 16px 36px;
        }
        .hero-visual {
          display: flex;
          justify-content: center;
        }
        .hero-scanner {
          width: 100%;
          max-width: 400px;
          aspect-ratio: 4/3;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .scanner-content {
          text-align: center;
          z-index: 1;
        }
        .scanner-icon {
          font-size: 3rem;
          color: rgba(var(--accent-cyan-rgb), 0.4);
          margin-bottom: 12px;
          display: block;
        }
        .scanner-text {
          font-size: 0.875rem;
          font-weight: 700;
          color: var(--accent-cyan);
          text-transform: uppercase;
          letter-spacing: 1.4px;
        }
        .scanner-subtext {
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-top: 4px;
        }

        /* Feature cards */
        .features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-top: 48px;
        }
        @media (min-width: 640px) {
          .features-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .feature-card {
          background: var(--bg-surface);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: var(--radius-lg);
          padding: 24px;
          transition: border-color var(--transition-normal), transform var(--transition-normal);
        }
        .feature-card:hover {
          border-color: rgba(var(--accent-cyan-rgb), 0.2);
          transform: translateY(-4px);
        }
        .feature-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: rgba(var(--accent-cyan-rgb), 0.1);
          color: var(--accent-cyan);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.25rem;
          margin-bottom: 16px;
        }
        .feature-icon--red {
          background: rgba(var(--danger-red-rgb), 0.1);
          color: var(--danger-red);
        }
        .feature-icon--green {
          background: rgba(0, 230, 118, 0.1);
          color: var(--success-mint);
        }
        .feature-title {
          font-size: 0.9375rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 6px;
        }
        .feature-desc {
          font-size: 0.8125rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
