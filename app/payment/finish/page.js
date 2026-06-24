'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function PaymentFinishContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState('processing'); // processing | success | failed | pending

  useEffect(() => {
    async function handlePaymentResult() {
      const transactionStatus = searchParams.get('transaction_status');
      const orderId = searchParams.get('order_id');
      const statusCode = searchParams.get('status_code');

      console.log('Payment finish:', { transactionStatus, orderId, statusCode });

      // Check if payment was successful
      if (
        transactionStatus === 'capture' || 
        transactionStatus === 'settlement' ||
        statusCode === '200'
      ) {
        try {
          // Call our backend to upgrade the user
          const res = await fetch('/api/upgrade', { method: 'POST' });
          if (res.ok) {
            setStatus('success');
            // Redirect to profile after 3 seconds
            setTimeout(() => router.push('/profile'), 3000);
          } else {
            setStatus('failed');
          }
        } catch (err) {
          console.error('Upgrade error:', err);
          setStatus('failed');
        }
      } else if (transactionStatus === 'pending') {
        setStatus('pending');
      } else {
        // deny, cancel, expire
        setStatus('failed');
      }
    }

    handlePaymentResult();
  }, [searchParams, router]);

  return (
    <div className="container page-content" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '60vh' 
    }}>
      <div className="card" style={{ 
        padding: '48px', 
        textAlign: 'center', 
        maxWidth: '500px', 
        width: '100%' 
      }}>
        {status === 'processing' && (
          <>
            <div className="spinner" style={{ margin: '0 auto 24px' }} />
            <h2 className="heading-card" style={{ marginBottom: '12px' }}>
              Memproses Pembayaran...
            </h2>
            <p className="text-body">
              Mohon tunggu, kami sedang memverifikasi pembayaran Anda.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ 
              fontSize: '4rem', 
              marginBottom: '16px',
              animation: 'fadeIn 0.5s ease'
            }}>
              🎉
            </div>
            <h2 className="heading-card" style={{ 
              marginBottom: '12px', 
              color: 'var(--success-mint)' 
            }}>
              Pembayaran Berhasil!
            </h2>
            <p className="text-body" style={{ marginBottom: '24px' }}>
              Selamat! Akun Anda telah di-upgrade menjadi <strong style={{ color: 'var(--accent-cyan)' }}>Premium</strong>. 
              Anda akan dialihkan ke halaman profil...
            </p>
            <button 
              className="btn btn-primary" 
              onClick={() => router.push('/profile')}
            >
              <i className="las la-user" style={{ marginRight: '6px' }} />
              Ke Halaman Profil
            </button>
          </>
        )}

        {status === 'pending' && (
          <>
            <div style={{ 
              fontSize: '4rem', 
              marginBottom: '16px' 
            }}>
              ⏳
            </div>
            <h2 className="heading-card" style={{ 
              marginBottom: '12px', 
              color: 'var(--warning-amber)' 
            }}>
              Pembayaran Pending
            </h2>
            <p className="text-body" style={{ marginBottom: '24px' }}>
              Pembayaran Anda sedang diproses. Silakan selesaikan pembayaran sesuai instruksi yang diberikan. 
              Status akun akan otomatis diperbarui setelah pembayaran dikonfirmasi.
            </p>
            <button 
              className="btn btn-ghost" 
              onClick={() => router.push('/')}
            >
              <i className="las la-home" style={{ marginRight: '6px' }} />
              Kembali ke Beranda
            </button>
          </>
        )}

        {status === 'failed' && (
          <>
            <div style={{ 
              fontSize: '4rem', 
              marginBottom: '16px' 
            }}>
              😔
            </div>
            <h2 className="heading-card" style={{ 
              marginBottom: '12px', 
              color: 'var(--error-red)' 
            }}>
              Pembayaran Gagal
            </h2>
            <p className="text-body" style={{ marginBottom: '24px' }}>
              Pembayaran tidak berhasil diproses. Silakan coba lagi atau pilih metode pembayaran lain.
            </p>
            <button 
              className="btn btn-primary" 
              onClick={() => router.push('/pricing')}
            >
              <i className="las la-redo-alt" style={{ marginRight: '6px' }} />
              Coba Lagi
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentFinishPage() {
  return (
    <Suspense fallback={
      <div className="container page-content" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <div className="spinner" />
      </div>
    }>
      <PaymentFinishContent />
    </Suspense>
  );
}
