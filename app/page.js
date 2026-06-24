import Link from 'next/link';
import { Shield, MapPin, Sun } from 'lucide-react';
import { auth } from '@clerk/nextjs/server';
import { createServerSupabase } from '@/lib/supabase';

export default async function HomePage() {
  const { userId } = await auth();
  let role = 'free';

  if (userId) {
    const supabase = createServerSupabase();
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
      
    if (data && data.role) {
      role = data.role;
    }
  }

  return (
    <div className="container" style={{ minHeight: 'calc(100vh - 140px)' }}>
      {role !== 'premium' && (
        <>
          <style>{`
            .mobile-premium-btn {
              position: fixed;
              top: 80px;
              left: 50%;
              transform: translateX(-50%);
              z-index: 90;
              display: none;
            }
            @media (max-width: 768px) {
              .mobile-premium-btn {
                display: flex;
              }
            }
          `}</style>

          <div className="mobile-premium-btn">
            <Link href="/pricing" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--accent-cyan)',
              color: 'var(--text-on-accent)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-pill)',
              boxShadow: 'var(--shadow-glow-cyan)',
              fontWeight: '700',
              fontSize: '0.75rem',
              letterSpacing: '1px'
            }}>
              <i className="las la-crown" style={{ fontSize: '1.25rem' }} />
              UPGRADE PLAN
            </Link>
          </div>
        </>
      )}

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

      {/* 1. SEKSI: BAGAIMANA SOBATKULIT BEKERJA */}
      <section className="homepage-section animate-slide-up" style={{ animationDelay: '300ms' }}>
        <h2 className="section-title">BAGAIMANA SOBATKULIT BEKERJA</h2>
        <div className="how-it-works-grid">
          <div className="how-card">
            <span className="how-num">01</span>
            <h3 className="how-title">Ambil Foto Gejala</h3>
            <p className="how-desc">
              Ambil foto area kulit yang bermasalah secara jelas langsung dari kamera atau unggah dari galeri dengan pencahayaan cukup.
            </p>
          </div>
          <div className="how-card">
            <span className="how-num">02</span>
            <h3 className="how-title">Lengkapi Kuesioner</h3>
            <p className="how-desc">
              Isi data singkat mengenai lokasi tubuh, gejala penyerta (gatal/nyeri), dan durasi kondisi untuk membantu akurasi.
            </p>
          </div>
          <div className="how-card">
            <span className="how-num">03</span>
            <h3 className="how-title">Analisis Multimodal AI</h3>
            <p className="how-desc">
              Sistem AI memproses visual gambar dan data kuesioner secara sinkron menggunakan model kecerdasan buatan tingkat lanjut.
            </p>
          </div>
          <div className="how-card">
            <span className="how-num">04</span>
            <h3 className="how-title">Hasil & Edukasi Instan</h3>
            <p className="how-desc">
              Dapatkan skrining awal, tingkat keyakinan AI, penyebab umum, dan panduan pertolongan pertama medis.
            </p>
          </div>
        </div>
      </section>

      {/* 2. SEKSI: SIAPA YANG HARUS MENGGUNAKAN SOBATKULIT */}
      <section className="homepage-section animate-slide-up" style={{ animationDelay: '400ms' }}>
        <h2 className="section-title">SIAPA YANG HARUS MENGGUNAKAN SOBATKULIT</h2>
        <div className="who-grid">
          <div className="who-card">
            <div className="who-icon-wrapper">
              <Shield size={20} />
            </div>
            <h3 className="who-title">Individu dengan Aktivitas Padat</h3>
            <p className="who-desc">
              Bagi mereka yang memiliki keterbatasan waktu untuk pengecekan awal gejala ringan ke faskes.
            </p>
          </div>
          <div className="who-card">
            <div className="who-icon-wrapper">
              <MapPin size={20} />
            </div>
            <h3 className="who-title">Masyarakat di Area Terpencil</h3>
            <p className="who-desc">
              Solusi akses edukasi kesehatan kulit pertama bagi wilayah dengan keterbatasan dokter spesialis.
            </p>
          </div>
          <div className="who-card">
            <div className="who-icon-wrapper">
              <Sun size={20} />
            </div>
            <h3 className="who-title">Aktivis Luar Ruangan</h3>
            <p className="who-desc">
              Pengguna yang sering terpapar matahari ekstrem, polusi, atau zat kimia pemicu iritasi kulit.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SEKSI: MENGAPA DETEKSI DINI MASALAH KULIT PENTING */}
      <section className="homepage-section animate-slide-up" style={{ animationDelay: '500ms', marginBottom: '64px' }}>
        <h2 className="section-title">MENGAPA DETEKSI DINI MASALAH KULIT PENTING</h2>
        <div className="importance-banner">
          <p className="importance-text">
            Kulit adalah pertahanan pertama tubuh Anda. Infeksi bakteri akut seperti Cellulitis atau reaksi alergi obat berat dapat berkembang dari bercak kecil menjadi kondisi fatal dalam hitungan jam. Deteksi dini melalui skrining awal membantu Anda membedakan kondisi umum yang stabil dengan kondisi darurat (Red-Flag) yang membutuhkan tindakan medis instan di IGD terdekat sebelum terjadi komplikasi sistemik.
          </p>
        </div>
      </section>
    </div>
  );
}
