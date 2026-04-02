'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/components/CartContext';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FadeIn } from '@/components/Animations';
import { CheckCircle2, Lock, ShieldCheck, Zap, ExternalLink, AlertCircle, ShoppingCart, Tag } from 'lucide-react';
import { validateCoupon } from '@/lib/user-actions';

const PAYMENT_METHODS = [
  { id: 'baridimob', label: 'Baridimob', labelAr: 'بريدي موب', icon: '📱', color: '#f59e0b', description: 'تحويل عبر بريدي موب' },
  { id: 'ccp', label: 'CCP', labelAr: 'CCP بريد الجزائر', icon: '🏦', color: '#10b981', description: 'تحويل بريد الجزائر' },
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const [selectedPayment, setSelectedPayment] = useState('baridimob');
  const [transactionId, setTransactionId] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState(session?.user?.name || '');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
    if (session?.user?.email) setEmail(session.user.email);
  }, [session]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await validateCoupon(couponCode, totalPrice);
      if (res.error) {
        setCouponError(res.error);
        setAppliedCoupon(null);
        setDiscountAmount(0);
      } else {
        setAppliedCoupon(res.coupon);
        setDiscountAmount(res.discountAmount || 0);
        setCouponError('');
      }
    } catch (err) {
      setCouponError('حدث خطأ أثناء التحقق من الكوبون');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleManualPayment = async () => {
    if (!transactionId) {
      setError('يرجى إدخال رقم المعاملة أو رقم الوصل');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/checkout/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price })),
          paymentMethod: selectedPayment,
          paymentId: transactionId,
          name, phone, email,
          couponCode: appliedCoupon?.code
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'فشل إنشاء الطلب');

      setSuccess(true);
      clearCart();
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء الاتصال بالخادم');
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

        <div className="checkout-grid" style={{ display: 'grid', gridTemplateColumns: '1fr min(420px, 100%)', gap: '2rem', alignItems: 'start' }}>
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
                 <div style={{ marginTop: '1.5rem' }}>
                   <p style={{ fontSize: '0.9rem', color: 'var(--foreground-muted)', marginBottom: '0.75rem' }}>الرجاء إدخال رقم المعاملة أو رقم الوصل لتأكيد الدفع الخاص بك:</p>
                   <input type="text" value={transactionId} onChange={e => setTransactionId(e.target.value)} placeholder="رقم المعاملة (Transaction ID / N° de CCP)" style={{ ...inputStyle, direction: 'ltr' }} />
                 </div>
              </div>
            </div>
          </FadeIn>

          {/* Summary */}
          <FadeIn delay={0.2}>
             <div className="glass-morphism" style={{ padding: '2rem', borderRadius: '2rem', border: '1px solid var(--glass-border)', position: 'sticky', top: '100px' }}>
                <h2 className="title-font" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>ملخص الطلب</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--foreground-muted)' }}>
                    <span>المجموع الفرعي</span>
                    <span>{totalPrice.toLocaleString()} د.ج</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#22c55e', fontWeight: 600 }}>
                      <span>خصم ({appliedCoupon.code})</span>
                      <span>-{discountAmount.toLocaleString()} د.ج</span>
                    </div>
                  )}
                  
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.75rem', marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 800 }}>الإجمالي النهائي</span>
                    <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>
                       {(totalPrice - discountAmount).toLocaleString()} <span style={{ fontSize: '0.9rem' }}>د.ج</span>
                    </span>
                  </div>
                </div>

                {/* Coupon Input */}
                {!appliedCoupon ? (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="text" 
                        value={couponCode} 
                        onChange={e => setCouponCode(e.target.value.toUpperCase())} 
                        placeholder="كود الخصم" 
                        style={{ ...inputStyle, padding: '0.75rem 1rem', fontSize: '0.9rem' }} 
                      />
                      <button 
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode.trim()}
                        style={{ 
                          padding: '0.75rem 1.25rem', 
                          borderRadius: '1rem', 
                          background: 'rgba(255,255,255,0.05)', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'white',
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontSize: '0.85rem'
                        }}
                      >
                        {couponLoading ? '...' : 'تطبيق'}
                      </button>
                    </div>
                    {couponError && <p style={{ color: '#f43f5e', fontSize: '0.75rem', marginTop: '0.5rem', display: 'flex', gap: '0.25rem', alignItems: 'center' }}><AlertCircle size={12} /> {couponError}</p>}
                  </div>
                ) : (
                  <div style={{ marginBottom: '1.5rem', padding: '0.75rem', borderRadius: '1rem', background: 'rgba(34,197,94,0.1)', border: '1px dashed rgba(34,197,94,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22c55e', fontSize: '0.85rem', fontWeight: 700 }}>
                      <Tag size={14} /> تم تطبيق الكوبون
                    </div>
                    <button onClick={() => { setAppliedCoupon(null); setDiscountAmount(0); setCouponCode(''); }} style={{ background: 'none', border: 'none', color: '#f43f5e', cursor: 'pointer', fontSize: '0.75rem' }}>إزالة</button>
                  </div>
                )}
                
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
