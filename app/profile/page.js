'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    full_name: '',
    birth_date: '',
    address: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [role, setRole] = useState('free');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  async function fetchProfile() {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        if (data.profile) {
          setFormData({
            full_name: data.profile.full_name || '',
            birth_date: data.profile.birth_date || '',
            address: data.profile.address || '',
          });
          setRole(data.profile.role || 'free');
        }
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Gagal memuat data profil');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menyimpan profil');
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError(err.message || 'Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  }

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="container page-content">
      <div className="page-header">
        <h1 className="page-title">
          <i className="las la-user-cog" style={{ color: 'var(--accent-cyan)', marginRight: '8px' }} />
          Profil Saya
        </h1>
        <p className="page-subtitle">
          Kelola informasi profil dan pengaturan akun SobatKulit Anda
        </p>
      </div>

      <div className="grid grid-2" style={{ alignItems: 'start', gap: '24px' }}>
        {/* User Card info & Fast Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-cyan), #0084fe)',
              color: '#000',
              fontSize: '2rem',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: 'var(--shadow-glow-cyan)'
            }}>
              {user?.emailAddresses?.[0]?.emailAddress?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h2 className="heading-card" style={{ marginBottom: '4px' }}>
              {formData.full_name || 'Pengguna SobatKulit'}
            </h2>
            <p className="text-meta" style={{ marginBottom: '8px' }}>
              {user?.emailAddresses?.[0]?.emailAddress}
            </p>
            {!loading && (
              <Link 
                href="/pricing" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: role === 'premium' ? 'rgba(0, 242, 254, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                  color: role === 'premium' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  margin: '0 auto 16px auto',
                  border: role === 'premium' ? '1px solid var(--accent-cyan)' : '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {role === 'premium' ? (
                  <>
                    <i className="las la-crown" style={{ fontSize: '1rem' }} />
                    PREMIUM
                  </>
                ) : (
                  <>
                    <i className="las la-user" style={{ fontSize: '1rem' }} />
                    FREE
                  </>
                )}
              </Link>
            )}
            <div className="profile-dropdown-divider" style={{ margin: '16px 0' }} />
            <Link href="/riwayat" className="btn btn-ghost" style={{ width: '100%', padding: '12px', fontSize: '0.8125rem' }}>
              <i className="las la-history" />
              LIHAT RIWAYAT SCAN
            </Link>
          </div>

          <div style={{
            background: 'rgba(var(--accent-cyan-rgb), 0.04)',
            border: '1px solid rgba(var(--accent-cyan-rgb), 0.15)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
          }}>
            <h4 style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--accent-cyan)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <i className="las la-shield-alt" style={{ marginRight: '4px' }} />
              Keamanan Data & Privasi
            </h4>
            <p className="text-meta">
              Data profil dan riwayat pemindaian Anda disimpan secara aman dan dienkripsi. SobatKulit tidak membagikan data medis pribadi Anda kepada pihak ketiga mana pun tanpa persetujuan eksplisit.
            </p>
          </div>
        </div>

        {/* Edit Form Card */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 className="heading-card" style={{ fontSize: '1rem', marginBottom: '16px' }}>
            Detail Informasi Profil
          </h3>

          {loading ? (
            <div className="flex-center" style={{ padding: '40px 0' }}>
              <div className="spinner" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {error && (
                <div style={{ background: 'rgba(243,114,127,0.1)', border: '1px solid rgba(243,114,127,0.2)', padding: '12px', borderRadius: 'var(--radius-md)', color: 'var(--danger-red)', fontSize: '0.8125rem' }}>
                  <i className="las la-exclamation-circle" style={{ marginRight: '6px' }} />
                  {error}
                </div>
              )}

              {saved && (
                <div style={{ background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.2)', padding: '12px', borderRadius: 'var(--radius-md)', color: 'var(--success-mint)', fontSize: '0.8125rem' }}>
                  <i className="las la-check-circle" style={{ marginRight: '6px' }} />
                  Profil berhasil diperbarui!
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="profile-name-field">Nama Lengkap</label>
                <input
                  id="profile-name-field"
                  type="text"
                  className="form-input"
                  value={formData.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-birthdate-field">Tanggal Lahir</label>
                <input
                  id="profile-birthdate-field"
                  type="date"
                  className="form-input"
                  value={formData.birth_date}
                  onChange={(e) => handleChange('birth_date', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-address-field">Tempat Tinggal</label>
                <input
                  id="profile-address-field"
                  type="text"
                  className="form-input"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Masukkan Kota / Kabupaten tempat tinggal"
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                  style={{ padding: '12px 24px', fontSize: '0.8125rem' }}
                >
                  {saving ? (
                    <>
                      <div className="spinner spinner-sm" style={{ marginRight: '8px', display: 'inline-block', borderTopColor: '#000' }} />
                      MENYIMPAN...
                    </>
                  ) : (
                    <>
                      <i className="las la-save" />
                      SIMPAN PERUBAHAN
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
