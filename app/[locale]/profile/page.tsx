'use client';
import { useSession, signOut } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/Animations';
import { User, Mail, Shield, LogOut, ShoppingBag, Settings, ChevronRight, Star, Package } from 'lucide-react';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const { locale } = useParams();
  const router = useRouter();
  const isRtl = locale === 'ar';

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
    }
  }, [status, locale, router]);

  if (status === 'loading') {
    return (
      <div className="fade-in">
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite' }} />
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!session) return null;

  const user = session.user as any;
  const displayName = user?.name || user?.email?.split('@')[0] || 'User';
  const isAdmin = user?.role === 'ADMIN';

  const menuItems = [
    {
      icon: <ShoppingBag size={20} />,
      label: isRtl ? 'طلباتي' : 'Mes commandes',
      desc: isRtl ? 'عرض سجل مشترياتك الرقمية' : 'Voir l\'historique de vos achats',
      href: `/${locale}/orders`,
      color: '#e879f9'
    },
    {
      icon: <ShoppingBag size={20} />,
      label: isRtl ? 'سلة التسوق' : 'Panier',
      desc: isRtl ? 'عرض منتجاتك في السلة' : 'Voir votre panier',
      href: `/${locale}/cart`,
      color: '#6366f1'
    },
    ...(isAdmin ? [{
      icon: <Settings size={20} />,
      label: isRtl ? 'لوحة الإدارة' : "Panneau d'administration",
      desc: isRtl ? 'إدارة المنتجات والتصنيفات' : 'Gérer les produits et catégories',
      href: `/${locale}/admin`,
      color: '#f59e0b'
    }] : []),
  ];

  const stats = [
    { label: isRtl ? 'الطلبات' : 'Commandes', value: '0', icon: <Package size={22} style={{ color: '#e879f9' }} /> },
    { label: isRtl ? 'المنتجات' : 'Produits', value: '0', icon: <Star size={22} style={{ color: '#f59e0b' }} /> },
    { label: isRtl ? 'النقاط' : 'Points', value: '0', icon: <Shield size={22} style={{ color: '#6366f1' }} /> },
  ];

  return (
    <div className="fade-in">
      <Navbar />
      <div className="container" style={{ padding: '2rem 2rem 6rem', maxWidth: 900 }}>
        
        {/* Profile Header */}
        <FadeIn>
          <div className="glass-morphism" style={{
            borderRadius: '2.5rem',
            padding: '3rem 2.5rem',
            marginBottom: '2rem',
            border: '1px solid rgba(255,255,255,0.08)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* BG Glow */}
            <div style={{ position: 'absolute', top: -80, insetInlineEnd: -80, width: 300, height: 300, background: 'radial-gradient(circle, rgba(232,121,249,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', position: 'relative' }}>
              {/* Avatar */}
              <div style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #e879f9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.5rem',
                fontWeight: 900,
                color: 'white',
                fontFamily: 'var(--font-outfit)',
                flexShrink: 0,
                boxShadow: '0 0 30px rgba(232, 121, 249, 0.3)'
              }}>
                {displayName.charAt(0).toUpperCase()}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  <h1 className="title-font" style={{ fontSize: '2rem', fontWeight: 900 }}>{displayName}</h1>
                  {isAdmin && (
                    <span style={{
                      background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '2rem',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      Admin
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground-muted)', fontSize: '0.95rem' }}>
                  <Mail size={15} />
                  <span style={{ direction: 'ltr' }}>{user?.email}</span>
                </div>
              </div>

              <button
                onClick={() => signOut({ callbackUrl: `/${locale}` })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.7rem 1.4rem',
                  borderRadius: '1rem',
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.2)',
                  color: '#f43f5e',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
                onMouseOver={e => (e.currentTarget as HTMLElement).style.background = 'rgba(244, 63, 94, 0.2)'}
                onMouseOut={e => (e.currentTarget as HTMLElement).style.background = 'rgba(244, 63, 94, 0.1)'}
              >
                <LogOut size={18} />
                {isRtl ? 'تسجيل الخروج' : 'Se déconnecter'}
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '2.5rem' }}>
              {stats.map((stat, i) => (
                <div key={i} style={{
                  padding: '1.25rem',
                  borderRadius: '1.5rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  textAlign: 'center'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>{stat.icon}</div>
                  <div className="title-font" style={{ fontSize: '1.8rem', fontWeight: 900 }}>{stat.value}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)', marginTop: '0.25rem' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Account Info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Menu Links */}
          <FadeIn delay={0.1}>
            <div className="glass-morphism" style={{ borderRadius: '2rem', padding: '2rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h2 className="title-font" style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                {isRtl ? 'الخدمات' : 'Services'}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {menuItems.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1rem 1.25rem',
                      borderRadius: '1.25rem',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                      color: 'white'
                    }}
                    onMouseOver={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                      (e.currentTarget as HTMLElement).style.borderColor = `${item.color}30`;
                    }}
                    onMouseOut={e => {
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)';
                    }}
                  >
                    <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.label}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--foreground-muted)', marginTop: '0.1rem' }}>{item.desc}</div>
                    </div>
                    <ChevronRight size={18} style={{ color: 'var(--foreground-muted)', transform: isRtl ? 'rotate(180deg)' : 'none', flexShrink: 0 }} />
                  </Link>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Account Details */}
          <FadeIn delay={0.2}>
            <div className="glass-morphism" style={{ borderRadius: '2rem', padding: '2rem', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h2 className="title-font" style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                {isRtl ? 'معلومات الحساب' : 'Informations du compte'}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  { label: isRtl ? 'الاسم' : 'Nom', value: displayName, icon: <User size={16} style={{ color: '#e879f9' }} /> },
                  { label: isRtl ? 'البريد الإلكتروني' : 'Email', value: user?.email || '—', icon: <Mail size={16} style={{ color: '#6366f1' }} /> },
                  { label: isRtl ? 'نوع الحساب' : 'Type de compte', value: isAdmin ? (isRtl ? 'مدير' : 'Administrateur') : (isRtl ? 'مستخدم' : 'Utilisateur'), icon: <Shield size={16} style={{ color: '#f59e0b' }} /> },
                ].map((field, i) => (
                  <div key={i} style={{ padding: '1rem 1.25rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>
                      {field.icon}
                      {field.label}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', direction: field.label.toLowerCase().includes('email') || field.label.toLowerCase().includes('mail') ? 'ltr' : undefined }}>
                      {field.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
