'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/components/CartContext';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FadeIn } from '@/components/Animations';
import { CheckCircle2, Lock, ShieldCheck, Zap, ExternalLink, AlertCircle, ShoppingCart } from 'lucide-react';

const PAYMENT_METHODS = [
  { id: 'baridimob', label: 'Baridimob', labelAr: 'بريدي موب', icon: '📱', color: '#f59e0b', description: 'تحويل عبر بريدي موب' },
  { id: 'ccp', label: 'CCP', labelAr: 'CCP بريد الجزائر', icon: '🏦', color: '#10b981', description: 'تحويل بريد الجزائر' },
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const [selectedPayment, setSelectedPayment] = useState('baridimob');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState(session?.user?.name || '');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
    if (session?.user?.email) setEmail(session.user.email);
  }, [session]);

  const handleManualPayment = async () => {
    setLoading(true);
    setError('');

    try {
      await new Promise(r => setTimeout(r, 2000));
      setLoading(false);
      setSuccess(true);
      clearCart();
    } catch {
      setError('حدث خطأ');
      setLoading(false);
    }
  };

  const handleOrder = async () => {
    await handleManualPayment();
  };

  if (items.length === 0 && !success) {
    return (
      <div className="fade-in">
        <Navbar />
        <FadeIn>
          <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
            <h1 className="title-font" style={{ fontSize: '2rem', marginBottom: '1rem' }}>السلة فارغة</h1>
            <Link href="/products" className="btn-primary" style={{ textDecoration: 'none', padding: '0.8rem 2rem', borderRadius: '1rem', display: 'inline-block' }}>تصفح المنتجات</Link>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <Navbar />
      <div className="container" style={{ padding: '2rem 2rem 6rem' }}>
        <FadeIn>
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 className="title-font gradient-text" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>
              إتمام الشراء
            </h1>
            <p style={{ color: 'var(--foreground-muted)' }}>أكمل البيانات أدناه لإتمام طلبك</p>
          </div>
        </FadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr min(420px, 100%)', gap: '2rem', alignItems: 'start' }}>
          {/* Form */}
          <FadeIn>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="glass-morphism" style={{ borderRadius: '2rem', padding: '2rem', border: '1px solid var(--glass-border)' }}>
                <h2 className="title-font" style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 900 }}>1</span>
                  معلومات الاتصال
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="الاسم الكامل" style={inputStyle} />
                   <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="رقم الهاتف (05xx...)" style={{ ...inputStyle, direction: 'ltr' }} />
                   <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="البريد الإلكتروني" style={{ ...inputStyle, direction: 'ltr' }} />
                </div>
              </div>

              <div className="glass-morphism" style={{ borderRadius: '2rem', padding: '2rem', border: '1px solid var(--glass-border)' }}>
                 <h2 className="title-font" style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 900 }}>2</span>
                    طريقة الدفع
                 </h2>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {PAYMENT_METHODS.map(pm => (
                      <button
                        key={pm.id}
                        onClick={() => setSelectedPayment(pm.id)}
                        style={{
                          padding: '1.2rem',
                          borderRadius: '1.25rem',
                          border: selectedPayment === pm.id ? `2px solid ${pm.color}` : '1px solid rgba(255,255,255,0.06)',
                          background: selectedPayment === pm.id ? `${pm.color}15` : 'rgba(255,255,255,0.02)',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          transition: 'all 0.2s',
                          width: '100%',
                          textAlign: 'start'
                        }}
                      >
                         <span style={{ fontSize: '1.6rem' }}>{pm.icon}</span>
                         <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 800 }}>{pm.labelAr}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>{pm.description}</div>
                         </div>
                      </button>
                    ))}
                 </div>
              </div>
            </div>
          </FadeIn>

          {/* Summary */}
          <FadeIn delay={0.2}>
             <div className="glass-morphism" style={{ padding: '2rem', borderRadius: '2rem', border: '1px solid var(--glass-border)', position: 'sticky', top: '100px' }}>
                <h2 className="title-font" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>ملخص الطلب</h2>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '1.5rem' }}>
                   {totalPrice.toLocaleString()} <span style={{ fontSize: '0.9rem' }}>د.ج</span>
                </div>
                
                {error && <div style={{ color: '#f43f5e', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}><AlertCircle size={14} />{error}</div>}
                
                <button
                  onClick={handleOrder}
                  disabled={loading || !name || !phone}
                  className="btn-primary"
                  style={{ width: '100%', padding: '1.1rem', borderRadius: '1.25rem', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', opacity: (loading || !name || !phone) ? 0.6 : 1 }}
                >
                  {loading ? 'جاري المعالجة...' : 'تأكيد الطلب'}
                </button>
                
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem', color: 'var(--foreground-muted)' }}><ShieldCheck size={14} style={{ color: '#22c55e' }} /> دفع آمن تماماً</div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem', color: 'var(--foreground-muted)' }}><Zap size={14} style={{ color: '#e879f9' }} /> تسليم رقمي فوري</div>
                </div>
             </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '1rem 1.25rem',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '1.25rem',
  color: 'white',
  fontFamily: 'var(--font-inter)',
  outline: 'none',
  fontSize: '1rem'
};
