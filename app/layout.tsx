import { Inter, Outfit } from 'next/font/google';
import Providers from '@/components/Providers';
import WhatsAppButton from '@/components/WhatsAppButton';
import MobileBottomNav from '@/components/MobileBottomNav';
import "./globals.css";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata = {
  title: 'DigitalDZ - متجر المنتجات الرقمية الاول في الجزائر',
  description: 'أفضل المنتجات الرقمية في الجزائر بجودة عالية وأسعار منافسة.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${outfit.variable}`}
        style={{ position: 'relative' }}
      >
        {/* Cosmic Background Blobs */}
        <div className="bg-blob blob-1" />
        <div className="bg-blob blob-2" />
        <div className="bg-blob blob-3" />

        <Providers>
          <div className="min-h-screen bg-surface text-foreground font-inter">
            {children}
            <WhatsAppButton />
            <MobileBottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
