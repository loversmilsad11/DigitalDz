import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter, Outfit } from 'next/font/google';
import Providers from '@/components/Providers';
import "../globals.css";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export function generateStaticParams() {
  return [{ locale: 'ar' }, { locale: 'fr' }];
}

export default async function LocaleLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  const locale = params.locale;

  // Ensure that the incoming `locale` is valid
  if (!['ar', 'fr'].includes(locale)) {
    notFound();
  }

  // Getting messages for the client provider
  const messages = await getMessages();

  const isRtl = locale === 'ar';

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'}>
      <body className={`${inter.variable} ${outfit.variable}`}>
        <Providers messages={messages} locale={locale}>
          <div className="min-h-screen bg-surface text-foreground font-inter">
            {props.children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
