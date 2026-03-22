import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Tag, Package, LogOut, Code, Home } from 'lucide-react';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== 'ADMIN') {
    redirect(`/login`);
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--surface)', color: 'var(--foreground)' }}>
      {/* Sidebar */}
      <aside className="glass-morphism" style={{
        width: '260px',
        borderInlineEnd: '1px solid var(--glass-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto'
      }}>
        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <Link href="/admin" className="title-font gradient-text" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none' }}>
            لوحة التحكم
          </Link>
          <p style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)', marginTop: '0.5rem' }}>Digital DZ</p>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/admin" className="admin-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.75rem', textDecoration: 'none', color: 'white', transition: 'background 0.2s' }}>
            <LayoutDashboard size={20} style={{ color: 'var(--primary)' }} />
            <span style={{ fontWeight: 500 }}>نظرة عامة</span>
          </Link>
          <Link href="/admin/orders" className="admin-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.75rem', textDecoration: 'none', color: 'white', transition: 'background 0.2s' }}>
            <Package size={20} style={{ color: '#fbbf24' }} />
            <span style={{ fontWeight: 500 }}>الطلبات والمراجعة</span>
          </Link>
          <Link href="/admin/categories" className="admin-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.75rem', textDecoration: 'none', color: 'white', transition: 'background 0.2s' }}>
            <Tag size={20} style={{ color: '#34d399' }} />
            <span style={{ fontWeight: 500 }}>الفئات</span>
          </Link>
          <Link href="/admin/products" className="admin-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.75rem', textDecoration: 'none', color: 'white', transition: 'background 0.2s' }}>
            <Package size={20} style={{ color: '#e879f9' }} />
            <span style={{ fontWeight: 500 }}>المنتجات</span>
          </Link>
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link href="/" className="admin-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: '0.75rem', textDecoration: 'none', color: 'var(--foreground-muted)', transition: 'background 0.2s' }}>
            <Home size={20} />
            <span>العودة للمتجر</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        <div className="glow" style={{ top: '-10%', left: '-10%', background: 'rgba(99, 102, 241, 0.15)', width: '500px', height: '500px' }} />
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
