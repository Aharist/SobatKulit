'use client';

export default function EmergencyMap({ lat, lng }) {
  const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  // Embed URL — directions mode: shows route from user to nearest hospital/IGD
  const embedUrl = `https://www.google.com/maps/embed/v1/directions?key=${mapsApiKey}&origin=${lat},${lng}&destination=rumah+sakit+IGD+terdekat&mode=driving`;

  // Google Maps directions URL for "Open in Google Maps" button
  const directionsUrl = `https://www.google.com/maps/dir/${lat},${lng}/rumah+sakit+IGD+terdekat`;

  return (
    <div style={{ marginTop: '8px' }}>
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="heading-card" style={{ fontSize: '0.875rem' }}>
            <i className="las la-map-marked-alt" style={{ color: 'var(--danger-red)', marginRight: '6px' }} />
            Rute ke RS / IGD Terdekat
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
            title="Rute ke rumah sakit terdekat"
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
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-danger"
            style={{ width: '100%', textDecoration: 'none', display: 'flex', padding: '12px', fontSize: '0.8125rem' }}
          >
            <i className="las la-directions" style={{ fontSize: '1.125rem' }} />
            BUKA NAVIGASI DI GOOGLE MAPS
          </a>
          <p className="text-meta" style={{ textAlign: 'center', marginTop: '8px' }}>
            Koordinat: {lat.toFixed(6)}, {lng.toFixed(6)}
          </p>
        </div>
      </div>
    </div>
  );
}
