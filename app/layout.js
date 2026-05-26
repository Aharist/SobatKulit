import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

export const metadata = {
  title: 'SobatKulit — Penapisan Awal Kondisi Kulit Berbasis AI',
  description:
    'SobatKulit adalah platform edukasi dan penapisan awal kondisi kulit menggunakan kecerdasan buatan multimodal. Bukan pengganti dokter spesialis.',
  keywords: 'kulit, dermatologi, AI, penapisan, screening, penyakit kulit, Indonesia',
  openGraph: {
    title: 'SobatKulit — Penapisan Awal Kondisi Kulit Berbasis AI',
    description: 'Platform edukasi dan skrining awal kondisi kulit menggunakan AI multimodal.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#00c2cb',
          colorBackground: '#ffffff',
          colorInputBackground: '#ffffff',
          colorInputText: '#0d1117',
          colorText: '#0d1117',
          colorTextSecondary: '#4b5563',
          borderRadius: '8px',
        },
        elements: {
          card: { 
            backgroundColor: '#ffffff', 
            border: '1px solid #e5e7eb', 
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)' 
          },
          formButtonPrimary: { 
            backgroundColor: '#00f2fe', 
            color: '#000000',
            fontWeight: '600'
          },
          footerActionLink: { color: '#00a8b0' },
        },
      }}
    >
      <html lang="id">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <meta name="theme-color" content="#0d1117" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body>
          <Navbar />
          <main>{children}</main>
          <BottomNav />
          <footer className="disclaimer-footer">
            SobatKulit adalah platform edukasi kesehatan kulit, bukan penyedia diagnosis medis resmi
            pengganti dokter spesialis. Selalu konsultasikan kondisi kulit Anda dengan tenaga medis
            profesional.
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
