'use client';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/components/CartContext';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FadeIn } from '@/components/Animations';
import { CreditCard, Smartphone, Building2, CheckCircle2, Lock, ShieldCheck, Zap, ExternalLink, AlertCircle, Loader2, X } from 'lucide-react';

const PAYMENT_METHODS = [
  { id: 'slickpay', label: 'SlickPay', labelAr: 'SlickPay الدفع الإلكتروني', icon: '⚡', color: '#6366f1', description: 'الدفع الفوري بالبطاقة', descriptionFr: 'Paiement instantané par carte' },
  { id: 'baridimob', label: 'Baridimob', labelAr: 'بريدي موب', icon: '📱', color: '#f59e0b', description: 'تحويل عبر بريدي موب', descriptionFr: 'Transfert Baridimob' },
  { id: 'ccp', label: 'CCP', labelAr: 'CCP بريد الجزائر', icon: '🏦', color: '#10b981', description: 'تحويل بريد الجزائر', descriptionFr: 'Transfert CCP' },
  { id: 'cib', label: 'CIB', labelAr: 'بطاقة CIB', icon: '💳', color: '#8b5cf6', description: 'بطاقة ما بين البنوك', descriptionFr: 'Carte Interbancaire' },
];

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { locale } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const isRtl = locale === 'ar';

  const [selectedPayment, setSelectedPayment] = useState('slickpay');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState(session?.user?.name || '');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showSlickPayModal, setShowSlickPayModal] = useState(false);
  const [slickPayInvoiceNum, setSlickPayInvoiceNum] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Update name/email when session loads
  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
    if (session?.user?.email) setEmail(session.user.email);
  }, [session]);

  // Listen for iFrame messages from SlickPay
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.redirect) {
        // Payment successful via iFrame
        setShowSlickPayModal(false);
        setSuccess(true);
        clearCart();
        router.push(`/${locale}/checkout/success?orderId=slickpay-session`);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [locale, router, clearCart]);

  const handleSlickPayPayment = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/slickpay/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          customerName: name,
          customerPhone: phone,
          customerEmail: email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment failed');
      }

      if (data.paymentUrl) {
        // Redirect to SlickPay SATIM payment page
        setPaymentUrl(data.paymentUrl);
        window.location.href = data.paymentUrl;
      } else {
        // Fallback: show iFrame modal
        setSlickPayInvoiceNum(data.invoiceId);
        setShowSlickPayModal(true);
      }
    } catch (err: any) {
      console.error('SlickPay error:', err);
      setError(err.message || (isRtl ? 'حدث خطأ أثناء إنشاء الفاتورة' : 'Erreur lors de la création de la facture'));
    } finally {
      setLoading(false);
    }
  };

  const handleManualPayment = async () => {
    setLoading(true);
    setError('');

    try {
      // For manual methods, just simulate order creation
      await new Promise(r => setTimeout(r, 2000));
      setLoading(false);
      setSuccess(true);
      clearCart();
    } catch {
      setError(isRtl ? 'حدث خطأ' : 'Une erreur est survenue');
      setLoading(false);
    }
  };

  const handleOrder = async () => {
    if (selectedPayment === 'slickpay') {
      await handleSlickPayPayment();
    } else {
      await handleManualPayment();
    }
  };

  if (items.length === 0 && !success) {
    return (
      <div className="fade-in">
        <Navbar />
        <FadeIn>
          <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
            <h1 className="title-font" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              {isRtl ? 'السلة فارغة' : 'Panier vide'}
            </h1>
            <Link href={`/${locale}/products`} className="btn-primary" style={{ textDecoration: 'none', padding: '0.8rem 2rem', borderRadius: '1rem', display: 'inline-block' }}>
              {isRtl ? 'تصفح المنتجات' : 'Parcourir les produits'}
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
              {isRtl ? 'تم الطلب بنجاح! 🎉' : 'Commande réussie! 🎉'}
            </h1>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '1.1rem', marginBottom: '1rem', lineHeight: 1.6 }}>
              {isRtl
                ? 'شكراً لشرائك! سيتم مراجعة طلبك وإرسال المفاتيح الرقمية إلى حسابك خلال دقائق.'
                : 'Merci pour votre achat! Votre commande sera examinée et les clés numériques envoyées à votre compte dans quelques minutes.'}
            </p>
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
    fontFamily: 'var(--font-inter)'
  };

  const isSandbox = process.env.NEXT_PUBLIC_SLICKPAY_SANDBOX === 'true';
  const iframeLocale = locale === 'ar' ? 'AR' : 'FR';
  const iframeSrc = isSandbox
    ? `https://devapi.slick-pay.com/api/v2/iframe?locale=${iframeLocale}`
    : `https://prodapi.slick-pay.com/api/v2/iframe?locale=${iframeLocale}`;

  return (
    <div className="fade-in">
      <Navbar />
      <div className="container" style={{ padding: '2rem 2rem 6rem' }}>
        <FadeIn>
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 className="title-font gradient-text" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>
              {isRtl ? 'إتمام الشراء' : 'Finaliser la commande'}
            </h1>
            <p style={{ color: 'var(--foreground-muted)' }}>
              {isRtl ? 'أكمل البيانات أدناه لإتمام طلبك' : 'Complétez les informations ci-dessous'}
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
                  {isRtl ? 'معلومات الاتصال' : 'Informations de contact'}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--foreground-muted)', fontWeight: 600 }}>
                      {isRtl ? 'الاسم الكامل' : 'Nom complet'} *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder={isRtl ? 'أحمد بن علي' : 'Ahmed Ben Ali'}
                      style={inputStyle}
                      onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--primary)'}
                      onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--foreground-muted)', fontWeight: 600 }}>
                      {isRtl ? 'رقم الهاتف' : 'Numéro de téléphone'} *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="0555 123 456"
                      style={{ ...inputStyle, direction: 'ltr' }}
                      onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--primary)'}
                      onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--foreground-muted)', fontWeight: 600 }}>
                      {isRtl ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="email@example.com"
                      style={{ ...inputStyle, direction: 'ltr' }}
                      onFocus={e => (e.target as HTMLInputElement).style.borderColor = 'var(--primary)'}
                      onBlur={e => (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="glass-morphism" style={{ borderRadius: '2rem', padding: '2rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h2 className="title-font" style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 900 }}>2</span>
                  {isRtl ? 'طريقة الدفع' : 'Méthode de paiement'}
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
                        fontFamily: 'var(--font-outfit)',
                        textAlign: isRtl ? 'right' : 'left',
                        width: '100%',
                        position: 'relative',
                      }}
                    >
                      {/* Radio indicator */}
                      <div style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        border: selectedPayment === pm.id ? `2px solid ${pm.color}` : '2px solid rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.2s',
                      }}>
                        {selectedPayment === pm.id && (
                          <div style={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            background: pm.color,
                            animation: 'fadeIn 0.2s ease',
                          }} />
                        )}
                      </div>
                      
                      <span style={{ fontSize: '1.6rem', flexShrink: 0 }}>{pm.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.15rem' }}>
                          {isRtl ? pm.labelAr : pm.label}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--foreground-muted)', opacity: 0.8 }}>
                          {isRtl ? pm.description : pm.descriptionFr}
                        </div>
                      </div>

                      {/* Recommended badge for SlickPay */}
                      {pm.id === 'slickpay' && (
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '2rem',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          background: `${pm.color}20`,
                          color: pm.color,
                          border: `1px solid ${pm.color}40`,
                          flexShrink: 0,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}>
                          {isRtl ? 'موصى به' : 'Recommandé'}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* SlickPay info box */}
                {selectedPayment === 'slickpay' && (
                  <div style={{
                    marginTop: '1.25rem',
                    padding: '1.1rem 1.25rem',
                    borderRadius: '1rem',
                    background: 'rgba(99, 102, 241, 0.06)',
                    border: '1px solid rgba(99, 102, 241, 0.15)',
                    fontSize: '0.85rem',
                    color: 'var(--foreground-muted)',
                    lineHeight: 1.7,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                      <Zap size={16} style={{ color: '#6366f1' }} fill="#6366f1" />
                      <strong style={{ color: '#a5b4fc' }}>
                        {isRtl ? 'الدفع الإلكتروني الآمن' : 'Paiement électronique sécurisé'}
                      </strong>
                    </div>
                    {isRtl
                      ? 'ستتم إعادة توجيهك إلى بوابة الدفع الآمنة SlickPay لإتمام الدفع ببطاقتك البنكية (CIB/Edahabia). التسليم فوري بعد الدفع.'
                      : 'Vous serez redirigé vers la passerelle de paiement sécurisée SlickPay pour finaliser le paiement par carte bancaire (CIB/Edahabia). Livraison instantanée après paiement.'}
                  </div>
                )}

                {/* Manual payment info */}
                {selectedPayment !== 'slickpay' && (
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
                      {isRtl ? '⚠️ تعليمات الدفع' : '⚠️ Instructions de paiement'}
                    </strong>
                    {isRtl
                      ? 'بعد تأكيد الطلب، سيتم التواصل معك عبر الهاتف لإتمام عملية الدفع وتسليم المفاتيح الرقمية.'
                      : 'Après confirmation de la commande, nous vous contacterons par téléphone pour finaliser le paiement et livrer les clés numériques.'}
                  </div>
                )}
              </div>
            </div>
          </FadeIn>

          {/* Summary */}
          <FadeIn delay={0.2}>
            <div style={{ position: 'sticky', top: '100px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="glass-morphism" style={{ borderRadius: '2rem', padding: '2rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h2 className="title-font" style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                  {isRtl ? 'ملخص الطلب' : 'Récapitulatif'}
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
                      <span style={{ fontWeight: 700, flexShrink: 0, color: '#e879f9' }}>{(item.price * item.quantity).toLocaleString()} {isRtl ? 'د.ج' : 'DA'}</span>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                  <span className="title-font" style={{ fontSize: '1.1rem', fontWeight: 700 }}>{isRtl ? 'الإجمالي' : 'Total'}</span>
                  <span className="title-font gradient-text" style={{ fontSize: '1.8rem', fontWeight: 900 }}>
                    {totalPrice.toLocaleString()} {isRtl ? 'د.ج' : 'DA'}
                  </span>
                </div>

                {/* Error message */}
                {error && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.8rem 1rem',
                    borderRadius: '1rem',
                    background: 'rgba(244, 63, 94, 0.08)',
                    border: '1px solid rgba(244, 63, 94, 0.2)',
                    color: '#fda4af',
                    fontSize: '0.85rem',
                    marginBottom: '1rem',
                    animationName: 'fadeIn',
                    animationDuration: '0.3s',
                  }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  onClick={handleOrder}
                  disabled={loading || !name || !phone}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    borderRadius: '1.25rem',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    opacity: (loading || !name || !phone) ? 0.6 : 1,
                    cursor: (loading || !name || !phone) ? 'not-allowed' : 'pointer',
                    border: 'none',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                      {isRtl ? 'جاري المعالجة...' : 'Traitement...'}
                    </span>
                  ) : selectedPayment === 'slickpay' ? (
                    <>
                      <Zap size={18} />
                      {isRtl ? 'الدفع عبر SlickPay' : 'Payer avec SlickPay'}
                      <ExternalLink size={14} style={{ opacity: 0.7 }} />
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      {isRtl ? 'تأكيد الطلب' : 'Confirmer la commande'}
                    </>
                  )}
                </button>

                {/* SlickPay badge */}
                {selectedPayment === 'slickpay' && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: '1rem',
                    fontSize: '0.75rem',
                    color: 'var(--foreground-muted)',
                    opacity: 0.7,
                  }}>
                    <Lock size={12} />
                    <span>{isRtl ? 'مؤمّن بواسطة SlickPay' : 'Sécurisé par SlickPay'}</span>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#22c55e' }} />
                    <span>SSL</span>
                  </div>
                )}
              </div>

              {/* Security badges */}
              <div className="glass-morphism" style={{ borderRadius: '1.5rem', padding: '1.25rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { icon: <ShieldCheck size={16} style={{ color: '#22c55e' }} />, text: isRtl ? 'دفع آمن ومشفر' : 'Paiement sécurisé' },
                    { icon: <Zap size={16} style={{ color: '#e879f9' }} />, text: isRtl ? 'تسليم رقمي فوري' : 'Livraison numérique instantanée' },
                    { icon: <CheckCircle2 size={16} style={{ color: 'var(--primary)' }} />, text: isRtl ? 'ضمان استرداد الأموال' : 'Garantie de remboursement' },
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

      {/* SlickPay iFrame Modal (fallback) */}
      {showSlickPayModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.3s ease',
        }}>
          <div style={{
            background: '#0f0f1a',
            borderRadius: '2rem',
            width: '95vw',
            maxWidth: 500,
            maxHeight: '90vh',
            overflow: 'hidden',
            border: '1px solid rgba(99,102,241,0.2)',
            boxShadow: '0 25px 80px rgba(0,0,0,0.6)',
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '0.75rem',
                  background: 'rgba(99,102,241,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Zap size={18} style={{ color: '#6366f1' }} fill="#6366f1" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem' }}>SlickPay</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)' }}>
                    {isRtl ? 'الدفع الإلكتروني' : 'Paiement électronique'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowSlickPayModal(false)}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* iFrame */}
            <div style={{ padding: '0', height: '500px' }}>
              <iframe
                ref={iframeRef}
                id="sp-frame"
                src={iframeSrc}
                frameBorder="0"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  background: 'white',
                  borderRadius: '0 0 2rem 2rem',
                }}
                onLoad={() => {
                  // Send invoice data to iFrame
                  if (iframeRef.current && slickPayInvoiceNum) {
                    iframeRef.current.contentWindow?.postMessage({
                      prod: !isSandbox,
                      invoice: slickPayInvoiceNum,
                    }, '*');
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
