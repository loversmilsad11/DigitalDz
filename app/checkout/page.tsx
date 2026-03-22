'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/components/CartContext';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FadeIn } from '@/components/Animations';
import { CheckCircle2, Lock, ShieldCheck, Zap, AlertCircle, ShoppingCart } from 'lucide-react';

const PAYMENT_METHODS = [
  { id: 'baridimob', label: 'Baridimob', labelAr: 'بريدي موب', icon: '📱', color: '#f59e0b', description: 'تحويل عبر بريدي موب' },
  { id: 'ccp', label: 'CCP', labelAr: 'CCP بريد الجزائر', icon: '🏦', color: '#10b981', description: 'تحويل بريد الجزائر' },
  { id: 'cib', label: 'CIB', labelAr: 'بطاقة CIB', icon: '💳', color: '#8b5cf6', description: 'بطاقة ما بين البنوك' },
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { data: session } = useSession();

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
      // Simulate API call for order creation
      await new Promise(r => setTimeout(r, 2000));
      
      // In a real app, we would call an API to create the order with 'PENDING' status
      // For now, we just simulate success
      setLoading(false);
      setSuccess(true);
      clearCart();
    } catch {
      setError('حدث خطأ أثناء معالجة الطلب');
      setLoading(false);
    }
  };

  if (items.length === 0 && !success) {
    return (
      <div className="fade-in">
        <Navbar />
        <FadeIn>
          <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '1.5rem', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', marginBottom: '1.5rem' }}>
              <ShoppingCart size={48} style={{ opacity: 0.3 }} />
            </div>
            <h1 className="title-font" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              السلة فارغة
            </h1>
            <Link href="/products" className="btn-primary" style={{ textDecoration: 'none', padding: '0.8rem 2rem', borderRadius: '1rem', display: 'inline-block' }}>
              تصفح المنتجات
            </Link>
          </div>
        </FadeIn>
      </div>
    );
  }

  if (success) {
    return (
      <div className="fade-in">
        <Navbar />
        <FadeIn>
          <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center', maxWidth: 600 }}>
            <div style={{
              display: 'inline-flex',
              padding: '2rem',
              borderRadius: '50%',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '2px solid rgba(34, 197, 94, 0.3)',
              marginBottom: '2rem',
              animation: 'fadeIn 0.5s ease'
            }}>
              <CheckCircle2 size={72} style={{ color: '#22c55e' }} />
            </div>
            <h1 className="title-font gradient-text" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>
              تم الطلب بنجاح! 🎉
            </h1>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '1.1rem', marginBottom: '1rem', lineHeight: 1.6 }}>
              شكراً لشرائك! سيتم مراجعة طلبك وإرسال المفاتيح الرقمية إلى حسابك بعد تأكيد الدفع.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
              <Link href="/orders" className="btn-primary" style={{ textDecoration: 'none', padding: '0.9rem 2rem', borderRadius: '1.25rem', display: 'inline-block' }}>
                عرض طلباتي
              </Link>
              <Link href="/products" style={{ textDecoration: 'none', padding: '0.9rem 2rem', borderRadius: '1.25rem', display: 'inline-block', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 600 }}>
                مواصلة التسوق
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.9rem 1.2rem',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '1rem',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div className="fade-in">
      <Navbar />
      <div className="container" style={{ padding: '2rem 2rem 6rem' }}>
        <FadeIn>
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 className="title-font gradient-text" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>
              إتمام الشراء
            </h1>
            <p style={{ color: 'var(--foreground-muted)' }}>
              أكمل البيانات أدناه لإتمام طلبك
            </p>
          </div>
        </FadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr min(420px, 100%)', gap: '2rem', alignItems: 'start' }}>
          {/* Form */}
          <FadeIn>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Step 1: Contact Info */}
              <div className="glass-morphism" style={{ borderRadius: '2rem', padding: '2rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h2 className="title-font" style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 900 }}>1</span>
                   معلومات الاتصال
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--foreground-muted)', fontWeight: 600 }}>
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="أحمد بن علي"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--foreground-muted)', fontWeight: 600 }}>
                      رقم الهاتف *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="0555 123 456"
                      style={{ ...inputStyle, direction: 'ltr' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--foreground-muted)', fontWeight: 600 }}>
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      style={{ ...inputStyle, direction: 'ltr' }}
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="glass-morphism" style={{ borderRadius: '2rem', padding: '2rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h2 className="title-font" style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 900 }}>2</span>
                  طريقة الدفع
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {PAYMENT_METHODS.map(pm => (
                    <button
                      key={pm.id}
                      onClick={() => { setSelectedPayment(pm.id); setError(''); }}
                      style={{
                        padding: '1.1rem 1.25rem',
                        borderRadius: '1.25rem',
                        border: selectedPayment === pm.id ? `2px solid ${pm.color}` : '1px solid rgba(255,255,255,0.08)',
                        background: selectedPayment === pm.id ? `${pm.color}12` : 'rgba(255,255,255,0.02)',
                        color: 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        transition: 'all 0.2s',
                        textAlign: 'right',
                        width: '100%',
                      }}
                    >
                      <div style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        border: selectedPayment === pm.id ? `2px solid ${pm.color}` : '2px solid rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        {selectedPayment === pm.id && (
                          <div style={{ width: 12, height: 12, borderRadius: '50%', background: pm.color }} />
                        )}
                      </div>
                      <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{pm.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.15rem' }}>{pm.labelAr}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--foreground-muted)', opacity: 0.8 }}>{pm.description}</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div style={{
                  marginTop: '1.25rem',
                  padding: '1.1rem 1.25rem',
                  borderRadius: '1rem',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px dashed rgba(255,255,255,0.08)',
                  fontSize: '0.85rem',
                  color: 'var(--foreground-muted)',
                  lineHeight: 1.6,
                }}>
                  <strong style={{ color: 'white', display: 'block', marginBottom: '0.3rem' }}>
                    ⚠️ تعليمات الدفع
                  </strong>
                  بعد تأكيد الطلب، سيتم التواصل معك عبر الهاتف لإتمام عملية الدفع وتسليم المفاتيح الرقمية.
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Summary */}
          <FadeIn delay={0.2}>
            <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="glass-morphism" style={{ borderRadius: '2rem', padding: '2rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h2 className="title-font" style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                  ملخص الطلب
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem' }}>
                  {items.map(item => (
                    <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                        <div style={{ width: 40, height: 40, borderRadius: '0.75rem', overflow: 'hidden', background: 'rgba(255,255,255,0.05)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {item.image ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Zap size={20} style={{ color: '#e879f9' }} />}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)' }}>× {item.quantity}</span>
                        </div>
                      </div>
                      <span style={{ fontWeight: 700, flexShrink: 0, color: '#e879f9' }}>{(item.price * item.quantity).toLocaleString()} د.ج</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <span className="title-font" style={{ fontSize: '1.1rem', fontWeight: 700 }}>الإجمالي</span>
                  <span className="title-font gradient-text" style={{ fontSize: '1.8rem', fontWeight: 900 }}>{totalPrice.toLocaleString()} د.ج</span>
                </div>

                {error && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.8rem 1rem', borderRadius: '1rem', background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.2)', color: '#fda4af', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handleManualPayment}
                  disabled={loading || !name || !phone}
                  className="btn-primary"
                  style={{ width: '100%', padding: '1rem', borderRadius: '1.25rem', fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', opacity: (loading || !name || !phone) ? 0.6 : 1 }}
                >
                  {loading ? 'جاري المعالجة...' : <><Lock size={18} /> تأكيد الطلب</>}
                </button>
              </div>

              <div className="glass-morphism" style={{ borderRadius: '1.5rem', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { icon: <ShieldCheck size={16} style={{ color: '#22c55e' }} />, text: 'دفع آمن ومشفر' },
                    { icon: <Zap size={16} style={{ color: '#e879f9' }} />, text: 'تسليم رقمي فوري' },
                    { icon: <CheckCircle2 size={16} style={{ color: 'var(--primary)' }} />, text: 'ضمان استرداد الأموال' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--foreground-muted)' }}>
                      {item.icon}
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
