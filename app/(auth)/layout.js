export default function AuthLayout({ children }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 64px)',
        padding: '24px 16px',
      }}
    >
      {children}
    </div>
  );
}
