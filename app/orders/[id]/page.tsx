'use client';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/Animations';
import {
  Package, Clock, CheckCircle2, XCircle, Zap, ArrowRight,
  Key, Copy, Check, ShoppingBag, CreditCard, Phone, User
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { labelAr: string; color: string; icon: ReactNode }> = {
  PAID:      { labelAr: 'مدفوع',        color: '#22c55e', icon: <CheckCircle2 size={16}/> },
  COMPLETED: { labelAr: 'مكتمل',        color: '#22c55e', icon: <CheckCircle2 size={16}/> },
  PENDING:   { labelAr: 'قيد الانتظار', color: '#f59e0b', icon: <Clock size={16}/> },
  CANCELLED: { labelAr: 'ملغي',         color: '#f43f5e', icon: <XCircle  size={16}/> },
};

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} title="نسخ" style={{
      background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
      border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`,
      color: copied ? '#22c55e' : 'var(--foreground-muted)',
      borderRadius: '0.6rem',
      padding: '0.3rem 0.6rem',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.3rem',
      fontSize: '0.78rem',
    }}>
      {copied ? <Check size={13}/> : <Copy size={13}/>}
      {copied ? 'تم النسخ' : 'نسخ'}
    </button>
  );
}

export default function OrderDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    else if (status === 'authenticated' && orderId) fetchOrder();
  }, [status, orderId]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) { setError('لم يتم العثور على الطلب'); return; }
      setOrder(await res.json());
    } catch { setError('حدث خطأ أثناء تحميل الطلب'); }
    finally { setLoading(false); }
  };

  if (status === 'loading' || loading) return (
    <div className="fade-in">
      <Navbar />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.2)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite' }} />
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error || !order) return (
    <div className="fade-in">
      <Navbar />
      <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <ShoppingBag size={64} style={{ color: 'var(--primary)', opacity: 0.3, marginBottom: '1rem' }} />
        <h2 className="title-font" style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>{error || 'الطلب غير موجود'}</h2>
        <Link href="/orders" className="btn-primary" style={{ textDecoration: 'none', padding: '0.8rem 2rem', borderRadius: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowRight size={16}/> العودة للطلبات
        </Link>
      </div>
    </div>
  );

  const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
  const isCompleted = order.status === 'COMPLETED' || order.status === 'PAID';
  // Group keys by productId
  const keysByProduct: Record<string, any[]> = {};
  (order.keys || []).forEach((k: any) => {
    if (!keysByProduct[k.productId]) keysByProduct[k.productId] = [];
    keysByProduct[k.productId].push(k);
  });

  return (
    <div className="fade-in">
      <Navbar />
      <div className="container" style={{ padding: '2rem 2rem 6rem', maxWidth: 860 }}>
        {/* Back */}
        <FadeIn>
          <Link href="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground-muted)', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem', transition: 'color 0.2s' }}>
            <ArrowRight size={16}/> العودة إلى طلباتي
          </Link>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
            <div>
              <h1 className="title-font gradient-text" style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.3rem' }}>
                تفاصيل الطلب
              </h1>
              <p style={{ color: 'var(--foreground-muted)', fontFamily: 'monospace', fontSize: '0.9rem' }}>#{order.id.toUpperCase()}</p>
            </div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1.25rem', borderRadius: '2rem', fontSize: '0.9rem', fontWeight: 700,
              background: `${statusCfg.color}18`, color: statusCfg.color, border: `1px solid ${statusCfg.color}30`
            }}>
              {statusCfg.icon} {statusCfg.labelAr}
            </span>
          </div>
        </FadeIn>

        <StaggerContainer>
          {/* Order Info */}
          <StaggerItem>
            <div className="glass-morphism" style={{ padding: '1.75rem', borderRadius: '1.75rem', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '1.5rem' }}>
              <h2 className="title-font" style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={18} style={{ color: 'var(--primary)' }}/> معلومات الطلب
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                {[
                  { icon: <User size={14}/>,       label: 'العميل',      value: order.customerName || 'غير محدد' },
                  { icon: <Phone size={14}/>,       label: 'الهاتف',      value: order.customerPhone || 'غير محدد' },
                  { icon: <CreditCard size={14}/>,  label: 'طريقة الدفع', value: order.paymentMethod || 'غير محدد' },
                  { icon: <Clock size={14}/>,       label: 'تاريخ الطلب', value: new Date(order.createdAt).toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' }) },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '0.9rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.025)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--foreground-muted)', fontSize: '0.78rem', marginBottom: '0.3rem' }}>
                      {item.icon} {item.label}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </StaggerItem>

          {/* Products */}
          <StaggerItem>
            <div className="glass-morphism" style={{ padding: '1.75rem', borderRadius: '1.75rem', border: '1px solid rgba(255,255,255,0.07)', marginBottom: '1.5rem' }}>
              <h2 className="title-font" style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag size={18} style={{ color: '#e879f9' }}/> المنتجات
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {order.items?.map((item: any) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.9rem 1rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.025)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '0.75rem', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                        {item.product?.image
                          ? <img src={item.product.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                          : <Zap size={16} style={{ color: '#e879f9' }}/>}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.product?.nameAr}</div>
                        <div style={{ color: 'var(--foreground-muted)', fontSize: '0.8rem' }}>الكمية: {item.quantity}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, color: '#e879f9' }}>{Number(item.price * item.quantity).toLocaleString()} د.ج</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: 'var(--foreground-muted)' }}>الإجمالي</span>
                <span className="title-font" style={{ fontSize: '1.4rem', fontWeight: 900 }}>
                  {Number(order.total).toLocaleString()} <span style={{ color: '#e879f9', fontSize: '0.9rem' }}>د.ج</span>
                </span>
              </div>
            </div>
          </StaggerItem>

          {/* Digital Keys */}
          {isCompleted && order.keys?.length > 0 && (
            <StaggerItem>
              <div style={{
                padding: '1.75rem', borderRadius: '1.75rem',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(232,121,249,0.08))',
                border: '1px solid rgba(99,102,241,0.25)',
                marginBottom: '1.5rem'
              }}>
                <h2 className="title-font" style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.5rem', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Key size={18} style={{ color: '#fbbf24' }}/> مفاتيحك الرقمية
                </h2>
                <p style={{ color: 'var(--foreground-muted)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
                  احتفظ بهذه المفاتيح في مكان آمن. يمكنك نسخها بالضغط على زر النسخ.
                </p>
                {order.items?.map((item: any) => {
                  const productKeys = keysByProduct[item.productId] || [];
                  if (productKeys.length === 0) return null;
                  return (
                    <div key={item.id} style={{ marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '0.75rem' }}>
                        {item.product?.nameAr}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {productKeys.map((key: any) => (
                          <div key={key.id} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '0.8rem 1rem', borderRadius: '0.9rem',
                            background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.07)',
                            gap: '1rem', flexWrap: 'wrap'
                          }}>
                            <code style={{ fontFamily: 'monospace', fontSize: '0.95rem', letterSpacing: '1px', color: '#fbbf24', flex: 1, wordBreak: 'break-all' }}>
                              {key.code}
                            </code>
                            <CopyBtn text={key.code}/>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </StaggerItem>
          )}

          {/* Awaiting keys */}
          {!isCompleted && order.status === 'PENDING' && (
            <StaggerItem>
              <div style={{ padding: '1.75rem', borderRadius: '1.75rem', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', textAlign: 'center' }}>
                <Clock size={36} style={{ color: '#f59e0b', marginBottom: '0.75rem' }}/>
                <h3 className="title-font" style={{ fontWeight: 800, marginBottom: '0.5rem' }}>طلبك قيد المراجعة</h3>
                <p style={{ color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>سيتم إرسال مفاتيحك الرقمية فور تأكيد الدفع من قبل الإدارة.</p>
              </div>
            </StaggerItem>
          )}
        </StaggerContainer>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
