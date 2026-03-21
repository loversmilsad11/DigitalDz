'use client';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useCart } from '@/components/CartContext';
import { FadeIn } from '@/components/Animations';
import { CheckCircle2, Zap, AlertCircle, Package } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const isRtl = locale === 'ar';
  const { clearCart } = useCart();
  const isError = orderId === 'error';

  useEffect(() => {
    // Clear cart on successful payment
    if (orderId && !isError) {
      clearCart();
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
              animation: 'fadeIn 0.5s ease'
            }}>
              <AlertCircle size={72} style={{ color: '#f43f5e' }} />
            </div>
            <h1 className="title-font" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', color: '#f43f5e' }}>
              {isRtl ? 'حدث خطأ في الدفع' : 'Erreur de paiement'}
            </h1>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '1.1rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              {isRtl
                ? 'عذراً، حدث خطأ أثناء معالجة الدفع. يرجى المحاولة مرة أخرى أو التواصل مع الدعم.'
                : 'Désolé, une erreur est survenue lors du paiement. Veuillez réessayer ou contacter le support.'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href={`/${locale}/checkout`} className="btn-primary" style={{ textDecoration: 'none', padding: '0.9rem 2rem', borderRadius: '1.25rem', display: 'inline-block' }}>
                {isRtl ? 'إعادة المحاولة' : 'Réessayer'}
              </Link>
              <Link href={`/${locale}/contact`} style={{ textDecoration: 'none', padding: '0.9rem 2rem', borderRadius: '1.25rem', display: 'inline-block', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 600 }}>
                {isRtl ? 'اتصل بالدعم' : 'Contacter le support'}
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
            animation: 'successPulse 2s ease-in-out infinite'
          }}>
            <CheckCircle2 size={72} style={{ color: '#22c55e' }} />
          </div>

          <h1 className="title-font gradient-text" style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1rem' }}>
            {isRtl ? 'تم الدفع بنجاح! 🎉' : 'Paiement réussi! 🎉'}
          </h1>
          
          <p style={{ color: 'var(--foreground-muted)', fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            {isRtl
              ? 'شكراً لشرائك! تمت معالجة الدفع بنجاح عبر SlickPay. سيتم تسليم المفاتيح الرقمية إلى حسابك.'
              : 'Merci pour votre achat! Le paiement a été traité avec succès via SlickPay. Les clés numériques seront livrées à votre compte.'}
          </p>

          {orderId && (
            <div className="glass-morphism" style={{ borderRadius: '1.5rem', padding: '1.5rem', marginBottom: '2rem', border: '1px solid rgba(34, 197, 94, 0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <Package size={18} style={{ color: 'var(--primary)' }} />
                <span style={{ fontWeight: 700, color: 'var(--foreground-muted)', fontSize: '0.9rem' }}>
                  {isRtl ? 'رقم الطلب' : 'Numéro de commande'}
                </span>
              </div>
              <div className="title-font" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                {orderId}
              </div>
            </div>
          )}

          <div className="glass-morphism" style={{ borderRadius: '1.5rem', padding: '1.5rem', marginBottom: '2.5rem', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: '#22c55e' }}>
              <Zap size={20} fill="currentColor" />
              <span style={{ fontWeight: 700 }}>
                {isRtl ? 'التسليم الرقمي الفوري نشط' : 'Livraison numérique instantanée activée'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`/${locale}/orders`} className="btn-primary" style={{ textDecoration: 'none', padding: '0.9rem 2rem', borderRadius: '1.25rem', display: 'inline-block' }}>
              {isRtl ? 'عرض طلباتي' : 'Voir mes commandes'}
            </Link>
            <Link href={`/${locale}/products`} style={{ textDecoration: 'none', padding: '0.9rem 2rem', borderRadius: '1.25rem', display: 'inline-block', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', fontWeight: 600 }}>
              {isRtl ? 'مواصلة التسوق' : 'Continuer les achats'}
            </Link>
          </div>
        </div>
      </FadeIn>

      <style>{`
        @keyframes successPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.1); }
          50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.25); }
        }
      `}</style>
    </div>
  );
}
