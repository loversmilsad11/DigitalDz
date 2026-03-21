'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { User, LogOut, LayoutDashboard, Globe } from 'lucide-react';

export default function Navbar() {
  const nt = useTranslations('Navbar');
  const { locale } = useParams();
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className="nav-bar glass-morphism container" 
      style={{ 
        marginTop: scrolled ? '0.5rem' : '1.5rem', 
        borderRadius: scrolled ? '1.25rem' : '1.75rem', 
        zIndex: 1000, 
        position: 'sticky', 
        top: scrolled ? '10px' : '20px',
        padding: scrolled ? '0.6rem 1.5rem' : '1rem 2.5rem',
        backgroundColor: scrolled ? 'rgba(10, 10, 12, 0.8)' : 'rgba(255, 255, 255, 0.03)',
        borderColor: scrolled ? 'rgba(232, 121, 249, 0.2)' : 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: scrolled ? '0 10px 30px rgba(0,0,0,0.5)' : 'none'
      }}
    >
      <Link href={`/${locale}`} className="gradient-text title-font" style={{ fontSize: scrolled ? '1.3rem' : '1.6rem', fontWeight: 900, textDecoration: 'none', transition: 'font-size 0.4s' }}>
        DigitalDZ
      </Link>
      
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link href={`/${locale}/products`} className="title-font" style={{ color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: '0.95rem', opacity: 0.8 }} onMouseOver={e => e.currentTarget.style.opacity = '1'} onMouseOut={e => e.currentTarget.style.opacity = '0.8'}>
          {nt('products')}
        </Link>
        
        {status === 'authenticated' ? (
          <div style={{ display: 'flex', gap: scrolled ? '0.8rem' : '1.2rem', alignItems: 'center', transition: 'gap 0.4s' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.4rem 1rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.05)' }}>
               <User size={16} style={{ color: '#e879f9' }} />
               <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 600 }}>
                 {session.user?.name?.split(' ')[0] || session.user?.email?.split('@')[0]}
               </span>
               {(session.user as any)?.role === 'ADMIN' && (
                 <Link href={`/${locale}/admin`} title="لوحة التحكم" style={{ display: 'flex', alignItems: 'center', color: '#e879f9', textDecoration: 'none' }}>
                   <LayoutDashboard size={18} style={{ marginInlineStart: '0.5rem' }} />
                 </Link>
               )}
             </div>
             <button 
               onClick={() => signOut()}
               style={{ background: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.5rem' }}
               title="خروج"
             >
               <LogOut size={20} />
             </button>
          </div>
        ) : (
          <Link href={`/${locale}/login`} className="btn-primary" style={{ padding: scrolled ? '0.4rem 1.2rem' : '0.6rem 1.5rem', textDecoration: 'none', fontSize: '0.85rem', borderRadius: '1rem', transition: 'all 0.4s' }}>
            {nt('login')}
          </Link>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginInlineStart: '0.5rem', borderInlineStart: '1px solid rgba(255,255,255,0.1)', paddingInlineStart: '1.2rem' }}>
          <Globe size={16} style={{ color: 'var(--foreground-muted)' }} />
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <Link href="/ar" style={{ color: locale === 'ar' ? '#e879f9' : 'var(--foreground-muted)', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 800 }}>AR</Link>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}>|</span>
            <Link href="/fr" style={{ color: locale === 'fr' ? '#e879f9' : 'var(--foreground-muted)', fontSize: '0.8rem', textDecoration: 'none', fontWeight: 800 }}>FR</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
