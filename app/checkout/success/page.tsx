'use client';
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useCart } from '@/components/CartContext';
import { FadeIn } from '@/components/Animations';
import { CheckCircle2, Zap, AlertCircle, Package } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { clearCart } = useCart();
  const isError = orderId === 'error';

  useEffect(() => {
    // Clear cart on successful payment
    if (orderId && !isError) {
      clearCart();
      
      // Generate Confetti
      const colors = ['#6366f1', '#e879f9', '#3b82f6', '#f43f5e', '#fbbf24'];
      for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.animationDelay = Math.random() * 3 + 's';
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
      }
    }
  }, [orderId, isError, clearCart]);

  if (isError) {
    return (
      <div className="fade-in">
        <Navbar />
        <FadeIn>
          <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center', maxWidth: 600 }}>
            <div style={{
              display: 'inline-flex',
              padding: '2rem',
              borderRadius: '50%',
              background: 'rgba(244, 63, 94, 0.1)',
              border: '2px solid rgba(244, 63, 94, 0.3)',
              marginBottom: '2rem',
            }}>
              <AlertCircle size={72} style={{ color: '#f43f5e' }} />
            </div>
            <h1 className="title-font" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', color: '#f43f5e' }}>
              حدث خطأ في الطلب
            </h1>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/checkout" className="btn-primary" style={{ textDecoration: 'none', padding: '0.9rem 2rem', borderRadius: '1.25rem', display: 'inline-block' }}>
                إعادة المحاولة
              </Link>
              <Link href="/contact" style={{ textDecoration: 'none', padding: '0.9rem 2rem', borderRadius: '1.25rem', display: 'inline-block', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 600 }}>
                اتصل بالدعم
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <Navbar />
      <FadeIn>
        <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center', maxWidth: 650 }}>
          {/* Success Icon with animated glow */}
          <div style={{
            display: 'inline-flex',
            padding: '2rem',
            borderRadius: '50%',
            background: 'rgba(34, 197, 94, 0.1)',
            border: '2px solid rgba(34, 197, 94, 0.3)',
            marginBottom: '2rem',
          }}>
            <CheckCircle2 size={72} style={{ color: '#22c55e' }} />
          </div>

          <h1 className="title-font gradient-text" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>
            تم الطلب بنجاح! 🎉
          </h1>
          
          <p style={{ color: 'var(--foreground-muted)', fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            شكراً لشرائك! سيتم مراجعة طلبك وإرسال المفاتيح الرقمية إلى حسابك بعد تأكيد الدفع.
          </p>

          {orderId && (
            <div className="glass-morphism" style={{ borderRadius: '1.5rem', padding: '1.5rem', marginBottom: '2rem', border: '1px solid rgba(34, 197, 94, 0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Package size={18} style={{ color: 'var(--primary)' }} />
                <span style={{ fontWeight: 700, color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>
                  رقم الطلب
                </span>
              </div>
              <div className="title-font" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                {orderId}
              </div>
            </div>
          )}

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
