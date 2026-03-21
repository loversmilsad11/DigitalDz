'use client';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/Animations';
import { Package, ShoppingBag, Clock, CheckCircle2, XCircle, Zap, AlertCircle } from 'lucide-react';

// Status config
const STATUS_CONFIG: Record<string, { labelAr: string; labelFr: string; color: string; icon: ReactNode }> = {
  PAID: { labelAr: 'مدفوع', labelFr: 'Payé', color: '#22c55e', icon: <CheckCircle2 size={15} /> },
  PENDING: { labelAr: 'قيد الانتظار', labelFr: 'En attente', color: '#f59e0b', icon: <Clock size={15} /> },
  CANCELLED: { labelAr: 'ملغي', labelFr: 'Annulé', color: '#f43f5e', icon: <XCircle size={15} /> },
};

function OrderCard({ order, isRtl, locale }: { order: any; isRtl: boolean; locale: string }) {
  const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
  const createdAt = new Date(order.createdAt);

  return (
    <div
      className="glass-morphism"
      style={{
        borderRadius: '1.75rem',
        padding: '1.75rem',
        border: '1px solid rgba(255,255,255,0.07)',
        transition: 'all 0.3s'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <Package size={16} style={{ color: 'var(--primary)' }} />
            <span className="title-font" style={{ fontWeight: 800, fontSize: '0.9rem', opacity: 0.8 }}>#{order.id.slice(-8).toUpperCase()}</span>
          </div>
          <span style={{ fontSize: '0.82rem', color: 'var(--foreground-muted)' }}>
            {createdAt.toLocaleDateString(isRtl ? 'ar-DZ' : 'fr-DZ', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.4rem 1rem',
            borderRadius: '2rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            background: `${statusCfg.color}15`,
            color: statusCfg.color,
            border: `1px solid ${statusCfg.color}30`
          }}>
            {statusCfg.icon}
            {isRtl ? statusCfg.labelAr : statusCfg.labelFr}
          </span>
          {order.paymentMethod === 'slickpay' && (
            <span style={{ fontSize: '0.7rem', color: 'var(--foreground-muted)', background: 'rgba(99,102,241,0.1)', padding: '0.2rem 0.6rem', borderRadius: '1rem' }}>
              via SlickPay
            </span>
          )}
        </div>
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
        {order.items?.map((item: any, i: number) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.7rem 1rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.025)', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', minWidth: 0 }}>
              <div style={{ width: 32, height: 32, borderRadius: '0.75rem', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {item.product?.image ? (
                  <img src={item.product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.75rem' }} />
                ) : (
                  <Zap size={16} style={{ color: '#e879f9' }} />
                )}
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {isRtl ? item.product?.nameAr : item.product?.nameFr}
                <span style={{ color: 'var(--foreground-muted)', marginInlineStart: '0.4rem' }}>× {item.quantity}</span>
              </span>
            </div>
            <span style={{ fontWeight: 700, fontSize: '0.9rem', flexShrink: 0, color: '#e879f9' }}>
              {Number(item.price).toLocaleString()} {isRtl ? 'د.ج' : 'DA'}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>{isRtl ? 'الإجمالي' : 'Total'}</span>
          <div className="title-font" style={{ fontWeight: 900, fontSize: '1.3rem', color: 'white' }}>
            {Number(order.total).toLocaleString()} <span style={{ fontSize: '0.85rem', color: '#e879f9', fontWeight: 600 }}>{isRtl ? 'د.ج' : 'DA'}</span>
          </div>
        </div>
        {order.status === 'PAID' ? (
          <button
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.2rem',
              borderRadius: '1rem',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            <Zap size={15} fill="currentColor" />
            {isRtl ? 'تحميل المفاتيح' : 'Télécharger les clés'}
          </button>
        ) : order.paymentMethod === 'slickpay' && order.status === 'PENDING' && order.slickpayInvoiceUrl ? (
          <a
            href={order.slickpayInvoiceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{
              textDecoration: 'none',
              padding: '0.6rem 1.2rem',
              borderRadius: '1rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              background: '#6366f1'
            }}
          >
            {isRtl ? 'إكمال الدفع' : 'Payer maintenant'}
          </a>
        ) : null}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const { locale } = useParams();
  const router = useRouter();
  const isRtl = locale === 'ar';

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`);
    } else if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, locale, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders'); // We'll create this helper endpoint
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="fade-in">
        <Navbar />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite' }} />
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="fade-in">
      <Navbar />
      <div className="container" style={{ padding: '2rem 2rem 6rem', maxWidth: 900 }}>
        <FadeIn>
          <div style={{ marginBottom: '3rem' }}>
            <h1 className="title-font gradient-text" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>
              {isRtl ? 'طلباتي' : 'Mes Commandes'}
            </h1>
            <p style={{ color: 'var(--foreground-muted)' }}>
              {isRtl ? 'سجل جميع مشترياتك الرقمية' : 'Historique de tous vos achats numériques'}
            </p>
          </div>
        </FadeIn>

        {orders.length === 0 ? (
          <FadeIn delay={0.2}>
            <div style={{ padding: '5rem 2rem', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', padding: '1.75rem', borderRadius: '50%', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', marginBottom: '1.5rem' }}>
                <ShoppingBag size={56} style={{ color: 'var(--primary)', opacity: 0.5 }} />
              </div>
              <h2 className="title-font" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                {isRtl ? 'لا توجد طلبات بعد' : 'Pas encore de commandes'}
              </h2>
              <Link href={`/${locale}/products`} className="btn-primary" style={{ textDecoration: 'none', padding: '0.9rem 2.5rem', borderRadius: '1.25rem', display: 'inline-block' }}>
                {isRtl ? 'تصفح المنتجات' : 'Parcourir les produits'}
              </Link>
            </div>
          </FadeIn>
        ) : (
          <StaggerContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {orders.map(order => (
                <StaggerItem key={order.id}>
                  <OrderCard order={order} isRtl={isRtl} locale={locale as string} />
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
