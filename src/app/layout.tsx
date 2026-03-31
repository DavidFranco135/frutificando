import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Frutificando – Encontro Cristão 2026',
  description: 'Um final de semana de comunhão, descanso e crescimento espiritual em meio à natureza.',
  keywords: ['retiro espiritual', 'encontro cristão', 'frutificando', '2026'],
  openGraph: {
    title: 'Frutificando – Encontro Cristão 2026',
    description: 'Um final de semana de comunhão, descanso e crescimento espiritual em meio à natureza.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-white text-brand-700">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: '16px',
              fontWeight: '600',
              fontSize: '14px',
            },
          }}
        />
      </body>
    </html>
  );
}
