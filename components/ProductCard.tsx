'use client';
import { useTranslations, useFormatter } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  slug: string;
  currency: string;
  addToCartLabel: string;
}

export default function ProductCard({ name, description, price, slug, currency, addToCartLabel }: ProductCardProps) {
  const format = useFormatter();

  return (
    <div className="glass-morphism" style={{ 
      padding: '1.5rem', 
      borderRadius: 'var(--card-radius)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer'
    }} 
    onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(-10px)'}
    onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
    >
      <div>
        <div style={{ 
          height: 180, 
          background: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)', 
          borderRadius: '1rem', 
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid var(--glass-border)'
        }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'radial-gradient(circle at center, var(--primary) 0%, transparent 70%)' }} />
          <span className="title-font" style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 800 }}>{name}</span>
        </div>
        <h3 className="title-font" style={{ fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: 700 }}>{name}</h3>
        <p style={{ color: 'var(--foreground-muted)', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
          {description}
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <span className="title-font" style={{ fontWeight: 800, fontSize: '1.3rem', color: '#fff' }}>
          {format.number(price)} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--foreground-muted)' }}>{currency}</span>
        </span>
        <button className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem', borderRadius: '0.75rem' }}>
          {addToCartLabel}
        </button>
      </div>
    </div>
  );
}
