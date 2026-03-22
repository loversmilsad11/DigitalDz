'use client';
import { useCart } from '@/components/CartContext';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight, Zap, ShoppingCart } from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/Animations';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="fade-in">
        <Navbar />
        <FadeIn>
          <div className="container" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
            <div style={{
              display: 'inline-flex',
              padding: '2rem',
              borderRadius: '50%',
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.2)',
              marginBottom: '2rem'
            }}>
              <ShoppingCart size={64} style={{ color: 'var(--primary)', opacity: 0.5 }} />
            </div>
            <h1 className="title-font" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
              سلة التسوق فارغة
            </h1>
            <p style={{ color: 'var(--foreground-muted)', fontSize: '1.1rem', marginBottom: '3rem' }}>
              لم تضف أي منتج بعد. تصفح متجرنا واستكشف أفضل العروض!
            </p>
            <Link href="/products" className="btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2.5rem', borderRadius: '1.25rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag size={20} />
              تصفح المنتجات
            </Link>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 className="title-font gradient-text" style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                سلة التسوق
              </h1>
              <p style={{ color: 'var(--foreground-muted)' }}>
                {totalItems} منتج في السلة
              </p>
            </div>
            <button
              onClick={clearCart}
              style={{
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.2)',
                color: '#f43f5e',
                borderRadius: '1rem',
                padding: '0.6rem 1.2rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
              onMouseOver={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(244, 63, 94, 0.2)';
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(244, 63, 94, 0.1)';
              }}
            >
              <Trash2 size={16} />
              إفراغ السلة
            </button>
          </div>
        </FadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr min(380px, 100%)', gap: '2rem', alignItems: 'start' }}>
          {/* Cart Items */}
          <StaggerContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map(item => (
                <StaggerItem key={item.id}>
                  <div className="glass-morphism" style={{
                    borderRadius: '1.5rem',
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    border: '1px solid rgba(255,255,255,0.06)',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(232, 121, 249, 0.2)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'}
                  >
                    {/* Image */}
                    <div style={{
                      width: 80,
                      height: 80,
                      borderRadius: '1rem',
                      overflow: 'hidden',
                      flexShrink: 0,
                      background: item.image ? 'transparent' : 'linear-gradient(135deg, #1e1b4b, #312e81)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Zap size={32} style={{ color: 'rgba(232, 121, 249, 0.5)' }} />
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 className="title-font" style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.3rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </h3>
                      <p style={{ color: '#e879f9', fontWeight: 800, fontSize: '1.1rem' }}>
                        {(item.price * item.quantity).toLocaleString()} د.ج
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{
                          width: 32, height: 32,
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'}
                        onMouseOut={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)'}
                      >
                        <Minus size={14} />
                      </button>
                      <span className="title-font" style={{ fontWeight: 800, fontSize: '1.2rem', minWidth: '1.5rem', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          width: 32, height: 32,
                          borderRadius: '50%',
                          background: 'rgba(99,102,241,0.2)',
                          border: '1px solid rgba(99,102,241,0.3)',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={e => (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.4)'}
                        onMouseOut={e => (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.2)'}
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--foreground-muted)',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        display: 'flex',
                        transition: 'color 0.2s'
                      }}
                      onMouseOver={e => (e.currentTarget as HTMLElement).style.color = '#f43f5e'}
                      onMouseOut={e => (e.currentTarget as HTMLElement).style.color = 'var(--foreground-muted)'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>

          {/* Order Summary */}
          <FadeIn delay={0.3}>
            <div className="glass-morphism" style={{
              borderRadius: '2rem',
              padding: '2rem',
              border: '1px solid rgba(255,255,255,0.08)',
              position: 'sticky',
              top: '100px'
            }}>
              <h2 className="title-font" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                ملخص الطلب
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--foreground-muted)' }}>{item.name} × {item.quantity}</span>
                    <span style={{ fontWeight: 700 }}>{(item.price * item.quantity).toLocaleString()} د.ج</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="title-font" style={{ fontSize: '1.1rem', fontWeight: 700 }}>المجموع</span>
                  <span className="title-font gradient-text" style={{ fontSize: '1.6rem', fontWeight: 900 }}>
                    {totalPrice.toLocaleString()} د.ج
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '1.25rem',
                  textDecoration: 'none',
                  fontSize: '1.05rem',
                  fontWeight: 700
                }}
              >
                إتمام الشراء
                <ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} />
              </Link>

              <Link
                href="/products"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  marginTop: '1rem',
                  color: 'var(--foreground-muted)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  transition: 'color 0.2s'
                }}
                onMouseOver={e => (e.currentTarget as HTMLElement).style.color = 'white'}
                onMouseOut={e => (e.currentTarget as HTMLElement).style.color = 'var(--foreground-muted)'}
              >
                ← مواصلة التسوق
              </Link>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
