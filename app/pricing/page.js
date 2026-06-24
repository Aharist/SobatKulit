'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      // 1. Dapatkan Snap Token dari backend
      const response = await fetch('/api/checkout', {
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Gagal membuat transaksi');
      }

      if (typeof window.snap === 'undefined') {
        throw new Error('Sistem pembayaran sedang memuat. Mohon tunggu beberapa detik dan coba lagi.');
      }

      // 2. Panggil Midtrans Snap
      window.snap.pay(data.token, {
        onSuccess: async function (result) {
          console.log('Payment success:', result);
          try {
            // Callback ke backend kita untuk update role
            const updateRes = await fetch('/api/upgrade', { method: 'POST' });
            if (updateRes.ok) {
              alert('Pembayaran Berhasil! Akun Anda kini Premium.');
              router.push('/profile');
            } else {
              alert('Pembayaran berhasil, tetapi gagal memperbarui status akun. Harap hubungi support.');
            }
          } catch (err) {
            console.error(err);
            alert('Pembayaran berhasil, tetapi terjadi kesalahan saat memperbarui akun.');
          }
        },
        onPending: function (result) {
          console.log('Payment pending:', result);
          alert('Pembayaran sedang diproses (pending). Silakan selesaikan pembayaran Anda.');
        },
        onError: function (result) {
          console.log('Payment error:', result);
          alert('Pembayaran gagal. Silakan coba lagi.');
        },
        onClose: function () {
          console.log('Payment popup closed');
          alert('Anda menutup pop-up sebelum menyelesaikan pembayaran.');
        }
      });

    } catch (error) {
      console.error('Checkout error:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      />
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

          {userProfile?.role === 'premium' ? (
            <button className="btn btn-ghost" style={{ width: '100%' }} disabled>
              Paket Dasar
            </button>
          ) : (
            <button className="btn btn-ghost" style={{ width: '100%' }} disabled>
              Sedang Aktif
            </button>
          )}
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

          {userProfile?.role === 'premium' ? (
            <button className="btn btn-ghost" style={{ width: '100%', borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }} disabled>
              <i className="las la-check-circle" style={{ marginRight: '6px' }} />
              SEDANG AKTIF
            </button>
          ) : (
            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              onClick={handleUpgrade}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner spinner-sm" style={{ marginRight: '8px', borderTopColor: '#000' }} />
                  MEMPROSES...
                </>
              ) : (
                <>
                  <i className="las la-crown" style={{ marginRight: '6px' }} />
                  BELI PREMIUM
                </>
              )}
            </button>
          )}
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '32px' }}>
        <Link href="/scanner" className="btn btn-ghost">
          <i className="las la-arrow-left" style={{ marginRight: '6px' }} />
          Kembali ke Scanner
        </Link>
      </div>
    </div>
    </>
  );
}
