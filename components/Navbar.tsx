'use client';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const nt = useTranslations('Navbar');
  const { locale } = useParams();
  const { data: session, status } = useSession();

  return (
    <nav className="nav-bar glass-morphism container" style={{ marginTop: '1rem', borderRadius: '1.5rem', zIndex: 1000, position: 'relative' }}>
      <Link href={`/${locale}`} className="gradient-text title-font" style={{ fontSize: '1.5rem', fontWeight: 800, textDecoration: 'none' }}>
        DigitalDZ
      </Link>
      
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link href={`/${locale}/products`} className="title-font" style={{ color: 'var(--foreground-muted)', textDecoration: 'none', fontWeight: 600 }}>
          {nt('products')}
        </Link>
        
        {status === 'authenticated' ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <span style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>
               {session.user?.name || session.user?.email}
               {(session.user as any)?.role === 'ADMIN' && (
                 <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', background: 'var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '0.5rem' }}>ADMIN</span>
               )}
             </span>
             <button 
               onClick={() => signOut()}
               className="btn-primary" 
               style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', background: 'rgba(244, 63, 94, 0.2)', border: '1px solid rgba(244, 63, 94, 0.5)' }}
             >
               خروج
             </button>
          </div>
        ) : (
          <Link href={`/${locale}/login`} className="btn-primary" style={{ padding: '0.6rem 1.2rem', textDecoration: 'none' }}>
            {nt('login')}
          </Link>
        )}

        <div style={{ display: 'flex', gap: '0.8rem', marginLeft: '1.5rem', borderLeft: '1px solid var(--glass-border)', paddingLeft: '1.5rem' }}>
          <Link href="/ar" style={{ color: locale === 'ar' ? 'var(--primary)' : 'var(--foreground-muted)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 700 }}>AR</Link>
          <span style={{ color: 'var(--glass-border)' }}>|</span>
          <Link href="/fr" style={{ color: locale === 'fr' ? 'var(--primary)' : 'var(--foreground-muted)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 700 }}>FR</Link>
        </div>
      </div>
    </nav>
  );
}
