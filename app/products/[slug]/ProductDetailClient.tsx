'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartContext';
import { FadeIn, ScaleIn } from '@/components/Animations';
import {
  ShoppingCart, Zap, Check, Star, Shield, Headphones,
  CreditCard, Minus, Plus, Share2, Heart,
  Clock, ChevronRight,
} from 'lucide-react';

interface ProductDetailClientProps {
  product: {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    categoryName: string;
  };
  currency: string;
  labels: Record<string, string>;
}

export default function ProductDetailClient({ product, currency, labels }: ProductDetailClientProps) {
  const { addItem, items } = useCart();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'howto' | 'reviews'>('description');

  const itemInCart = items.find((i) => i.id === product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({ id: product.id, name: product.name, price: product.price, slug: product.slug, image: product.image });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({ id: product.id, name: product.name, price: product.price, slug: product.slug, image: product.image });
    }
    router.push(`/checkout`);
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined') {
      if (navigator.share) {
        navigator.share({ title: product.name, url: window.location.href });
      } else {
        navigator.clipboard?.writeText(window.location.href);
      }
    }
  };

  const trustFeatures = [
    { icon: <Zap size={18} fill="currentColor" />, label: labels.instantDelivery, color: '#e879f9' },
    { icon: <Shield size={18} />, label: labels.guarantee, color: '#22c55e' },
    { icon: <Headphones size={18} />, label: labels.support, color: '#6366f1' },
    { icon: <CreditCard size={18} />, label: labels.algerianPayments, color: '#f59e0b' },
  ];

  const tabs = [
    { id: 'description' as const, label: 'الوصف' },
    { id: 'howto' as const,       label: 'طريقة الاستخدام' },
    { id: 'reviews' as const,     label: 'التقييمات' },
  ];

  /* ─── how-to steps ─────────────────────── */
  const howToSteps = [
    { n: '01', title: 'أضف المنتج للسلة', desc: 'انقر على زر "أضف إلى السلة" أو "اشتري الآن" للمتابعة مباشرة.' },
    { n: '02', title: 'اختر طريقة الدفع', desc: 'اختر أحد طرق الدفع المتاحة: Baridimob، CCP، Edahabia، أو CIB.' },
    { n: '03', title: 'تأكيد الطلب', desc: 'بعد تأكيد الدفع، ستصلك المفاتيح الرقمية فوراً على حسابك.' },
    { n: '04', title: 'استمتع بالمنتج', desc: 'فعّل المفتاح في المنصة المناسبة وابدأ الاستمتاع مباشرة!' },
  ];

  /* ─── sample reviews ────────────────────── */
  const reviews = [
    { name: 'أحمد. ب', rating: 5, date: '15 مارس 2026', comment: 'منتج ممتاز، تسليم فوري. شكراً DigitalDZ!' },
    { name: 'كريم. م', rating: 4, date: '10 مارس 2026', comment: 'خدمة جيدة جداً والسعر مناسب. سأشتري مرة أخرى.' },
    { name: 'سارة. ل', rating: 4, date: '5 مارس 2026',  comment: 'تجربة تسوق سلسة، المفتاح شغّال 100%.' },
  ];

  return (
    <>
      <nav className="breadcrumb-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2.5rem', fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>
        <Link href="/" className="bc-link">{labels.home}</Link>
        <ChevronRight size={14} style={{ opacity: 0.4, transform: 'rotate(180deg)' }} />
        <Link href="/products" className="bc-link">{labels.products}</Link>
        <ChevronRight size={14} style={{ opacity: 0.4, transform: 'rotate(180deg)' }} />
        <span style={{ color: 'white', fontWeight: 600 }}>{product.name}</span>
      </nav>

      <div className="product-detail-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>

        <ScaleIn>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div
              className="glass-morphism"
              style={{
                borderRadius: '2.5rem',
                overflow: 'hidden',
                position: 'relative',
                aspectRatio: '1 / 1',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: product.image
                  ? 'rgba(0,0,0,0.3)'
                  : 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {product.image ? (
                <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{
                    width: 120, height: 120, borderRadius: '50%',
                    background: 'rgba(232,121,249,0.1)', border: '2px solid rgba(232,121,249,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem', boxShadow: '0 0 60px rgba(232,121,249,0.2)'
                  }}>
                    <Zap size={56} style={{ color: '#e879f9' }} />
                  </div>
                  <h2 className="title-font" style={{ fontSize: '1.4rem', fontWeight: 800, color: 'white', opacity: 0.9 }}>
                    {product.name}
                  </h2>
                </div>
              )}

              <div style={{
                position: 'absolute', top: '1.25rem', insetInlineEnd: '1.25rem',
                backgroundColor: 'rgba(10,10,12,0.7)', backdropFilter: 'blur(12px)',
                color: '#e879f9', padding: '0.5rem 1rem', borderRadius: '2rem',
                fontSize: '0.75rem', fontWeight: 800,
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                border: '1px solid rgba(232,121,249,0.3)', letterSpacing: '0.5px',
              }}>
                <Zap size={13} fill="currentColor" />
                تسليم فوري
              </div>

              <button
                onClick={() => setWishlisted((v) => !v)}
                className="wishlist-btn"
                style={{
                  position: 'absolute', top: '1.25rem', insetInlineStart: '1.25rem',
                  width: 44, height: 44, borderRadius: '50%',
                  background: wishlisted ? 'rgba(244,63,94,0.2)' : 'rgba(10,10,12,0.7)',
                  border: wishlisted ? '1px solid rgba(244,63,94,0.4)' : '1px solid rgba(255,255,255,0.1)',
                  color: wishlisted ? '#f43f5e' : 'white',
                  cursor: 'pointer', backdropFilter: 'blur(12px)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s',
                }}
              >
                <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {trustFeatures.map((f, i) => (
                <div key={i} className="glass-morphism" style={{
                  padding: '0.75rem 1rem', borderRadius: '1.25rem',
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.78rem',
                  color: 'var(--foreground-muted)',
                }}>
                  <span style={{ color: f.color, flexShrink: 0 }}>{f.icon}</span>
                  <span style={{ lineHeight: 1.3 }}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </ScaleIn>

        <FadeIn delay={0.2}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {product.categoryName && (
                <span style={{
                  padding: '0.35rem 0.9rem', borderRadius: '2rem',
                  background: 'rgba(99,102,241,0.15)', color: '#818cf8',
                  fontSize: '0.78rem', fontWeight: 700, border: '1px solid rgba(99,102,241,0.2)',
                }}>
                  {product.categoryName}
                </span>
              )}
              <span style={{
                padding: '0.35rem 0.9rem', borderRadius: '2rem',
                background: 'rgba(34,197,94,0.1)', color: '#22c55e',
                fontSize: '0.78rem', fontWeight: 700, border: '1px solid rgba(34,197,94,0.2)',
                display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                {labels.available}
              </span>
            </div>

            <div>
              <h1 className="title-font" style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 900, lineHeight: 1.15,
                marginBottom: '1rem', color: 'white',
              }}>
                {product.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={16} fill={s <= 4 ? '#f59e0b' : 'none'} style={{ color: s <= 4 ? '#f59e0b' : 'rgba(255,255,255,0.2)' }} />
                  ))}
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--foreground-muted)' }}>
                  4.0 (128 تقييم)
                </span>
              </div>
            </div>

            <div className="glass-morphism" style={{
              borderRadius: '1.75rem', padding: '1.5rem 2rem',
              border: '1px solid rgba(99,102,241,0.2)', background: 'rgba(99,102,241,0.05)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)', display: 'block', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {labels.priceLabel}
                  </span>
                  <span className="title-font" style={{ fontSize: '3rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>
                    {product.price.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '1.1rem', color: '#e879f9', fontWeight: 700, marginInlineStart: '0.5rem' }}>
                    {currency}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'var(--foreground-muted)' }}>
                  <Clock size={14} />
                  تسليم خلال دقائق
                </div>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--foreground-muted)', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {labels.quantity}
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="qty-btn"
                    style={{ width: 44, height: 44, background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Minus size={15} />
                  </button>
                  <span className="title-font" style={{ minWidth: 40, textAlign: 'center', fontWeight: 900, fontSize: '1.2rem' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="qty-btn"
                    style={{ width: 44, height: 44, background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--foreground-muted)' }}>
                  = {(product.price * quantity).toLocaleString()} {currency}
                </span>
                {itemInCart && (
                  <Link href="/cart" style={{ fontSize: '0.8rem', color: '#e879f9', textDecoration: 'none', fontWeight: 700 }}>
                    ({itemInCart.quantity} في السلة)
                  </Link>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={handleBuyNow}
                className="btn-primary buy-now-btn"
                style={{
                  width: '100%', padding: '1.1rem', borderRadius: '1.25rem',
                  fontSize: '1.1rem', fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                  background: 'linear-gradient(135deg, #6366f1, #e879f9)',
                  boxShadow: '0 8px 30px rgba(99,102,241,0.35)', border: 'none', cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                <Zap size={20} fill="currentColor" />
                {labels.buyNow}
              </button>

              <button
                onClick={handleAddToCart}
                className="glass-morphism"
                style={{
                  width: '100%', padding: '1rem', borderRadius: '1.25rem',
                  fontSize: '1rem', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                  color: addedToCart ? '#22c55e' : 'white',
                  border: addedToCart ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.1)',
                  background: addedToCart ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
                  cursor: 'pointer', transition: 'all 0.3s',
                }}
              >
                {addedToCart ? <Check size={20} /> : <ShoppingCart size={20} />}
                {addedToCart ? labels.addedToCart : labels.addToCart}
              </button>

              {addedToCart && (
                <Link
                  href="/cart"
                  style={{ display: 'block', textAlign: 'center', padding: '0.5rem', color: '#e879f9', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}
                >
                  {labels.viewCart} →
                </Link>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleShare}
                className="share-btn"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'transparent', border: 'none', color: 'var(--foreground-muted)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'color 0.2s' }}
              >
                <Share2 size={16} />
                مشاركة المنتج
              </button>
            </div>
          </div>
        </FadeIn>
      </div>

      <div style={{ marginTop: '4rem' }}>
        <FadeIn delay={0.3}>
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '2rem', overflowX: 'auto' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.9rem 1.75rem', background: 'transparent', border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid #e879f9' : '2px solid transparent',
                  color: activeTab === tab.id ? 'white' : 'var(--foreground-muted)',
                  cursor: 'pointer', fontWeight: activeTab === tab.id ? 700 : 500,
                  fontSize: '0.95rem', transition: 'all 0.2s',
                  marginBottom: '-1px', fontFamily: 'var(--font-inter)', whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="glass-morphism" style={{ borderRadius: '2rem', padding: '2.5rem', border: '1px solid rgba(255,255,255,0.07)', minHeight: 200 }}>

            {activeTab === 'description' && (
              <div>
                <p style={{ color: '#cbd5e1', lineHeight: 2, fontSize: '1.05rem' }}>
                  {product.description}
                </p>
                <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {[
                    { label: 'نوع المنتج', value: 'مفتاح رقمي' },
                    { label: 'التسليم', value: 'فوري - إلكتروني' },
                    { label: 'الفئة', value: product.categoryName || '—' },
                    { label: 'العملة', value: `دينار جزائري (${currency})` },
                  ].map((spec, i) => (
                    <div key={i} style={{ padding: '1rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{spec.label}</div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'howto' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {howToSteps.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: '1rem', flexShrink: 0,
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(232,121,249,0.3))',
                      border: '1px solid rgba(99,102,241,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span className="title-font" style={{ fontWeight: 900, fontSize: '0.85rem', color: '#e879f9' }}>{step.n}</span>
                    </div>
                    <div>
                      <h3 className="title-font" style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.35rem' }}>{step.title}</h3>
                      <p style={{ color: 'var(--foreground-muted)', lineHeight: 1.6, fontSize: '0.9rem' }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1.5rem', borderRadius: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div className="title-font" style={{ fontSize: '4rem', fontWeight: 900, lineHeight: 1, color: '#f59e0b' }}>4.0</div>
                    <div style={{ display: 'flex', gap: '0.2rem', justifyContent: 'center', margin: '0.5rem 0' }}>
                      {[1,2,3,4,5].map((s) => <Star key={s} size={16} fill={s<=4?'#f59e0b':'none'} style={{ color: s<=4?'#f59e0b':'rgba(255,255,255,0.2)' }} />)}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)' }}>128 تقييم</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 180 }}>
                    {[5,4,3,2,1].map((s) => (
                      <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--foreground-muted)', minWidth: 12 }}>{s}</span>
                        <Star size={12} fill="#f59e0b" style={{ color: '#f59e0b', flexShrink: 0 }} />
                        <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: '#f59e0b', borderRadius: 3, width: s===5?'60%':s===4?'25%':s===3?'10%':'5%' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {reviews.map((r, i) => (
                  <div key={i} style={{ padding: '1.25rem 1.5rem', borderRadius: '1.25rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #e879f9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', color: 'white', flexShrink: 0 }}>
                          {r.name[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.name}</div>
                          <div style={{ display: 'flex', gap: '0.15rem' }}>
                            {[1,2,3,4,5].map((s) => <Star key={s} size={11} fill={s<=r.rating?'#f59e0b':'none'} style={{ color: s<=r.rating?'#f59e0b':'rgba(255,255,255,0.2)' }} />)}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)' }}>{r.date}</span>
                    </div>
                    <p style={{ color: 'var(--foreground-muted)', lineHeight: 1.6, fontSize: '0.9rem' }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </FadeIn>
      </div>

      {/* Scoped styles */}
      <style>{`
        .bc-link {
          color: var(--foreground-muted);
          text-decoration: none;
          transition: color 0.2s;
        }
        .bc-link:hover { color: white; }
        .buy-now-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 35px rgba(99,102,241,0.5) !important; }
        .qty-btn:hover { background: rgba(255,255,255,0.08) !important; }
        .share-btn:hover { color: white !important; }
        @media (max-width: 768px) {
          .product-detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
