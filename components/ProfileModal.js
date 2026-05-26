'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export default function ProfileModal({ onClose }) {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    full_name: '',
    birth_date: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

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
        }
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content animate-slide-up">
        <div className="modal-header">
          <h2>Edit Profil</h2>
          <button className="modal-close" onClick={onClose} aria-label="Tutup">
            <i className="las la-times" />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body">
            <p className="text-body" style={{ marginBottom: '16px' }}>
              Semua kolom bersifat opsional. Data ini hanya digunakan untuk personalisasi pengalaman Anda.
            </p>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">Nama Lengkap</label>
              <input
                id="profile-name"
                type="text"
                className="form-input"
                value={formData.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-birthdate">Tanggal Lahir</label>
              <input
                id="profile-birthdate"
                type="date"
                className="form-input"
                value={formData.birth_date}
                onChange={(e) => handleChange('birth_date', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-address">Tempat Tinggal</label>
              <input
                id="profile-address"
                type="text"
                className="form-input"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Kota / Kabupaten"
              />
            </div>
          </div>

          <div className="modal-footer">
            {saved && (
              <span style={{ color: 'var(--success-mint)', fontSize: '0.8125rem', marginRight: 'auto' }}>
                <i className="las la-check-circle" style={{ marginRight: '4px' }} />
                Tersimpan
              </span>
            )}
            <button type="button" className="btn btn-ghost" onClick={onClose} style={{ padding: '10px 20px', fontSize: '0.75rem' }}>
              BATAL
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '10px 20px', fontSize: '0.75rem' }}>
              {loading ? 'MENYIMPAN...' : 'SIMPAN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
