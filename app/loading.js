export default function Loading() {
  return (
    <div
      className="flex-center animate-fade-in"
      style={{
        flexDirection: 'column',
        minHeight: 'calc(100vh - 140px)',
        gap: '16px',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <div className="spinner spinner-lg" />
      <div>
        <h2
          className="heading-card"
          style={{
            fontSize: '1rem',
            letterSpacing: '1.4px',
            textTransform: 'uppercase',
            color: 'var(--accent-cyan)',
            textShadow: '0 0 10px rgba(0, 242, 254, 0.2)',
            marginBottom: '4px',
          }}
        >
          SobatKulit
        </h2>
        <p className="text-body" style={{ fontSize: '0.8125rem' }}>
          Menghubungkan layanan medis terenkripsi...
        </p>
      </div>
    </div>
  );
}
