import { getCategories, getProducts } from '@/lib/admin-actions';
import { Package, Tag, Users, ShoppingCart } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function AdminDashboardOverview() {
  const categories = await getCategories();
  const products = await getProducts();
  const t = await getTranslations('Admin');

  const stats = [
    { label: t('totalProducts'), value: products.length, icon: Package, color: 'text-fuchsia-400' },
    { label: t('totalCategories'), value: categories.length, icon: Tag, color: 'text-emerald-400' },
    { label: t('totalOrders'), value: 0, icon: ShoppingCart, color: 'text-amber-400' },
    { label: t('totalUsers'), value: 0, icon: Users, color: 'text-blue-400' },
  ];

  return (
    <div className="fade-in">
      <h1 className="title-font gradient-text" style={{ fontSize: '2.25rem', fontWeight: 900, marginBottom: '2.5rem' }}>{t('overview')}</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass-morphism" style={{ padding: '1.75rem', borderRadius: '2rem', display: 'flex', alignItems: 'center', gap: '1.25rem', border: '1px solid var(--glass-border)' }}>
            <div style={{ padding: '1.25rem', borderRadius: '1.25rem', backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <stat.icon size={28} style={{ color: stat.color === 'text-fuchsia-400' ? '#e879f9' : stat.color === 'text-emerald-400' ? '#34d399' : stat.color === 'text-amber-400' ? '#fbbf24' : '#60a5fa' }} />
            </div>
            <div>
              <p style={{ color: 'var(--foreground-muted)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.25rem' }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 900, margin: 0, color: 'white' }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
      
      <div className="glass-morphism" style={{ marginTop: '3rem', padding: '2.5rem', borderRadius: '2.5rem', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="title-font" style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.25rem', color: 'white' }}>{t('welcomeAdmin')}</h2>
          <p style={{ color: 'var(--foreground-muted)', lineHeight: 1.8, fontSize: '1.1rem', maxWidth: '800px' }}>
            {t('adminDescription')}
          </p>
        </div>
        {/* Decorative element */}
        <div style={{ position: 'absolute', bottom: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(192, 38, 211, 0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
      </div>
    </div>
  );
}
