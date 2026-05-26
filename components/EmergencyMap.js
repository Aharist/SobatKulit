'use client';

export default function EmergencyMap({ lat, lng }) {
  // Use Google Maps Embed API for directions to nearest hospital
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  
  // Google Maps search URL for nearby hospitals
  const searchUrl = `https://www.google.com/maps/search/rumah+sakit+IGD/@${lat},${lng},14z`;
  
  // Embed URL — search for hospitals near user location
  const embedUrl = `https://www.google.com/maps/embed/v1/search?key=${mapsApiKey}&q=rumah+sakit+IGD+terdekat&center=${lat},${lng}&zoom=14`;

  return (
    <div style={{ marginTop: '8px' }}>
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="heading-card" style={{ fontSize: '0.875rem' }}>
            <i className="las la-map-marked-alt" style={{ color: 'var(--danger-red)', marginRight: '6px' }} />
            Peta RS / IGD Terdekat
          </h3>
        </div>

        {mapsApiKey ? (
          <iframe
            src={embedUrl}
            width="100%"
            height="350"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Peta rumah sakit terdekat"
          />
        ) : (
          <div style={{
            height: '250px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-input)',
            gap: '12px',
            padding: '24px',
          }}>
            <i className="las la-map" style={{ fontSize: '2rem', color: 'var(--text-secondary)' }} />
            <p className="text-body" style={{ textAlign: 'center' }}>
              Peta tidak tersedia. Gunakan link di bawah untuk navigasi langsung.
            </p>
          </div>
        )}

        <div style={{ padding: '12px 16px' }}>
          <a
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-danger"
            style={{ width: '100%', textDecoration: 'none', display: 'flex', padding: '12px', fontSize: '0.8125rem' }}
          >
            <i className="las la-directions" style={{ fontSize: '1.125rem' }} />
            BUKA DI GOOGLE MAPS
          </a>
          <p className="text-meta" style={{ textAlign: 'center', marginTop: '8px' }}>
            Koordinat: {lat.toFixed(6)}, {lng.toFixed(6)}
          </p>
        </div>
      </div>
    </div>
  );
}
