import Link from 'next/link';

export default function HomePage() {

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
            <Link
              href="/scanner"
              className="btn btn-primary hero-cta"
              id="cta-scan-sekarang"
            >
              <i className="las la-microscope" style={{ fontSize: '1.125rem' }} />
              SCAN SEKARANG
            </Link>
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
    </div>
  );
}
