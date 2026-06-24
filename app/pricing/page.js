'use client';

import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="container page-content">
      <div className="page-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="page-title">
          <i className="las la-gem" style={{ color: 'var(--accent-cyan)', marginRight: '8px' }} />
          Upgrade ke Premium
        </h1>
        <p className="page-subtitle">
          Buka akses tanpa batas ke semua fitur AI Pemindai SobatKulit.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '32px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {/* Free Plan */}
        <div className="card" style={{
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <h2 className="heading-card" style={{ marginBottom: '8px' }}>Paket Free</h2>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '24px', color: 'var(--text-primary)' }}>
            Rp 0 <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '400' }}>/ bulan</span>
          </div>
          
          <ul style={{ listStyle: 'none', marginBottom: '32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="las la-check" style={{ color: 'var(--success-mint)' }} />
              <span className="text-body">3x Scan AI per bulan</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="las la-check" style={{ color: 'var(--success-mint)' }} />
              <span className="text-body">Akses Dermapedia Dasar</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="las la-check" style={{ color: 'var(--success-mint)' }} />
              <span className="text-body">Riwayat Scan Tersimpan</span>
            </li>
          </ul>

          <button className="btn btn-ghost" style={{ width: '100%' }} disabled>
            Sedang Aktif
          </button>
        </div>

        {/* Premium Plan */}
        <div className="card" style={{
          padding: '32px',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid var(--accent-cyan)',
          position: 'relative',
          boxShadow: 'var(--shadow-glow-cyan)',
          transform: 'scale(1.02)',
          overflow: 'visible'
        }}>
          <div style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--accent-cyan)',
            color: 'var(--text-on-accent)',
            padding: '4px 16px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '0.75rem',
            fontWeight: '700',
            letterSpacing: '1px'
          }}>
            REKOMENDASI
          </div>
          
          <h2 className="heading-card" style={{ marginBottom: '8px', color: 'var(--accent-cyan)' }}>Paket Premium</h2>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '24px', color: 'var(--text-primary)' }}>
            Rp 49.000 <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: '400' }}>/ bulan</span>
          </div>
          
          <ul style={{ listStyle: 'none', marginBottom: '32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="las la-check" style={{ color: 'var(--success-mint)' }} />
              <span className="text-body"><strong>Scan AI Tanpa Batas</strong></span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="las la-check" style={{ color: 'var(--success-mint)' }} />
              <span className="text-body">Akses Dermapedia Lengkap</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="las la-check" style={{ color: 'var(--success-mint)' }} />
              <span className="text-body">Tracker Perkembangan Luka</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="las la-check" style={{ color: 'var(--success-mint)' }} />
              <span className="text-body">Prioritas Analisis Cepat</span>
            </li>
          </ul>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%' }}
            onClick={(e) => {
              // Dummy action as requested
              e.preventDefault();
              console.log('Redirect to payment gateway...');
              alert('Fitur pembayaran sedang dalam pengembangan!');
            }}
          >
            <i className="las la-crown" style={{ marginRight: '6px' }} />
            BELI PREMIUM
          </button>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <Link href="/scanner" className="btn btn-ghost">
          <i className="las la-arrow-left" style={{ marginRight: '6px' }} />
          Kembali ke Scanner
        </Link>
      </div>
    </div>
  );
}
